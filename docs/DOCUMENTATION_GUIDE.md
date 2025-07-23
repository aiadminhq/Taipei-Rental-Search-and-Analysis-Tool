# 專案文檔整理指南

## 🎯 目的

本指南旨在整理現有的專案文檔，建立一個清晰、易於維護的文檔結構。目前專案擁有多個版本的藍圖和需求文檔，這表明專案經過了不同階段的演進。為了統一標準並方便團隊協作，建議進行以下整理。

---

## 📂 建議的文檔結構

我建議在 `docs` 資料夾內建立更清晰的子目錄結構，如下所示：

```
docs/
├── 📄 DOCUMENTATION_GUIDE.md  (本檔案)
├── 📄 README.md               (新的文檔入口/索引)
├── 📁 00_Project_Blueprints/   # 存放核心的產品藍圖與需求
│   ├── App_Blueprint_Master.md
│   └── PRD_Master.md
├── 📁 01_Development_Plans/    # 存放不同開發週期的計畫
│   └── MVP_Development_Plan.md
├── 📁 02_Technical_Guides/     # 存放技術整合與設定指南
│   ├── GITHUB_SETUP.md
│   ├── FIRECRAWL_GUIDE.md
│   ├── MCP_GUIDE.md
│   └── ...
├── 📁 03_UX_UI_Design/         # 存放所有UI/UX相關的設計文檔
│   └── UIUX_Master_Guide.md
├── 📁 04_Reports/              # 存放分析報告與總結
│   ├── OPTIMIZATION-REPORT.md
│   └── ...
└── 📁 _Archive/                # 存放所有舊版或已合併的文檔
```

---

## 📑 現有文件分析與合併建議

以下是對現有主要文件的摘要及處理建議：

#### 核心藍圖與需求 (建議合併)

*   **`APP_BLUEPRINT.md`, `統整版_APP_Blueprint.md`, `智能房源分析平台 App Blueprint.md`**
    *   **摘要**: 這三份文件都是專案的應用程式藍圖，描述了系統架構、功能模組和設計原則，但版本和細節略有不同。"統整版" 似乎是最新、最全面的。
    *   **建議**: 將這三份文件的精華內容合併成一份主要的 **`App_Blueprint_Master.md`**，放在 `00_Project_Blueprints/` 中。舊檔案移至 `_Archive/`。

*   **`個人租屋分析工具-簡化版需求.md`, `智能房源分析平台 產品需求文檔 (PRD).md`**
    *   **摘要**: 這兩份是產品需求文檔，定義了產品的目標、用戶、功能和成功指標。
    *   **建議**: 合併為一份權威的 **`PRD_Master.md`**，放在 `00_Project_Blueprints/` 中。舊檔案移至 `_Archive/`。

#### 開發計畫 (建議合併)

*   **`個人租屋分析工具-8小時開發計劃.md`, `智能房源分析平台 一日MVP版本規劃.md`**
    *   **摘要**: 這兩份文件都描述了如何在極短時間內開發出一個最小可行產品 (MVP)。
    *   **建議**: 內容高度相似，建議合併為一份 **`MVP_Development_Plan.md`**，放在 `01_Development_Plans/` 中，詳細說明快速開發的策略與時程。

#### UI/UX 設計指南 (建議合併)

*   **`AI_UX_Design_Knowledge_Base.md`, `AI_UX_Quick_Reference.md`, `UX_Pilot_設計指南_更新版.md`, `uiux-guide.md`**
    *   **摘要**: 這些文件涵蓋了從 AI 設計工具的使用、設計原則到具體組件庫的完整 UI/UX 知識。
    *   **建議**: 內容關聯性極高，應合併為一份全面的 **`UIUX_Master_Guide.md`**，放在 `03_UX_UI_Design/` 中，作為團隊的設計聖經。

#### 獨立指南與報告 (建議保留並分類)

*   **`GITHUB-SETUP.md`, `FIRECRAWL_整合指南.md`, `MCP_整合指南.md`, `MONITOR-GUIDE.md`**
    *   **摘要**: 這些是針對特定技術或工具的設定與使用指南。
    *   **建議**: 內容獨立且重要，建議保留原檔案名，並全部移至 `02_Technical_Guides/` 資料夾。

*   **`OPTIMIZATION-REPORT.md`, `FIRECRAWL_整合總結.md`, `智能房源分析平台 專案交付總結.md`**
    *   **摘要**: 這些是專案特定階段的報告或總結。
    *   **建議**: 保留原檔案名，並全部移至 `04_Reports/` 資料夾。

---

## ❓ 回答您的問題

#### 1. 一個專案是否有多個計畫？
是的，從文件來看，您的專案至少包含：
*   **完整功能版**: 如 `統整版_APP_Blueprint.md` 所述的全面計畫。
*   **快速 MVP 版**: 如 `一日MVP版本規劃.md` 所述的精簡計畫。

這很常見，代表專案有不同的實施策略。將它們分類存放在 `01_Development_Plans/` 中，可以讓團隊根據不同目標（例如：快速驗證市場 vs. 開發完整產品）選擇合適的計畫。

#### 2. 是否要列表子計畫內容？
是的，我建議在新的 `docs/README.md` 中建立一個清晰的索引，類似下方這樣：

```markdown
# 專案文檔庫

歡迎來到智能房源分析平台的文檔中心。

## 核心設計
- **[產品需求文檔 (PRD)](./00_Project_Blueprints/PRD_Master.md)**
- **[應用程式藍圖 (App Blueprint)](./00_Project_Blueprints/App_Blueprint_Master.md)**
- **[資料庫結構](./00_Project_Blueprints/資料庫欄位.md)**

## 開發計畫
- **[MVP 開發計畫](./01_Development_Plans/MVP_Development_Plan.md)**

## 技術指南
- **[GitHub 部署指南](./02_Technical_Guides/GITHUB_SETUP.md)**
- **[Firecrawl 整合指南](./02_Technical_Guides/FIRECRAWL_GUIDE.md)**
- ...

## 設計規範
- **[UI/UX 設計指南](./03_UX_UI_Design/UIUX_Master_Guide.md)**
```

---

## ➕ 建議補充的資訊

為了讓文檔更完整，我建議在 `docs/README.md` 中補充以下內容：

1.  **專案總覽 (Project Overview)**:
    *   用 2-3 句話總結這個專案是做什麼的、核心價值是什麼。

2.  **技術棧概覽 (Tech Stack Overview)**:
    *   簡要列出前端、後端、資料庫和主要 AI 服務的技術選型，讓人能快速了解專案的技術背景。

3.  **如何貢獻 (How to Contribute)**:
    *   為團隊成員提供簡單的指引，例如：如何提出修改建議、文件命名規範等。

這個 `DOCUMENTATION_GUIDE.md` 檔案將作為我們整理工作的藍圖。如果您同意，下一步我將開始建立這些資料夾並移動檔案。
