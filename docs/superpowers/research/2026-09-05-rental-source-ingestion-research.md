# 租屋來源盤點：Threads／Facebook／台灣主流平台的擷取可行性

**調查日期**：2026-09-05
**調查方式**：Claude Code sub-agent 網路調查（WebSearch / WebFetch / Firecrawl）
**用途**：作為 `docs/superpowers/specs/2026-09-05-pwa-rental-mvp-design.md` 第 5 節「資料來源與擷取工具矩陣」的依據

> 部分官方文件（developers.facebook.com、apify.com、scrapfly.io、ptt.cc）在調查環境被 egress proxy 封鎖，該處資訊以二手來源與搜尋摘要為準，已標註「未直接驗證」。

---

## 1. Threads（threads.net / threads.com）

### 1.1 存取方式
- **官方 Threads API**：有 Keyword Search endpoint（`GET /keyword_search`），需 `threads_basic` + `threads_keyword_search`。未過 App Review 前，搜尋只會回傳「自己（tester 帳號）發的貼文」；要搜公開貼文必須通過 App Review，且可能需 business verification（[Meta docs](https://developers.facebook.com/docs/threads/keyword-search/)、[開發者實測貼文](https://www.threads.com/@anujs3/post/DNG2tXiBjzN)）。額度為每使用者每滾動 7 天 500 次查詢（[SocialCrawl 整理](https://www.socialcrawl.dev/blog/threads-api)）。Long-lived token 60 天，需定期 refresh，逾期不可救（[picklog](https://picklog.cc/blog/threads-api-token-refresh)）。個人專案要過 App Review 幾乎不可行；**實務上官方 API 對「搜租屋貼文」無用**。
- **匿名 Web / hidden JSON / GraphQL**：公開 profile 與單篇貼文不登入即可看，且頁面內嵌 JSON；Playwright 攔 `/api/graphql` 也可取得 thread + replies（[Scrapfly 2026](https://scrapfly.io/blog/posts/how-to-scrape-threads)，未直接驗證）。但**關鍵字搜尋需要登入**，且匿名有「約 5 篇後上鎖」的部分 login wall（[StalkStory](https://stalkstory.com/blog/how-to-view-threads-anonymously.html)）。
- **第三方**：`dmytrostriletskyi/threads-net` 2023-09 收到 Meta 來函後封存；`Danie1/threads-api`（PyPI `threads-api`）也已 archived（最後 push 2023-10）。`m1guelpf/threads-re` 記錄了 web GraphQL 的 `doc_id`（僅需 `x-ig-app-id: 238260118697367`，不需登入），但 2023-07 後未更新，doc_id 大概率已 churn（[repo](https://github.com/m1guelpf/threads-re)）。Apify `futurizerush/meta-threads-scraper`（含 zh-TW 版）宣稱支援用戶／標籤／關鍵字、無需登入（[Apify](https://apify.com/futurizerush/meta-threads-scraper-zh-tw)，未直接驗證價格）。`ChenBingWei1201/threads_scraper`（PyPI `threads-scraper`）用 Selenium + 帳密登入做關鍵字搜尋，0 star，2024-12 最後更新。
- **RSS／alt frontend**：無穩定方案。
- **Share-to-app**：完全可行。貼文 permalink 為 `threads.com/@user/post/<id>`，單篇頁面匿名可讀，適合「手動分享 URL → 後端抓單篇」流程。

### 1.2 Auth
讀 profile／單篇不需登入；關鍵字搜尋需登入。用 Playwright `storageState` 保存 Instagram/Threads session 可重用數週，但自動化搜尋有觸發 checkpoint 風險（與 IG 同一風控體系）。

### 1.3 反爬
比 Facebook 輕（[Scrapfly](https://scrapfly.io/blog/posts/best-social-media-scraping-tools)），但 GraphQL `doc_id` 會輪替、匿名限額。維護負擔：中。

### 1.4 資料形狀
貼文純文字（價格、區域、房型全在文字中）、圖片 URL、作者、時間戳、permalink。無結構化欄位。

### 1.5 法律
Threads Terms 明文禁止 crawl/scrape（[terms.threads.com](https://terms.threads.com/terms-of-use)）；Meta 2025-01-01 起條款補上「不論登入或登出」皆禁止自動蒐集（[Social Media Today](https://www.socialmediatoday.com/news/metas-updating-terms-service-with-clarified-wording-around-misuse/732577/)）。個人非商用主要風險是帳號停權，非刑責。

### 1.6 MVP 建議
**手動搜尋 + share-to-app**（Web Share Target PWA 或貼 URL），後端用 Playwright 匿名抓單篇 hidden JSON。批次關鍵字監控建議付費用 Apify actor，不要用自己主帳號自動搜尋。

---

## 2. Facebook Groups + Marketplace

### 2.1 存取方式
- **官方 API**：Groups API 於 2024-04-22 全面移除（含 `groups_access_member_info`），讀寫皆無（[Sprinklr](https://www.sprinklr.com/help/articles/getting-started-facebook/meta-deprecates-facebook-groups-api/66229eb25f9dd9599d632712)）。Marketplace 從未有官方 API（[RealtyAPI](https://www.realtyapi.io/blog/facebook-marketplace-api)）。
- **瀏覽器自動化**：唯一自建路線。Marketplace 搜尋對匿名訪客直接 redirect 到登入頁（[Scrapfly](https://scrapfly.io/blog/posts/best-facebook-marketplace-scrapers-github)）；私密／需審核社團也必登入。
- **第三方**：`kevinzg/facebook-scraper`（PyPI `facebook-scraper`）最後 release 2022-08、最後 push 2024-06，400+ open issues，社團功能常壞（[GitHub](https://github.com/kevinzg/facebook-scraper)）。`danyk20/facebook-marketplace-scraper`（PyPI 同名，2026-07 仍在更新）用 Playwright + 持久 browser profile，必須登入，目前只內建瑞士地區，需自行加台灣設定（[repo](https://github.com/danyk20/facebook-marketplace-scraper)）。`hyuwowo/fb-marketplace-scraper` 用 cookies.json + browserforge 指紋。Apify：`apify/facebook-groups-scraper`（約 USD 2.6/1K posts，公開社團不需 cookie，私密社團可傳 `c_user`+`xs`）、`apify/facebook-marketplace-scraper`（約 USD 1.5/1K，宣稱無需登入）（[Apify](https://apify.com/apify/facebook-groups-scraper)，未直接驗證）。
- **Share-to-app**：Groups 貼文與 Marketplace 物件皆有 permalink，可手動分享；但後端抓取單篇仍多半需登入 session。

### 2.2 Auth
需登入。Playwright `storageState` 可保存 `c_user/xs/datr/sb`；經驗上 session 可撐數週到數月，但 headless + 固定節奏 + 資料中心 IP 極易觸發 checkpoint（[Castle](https://blog.castle.io/how-to-detect-headless-chrome-bots-instrumented-with-playwright/)）。EU/DMA consent 畫面也可能卡住新帳號。**強烈建議用分身帳號，且以 headed / 非 headless、住宅 IP、低頻率執行。**

### 2.3 反爬
最重。GraphQL `doc_id` 每幾週輪替、`fb_dtsg`/`lsd` session-bound token、DOM 頻繁變動（[SpyderProxy](https://spyderproxy.com/blog/how-to-scrape-facebook-marketplace)）。維護負擔：高。

### 2.4 資料形狀
Groups：純文字 + 圖片 + 作者 + 時間 + permalink，聯絡方式常寫「私訊」。Marketplace 有半結構化欄位（title、price、price_period、location、posted_at、seller、images）。

### 2.5 法律
Meta ToS 2025 起明禁登入／登出爬取；美國 *Meta v. Bright Data*（2024-01）認定登出狀態爬公開資料不受 ToS 約束，但那是美國判例且 Meta 已修改條款（[Quinn Emanuel](https://www.quinnemanuel.com/the-firm/news-events/client-alert-meta-v-bright-data-significant-decision-for-web-scraping-industry/)）。登入後自動化＝明確違約，風險是封號。

### 2.6 MVP 建議
**Groups**：手動 share-to-app 為主；若要監控 3–5 個公開社團，付費用 `apify/facebook-groups-scraper`。**Marketplace**：`danyk20/facebook-marketplace-scraper` fork 加 Taipei 設定，或 Apify actor。自建 Playwright 只在願意犧牲一個分身帳號時做。

---

## 3. 台灣主流平台（簡述）

### 591（rent.591.com.tw）
- 有未公開 JSON API：`GET bff-house.591.com.tw/v3/web/rent/list`（不需登入），詳情頁需 `X-CSRF-TOKEN`（首頁 meta）與 `deviceid`（`T591_TOKEN` cookie）（[hsuanlolo 專案](https://github.com/hsuanlolo/taiwan-home-listing-data-scraper-591)、[IT 空間](https://blog.jiatool.com/posts/house591_spider/)）。
- 反爬：>1 req/s 會被標記，之後**回傳隨機假資料**（g0v [issue #21](https://github.com/g0v/tw-rental-house-data/issues/21)）；部分專案回報 Cloudflare 挑戰，建議 2–4 秒隨機延遲、`cloudscraper`／`curl_cffi`。純 Selenium 已失效，`ceshine/591scraper` 2026-03 改用 DrissionPage（CDP，避開 `navigator.webdriver`）。
- ToS 明文禁止爬蟲（[591 服務條款](https://m.591.com.tw/v2/terms/service)）。
- 資料最結構化：租金、坪數、格局、樓層、區、捷運、設備、發布時間、URL。**MVP 首選來源**。

### 樂屋網／信義／好房快租／台灣租屋網
- 皆無官方 API；GitHub 幾乎沒有專門爬蟲（僅 g0v `scrapy-tw-rental-house` 泛用框架，2.3.0 於 2026-09-01 發布，主 repo 仍活躍）。反爬強度未直接驗證，一般認知較 591 弱；樂屋／信義／好房為仲介與房東混合，重複物件多。台灣租屋網（twhouses.com.tw）為老式 PHP 站，量小。建議 MVP 第二階段再納入，先用 Firecrawl/Playwright 抓列表頁測試。

### LINE 找房 bot（租屋小幫手類）
- 「591租屋小幫手」（591rent.com）為第三方服務，未直接驗證；**「蟹寶租屋」未找到任何實體**（僅「寄居蟹租屋」社宅包租代管）。這類 bot 本身是 591 爬蟲的下游，不是資料來源。注意 **LINE Notify 已於 2025-03-31 終止**（[LINE 公告](https://notify-bot.line.me/closing-announce)），舊專案（`dang113108/591_rent`、`bcjohnblue/rent-house-line-notify` 等）推播層需改 Messaging API／Telegram／Discord。

### PTT Rent_apart
- ptt.cc 網頁版可用 `requests` + `over18=1` cookie 直接抓，無反爬（[教學](https://steam.oxxostudio.tw/category/python/spider/ptt-gossiping.html)）；或 `PyPtt`（PyPI `PyPtt`，2026-08 仍更新）走 telnet/websocket 需 PTT 帳號。標題格式固定「[性別/地區/地點] 格局 特色」，地區限兩字，內文有置底範本（租金／地址／格局／聯絡方式），利於 regex 抽取。量小但雜訊低。

---

## 4. 既有開源專案（台灣租屋聚合）

| Repo | 語言 | 最後活動 | 功能 |
|---|---|---|---|
| [g0v/tw-rental-house-data](https://github.com/g0v/tw-rental-house-data) | Python (Scrapy) | 2026-09 | 多站租屋開放資料管線，PyPI `scrapy-tw-rental-house`，含資料清洗與季度 dataset |
| [ceshine/591scraper](https://github.com/ceshine/591scraper) | Python (DrissionPage) | 2026-03 | 591 增量抓取到 CSV，附註記欄；已因反爬改走 CDP |
| [hsuanlolo/taiwan-home-listing-data-scraper-591](https://github.com/hsuanlolo/taiwan-home-listing-data-scraper-591) | Python | 2026-05 | 直接打 591 bff JSON API，租／售／新建案週更，schema 完整 |
| [Archong-Liu/591-rent-bot](https://github.com/Archong-Liu/591-rent-bot) | Python | 2026-08 | 591 台北爬蟲 + Telegram 推播（Lambda + DynamoDB） |
| [rollkuo/taipei-rental-finder](https://github.com/rollkuo/taipei-rental-finder) | Python/Next.js | 2026-06 | 自用台北租屋彙整：591 爬蟲 + Supabase + Next.js（與本專案定位最接近） |
| [Yukaii/zuzugo](https://github.com/Yukaii/zuzugo) | TypeScript | 2025-02 | 591 監控通知（Inngest + LINE Notify/Slack），推播層需遷移 |
| [peichipeng/591-rent-scraper](https://github.com/peichipeng/591-rent-scraper) | JavaScript | 2026-03 | 591 爬蟲 + Discord 通知 |
| [MarcusTseng0101/claude-skill-rent591](https://github.com/MarcusTseng0101/claude-skill-rent591) | JS | 2026-08 | Claude Code skill：篩選 591 物件並抓瑕疵 |

**沒有找到任何活躍的 Threads 租屋或 FB 租屋社團專用開源爬蟲**（`shihs/Facebook-group-crawler` 2018 已死、`wspooong/facebook-group-scraper` 2023 停更）。

---

## 5. 正規化到 listing schema

- **主鍵**：`source + source_id`（591 有數字 ID；Threads/FB 用 permalink ID；PTT 用 `M.xxxx.A.xxx`）。
- **跨來源去重**（同一房東多平台刊登）：依序比對 (a) 電話號碼正規化（09xx-xxx-xxx、+886）；(b) 圖片 perceptual hash（pHash，漢明距離 ≤ 6）；(c) `租金 ± 500` × `區` × `坪數 ± 1` × 標題 SimHash。
- **自由文字抽取**（Threads/FB/PTT 必要）：先 regex（`(\d{1,3},?\d{3})\s*(元|/月)`、`(\d+(\.\d+)?)\s*坪`、`[1-5]房[12]廳`、台北 12 區＋捷運站名詞典、`套房|雅房|整層|分租`），regex 失敗再丟 LLM 做 JSON extraction（schema 固定）。
- **必留欄位**：`raw_text`、`photos[]`、`contact_raw`（可能是「私訊」）、`posted_at`、`url`、`fetched_at`、`extraction_confidence`。

---

## 6. 法律／ToS 摘要（台灣、個人非商用）

- 591、Meta（Facebook/Threads）ToS 皆明文禁爬；違約後果主要是封鎖／停權。
- **刑法 §358／§359**：2025-06 Lawsnote（七法）一審以 §359「無故取得電磁紀錄」重判，法院把「違反網站使用條款爬取公開資料」視為「無故」（[數位時代](https://www.bnext.com.tw/article/83734/the-thoughts-on-lawsnote's-judgement)）。該案是商業、大量、重製資料庫，與個人自用差異大，且仍在二審，但代表台灣司法對爬蟲的態度**明顯比美國嚴**。個人用途宜：低頻、不重新散布、不繞過登入牆與驗證機制。
- **個資法 §51**：自然人「單純個人或家庭活動」蒐集個資可豁免，但一旦資料可供不特定人瀏覽即逾越豁免（[臺北市法規](https://laws.gov.taipei/Law/LawSearch/LawRelateInterpretation/FL010627?no=51)）。房東電話屬個資 → **資料庫必須私有，不可公開部署**。

---

## 7. 總表

| 來源 | 存取方法 | 需登入 | 維護風險 | MVP 建議 |
|---|---|---|---|---|
| 591 | 未公開 bff JSON API / DrissionPage | 否 | 中（假資料混淆、CF、ToS） | 主來源；`curl_cffi`/`cloudscraper` + 2–4s 延遲，參考 hsuanlolo / ceshine |
| Threads | 官方 API（無實用性）/ 匿名 hidden JSON / Apify | 單篇否、搜尋是 | 中 | Share-to-app 貼 URL → Playwright 抓單篇；批次監控用 Apify |
| FB Groups | 僅瀏覽器自動化 / Apify | 是（公開社團 Apify 可免） | 高 | Share-to-app 為主；3–5 社團監控用 `apify/facebook-groups-scraper` |
| FB Marketplace | Playwright + storageState / Apify | 是 | 高 | `danyk20/facebook-marketplace-scraper` fork 加 Taipei；分身帳號 |
| 樂屋／信義／好房／台灣租屋網 | HTML 爬取 / Firecrawl | 否 | 低–中（未驗證） | Phase 2；可套 g0v `scrapy-tw-rental-house` |
| PTT Rent_apart | requests + over18 cookie / PyPtt | 否（PyPtt 要帳號） | 低 | Phase 1 即可納入，成本極低 |
| LINE 找房 bot | 無（皆為 591 下游） | — | — | 不作為來源；自建推播改 Telegram / LINE Messaging API |

---

## 8. 建議 MVP 攝取架構

1. **Tier 1 排程爬取（低風險、結構化）**：591 bff API + PTT Rent_apart，每 15–30 分鐘一輪、單執行緒、隨機延遲，寫入本地資料庫 `listings` 表（schema 見 §5），並保存 raw JSON/HTML 供重新解析。
2. **Tier 2 手動 share-to-app 通道**：一個 PWA（`share_target` manifest；Android 上 URL 常落在 `text` 欄位需自行解析）接收 Threads/FB/Marketplace 連結，佇列交給 worker：Threads 單篇匿名 Playwright 抓 hidden JSON；FB 用登入的分身 `storageState` 抓單篇，headed、住宅網路、每日上限數十次。
3. **Tier 3 可選付費監控**：Apify Threads keyword + FB groups actors（每月數十 USD 級），輸出 webhook 進同一 normalizer；不用自己帳號做搜尋。
4. **Normalizer**：regex-first、LLM-fallback 的欄位抽取；跨來源去重用 phone → pHash → (price, district, area) 三段策略；每筆帶 `confidence` 與 `dedupe_group_id`。
5. **推播與檢視**：新物件／降價事件推 Telegram 或 LINE Messaging API（LINE Notify 已停）；前端只做私有查詢介面，不對外公開（個資法 §51 前提）。
6. **可觀測性**：每個 source 記錄成功率、假資料偵測（同 ID 兩次抓取內容不一致即告警）、session 到期偵測，因為 591 混淆與 Meta doc_id churn 是最常見的靜默失敗。
