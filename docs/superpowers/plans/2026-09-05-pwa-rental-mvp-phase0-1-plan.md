# TRSAT 租屋收件匣 PWA：Phase 0–1 實作計畫（core + PWA MVP）

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 交付一個可安裝、可離線、可由系統分享選單接收房源連結或貼文文字，並依個人條件即時分級的 PWA，以及其共用核心套件（schema、解析、規則、去重）。

**Architecture:** npm workspaces monorepo。`packages/core` 為零 DOM／零 Node 依賴的純 TypeScript 函式庫（zod schema、URL／文字解析、規則引擎、去重），由 PWA 與日後的 CLI 共用。`apps/pwa` 以 Vite + Preact + Tailwind v4 + Dexie（IndexedDB）+ vite-plugin-pwa 建置，hash router，部署到 GitHub Pages。所有資料留在裝置；Phase 2 的 CLI 與雲端 runner 不在本計畫內。

**Tech Stack:** Node 22、TypeScript 5.9、Vite 7、Vitest 3、Preact 10、Tailwind CSS 4（`@tailwindcss/vite`）、Dexie 4、zod 4、vite-plugin-pwa 1、fake-indexeddb 6（測試）、@testing-library/preact 3、jsdom、@playwright/test 1.63、gitleaks-action v2。

**Spec:** `docs/superpowers/specs/2026-09-05-pwa-rental-mvp-design.md`（v0.4）。

> **執行後註記（2026-09-05）**：本計畫 18 個任務已全部實作並通過逐任務審查與最終整體審查；最終審查要求的修正已合併（規則引擎關鍵字負向詞感知、re-share 保留使用者欄位、匯入還原 Profile、補抓傳輸錯誤→pending、ListingCard 缺X 取自 rule.reasons、收件匣改為明確「編輯」鈕、e2e 改以子路徑 base 執行、enrich fetch `credentials: 'omit'` 與 https 驗證）。以下任務內文為原始計畫，與現行程式碼不一致處以程式碼與 spec v0.4 為準；已知差異：Task 10 `upsertListing` 需保留 status/statusHistory/notes/pinned/enrichment；Task 11 低信心門檻為「三個必要欄位全缺才停用」；Task 13 `ListingCard` 缺X 來源為 `rule.reasons`；Task 14 網路錯誤→`pending`；Task 18 `playwright.config.ts` baseURL 含 `VITE_BASE_PATH`。本計畫覆蓋 spec 第 9 節 Phase 0 與 Phase 1；Phase 2（CLI、`trsat watch`、雲端 runner、PAT 同步）另立 Plan 2。

## Global Constraints

- Node `>=22`；套件管理一律 `npm`（workspaces），不引入 pnpm / yarn。
- `packages/core` 不得 import `dexie`、任何 DOM API、`node:*` 模組或 Playwright；用 `tsconfig` 的 `"lib": ["ES2022"]` 強制。
- PWA 不得接觸 cookie、storageState、`~/.trsat`；PWA 對外網路只有兩種：使用者在 Settings 設定的 enrich endpoint，以及 Phase 2 的 GitHub API（本計畫不做）。
- 所有 UI 文案為繁體中文；程式碼識別字、commit message 為英文。
- 三級分級固定為 `pass`（符合，綠）／`unknown`（待確認，琥珀）／`fail`（不符，灰）。
- 觸控目標最小 44×44px；底部導覽需處理 `env(safe-area-inset-bottom)`；支援 `prefers-color-scheme: dark`。
- `manifest.share_target.action` 必須是 `'./'`（GitHub Pages 無 SPA fallback）；路由一律 hash router。
- 主色沿用 `#3b82f6`；字體 Noto Sans TC（`font-display: swap`，離線時退回系統字體）。
- 不得將任何金鑰、房源資料（含電話）寫入 repo；repo 為 public。
- 每個 Task 結尾 `npm test` 與 `npm run typecheck` 必須全綠才可 commit。
- Commit message 格式：`type(scope): summary`，type ∈ feat / fix / test / chore / docs / ci。

---

## 檔案結構（本計畫建立或修改）

```
.
├── package.json                      # 新：workspaces root（取代舊 root manifest）
├── package-lock.json                 # 重新產生
├── tsconfig.base.json                # 新：共用 TS 設定
├── legacy/package.json               # 舊 root package.json 搬入（scripts 指向 ../src）
├── legacy/package-lock.json          # 舊 lockfile 搬入
├── legacy/README.md                  # 新：說明如何啟動舊 Notion/MCP 系統
├── .gitignore                        # 修改：加入 .trsat/、storageState*.json、*.cookies.json、profiles/
├── .gitleaks.toml                    # 新：允許清單（僅 placeholder）
├── .github/workflows/ci.yml          # 新：test + typecheck + build + gitleaks + Pages deploy
├── .github/workflows/deploy.yml      # 刪除（由 ci.yml 取代）
├── .mcp.json / .env.example / config/.claude_project_config.json / docs/**  # 修改：金鑰實值改 placeholder
│
├── packages/core/
│   ├── package.json  tsconfig.json  vitest.config.ts
│   └── src/
│       ├── index.ts                  # 匯出所有公開 API
│       ├── schema.ts                 # zod：Listing / Profile / InboxItem / RuleResult / ExportFile + DEFAULT_PROFILE
│       ├── source.ts                 # detectSource / parseSourceUrl / extractFirstUrl
│       ├── dictionaries.ts           # 行政區、設備別名、寵物、房型詞典
│       ├── extract.ts                # extractFields(text) regex 抽取
│       ├── parse.ts                  # parseInput / toListing / computeConfidence
│       ├── rules.ts                  # evaluate(listing, profile)
│       └── dedupe.ts                 # normalizePhone / hamming / findDuplicates
│   └── test/                         # 與 src 一對一的 *.test.ts + fixtures/
│
└── apps/pwa/
    ├── package.json  tsconfig.json  vite.config.ts  vitest.config.ts  playwright.config.ts
    ├── index.html
    ├── public/icons/icon-192.png  icon-512.png  icon-maskable-512.png
    ├── src/
    │   ├── main.tsx                  # mount + SW register + storage.persist
    │   ├── app.tsx                   # 殼：BottomNav + 路由 + Toast + Onboarding gate
    │   ├── router.ts                 # useHashRoute / navigate
    │   ├── db.ts                     # Dexie 定義、profile 取用、upsert、export/import
    │   ├── hooks.ts                  # useLive(query) 包 dexie liveQuery
    │   ├── styles.css                # Tailwind v4 entry + tokens
    │   ├── lib/share.ts              # 從 URL query 解析 share_target 參數
    │   ├── lib/enrich.ts             # enrich(listingId) 呼叫 endpoint
    │   ├── lib/format.ts             # 金額、日期、分級文案
    │   ├── components/BottomNav.tsx  TierBadge.tsx  ListingCard.tsx  RuleChecklist.tsx  PasteSheet.tsx  Toast.tsx  StatusStepper.tsx
    │   └── screens/Share.tsx  Inbox.tsx  Listings.tsx  Detail.tsx  Compare.tsx  Settings.tsx  Onboarding.tsx
    ├── test/                         # vitest + testing-library
    └── e2e/smoke.spec.ts             # Playwright
```

---

## Phase 0：清理與骨架

### Task 1: 金鑰清除、.gitignore、gitleaks 設定

**Files:**
- Modify: `.mcp.json`, `.env.example`, `config/.claude_project_config.json`
- Modify: `docs/_Archive/git.md`, `docs/_Archive/MCP整合版-租屋分析工具.md`, `docs/02_Technical_Guides/FIRECRAWL_整合指南.md`, `docs/02_Technical_Guides/MCP_整合指南.md`, `docs/04_Reports/FIRECRAWL_整合總結.md`, `docs/01_Development_Plans/個人租屋分析工具-8小時開發計劃.md`
- Modify: `.gitignore`
- Create: `.gitleaks.toml`
- Create: `scripts/check-secrets.sh`

**Interfaces:**
- Produces: `scripts/check-secrets.sh` 退出碼 0 = 乾淨；CI Task 2 會呼叫。

- [ ] **Step 1: 寫檢查腳本（先讓它失敗）**

```bash
# scripts/check-secrets.sh
#!/usr/bin/env bash
# Fails if any known secret prefix appears in tracked files (excluding this script).
set -euo pipefail
PATTERN='ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|figd_[A-Za-z0-9_-]{20,}|ntn_[A-Za-z0-9]{20,}|secret_[A-Za-z0-9]{20,}|fc-[a-f0-9]{32}|2f7832c86[a-f0-9]{50,}'
if git grep -nE "$PATTERN" -- ':!scripts/check-secrets.sh' ':!.gitleaks.toml'; then
  echo "❌ secret-like strings found in tracked files"; exit 1
fi
echo "✅ no secret-like strings in tracked files"
```

- [ ] **Step 2: 執行確認目前失敗**

Run: `chmod +x scripts/check-secrets.sh && ./scripts/check-secrets.sh`
Expected: 列出 `.mcp.json`、`.env.example`、`config/.claude_project_config.json` 與多份 docs 的命中行，退出碼 1。

- [ ] **Step 3: 以 placeholder 取代所有實值**

對每個命中檔案，把實值換成下列 placeholder（保留 `${VAR:-...}` 結構時，預設值一律改為空字串）：

| 類型 | Placeholder |
|---|---|
| GitHub PAT | `${GITHUB_PERSONAL_ACCESS_TOKEN}` |
| Figma | `${FIGMA_API_KEY}` |
| Notion token | `${NOTION_TOKEN}` |
| Notion DB id | `${NOTION_DATABASE_ID}` |
| Firecrawl | `fc-your-firecrawl-key` |
| 21st.dev Magic | `your-magic-api-key` |

`.env.example` 三行改為：
```
NOTION_API_KEY=ntn_your_notion_key
NOTION_DATABASE_ID=your_notion_database_id
FIRECRAWL_API_KEY=fc-your-firecrawl-key
MAGIC_API_KEY=your-magic-api-key
```

`.mcp.json` 中 `"${FIGMA_API_KEY:-figd_...}"` → `"${FIGMA_API_KEY}"`，`"${GITHUB_PERSONAL_ACCESS_TOKEN:-ghp_...}"` → `"${GITHUB_PERSONAL_ACCESS_TOKEN}"`，Notion header 中 `${NOTION_TOKEN:-secret_...}` → `${NOTION_TOKEN}`，`${NOTION_DATABASE_ID:-5564...}` → `${NOTION_DATABASE_ID}`，`${FIRECRAWL_API_KEY:-fc-...}` → `${FIRECRAWL_API_KEY}`，`${MAGIC_API_KEY:-2f78...}` → `${MAGIC_API_KEY}`。docs 內的 JSON 範例同樣替換。

- [ ] **Step 4: 執行確認通過**

Run: `./scripts/check-secrets.sh`
Expected: `✅ no secret-like strings in tracked files`

- [ ] **Step 5: 更新 .gitignore 與 gitleaks 設定**

在 `.gitignore` 末尾加入：
```
# TRSAT CLI sessions / browser profiles (never commit)
.trsat/
storageState*.json
*.cookies.json
profiles/
# TRSAT crawl output (contains PII)
data/listings.json
data/raw/
```

`.gitleaks.toml`：
```toml
title = "TRSAT gitleaks config"
[extend]
useDefault = true
[allowlist]
description = "placeholders used in examples"
regexes = [
  '''fc-your-firecrawl-key''',
  '''your-magic-api-key''',
  '''ntn_your_notion_key''',
]
paths = [
  '''package-lock\.json''',
  '''legacy/package-lock\.json''',
]
```

- [ ] **Step 6: Commit**

```bash
git add .mcp.json .env.example config/.claude_project_config.json docs .gitignore .gitleaks.toml scripts/check-secrets.sh
git commit -m "chore(security): replace committed secrets with placeholders, add secret checks"
```

**人工步驟（不在程式碼內，必須由使用者執行）**：到 GitHub / Figma / Notion / Firecrawl / 21st.dev 後台撤銷並重新產生上述金鑰；歷史 commit 仍含舊值，故撤銷是唯一有效手段。

---

### Task 2: Monorepo 骨架、legacy 隔離、CI

**Files:**
- Create: `package.json`（新 root）, `tsconfig.base.json`
- Move: `package.json` → `legacy/package.json`; `package-lock.json` → `legacy/package-lock.json`
- Create: `legacy/README.md`
- Create: `packages/core/package.json`, `packages/core/tsconfig.json`, `packages/core/vitest.config.ts`, `packages/core/src/index.ts`, `packages/core/test/smoke.test.ts`
- Create: `.github/workflows/ci.yml`; Delete: `.github/workflows/deploy.yml`
- Modify: `README.md`（頂部加入新架構說明與 legacy 指引）

**Interfaces:**
- Produces: root scripts `npm test`、`npm run typecheck`、`npm run build`；`@trsat/core` workspace 名稱（PWA 以 `"@trsat/core": "*"` 依賴）。

- [ ] **Step 1: 搬移舊 manifest 到 legacy/**

```bash
mkdir -p legacy
git mv package.json legacy/package.json
git mv package-lock.json legacy/package-lock.json
```

編輯 `legacy/package.json`：`"main": "../src/index.js"`；所有 scripts 中的 `src/` 前加 `../`（例：`"start": "node ../src/index.js"`, `"web": "node ../src/webServer.js"`, `"mcp": "node ../src/mcp/mcpServer.js"`, `"monitor": "node ../src/monitorApp.js"`, `"enhanced": "node ../src/enhancedApp.js"`）；移除 `test:*`、`example*`、`report`、`logs*` 等引用不存在檔案的 scripts；`"name"` 改為 `"trsat-legacy"`。

`legacy/README.md`：
```markdown
# Legacy（591 → Notion / MCP 自動化系統）

此目錄只保存舊系統的套件清單。程式碼仍在 `../src/`，不再納入 CI，將於 Phase 3 移除。
啟動方式：`cd legacy && npm ci && npm run web`（需先在 repo 根目錄建立 `.env`）。
新系統請見 `apps/pwa` 與 `packages/core`。
```

- [ ] **Step 2: 建立新 root package.json 與 tsconfig.base.json**

`package.json`：
```json
{
  "name": "trsat",
  "private": true,
  "version": "0.1.0",
  "engines": { "node": ">=22" },
  "workspaces": ["packages/*", "apps/*"],
  "scripts": {
    "test": "npm run test --workspaces --if-present",
    "typecheck": "npm run typecheck --workspaces --if-present",
    "build": "npm run build --workspaces --if-present",
    "dev": "npm run dev -w apps/pwa",
    "check:secrets": "bash scripts/check-secrets.sh"
  },
  "devDependencies": {
    "typescript": "^5.9.0"
  }
}
```

`tsconfig.base.json`：
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true
  }
}
```

- [ ] **Step 3: 建立 packages/core 骨架與 smoke test**

`packages/core/package.json`：
```json
{
  "name": "@trsat/core",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": { ".": "./src/index.ts" },
  "scripts": {
    "test": "vitest run",
    "typecheck": "tsc --noEmit -p tsconfig.json"
  },
  "dependencies": { "zod": "^4.5.0" },
  "devDependencies": { "vitest": "^3.2.0", "typescript": "^5.9.0" }
}
```

`packages/core/tsconfig.json`：
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "lib": ["ES2022"], "types": [], "noEmit": true },
  "include": ["src", "test"]
}
```

`packages/core/vitest.config.ts`：
```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['test/**/*.test.ts'] } });
```

`packages/core/src/index.ts`：
```ts
export const CORE_VERSION = '0.1.0';
```

`packages/core/test/smoke.test.ts`：
```ts
import { describe, it, expect } from 'vitest';
import { CORE_VERSION } from '../src/index';
describe('core', () => {
  it('exposes a version', () => { expect(CORE_VERSION).toBe('0.1.0'); });
});
```

- [ ] **Step 4: 安裝並執行**

Run: `npm install && npm test && npm run typecheck`
Expected: core smoke test 1 passed；typecheck 無錯誤；產生新的 root `package-lock.json`。

- [ ] **Step 5: 建立 CI，刪除舊 deploy.yml**

```bash
git rm .github/workflows/deploy.yml
```

`.github/workflows/ci.yml`：
```yaml
name: CI
on:
  push: { branches: [main] }
  pull_request:
permissions: { contents: read }
jobs:
  secrets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - run: bash scripts/check-secrets.sh
      - uses: gitleaks/gitleaks-action@v2
        env: { GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}" }
  test-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
        env: { VITE_BASE_PATH: "/${{ github.event.repository.name }}/" }
      - uses: actions/upload-pages-artifact@v3
        if: github.ref == 'refs/heads/main'
        with: { path: apps/pwa/dist }
  deploy-pages:
    needs: [secrets, test-build]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions: { pages: write, id-token: write }
    environment: { name: github-pages, url: "${{ steps.deployment.outputs.page_url }}" }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

注意：`upload-pages-artifact` 在 Task 10 建立 `apps/pwa` 前會因路徑不存在而失敗，但該 step 只在 `main` 執行；PR 上不受影響。

- [ ] **Step 6: README 頂部加入新架構段落**

在 `README.md` 最上方（標題之後）插入：
```markdown
> **2026-09 起新架構**：本 repo 已改為 npm workspaces monorepo。
> - `apps/pwa`：租屋收件匣 PWA（Vite + Preact，部署至 GitHub Pages）
> - `packages/core`：共用解析／規則／去重函式庫
> - `src/` + `legacy/`：舊 591→Notion/MCP 系統，僅保留參考，見 `legacy/README.md`
> 設計規格：`docs/superpowers/specs/2026-09-05-pwa-rental-mvp-design.md`
> 開發：`npm install && npm run dev`；測試：`npm test`
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: bootstrap npm workspaces monorepo, isolate legacy manifests, add CI"
```

---
## Phase 1A：`packages/core`

### Task 3: Schema 與預設 Profile

**Files:**
- Create: `packages/core/src/schema.ts`
- Modify: `packages/core/src/index.ts`
- Test: `packages/core/test/schema.test.ts`

**Interfaces:**
- Produces（後續所有 Task 依賴）：
  - `Source`, `RoomType`, `Status`, `Tier`, `PetPolicy`, `Listing`, `Profile`, `InboxItem`, `RuleResult`, `RuleReason`, `ExportFile` 型別
  - `ListingSchema`, `ProfileSchema`, `InboxItemSchema`, `RuleResultSchema`, `ExportFileSchema`（zod）
  - `DEFAULT_PROFILE: Profile`
  - `CITY_OF_DISTRICT: Record<string, '台北市' | '新北市'>`（在 Task 5 的 dictionaries 中定義，但 schema 測試不需要）

- [ ] **Step 1: 寫失敗測試**

`packages/core/test/schema.test.ts`：
```ts
import { describe, it, expect } from 'vitest';
import { ListingSchema, ProfileSchema, DEFAULT_PROFILE, ExportFileSchema } from '../src/schema';

const now = '2026-09-05T00:00:00.000Z';
export const minimalListing = {
  id: '591:12345678', source: '591', sourceId: '12345678', url: 'https://rent.591.com.tw/12345678',
  title: '大安區精緻套房', roomType: '套房', equipment: [], photos: [],
  fetchedAt: now, updatedAt: now,
  extraction: { method: 'url', confidence: 0.3, missing: ['rent', 'district'] },
  enrichment: 'none', status: 'inbox', statusHistory: [{ status: 'inbox', at: now }],
  pinned: false, extra: {},
};

describe('ListingSchema', () => {
  it('accepts a minimal listing', () => {
    expect(ListingSchema.parse(minimalListing).id).toBe('591:12345678');
  });
  it('rejects unknown source and negative rent', () => {
    expect(() => ListingSchema.parse({ ...minimalListing, source: 'craigslist' })).toThrow();
    expect(() => ListingSchema.parse({ ...minimalListing, rent: -1 })).toThrow();
  });
});

describe('ProfileSchema', () => {
  it('DEFAULT_PROFILE matches the personal requirements in the spec', () => {
    const p = ProfileSchema.parse(DEFAULT_PROFILE);
    expect(p.budget.套房).toBe(15000);
    expect(p.budget.雅房).toBe(10000);
    expect(p.cities).toEqual(['台北市', '新北市']);
    expect(p.mrtWalkMaxMin).toBe(15);
    expect(p.mustHave).toEqual(['變頻冷氣', '冰箱', '對外窗', '洗衣機']);
    expect(p.pets.required).toBe(true);
    expect(p.dealBreakerKeywords).toContain('壁癌');
  });
});

describe('ExportFileSchema', () => {
  it('round-trips', () => {
    const file = { version: 1, exportedAt: now, profile: DEFAULT_PROFILE, listings: [minimalListing], inbox: [] };
    expect(ExportFileSchema.parse(file).listings).toHaveLength(1);
  });
});
```

- [ ] **Step 2: 執行確認失敗**

Run: `npm test -w packages/core`
Expected: FAIL，`Cannot find module '../src/schema'`。

- [ ] **Step 3: 實作 schema.ts**

```ts
import { z } from 'zod';

export const SourceSchema = z.enum(['591', 'threads', 'fb_group', 'fb_marketplace', 'ptt', 'manual', 'other']);
export const RoomTypeSchema = z.enum(['套房', '雅房', '整層', '分租', '未知']);
export const StatusSchema = z.enum(['inbox', 'shortlist', 'contacted', 'viewing', 'viewed', 'rejected', 'signed']);
export const TierSchema = z.enum(['pass', 'unknown', 'fail']);
export const PetPolicySchema = z.enum(['allowed', 'not_allowed', 'negotiable', 'unknown']);
export const ExtractionMethodSchema = z.enum(['url', 'text_regex', 'cli_fetch', 'manual', 'llm']);

export const RuleReasonSchema = z.object({
  kind: z.enum(['fail', 'unknown', 'pass', 'bonus']),
  code: z.string(),
  message: z.string(),
});
export const RuleResultSchema = z.object({
  tier: TierSchema,
  reasons: z.array(RuleReasonSchema),
  softScore: z.number().min(0).max(100),
  evaluatedAt: z.string(),
});

export const ListingSchema = z.object({
  id: z.string().min(1),
  source: SourceSchema,
  sourceId: z.string().min(1),
  url: z.url().optional(),
  title: z.string(),
  rent: z.number().int().positive().optional(),
  depositMonths: z.number().nonnegative().optional(),
  managementFee: z.number().nonnegative().optional(),
  utilitiesNote: z.string().optional(),
  roomType: RoomTypeSchema,
  layout: z.string().optional(),
  areaPing: z.number().positive().optional(),
  floor: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  address: z.string().optional(),
  mrtNearest: z.string().optional(),
  mrtWalkMin: z.number().int().nonnegative().optional(),
  equipment: z.array(z.string()),
  petPolicy: PetPolicySchema.optional(),
  availableFrom: z.string().optional(),
  photos: z.array(z.string()),
  photoHashes: z.array(z.string()).optional(),
  contactRaw: z.string().optional(),
  phoneNormalized: z.string().optional(),
  rawText: z.string().optional(),
  postedAt: z.string().optional(),
  fetchedAt: z.string(),
  updatedAt: z.string(),
  extraction: z.object({
    method: ExtractionMethodSchema,
    confidence: z.number().min(0).max(1),
    missing: z.array(z.string()),
  }),
  enrichment: z.enum(['none', 'pending', 'done', 'failed']),
  status: StatusSchema,
  statusHistory: z.array(z.object({ status: StatusSchema, at: z.string() })),
  notes: z.string().optional(),
  pinned: z.boolean(),
  rule: RuleResultSchema.optional(),
  dedupeGroupId: z.string().optional(),
  extra: z.record(z.string(), z.string()),
});

export const ProfileSchema = z.object({
  budget: z.object({
    套房: z.number().positive(),
    雅房: z.number().positive(),
    整層: z.number().positive().optional(),
    分租: z.number().positive().optional(),
  }),
  budgetTolerance: z.number().nonnegative(),
  cities: z.array(z.string()).min(1),
  mrtWalkMaxMin: z.number().int().positive(),
  mustHave: z.array(z.string()),
  pets: z.object({ required: z.boolean(), note: z.string() }),
  dealBreakerKeywords: z.array(z.string()),
  bonusKeywords: z.array(z.string()),
  moveInBefore: z.string().optional(),
});

export const InboxItemSchema = z.object({
  id: z.string().min(1),
  receivedAt: z.string(),
  title: z.string().optional(),
  text: z.string().optional(),
  url: z.string().optional(),
});

export const ExportFileSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  profile: ProfileSchema,
  listings: z.array(ListingSchema),
  inbox: z.array(InboxItemSchema),
});

export type Source = z.infer<typeof SourceSchema>;
export type RoomType = z.infer<typeof RoomTypeSchema>;
export type Status = z.infer<typeof StatusSchema>;
export type Tier = z.infer<typeof TierSchema>;
export type PetPolicy = z.infer<typeof PetPolicySchema>;
export type ExtractionMethod = z.infer<typeof ExtractionMethodSchema>;
export type RuleReason = z.infer<typeof RuleReasonSchema>;
export type RuleResult = z.infer<typeof RuleResultSchema>;
export type Listing = z.infer<typeof ListingSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type InboxItem = z.infer<typeof InboxItemSchema>;
export type ExportFile = z.infer<typeof ExportFileSchema>;

export const STATUS_ORDER: Status[] = ['inbox', 'shortlist', 'contacted', 'viewing', 'viewed', 'rejected', 'signed'];

export const DEFAULT_PROFILE: Profile = {
  budget: { 套房: 15000, 雅房: 10000 },
  budgetTolerance: 1000,
  cities: ['台北市', '新北市'],
  mrtWalkMaxMin: 15,
  mustHave: ['變頻冷氣', '冰箱', '對外窗', '洗衣機'],
  pets: { required: true, note: '2 隻貓' },
  dealBreakerKeywords: ['壁癌', '無對外窗', '壁紙', '隔音差', '不可養寵物', '禁寵', '限女', '限男', '頂加'],
  bonusKeywords: ['露台', '陽台', '可自繳', '電梯', '新裝潢', '乾濕分離'],
};
```

`packages/core/src/index.ts` 改為：
```ts
export const CORE_VERSION = '0.1.0';
export * from './schema';
```

- [ ] **Step 4: 執行確認通過**

Run: `npm test -w packages/core && npm run typecheck -w packages/core`
Expected: schema.test 全部 PASS。

- [ ] **Step 5: Commit**

```bash
git add packages/core
git commit -m "feat(core): add zod schemas for Listing, Profile, InboxItem, ExportFile"
```

---

### Task 4: 來源偵測與 URL 解析（`source.ts`）

**Files:**
- Create: `packages/core/src/source.ts`
- Modify: `packages/core/src/index.ts`
- Test: `packages/core/test/source.test.ts`

**Interfaces:**
- Produces:
  - `extractFirstUrl(text: string): string | null`
  - `parseSourceUrl(raw: string): SourceRef | null`，`SourceRef = { source: Source; sourceId: string; canonicalUrl: string }`
  - `hashId(s: string): string`（FNV-1a 32-bit hex，供無 ID 來源與 manual 文字產生穩定 ID）

- [ ] **Step 1: 寫失敗測試**

`packages/core/test/source.test.ts`：
```ts
import { describe, it, expect } from 'vitest';
import { extractFirstUrl, parseSourceUrl, hashId } from '../src/source';

describe('extractFirstUrl', () => {
  it('finds the first http(s) url and strips trailing punctuation', () => {
    expect(extractFirstUrl('看這間 https://rent.591.com.tw/18234567, 不錯')).toBe('https://rent.591.com.tw/18234567');
    expect(extractFirstUrl('沒有連結')).toBeNull();
  });
});

describe('parseSourceUrl', () => {
  it.each([
    ['https://rent.591.com.tw/18234567', '591', '18234567', 'https://rent.591.com.tw/18234567'],
    ['https://m.591.com.tw/v2/rent/18234567?x=1', '591', '18234567', 'https://rent.591.com.tw/18234567'],
    ['https://www.threads.com/@rent_tpe/post/DNG2tXiBjzN?xmt=abc', 'threads', 'DNG2tXiBjzN', 'https://www.threads.com/@rent_tpe/post/DNG2tXiBjzN'],
    ['https://www.threads.net/@rent_tpe/post/DNG2tXiBjzN', 'threads', 'DNG2tXiBjzN', 'https://www.threads.com/@rent_tpe/post/DNG2tXiBjzN'],
    ['https://www.facebook.com/marketplace/item/123456789012345/?ref=x', 'fb_marketplace', '123456789012345', 'https://www.facebook.com/marketplace/item/123456789012345/'],
    ['https://www.facebook.com/groups/taipeirent/posts/987654321/', 'fb_group', 'taipeirent:987654321', 'https://www.facebook.com/groups/taipeirent/posts/987654321/'],
    ['https://m.facebook.com/groups/12345/permalink/67890/', 'fb_group', '12345:67890', 'https://www.facebook.com/groups/12345/posts/67890/'],
    ['https://www.ptt.cc/bbs/Rent_apart/M.1725000000.A.1B2.html', 'ptt', 'M.1725000000.A.1B2', 'https://www.ptt.cc/bbs/Rent_apart/M.1725000000.A.1B2.html'],
  ])('%s → %s/%s', (url, source, id, canonical) => {
    expect(parseSourceUrl(url)).toEqual({ source, sourceId: id, canonicalUrl: canonical });
  });

  it('falls back to other with a stable hash id', () => {
    const a = parseSourceUrl('https://rent.rakuya.com.tw/rent_item/1234');
    expect(a?.source).toBe('other');
    expect(a?.sourceId).toBe(hashId('https://rent.rakuya.com.tw/rent_item/1234'));
  });

  it('returns null for non-urls', () => {
    expect(parseSourceUrl('not a url')).toBeNull();
  });
});

describe('hashId', () => {
  it('is deterministic 8-hex', () => {
    expect(hashId('abc')).toMatch(/^[0-9a-f]{8}$/);
    expect(hashId('abc')).toBe(hashId('abc'));
    expect(hashId('abc')).not.toBe(hashId('abd'));
  });
});
```

- [ ] **Step 2: 執行確認失敗**

Run: `npm test -w packages/core`
Expected: FAIL，找不到 `../src/source`。

- [ ] **Step 3: 實作 source.ts**

```ts
import type { Source } from './schema';

export interface SourceRef { source: Source; sourceId: string; canonicalUrl: string }

export function hashId(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

export function extractFirstUrl(text: string): string | null {
  const m = text.match(/https?:\/\/[^\s<>"')\]]+/);
  if (!m) return null;
  return m[0].replace(/[.,;!?，。]+$/, '');
}

export function parseSourceUrl(raw: string): SourceRef | null {
  let u: URL;
  try { u = new URL(raw.trim()); } catch { return null; }
  const host = u.hostname.replace(/^(www|m|mobile|web)\./, '');
  const path = u.pathname;

  if (host.endsWith('591.com.tw')) {
    const m = path.match(/(\d{6,9})/);
    if (m) return { source: '591', sourceId: m[1], canonicalUrl: `https://rent.591.com.tw/${m[1]}` };
    return { source: '591', sourceId: hashId(raw), canonicalUrl: raw };
  }

  if (host === 'threads.net' || host === 'threads.com') {
    const m = path.match(/^\/(@[^/]+)\/post\/([A-Za-z0-9_-]+)/);
    if (m) return { source: 'threads', sourceId: m[2], canonicalUrl: `https://www.threads.com/${m[1]}/post/${m[2]}` };
    return { source: 'threads', sourceId: hashId(raw), canonicalUrl: raw };
  }

  if (host === 'facebook.com' || host === 'fb.com') {
    const mk = path.match(/^\/marketplace\/item\/(\d+)/);
    if (mk) return { source: 'fb_marketplace', sourceId: mk[1], canonicalUrl: `https://www.facebook.com/marketplace/item/${mk[1]}/` };
    const mg = path.match(/^\/groups\/([^/]+)\/(?:permalink|posts)\/(\d+)/);
    if (mg) return { source: 'fb_group', sourceId: `${mg[1]}:${mg[2]}`, canonicalUrl: `https://www.facebook.com/groups/${mg[1]}/posts/${mg[2]}/` };
    const fbid = u.searchParams.get('story_fbid') ?? u.searchParams.get('fbid');
    if (fbid) return { source: 'fb_group', sourceId: fbid, canonicalUrl: raw };
    return { source: 'fb_group', sourceId: hashId(raw), canonicalUrl: raw };
  }

  if (host === 'ptt.cc') {
    const m = path.match(/^\/bbs\/[A-Za-z_-]+\/(M\.\d+\.A\.[0-9A-Fa-f]{3})\.html/);
    if (m) return { source: 'ptt', sourceId: m[1], canonicalUrl: `https://www.ptt.cc${path}` };
  }

  return { source: 'other', sourceId: hashId(raw), canonicalUrl: raw };
}
```

`index.ts` 加入 `export * from './source';`

- [ ] **Step 4: 執行確認通過**

Run: `npm test -w packages/core && npm run typecheck -w packages/core`
Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add packages/core
git commit -m "feat(core): detect rental source and canonical id from URLs"
```

---

### Task 5: 詞典與文字欄位抽取（`dictionaries.ts`, `extract.ts`）

**Files:**
- Create: `packages/core/src/dictionaries.ts`, `packages/core/src/extract.ts`
- Create: `packages/core/test/fixtures/posts.ts`（合成貼文樣本，不含真實個資）
- Modify: `packages/core/src/index.ts`
- Test: `packages/core/test/extract.test.ts`

**Interfaces:**
- Produces:
  - `CITY_OF_DISTRICT: Record<string, '台北市' | '新北市'>`、`ALL_DISTRICTS: string[]`
  - `EQUIPMENT_CANONICAL: string[]`（順序即輸出順序）
  - `extractFields(text: string): ExtractedFields`
  - `ExtractedFields = { rent?, depositMonths?, managementFee?, areaPing?, layout?, roomType: RoomType, city?, district?, mrtNearest?, mrtWalkMin?, phone?, petPolicy: PetPolicy, equipment: string[], bonusHits: string[] }`

- [ ] **Step 1: 建立 fixtures**

`packages/core/test/fixtures/posts.ts`（8 筆，欄位為人工標註的期望值）：
```ts
export interface PostFixture { name: string; text: string; expect: Partial<{
  rent: number; areaPing: number; layout: string; roomType: string; city: string; district: string;
  mrtNearest: string; mrtWalkMin: number; phone: string; petPolicy: string; equipment: string[];
}> }

export const POSTS: PostFixture[] = [
  { name: 'threads-套房-完整', text: `#出租 大安區獨立套房
租金 14,500/月 含管理費，押二付一
約 8 坪，1房1衛，5F/7F 有電梯
變頻冷氣、冰箱、洗衣機、對外窗採光好
捷運科技大樓站 步行 6 分
可養貓 🐱 限一隻
洽 0912-345-678`,
    expect: { rent: 14500, areaPing: 8, layout: '1房1衛', roomType: '套房', city: '台北市', district: '大安區', mrtNearest: '科技大樓站', mrtWalkMin: 6, phone: '0912345678', petPolicy: 'allowed', equipment: ['變頻冷氣', '冷氣', '冰箱', '洗衣機', '對外窗', '電梯'] } },
  { name: 'fb-雅房-禁寵', text: `【中和 雅房出租】
月租 8000 元 押金兩個月
近捷運景安站走路約10分
提供冷氣 冰箱共用 洗衣機共用
不可養寵物 限女生`,
    expect: { rent: 8000, roomType: '雅房', city: '新北市', district: '中和區', mrtNearest: '景安站', mrtWalkMin: 10, petPolicy: 'not_allowed', equipment: ['冷氣', '冰箱', '洗衣機'] } },
  { name: 'ptt-整層', text: `[無/台北/中山] 整層住家 2房1廳1衛 近行天宮
租金：28000
坪數：18坪
樓層：3F/5F
設備：變頻冷氣x2、冰箱、洗衣機、電視
聯絡：請站內信`,
    expect: { rent: 28000, areaPing: 18, layout: '2房1廳1衛', roomType: '整層', city: '台北市', district: '中山區', equipment: ['變頻冷氣', '冷氣', '冰箱', '洗衣機', '電視'] } },
  { name: '591-標題只有價格', text: `信義區精緻獨立套房 近101 $16,000元/月`,
    expect: { rent: 16000, roomType: '套房', city: '台北市', district: '信義區' } },
  { name: '分租套房-無對外窗', text: `板橋分租套房 9500 無對外窗 但有冷氣 含網路`,
    expect: { rent: 9500, roomType: '分租', city: '新北市', district: '板橋區', equipment: ['冷氣', '網路'] } },
  { name: '萬與k寫法', text: `文山區套房 1.5萬 木柵站旁 走路3分 寵物可議`,
    expect: { rent: 15000, roomType: '套房', district: '文山區', mrtNearest: '木柵站', mrtWalkMin: 3, petPolicy: 'negotiable' } },
  { name: 'k寫法', text: `新店套房 12k 含水電 大坪林站 步行約 12 分鐘 可養寵物`,
    expect: { rent: 12000, roomType: '套房', city: '新北市', district: '新店區', mrtNearest: '大坪林站', mrtWalkMin: 12, petPolicy: 'allowed' } },
  { name: '電話有國碼', text: `士林雅房 7,000 洽 +886 987 654 321`,
    expect: { rent: 7000, roomType: '雅房', district: '士林區', phone: '0987654321' } },
];
```

- [ ] **Step 2: 寫失敗測試**

`packages/core/test/extract.test.ts`：
```ts
import { describe, it, expect } from 'vitest';
import { extractFields } from '../src/extract';
import { POSTS } from './fixtures/posts';

describe('extractFields', () => {
  for (const f of POSTS) {
    it(f.name, () => {
      const got = extractFields(f.text);
      for (const [k, v] of Object.entries(f.expect)) {
        expect(got[k as keyof typeof got], k).toEqual(v);
      }
    });
  }

  it('does not treat a phone number or area as rent', () => {
    const got = extractFields('套房 洽 0912345678 約 10坪');
    expect(got.rent).toBeUndefined();
    expect(got.areaPing).toBe(10);
  });

  it('ignores negated equipment', () => {
    expect(extractFields('無對外窗 沒有洗衣機').equipment).toEqual([]);
  });

  it('defaults roomType 未知 and petPolicy unknown', () => {
    const got = extractFields('台北市大安區 房子出租');
    expect(got.roomType).toBe('未知');
    expect(got.petPolicy).toBe('unknown');
  });
});
```

- [ ] **Step 3: 執行確認失敗**

Run: `npm test -w packages/core`
Expected: FAIL，找不到 `../src/extract`。

- [ ] **Step 4: 實作 dictionaries.ts**

```ts
export const TAIPEI_DISTRICTS = ['中正', '大同', '中山', '松山', '大安', '萬華', '信義', '士林', '北投', '內湖', '南港', '文山'];
export const NEW_TAIPEI_DISTRICTS = ['板橋', '三重', '中和', '永和', '新莊', '新店', '樹林', '鶯歌', '三峽', '淡水', '汐止', '瑞芳', '土城', '蘆洲', '五股', '泰山', '林口', '深坑', '石碇', '坪林', '三芝', '石門', '八里', '平溪', '雙溪', '貢寮', '金山', '萬里', '烏來'];

export const CITY_OF_DISTRICT: Record<string, '台北市' | '新北市'> = Object.fromEntries([
  ...TAIPEI_DISTRICTS.map((d) => [`${d}區`, '台北市'] as const),
  ...NEW_TAIPEI_DISTRICTS.map((d) => [`${d}區`, '新北市'] as const),
]);
export const ALL_DISTRICTS = Object.keys(CITY_OF_DISTRICT);

/** canonical name → alias regex source (word must not be negated) */
export const EQUIPMENT_ALIASES: Array<[canonical: string, pattern: string]> = [
  ['變頻冷氣', '變頻(?:冷氣|空調)?'],
  ['冷氣', '冷氣|空調'],
  ['冰箱', '(?:電)?冰箱'],
  ['洗衣機', '洗衣機?'],
  ['對外窗', '對外窗|採光窗|大窗|落地窗'],
  ['電梯', '電梯'],
  ['陽台', '陽台'],
  ['露台', '露台|平台'],
  ['熱水器', '熱水器'],
  ['網路', '網路|wifi|光纖'],
  ['第四台', '第四台|有線電視'],
  ['電視', '電視'],
  ['床', '雙人床|單人床|床架|床墊'],
  ['衣櫃', '衣櫃|衣櫥'],
  ['書桌', '書桌|桌椅'],
  ['沙發', '沙發'],
  ['廚房', '廚房|可開伙|可煮'],
  ['烘衣機', '烘衣機|乾衣機'],
  ['乾濕分離', '乾濕分離'],
  ['微波爐', '微波爐'],
];
export const EQUIPMENT_CANONICAL = EQUIPMENT_ALIASES.map(([c]) => c);

export const NEGATION_LOOKBEHIND = '(?<!無|沒有|沒|不含|不提供|非)';

export const PET_DENY = /不可養寵|禁止寵物|禁寵|不能養寵|謝絕寵物|寵物不可|不接受寵物|不可養貓|不可養狗|寵物勿/;
export const PET_NEGOTIABLE = /寵物可議|寵物另議|寵物需洽|寵物可談|寵物再議/;
export const PET_ALLOW = /可養寵|寵物友善|可養貓|可養狗|接受寵物|可寵|歡迎寵物|可養小型/;

export const CN_NUM: Record<string, number> = { 一: 1, 二: 2, 兩: 2, 三: 3, 四: 4, 五: 5, 六: 6 };
```

- [ ] **Step 5: 實作 extract.ts**

```ts
import type { PetPolicy, RoomType } from './schema';
import { ALL_DISTRICTS, CITY_OF_DISTRICT, CN_NUM, EQUIPMENT_ALIASES, NEGATION_LOOKBEHIND, PET_ALLOW, PET_DENY, PET_NEGOTIABLE } from './dictionaries';

export interface ExtractedFields {
  rent?: number;
  depositMonths?: number;
  managementFee?: number;
  areaPing?: number;
  layout?: string;
  roomType: RoomType;
  city?: string;
  district?: string;
  mrtNearest?: string;
  mrtWalkMin?: number;
  phone?: string;
  petPolicy: PetPolicy;
  equipment: string[];
  bonusHits: string[];
}

const toInt = (s: string) => parseInt(s.replace(/,/g, ''), 10);
const MIN_RENT = 3000, MAX_RENT = 200000;
const inRentRange = (n: number) => n >= MIN_RENT && n <= MAX_RENT;

export function extractRent(text: string): number | undefined {
  // 1) explicit label
  const labeled = text.match(/(?:租金|月租|房租|價格|價錢|售價)[：:\s]*(?:NT\$?|\$)?\s*(\d{1,3}(?:,\d{3})+|\d{4,6})/);
  if (labeled && inRentRange(toInt(labeled[1]))) return toInt(labeled[1]);
  // 2) 萬 / k notation
  const wan = text.match(/(\d+(?:\.\d+)?)\s*萬/);
  if (wan && inRentRange(Math.round(parseFloat(wan[1]) * 10000))) return Math.round(parseFloat(wan[1]) * 10000);
  const k = text.match(/(?<![\d.])(\d{1,3}(?:\.\d+)?)\s*[kK](?![a-zA-Z])/);
  if (k && inRentRange(Math.round(parseFloat(k[1]) * 1000))) return Math.round(parseFloat(k[1]) * 1000);
  // 3) number followed by currency-ish suffix or preceded by $
  const suffixed = text.match(/(?:NT\$?|\$)\s*(\d{1,3}(?:,\d{3})+|\d{4,6})|(\d{1,3}(?:,\d{3})+|\d{4,6})\s*(?:元|塊|\/月|元\/月|每月|NTD)/);
  if (suffixed) {
    const n = toInt(suffixed[1] ?? suffixed[2]);
    if (inRentRange(n)) return n;
  }
  // 4) bare 4-5 digit number that is not part of a phone number, only if a room keyword exists
  if (/套房|雅房|整層|分租|出租|房/.test(text)) {
    for (const m of text.matchAll(/(?<![\d-])(\d{1,2},\d{3}|\d{4,5})(?![\d-])/g)) {
      const n = toInt(m[1]);
      if (inRentRange(n)) return n;
    }
  }
  return undefined;
}

export function extractRoomType(text: string): RoomType {
  if (/整層|整棟|整戶|住家/.test(text)) return '整層';
  if (/分租/.test(text)) return '分租';
  if (/雅房/.test(text)) return '雅房';
  if (/套房|studio/i.test(text)) return '套房';
  return '未知';
}

export function extractDistrict(text: string): { city?: string; district?: string } {
  const cityMatch = text.match(/(台北|臺北|新北)市?/);
  for (const d of ALL_DISTRICTS) {
    const bare = d.slice(0, -1);
    if (text.includes(d) || new RegExp(`(?<![\\u4e00-\\u9fa5])${bare}(?![\\u4e00-\\u9fa5])|[\\[\\/【]${bare}[\\]\\/】]|${bare}\\s|${bare}(?=套房|雅房|分租|整層|區)`).test(text)) {
      return { city: CITY_OF_DISTRICT[d], district: d };
    }
  }
  if (cityMatch) return { city: cityMatch[1].replace('臺', '台') + '市' };
  return {};
}

export function extractMrt(text: string): { mrtNearest?: string; mrtWalkMin?: number } {
  const out: { mrtNearest?: string; mrtWalkMin?: number } = {};
  // Prefer "捷運XX站"; otherwise a CJK run of 2–4 chars right before 站 at a CJK boundary.
  const st = text.match(/捷運\s*([一-龥]{2,6}?)站(?!牌)/) ?? text.match(/(?<![一-龥])(?:近|鄰近|靠近|離|距)?([一-龥]{2,4})站(?!牌|前|後)/);
  if (st) {
    const name = st[1].replace(/^(?:近|鄰近|靠近|離|距)/, '');
    if (name.length >= 2 && !/車$/.test(name)) out.mrtNearest = `${name}站`;
  }
  const walk = text.match(/(?:步行|走路|走|徒步)\s*(?:約|大約)?\s*(\d{1,2})\s*分/) ?? text.match(/捷運[^\d]{0,8}(\d{1,2})\s*分/);
  if (walk) out.mrtWalkMin = parseInt(walk[1], 10);
  return out;
}

export function extractPhone(text: string): string | undefined {
  const m = text.match(/(?:\+?886[-\s]?9|09)\d{2}[-\s]?\d{3}[-\s]?\d{3}/);
  if (!m) return undefined;
  const digits = m[0].replace(/\D/g, '');
  return digits.startsWith('886') ? '0' + digits.slice(3) : digits;
}

export function extractPetPolicy(text: string): PetPolicy {
  if (PET_DENY.test(text)) return 'not_allowed';
  if (PET_NEGOTIABLE.test(text)) return 'negotiable';
  if (PET_ALLOW.test(text)) return 'allowed';
  return 'unknown';
}

export function extractEquipment(text: string): string[] {
  const out: string[] = [];
  for (const [canonical, pattern] of EQUIPMENT_ALIASES) {
    const re = new RegExp(`${NEGATION_LOOKBEHIND}(?:${pattern})`, 'i');
    if (re.test(text)) out.push(canonical);
  }
  if (out.includes('變頻冷氣') && !out.includes('冷氣')) out.splice(out.indexOf('變頻冷氣') + 1, 0, '冷氣');
  return out;
}

export function extractFields(text: string): ExtractedFields {
  const layoutM = text.match(/([1-9])\s*房(?:\s*([1-2])\s*廳)?(?:\s*([1-3])\s*衛)?/);
  const layout = layoutM ? `${layoutM[1]}房${layoutM[2] ? layoutM[2] + '廳' : ''}${layoutM[3] ? layoutM[3] + '衛' : ''}` : undefined;
  const areaM = text.match(/(\d+(?:\.\d+)?)\s*坪/);
  const depositM = text.match(/押(?:金)?\s*([一二兩1-3])(?!\d)\s*(?:個月|個|付)?/) ?? text.match(/押([一二兩1-3])付/);
  const mgmtM = text.match(/管理費\s*[：:]?\s*(\d{3,5})/);
  const mgmtFree = /(含|免)管理費/.test(text);
  const { city, district } = extractDistrict(text);
  const mrt = extractMrt(text);
  return {
    rent: extractRent(text),
    depositMonths: depositM ? (CN_NUM[depositM[1]] ?? parseInt(depositM[1], 10)) : undefined,
    managementFee: mgmtM ? parseInt(mgmtM[1], 10) : mgmtFree ? 0 : undefined,
    areaPing: areaM ? parseFloat(areaM[1]) : undefined,
    layout,
    roomType: extractRoomType(text),
    city,
    district,
    ...mrt,
    phone: extractPhone(text),
    petPolicy: extractPetPolicy(text),
    equipment: extractEquipment(text),
    bonusHits: [],
  };
}
```

`bonusHits` 由 rules 依 Profile 計算，此處固定空陣列（保留欄位讓 PWA 顯示時型別一致）。

`index.ts` 加入 `export * from './dictionaries'; export * from './extract';`

- [ ] **Step 6: 執行、修 regex 直到 fixtures 全過**

Run: `npm test -w packages/core`
Expected: 全部 PASS。若某 fixture 失敗，先確認期望值是否合理，再調整 regex；**不得刪除 fixture**。

- [ ] **Step 7: Commit**

```bash
git add packages/core
git commit -m "feat(core): regex field extraction for rental post text with fixtures"
```

---

### Task 6: 解析總管與 Listing 建構（`parse.ts`）

**Files:**
- Create: `packages/core/src/parse.ts`
- Modify: `packages/core/src/index.ts`
- Test: `packages/core/test/parse.test.ts`

**Interfaces:**
- Produces:
  - `parseInput(input: { url?: string; text?: string; title?: string }): ParsedInput`
  - `ParsedInput = { source; sourceId; url?: string; title: string; fields: ExtractedFields; rawText: string; extraction: Listing['extraction'] }`
  - `toListing(parsed: ParsedInput, now: string, status?: Status): Listing`
  - `REQUIRED_FIELDS = ['rent', 'roomType', 'district'] as const`

- [ ] **Step 1: 寫失敗測試**

`packages/core/test/parse.test.ts`：
```ts
import { describe, it, expect } from 'vitest';
import { parseInput, toListing } from '../src/parse';
import { ListingSchema } from '../src/schema';
import { POSTS } from './fixtures/posts';

const now = '2026-09-05T00:00:00.000Z';

describe('parseInput', () => {
  it('uses url when given, and extracts url from text when not', () => {
    const a = parseInput({ url: 'https://rent.591.com.tw/18234567', title: '大安套房' });
    expect(a.source).toBe('591'); expect(a.sourceId).toBe('18234567'); expect(a.title).toBe('大安套房');
    const b = parseInput({ text: '看這個 https://www.threads.com/@x/post/ABC123 大安區套房 14000' });
    expect(b.source).toBe('threads'); expect(b.sourceId).toBe('ABC123'); expect(b.fields.rent).toBe(14000);
  });
  it('detects ptt from text signature, else manual with hash id', () => {
    const p = parseInput({ text: '作者 abc (小明) 看板 Rent_apart 標題 [無/台北/大安] 套房 租金：15000' });
    expect(p.source).toBe('ptt');
    const m = parseInput({ text: POSTS[0].text });
    expect(m.source).toBe('manual'); expect(m.sourceId).toMatch(/^[0-9a-f]{8}$/);
    expect(parseInput({ text: POSTS[0].text }).sourceId).toBe(m.sourceId);
  });
  it('title falls back to first line, then url, then default', () => {
    expect(parseInput({ text: '第一行標題\n第二行' }).title).toBe('第一行標題');
    expect(parseInput({ url: 'https://rent.591.com.tw/1' }).title).toBe('https://rent.591.com.tw/1');
    expect(parseInput({}).title).toBe('未命名房源');
  });
  it('computes confidence and missing', () => {
    const full = parseInput({ text: POSTS[0].text });
    expect(full.extraction.missing).toEqual([]);
    expect(full.extraction.confidence).toBeGreaterThan(0.8);
    const bare = parseInput({ url: 'https://rent.591.com.tw/1' });
    expect(bare.extraction.method).toBe('url');
    expect(bare.extraction.missing).toEqual(['rent', 'roomType', 'district']);
    expect(bare.extraction.confidence).toBeLessThan(0.4);
  });
});

describe('toListing', () => {
  it('produces a schema-valid listing with id source:sourceId', () => {
    const l = toListing(parseInput({ text: POSTS[0].text }), now, 'shortlist');
    expect(() => ListingSchema.parse(l)).not.toThrow();
    expect(l.id).toBe(`manual:${l.sourceId}`);
    expect(l.status).toBe('shortlist');
    expect(l.statusHistory).toEqual([{ status: 'shortlist', at: now }]);
    expect(l.rent).toBe(14500); expect(l.phoneNormalized).toBe('0912345678'); expect(l.contactRaw).toBe('0912345678');
    expect(l.enrichment).toBe('none');
  });
});
```

- [ ] **Step 2: 執行確認失敗**

Run: `npm test -w packages/core`
Expected: FAIL，找不到 `../src/parse`。

- [ ] **Step 3: 實作 parse.ts**

```ts
import type { Listing, Source, Status } from './schema';
import { extractFields, type ExtractedFields } from './extract';
import { extractFirstUrl, hashId, parseSourceUrl } from './source';

export interface ParseInput { url?: string; text?: string; title?: string }
export interface ParsedInput {
  source: Source;
  sourceId: string;
  url?: string;
  title: string;
  fields: ExtractedFields;
  rawText: string;
  extraction: Listing['extraction'];
}

export const REQUIRED_FIELDS = ['rent', 'roomType', 'district'] as const;

const WEIGHTS: Array<[key: keyof ExtractedFields, weight: number]> = [
  ['rent', 0.35], ['district', 0.2], ['roomType', 0.15], ['areaPing', 0.1], ['mrtNearest', 0.05], ['mrtWalkMin', 0.05], ['phone', 0.05], ['equipment', 0.05],
];

export function computeConfidence(fields: ExtractedFields): number {
  let c = 0;
  for (const [k, w] of WEIGHTS) {
    const v = fields[k];
    const present = Array.isArray(v) ? v.length > 0 : k === 'roomType' ? v !== '未知' : v !== undefined;
    if (present) c += w;
  }
  return Math.round(c * 100) / 100;
}

export function parseInput(input: ParseInput): ParsedInput {
  const text = (input.text ?? '').trim();
  const urlCandidate = input.url?.trim() || extractFirstUrl(text) || undefined;
  const ref = urlCandidate ? parseSourceUrl(urlCandidate) : null;

  let source: Source = ref?.source ?? 'manual';
  let sourceId = ref?.sourceId ?? '';
  if (!ref) {
    if (/看板\s*Rent_apart|\[(?:無|男|女)\/[一-龥]{2}\//.test(text)) source = 'ptt';
    sourceId = hashId(text || input.title || String(Date.now()));
  }

  const fields = extractFields([input.title ?? '', text].join('\n'));
  const firstLine = text.split('\n').map((s) => s.trim()).find((s) => s.length > 0 && !/^https?:\/\//.test(s));
  const title = (input.title?.trim() || firstLine || ref?.canonicalUrl || '未命名房源').slice(0, 80);

  const missing = REQUIRED_FIELDS.filter((k) => (k === 'roomType' ? fields.roomType === '未知' : fields[k] === undefined));
  const method: Listing['extraction']['method'] = text.length > 0 ? 'text_regex' : ref ? 'url' : 'manual';

  return {
    source, sourceId,
    url: ref?.canonicalUrl,
    title,
    fields,
    rawText: text,
    extraction: { method, confidence: computeConfidence(fields), missing: [...missing] },
  };
}

export function toListing(p: ParsedInput, now: string, status: Status = 'inbox'): Listing {
  const f = p.fields;
  return {
    id: `${p.source}:${p.sourceId}`,
    source: p.source,
    sourceId: p.sourceId,
    url: p.url,
    title: p.title,
    rent: f.rent,
    depositMonths: f.depositMonths,
    managementFee: f.managementFee,
    roomType: f.roomType,
    layout: f.layout,
    areaPing: f.areaPing,
    city: f.city,
    district: f.district,
    mrtNearest: f.mrtNearest,
    mrtWalkMin: f.mrtWalkMin,
    equipment: f.equipment,
    petPolicy: f.petPolicy,
    photos: [],
    contactRaw: f.phone,
    phoneNormalized: f.phone,
    rawText: p.rawText || undefined,
    fetchedAt: now,
    updatedAt: now,
    extraction: p.extraction,
    enrichment: 'none',
    status,
    statusHistory: [{ status, at: now }],
    pinned: false,
    extra: {},
  };
}
```

`index.ts` 加入 `export * from './parse';`

- [ ] **Step 4: 執行確認通過**

Run: `npm test -w packages/core && npm run typecheck -w packages/core`
Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add packages/core
git commit -m "feat(core): parseInput orchestrator and toListing builder"
```

---

### Task 7: 規則引擎（`rules.ts`）

**Files:**
- Create: `packages/core/src/rules.ts`
- Modify: `packages/core/src/index.ts`
- Test: `packages/core/test/rules.test.ts`

**Interfaces:**
- Produces: `evaluate(listing: Listing, profile: Profile, now?: string): RuleResult`；`TIER_LABEL: Record<Tier, string>` = `{ pass: '符合', unknown: '待確認', fail: '不符' }`

- [ ] **Step 1: 寫失敗測試**

`packages/core/test/rules.test.ts`：
```ts
import { describe, it, expect } from 'vitest';
import { evaluate, TIER_LABEL } from '../src/rules';
import { DEFAULT_PROFILE, type Listing } from '../src/schema';
import { parseInput, toListing } from '../src/parse';
import { POSTS } from './fixtures/posts';

const now = '2026-09-05T00:00:00.000Z';
const mk = (over: Partial<Listing>): Listing => ({
  ...toListing(parseInput({ text: '大安區套房 14000 變頻冷氣 冰箱 洗衣機 對外窗 可養貓 捷運古亭站 步行5分' }), now),
  ...over,
});
const codes = (l: Listing) => evaluate(l, DEFAULT_PROFILE, now).reasons.map((r) => r.code);

describe('evaluate – tiers', () => {
  it('full match → pass', () => {
    const r = evaluate(mk({}), DEFAULT_PROFILE, now);
    expect(r.tier).toBe('pass');
    expect(r.softScore).toBeGreaterThan(40);   // 4 (budget) + 30 (equipment) + 13 (mrt) + 5 (completeness)
  });
  it('over budget → fail (with tolerance)', () => {
    expect(evaluate(mk({ rent: 16000 }), DEFAULT_PROFILE, now).tier).toBe('pass');  // 15000 + 1000 tolerance
    expect(evaluate(mk({ rent: 16001 }), DEFAULT_PROFILE, now).tier).toBe('fail');
    expect(codes(mk({ rent: 20000 }))).toContain('over_budget');
  });
  it('雅房 uses 雅房 budget; 分租 falls back to 套房 budget', () => {
    expect(evaluate(mk({ roomType: '雅房', rent: 12000 }), DEFAULT_PROFILE, now).tier).toBe('fail');
    expect(evaluate(mk({ roomType: '分租', rent: 15000 }), DEFAULT_PROFILE, now).tier).toBe('pass');
  });
  it('pets not allowed → fail; unknown → unknown', () => {
    expect(codes(mk({ petPolicy: 'not_allowed' }))).toContain('pet_not_allowed');
    const r = evaluate(mk({ petPolicy: 'unknown' }), DEFAULT_PROFILE, now);
    expect(r.tier).toBe('unknown'); expect(r.reasons.map((x) => x.code)).toContain('pet_unknown');
  });
  it('deal-breaker keyword in text → fail', () => {
    expect(codes(mk({ rawText: '大安區套房 有點壁癌' }))).toContain('deal_breaker:壁癌');
  });
  it('outside cities → fail; no district → unknown', () => {
    expect(codes(mk({ city: '桃園市', district: '中壢區' }))).toContain('outside_cities');
    expect(evaluate(mk({ city: undefined, district: undefined }), DEFAULT_PROFILE, now).tier).toBe('unknown');
  });
  it('mrt too far → fail; missing → unknown', () => {
    expect(codes(mk({ mrtWalkMin: 20 }))).toContain('mrt_too_far');
    expect(codes(mk({ mrtWalkMin: undefined }))).toContain('mrt_unknown');
  });
  it('missing must-have equipment → unknown, never fail', () => {
    const r = evaluate(mk({ title: '大安區套房', equipment: ['冷氣'], rawText: '大安區套房' }), DEFAULT_PROFILE, now);
    expect(r.tier).toBe('unknown');
    expect(r.reasons.map((x) => x.code)).toContain('missing_equipment:洗衣機');
  });
  it('missing rent → unknown; missing rent but roomType 未知 and no budget → unknown', () => {
    expect(codes(mk({ rent: undefined }))).toContain('missing_rent');
  });
  it('available after moveInBefore → fail', () => {
    const p = { ...DEFAULT_PROFILE, moveInBefore: '2026-10-01' };
    expect(evaluate(mk({ availableFrom: '2026-11-01' }), p, now).reasons.map((r) => r.code)).toContain('available_too_late');
  });
  it('bonus keywords add reasons and score', () => {
    const base = evaluate(mk({}), DEFAULT_PROFILE, now).softScore;
    const withBonus = evaluate(mk({ rawText: '大安區套房 有露台 電梯' }), DEFAULT_PROFILE, now);
    expect(withBonus.reasons.some((r) => r.kind === 'bonus')).toBe(true);
    expect(withBonus.softScore).toBeGreaterThan(base);
  });
  it('fixtures: threads full post passes, fb 禁寵 fails', () => {
    expect(evaluate(toListing(parseInput({ text: POSTS[0].text }), now), DEFAULT_PROFILE, now).tier).toBe('pass');
    expect(evaluate(toListing(parseInput({ text: POSTS[1].text }), now), DEFAULT_PROFILE, now).tier).toBe('fail');
  });
  it('labels', () => { expect(TIER_LABEL.pass).toBe('符合'); });
});
```

- [ ] **Step 2: 執行確認失敗**

Run: `npm test -w packages/core`
Expected: FAIL，找不到 `../src/rules`。

- [ ] **Step 3: 實作 rules.ts**

```ts
import type { Listing, Profile, RuleReason, RuleResult, Tier } from './schema';
import { CITY_OF_DISTRICT } from './dictionaries';

export const TIER_LABEL: Record<Tier, string> = { pass: '符合', unknown: '待確認', fail: '不符' };

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function budgetFor(l: Listing, p: Profile): number | undefined {
  switch (l.roomType) {
    case '套房': return p.budget.套房;
    case '雅房': return p.budget.雅房;
    case '整層': return p.budget.整層;
    case '分租': return p.budget.分租 ?? p.budget.套房;
    default: return undefined;
  }
}

export function evaluate(l: Listing, p: Profile, now: string = new Date().toISOString()): RuleResult {
  const reasons: RuleReason[] = [];
  const hay = `${l.title}\n${l.rawText ?? ''}\n${l.equipment.join(' ')}`;
  const fail = (code: string, message: string) => reasons.push({ kind: 'fail', code, message });
  const unknown = (code: string, message: string) => reasons.push({ kind: 'unknown', code, message });
  const pass = (code: string, message: string) => reasons.push({ kind: 'pass', code, message });

  // 1) budget
  const budget = budgetFor(l, p);
  if (l.rent === undefined) unknown('missing_rent', '缺租金');
  else if (budget === undefined) {
    const maxBudget = Math.max(p.budget.套房, p.budget.雅房, p.budget.整層 ?? 0, p.budget.分租 ?? 0);
    if (l.rent > maxBudget + p.budgetTolerance) fail('over_budget', `租金 ${l.rent} 超出任何房型預算`);
    else unknown('missing_room_type', '房型不明，無法判定預算');
  } else if (l.rent > budget + p.budgetTolerance) fail('over_budget', `租金 ${l.rent} 超出 ${l.roomType} 預算 ${budget}`);
  else pass('within_budget', `租金 ${l.rent} 在預算內`);

  // 2) pets
  if (p.pets.required) {
    if (l.petPolicy === 'not_allowed') fail('pet_not_allowed', '不可養寵物');
    else if (l.petPolicy === 'allowed') pass('pet_allowed', '可養寵物');
    else if (l.petPolicy === 'negotiable') unknown('pet_negotiable', '寵物可議，需確認');
    else unknown('pet_unknown', '未提及寵物政策');
  }

  // 3) deal breakers
  for (const kw of p.dealBreakerKeywords) {
    if (kw && hay.includes(kw)) fail(`deal_breaker:${kw}`, `含「${kw}」`);
  }

  // 4) city
  const city = l.city ?? (l.district ? CITY_OF_DISTRICT[l.district] : undefined);
  if (!l.district && !city) unknown('missing_district', '缺地區');
  else if (city && !p.cities.includes(city)) fail('outside_cities', `地點 ${city} 不在範圍`);
  else pass('in_cities', `${city ?? ''}${l.district ?? ''}`.trim());

  // 5) MRT
  if (l.mrtWalkMin === undefined) unknown('mrt_unknown', '未提及捷運步行時間');
  else if (l.mrtWalkMin > p.mrtWalkMaxMin) fail('mrt_too_far', `捷運步行 ${l.mrtWalkMin} 分`);
  else pass('mrt_ok', `捷運步行 ${l.mrtWalkMin} 分`);

  // 6) must-have equipment
  let present = 0;
  for (const item of p.mustHave) {
    if (l.equipment.includes(item) || hay.includes(item)) { present++; pass(`has:${item}`, item); }
    else unknown(`missing_equipment:${item}`, `未提及${item}`);
  }

  // 7) move-in
  if (p.moveInBefore && l.availableFrom && l.availableFrom > p.moveInBefore) fail('available_too_late', `最早 ${l.availableFrom} 才可入住`);

  // 8) bonus
  let bonus = 0;
  for (const kw of p.bonusKeywords) {
    if (kw && hay.includes(kw)) { bonus++; reasons.push({ kind: 'bonus', code: `bonus:${kw}`, message: kw }); }
  }

  const tier: Tier = reasons.some((r) => r.kind === 'fail') ? 'fail' : reasons.some((r) => r.kind === 'unknown') ? 'unknown' : 'pass';

  // soft score
  const budgetScore = l.rent !== undefined && budget ? clamp((budget - l.rent) / budget, 0, 0.5) / 0.5 * 30 : 0;
  const equipScore = p.mustHave.length ? (present / p.mustHave.length) * 30 : 30;
  const mrtScore = l.mrtWalkMin !== undefined ? clamp(1 - l.mrtWalkMin / p.mrtWalkMaxMin, 0, 1) * 20 : 8;
  const bonusScore = Math.min(bonus, 2) / 2 * 10;
  const completeness = [l.rent, l.areaPing, l.district, l.mrtWalkMin, l.photos.length > 0 ? 1 : undefined, l.contactRaw].filter((v) => v !== undefined).length / 6 * 10;
  const softScore = Math.round(clamp(budgetScore + equipScore + mrtScore + bonusScore + completeness, 0, 100));

  return { tier, reasons, softScore, evaluatedAt: now };
}
```

`index.ts` 加入 `export * from './rules';`

- [ ] **Step 4: 執行確認通過**

Run: `npm test -w packages/core && npm run typecheck -w packages/core`
Expected: PASS。若 `full match → pass` 失敗，檢查測試字串是否被 `extractDistrict` 正確判為大安區、`petPolicy` 為 allowed。

- [ ] **Step 5: Commit**

```bash
git add packages/core
git commit -m "feat(core): deterministic rules engine with tiering and soft score"
```

---

### Task 8: 去重（`dedupe.ts`）

**Files:**
- Create: `packages/core/src/dedupe.ts`
- Modify: `packages/core/src/index.ts`
- Test: `packages/core/test/dedupe.test.ts`

**Interfaces:**
- Produces:
  - `normalizePhone(raw?: string): string | undefined`
  - `hammingHex(a: string, b: string): number`
  - `isLikelyDuplicate(a: Listing, b: Listing): 'phone' | 'photo' | 'fuzzy' | null`
  - `assignDedupeGroups(all: Listing[]): Map<string, string>`（listing id → group id；只以 `phone` / `photo` 建群，`fuzzy` 不入群）

- [ ] **Step 1: 寫失敗測試**

`packages/core/test/dedupe.test.ts`：
```ts
import { describe, it, expect } from 'vitest';
import { normalizePhone, hammingHex, isLikelyDuplicate, assignDedupeGroups } from '../src/dedupe';
import { parseInput, toListing } from '../src/parse';
import type { Listing } from '../src/schema';

const now = '2026-09-05T00:00:00.000Z';
const L = (text: string, over: Partial<Listing> = {}): Listing => ({ ...toListing(parseInput({ text }), now), ...over });

describe('normalizePhone', () => {
  it.each([
    ['0912-345-678', '0912345678'], ['+886 912 345 678', '0912345678'], ['886912345678', '0912345678'],
    ['02-2345-6789', '0223456789'], ['私訊', undefined], [undefined, undefined],
  ])('%s → %s', (raw, want) => { expect(normalizePhone(raw)).toBe(want); });
});

describe('hammingHex', () => {
  it('counts differing bits', () => {
    expect(hammingHex('ff00', 'ff00')).toBe(0);
    expect(hammingHex('ff00', 'ff01')).toBe(1);
    expect(hammingHex('0000', 'ffff')).toBe(16);
  });
});

describe('isLikelyDuplicate', () => {
  it('same phone → phone', () => {
    expect(isLikelyDuplicate(L('a 套房 12000 0912345678', { id: 'a' }), L('b 雅房 8000 0912-345-678', { id: 'b' }))).toBe('phone');
  });
  it('near photo hash → photo', () => {
    const a = L('大安區套房 12000', { id: 'a', photoHashes: ['ff00ff00ff00ff00'] });
    const b = L('大安區套房 12500', { id: 'b', photoHashes: ['ff00ff00ff00ff03'] });
    expect(isLikelyDuplicate(a, b)).toBe('photo');
  });
  it('same district, rent within 500, area within 1 → fuzzy', () => {
    expect(isLikelyDuplicate(L('大安區套房 12000 8坪', { id: 'a' }), L('大安區套房 12400 8.5坪', { id: 'b' }))).toBe('fuzzy');
    expect(isLikelyDuplicate(L('大安區套房 12000 8坪', { id: 'a' }), L('信義區套房 12000 8坪', { id: 'b' }))).toBeNull();
  });
});

describe('assignDedupeGroups', () => {
  it('unions by phone/photo and uses smallest id as group id', () => {
    const a = L('x 套房 12000 0912345678', { id: '591:2' });
    const b = L('y 套房 13000 0912345678', { id: 'threads:1' });
    const c = L('z 套房 9000', { id: 'ptt:3' });
    const g = assignDedupeGroups([a, b, c]);
    expect(g.get('591:2')).toBe('591:2'); expect(g.get('threads:1')).toBe('591:2'); expect(g.get('ptt:3')).toBe('ptt:3');
  });
});
```

- [ ] **Step 2: 執行確認失敗**

Run: `npm test -w packages/core`
Expected: FAIL，找不到 `../src/dedupe`。

- [ ] **Step 3: 實作 dedupe.ts**

```ts
import type { Listing } from './schema';

export function normalizePhone(raw?: string): string | undefined {
  if (!raw) return undefined;
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('886')) d = '0' + d.slice(3);
  if (/^09\d{8}$/.test(d)) return d;          // mobile
  if (/^0[2-8]\d{7,8}$/.test(d)) return d;    // landline
  return undefined;
}

export function hammingHex(a: string, b: string): number {
  if (a.length !== b.length) return Number.POSITIVE_INFINITY;
  let n = 0;
  for (let i = 0; i < a.length; i++) {
    let x = parseInt(a[i], 16) ^ parseInt(b[i], 16);
    while (x) { n += x & 1; x >>= 1; }
  }
  return n;
}

export const PHOTO_HAMMING_MAX = 6;

export function isLikelyDuplicate(a: Listing, b: Listing): 'phone' | 'photo' | 'fuzzy' | null {
  if (a.id === b.id) return null;
  const pa = normalizePhone(a.phoneNormalized ?? a.contactRaw);
  const pb = normalizePhone(b.phoneNormalized ?? b.contactRaw);
  if (pa && pb && pa === pb) return 'phone';
  for (const ha of a.photoHashes ?? []) for (const hb of b.photoHashes ?? []) {
    if (hammingHex(ha, hb) <= PHOTO_HAMMING_MAX) return 'photo';
  }
  if (a.district && a.district === b.district && a.rent !== undefined && b.rent !== undefined && Math.abs(a.rent - b.rent) <= 500) {
    const areaClose = a.areaPing === undefined || b.areaPing === undefined || Math.abs(a.areaPing - b.areaPing) <= 1;
    if (areaClose) return 'fuzzy';
  }
  return null;
}

export function assignDedupeGroups(all: Listing[]): Map<string, string> {
  const parent = new Map<string, string>(all.map((l) => [l.id, l.id]));
  const find = (x: string): string => { const p = parent.get(x)!; if (p === x) return x; const r = find(p); parent.set(x, r); return r; };
  const union = (x: string, y: string) => { const rx = find(x), ry = find(y); if (rx === ry) return; const [lo, hi] = rx < ry ? [rx, ry] : [ry, rx]; parent.set(hi, lo); };
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
    const kind = isLikelyDuplicate(all[i], all[j]);
    if (kind === 'phone' || kind === 'photo') union(all[i].id, all[j].id);
  }
  return new Map(all.map((l) => [l.id, find(l.id)]));
}
```

`index.ts` 加入 `export * from './dedupe';`

- [ ] **Step 4: 執行確認通過**

Run: `npm test -w packages/core && npm run typecheck -w packages/core`
Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add packages/core
git commit -m "feat(core): phone/photo/fuzzy duplicate detection with union-find groups"
```

---
## Phase 1B：`apps/pwa`

### Task 9: PWA 骨架（Vite + Preact + Tailwind + PWA manifest + hash router + 殼層）

**Files:**
- Create: `apps/pwa/package.json`, `apps/pwa/tsconfig.json`, `apps/pwa/vite.config.ts`, `apps/pwa/vitest.config.ts`, `apps/pwa/index.html`
- Create: `apps/pwa/scripts/gen-icons.mjs`, `apps/pwa/public/icons/icon.svg`（複製 `public/icons/icon-base.svg`）
- Create: `apps/pwa/src/main.tsx`, `apps/pwa/src/app.tsx`, `apps/pwa/src/router.ts`, `apps/pwa/src/styles.css`, `apps/pwa/src/components/BottomNav.tsx`, `apps/pwa/src/components/Toast.tsx`
- Create: `apps/pwa/test/setup.ts`, `apps/pwa/test/router.test.ts`, `apps/pwa/test/app.test.tsx`

**Interfaces:**
- Produces:
  - `useHashRoute(): Route`，`Route = { path: string; query: URLSearchParams }`
  - `navigate(path: string, opts?: { replace?: boolean }): void`
  - `matchPath(pattern: string, path: string): Record<string, string> | null`
  - `useToast()` → `{ show(message: string, kind?: 'info' | 'success' | 'error'): void }`；`<ToastHost/>`
  - `<BottomNav active={path} inboxCount={n} />`
  - CSS 變數：`--color-tier-pass: #16a34a`、`--color-tier-unknown: #d97706`、`--color-tier-fail: #6b7280`、`--color-primary: #3b82f6`

- [ ] **Step 1: 建立 package.json / tsconfig / vite / vitest 設定**

`apps/pwa/package.json`：
```json
{
  "name": "@trsat/pwa",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "e2e": "playwright test",
    "icons": "node scripts/gen-icons.mjs"
  },
  "dependencies": {
    "@trsat/core": "*",
    "dexie": "^4.4.0",
    "preact": "^10.29.0",
    "zod": "^4.5.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.63.0",
    "@preact/preset-vite": "^2.10.0",
    "@tailwindcss/vite": "^4.3.0",
    "@testing-library/preact": "^3.2.0",
    "fake-indexeddb": "^6.2.0",
    "jsdom": "^26.0.0",
    "sharp": "^0.34.0",
    "tailwindcss": "^4.3.0",
    "typescript": "^5.9.0",
    "vite": "^7.3.0",
    "vite-plugin-pwa": "^1.3.0",
    "vitest": "^3.2.0"
  }
}
```

`apps/pwa/tsconfig.json`：
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "types": ["vite/client", "vite-plugin-pwa/client"],
    "noEmit": true
  },
  "include": ["src", "test", "vite.config.ts", "vitest.config.ts"]
}
```

`apps/pwa/vite.config.ts`：
```ts
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [
    preact(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icons/*.png', 'icons/*.svg'],
      manifest: {
        name: 'TRSAT 租屋收件匣',
        short_name: '租屋收件匣',
        description: '分享房源連結或貼文，立即依個人條件分級',
        lang: 'zh-TW',
        display: 'standalone',
        start_url: './',
        scope: './',
        background_color: '#ffffff',
        theme_color: '#3b82f6',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        // spec 7.4：action 必須是 './'，GitHub Pages 無 SPA fallback
        share_target: { action: './', method: 'GET', params: { title: 'title', text: 'text', url: 'url' } },
        shortcuts: [
          { name: '收件匣', url: './#/inbox' },
          { name: '貼上房源', url: './#/inbox?paste=1' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'fonts', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: { cacheName: 'images', expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 } },
          },
        ],
      },
    }),
  ],
});
```
若 `share_target` 觸發型別錯誤，在該行上方加 `// @ts-expect-error share_target is a valid manifest member not yet in the plugin's types`。

`apps/pwa/vitest.config.ts`：
```ts
import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';
export default defineConfig({
  plugins: [preact()],
  test: { environment: 'jsdom', setupFiles: ['./test/setup.ts'], include: ['test/**/*.test.{ts,tsx}'] },
});
```

`apps/pwa/test/setup.ts`：
```ts
import 'fake-indexeddb/auto';
```

`apps/pwa/index.html`：
```html
<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#3b82f6" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <link rel="apple-touch-icon" href="./icons/icon-192.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap" />
    <title>租屋收件匣</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: 產生 icons**

```bash
cp public/icons/icon-base.svg apps/pwa/public/icons/icon.svg
```
`apps/pwa/scripts/gen-icons.mjs`：
```js
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
mkdirSync('public/icons', { recursive: true });
const svg = 'public/icons/icon.svg';
await sharp(svg).resize(192, 192).png().toFile('public/icons/icon-192.png');
await sharp(svg).resize(512, 512).png().toFile('public/icons/icon-512.png');
// maskable: 80% safe zone on solid theme colour
const inner = await sharp(svg).resize(410, 410).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#3b82f6' } })
  .composite([{ input: inner, gravity: 'centre' }]).png().toFile('public/icons/icon-maskable-512.png');
console.log('icons written');
```
Run: `npm install && npm run icons -w apps/pwa`
Expected: `apps/pwa/public/icons/` 有三個 PNG。

- [ ] **Step 3: 寫 router 測試（失敗）**

`apps/pwa/test/router.test.ts`：
```ts
import { describe, it, expect } from 'vitest';
import { parseHash, matchPath } from '../src/router';

describe('parseHash', () => {
  it('defaults to / and splits query', () => {
    expect(parseHash('')).toEqual({ path: '/', query: new URLSearchParams() });
    expect(parseHash('#/inbox?paste=1').path).toBe('/inbox');
    expect(parseHash('#/inbox?paste=1').query.get('paste')).toBe('1');
  });
});
describe('matchPath', () => {
  it('extracts params', () => {
    expect(matchPath('/l/:id', '/l/591:123')).toEqual({ id: '591:123' });
    expect(matchPath('/l/:id', '/inbox')).toBeNull();
    expect(matchPath('/', '/')).toEqual({});
  });
});
```

Run: `npm test -w apps/pwa` → Expected: FAIL（找不到 `../src/router`）。

- [ ] **Step 4: 實作 router.ts、styles.css、Toast、BottomNav、app.tsx、main.tsx**

`apps/pwa/src/router.ts`：
```ts
import { useEffect, useState } from 'preact/hooks';

export interface Route { path: string; query: URLSearchParams }

export function parseHash(hash: string): Route {
  const h = hash.replace(/^#/, '') || '/';
  const [path = '/', q = ''] = h.split('?');
  return { path: path || '/', query: new URLSearchParams(q) };
}

export function navigate(path: string, opts: { replace?: boolean } = {}): void {
  const target = `#${path}`;
  if (opts.replace) {
    history.replaceState(null, '', `${location.pathname}${location.search}${target}`);
    dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    location.hash = path;
  }
}

export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const pp = pattern.split('/').filter(Boolean);
  const cp = path.split('/').filter(Boolean);
  if (pp.length !== cp.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < pp.length; i++) {
    const p = pp[i], c = cp[i];
    if (p.startsWith(':')) params[p.slice(1)] = decodeURIComponent(c);
    else if (p !== c) return null;
  }
  return params;
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(location.hash));
  useEffect(() => {
    const on = () => setRoute(parseHash(location.hash));
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  return route;
}
```

`apps/pwa/src/styles.css`：
```css
@import "tailwindcss";

@theme {
  --font-sans: "Noto Sans TC", ui-sans-serif, system-ui, sans-serif;
  --color-primary: #3b82f6;
  --color-tier-pass: #16a34a;
  --color-tier-unknown: #d97706;
  --color-tier-fail: #6b7280;
}

html, body { height: 100%; }
body { @apply bg-gray-50 text-gray-900 antialiased; }
@media (prefers-color-scheme: dark) { body { @apply bg-gray-950 text-gray-100; } }

.safe-bottom { padding-bottom: calc(env(safe-area-inset-bottom) + 0.5rem); }
.tap { @apply min-h-11 min-w-11; } /* 44px */
```

`apps/pwa/src/components/Toast.tsx`：
```tsx
import { useEffect, useState } from 'preact/hooks';

type Kind = 'info' | 'success' | 'error';
interface ToastMsg { id: number; message: string; kind: Kind; action?: { label: string; onClick: () => void } }
const listeners = new Set<(m: ToastMsg) => void>();
let seq = 0;

export function showToast(message: string, kind: Kind = 'info', action?: ToastMsg['action']): void {
  const m: ToastMsg = { id: ++seq, message, kind, action };
  listeners.forEach((l) => l(m));
}

export function ToastHost() {
  const [items, setItems] = useState<ToastMsg[]>([]);
  useEffect(() => {
    const on = (m: ToastMsg) => {
      setItems((xs) => [...xs, m]);
      if (!m.action) setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== m.id)), 3500);
    };
    listeners.add(on);
    return () => { listeners.delete(on); };
  }, []);
  const color: Record<Kind, string> = { info: 'bg-gray-800', success: 'bg-green-700', error: 'bg-red-700' };
  return (
    <div class="fixed inset-x-0 top-3 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none" role="status" aria-live="polite">
      {items.map((m) => (
        <div key={m.id} class={`pointer-events-auto flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${color[m.kind]}`}>
          <span>{m.message}</span>
          {m.action && (
            <button class="tap rounded bg-white/20 px-3 font-medium" onClick={() => { m.action!.onClick(); setItems((xs) => xs.filter((x) => x.id !== m.id)); }}>
              {m.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

`apps/pwa/src/components/BottomNav.tsx`：
```tsx
import { navigate } from '../router';

const TABS = [
  { path: '/inbox', label: '收件匣', icon: '📥' },
  { path: '/', label: '房源', icon: '🏠' },
  { path: '/compare', label: '比較', icon: '⚖️' },
  { path: '/settings', label: '設定', icon: '⚙️' },
];

export function BottomNav({ active, inboxCount }: { active: string; inboxCount: number }) {
  return (
    <nav class="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur safe-bottom dark:border-gray-800 dark:bg-gray-900/95" aria-label="主要導覽">
      <ul class="mx-auto grid max-w-lg grid-cols-4">
        {TABS.map((t) => {
          const isActive = t.path === '/' ? active === '/' || active.startsWith('/l/') : active.startsWith(t.path);
          return (
            <li key={t.path}>
              <button
                class={`tap relative flex w-full flex-col items-center justify-center py-2 text-xs ${isActive ? 'text-primary font-semibold' : 'text-gray-500'}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => navigate(t.path)}
              >
                <span class="text-xl" aria-hidden="true">{t.icon}</span>
                <span>{t.label}</span>
                {t.path === '/inbox' && inboxCount > 0 && (
                  <span class="absolute right-1/4 top-1 rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">{inboxCount}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

`apps/pwa/src/app.tsx`（先放佔位畫面，後續 Task 逐一替換 import）：
```tsx
import { useHashRoute } from './router';
import { BottomNav } from './components/BottomNav';
import { ToastHost } from './components/Toast';

function Placeholder({ name }: { name: string }) {
  return <main class="mx-auto max-w-lg p-4 pb-24"><h1 class="text-xl font-bold">{name}</h1></main>;
}

export function App() {
  const route = useHashRoute();
  let screen;
  if (route.path === '/inbox') screen = <Placeholder name="收件匣" />;
  else if (route.path === '/compare') screen = <Placeholder name="比較" />;
  else if (route.path === '/settings') screen = <Placeholder name="設定" />;
  else if (route.path === '/share') screen = <Placeholder name="分享接收" />;
  else screen = <Placeholder name="房源" />;
  return (
    <>
      {screen}
      <BottomNav active={route.path} inboxCount={0} />
      <ToastHost />
    </>
  );
}
```

`apps/pwa/src/main.tsx`：
```tsx
import { render } from 'preact';
import { registerSW } from 'virtual:pwa-register';
import './styles.css';
import { App } from './app';
import { showToast } from './components/Toast';

const updateSW = registerSW({
  onNeedRefresh() {
    showToast('有新版本可用', 'info', { label: '更新', onClick: () => void updateSW(true) });
  },
});

if (navigator.storage?.persist) navigator.storage.persist().catch(() => undefined);

render(<App />, document.getElementById('app')!);
```

- [ ] **Step 5: 殼層渲染測試**

`apps/pwa/test/app.test.tsx`：
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { App } from '../src/app';

describe('App shell', () => {
  it('renders four tabs and defaults to 房源', () => {
    location.hash = '';
    render(<App />);
    expect(screen.getByRole('navigation', { name: '主要導覽' })).toBeTruthy();
    for (const label of ['收件匣', '房源', '比較', '設定']) expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: '房源' })).toBeTruthy();
  });
});
```
`virtual:pwa-register` 只在 `main.tsx` 使用，測試不 import main，故無需 mock。

- [ ] **Step 6: 執行測試、typecheck、build**

Run: `npm test -w apps/pwa && npm run typecheck -w apps/pwa && npm run build -w apps/pwa`
Expected: 測試 PASS；`apps/pwa/dist/manifest.webmanifest` 含 `"share_target"` 與 `"action":"./"`；`dist/sw.js` 存在。

驗證：`grep -o '"share_target":{[^}]*' apps/pwa/dist/manifest.webmanifest`

- [ ] **Step 7: Commit**

```bash
git add apps/pwa package-lock.json
git commit -m "feat(pwa): scaffold Vite+Preact PWA shell with hash router, manifest share_target, toast"
```

---

### Task 10: 資料層（Dexie）與 liveQuery hook

**Files:**
- Create: `apps/pwa/src/db.ts`, `apps/pwa/src/hooks.ts`
- Test: `apps/pwa/test/db.test.ts`

**Interfaces:**
- Produces:
  - `db: TrsatDB`（tables: `listings`, `inbox`, `profile`, `meta`, `syncLog`）
  - `getProfile(): Promise<Profile>`、`saveProfile(p: Profile): Promise<void>`（儲存後對所有 listing 重算 `rule`）
  - `upsertListing(l: Listing): Promise<Listing>`（寫入前以目前 Profile 計算 `rule`，並重算 `dedupeGroupId`）
  - `setStatus(id: string, status: Status, now?: string): Promise<void>`
  - `patchListing(id: string, patch: Partial<Listing>): Promise<void>`（更新 `updatedAt` 並重算 rule）
  - `addInbox(item: Omit<InboxItem, 'id' | 'receivedAt'>): Promise<InboxItem>`、`removeInbox(id): Promise<void>`
  - `exportAll(): Promise<ExportFile>`、`importAll(raw: unknown): Promise<{ imported: number; skipped: number; errors: string[] }>`
  - `clearAll(): Promise<void>`
  - `useLive<T>(querier: () => Promise<T>, deps: unknown[], initial: T): T`
  - `getCompareIds(): Promise<string[]>`、`toggleCompare(id): Promise<string[]>`（存 `meta.compare`，最多 3）

- [ ] **Step 1: 寫失敗測試**

`apps/pwa/test/db.test.ts`：
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { DEFAULT_PROFILE, parseInput, toListing } from '@trsat/core';
import { db, getProfile, saveProfile, upsertListing, setStatus, patchListing, addInbox, exportAll, importAll, clearAll, toggleCompare, getCompareIds } from '../src/db';

const now = '2026-09-05T00:00:00.000Z';
const mk = (text: string) => toListing(parseInput({ text }), now, 'shortlist');

beforeEach(async () => { await clearAll(); });

describe('profile', () => {
  it('returns DEFAULT_PROFILE when empty and persists changes', async () => {
    expect(await getProfile()).toEqual(DEFAULT_PROFILE);
    await saveProfile({ ...DEFAULT_PROFILE, mrtWalkMaxMin: 10 });
    expect((await getProfile()).mrtWalkMaxMin).toBe(10);
  });
});

describe('listings', () => {
  it('upsert computes rule and dedupe group', async () => {
    const a = await upsertListing(mk('大安區套房 14000 變頻冷氣 冰箱 洗衣機 對外窗 可養貓 捷運古亭站 步行5分 0912345678'));
    expect(a.rule?.tier).toBe('pass');
    const b = await upsertListing(mk('信義區雅房 9000 0912-345-678'));
    expect((await db.listings.get(b.id))?.dedupeGroupId).toBe((await db.listings.get(a.id))?.dedupeGroupId);
  });
  it('saveProfile recomputes rules', async () => {
    const a = await upsertListing(mk('大安區套房 14000 變頻冷氣 冰箱 洗衣機 對外窗 可養貓 捷運古亭站 步行5分'));
    await saveProfile({ ...DEFAULT_PROFILE, budget: { 套房: 10000, 雅房: 8000 } });
    expect((await db.listings.get(a.id))?.rule?.tier).toBe('fail');
  });
  it('setStatus appends history; patchListing bumps updatedAt', async () => {
    const a = await upsertListing(mk('大安區套房 14000'));
    await setStatus(a.id, 'contacted', '2026-09-06T00:00:00.000Z');
    const got = await db.listings.get(a.id);
    expect(got?.status).toBe('contacted');
    expect(got?.statusHistory.at(-1)).toEqual({ status: 'contacted', at: '2026-09-06T00:00:00.000Z' });
    await patchListing(a.id, { rent: 13000 });
    const p = await db.listings.get(a.id);
    expect(p?.rent).toBe(13000); expect(p!.updatedAt > now).toBe(true);
  });
});

describe('inbox / compare', () => {
  it('addInbox generates id and receivedAt', async () => {
    const i = await addInbox({ text: 'hello' });
    expect(i.id).toBeTruthy(); expect(i.receivedAt).toBeTruthy();
    expect(await db.inbox.count()).toBe(1);
  });
  it('toggleCompare caps at 3', async () => {
    for (const id of ['a', 'b', 'c']) await toggleCompare(id);
    expect(await toggleCompare('d')).toEqual(['a', 'b', 'c']);
    expect(await toggleCompare('a')).toEqual(['b', 'c']);
    expect(await getCompareIds()).toEqual(['b', 'c']);
  });
});

describe('export / import', () => {
  it('round-trips and merges by updatedAt', async () => {
    const a = await upsertListing(mk('大安區套房 14000'));
    const file = await exportAll();
    expect(file.version).toBe(1); expect(file.listings).toHaveLength(1);
    await clearAll();
    const older = { ...file, listings: [{ ...a, rent: 9999, updatedAt: '2020-01-01T00:00:00.000Z' }] };
    await importAll(file);
    const r = await importAll(older);
    expect(r.skipped).toBe(1);
    expect((await db.listings.get(a.id))?.rent).toBe(14000);
    const bad = await importAll({ version: 1, listings: [{ id: 'x' }] });
    expect(bad.errors.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: 執行確認失敗**

Run: `npm test -w apps/pwa`
Expected: FAIL，找不到 `../src/db`。

- [ ] **Step 3: 實作 db.ts**

```ts
import Dexie, { type EntityTable } from 'dexie';
import {
  DEFAULT_PROFILE, ExportFileSchema, ListingSchema, ProfileSchema, assignDedupeGroups, evaluate,
  type ExportFile, type InboxItem, type Listing, type Profile, type Status,
} from '@trsat/core';

interface ProfileRow { key: 'profile'; value: Profile; updatedAt: string }
interface MetaRow { key: string; value: string }
interface SyncLogRow { id?: number; at: string; kind: 'export' | 'import' | 'enrich'; detail: string }

export class TrsatDB extends Dexie {
  listings!: EntityTable<Listing, 'id'>;
  inbox!: EntityTable<InboxItem, 'id'>;
  profile!: EntityTable<ProfileRow, 'key'>;
  meta!: EntityTable<MetaRow, 'key'>;
  syncLog!: EntityTable<SyncLogRow, 'id'>;
  constructor(name = 'trsat') {
    super(name);
    this.version(1).stores({
      listings: 'id, status, source, district, updatedAt, dedupeGroupId',
      inbox: 'id, receivedAt',
      profile: 'key',
      meta: 'key',
      syncLog: '++id, at',
    });
  }
}

export const db = new TrsatDB();
const nowIso = () => new Date().toISOString();
const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export async function getProfile(): Promise<Profile> {
  const row = await db.profile.get('profile');
  return row ? ProfileSchema.parse(row.value) : DEFAULT_PROFILE;
}

export async function saveProfile(p: Profile): Promise<void> {
  const value = ProfileSchema.parse(p);
  await db.transaction('rw', db.profile, db.listings, async () => {
    await db.profile.put({ key: 'profile', value, updatedAt: nowIso() });
    await recomputeRules(value);
  });
}

async function recomputeRules(profile: Profile): Promise<void> {
  const all = await db.listings.toArray();
  const at = nowIso();
  const groups = assignDedupeGroups(all);
  await db.listings.bulkPut(all.map((l) => ({ ...l, rule: evaluate(l, profile, at), dedupeGroupId: groups.get(l.id) })));
}

export async function upsertListing(l: Listing): Promise<Listing> {
  const listing = ListingSchema.parse(l);
  return db.transaction('rw', db.profile, db.listings, async () => {
    const profile = await getProfile();
    const withRule: Listing = { ...listing, rule: evaluate(listing, profile) };
    await db.listings.put(withRule);
    const all = await db.listings.toArray();
    const groups = assignDedupeGroups(all);
    const changed = all.filter((x) => x.dedupeGroupId !== groups.get(x.id)).map((x) => ({ ...x, dedupeGroupId: groups.get(x.id) }));
    if (changed.length) await db.listings.bulkPut(changed);
    return (await db.listings.get(withRule.id))!;
  });
}

export async function patchListing(id: string, patch: Partial<Listing>): Promise<void> {
  await db.transaction('rw', db.profile, db.listings, async () => {
    const cur = await db.listings.get(id);
    if (!cur) return;
    const profile = await getProfile();
    const next: Listing = { ...cur, ...patch, id, updatedAt: nowIso() };
    next.rule = evaluate(next, profile);
    await db.listings.put(ListingSchema.parse(next));
  });
}

export async function setStatus(id: string, status: Status, at: string = nowIso()): Promise<void> {
  const cur = await db.listings.get(id);
  if (!cur) return;
  await db.listings.put({ ...cur, status, statusHistory: [...cur.statusHistory, { status, at }], updatedAt: at });
}

export async function addInbox(item: Omit<InboxItem, 'id' | 'receivedAt'>): Promise<InboxItem> {
  const row: InboxItem = { id: uid(), receivedAt: nowIso(), ...item };
  await db.inbox.put(row);
  return row;
}
export async function removeInbox(id: string): Promise<void> { await db.inbox.delete(id); }

export async function getCompareIds(): Promise<string[]> {
  const row = await db.meta.get('compare');
  return row ? (JSON.parse(row.value) as string[]) : [];
}
export async function toggleCompare(id: string): Promise<string[]> {
  const cur = await getCompareIds();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= 3 ? cur : [...cur, id];
  await db.meta.put({ key: 'compare', value: JSON.stringify(next) });
  return next;
}

export async function exportAll(): Promise<ExportFile> {
  const file: ExportFile = { version: 1, exportedAt: nowIso(), profile: await getProfile(), listings: await db.listings.toArray(), inbox: await db.inbox.toArray() };
  await db.syncLog.add({ at: file.exportedAt, kind: 'export', detail: `${file.listings.length} listings` });
  return file;
}

export async function importAll(raw: unknown): Promise<{ imported: number; skipped: number; errors: string[] }> {
  const errors: string[] = [];
  const parsed = ExportFileSchema.safeParse(raw);
  if (!parsed.success) {
    // try to salvage individual listings
    const listings = (raw as { listings?: unknown[] })?.listings ?? [];
    const good: Listing[] = [];
    listings.forEach((l, i) => { const r = ListingSchema.safeParse(l); if (r.success) good.push(r.data); else errors.push(`listings[${i}]: ${r.error.issues[0]?.message ?? 'invalid'}`); });
    if (good.length === 0) { errors.unshift(`檔案格式不符：${parsed.error.issues[0]?.message ?? 'invalid'}`); return { imported: 0, skipped: 0, errors }; }
    return { ...(await mergeListings(good)), errors };
  }
  const res = await mergeListings(parsed.data.listings);
  if (parsed.data.inbox.length) await db.inbox.bulkPut(parsed.data.inbox);
  return { ...res, errors };
}

async function mergeListings(incoming: Listing[]): Promise<{ imported: number; skipped: number }> {
  let imported = 0, skipped = 0;
  await db.transaction('rw', db.profile, db.listings, db.syncLog, async () => {
    const profile = await getProfile();
    for (const l of incoming) {
      const cur = await db.listings.get(l.id);
      if (cur && cur.updatedAt >= l.updatedAt) { skipped++; continue; }
      await db.listings.put({ ...l, rule: evaluate(l, profile) });
      imported++;
    }
    await recomputeRules(profile);
    await db.syncLog.add({ at: nowIso(), kind: 'import', detail: `${imported} imported, ${skipped} skipped` });
  });
  return { imported, skipped };
}

export async function clearAll(): Promise<void> {
  await db.transaction('rw', db.listings, db.inbox, db.profile, db.meta, db.syncLog, async () => {
    await Promise.all([db.listings.clear(), db.inbox.clear(), db.profile.clear(), db.meta.clear(), db.syncLog.clear()]);
  });
}
```

`apps/pwa/src/hooks.ts`：
```ts
import { liveQuery } from 'dexie';
import { useEffect, useState } from 'preact/hooks';

export function useLive<T>(querier: () => Promise<T>, deps: unknown[], initial: T): T {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    const sub = liveQuery(querier).subscribe({ next: (v) => setValue(v as T), error: (e) => console.error(e) });
    return () => sub.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return value;
}
```

- [ ] **Step 4: 執行確認通過**

Run: `npm test -w apps/pwa && npm run typecheck -w apps/pwa`
Expected: PASS。若 `dedupeGroupId` 測試失敗，確認 `upsertListing` 的第二筆文字含可被 `extractPhone` 解析的電話（`0912-345-678`）。

- [ ] **Step 5: Commit**

```bash
git add apps/pwa
git commit -m "feat(pwa): Dexie data layer with profile, listings, inbox, compare, export/import"
```

---

### Task 11: Share 接收流程與預覽卡（TierBadge、RuleChecklist、PasteSheet、Share 畫面）

**Files:**
- Create: `apps/pwa/src/lib/share.ts`, `apps/pwa/src/lib/format.ts`
- Create: `apps/pwa/src/components/TierBadge.tsx`, `apps/pwa/src/components/RuleChecklist.tsx`, `apps/pwa/src/components/PreviewCard.tsx`, `apps/pwa/src/components/PasteSheet.tsx`
- Create: `apps/pwa/src/screens/Share.tsx`
- Modify: `apps/pwa/src/app.tsx`（啟動時讀 share query、掛 Share 畫面）
- Test: `apps/pwa/test/share.test.tsx`

**Interfaces:**
- Produces:
  - `readSharePayload(search: string): SharePayload | null`，`SharePayload = { title?: string; text?: string; url?: string }`
  - `stashShare(p: SharePayload)` / `takeShare(): SharePayload | null`（sessionStorage key `trsat:share`）
  - `formatRent(n?: number): string`（`NT$14,500` 或 `—`）、`formatArea(n?: number)`、`sourceLabel(s: Source): string`
  - `<TierBadge tier />`、`<RuleChecklist result />`、`<PreviewCard listing onChange />`（可就地修正租金／區／房型）
  - `<PasteSheet open onClose onSubmit(payload) />`
  - Share 畫面三動作：`加入房源`（status `shortlist`）、`先放收件匣`、`略過`

- [ ] **Step 1: 寫失敗測試**

`apps/pwa/test/share.test.tsx`：
```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { readSharePayload, stashShare, takeShare } from '../src/lib/share';
import { ShareScreen } from '../src/screens/Share';
import { db, clearAll } from '../src/db';

beforeEach(async () => { await clearAll(); sessionStorage.clear(); location.hash = ''; });

describe('readSharePayload', () => {
  it('returns null without share params', () => { expect(readSharePayload('')).toBeNull(); });
  it('pulls url out of text (Android puts the link in text)', () => {
    const p = readSharePayload('?text=' + encodeURIComponent('大安套房 https://rent.591.com.tw/18234567'));
    expect(p?.url).toBe('https://rent.591.com.tw/18234567');
  });
  it('stash/take is one-shot', () => {
    stashShare({ text: 'x' });
    expect(takeShare()).toEqual({ text: 'x' });
    expect(takeShare()).toBeNull();
  });
});

describe('ShareScreen', () => {
  const text = '大安區獨立套房\n租金 14,500/月\n變頻冷氣 冰箱 洗衣機 對外窗\n可養貓 捷運科技大樓站 步行6分';
  it('shows parsed preview and tier, and 加入 writes a shortlist listing', async () => {
    stashShare({ text });
    render(<ShareScreen />);
    await screen.findByText('NT$14,500');
    expect(screen.getByText('符合')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '加入房源' }));
    await waitFor(async () => expect(await db.listings.count()).toBe(1));
    const l = (await db.listings.toArray())[0];
    expect(l.status).toBe('shortlist'); expect(l.rent).toBe(14500);
    expect(location.hash).toBe('#/');
  });
  it('先放收件匣 stores the raw payload', async () => {
    stashShare({ text: '中和雅房 8000' });
    render(<ShareScreen />);
    fireEvent.click(await screen.findByRole('button', { name: '先放收件匣' }));
    await waitFor(async () => expect(await db.inbox.count()).toBe(1));
    expect(location.hash).toBe('#/inbox');
  });
  it('low confidence disables 加入 until user confirms a field', async () => {
    stashShare({ url: 'https://rent.591.com.tw/18234567' });
    render(<ShareScreen />);
    const add = await screen.findByRole('button', { name: '加入房源' });
    expect((add as HTMLButtonElement).disabled).toBe(true);
    fireEvent.input(screen.getByLabelText('租金'), { target: { value: '15000' } });
    await waitFor(() => expect((screen.getByRole('button', { name: '加入房源' }) as HTMLButtonElement).disabled).toBe(false));
  });
});
```

- [ ] **Step 2: 執行確認失敗**

Run: `npm test -w apps/pwa`
Expected: FAIL，找不到 `../src/lib/share`。

- [ ] **Step 3: 實作 lib/share.ts、lib/format.ts**

`apps/pwa/src/lib/share.ts`：
```ts
import { extractFirstUrl } from '@trsat/core';

export interface SharePayload { title?: string; text?: string; url?: string }
const KEY = 'trsat:share';

export function readSharePayload(search: string): SharePayload | null {
  const q = new URLSearchParams(search);
  const title = q.get('title') ?? undefined;
  const text = q.get('text') ?? undefined;
  let url = q.get('url') ?? undefined;
  if (!title && !text && !url) return null;
  if (!url && text) url = extractFirstUrl(text) ?? undefined;
  if (!url && title) url = extractFirstUrl(title) ?? undefined;
  return { title, text, url };
}

export function stashShare(p: SharePayload): void { sessionStorage.setItem(KEY, JSON.stringify(p)); }
export function takeShare(): SharePayload | null {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  sessionStorage.removeItem(KEY);
  try { return JSON.parse(raw) as SharePayload; } catch { return null; }
}
```

`apps/pwa/src/lib/format.ts`：
```ts
import type { Source, Status } from '@trsat/core';

export const formatRent = (n?: number) => (n === undefined ? '—' : `NT$${n.toLocaleString('zh-TW')}`);
export const formatArea = (n?: number) => (n === undefined ? '—' : `${n} 坪`);
export const SOURCE_LABEL: Record<Source, string> = { '591': '591', threads: 'Threads', fb_group: 'FB 社團', fb_marketplace: 'FB Marketplace', ptt: 'PTT', manual: '手動', other: '其他' };
export const sourceLabel = (s: Source) => SOURCE_LABEL[s];
export const STATUS_LABEL: Record<Status, string> = { inbox: '收件匣', shortlist: '候選', contacted: '已聯絡', viewing: '約看房', viewed: '已看房', rejected: '淘汰', signed: '已簽約' };
export const mapsUrl = (l: { address?: string; district?: string; city?: string; title: string }) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.address ?? `${l.city ?? ''}${l.district ?? ''} ${l.title}`)}`;
```

- [ ] **Step 4: 實作 TierBadge、RuleChecklist、PreviewCard、PasteSheet**

`apps/pwa/src/components/TierBadge.tsx`：
```tsx
import { TIER_LABEL, type Tier } from '@trsat/core';
const cls: Record<Tier, string> = { pass: 'bg-tier-pass', unknown: 'bg-tier-unknown', fail: 'bg-tier-fail' };
export function TierBadge({ tier, size = 'md' }: { tier: Tier; size?: 'sm' | 'md' }) {
  return <span class={`inline-flex items-center rounded-full text-white ${cls[tier]} ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs font-medium'}`}>{TIER_LABEL[tier]}</span>;
}
```

`apps/pwa/src/components/RuleChecklist.tsx`：
```tsx
import type { RuleResult } from '@trsat/core';
const icon = { pass: '✓', unknown: '?', fail: '✗', bonus: '＋' } as const;
const color = { pass: 'text-tier-pass', unknown: 'text-tier-unknown', fail: 'text-red-600', bonus: 'text-primary' } as const;
export function RuleChecklist({ result, compact = false }: { result: RuleResult; compact?: boolean }) {
  const order = { fail: 0, unknown: 1, bonus: 2, pass: 3 };
  const items = [...result.reasons].sort((a, b) => order[a.kind] - order[b.kind]);
  const shown = compact ? items.filter((r) => r.kind !== 'pass').slice(0, 3) : items;
  return (
    <ul class={`space-y-1 ${compact ? 'text-xs' : 'text-sm'}`} aria-label="條件檢核">
      {shown.map((r) => (
        <li key={r.code} class="flex gap-2"><span class={`w-4 font-bold ${color[r.kind]}`} aria-hidden="true">{icon[r.kind]}</span><span>{r.message}</span></li>
      ))}
      {shown.length === 0 && <li class="text-gray-500">全部條件符合</li>}
    </ul>
  );
}
```

`apps/pwa/src/components/PreviewCard.tsx`（可編輯三個必要欄位）：
```tsx
import type { JSX } from 'preact';
import { RoomTypeSchema, ALL_DISTRICTS, type Listing, type RoomType } from '@trsat/core';
import { TierBadge } from './TierBadge';
import { RuleChecklist } from './RuleChecklist';
import { formatRent, sourceLabel } from '../lib/format';

export function PreviewCard({ listing, onChange }: { listing: Listing; onChange: (patch: Partial<Listing>) => void }) {
  const missing = new Set(listing.extraction.missing);
  const field = (label: string, key: 'rent' | 'district' | 'roomType', input: JSX.Element) => (
    <label class={`flex flex-col gap-1 text-xs ${missing.has(key) ? 'text-tier-unknown' : 'text-gray-500'}`}>
      {label}{missing.has(key) && '（未偵測到，請補）'}
      {input}
    </label>
  );
  return (
    <section class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900" aria-label="房源預覽">
      <div class="mb-2 flex items-center justify-between">
        <span class="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">{sourceLabel(listing.source)}</span>
        {listing.rule && <TierBadge tier={listing.rule.tier} />}
      </div>
      <h2 class="mb-1 line-clamp-2 text-base font-semibold">{listing.title}</h2>
      <p class="mb-3 text-2xl font-bold">{formatRent(listing.rent)}<span class="ml-1 text-sm font-normal text-gray-500">/月</span></p>
      <div class="mb-3 grid grid-cols-3 gap-2">
        {field('租金', 'rent', <input class="tap rounded border px-2 dark:bg-gray-800" type="number" inputMode="numeric" value={listing.rent ?? ''} aria-label="租金"
          onInput={(e) => { const v = parseInt((e.target as HTMLInputElement).value, 10); onChange({ rent: Number.isFinite(v) && v > 0 ? v : undefined }); }} />)}
        {field('區', 'district', <select class="tap rounded border px-2 dark:bg-gray-800" value={listing.district ?? ''} aria-label="區"
          onChange={(e) => onChange({ district: (e.target as HTMLSelectElement).value || undefined })}>
          <option value="">—</option>{ALL_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}</select>)}
        {field('房型', 'roomType', <select class="tap rounded border px-2 dark:bg-gray-800" value={listing.roomType} aria-label="房型"
          onChange={(e) => onChange({ roomType: (e.target as HTMLSelectElement).value as RoomType })}>
          {RoomTypeSchema.options.map((t) => <option key={t} value={t}>{t}</option>)}</select>)}
      </div>
      {listing.rule && <RuleChecklist result={listing.rule} compact />}
    </section>
  );
}
```

`apps/pwa/src/components/PasteSheet.tsx`：
```tsx
import { useState } from 'preact/hooks';
import type { SharePayload } from '../lib/share';

export function PasteSheet({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (p: SharePayload) => void }) {
  const [text, setText] = useState('');
  if (!open) return null;
  const readClipboard = async () => {
    try { setText((await navigator.clipboard.readText()) ?? ''); } catch { /* permission denied: user types manually */ }
  };
  return (
    <div class="fixed inset-0 z-50 flex items-end bg-black/40" role="dialog" aria-modal="true" aria-label="貼上房源">
      <div class="w-full rounded-t-2xl bg-white p-4 safe-bottom dark:bg-gray-900">
        <div class="mb-2 flex items-center justify-between">
          <h2 class="text-base font-semibold">貼上連結或貼文</h2>
          <button class="tap px-2 text-gray-500" onClick={onClose} aria-label="關閉">✕</button>
        </div>
        <textarea class="mb-3 h-40 w-full rounded-lg border p-3 text-sm dark:bg-gray-800" placeholder="貼上 591 / Threads / FB / PTT 連結，或整段貼文文字"
          value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} aria-label="貼上內容" />
        <div class="flex gap-2">
          <button class="tap flex-1 rounded-lg border px-3 text-sm" onClick={readClipboard}>從剪貼簿讀取</button>
          <button class="tap flex-1 rounded-lg bg-primary px-3 text-sm font-medium text-white disabled:opacity-40" disabled={!text.trim()}
            onClick={() => { onSubmit({ text: text.trim() }); setText(''); }}>解析</button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 實作 Share 畫面**

`apps/pwa/src/screens/Share.tsx`：
```tsx
import { useEffect, useMemo, useState } from 'preact/hooks';
import { DEFAULT_PROFILE, evaluate, parseInput, toListing, type Listing, type Profile } from '@trsat/core';
import { addInbox, getProfile, upsertListing } from '../db';
import { navigate } from '../router';
import { takeShare, type SharePayload } from '../lib/share';
import { PreviewCard } from '../components/PreviewCard';
import { showToast } from '../components/Toast';

export function buildPreview(p: SharePayload, profile: Profile, now = new Date().toISOString()): Listing {
  const l = toListing(parseInput(p), now, 'shortlist');
  return { ...l, rule: evaluate(l, profile, now) };
}

export function ShareScreen({ payload }: { payload?: SharePayload }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [share] = useState<SharePayload | null>(() => payload ?? takeShare());
  const [edits, setEdits] = useState<Partial<Listing>>({});
  useEffect(() => { getProfile().then(setProfile); }, []);

  const listing = useMemo(() => {
    if (!share) return null;
    const base = buildPreview(share, profile);
    const merged: Listing = { ...base, ...edits };
    const missing = base.extraction.missing.filter((k) => (k === 'roomType' ? merged.roomType === '未知' : (merged as Record<string, unknown>)[k] === undefined));
    return { ...merged, extraction: { ...merged.extraction, method: Object.keys(edits).length ? 'manual' : merged.extraction.method, missing }, rule: evaluate(merged, profile) };
  }, [share, profile, edits]);

  if (!share || !listing) {
    return <main class="mx-auto max-w-lg p-4 pb-24"><p class="text-gray-500">沒有待處理的分享內容。</p><button class="tap mt-3 rounded-lg border px-4" onClick={() => navigate('/inbox')}>前往收件匣</button></main>;
  }

  const lowConfidence = listing.extraction.confidence < 0.5 && listing.extraction.missing.length > 0;

  const add = async () => {
    try { await upsertListing(listing); }
    catch (e) { showToast(`儲存失敗（${(e as Error).name === 'QuotaExceededError' ? '儲存空間不足，請先到設定匯出備份' : (e as Error).message}）`, 'error'); return; }
    showToast('已加入房源', 'success'); navigate('/', { replace: true });
  };
  const toInbox = async () => { await addInbox(share); showToast('已放入收件匣'); navigate('/inbox', { replace: true }); };
  const skip = () => navigate('/inbox', { replace: true });

  return (
    <main class="mx-auto max-w-lg p-4 pb-24">
      <h1 class="mb-3 text-lg font-bold">收到房源</h1>
      <PreviewCard listing={listing} onChange={(patch) => setEdits((e) => ({ ...e, ...patch }))} />
      {lowConfidence && <p class="mt-2 text-xs text-tier-unknown">解析信心不足，請至少補一個必要欄位（租金／區／房型）後再加入。</p>}
      <div class="mt-4 grid grid-cols-3 gap-2">
        <button class="tap rounded-lg border px-2 text-sm" onClick={skip}>略過</button>
        <button class="tap rounded-lg border px-2 text-sm" onClick={toInbox}>先放收件匣</button>
        <button class="tap rounded-lg bg-primary px-2 text-sm font-medium text-white disabled:opacity-40" disabled={lowConfidence} onClick={add}>加入房源</button>
      </div>
      {listing.rawText && <details class="mt-4 text-sm text-gray-600"><summary>原文</summary><pre class="whitespace-pre-wrap">{listing.rawText}</pre></details>}
    </main>
  );
}
```

- [ ] **Step 6: 在 app.tsx 掛上啟動偵測與 Share 畫面**

修改 `apps/pwa/src/app.tsx`：
```tsx
import { useEffect } from 'preact/hooks';
import { useHashRoute, navigate } from './router';
import { BottomNav } from './components/BottomNav';
import { ToastHost } from './components/Toast';
import { ShareScreen } from './screens/Share';
import { readSharePayload, stashShare } from './lib/share';
import { useLive } from './hooks';
import { db } from './db';

function Placeholder({ name }: { name: string }) {
  return <main class="mx-auto max-w-lg p-4 pb-24"><h1 class="text-xl font-bold">{name}</h1></main>;
}

export function App() {
  const route = useHashRoute();
  const inboxCount = useLive(() => db.inbox.count(), [], 0);

  useEffect(() => {
    const p = readSharePayload(location.search);
    if (p) {
      stashShare(p);
      history.replaceState(null, '', `${location.pathname}#/share`);
      dispatchEvent(new HashChangeEvent('hashchange'));
    }
  }, []);

  let screen;
  if (route.path === '/share') screen = <ShareScreen />;
  else if (route.path === '/inbox') screen = <Placeholder name="收件匣" />;
  else if (route.path === '/compare') screen = <Placeholder name="比較" />;
  else if (route.path === '/settings') screen = <Placeholder name="設定" />;
  else screen = <Placeholder name="房源" />;

  return (
    <>
      {screen}
      <BottomNav active={route.path} inboxCount={inboxCount} />
      <ToastHost />
    </>
  );
}
```
（`navigate` 匯入保留給後續 Task 使用；若 lint 抱怨未使用，可先移除。）

- [ ] **Step 7: 執行確認通過**

Run: `npm test -w apps/pwa && npm run typecheck -w apps/pwa`
Expected: share.test 全部 PASS、app.test 仍 PASS。

- [ ] **Step 8: Commit**

```bash
git add apps/pwa
git commit -m "feat(pwa): share_target intake with editable preview card and tier checklist"
```

---
### Task 12: 收件匣畫面（Inbox）與貼上入口

**Files:**
- Create: `apps/pwa/src/screens/Inbox.tsx`, `apps/pwa/src/components/SwipeCard.tsx`
- Modify: `apps/pwa/src/app.tsx`（以 `InboxScreen` 取代佔位）
- Test: `apps/pwa/test/inbox.test.tsx`

**Interfaces:**
- Consumes: `buildPreview(payload, profile)`（Task 11）、`db.inbox`、`upsertListing`、`removeInbox`、`getProfile`、`PasteSheet`、`stashShare`、`navigate`
- Produces: `<SwipeCard onSwipeRight onSwipeLeft>`（pointer 事件，位移 ≥ 80px 觸發）、`<InboxScreen />`

- [ ] **Step 1: 寫失敗測試**

`apps/pwa/test/inbox.test.tsx`：
```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { InboxScreen } from '../src/screens/Inbox';
import { addInbox, clearAll, db } from '../src/db';

beforeEach(async () => { await clearAll(); location.hash = '#/inbox'; });

describe('InboxScreen', () => {
  it('shows empty state with paste button', async () => {
    render(<InboxScreen query={new URLSearchParams()} />);
    expect(await screen.findByText(/從 591 \/ Threads \/ FB 分享到此 App/)).toBeTruthy();
    expect(screen.getByRole('button', { name: '貼上文字或連結' })).toBeTruthy();
  });
  it('lists items with parsed preview; 加入 moves to listings, 略過 removes', async () => {
    await addInbox({ text: '大安區套房 14000 可養貓' });
    await addInbox({ text: '中和雅房 8000' });
    render(<InboxScreen query={new URLSearchParams()} />);
    await screen.findByText('NT$14,000');
    const addButtons = await screen.findAllByRole('button', { name: '加入' });
    fireEvent.click(addButtons[0]);
    await waitFor(async () => expect(await db.listings.count()).toBe(1));
    await waitFor(async () => expect(await db.inbox.count()).toBe(1));
    fireEvent.click((await screen.findAllByRole('button', { name: '略過' }))[0]);
    await waitFor(async () => expect(await db.inbox.count()).toBe(0));
  });
  it('opens paste sheet when ?paste=1', async () => {
    render(<InboxScreen query={new URLSearchParams('paste=1')} />);
    expect(await screen.findByRole('dialog', { name: '貼上房源' })).toBeTruthy();
  });
});
```

- [ ] **Step 2: 執行確認失敗**

Run: `npm test -w apps/pwa` → Expected: FAIL（找不到 `../src/screens/Inbox`）。

- [ ] **Step 3: 實作 SwipeCard 與 InboxScreen**

`apps/pwa/src/components/SwipeCard.tsx`：
```tsx
import { useRef, useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

const THRESHOLD = 80;
export function SwipeCard({ children, onSwipeRight, onSwipeLeft }: { children: ComponentChildren; onSwipeRight: () => void; onSwipeLeft: () => void }) {
  const startX = useRef<number | null>(null);
  const [dx, setDx] = useState(0);
  return (
    <div
      class="touch-pan-y select-none transition-transform"
      style={{ transform: `translateX(${dx}px)`, opacity: 1 - Math.min(Math.abs(dx) / 300, 0.5) }}
      onPointerDown={(e) => { startX.current = e.clientX; }}
      onPointerMove={(e) => { if (startX.current !== null) setDx(e.clientX - startX.current); }}
      onPointerUp={() => {
        if (dx >= THRESHOLD) onSwipeRight(); else if (dx <= -THRESHOLD) onSwipeLeft();
        startX.current = null; setDx(0);
      }}
      onPointerCancel={() => { startX.current = null; setDx(0); }}
    >
      {children}
    </div>
  );
}
```

`apps/pwa/src/screens/Inbox.tsx`：
```tsx
import { useEffect, useState } from 'preact/hooks';
import { DEFAULT_PROFILE, type InboxItem, type Profile } from '@trsat/core';
import { db, getProfile, removeInbox, upsertListing } from '../db';
import { useLive } from '../hooks';
import { PreviewCard } from '../components/PreviewCard';
import { PasteSheet } from '../components/PasteSheet';
import { SwipeCard } from '../components/SwipeCard';
import { showToast } from '../components/Toast';
import { buildPreview } from './Share';
import { stashShare } from '../lib/share';
import { navigate } from '../router';

export function InboxScreen({ query }: { query: URLSearchParams }) {
  const items = useLive(() => db.inbox.orderBy('receivedAt').reverse().toArray(), [], [] as InboxItem[]);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [paste, setPaste] = useState(query.get('paste') === '1');
  useEffect(() => { getProfile().then(setProfile); }, []);

  const accept = async (it: InboxItem) => {
    await upsertListing(buildPreview(it, profile));
    await removeInbox(it.id);
    showToast('已加入房源', 'success');
  };
  const skip = async (it: InboxItem) => { await removeInbox(it.id); };

  return (
    <main class="mx-auto max-w-lg p-4 pb-24">
      <div class="mb-3 flex items-center justify-between">
        <h1 class="text-xl font-bold">收件匣</h1>
        <button class="tap rounded-lg border px-3 text-sm" onClick={() => setPaste(true)}>貼上文字或連結</button>
      </div>
      {items.length === 0 && (
        <div class="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
          <p class="mb-2">從 591 / Threads / FB 分享到此 App，房源會先出現在這裡。</p>
          <p>iPhone 請複製內容後點右上角「貼上文字或連結」。</p>
        </div>
      )}
      <ul class="space-y-3">
        {items.map((it) => (
          <li key={it.id}>
            <SwipeCard onSwipeRight={() => accept(it)} onSwipeLeft={() => skip(it)}>
              <PreviewCard listing={buildPreview(it, profile)} onChange={() => { stashShare(it); removeInbox(it.id); navigate('/share'); }} />
              <div class="mt-2 grid grid-cols-2 gap-2">
                <button class="tap rounded-lg border px-2 text-sm" onClick={() => skip(it)}>略過</button>
                <button class="tap rounded-lg bg-primary px-2 text-sm font-medium text-white" onClick={() => accept(it)}>加入</button>
              </div>
            </SwipeCard>
          </li>
        ))}
      </ul>
      <PasteSheet open={paste} onClose={() => setPaste(false)} onSubmit={(p) => { setPaste(false); stashShare(p); navigate('/share'); }} />
    </main>
  );
}
```
（在收件匣直接修改欄位時，改為把該項目送到 Share 畫面完整編輯，避免兩處維護編輯狀態。）

在 `app.tsx`：`import { InboxScreen } from './screens/Inbox';` 並把 `/inbox` 分支改為 `<InboxScreen query={route.query} />`。

- [ ] **Step 4: 執行確認通過**

Run: `npm test -w apps/pwa && npm run typecheck -w apps/pwa` → Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add apps/pwa
git commit -m "feat(pwa): inbox screen with swipe accept/skip and paste sheet"
```

---

### Task 13: 房源清單（Listings）與 ListingCard

**Files:**
- Create: `apps/pwa/src/screens/Listings.tsx`, `apps/pwa/src/components/ListingCard.tsx`, `apps/pwa/src/lib/sort.ts`
- Modify: `apps/pwa/src/app.tsx`
- Test: `apps/pwa/test/sort.test.ts`, `apps/pwa/test/listings.test.tsx`

**Interfaces:**
- Produces:
  - `sortListings(list: Listing[]): Listing[]`（分級 → softScore desc → rent asc → updatedAt desc）
  - `applyFilters(list, f: Filters): Listing[]`，`Filters = { tier?: Tier; status?: Status; district?: string; roomType?: RoomType; source?: Source; pendingOnly?: boolean }`
  - `groupByDedupe(list): Array<{ rep: Listing; others: Listing[] }>`
  - `<ListingCard listing extraCount onClick />`

- [ ] **Step 1: 寫失敗測試**

`apps/pwa/test/sort.test.ts`：
```ts
import { describe, it, expect } from 'vitest';
import { parseInput, toListing, evaluate, DEFAULT_PROFILE, type Listing } from '@trsat/core';
import { sortListings, applyFilters, groupByDedupe } from '../src/lib/sort';

const now = '2026-09-05T00:00:00.000Z';
const L = (text: string, over: Partial<Listing> = {}): Listing => {
  const l = { ...toListing(parseInput({ text }), now), ...over };
  return { ...l, rule: evaluate(l, DEFAULT_PROFILE, now) };
};

describe('sortListings', () => {
  it('orders pass < unknown < fail, then softScore desc, rent asc', () => {
    const fail = L('大安區套房 25000', { id: 'fail' });
    const unk = L('大安區套房 14000', { id: 'unk' });
    const passHi = L('大安區套房 12000 變頻冷氣 冰箱 洗衣機 對外窗 可養貓 捷運古亭站 步行3分', { id: 'passHi' });
    const passLo = L('大安區套房 14900 變頻冷氣 冰箱 洗衣機 對外窗 可養貓 捷運古亭站 步行14分', { id: 'passLo' });
    expect(sortListings([fail, unk, passLo, passHi]).map((l) => l.id)).toEqual(['passHi', 'passLo', 'unk', 'fail']);
  });
});
describe('applyFilters', () => {
  it('filters by tier/status/district/pending', () => {
    const a = L('大安區套房 14000', { id: 'a', status: 'shortlist' });
    const b = L('信義區套房 14000', { id: 'b', status: 'viewed', enrichment: 'pending' });
    expect(applyFilters([a, b], { district: '信義區' }).map((l) => l.id)).toEqual(['b']);
    expect(applyFilters([a, b], { status: 'shortlist' }).map((l) => l.id)).toEqual(['a']);
    expect(applyFilters([a, b], { pendingOnly: true }).map((l) => l.id)).toEqual(['b']);
    expect(applyFilters([a, b], { tier: 'unknown' })).toHaveLength(2);
  });
});
describe('groupByDedupe', () => {
  it('folds same group, keeps first as representative', () => {
    const a = L('x 12000', { id: 'a', dedupeGroupId: 'g1' });
    const b = L('y 12000', { id: 'b', dedupeGroupId: 'g1' });
    const c = L('z 12000', { id: 'c' });
    const g = groupByDedupe([a, b, c]);
    expect(g).toHaveLength(2);
    expect(g[0].rep.id).toBe('a'); expect(g[0].others.map((x) => x.id)).toEqual(['b']);
  });
});
```

`apps/pwa/test/listings.test.tsx`：
```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { parseInput, toListing } from '@trsat/core';
import { ListingsScreen } from '../src/screens/Listings';
import { clearAll, upsertListing } from '../src/db';

const now = '2026-09-05T00:00:00.000Z';
beforeEach(async () => { await clearAll(); location.hash = ''; });

describe('ListingsScreen', () => {
  it('renders cards, collapses 不符, navigates on click', async () => {
    await upsertListing(toListing(parseInput({ text: '大安區套房 14000 變頻冷氣 冰箱 洗衣機 對外窗 可養貓 捷運古亭站 步行5分' }), now, 'shortlist'));
    await upsertListing(toListing(parseInput({ text: '信義區套房 30000' }), now, 'shortlist'));
    render(<ListingsScreen />);
    await screen.findByText('NT$14,000');
    expect(screen.queryByText('NT$30,000')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /不符 \(1\)/ }));
    expect(await screen.findByText('NT$30,000')).toBeTruthy();
    fireEvent.click(screen.getByText('NT$14,000'));
    expect(location.hash).toMatch(/^#\/l\/manual(?::|%3A)/);   // navigate() encodes the id
  });
  it('shows empty state', async () => {
    render(<ListingsScreen />);
    expect(await screen.findByText(/還沒有房源/)).toBeTruthy();
  });
});
```

- [ ] **Step 2: 執行確認失敗**

Run: `npm test -w apps/pwa` → Expected: FAIL（找不到 `../src/lib/sort`）。

- [ ] **Step 3: 實作 sort.ts、ListingCard、ListingsScreen**

`apps/pwa/src/lib/sort.ts`：
```ts
import type { Listing, RoomType, Source, Status, Tier } from '@trsat/core';

const TIER_ORDER: Record<Tier, number> = { pass: 0, unknown: 1, fail: 2 };
export interface Filters { tier?: Tier; status?: Status; district?: string; roomType?: RoomType; source?: Source; pendingOnly?: boolean }

export function sortListings(list: Listing[]): Listing[] {
  return [...list].sort((a, b) =>
    TIER_ORDER[a.rule?.tier ?? 'unknown'] - TIER_ORDER[b.rule?.tier ?? 'unknown']
    || (b.rule?.softScore ?? 0) - (a.rule?.softScore ?? 0)
    || (a.rent ?? Infinity) - (b.rent ?? Infinity)
    || (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0));
}

export function applyFilters(list: Listing[], f: Filters): Listing[] {
  return list.filter((l) =>
    (!f.tier || l.rule?.tier === f.tier)
    && (!f.status || l.status === f.status)
    && (!f.district || l.district === f.district)
    && (!f.roomType || l.roomType === f.roomType)
    && (!f.source || l.source === f.source)
    && (!f.pendingOnly || l.enrichment === 'pending'));
}

export function groupByDedupe(list: Listing[]): Array<{ rep: Listing; others: Listing[] }> {
  const seen = new Map<string, { rep: Listing; others: Listing[] }>();
  const out: Array<{ rep: Listing; others: Listing[] }> = [];
  for (const l of list) {
    const key = l.dedupeGroupId ?? l.id;
    const g = seen.get(key);
    if (g) g.others.push(l);
    else { const ng = { rep: l, others: [] as Listing[] }; seen.set(key, ng); out.push(ng); }
  }
  return out;
}
```

`apps/pwa/src/components/ListingCard.tsx`：
```tsx
import { DEFAULT_PROFILE, type Listing } from '@trsat/core';
import { TierBadge } from './TierBadge';
import { formatRent, sourceLabel, STATUS_LABEL } from '../lib/format';

export function ListingCard({ listing: l, extraCount = 0, onClick }: { listing: Listing; extraCount?: number; onClick: () => void }) {
  const missing = DEFAULT_PROFILE.mustHave.filter((m) => !l.equipment.includes(m));
  const tags = l.equipment.slice(0, 3);
  return (
    <article class="rounded-xl border border-gray-200 bg-white p-3 shadow-sm active:bg-gray-50 dark:border-gray-800 dark:bg-gray-900" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}>
      <div class="flex items-start justify-between gap-2">
        <p class="text-xl font-bold">{formatRent(l.rent)}</p>
        <div class="flex items-center gap-1">
          {l.rule && <TierBadge tier={l.rule.tier} size="sm" />}
          <span class="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] dark:bg-gray-800">{STATUS_LABEL[l.status]}</span>
        </div>
      </div>
      <p class="mt-1 truncate text-sm text-gray-700 dark:text-gray-300">
        {[l.district, l.roomType !== '未知' ? l.roomType : null, l.areaPing ? `${l.areaPing}坪` : null, l.mrtWalkMin !== undefined ? `捷運 ${l.mrtWalkMin} 分` : null].filter(Boolean).join(' · ') || l.title}
      </p>
      <p class="mt-1 flex flex-wrap gap-1 text-xs">
        <span class="text-gray-400">{sourceLabel(l.source)}</span>
        {tags.map((t) => <span key={t} class="rounded bg-gray-100 px-1.5 dark:bg-gray-800">{t}</span>)}
        {tags.length === 0 && missing.slice(0, 2).map((m) => <span key={m} class="text-red-600">缺{m}</span>)}
        {l.enrichment === 'pending' && <span class="text-tier-unknown">待電腦補抓</span>}
        {extraCount > 0 && <span class="text-primary">+{extraCount} 同房源</span>}
      </p>
    </article>
  );
}
```

`apps/pwa/src/screens/Listings.tsx`：
```tsx
import { useMemo, useState } from 'preact/hooks';
import { RoomTypeSchema, SourceSchema, StatusSchema, type Listing } from '@trsat/core';
import { db } from '../db';
import { useLive } from '../hooks';
import { navigate } from '../router';
import { ListingCard } from '../components/ListingCard';
import { applyFilters, groupByDedupe, sortListings, type Filters } from '../lib/sort';
import { STATUS_LABEL, sourceLabel } from '../lib/format';

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return <button class={`tap shrink-0 rounded-full border px-3 text-xs ${active ? 'border-primary bg-primary text-white' : 'border-gray-300 dark:border-gray-700'}`} onClick={onClick} aria-pressed={active}>{label}</button>;
}

export function ListingsScreen() {
  const all = useLive(() => db.listings.toArray(), [], [] as Listing[]);
  const [f, setF] = useState<Filters>({});
  const [showFail, setShowFail] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const districts = useMemo(() => [...new Set(all.map((l) => l.district).filter(Boolean) as string[])].sort(), [all]);
  const filtered = useMemo(() => sortListings(applyFilters(all, f)), [all, f]);
  const good = groupByDedupe(filtered.filter((l) => l.rule?.tier !== 'fail'));
  const bad = filtered.filter((l) => l.rule?.tier === 'fail');
  const open = (id: string) => navigate(`/l/${encodeURIComponent(id)}`);
  const toggle = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((x) => ({ ...x, [k]: x[k] === v ? undefined : v }));

  return (
    <main class="mx-auto max-w-lg p-4 pb-24">
      <h1 class="mb-2 text-xl font-bold">房源</h1>
      <div class="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="篩選">
        <Chip active={f.tier === 'pass'} label="符合" onClick={() => toggle('tier', 'pass')} />
        <Chip active={f.tier === 'unknown'} label="待確認" onClick={() => toggle('tier', 'unknown')} />
        {StatusSchema.options.filter((s) => s !== 'inbox').map((s) => <Chip key={s} active={f.status === s} label={STATUS_LABEL[s]} onClick={() => toggle('status', s)} />)}
        {RoomTypeSchema.options.filter((r) => r !== '未知').map((r) => <Chip key={r} active={f.roomType === r} label={r} onClick={() => toggle('roomType', r)} />)}
        {districts.map((d) => <Chip key={d} active={f.district === d} label={d} onClick={() => toggle('district', d)} />)}
        {SourceSchema.options.filter((s) => all.some((l) => l.source === s)).map((s) => <Chip key={s} active={f.source === s} label={sourceLabel(s)} onClick={() => toggle('source', s)} />)}
        <Chip active={!!f.pendingOnly} label="待補抓" onClick={() => setF((x) => ({ ...x, pendingOnly: !x.pendingOnly }))} />
      </div>

      {all.length === 0 && <p class="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">還沒有房源。從收件匣加入，或用分享選單把連結送進來。</p>}

      <ul class="space-y-3">
        {good.map(({ rep, others }) => (
          <li key={rep.id}>
            <ListingCard listing={rep} extraCount={others.length} onClick={() => open(rep.id)} />
            {others.length > 0 && (
              <button class="tap mt-1 text-xs text-primary" onClick={() => setExpanded((s) => { const n = new Set(s); n.has(rep.id) ? n.delete(rep.id) : n.add(rep.id); return n; })}>
                {expanded.has(rep.id) ? '收合同房源' : `展開 ${others.length} 筆同房源`}
              </button>
            )}
            {expanded.has(rep.id) && <ul class="mt-2 space-y-2 pl-3">{others.map((o) => <li key={o.id}><ListingCard listing={o} onClick={() => open(o.id)} /></li>)}</ul>}
          </li>
        ))}
      </ul>

      {bad.length > 0 && (
        <section class="mt-6">
          <button class="tap w-full rounded-lg border px-3 text-left text-sm text-gray-500" onClick={() => setShowFail((s) => !s)} aria-expanded={showFail}>
            {showFail ? '▾' : '▸'} 不符 ({bad.length})
          </button>
          {showFail && <ul class="mt-2 space-y-2 opacity-80">{bad.map((l) => <li key={l.id}><ListingCard listing={l} onClick={() => open(l.id)} /></li>)}</ul>}
        </section>
      )}
    </main>
  );
}
```

在 `app.tsx`：`import { ListingsScreen } from './screens/Listings';` 預設分支改為 `<ListingsScreen />`。

- [ ] **Step 4: 執行確認通過**

Run: `npm test -w apps/pwa && npm run typecheck -w apps/pwa` → Expected: PASS。若 sort 測試 `passHi` 未排第一，檢查 `步行3分` 是否被 `extractMrt` 抓到（`走|步行` + 數字 + `分`）。

- [ ] **Step 5: Commit**

```bash
git add apps/pwa
git commit -m "feat(pwa): listings screen with tier sorting, filter chips, dedupe folding"
```

---

### Task 14: 房源詳情（Detail）、狀態流程、補抓（enrich）

**Files:**
- Create: `apps/pwa/src/screens/Detail.tsx`, `apps/pwa/src/components/StatusStepper.tsx`, `apps/pwa/src/lib/enrich.ts`
- Modify: `apps/pwa/src/app.tsx`
- Test: `apps/pwa/test/enrich.test.ts`, `apps/pwa/test/detail.test.tsx`

**Interfaces:**
- Produces:
  - `getEndpoint(): Promise<string | undefined>`、`setEndpoint(url: string): Promise<void>`（`db.meta` key `endpoint`）、`testEndpoint(url): Promise<boolean>`（GET `${url}/api/health` 200）
  - `enrich(id: string): Promise<'done' | 'pending' | 'failed'>`；endpoint 協定：`POST ${endpoint}/api/fetch` body `{ url }` → `200 { ok: true, listing: Partial<Listing> }`；`401 { ok: false, code: 'SESSION_EXPIRED', message }`；其他非 2xx → failed
  - `<StatusStepper status onChange />`
  - `<DetailScreen id />`

- [ ] **Step 1: 寫失敗測試**

`apps/pwa/test/enrich.test.ts`：
```ts
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { parseInput, toListing } from '@trsat/core';
import { clearAll, db, upsertListing } from '../src/db';
import { enrich, setEndpoint, getEndpoint, testEndpoint } from '../src/lib/enrich';

const now = '2026-09-05T00:00:00.000Z';
beforeEach(async () => { await clearAll(); });
afterEach(() => { vi.unstubAllGlobals(); });

describe('enrich', () => {
  it('marks pending when no endpoint configured', async () => {
    const l = await upsertListing(toListing(parseInput({ url: 'https://rent.591.com.tw/18234567' }), now));
    expect(await enrich(l.id)).toBe('pending');
    expect((await db.listings.get(l.id))?.enrichment).toBe('pending');
  });
  it('merges fields from endpoint and marks done', async () => {
    await setEndpoint('https://laptop.tail1234.ts.net');
    expect(await getEndpoint()).toBe('https://laptop.tail1234.ts.net');
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ ok: true, listing: { rent: 15500, district: '大安區', roomType: '套房', photos: ['https://img/1.jpg'] } }), { status: 200 })));
    const l = await upsertListing(toListing(parseInput({ url: 'https://rent.591.com.tw/18234567' }), now));
    expect(await enrich(l.id)).toBe('done');
    const got = await db.listings.get(l.id);
    expect(got?.rent).toBe(15500); expect(got?.enrichment).toBe('done'); expect(got?.extraction.method).toBe('cli_fetch'); expect(got?.rule?.tier).toBeDefined();
  });
  it('401 SESSION_EXPIRED → failed', async () => {
    await setEndpoint('https://x');
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ ok: false, code: 'SESSION_EXPIRED', message: 'FB login expired' }), { status: 401 })));
    const l = await upsertListing(toListing(parseInput({ url: 'https://www.facebook.com/groups/g/posts/1/' }), now));
    expect(await enrich(l.id)).toBe('failed');
    expect((await db.listings.get(l.id))?.enrichment).toBe('failed');
  });
  it('testEndpoint true on 200', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('ok', { status: 200 })));
    expect(await testEndpoint('https://x')).toBe(true);
  });
});
```

`apps/pwa/test/detail.test.tsx`：
```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { parseInput, toListing } from '@trsat/core';
import { DetailScreen } from '../src/screens/Detail';
import { clearAll, db, upsertListing } from '../src/db';

const now = '2026-09-05T00:00:00.000Z';
beforeEach(async () => { await clearAll(); });

describe('DetailScreen', () => {
  it('shows facts, checklist, and changes status', async () => {
    const l = await upsertListing(toListing(parseInput({ text: '大安區套房 14000 可養貓 捷運古亭站 步行5分 0912345678' }), now, 'shortlist'));
    render(<DetailScreen id={l.id} />);
    await screen.findByText('NT$14,000');
    expect(screen.getByRole('list', { name: '條件檢核' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '已聯絡' }));
    await waitFor(async () => expect((await db.listings.get(l.id))?.status).toBe('contacted'));
  });
  it('inline edit of a missing field patches the listing', async () => {
    const l = await upsertListing(toListing(parseInput({ url: 'https://rent.591.com.tw/18234567' }), now, 'shortlist'));
    render(<DetailScreen id={l.id} />);
    fireEvent.click(await screen.findByRole('button', { name: '編輯' }));
    fireEvent.input(screen.getByLabelText('租金'), { target: { value: '13000' } });
    fireEvent.click(screen.getByRole('button', { name: '儲存' }));
    await waitFor(async () => expect((await db.listings.get(l.id))?.rent).toBe(13000));
  });
  it('renders not-found for unknown id', async () => {
    render(<DetailScreen id="nope" />);
    expect(await screen.findByText(/找不到房源/)).toBeTruthy();
  });
});
```

- [ ] **Step 2: 執行確認失敗**

Run: `npm test -w apps/pwa` → Expected: FAIL（找不到 `../src/lib/enrich`、`../src/screens/Detail`）。

- [ ] **Step 3: 實作 enrich.ts**

```ts
import { ListingSchema, type Listing } from '@trsat/core';
import { db, patchListing } from '../db';
import { showToast } from '../components/Toast';

export async function getEndpoint(): Promise<string | undefined> {
  return (await db.meta.get('endpoint'))?.value || undefined;
}
export async function setEndpoint(url: string): Promise<void> {
  await db.meta.put({ key: 'endpoint', value: url.trim().replace(/\/+$/, '') });
}
export async function testEndpoint(url: string): Promise<boolean> {
  try { const r = await fetch(`${url.replace(/\/+$/, '')}/api/health`, { method: 'GET' }); return r.ok; } catch { return false; }
}

const MERGEABLE: Array<keyof Listing> = ['title', 'rent', 'depositMonths', 'managementFee', 'utilitiesNote', 'roomType', 'layout', 'areaPing', 'floor', 'city', 'district', 'address', 'mrtNearest', 'mrtWalkMin', 'equipment', 'petPolicy', 'availableFrom', 'photos', 'photoHashes', 'contactRaw', 'phoneNormalized', 'rawText', 'postedAt'];

export async function enrich(id: string): Promise<'done' | 'pending' | 'failed'> {
  const cur = await db.listings.get(id);
  if (!cur?.url) return 'failed';
  const endpoint = await getEndpoint();
  if (!endpoint) { await patchListing(id, { enrichment: 'pending' }); return 'pending'; }
  try {
    const res = await fetch(`${endpoint}/api/fetch`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ url: cur.url }) });
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean; code?: string; message?: string; listing?: Partial<Listing> };
    if (res.status === 401 && body.code === 'SESSION_EXPIRED') {
      showToast(`電腦端需重新登入：${body.message ?? ''}`, 'error');
      await patchListing(id, { enrichment: 'failed' });
      return 'failed';
    }
    if (!res.ok || !body.ok || !body.listing) { await patchListing(id, { enrichment: 'failed' }); return 'failed'; }
    const patch: Partial<Listing> = {};
    for (const k of MERGEABLE) {
      const v = body.listing[k];
      if (v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0)) (patch as Record<string, unknown>)[k] = v;
    }
    const merged: Listing = { ...cur, ...patch, enrichment: 'done', fetchedAt: new Date().toISOString(), extraction: { method: 'cli_fetch', confidence: 0.95, missing: [] } };
    ListingSchema.parse(merged);
    await patchListing(id, merged);
    await db.syncLog.add({ at: merged.fetchedAt, kind: 'enrich', detail: id });
    return 'done';
  } catch {
    await patchListing(id, { enrichment: 'failed' });
    return 'failed';
  }
}
```

- [ ] **Step 4: 實作 StatusStepper 與 DetailScreen**

`apps/pwa/src/components/StatusStepper.tsx`：
```tsx
import { STATUS_ORDER, type Status } from '@trsat/core';
import { STATUS_LABEL } from '../lib/format';
export function StatusStepper({ status, onChange }: { status: Status; onChange: (s: Status) => void }) {
  return (
    <div class="-mx-4 flex gap-2 overflow-x-auto px-4" role="group" aria-label="看房狀態">
      {STATUS_ORDER.filter((s) => s !== 'inbox').map((s) => (
        <button key={s} class={`tap shrink-0 rounded-full border px-3 text-xs ${s === status ? 'border-primary bg-primary text-white' : 'border-gray-300 dark:border-gray-700'}`} aria-pressed={s === status} onClick={() => onChange(s)}>
          {STATUS_LABEL[s]}
        </button>
      ))}
    </div>
  );
}
```

`apps/pwa/src/screens/Detail.tsx`：
```tsx
import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import { ALL_DISTRICTS, PetPolicySchema, RoomTypeSchema, type Listing, type PetPolicy, type RoomType } from '@trsat/core';
import { db, patchListing, setStatus, toggleCompare, getCompareIds } from '../db';
import { useLive } from '../hooks';
import { navigate } from '../router';
import { TierBadge } from '../components/TierBadge';
import { RuleChecklist } from '../components/RuleChecklist';
import { StatusStepper } from '../components/StatusStepper';
import { showToast } from '../components/Toast';
import { formatArea, formatRent, mapsUrl, sourceLabel } from '../lib/format';
import { enrich, getEndpoint } from '../lib/enrich';

const PET_LABEL: Record<PetPolicy, string> = { allowed: '可養', not_allowed: '不可', negotiable: '可議', unknown: '未提及' };

export function DetailScreen({ id }: { id: string }) {
  const l = useLive(() => db.listings.get(id), [id], undefined as Listing | undefined);
  const compare = useLive(() => getCompareIds(), [], [] as string[]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<Listing>>({});
  if (l === undefined) return <main class="mx-auto max-w-lg p-4 pb-24"><p class="text-gray-500">找不到房源。</p><button class="tap mt-2 rounded-lg border px-3" onClick={() => navigate('/')}>回清單</button></main>;

  const num = (v: string) => { const n = parseFloat(v); return Number.isFinite(n) ? n : undefined; };
  const save = async () => { await patchListing(l.id, draft); setDraft({}); setEditing(false); showToast('已更新', 'success'); };
  const copyContact = async () => { if (l.contactRaw) { await navigator.clipboard.writeText(l.contactRaw); showToast('已複製聯絡方式'); } };
  const doEnrich = async () => {
    if (!l.url) return showToast('沒有原始連結，無法補抓', 'error');
    if (!(await getEndpoint())) {
      const cmd = `trsat fetch "${l.url}"`;
      await navigator.clipboard.writeText(cmd).catch(() => undefined);
      await enrich(l.id);
      return showToast('未設定補抓 endpoint，已複製指令到剪貼簿，請在電腦執行', 'info');
    }
    const r = await enrich(l.id);
    showToast(r === 'done' ? '補抓完成' : r === 'failed' ? '補抓失敗' : '已標記待補抓', r === 'done' ? 'success' : 'error');
  };

  const fact = (label: string, value: string, _key?: keyof Listing, input?: JSX.Element) => (
    <div class="rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
      <dt class="text-[11px] text-gray-500">{label}</dt>
      <dd class="text-sm font-medium">{editing && input ? input : value}</dd>
    </div>
  );
  const d = { ...l, ...draft };

  return (
    <main class="mx-auto max-w-lg pb-40">
      <div class="flex items-center gap-2 p-3"><button class="tap px-2" onClick={() => navigate('/')} aria-label="返回">←</button><span class="text-xs text-gray-500">{sourceLabel(l.source)}</span>{l.rule && <TierBadge tier={l.rule.tier} />}</div>

      {l.photos.length > 0 ? (
        <div class="flex snap-x snap-mandatory gap-2 overflow-x-auto px-4">{l.photos.map((p) => <img key={p} src={p} alt="" class="h-56 w-[85%] shrink-0 snap-center rounded-xl object-cover" loading="lazy" />)}</div>
      ) : (
        <div class="mx-4 flex h-32 items-center justify-center rounded-xl bg-gray-200 text-sm text-gray-500 dark:bg-gray-800">尚無照片 · {sourceLabel(l.source)}</div>
      )}

      <section class="p-4">
        <h1 class="text-lg font-bold">{l.title}</h1>
        <p class="my-2 text-3xl font-bold">{formatRent(l.rent)}<span class="ml-1 text-sm font-normal text-gray-500">/月</span></p>
        <div class="mb-2 flex justify-end"><button class="tap rounded-lg border px-3 text-xs" onClick={() => (editing ? save() : setEditing(true))}>{editing ? '儲存' : '編輯'}</button></div>
        <dl class="grid grid-cols-2 gap-2">
          {fact('租金', formatRent(l.rent), 'rent', <input aria-label="租金" type="number" class="w-full rounded border px-1 dark:bg-gray-900" value={d.rent ?? ''} onInput={(e) => setDraft({ ...draft, rent: num((e.target as HTMLInputElement).value) })} />)}
          {fact('押金（月）', l.depositMonths?.toString() ?? '—', 'depositMonths', <input aria-label="押金" type="number" class="w-full rounded border px-1 dark:bg-gray-900" value={d.depositMonths ?? ''} onInput={(e) => setDraft({ ...draft, depositMonths: num((e.target as HTMLInputElement).value) })} />)}
          {fact('管理費', l.managementFee?.toString() ?? '—', 'managementFee', <input aria-label="管理費" type="number" class="w-full rounded border px-1 dark:bg-gray-900" value={d.managementFee ?? ''} onInput={(e) => setDraft({ ...draft, managementFee: num((e.target as HTMLInputElement).value) })} />)}
          {fact('房型', l.roomType, 'roomType', <select aria-label="房型" class="w-full rounded border dark:bg-gray-900" value={d.roomType} onChange={(e) => setDraft({ ...draft, roomType: (e.target as HTMLSelectElement).value as RoomType })}>{RoomTypeSchema.options.map((o) => <option key={o}>{o}</option>)}</select>)}
          {fact('坪數', formatArea(l.areaPing), 'areaPing', <input aria-label="坪數" type="number" step="0.5" class="w-full rounded border px-1 dark:bg-gray-900" value={d.areaPing ?? ''} onInput={(e) => setDraft({ ...draft, areaPing: num((e.target as HTMLInputElement).value) })} />)}
          {fact('樓層', l.floor ?? '—', 'floor', <input aria-label="樓層" class="w-full rounded border px-1 dark:bg-gray-900" value={d.floor ?? ''} onInput={(e) => setDraft({ ...draft, floor: (e.target as HTMLInputElement).value || undefined })} />)}
          {fact('區', l.district ?? '—', 'district', <select aria-label="區" class="w-full rounded border dark:bg-gray-900" value={d.district ?? ''} onChange={(e) => setDraft({ ...draft, district: (e.target as HTMLSelectElement).value || undefined })}><option value="">—</option>{ALL_DISTRICTS.map((o) => <option key={o}>{o}</option>)}</select>)}
          {fact('地址', l.address ?? '—', 'address', <input aria-label="地址" class="w-full rounded border px-1 dark:bg-gray-900" value={d.address ?? ''} onInput={(e) => setDraft({ ...draft, address: (e.target as HTMLInputElement).value || undefined })} />)}
          {fact('捷運', l.mrtNearest ? `${l.mrtNearest}${l.mrtWalkMin !== undefined ? ` · ${l.mrtWalkMin} 分` : ''}` : '—', 'mrtNearest', <input aria-label="捷運站" class="w-full rounded border px-1 dark:bg-gray-900" value={d.mrtNearest ?? ''} onInput={(e) => setDraft({ ...draft, mrtNearest: (e.target as HTMLInputElement).value || undefined })} />)}
          {fact('步行分', l.mrtWalkMin?.toString() ?? '—', 'mrtWalkMin', <input aria-label="步行分" type="number" class="w-full rounded border px-1 dark:bg-gray-900" value={d.mrtWalkMin ?? ''} onInput={(e) => setDraft({ ...draft, mrtWalkMin: num((e.target as HTMLInputElement).value) })} />)}
          {fact('寵物', PET_LABEL[l.petPolicy ?? 'unknown'], 'petPolicy', <select aria-label="寵物" class="w-full rounded border dark:bg-gray-900" value={d.petPolicy ?? 'unknown'} onChange={(e) => setDraft({ ...draft, petPolicy: (e.target as HTMLSelectElement).value as PetPolicy })}>{PetPolicySchema.options.map((o) => <option key={o} value={o}>{PET_LABEL[o]}</option>)}</select>)}
          {fact('可入住', l.availableFrom ?? '—', 'availableFrom', <input aria-label="可入住" type="date" class="w-full rounded border px-1 dark:bg-gray-900" value={d.availableFrom ?? ''} onInput={(e) => setDraft({ ...draft, availableFrom: (e.target as HTMLInputElement).value || undefined })} />)}
        </dl>
      </section>

      <section class="px-4"><h2 class="mb-2 text-sm font-semibold">條件檢核</h2>{l.rule && <RuleChecklist result={l.rule} />}</section>

      <section class="p-4"><h2 class="mb-2 text-sm font-semibold">看房狀態</h2><StatusStepper status={l.status} onChange={(s) => setStatus(l.id, s)} /></section>

      <section class="px-4">
        <label class="text-sm font-semibold" for="notes">備註</label>
        <textarea id="notes" class="mt-1 h-24 w-full rounded-lg border p-2 text-sm dark:bg-gray-800" value={l.notes ?? ''} onBlur={(e) => patchListing(l.id, { notes: (e.target as HTMLTextAreaElement).value || undefined })} />
      </section>

      {l.rawText && <details class="px-4 py-2 text-sm text-gray-600"><summary>原文</summary><pre class="whitespace-pre-wrap">{l.rawText}</pre></details>}

      <div class="fixed inset-x-0 bottom-16 z-30 mx-auto grid max-w-lg grid-cols-5 gap-1 border-t bg-white p-2 text-xs dark:bg-gray-900" role="toolbar" aria-label="房源操作">
        <a class="tap flex items-center justify-center rounded-lg border" href={l.url} target="_blank" rel="noopener noreferrer" aria-disabled={!l.url}>開原文</a>
        <a class="tap flex items-center justify-center rounded-lg border" href={mapsUrl(l)} target="_blank" rel="noopener noreferrer">地圖</a>
        <button class="tap rounded-lg border disabled:opacity-40" disabled={!l.contactRaw} onClick={copyContact}>複製聯絡</button>
        <button class={`tap rounded-lg border ${compare.includes(l.id) ? 'bg-primary text-white' : ''}`} onClick={async () => { const n = await toggleCompare(l.id); showToast(n.includes(l.id) ? '已加入比較' : '已移出比較'); }}>比較</button>
        <button class="tap rounded-lg border" onClick={doEnrich}>{l.enrichment === 'pending' ? '待補抓' : '補抓'}</button>
      </div>
    </main>
  );
}
```

在 `app.tsx`：
```tsx
import { matchPath } from './router';
import { DetailScreen } from './screens/Detail';
// ...
const detail = matchPath('/l/:id', route.path);
if (detail) screen = <DetailScreen id={detail.id} />;
```
（放在 `/share` 判斷之後、其他分支之前。）

- [ ] **Step 5: 執行確認通過**

Run: `npm test -w apps/pwa && npm run typecheck -w apps/pwa` → Expected: PASS。jsdom 沒有 `navigator.clipboard`，測試未觸發複製。

- [ ] **Step 6: Commit**

```bash
git add apps/pwa
git commit -m "feat(pwa): listing detail with inline edit, status stepper, actions and enrich endpoint"
```

---

### Task 15: 比較畫面（Compare）

**Files:**
- Create: `apps/pwa/src/screens/Compare.tsx`
- Modify: `apps/pwa/src/app.tsx`
- Test: `apps/pwa/test/compare.test.tsx`

**Interfaces:**
- Consumes: `getCompareIds`、`toggleCompare`、`db.listings.bulkGet`
- Produces: `<CompareScreen />`；`diffClass(values: string[], i: number): string`（值不一致時回傳底色 class）

- [ ] **Step 1: 寫失敗測試**

`apps/pwa/test/compare.test.tsx`：
```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { parseInput, toListing } from '@trsat/core';
import { CompareScreen, diffClass } from '../src/screens/Compare';
import { clearAll, upsertListing, toggleCompare, getCompareIds } from '../src/db';

const now = '2026-09-05T00:00:00.000Z';
beforeEach(async () => { await clearAll(); });

describe('CompareScreen', () => {
  it('empty state', async () => {
    render(<CompareScreen />);
    expect(await screen.findByText(/尚未選擇/)).toBeTruthy();
  });
  it('renders columns and removes one', async () => {
    const a = await upsertListing(toListing(parseInput({ text: '大安區套房 14000 8坪' }), now, 'shortlist'));
    const b = await upsertListing(toListing(parseInput({ text: '信義區套房 16000 10坪' }), now, 'shortlist'));
    await toggleCompare(a.id); await toggleCompare(b.id);
    render(<CompareScreen />);
    await screen.findByText('NT$14,000'); expect(screen.getByText('NT$16,000')).toBeTruthy();
    fireEvent.click(screen.getAllByRole('button', { name: '移除' })[0]);
    await waitFor(async () => expect(await getCompareIds()).toEqual([b.id]));
  });
  it('diffClass highlights differing rows', () => {
    expect(diffClass(['a', 'a'], 0)).toBe('');
    expect(diffClass(['a', 'b'], 1)).not.toBe('');
  });
});
```

- [ ] **Step 2: 執行確認失敗**

Run: `npm test -w apps/pwa` → Expected: FAIL。

- [ ] **Step 3: 實作 Compare.tsx**

```tsx
import type { Listing } from '@trsat/core';
import { db, getCompareIds, toggleCompare } from '../db';
import { useLive } from '../hooks';
import { navigate } from '../router';
import { TierBadge } from '../components/TierBadge';
import { formatArea, formatRent } from '../lib/format';

export function diffClass(values: string[], i: number): string {
  return new Set(values).size > 1 ? (i === 0 ? '' : 'bg-amber-50 dark:bg-amber-950/40') : '';
}

const PET: Record<string, string> = { allowed: '可養', not_allowed: '不可', negotiable: '可議', unknown: '未提及' };

export function CompareScreen() {
  const ids = useLive(() => getCompareIds(), [], [] as string[]);
  const items = useLive(async () => (await db.listings.bulkGet(ids)).filter((x): x is Listing => !!x), [ids.join(',')], [] as Listing[]);

  if (items.length === 0) return <main class="mx-auto max-w-lg p-4 pb-24"><h1 class="mb-2 text-xl font-bold">比較</h1><p class="text-sm text-gray-500">尚未選擇房源。到房源詳情按「比較」，最多 3 筆。</p></main>;

  const rows: Array<[label: string, get: (l: Listing) => string]> = [
    ['租金', (l) => formatRent(l.rent)],
    ['房型', (l) => l.roomType],
    ['坪數', (l) => formatArea(l.areaPing)],
    ['區', (l) => l.district ?? '—'],
    ['捷運', (l) => (l.mrtNearest ? `${l.mrtNearest}${l.mrtWalkMin !== undefined ? ` ${l.mrtWalkMin}分` : ''}` : '—')],
    ['押金', (l) => (l.depositMonths !== undefined ? `${l.depositMonths} 個月` : '—')],
    ['管理費', (l) => (l.managementFee !== undefined ? String(l.managementFee) : '—')],
    ['寵物', (l) => PET[l.petPolicy ?? 'unknown']],
    ['可入住', (l) => l.availableFrom ?? '—'],
    ['未符合／待確認', (l) => l.rule?.reasons.filter((r) => r.kind !== 'pass' && r.kind !== 'bonus').map((r) => r.message).join('、') || '無'],
  ];

  return (
    <main class="mx-auto max-w-lg p-4 pb-24">
      <h1 class="mb-3 text-xl font-bold">比較</h1>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr>
              <th class="w-20"></th>
              {items.map((l) => (
                <th key={l.id} class="min-w-36 px-2 pb-2 text-left align-top">
                  <button class="line-clamp-2 text-left font-semibold underline-offset-2 hover:underline" onClick={() => navigate(`/l/${encodeURIComponent(l.id)}`)}>{l.title}</button>
                  <div class="mt-1 flex items-center gap-2">{l.rule && <TierBadge tier={l.rule.tier} size="sm" />}<button class="tap text-xs text-gray-500" onClick={() => toggleCompare(l.id)}>移除</button></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, get]) => {
              const vals = items.map(get);
              return (
                <tr key={label} class="border-t border-gray-200 dark:border-gray-800">
                  <th class="py-2 pr-2 text-left text-xs font-medium text-gray-500">{label}</th>
                  {vals.map((v, i) => <td key={i} class={`px-2 py-2 ${diffClass(vals, i)}`}>{v}</td>)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
```

在 `app.tsx`：`/compare` 分支改為 `<CompareScreen />`。

- [ ] **Step 4: 執行確認通過**

Run: `npm test -w apps/pwa && npm run typecheck -w apps/pwa` → Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add apps/pwa
git commit -m "feat(pwa): side-by-side compare of up to three listings"
```

---

### Task 16: 設定畫面（Profile 表單、endpoint、匯出／匯入、清除）

**Files:**
- Create: `apps/pwa/src/screens/Settings.tsx`, `apps/pwa/src/lib/file.ts`
- Modify: `apps/pwa/src/app.tsx`
- Test: `apps/pwa/test/settings.test.tsx`

**Interfaces:**
- Consumes: `getProfile`、`saveProfile`、`exportAll`、`importAll`、`clearAll`、`getEndpoint`、`setEndpoint`、`testEndpoint`
- Produces: `downloadJson(name: string, data: unknown): void`、`readJsonFile(file: File): Promise<unknown>`、`splitTags(s: string): string[]`（以 `,`、`，`、空白、換行切分並去空）

- [ ] **Step 1: 寫失敗測試**

`apps/pwa/test/settings.test.tsx`：
```tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { SettingsScreen } from '../src/screens/Settings';
import { splitTags } from '../src/lib/file';
import { clearAll, getProfile, upsertListing, db } from '../src/db';
import { parseInput, toListing } from '@trsat/core';

beforeEach(async () => { await clearAll(); });

describe('splitTags', () => {
  it('splits on commas, fullwidth commas, whitespace', () => {
    expect(splitTags('變頻冷氣, 冰箱，洗衣機\n對外窗 ')).toEqual(['變頻冷氣', '冰箱', '洗衣機', '對外窗']);
  });
});

describe('SettingsScreen', () => {
  it('edits and saves profile, recomputing rules', async () => {
    const l = await upsertListing(toListing(parseInput({ text: '大安區套房 14000 變頻冷氣 冰箱 洗衣機 對外窗 可養貓 捷運古亭站 步行5分' }), '2026-09-05T00:00:00.000Z', 'shortlist'));
    render(<SettingsScreen />);
    const input = await screen.findByLabelText('套房預算上限');
    fireEvent.input(input, { target: { value: '12000' } });
    fireEvent.click(screen.getByRole('button', { name: '儲存條件' }));
    await waitFor(async () => expect((await getProfile()).budget.套房).toBe(12000));
    await waitFor(async () => expect((await db.listings.get(l.id))?.rule?.tier).toBe('fail'));
  });
  it('clear all requires two confirmations', async () => {
    await upsertListing(toListing(parseInput({ text: '大安區套房 14000' }), '2026-09-05T00:00:00.000Z'));
    vi.stubGlobal('confirm', vi.fn().mockReturnValueOnce(true).mockReturnValueOnce(false));
    render(<SettingsScreen />);
    fireEvent.click(await screen.findByRole('button', { name: '清除所有資料' }));
    await new Promise((r) => setTimeout(r, 20));
    expect(await db.listings.count()).toBe(1);
    vi.unstubAllGlobals();
  });
});
```

- [ ] **Step 2: 執行確認失敗**

Run: `npm test -w apps/pwa` → Expected: FAIL。

- [ ] **Step 3: 實作 lib/file.ts 與 Settings.tsx**

`apps/pwa/src/lib/file.ts`：
```ts
export function splitTags(s: string): string[] {
  return s.split(/[,，\s]+/).map((x) => x.trim()).filter(Boolean);
}
export function downloadJson(name: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function readJsonFile(file: File): Promise<unknown> {
  return file.text().then((t) => JSON.parse(t) as unknown);
}
```

`apps/pwa/src/screens/Settings.tsx`：
```tsx
import { useEffect, useState } from 'preact/hooks';
import { DEFAULT_PROFILE, ProfileSchema, type Profile } from '@trsat/core';
import { clearAll, db, exportAll, getProfile, importAll, saveProfile } from '../db';
import { useLive } from '../hooks';
import { getEndpoint, setEndpoint, testEndpoint } from '../lib/enrich';
import { downloadJson, readJsonFile, splitTags } from '../lib/file';
import { showToast } from '../components/Toast';

const APP_VERSION = (import.meta.env.VITE_APP_VERSION as string | undefined) ?? '0.1.0';

export function SettingsScreen() {
  const [p, setP] = useState<Profile>(DEFAULT_PROFILE);
  const [endpoint, setEp] = useState('');
  const [busy, setBusy] = useState(false);
  const lastEnrich = useLive(async () => (await db.syncLog.orderBy('at').reverse().filter((r) => r.kind === 'enrich').first())?.at, [], undefined as string | undefined);
  useEffect(() => { getProfile().then(setP); getEndpoint().then((e) => setEp(e ?? '')); }, []);

  const numField = (label: string, value: number | undefined, onChange: (n: number | undefined) => void) => (
    <label class="flex flex-col text-xs text-gray-500">{label}
      <input aria-label={label} type="number" inputMode="numeric" class="tap mt-1 rounded border px-2 text-base text-gray-900 dark:bg-gray-800 dark:text-gray-100" value={value ?? ''}
        onInput={(e) => { const n = parseInt((e.target as HTMLInputElement).value, 10); onChange(Number.isFinite(n) ? n : undefined); }} />
    </label>
  );
  const tagField = (label: string, value: string[], onChange: (v: string[]) => void) => (
    <label class="flex flex-col text-xs text-gray-500">{label}
      <textarea aria-label={label} class="mt-1 h-16 rounded border p-2 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100" value={value.join('、')} onBlur={(e) => onChange(splitTags((e.target as HTMLTextAreaElement).value.replace(/、/g, ',')))} />
    </label>
  );

  const save = async () => {
    const r = ProfileSchema.safeParse(p);
    if (!r.success) return showToast(`條件有誤：${r.error.issues[0]?.message}`, 'error');
    setBusy(true); await saveProfile(r.data); setBusy(false); showToast('已儲存並重新分級', 'success');
  };
  const onImport = async (file: File | undefined) => {
    if (!file) return;
    try { const r = await importAll(await readJsonFile(file)); showToast(`匯入 ${r.imported} 筆，略過 ${r.skipped} 筆${r.errors.length ? `，${r.errors.length} 筆錯誤` : ''}`, r.errors.length ? 'error' : 'success'); }
    catch { showToast('不是有效的 JSON 檔', 'error'); }
  };
  const wipe = async () => {
    if (!confirm('確定要清除所有房源、收件匣與設定？')) return;
    if (!confirm('再次確認：此操作無法復原。建議先匯出備份。')) return;
    await clearAll(); showToast('已清除');
  };

  return (
    <main class="mx-auto max-w-lg space-y-6 p-4 pb-24">
      <h1 class="text-xl font-bold">設定</h1>

      <section class="space-y-3">
        <h2 class="text-sm font-semibold">個人條件</h2>
        <div class="grid grid-cols-2 gap-2">
          {numField('套房預算上限', p.budget.套房, (n) => setP({ ...p, budget: { ...p.budget, 套房: n ?? 0 } }))}
          {numField('雅房預算上限', p.budget.雅房, (n) => setP({ ...p, budget: { ...p.budget, 雅房: n ?? 0 } }))}
          {numField('整層預算上限（選填）', p.budget.整層, (n) => setP({ ...p, budget: { ...p.budget, 整層: n } }))}
          {numField('分租預算上限（選填，預設同套房）', p.budget.分租, (n) => setP({ ...p, budget: { ...p.budget, 分租: n } }))}
          {numField('預算容忍（元）', p.budgetTolerance, (n) => setP({ ...p, budgetTolerance: n ?? 0 }))}
          {numField('捷運步行上限（分）', p.mrtWalkMaxMin, (n) => setP({ ...p, mrtWalkMaxMin: n ?? 15 }))}
        </div>
        <fieldset class="text-xs text-gray-500"><legend>城市</legend>
          {['台北市', '新北市'].map((c) => (
            <label key={c} class="mr-4 inline-flex items-center gap-1 text-sm text-gray-900 dark:text-gray-100"><input type="checkbox" checked={p.cities.includes(c)} onChange={() => setP({ ...p, cities: p.cities.includes(c) ? p.cities.filter((x) => x !== c) : [...p.cities, c] })} />{c}</label>
          ))}
        </fieldset>
        <label class="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={p.pets.required} onChange={() => setP({ ...p, pets: { ...p.pets, required: !p.pets.required } })} />需可養寵物</label>
        <input aria-label="寵物備註" class="tap w-full rounded border px-2 text-sm dark:bg-gray-800" placeholder="寵物備註，例：2 隻貓" value={p.pets.note} onInput={(e) => setP({ ...p, pets: { ...p.pets, note: (e.target as HTMLInputElement).value } })} />
        {tagField('必備設備', p.mustHave, (v) => setP({ ...p, mustHave: v }))}
        {tagField('謝絕關鍵字', p.dealBreakerKeywords, (v) => setP({ ...p, dealBreakerKeywords: v }))}
        {tagField('加分關鍵字', p.bonusKeywords, (v) => setP({ ...p, bonusKeywords: v }))}
        <label class="flex flex-col text-xs text-gray-500">最晚入住日（選填）<input aria-label="最晚入住日" type="date" class="tap mt-1 rounded border px-2 text-base dark:bg-gray-800" value={p.moveInBefore ?? ''} onInput={(e) => setP({ ...p, moveInBefore: (e.target as HTMLInputElement).value || undefined })} /></label>
        <button class="tap w-full rounded-lg bg-primary text-sm font-medium text-white disabled:opacity-40" disabled={busy} onClick={save}>儲存條件</button>
      </section>

      <section class="space-y-2">
        <h2 class="text-sm font-semibold">補抓 endpoint（選填）</h2>
        <p class="text-xs text-gray-500">在電腦執行 <code>trsat serve</code> 並以 Tailscale Funnel 或 Cloudflare Tunnel 取得 HTTPS 網址後填入。未設定時，「補抓」只會複製指令。</p>
        <input aria-label="endpoint" class="tap w-full rounded border px-2 text-sm dark:bg-gray-800" placeholder="https://laptop.tailnet.ts.net" value={endpoint} onInput={(e) => setEp((e.target as HTMLInputElement).value)} />
        <p class="text-xs text-gray-500">上次補抓成功：{lastEnrich ? new Date(lastEnrich).toLocaleString('zh-TW') : '尚無'}</p>
        <div class="flex gap-2">
          <button class="tap flex-1 rounded-lg border text-sm" onClick={async () => { const ok = await testEndpoint(endpoint); showToast(ok ? '連線成功' : '連線失敗（請確認 HTTPS 網址與 trsat serve 是否執行）', ok ? 'success' : 'error'); }}>測試連線</button>
          <button class="tap flex-1 rounded-lg border text-sm" onClick={async () => { await setEndpoint(endpoint); showToast('已儲存 endpoint', 'success'); }}>儲存</button>
        </div>
      </section>

      <section class="space-y-2">
        <h2 class="text-sm font-semibold">資料</h2>
        <div class="grid grid-cols-2 gap-2">
          <button class="tap rounded-lg border text-sm" onClick={async () => downloadJson(`trsat-${new Date().toISOString().slice(0, 10)}.json`, await exportAll())}>匯出 JSON</button>
          <label class="tap flex cursor-pointer items-center justify-center rounded-lg border text-sm">匯入 JSON<input type="file" accept="application/json,.json" class="hidden" onChange={(e) => onImport((e.target as HTMLInputElement).files?.[0])} /></label>
        </div>
        <button class="tap w-full rounded-lg border border-red-300 text-sm text-red-700" onClick={wipe}>清除所有資料</button>
      </section>

      <section class="text-xs text-gray-500"><p>TRSAT 租屋收件匣 v{APP_VERSION}</p><p>資料只存在此裝置。</p></section>
    </main>
  );
}
```

在 `app.tsx`：`/settings` 分支改為 `<SettingsScreen />`。

- [ ] **Step 4: 執行確認通過**

Run: `npm test -w apps/pwa && npm run typecheck -w apps/pwa` → Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add apps/pwa
git commit -m "feat(pwa): settings with profile editor, enrich endpoint, export/import, wipe"
```

---

### Task 17: 首次啟用 Onboarding 與 iOS 補償

**Files:**
- Create: `apps/pwa/src/screens/Onboarding.tsx`
- Modify: `apps/pwa/src/app.tsx`
- Test: `apps/pwa/test/onboarding.test.tsx`

**Interfaces:**
- Produces: `isOnboarded(): Promise<boolean>`、`setOnboarded(): Promise<void>`（`db.meta` key `onboarded`）、`<Onboarding onDone />`、`isIosSafari(): boolean`

- [ ] **Step 1: 寫失敗測試**

`apps/pwa/test/onboarding.test.tsx`：
```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { App } from '../src/app';
import { clearAll } from '../src/db';
import { isOnboarded } from '../src/screens/Onboarding';

beforeEach(async () => { await clearAll(); location.hash = ''; sessionStorage.clear(); });

describe('Onboarding', () => {
  it('shows on first run and completes after three steps', async () => {
    render(<App />);
    expect(await screen.findByText(/安裝到主畫面/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '下一步' }));
    expect(await screen.findByText(/確認個人條件/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '下一步' }));
    expect(await screen.findByText(/試著分享一筆/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '開始使用' }));
    await waitFor(async () => expect(await isOnboarded()).toBe(true));
    expect(await screen.findByRole('heading', { name: '房源' })).toBeTruthy();
  });
});
```

- [ ] **Step 2: 執行確認失敗**

Run: `npm test -w apps/pwa` → Expected: FAIL。

- [ ] **Step 3: 實作 Onboarding.tsx 與 App gate**

`apps/pwa/src/screens/Onboarding.tsx`：
```tsx
import { useState } from 'preact/hooks';
import { db } from '../db';
import { navigate } from '../router';

export async function isOnboarded(): Promise<boolean> { return !!(await db.meta.get('onboarded')); }
export async function setOnboarded(): Promise<void> { await db.meta.put({ key: 'onboarded', value: new Date().toISOString() }); }
export function isIosSafari(): boolean {
  const ua = navigator.userAgent;
  return /iP(hone|ad|od)/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS/.test(ua);
}

const STEPS = [
  { title: '安裝到主畫面', body: (ios: boolean) => (ios ? '在 Safari 點「分享」→「加入主畫面」。安裝後才能離線使用。' : '在瀏覽器選單點「安裝應用程式」或「加入主畫面」。') },
  { title: '確認個人條件', body: () => '預算、必備設備、寵物、捷運距離與謝絕條件已預填，可在「設定」隨時修改。所有分級都依此計算。' },
  { title: '試著分享一筆', body: (ios: boolean) => (ios ? 'iPhone 不支援分享到網頁 App：複製房源文字或連結後，到「收件匣」按「貼上文字或連結」。' : '在 591 / Threads / FB 按「分享」→ 選「租屋收件匣」，房源會立刻被解析與分級。') },
];

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const ios = isIosSafari();
  const last = i === STEPS.length - 1;
  return (
    <main class="mx-auto flex min-h-screen max-w-lg flex-col justify-center p-6">
      <p class="mb-2 text-xs text-gray-500">步驟 {i + 1} / {STEPS.length}</p>
      <h1 class="mb-3 text-2xl font-bold">{STEPS[i].title}</h1>
      <p class="mb-8 text-base text-gray-700 dark:text-gray-300">{STEPS[i].body(ios)}</p>
      <div class="flex gap-2">
        {i === 1 && <button class="tap flex-1 rounded-lg border text-sm" onClick={async () => { await setOnboarded(); onDone(); navigate('/settings'); }}>先去設定</button>}
        <button class="tap flex-1 rounded-lg bg-primary text-sm font-medium text-white" onClick={async () => { if (last) { await setOnboarded(); onDone(); } else setI(i + 1); }}>{last ? '開始使用' : '下一步'}</button>
      </div>
    </main>
  );
}
```

在 `app.tsx` 的 `App` 內加入（並把 hooks import 改為 `import { useEffect, useState } from 'preact/hooks';`，新增 `import { Onboarding, isOnboarded } from './screens/Onboarding';`）：
```tsx
const [onboarded, setOnb] = useState<boolean | null>(null);
useEffect(() => { isOnboarded().then(setOnb); }, []);
// ...在 return 前：
if (onboarded === null) return null;
if (!onboarded && route.path !== '/share') return <><Onboarding onDone={() => setOnb(true)} /><ToastHost /></>;
```
（分享進來的第一筆優先處理，不被 onboarding 擋住。）

- [ ] **Step 4: 執行確認通過**

Run: `npm test -w apps/pwa && npm run typecheck -w apps/pwa` → Expected: PASS（`app.test.tsx` 的殼層測試需先在 `beforeEach` 呼叫 `setOnboarded()`；更新該測試）。

- [ ] **Step 5: Commit**

```bash
git add apps/pwa
git commit -m "feat(pwa): first-run onboarding with iOS paste guidance"
```

---

### Task 18: Playwright e2e smoke、CI 補齊、文件

**Files:**
- Create: `apps/pwa/playwright.config.ts`, `apps/pwa/e2e/smoke.spec.ts`
- Modify: `.github/workflows/ci.yml`（新增 e2e job）
- Modify: `README.md`、`docs/README.md`
- Modify: `apps/pwa/package.json`（`build` 前注入版本：`"build": "VITE_APP_VERSION=$npm_package_version vite build"`）

**Interfaces:**
- Consumes: 全部前述畫面。
- Produces: `npm run e2e -w apps/pwa`。

- [ ] **Step 1: Playwright 設定與測試**

`apps/pwa/playwright.config.ts`：
```ts
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: { baseURL: 'http://localhost:4173', ...devices['Pixel 7'] },
  webServer: { command: 'npm run build && npx vite preview --port 4173 --strictPort', port: 4173, reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
```

`apps/pwa/e2e/smoke.spec.ts`：
```ts
import { test, expect } from '@playwright/test';

const post = '大安區獨立套房\n租金 14,500/月\n變頻冷氣 冰箱 洗衣機 對外窗\n可養貓 捷運科技大樓站 步行6分';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => indexedDB.deleteDatabase('trsat'));
  await page.goto('/');
  // complete onboarding
  await page.getByRole('button', { name: '下一步' }).click();
  await page.getByRole('button', { name: '下一步' }).click();
  await page.getByRole('button', { name: '開始使用' }).click();
});

test('share_target query → preview → 加入 → listed', async ({ page }) => {
  await page.goto(`/?text=${encodeURIComponent(post)}`);
  await expect(page.getByText('NT$14,500')).toBeVisible();
  await expect(page.getByText('符合')).toBeVisible();
  await page.getByRole('button', { name: '加入房源' }).click();
  await expect(page).toHaveURL(/#\/$/);
  await expect(page.getByText('NT$14,500')).toBeVisible();
});

test('works offline after first load', async ({ page, context }) => {
  await page.goto(`/?text=${encodeURIComponent(post)}`);
  await page.getByRole('button', { name: '加入房源' }).click();
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('NT$14,500')).toBeVisible();
  await page.goto(`/?text=${encodeURIComponent('中和雅房 8000')}`);
  await expect(page.getByText('NT$8,000')).toBeVisible();
  await context.setOffline(false);
});

test('export then import restores data', async ({ page }) => {
  await page.goto(`/?text=${encodeURIComponent(post)}`);
  await page.getByRole('button', { name: '加入房源' }).click();
  await page.goto('/#/settings');
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: '匯出 JSON' }).click()]);
  const path = await download.path();
  await page.evaluate(() => indexedDB.deleteDatabase('trsat'));
  await page.reload();
  await page.getByRole('button', { name: '下一步' }).click(); await page.getByRole('button', { name: '下一步' }).click(); await page.getByRole('button', { name: '開始使用' }).click();
  await page.goto('/#/settings');
  await page.locator('input[type=file]').setInputFiles(path!);
  await page.goto('/#/');
  await expect(page.getByText('NT$14,500')).toBeVisible();
});
```

- [ ] **Step 2: 本機執行**

Run: `npm run e2e -w apps/pwa`
Expected: 3 passed。若 offline 測試在本機 preview 失敗，確認 `vite preview` 有提供 `sw.js`（`dist/sw.js` 存在）且 URL 為 `http://localhost`（SW 允許的安全來源）。

- [ ] **Step 3: CI 加入 e2e job，README 與 docs 索引**

`.github/workflows/ci.yml` 在 `test-build` 之後加入：
```yaml
  e2e:
    runs-on: ubuntu-latest
    needs: [test-build]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run e2e -w apps/pwa
        env: { CI: 'true' }
      - uses: actions/upload-artifact@v4
        if: failure()
        with: { name: playwright-report, path: apps/pwa/playwright-report }
```
並讓 `deploy-pages` 的 `needs` 改為 `[secrets, test-build, e2e]`。

`README.md` 新架構段落補上：
```markdown
> 手機安裝：開啟 GitHub Pages 網址 → 加入主畫面。Android 之後可從任何 App 的「分享」選單送房源進來；iPhone 請複製後在收件匣按「貼上」。
> 補抓與排程抓取（591 / PTT / Threads / FB）屬 Phase 2 CLI，見 spec 第 4.3、8 節與 Plan 2。
```

`docs/README.md`「開發計畫」段落已在撰寫計畫時加入本計畫連結；確認連結存在即可。

- [ ] **Step 4: 全套驗證**

Run: `npm run typecheck && npm test && npm run build && npm run check:secrets`
Expected: 全綠；`apps/pwa/dist/` 產生。

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test(pwa): playwright smoke (share, offline, export/import); ci e2e job; docs"
```

---

## 完成定義（Phase 0–1）

- [ ] `npm test`、`npm run typecheck`、`npm run build`、`npm run e2e -w apps/pwa` 全綠；CI 綠燈並部署到 GitHub Pages。
- [ ] 手機（Android Chrome）可安裝，從 591 / Threads / FB 的分享選單送入連結或文字，3 秒內出現預覽卡與分級。
- [ ] iPhone 可用「貼上」流程完成相同結果。
- [ ] 斷網後重開 App 仍可瀏覽與新增。
- [ ] 設定頁修改預算後，所有房源分級即時重算。
- [ ] `scripts/check-secrets.sh` 與 gitleaks 通過；repo 內無金鑰實值。
- [ ] Chrome Lighthouse「PWA 可安裝」檢查全數通過（manifest、SW、icons、HTTPS）。
- [ ] 以 30 筆真實貼文（使用者自行蒐集、不入 repo）人工驗證分級一致率 ≥ 90%；不一致者回寫為 `packages/core/test/fixtures/posts.ts` 的去識別化樣本。

## Plan 2 預告（不在本計畫）

`packages/cli`（`trsat fetch / search 591 / ptt / watch / login / sessions / serve`）、`core/profileQuery`、`trsat-data` 私有 repo 與 GitHub Actions cron、PWA Settings 的 GitHub PAT 同步、pHash 計算。待本計畫 Task 18 完成並取得第一批真實 591 回應 fixture 後撰寫。


---

## 執行後待辦（最終審查列為「可延後」的項目）

以下為逐任務審查與最終整體審查中記錄、經判定不阻擋合併的小項，供 Phase 2 或清理任務處理：

1. `scripts/check-secrets.sh` 僅比對已知前綴；泛用偵測依賴 gitleaks（CI 已啟用）。
2. `docs/02_Technical_Guides`、`docs/04_Reports` 仍引用已移除的 legacy npm scripts（`logs:monitor`、`test:quick`、`test:firecrawl`、`example:firecrawl`）。
3. `packages/core/src/extract.ts`：萬／格局／押金／管理費 regex 仍用 `\s*`，可能跨行誤配；建議共用 `[ \t]*`。
4. `extractRent` 的 4–5 位數字 fallback 取第一個合理數字，地址中的數字可能誤判。
5. `rules.ts`：`district` 不在字典且無 `city` 時會靜默通過 `in_cities`（目前解析器產生不出此狀態，僅手動輸入可及）。
6. `db.ts`：`recomputeRules` 在 `saveProfile` 時重跑 O(n²) 去重；`setStatus` 的 get→put 未包在 transaction 內。
7. `Detail.tsx`：檢視模式隱藏「租金」資訊格（租金仍在標題大字），建議恢復並改用範圍限定的測試查詢。
8. `Settings.tsx`：「關於」區塊無標題；checkbox 本身未加 `.tap`（label 提供點擊區）；`downloadJson` 在 jsdom 無法測試。
9. `index.html` 仍向 `fonts.googleapis.com` 取字型；local-first 定位下建議自行託管子集或改用系統字體。
10. `Share.tsx` 的 QuotaExceededError 提示只在分享加入路徑；收件匣加入與匯入路徑可共用同一 helper。
11. e2e `resetAndOnboard` 的 IndexedDB 刪除在 `onblocked` 時直接 resolve（由後續 reload 補償）。
12. 產品端待辦：手機實機驗收（Android 分享選單、iPhone 貼上）、Lighthouse PWA 安裝檢查於 Pages 子路徑、30 筆真實貼文的分級一致率驗收（spec 2.3）。
