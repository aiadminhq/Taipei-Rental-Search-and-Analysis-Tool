# 原型參考資料包（Prototype Reference Kit）：TRSAT 租屋收件匣 PWA

**日期**：2026-09-05
**搭配**：`Claude_Design_Prompts_PWA_Prototype.md`（提示詞包 P0–P10）、`prototype-sample-data.json`（虛構樣本資料）
**用途**：在 Claude Design 建立專案時，把本檔與樣本資料一併上傳為專案參考（knowledge / guidelines），再依提示詞包順序產出畫面。所有內容與 spec 第 7 節、實作計畫 Task 9–17 的元件介面一致，日後工程實作可 1:1 對應。

---

## 1. 如何餵給 Claude Design

1. 新建 Claude Design 專案「TRSAT 租屋收件匣」。
2. 上傳三個檔案作為參考：本檔、`prototype-sample-data.json`、`Claude_Design_Prompts_PWA_Prototype.md`。
3. 第一則訊息貼 P0（設計系統），等它回「已載入設計系統」。
4. 之後每則訊息貼一個 P1–P7，並加一句「資料請用已上傳的 prototype-sample-data.json」。
5. 完成後貼 P8（元件表）、P9（流程圖）、P10（深色模式與交付標註）。
6. 需要調整時用附錄的迭代短提示；每次只改一個變數，兩版並排比較。

**關於 `/design-sync`**：該流程用於把「已編譯的元件庫」同步進 Claude Design 讓設計代理直接用真元件產圖。本 repo 目前尚無元件庫（`apps/pwa` 尚待實作計畫 Task 9–17 產出），因此現階段不適用；Phase 1 完成後可再以 package shape 同步 `apps/pwa` 的 Preact 元件，讓後續設計直接使用真實元件。

---

## 2. Design Tokens（與 `apps/pwa/src/styles.css` 一致）

### 2.1 CSS 變數（可直接貼進 Claude Design 的 tokens 或 Figma variables）
```css
:root {
  --font-sans: "Noto Sans TC", ui-sans-serif, system-ui, sans-serif;

  --color-primary: #3b82f6;
  --color-primary-600: #2563eb;
  --color-tier-pass: #16a34a;
  --color-tier-unknown: #d97706;
  --color-tier-fail: #6b7280;
  --color-danger: #dc2626;

  --color-bg: #f9fafb;
  --color-surface: #ffffff;
  --color-surface-muted: #f3f4f6;
  --color-border: #e5e7eb;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-diff-highlight: #fffbeb;

  --radius-card: 12px;
  --radius-button: 10px;
  --radius-input: 8px;
  --radius-chip: 999px;

  --shadow-card: 0 1px 2px rgba(0, 0, 0, 0.06);
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-6: 24px;
  --tap-min: 44px;
}
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #030712; --color-surface: #111827; --color-surface-muted: #1f2937;
    --color-border: #1f2937; --color-text: #f9fafb; --color-text-muted: #9ca3af;
    --color-diff-highlight: rgba(217, 119, 6, 0.15);
  }
}
```

### 2.2 字級階層
| 用途 | 大小/字重 | 範例 |
|---|---|---|
| 頁面大標 | 20 / 700 | 收件匣、房源 |
| 詳情標題 | 18 / 700 | 房源標題 |
| 卡片主數字 | 24 / 700 | NT$14,500 |
| 詳情主數字 | 30 / 700 | NT$14,500 |
| 內文 | 14 / 400 | 卡片第二行 |
| 輔助 | 12 / 400 | 說明、時間 |
| 標籤 / chip | 11 / 500 | 狀態 chip、來源 |
| Onboarding 大標 | 24 / 700 | 安裝到主畫面 |

### 2.3 Tailwind v4 對照（工程端）
```css
@theme {
  --font-sans: "Noto Sans TC", ui-sans-serif, system-ui, sans-serif;
  --color-primary: #3b82f6;
  --color-tier-pass: #16a34a;
  --color-tier-unknown: #d97706;
  --color-tier-fail: #6b7280;
}
```
類別慣例：`bg-primary`、`text-tier-unknown`、`bg-tier-pass`、`.tap`（min-h-11 min-w-11）、`.safe-bottom`（padding-bottom: env(safe-area-inset-bottom) + 0.5rem）。

---

## 3. 元件清單（與實作計畫介面一致）

| 元件 | 用途 | Props（TypeScript） | 狀態 / 變體 | 出現畫面 |
|---|---|---|---|---|
| `BottomNav` | 4 Tab 底部導覽 | `active: string; inboxCount: number` | 每 Tab 選中；badge 0 隱藏 / >0 顯示 | 全部 |
| `TierBadge` | 三級分級膠囊 | `tier: 'pass'\|'unknown'\|'fail'; size?: 'sm'\|'md'` | pass 綠 / unknown 琥珀 / fail 灰 | S1–S5 |
| `RuleChecklist` | 條件檢核清單 | `result: RuleResult; compact?: boolean` | 完整 / 精簡（非 ✓ 最多 3 條）/ 全符合空狀態 | S1, S4 |
| `PreviewCard` | 分享預覽卡（可編輯 3 欄） | `listing: Listing; onChange(patch)` | 高信心 / 低信心（琥珀虛線框）/ 不符 | S1, S2 |
| `ListingCard` | 清單三行卡 | `listing: Listing; extraCount?: number; onClick()` | 預設 / +N 同房源 / 待電腦補抓 / 缺必備（紅字）/ 不符 80% 透明 / 按下 | S3 |
| `FilterChip`（Chip） | 篩選膠囊 | `active: boolean; label: string; onClick()` | 未選 / 選中 / 含數字 | S3 |
| `StatusStepper` | 看房狀態 | `status: Status; onChange(s)` | 候選 → 已聯絡 → 約看房 → 已看房 → 淘汰 / 已簽約 | S4 |
| `SwipeCard` | 左右滑動容器 | `onSwipeRight(); onSwipeLeft()` | 靜止 / 右滑（綠底「加入」）/ 左滑（灰底「略過」）；門檻 80px | S2 |
| `PasteSheet` | 貼上 bottom sheet | `open: boolean; onClose(); onSubmit(payload)` | 空（解析 disabled）/ 有內容 | S2, Onboarding |
| `Toast` | 頂部提示 | `showToast(message, kind?, action?)` | info / success / error / 帶動作 | 全部 |
| 詳情操作列 | 固定底部 5 鈕 | — | 開原文 / 地圖 / 複製聯絡 / 比較（選中 primary）/ 補抓・待補抓 | S4 |
| 空狀態卡 | 虛線外框說明 | `text; cta?` | 收件匣 / 房源 / 比較 | S2, S3, S5 |

### 3.1 資料型別摘要（供原型欄位對齊）
```ts
type Tier = 'pass' | 'unknown' | 'fail';                 // 符合 / 待確認 / 不符
type Status = 'inbox' | 'shortlist' | 'contacted' | 'viewing' | 'viewed' | 'rejected' | 'signed';
type Source = '591' | 'threads' | 'fb_group' | 'fb_marketplace' | 'ptt' | 'manual' | 'other';
type RoomType = '套房' | '雅房' | '整層' | '分租' | '未知';
interface RuleReason { kind: 'fail' | 'unknown' | 'pass' | 'bonus'; code: string; message: string }
interface RuleResult { tier: Tier; reasons: RuleReason[]; softScore: number }
```
中文對照：Status → 收件匣 / 候選 / 已聯絡 / 約看房 / 已看房 / 淘汰 / 已簽約；Source → 591 / Threads / FB 社團 / FB Marketplace / PTT / 手動 / 其他。

---

## 4. 畫面地圖與路由

| 代號 | 畫面 | 路由 | 進入方式 | 主要動作 |
|---|---|---|---|---|
| S1 | 分享接收 | `#/share` | 系統分享 / 貼上解析後 | 加入房源・先放收件匣・略過 |
| S2 | 收件匣 | `#/inbox`（`?paste=1` 直接開 PasteSheet） | Tab 1 | 加入・略過・貼上 |
| S3 | 房源清單 | `#/` | Tab 2、S1 加入後 | 篩選・排序・展開同房源・展開不符 |
| S4 | 房源詳情 | `#/l/:id` | 點卡片 | 編輯・狀態・備註・開原文・地圖・複製聯絡・比較・補抓 |
| S5 | 比較 | `#/compare` | Tab 3、S4 比較 | 移除・點標題回詳情 |
| S6 | 設定 | `#/settings` | Tab 4、Onboarding「先去設定」 | 儲存條件・endpoint・匯出匯入・清除 |
| OB | Onboarding | 首次啟動覆蓋 | 首次開啟（S1 優先不被擋） | 下一步・先去設定・開始使用 |

---

## 5. 文案表（Copy Deck）

| 位置 | 文案 |
|---|---|
| Tab | 收件匣／房源／比較／設定 |
| S1 標題 | 收到房源 |
| S1 按鈕 | 略過／先放收件匣／加入房源 |
| S1 低信心提示 | 解析信心不足，請至少補一個必要欄位（租金／區／房型）後再加入。 |
| S1 欄位未偵測 | （未偵測到，請補） |
| S2 空狀態 | 從 591 / Threads / FB 分享到此 App，房源會先出現在這裡。／iPhone 請複製內容後點右上角「貼上文字或連結」。 |
| PasteSheet | 貼上連結或貼文／貼上 591 / Threads / FB / PTT 連結，或整段貼文文字／從剪貼簿讀取／解析 |
| S3 空狀態 | 還沒有房源。從收件匣加入，或用分享選單把連結送進來。 |
| S3 收合區 | ▸ 不符 (N)／▾ 不符 (N) |
| S3 同房源 | +N 同房源／展開 N 筆同房源／收合同房源 |
| 卡片標記 | 待電腦補抓／缺洗衣機 |
| S4 區塊 | 條件檢核／看房狀態／備註／原文 |
| S4 操作列 | 開原文／地圖／複製聯絡／比較／補抓・待補抓 |
| S4 Toast | 未設定補抓 endpoint，已複製指令到剪貼簿，請在電腦執行／補抓完成／補抓失敗／已加入比較／已移出比較／已更新 |
| S5 空狀態 | 尚未選擇房源。到房源詳情按「比較」，最多 3 筆。 |
| S6 區塊 | 個人條件／補抓 endpoint（選填）／資料／關於 |
| S6 按鈕 | 儲存條件／測試連線／儲存／匯出 JSON／匯入 JSON／清除所有資料 |
| S6 Toast | 已儲存並重新分級／連線成功／連線失敗（請確認 HTTPS 網址與 trsat serve 是否執行） |
| S6 確認 | 確定要清除所有房源、收件匣與設定？／再次確認：此操作無法復原。建議先匯出備份。 |
| SW 更新 | 有新版本可用 ［更新］ |
| OB | 安裝到主畫面／確認個人條件／試著分享一筆／下一步／先去設定／開始使用 |

---

## 6. 圖示對照（Lucide）

| 功能 | Lucide 名稱 |
|---|---|
| 收件匣 Tab | `inbox` |
| 房源 Tab | `home` |
| 比較 Tab | `scale` |
| 設定 Tab | `settings` |
| 開原文 | `external-link` |
| 地圖 | `map-pin` |
| 複製聯絡 | `copy` |
| 補抓 | `refresh-cw` |
| 貼上 | `clipboard-paste` |
| 返回 | `arrow-left` |
| 關閉 | `x` |
| 檢核 ✓ / ? / ✗ / ＋ | `check` / `help-circle` / `x` / `plus` |
| 來源 | 591 `building-2`、Threads `at-sign`、FB `users`、PTT `terminal`、手動 `pencil` |

---

## 7. 可參考的互動模式（只借鑑模式，不複製視覺）

| 模式 | 參考 | 借鑑點 |
|---|---|---|
| 收件匣分流（triage） | Gmail / Spark 行動版 | 先進來再決定；左右滑動＝兩個決定；未讀 badge |
| 卡片左右滑 | Tinder-style card stack | 位移門檻、滑動時露出底色提示、鬆手回彈 |
| 三級分級即排序 | 信用卡帳單「需處理／待確認／已完成」分組 | 不符預設收合、分級用色點不用大色塊 |
| 可編輯預覽 | iOS 通訊錄「新聯絡人」自動帶入 | 已辨識欄位灰底、未辨識欄位虛線框 |
| 狀態 stepper | 物流追蹤（黑貓、Uber Eats） | 線性狀態、可回退、記錄時間 |
| 條件檢核清單 | 保險商品比較頁的「符合 / 不符」列 | 每條一句原因，圖示＋文字，不只給分數 |
| 三欄比較表 | Apple 產品比較、GSMArena | 第一欄固定列標籤、差異格淡色標示、可橫向捲動 |
| 底部操作列 | Google Maps 地點頁 | 5 個等分圖示鈕、置於 Tab 之上 |
| 底部貼上 sheet | Apple Music「加入播放清單」sheet | 55% 高度、留 home indicator 安全區 |

---

## 8. 給工程師的對應關係

| 原型元件 | 程式碼位置（實作計畫） |
|---|---|
| Tokens | `apps/pwa/src/styles.css` |
| BottomNav / Toast | `apps/pwa/src/components/BottomNav.tsx`、`Toast.tsx` |
| TierBadge / RuleChecklist / PreviewCard / PasteSheet / SwipeCard / ListingCard / StatusStepper | `apps/pwa/src/components/*.tsx` |
| S1–S6、OB | `apps/pwa/src/screens/{Share,Inbox,Listings,Detail,Compare,Settings,Onboarding}.tsx` |
| 分級邏輯 | `packages/core/src/rules.ts`（`evaluate()`），文案來自 `RuleReason.message` |
| 文案 | `apps/pwa/src/lib/format.ts`（`STATUS_LABEL`、`SOURCE_LABEL`）與各 screen |
