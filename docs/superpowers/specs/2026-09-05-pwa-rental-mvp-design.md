# TRSAT PWA 租屋收件匣 MVP：設計規格（PRD v2 精簡版 + UIUX + 擷取架構）

**日期**：2026-09-05
**狀態**：v0.3，使用者已於 2026-09-05 審閱通過，進入實作計畫
**變更紀錄**：v0.2（2026-09-05）依使用者回饋改為 A+B 混合方案，並以「個人 Profile」定義排程抓取範圍與驗收標準；v0.3（2026-09-05）D7 決議排程抓取預設在 GitHub Actions cron 執行，輸出至私有資料 repo（新增 4.3 節）
**分支**：`claude/pwa-rental-crawler-mvp-j6dyt4`
**取代**：`docs/00_Project_Blueprints/PRD_Master.md` 中所有企業級需求（微服務、PostgreSQL + MongoDB、1000 併發、三年歷史資料、JWT/RBAC）。該文件保留為歷史參考，不再作為開發依據。
**依據**：`docs/superpowers/research/2026-09-05-rental-source-ingestion-research.md`（資料來源可行性調查）、`docs/_Archive/Christian Wu's個人租屋需求.MD`（使用者實際需求）、`docs/00_Project_Blueprints/資料庫欄位.md`（欄位優先順序）

---

## 0. 一頁摘要

本專案重新定位為**單人使用、私有部署、local-first 的租屋收件匣（Rental Inbox）PWA**，搭配一支在使用者自己電腦上執行的 `trsat` CLI。CLI 有兩種工作模式：(1) **排程抓取**（`trsat watch`）：只針對無需登入的 591 與 PTT，搜尋範圍完全由使用者的個人 Profile 決定，預設由 GitHub Actions cron 在私有資料 repo 中執行；(2) **單筆補抓**（`trsat fetch`）：處理由手機分享進來、需要瀏覽器或登入 session 的 Threads / Facebook 連結。

兩條進料路徑匯入同一個收件匣：**（主動）排程抓取依 Profile 自動找出符合條件的 591 / PTT 房源 → 進入收件匣；（被動）在任何 App 看到房源 → 分享／貼上 → PWA 立即以本地規則解析並分級**。之後皆進入房源清單追蹤看房狀態，需要完整資料時由 CLI 補抓。

三個關鍵設計決策：

1. **登入資訊永不離開使用者裝置**。Facebook / Threads 搜尋等需登入的擷取，只在使用者電腦上以 Playwright persistent browser profile 執行；PWA 與任何雲端元件都不接觸 cookie。
2. **漸進式擷取（progressive ingestion）**。PWA 離線也能靠 URL 與貼上文字得到「可用的」房源卡片；CLI 或可選的 fetch endpoint 只負責「補完」。沒有 CLI 時產品仍可操作。
3. **確定性硬規則優先於 AI 評分**。以使用者的預算、必備設備、寵物、捷運距離、謝絕條件為第一層分級（符合／待確認／不符）；AI 摘要與軟評分列為 Phase 3。
4. **個人 Profile 同時是抓取範圍與驗收標準**。排程抓取的搜尋參數由 Profile 產生，不抓全市資料；MVP 是否合格，以「抓回來的房源經規則引擎判定後，與使用者人工判讀一致」為準（第 2.3、6.5、11 節）。

MVP 交付範圍為 Phase 0 到 Phase 2（見第 9 節），預估 5 到 7 個工作天。

---

## 1. 問題陳述與現況

### 1.1 現有 PRD 的矛盾
`PRD_Master.md` 前半段將產品定位為「個人工具、本地存儲、無需註冊」，後半段卻要求微服務架構、雙資料庫、1000 併發、3 年歷史資料與 RBAC。兩者不可能在同一 MVP 中成立，且後者與「個資法 §51 個人活動豁免」的前提（資料庫不得公開）直接衝突。本規格採前者。

### 1.2 現有程式碼狀態
- 約 7000 行 Node.js：兩套 591 爬蟲（Puppeteer / Axios+Cheerio）、Notion 同步、MCP server、監控服務。需三個常駐 process 才能運作。
- `public/index.html` 引用不存在的 `assets/js/app.js` 與 CSS；Service Worker 快取清單指向 CDN 與不存在路徑。PWA 外殼實際無法安裝或離線使用。
- 測試檔為佈局用的 `expect(true).toBe(true)`，無有效測試。
- 已被 git 追蹤的 `.mcp.json`、`.env.example`、`config/.claude_project_config.json` 及多份 docs 含 GitHub PAT、Figma token、Notion、Firecrawl、21st.dev Magic 金鑰實值。

### 1.3 使用者實際需求（來自個人需求文件）
| 項目 | 條件 |
|---|---|
| 房型 | 獨立套房（空屋佳）或合租套房／大雅房 |
| 預算 | 雅房約 NT$10,000；套房約 NT$15,000 |
| 人數／寵物 | 1 人、2 隻貓（必須允養寵物） |
| 地點 | 台北市、新北市；步行至捷運 15 分鐘內 |
| 必備 | 變頻冷氣、冰箱、對外窗、洗衣機 |
| 謝絕 | 無對外窗、壁癌、糟糕浴室、壁紙、隔音差 |
| 加分 | 露台、乾淨整潔、可自繳水電 |

此清單直接轉為第 6 節的硬規則引擎預設值，並可在 PWA「設定」中修改。

---

## 2. 目標、非目標、成功指標

### 2.1 目標
- G1：從「看到房源」到「房源出現在清單並完成分級」在手機上 10 秒內完成，且不需要後端在線。
- G2：支援 591、Threads、Facebook（Groups / Marketplace）、PTT Rent_apart 四類來源的 URL 或貼文文字輸入。
- G3：需登入的來源以使用者自己電腦上的 CLI 擷取，cookie / session 不上傳、不同步、不寫入 repo。
- G4：資料 100% 存於裝置（IndexedDB），可一鍵匯出／匯入 JSON；無帳號系統。
- G5：核心邏輯（解析、分級、去重）有自動化測試，CI 綠燈後自動部署 PWA 至 GitHub Pages。

### 2.2 非目標（明確排除於 MVP）
- 市場趨勢分析、租金預測、熱力圖、推薦引擎。
- 多使用者、雲端同步、帳號登入。
- 對外公開的房源資料庫或 API（違反個資法 §51 豁免前提）。
- 自動化 Facebook / Threads 關鍵字搜尋（封號風險高，改為手動分享或 Apify 付費 actor，列 Phase 3）。
- 繼續維護 Notion 同步與 MCP server（保留為 legacy，不納入新 CI）。

### 2.3 成功指標（MVP 驗收）
| 指標 | 目標 |
|---|---|
| Share-to-app 至卡片出現 | ≤ 3 秒（無網路） |
| 591 URL 純前端解析成功率 | 100%（URL 必含 ID） |
| 貼文文字租金／區／房型 regex 抽取命中率 | ≥ 80%（以 30 筆真實貼文 fixture 驗證） |
| 硬規則分級與人工判讀一致率 | ≥ 90%（同 fixture） |
| Lighthouse PWA 安裝條件 | 全數通過 |
| 核心套件測試覆蓋 | parsers / rules / dedupe 各有 fixture 測試 |
| Profile 驅動排程抓取（591）單輪 | 回傳 ≥ 20 筆，其中 ≥ 70% 經規則引擎判為「符合」或「待確認」；0 筆超出 Profile 城市範圍 |
| Profile 驅動排程抓取（PTT）單輪 | 近 5 頁中所有標題符合 Profile 地區與房型的貼文皆被擷取（以人工標註 fixture 對照，召回率 ≥ 90%） |
| 排程抓取結果與人工判讀 | 抽樣 30 筆，分級一致率 ≥ 90%（此即使用者所指「以個人需求為測試標準」） |

---

## 3. 方案比較與決策

| 方案 | 概要 | 優勢 | 風險／成本 | 決策 |
|---|---|---|---|---|
| **A. Local-first PWA + 本機 CLI（採用）** | PWA 靜態部署於 GitHub Pages，資料存 IndexedDB；需瀏覽器或登入的擷取由使用者電腦上的 `trsat` CLI 完成，結果以 JSON 匯入或經使用者自架的 fetch endpoint 回傳 | session 不離開裝置、零主機費、離線可用、最快可操作、符合個資法私有前提 | 手機與電腦兩個執行環境；補抓需電腦開機 | **採用（基礎）** |
| B. 雲端排程爬蟲服務 | VPS 排程 Playwright + 持久 session，PWA 讀雲端 API | 全自動、純手機操作 | 社群帳號 cookie 上雲，checkpoint / 封號風險最高；資料中心 IP 被 Meta 與 591 標記；主機與維運成本；公開端點需自建認證 | **部分採用（B-lite）**：只保留「排程自動抓取」這個特性，且限制為 (a) 無需登入的 591 與 PTT、(b) 搜尋範圍由 Profile 決定、(c) 預設由 GitHub Actions cron 執行，結果只寫入私有資料 repo（D7 已決議）；本機 launchd 為備援。FB / Threads 的排程搜尋仍不採用 |
| C. 延續 Notion + MCP 架構 | Notion 為資料庫，三個 Node 服務並行 | 重用既有程式碼 | 三個常駐 process、Notion API 限速、與離線 PWA 目標衝突、現有 PWA 外殼本身不可用 | 不採用；程式碼保留為 legacy |

**採用 A+B（B-lite）的理由**：A 在第一天就能交付可安裝、可離線、可分享進來的 PWA，登入相關風險被隔離在使用者可控的本機環境。B 的「自動化」價值在 591 與 PTT 上可以零風險取得（兩者皆不需登入、資料結構化、規則明確），因此以 `trsat watch` 排程納入；B 的高風險部分（社群帳號 cookie 上雲、全市大量抓取）則排除。把抓取範圍鎖定在 Profile 有三個效果：抓取量小到不會觸發 591 假資料機制、資料庫內容天然就是「候選名單」、以及 MVP 有一個可客觀驗收的標準。

**資料存放前提**：本 repo 為 public。排程抓取結果含房東電話等個資，**不得寫入本 repo 或任何公開位置**。雲端排程一律在另一個**私有** repo（下稱 `trsat-data`）中執行並提交結果；本機執行則寫入 `~/.trsat/data/trsat.sqlite`。Actions log 不得輸出任何 listing 內容，只輸出筆數與狀態。

---

## 4. 系統架構

```
┌──────────────────────────── 使用者手機 ────────────────────────────┐
│  任何 App（591 / Threads / FB / PTT 瀏覽器）                          │
│      └─ 系統分享選單 ─► TRSAT PWA (share_target)                      │
│                            │                                          │
│  TRSAT PWA (apps/pwa, GitHub Pages, HTTPS)                            │
│   ├─ Inbox：接收 URL / 文字 → core.parse → core.rules → 暫存         │
│   ├─ Listings / Detail / Compare / Settings                           │
│   ├─ IndexedDB (Dexie)：listings, inbox, profile, syncLog             │
│   ├─ Service Worker (Workbox)：app shell 預快取、圖片 runtime cache   │
│   └─ 可選：Settings 內設定 fetch endpoint URL（HTTPS）                │
└──────────────────────────────┬────────────────────────────────────────┘
                               │ 手動：匯出 / 匯入 JSON（AirDrop、雲碟）
                               │ 可選：HTTPS（Tailscale Funnel / Cloudflare Tunnel）
┌──────────────────────────────▼──── 使用者電腦 ────────────────────────┐
│  trsat CLI (packages/cli, Node 22 + Playwright)                       │
│   ├─ trsat fetch <url>        單筆補抓（591 / Threads / FB / PTT）     │
│   ├─ trsat search 591 --profile 依個人條件抓 591 列表 + 詳情           │
│   ├─ trsat watch              依 Profile 排程抓 591 + PTT（launchd/cron）│
│   ├─ trsat ptt                抓 Rent_apart 近 N 頁                    │
│   ├─ trsat login <fb|threads> 開啟 headed 瀏覽器由使用者手動登入        │
│   ├─ trsat sessions status    檢查 session 是否仍有效                  │
│   ├─ trsat export / import    與 PWA 交換 listings JSON                │
│   └─ trsat serve              本機 HTTP：/api/fetch、/api/listings      │
│  ~/.trsat/profiles/<source>/  Playwright persistent context（0700）    │
│  ~/.trsat/data/trsat.sqlite   CLI 端 listings + raw payload            │
└───────────────────────────────────────────────────────────────────────┘
                 packages/core（TypeScript，PWA 與 CLI 共用）
                 schema.ts / parsers/*.ts / rules.ts / dedupe.ts / normalize.ts
```

### 4.1 Monorepo 結構（npm workspaces）
```
apps/pwa/           Vite + Preact + TypeScript + Tailwind + Dexie + vite-plugin-pwa
packages/core/      純 TypeScript，零 DOM / 零 Node 依賴；PWA 與 CLI 共用
packages/cli/       Node 22 + TypeScript + Playwright + commander + better-sqlite3
legacy/             （Phase 0 不搬動；僅在 README 標示 src/ 為 legacy，不進新 CI）
docs/superpowers/   specs / research / plans
```

### 4.2 各單元職責與介面

| 單元 | 做什麼 | 對外介面 | 依賴 |
|---|---|---|---|
| `core/schema` | `Listing`、`InboxItem`、`Profile`、`RuleResult` 型別與 zod schema | `ListingSchema.parse()`、型別匯出 | zod |
| `core/parsers` | 每來源一個 parser：`detectSource(url\|text)`、`parseUrl()`、`parseText()`、`parseFetched(raw)` | `parse(input): Partial<Listing> & {confidence}` | schema |
| `core/rules` | 硬規則分級 + 軟評分 | `evaluate(listing, profile): RuleResult` | schema |
| `core/dedupe` | 電話正規化、(rent, district, area) 近似比對、pHash 比對（pHash 由 CLI 計算後帶入） | `findDuplicates(listing, all): string[]` | schema |
| `pwa/db` | Dexie 表定義、migration、匯出／匯入 | `db.listings`, `exportAll()`, `importAll()` | Dexie, core |
| `pwa/inbox` | share_target 接收、貼上、URL 解析、待確認卡片 | 路由 `#/share`、`#/inbox` | core, db |
| `pwa/listings` | 清單、篩選、排序、詳情、狀態流程、比較 | 路由 `#/`, `#/l/:id`, `#/compare` | db, core |
| `pwa/settings` | Profile 編輯、fetch endpoint、匯出匯入、清除資料 | 路由 `#/settings` | db |
| `pwa/fetcher` | 若設定 endpoint，呼叫 `POST /api/fetch` 補抓；否則標記「待電腦補抓」 | `enrich(listingId)` | fetch |
| `cli/sources/*` | 每來源一個 fetcher：591 bff API、Threads hidden JSON、FB persistent profile、PTT HTML | `fetchOne(url)`, `search(profile)` | Playwright, undici, core |
| `cli/sessions` | persistent context 建立、有效性檢查、login wall 偵測 | `openContext(source)`, `status()` | Playwright |
| `cli/store` | SQLite listings + raw payload；匯出 PWA 相容 JSON | `upsert()`, `export()` | better-sqlite3, core |
| `cli/watch` | 讀取 Profile → `core/profileQuery` 產生各來源搜尋參數 → 依序執行 591 search 與 PTT 批次 → upsert → 寫入 run log；單執行緒、隨機延遲、每輪上限 | `trsat watch --once`、`trsat watch --install-launchd` | sources, store, core |
| `core/profileQuery` | 把 Profile 轉成各來源的搜尋參數與後過濾條件（見 6.5） | `toQuery591(profile)`, `toFilterPtt(profile)` | schema |
| `cli/serve` | 本機 HTTP server，只綁 127.0.0.1 或 Tailscale 介面 | `POST /api/fetch`, `GET /api/listings?since=` | fastify 或 node:http |

**邊界檢查**：`core` 不得 import DOM、Node、Playwright；PWA 不得知道 cookie 或 profile 目錄存在；CLI 不得寫入 PWA 儲存空間（只透過 JSON 或 HTTP 交換）。

### 4.3 雲端排程 runner（GitHub Actions cron，D7 決議）

```
私有 repo：<owner>/trsat-data
├── .github/workflows/watch.yml   cron: 每 60 分鐘（Actions cron 最小 5 分，實際延遲常達數分鐘至數十分鐘）
│     steps: checkout 本 repo 指定 tag → npm ci → node packages/cli watch --once --profile profile.json --out data/
│            → git commit data/ （若有變更）→ push
├── profile.json                  個人 Profile（與 PWA Settings 匯出格式相同）
└── data/
    ├── listings.json             PWA 匯入格式；全量快照（≤ 數百筆）
    ├── runs.jsonl                每輪筆數、耗時、suspect 數、錯誤碼；不含 listing 內容
    └── raw/<source>/<id>.json    原始回應，供重新解析（可選，預設關閉以控制 repo 體積）
```

**PWA 端串接**：Settings 新增「雲端資料來源」：輸入 `owner/repo`、`branch`、fine-grained PAT（權限只給該 repo 的 `Contents: read`）。PWA 以 `GET https://api.github.com/repos/{owner}/{repo}/contents/data/listings.json`（`Accept: application/vnd.github.raw+json`）取得快照，依 `updatedAt` 合併進 IndexedDB；PAT 只存於裝置 IndexedDB，不進 URL、不進 log。手動「立即同步」與開啟 App 時自動同步各一。

**風險與對策**
| 風險 | 對策 |
|---|---|
| Actions runner 為資料中心 IP，591 可能回假資料或 Cloudflare 挑戰 | 每輪極低量（Profile 範圍內、≤ 90 筆／組合）、2–4 秒隨機延遲、同 ID 雙抓比對標 `suspect`；連續兩輪 suspect 比例 > 30% 時 workflow 標 failure 並停用 cron，改用本機 `trsat watch --install-launchd` 備援 |
| 私有 repo 體積成長 | `listings.json` 為全量快照覆寫；`raw/` 預設關閉；`runs.jsonl` 每月輪替 |
| PAT 外洩 | fine-grained、單 repo、只讀、90 天到期；Settings 提供「撤銷說明」連結 |
| 個資 | `trsat-data` 必須 private；workflow 首步驟檢查 `github.event.repository.private == true`，否則直接失敗 |
| PWA 在 GitHub Pages 呼叫 api.github.com | GitHub API 允許 CORS，無需 proxy |

PTT 不受資料中心 IP 影響。Threads / FB 不在雲端 runner 執行。

---

## 5. 資料來源與擷取工具矩陣

依調查報告整理。「PWA 端能得到什麼」欄指沒有 CLI 時的離線降級能力。

| 來源 | 輸入方式 | PWA 端能得到什麼（離線） | CLI 補抓工具 | 需登入 | 維護風險 | Phase |
|---|---|---|---|---|---|---|
| **591** rent.591.com.tw | 分享 URL | source_id、URL；若分享附帶標題文字則含租金／區 | `undici` 直打 `bff-house.591.com.tw/v3/web/rent/list` 與詳情 API（需首頁 `X-CSRF-TOKEN` + `T591_TOKEN` cookie）；被擋時退回 Playwright headed | 否 | 中：>1 req/s 會回**隨機假資料**；需 2–4 秒隨機延遲 + 雙抓比對 | 1（URL）／2（CLI） |
| **Threads** threads.com | 分享 URL 或複製貼文全文 | 貼文文字 regex 抽取：租金、區、房型、坪數、捷運站、電話 | Playwright **匿名** context 抓單篇頁面內嵌 JSON（`/@user/post/<id>`） | 單篇否；關鍵字搜尋是（MVP 不做搜尋） | 中：GraphQL doc_id 輪替、匿名約 5 篇後 login wall | 1（文字）／2（CLI 單篇） |
| **FB Groups** | 分享 URL 或複製貼文全文 | 同 Threads（文字 regex） | Playwright **persistent profile**（分身帳號、headed、住宅網路、每日上限 30 次）抓單篇 | 是 | 高：DOM / doc_id 頻繁變動、checkpoint | 1（文字）／2（CLI 單篇） |
| **FB Marketplace** | 分享 URL | URL、item id | 同 FB Groups；解析半結構化欄位（title、price、location、posted_at） | 是 | 高 | 2（CLI 單篇） |
| **PTT Rent_apart** | 分享 URL 或複製 | 標題 `[性別/地區/地點]` regex + 內文置底範本 | `undici` + `over18=1` cookie 抓 HTML；`trsat ptt` 批次抓近 N 頁 | 否 | 低 | 1（文字）／2（CLI 批次） |
| 樂屋／信義／好房／台灣租屋網 | 分享 URL | URL 保留 | 未實作；可套 g0v `scrapy-tw-rental-house` 或 Firecrawl | 否 | 低–中（未驗證） | 3 |
| Apify actors（Threads keyword、FB groups、FB marketplace） | webhook → CLI import | 不適用 | Apify webhook 匯入 normalizer | 否（付費） | 低（外包維護） | 3 |
| LINE 找房 bot | 不作為來源 | — | — | — | — | 排除 |

**AI 抽取 fallback**：regex 命中率不足時，Phase 3 加入 LLM JSON extraction（固定 schema），由 CLI 執行以避免在瀏覽器暴露 API key。

---

## 6. 資料模型與規則引擎

### 6.1 `Listing`（PWA 與 CLI 共用，IndexedDB 表 `listings`）
以 `資料庫欄位.md` 的前三優先級為主，35 欄精簡為 MVP 必要欄位；未列欄位以 `extra: Record<string, string>` 保留。

```ts
type Source = '591' | 'threads' | 'fb_group' | 'fb_marketplace' | 'ptt' | 'manual' | 'other';
type RoomType = '套房' | '雅房' | '整層' | '分租' | '未知';
type Status = 'inbox' | 'shortlist' | 'contacted' | 'viewing' | 'viewed' | 'rejected' | 'signed';

interface Listing {
  id: string;                 // `${source}:${sourceId}`；manual 用 ulid
  source: Source; sourceId: string; url?: string;
  title: string;
  rent?: number; depositMonths?: number; managementFee?: number; utilitiesNote?: string;
  roomType: RoomType; layout?: string;      // "1房1廳1衛"
  areaPing?: number; floor?: string;         // "3F/5F"
  city?: '台北市' | '新北市' | string; district?: string; address?: string;
  mrtNearest?: string; mrtWalkMin?: number;
  equipment: string[];                       // 正規化詞彙：變頻冷氣、冰箱、洗衣機、對外窗…
  petPolicy?: 'allowed' | 'not_allowed' | 'negotiable' | 'unknown';
  availableFrom?: string;                    // ISO date
  photos: string[]; photoHashes?: string[];  // pHash 由 CLI 計算
  contactRaw?: string; phoneNormalized?: string;
  rawText?: string;
  postedAt?: string; fetchedAt: string; updatedAt: string;
  extraction: { method: 'url' | 'text_regex' | 'cli_fetch' | 'manual' | 'llm'; confidence: number; missing: string[] };
  enrichment: 'none' | 'pending' | 'done' | 'failed';
  status: Status; statusHistory: { status: Status; at: string }[];
  notes?: string; pinned: boolean;
  rule?: RuleResult;                         // 每次 profile 變更後重算
  dedupeGroupId?: string;
  extra: Record<string, string>;
}
```

其他表：`inbox`（尚未確認加入的 share 項目，含原始 `title/text/url`）、`profile`（單筆）、`syncLog`（匯入匯出與 endpoint 呼叫紀錄）。

### 6.2 `Profile`（使用者條件，Settings 可編輯）
```ts
interface Profile {
  budget: { 套房: number; 雅房: number; 整層?: number; 分租?: number };  // 上限，預設 15000 / 10000
  budgetTolerance: number;          // 預設 1000
  cities: string[];                 // 預設 ['台北市','新北市']
  mrtWalkMaxMin: number;            // 預設 15
  mustHave: string[];               // 預設 ['變頻冷氣','冰箱','對外窗','洗衣機']
  pets: { required: boolean; note: string };   // 預設 required: true, '2 隻貓'
  dealBreakerKeywords: string[];    // 預設 ['壁癌','無對外窗','壁紙','隔音差','不可養寵物','禁寵','限女','限男']
  bonusKeywords: string[];          // 預設 ['露台','陽台','可自繳','電梯','新裝潢']
  moveInBefore?: string;
}
```

### 6.3 硬規則引擎（`core/rules.evaluate`）
輸出三級分級與可解釋的原因清單，供卡片與詳情頁直接呈現。

| 規則 | 判定 | 結果 |
|---|---|---|
| 租金 > budget[roomType] + tolerance | 有租金且超標 | `fail: 超出預算` |
| 寵物 | `petPolicy === 'not_allowed'` 或文字含禁寵關鍵字 | `fail: 不可養寵物` |
| 謝絕關鍵字 | rawText / title 命中 | `fail: 含「壁癌」` |
| 城市 | district 對應到非允許城市 | `fail: 地點不在範圍` |
| 捷運距離 | `mrtWalkMin > max` | `fail: 捷運步行 20 分` |
| 必備設備 | equipment 缺少任一 mustHave 且 rawText 也未提及 | `unknown: 未提及洗衣機`（不判死） |
| 資料不足 | 租金或房型缺失 | `unknown: 缺租金` |

分級：任一 `fail` → **不符**；無 `fail` 且有 `unknown` → **待確認**；皆無 → **符合**。
軟評分（0–100，僅排序用）：預算餘裕 30、必備設備覆蓋 30、捷運距離 20、加分關鍵字 10、資料完整度 10。

### 6.4 去重（`core/dedupe`）
依序：`phoneNormalized` 相同 → 同群；`photoHashes` 任一漢明距離 ≤ 6 → 同群；`|rent 差| ≤ 500 且 district 相同且 |areaPing 差| ≤ 1` → 標「疑似重複」但不自動合併。同群者在清單以「+N 同房源」摺疊顯示，使用者可拆分。

### 6.5 Profile 驅動的抓取範圍（`core/profileQuery`）
排程抓取不抓全市資料，而是把 Profile 翻譯成各來源的查詢參數，再以規則引擎做後過濾。此對應表同時是驗收測試的 fixture 依據。

| Profile 欄位 | 591 查詢參數（bff list API） | PTT Rent_apart 後過濾 |
|---|---|---|
| `cities` 台北市／新北市 | `region=1`（台北）與 `region=3`（新北）各跑一輪 | 標題 `[地區]` 兩字對應台北 12 區與新北常見區名詞典 |
| `budget.套房` 15000、`budget.雅房` 10000 | `kind=2`（獨立套房）`rentprice=0,15000`；`kind=4`（雅房）`rentprice=0,10000`；`kind=3`（分租套房）沿用套房預算 | 內文租金 regex ≤ 對應房型預算 + tolerance |
| `pets.required` | 加 `other=pet`（591 可養寵物選項） | 內文含「可養寵物／可養貓」加分；含禁寵關鍵字 → 排除 |
| `mrtWalkMaxMin` 15 | 不在查詢層過濾（591 捷運參數需站點 ID）；於後過濾以 `mrtWalkMin` 判定 | 內文「捷運…分」regex |
| `mustHave` | 不在查詢層過濾；後過濾標「待確認」 | 同左 |
| `dealBreakerKeywords` | 後過濾 → 不符 | 同左 |
| `moveInBefore` | 後過濾 `availableFrom` | 同左 |

591 參數代碼以實作時實測為準（`region`、`kind`、`other` 的值在既有開源專案間一致，但需在 Phase 2 第一天以真實回應確認並寫入 fixture）。每輪上限：591 每 region × kind 組合最多 3 頁（約 90 筆）、PTT 最多 5 頁；輪與輪之間至少 30 分鐘。

---

## 7. PWA UIUX 規格

### 7.1 設計原則
- **收件匣心智模型**：像 email 一樣，所有東西先進 Inbox，使用者只做「加入／略過」兩個決定，不在分享當下填表。
- **三色分級即資訊架構**：符合（綠）、待確認（琥珀）、不符（灰，預設摺疊），任何清單都以此排序。
- **單手操作**：底部 Tab、44px 觸控目標、主要動作放在拇指區、卡片支援左右滑動（左滑略過、右滑加入）。
- **離線即正常狀態**：無網路時不顯示錯誤，只在需要補抓的欄位顯示「待電腦補抓」標籤。
- **視覺**：Noto Sans TC；單一主色（沿用現有 `#3b82f6`），語意色只用於分級與狀態；支援 `prefers-color-scheme: dark`；`env(safe-area-inset-*)` 處理 iPhone 底部。

### 7.2 資訊架構（底部 4 Tab）
```
[收件匣 Inbox]  [房源 Listings]  [比較 Compare]  [設定 Settings]
```
Inbox 有未處理數量 badge。首次開啟顯示 3 步 onboarding：安裝到主畫面 → 確認個人條件 → 試分享一筆。

### 7.3 畫面規格

**S1 Share 接收頁（`#/share`，由 manifest `share_target` GET 導入 app 根路徑後轉入）**
- 讀取 `title`、`text`、`url` query；Android 常把 URL 放在 `text`，需以 regex 從 `text` 抽出第一個 URL。
- 立即呼叫 `core.parse` 並顯示**預覽卡**：來源 icon、解析到的租金／區／房型、分級色帶、缺少欄位清單。
- 主要動作：`加入房源`（進 listings，status = shortlist）。次要：`先放收件匣`、`略過`。
- 若 endpoint 已設定且在線，背景送出 enrich；否則 `enrichment = 'pending'`。
- 無網路時全部動作仍可完成（純本地）。

**S2 收件匣（`/inbox`）**
- 卡片流：每張含預覽卡 + 左右滑動手勢。空狀態說明「從 591 / Threads / FB 分享到此 App」並附「貼上文字或連結」按鈕。
- 頂部「貼上」入口：多行 textarea，貼上後即時顯示解析結果，可修正租金／區／房型再加入。

**S3 房源清單（`/`）**
- 篩選 chips（水平捲動）：狀態、分級、區、房型、來源、含待補抓。排序：分級 → 軟評分 → 租金 → 更新時間。
- 卡片（三行）：第一行租金（大字）+ 分級色點 + 來源 icon；第二行 區 · 房型 · 坪數 · 捷運步行；第三行 前三個設備 tag 或缺少的必備設備（紅字）。右上角狀態 chip。
- 重複群組摺疊顯示「+2 同房源」。
- 不符預設收合在底部「不符 (N)」區塊。

**S4 房源詳情（`/l/:id`，全螢幕 sheet）**
- 照片輪播（無照片顯示來源色塊）。
- 關鍵資訊格（2 欄）：租金、押金、管理費、房型、坪數、樓層、區／地址、捷運、入住日。缺值顯示「—」並可點擊手動填寫。
- **條件檢核清單**：逐條顯示規則結果（✓ / ? / ✗ + 原因），此區是本產品的核心差異。
- 狀態 stepper：inbox → shortlist → contacted → viewing → viewed → rejected / signed；點選即記錄時間。
- 動作列（固定底部）：開原文、地圖（以 address 或 district 組 Google Maps URL）、複製聯絡方式、加入比較、備註。
- 「補抓」按鈕：有 endpoint 時直接抓；無 endpoint 時顯示可複製的 `trsat fetch <url>` 指令。
- 原文全文可展開（rawText）。

**S5 比較（`/compare`）**
- 最多 3 筆，橫向捲動欄；列為條件檢核項目 + 關鍵資訊。不同值以底色標示。

**S6 設定（`/settings`）**
- 個人條件表單（對應 Profile），儲存後背景重算所有 listing 的 `rule`。
- 補抓 endpoint：URL 輸入 + 測試連線；說明需 HTTPS（Tailscale Funnel / Cloudflare Tunnel）。
- 資料：匯出 JSON、匯入 JSON（合併，以 `updatedAt` 新者優先）、清除所有資料（二次確認）。
- 關於：版本、SW 更新提示。

### 7.4 PWA 技術需求
- `manifest.webmanifest`：`display: standalone`、`share_target: { action: './', method: 'GET', params: { title, text, url } }`（action 指向 app 根路徑，app 啟動時偵測 query 含 `title/text/url` 即進入 S1；不可用 `/share` 子路徑，因 Pages 無 fallback）、shortcuts（收件匣、貼上）、maskable icons 192/512。
- Service Worker（Workbox via vite-plugin-pwa）：app shell precache；圖片 `CacheFirst` 30 天；不快取 endpoint API。更新採 `registerType: 'prompt'` 顯示「有新版本」toast。
- iOS 限制：Safari 不支援 `share_target`，以「複製 → 開 App → 自動偵測剪貼簿貼上按鈕」補償（不主動讀剪貼簿，僅提供「貼上」按鈕呼叫 `navigator.clipboard.readText()`）；並在 onboarding 提供「iOS 捷徑」教學連結（Phase 3 提供捷徑檔）。
- 儲存：IndexedDB 透過 Dexie；請求 `navigator.storage.persist()`。
- 部署：GitHub Pages，`base` 設為 repo 路徑；路由一律使用 hash router（GitHub Pages 無 SPA fallback）。

---

## 8. 登入資訊與 Session 處理規範（CLI）

此節為安全邊界，實作時不得放寬。

1. **不收帳密**：`trsat login fb|threads` 只開啟 headed Chromium persistent context（`~/.trsat/profiles/<source>/`），由使用者在真實瀏覽器視窗手動登入（含 2FA）。CLI 不讀、不寫、不記錄密碼欄位。
2. **儲存位置與權限**：profile 目錄 `0700`，檔案 `0600`；`~/.trsat/` 不在 repo 內；repo `.gitignore` 加入 `.trsat/`、`storageState*.json`、`*.cookies.json`、`profiles/`。
3. **不出裝置**：cookie、storageState、profile 不匯出、不含在 `trsat export`、不經 `trsat serve` 回傳。`serve` 只綁 `127.0.0.1` 或使用者指定的 Tailscale 介面；回應只含 `Listing` 欄位。
4. **有效性檢查**：`trsat sessions status` 對每個 source 開頁檢查是否被導向登入頁（URL 含 `/login`、`checkpoint`、頁面含登入表單）；`fetch` 前自動檢查，失效時退出碼 3 並提示重新 `login`，不自動重試。
5. **風控友善預設**：FB 一律 headed、單執行緒、每次操作間 4–10 秒隨機延遲、每日上限 30 次（可調），建議使用分身帳號並在 README 明示風險；Threads 單篇一律匿名 context，不使用登入 profile。
6. **591 假資料防護**：同一 ID 連續兩次抓取關鍵欄位（rent、areaPing、title）不一致即標記 `suspect`，暫停 10 分鐘。
7. **不繞過驗證**：遇 CAPTCHA / checkpoint 一律停止並提示人工處理，不整合任何解題服務。
8. **金鑰治理（Phase 0）**：撤銷並輪替已外洩的 GitHub PAT、Figma、Notion、Firecrawl、Magic 金鑰；從 `.mcp.json`、`.env.example`、`config/.claude_project_config.json`、docs 移除實值改為佔位；新增 `gitleaks` pre-commit 與 CI 步驟。歷史 commit 中的金鑰視為已外洩，以撤銷為主，不做 history rewrite（單人 repo 可選擇性執行 `git filter-repo`，列為建議而非必要）。

---

## 9. 分期與範圍

| Phase | 內容 | 產出 | 估時 |
|---|---|---|---|
| **0. 清理與骨架** | 金鑰清除 + gitleaks；npm workspaces；`packages/core` schema + parser 骨架 + vitest；`apps/pwa` Vite + Preact + Tailwind + Dexie + vite-plugin-pwa 空殼可安裝；CI：test + build + Pages deploy | 可安裝的空 PWA、綠色 CI | 0.5–1 天 |
| **1. PWA 可操作 MVP** | share_target + 貼上；591/Threads/FB/PTT URL 與文字 parser（含 30 筆 fixture）；rules 引擎 + Profile 設定；Inbox / Listings / Detail / Compare；狀態流程；匯出匯入 | 手機可日常使用，無後端 | 2–3 天 |
| **2. CLI 補抓 + Profile 排程抓取** | `trsat` 指令集；`core/profileQuery`；591 bff search（Profile 驅動）+ 詳情；PTT 批次；`trsat watch --once`；`trsat-data` 私有 repo 範本（workflow、profile.json、private 檢查）；PWA Settings 雲端資料來源 + PAT 同步；`--install-launchd`（macOS）備援；Threads 匿名單篇；FB persistent profile 單篇；sessions 管理；SQLite；`serve` + PWA endpoint 串接；pHash 去重；以真實 Profile 抓取結果建立 30 筆驗收 fixture | 每小時自動產生符合個人條件的候選名單並同步至手機；完整資料補完 | 4–5 天 |
| 3. 增強（本規格外） | LLM 抽取 fallback、AI 摘要與軟評分、Apify webhook、Telegram 推播、樂屋／信義／好房、iOS 捷徑檔、legacy `src/` 移除 | — | 另立 spec |

Phase 0–2 為本規格的實作計畫範圍。

---

## 10. 錯誤處理

| 情境 | 行為 |
|---|---|
| 分享進來但無法辨識來源 | 建立 `source: 'other'` listing，只保留 URL / 文字，分級「待確認」，提示手動補欄位 |
| 文字解析信心 < 0.5 | 預覽卡欄位以虛線框顯示，要求使用者確認後才可「加入」 |
| endpoint 不可達 | 靜默標記 `enrichment: 'pending'`，Settings 顯示最後成功時間；不彈錯誤 |
| 雲端同步失敗（PAT 失效 401、repo 不存在 404、rate limit 403） | Settings 顯示錯誤原因與上次成功時間；PAT 失效時提示重新產生；不清除既有資料 |
| 雲端 runner 連續 suspect 比例過高 | workflow 失敗並停用 cron；README 指引改用本機備援 |
| endpoint 回傳 login 失效（HTTP 401 + `code: SESSION_EXPIRED`） | 詳情頁顯示「電腦端需重新登入 FB」提示 |
| 591 假資料偵測 | listing 標 `suspect`，卡片顯示警示 icon，CLI log 記錄 |
| IndexedDB 寫入失敗／配額不足 | toast + 引導匯出備份 |
| 匯入 JSON schema 不符 | zod 錯誤逐筆列出，僅匯入合法筆 |
| SW 更新 | prompt toast，不自動 reload 以免打斷輸入 |

---

## 11. 測試策略

- **`packages/core`（vitest）**：每個 parser 對應 `fixtures/<source>/*.txt|json` 至少 8 筆真實去識別化樣本，斷言關鍵欄位與 confidence；rules 引擎以表驅動測試覆蓋每條規則與三級分級；dedupe 覆蓋電話格式變體與 pHash 距離邊界。
- **`apps/pwa`（vitest + @testing-library/preact，Playwright e2e smoke）**：`/?text=...` 導入 → 卡片出現 → 加入 → 清單可見；離線模式（Playwright `context.setOffline(true)`）下同流程成立；匯出再匯入資料一致。
- **`packages/cli`（vitest）**：fetcher 以錄製的 HTML / JSON fixture 測試解析；`profileQuery` 以表驅動測試確認 Profile → 查詢參數對應；sessions 的 login wall 偵測以 fixture 頁面測試；不在 CI 打真實網站。
- **驗收測試（手動，Phase 2 結尾）**：以使用者真實 Profile 執行 `trsat watch --once`，將結果匯入 PWA，抽樣 30 筆由使用者人工判讀，對照規則引擎分級，一致率 ≥ 90% 即通過；不一致案例回寫為 rules fixture。此為使用者指定的「以個人需求為測試標準」。
- **CI（GitHub Actions）**：`npm test` + `npm run build` + gitleaks；main 分支綠燈後部署 `apps/pwa/dist` 至 Pages。既有 `deploy.yml` 改寫為此流程。

---

## 12. 待使用者確認的決策

以下已採預設值並可直接開發；若使用者偏好不同，回覆後調整。使用者已於 2026-09-05 確認：採 A+B 混合、抓取範圍以個人需求為準並作為測試標準（第 0、2.3、3、6.5、9、11 節）；D7 選 GitHub Actions cron（第 4.3 節）；D1、D3–D6 採預設值；spec 整體通過。

| # | 決策 | 預設 | 替代 |
|---|---|---|---|
| D1 | 前端框架 | Preact + TypeScript（與 core 共用型別、體積小） | 沿用 Alpine.js（現有熟悉度，但無型別共用） |
| D2 | 手機 ↔ 電腦資料交換 | 手動 JSON 匯出匯入為必要；`trsat serve` + Tailscale Funnel 為可選 | 直接用 Telegram bot 當收件匣（需 bot token 與常駐） |
| D7 | 排程抓取執行位置 | **已決議：GitHub Actions cron**，於私有 repo `trsat-data` 執行並提交結果（4.3 節）；本機 launchd 為備援 | 使用者電腦 launchd / cron |
| D3 | FB 擷取帳號 | 建議分身帳號，README 明示風險 | 不做 FB CLI 擷取，只保留文字貼上 |
| D4 | 歷史金鑰 | 撤銷 + 從工作樹移除，不重寫 history | 同時執行 `git filter-repo` |
| D5 | legacy `src/` | Phase 0–2 不動，README 標示；Phase 3 移除 | Phase 0 直接搬到 `legacy/` |
| D6 | 城市範圍 | 台北市 + 新北市 | 僅台北市 |
