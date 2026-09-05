# 🏠 Taipei-Rental-Search-and-Analysis-Tool (TRSAT)

> **2026-09 起新架構**：本 repo 已改為 npm workspaces monorepo。
> - `apps/pwa`：租屋收件匣 PWA（Vite + Preact，部署至 GitHub Pages）
> - `packages/core`：共用解析／規則／去重函式庫
> - `src/` + `legacy/`：舊 591→Notion/MCP 系統，僅保留參考，見 `legacy/README.md`
> 設計規格：`docs/superpowers/specs/2026-09-05-pwa-rental-mvp-design.md`
> 開發：`npm install && npm run dev`；測試：`npm test`
> 手機安裝：開啟 GitHub Pages 網址 → 加入主畫面。Android 之後可從任何 App 的「分享」選單送房源進來；iPhone 請複製後在收件匣按「貼上」。
> 補抓與排程抓取（591 / PTT / Threads / FB）屬 Phase 2 CLI，見 spec 第 4.3、8 節與 Plan 2。

## 📋 專案概述 | Project Overview

本專案 `Taipei-Rental-Search-and-Analysis-Tool` (TRSAT) 旨在建立一個台北租屋市場的搜尋與分析工具。專案涵蓋數據爬取、數據分析、AI 模型建構、網頁應用開發等關鍵領域。所有文件將依功能分類整理，以確保專案的一致性、可維護性和易於搜尋。

This project, `Taipei-Rental-Search-and-Analysis-Tool` (TRSAT), aims to create a search and analysis tool for the Taipei rental market. The project covers key areas such as data scraping, data analysis, AI model construction, and web application development. All documents are organized by function to ensure project consistency, maintainability, and ease of search.

## 📁 檔案結構 | File Structure

本專案的檔案結構遵循 `[編號]-[中文名稱] | [English Name]` 的主要分類原則，並在子資料夾和檔案命名上保持一致性。

The file structure of this project adheres to the primary classification principle of `[Number]-[Chinese Name] | [English Name]`, maintaining consistency in subfolder and file naming.

```
Taipei-Rental-Search-and-Analysis-Tool/
├── 📁 00-文件模板 | Document Templates/
│   ├── 📄 00-TRSAT 專案導覽系統 Project Navigation System.md
│   ├── 📄 00-TRSAT 專案概述 Project Overview.md
│   ├── 📄 00-檔案命名規範 File Naming Conventions.md
│   ├── 📄 專案架構總覽 Project Structure Overview.md
│   └── 📁 Templates/
│       ├── 📄 TRSAT-專案主控模板.md
│       ├── 📄 TRSAT-研究筆記模板.md
│       └── 📄 TRSAT-會議記錄模板.md
│
├── 📁 01-核心策略文件 | Core Strategy Documents/
│   ├── 📄 TRSAT-專案開發策略-20250720.md
│   └── 📄 TRSAT-MVP功能規劃-20250720.md
│
├── 📁 02-簡報與展示 | Presentations & Demos/
│   ├── 📄 TRSAT-專案啟動簡報大綱.md
│   └── 📄 TRSAT-功能展示簡報-20250720.md
│
├── 📁 03-研究報告 | Research Reports/
│   ├── 📁 台北租屋市場分析報告/
│   │   ├── 📄 台北租屋市場_價格趨勢_分析報告.md
│   │   └── 📄 台北租屋市場_區域熱點_分析報告.md
│   └── 📄 TRSAT-使用者需求研究報告.md
│
├── 📁 04-數據分析與模型 | Data Analysis & Models/
│   ├── 📁 數據清洗與預處理/
│   │   ├── 📄 TRSAT-數據清洗流程.md
│   │   └── 📄 TRSAT-數據預處理腳本.py
│   ├── 📁 租金預測模型/
│   │   ├── 📄 TRSAT-租金預測模型_設計文件.md
│   │   └── 📄 TRSAT-租金預測模型_訓練日誌-20250720.md
│   └── 📄 TRSAT-數據分析報告-20250720.md
│
├── 📁 05-技術設定與工具 | Technical Setup & Tools/
│   ├── 📄 TRSAT-開發環境設定指南.md
│   ├── 📄 TRSAT-API整合文件.md
│   └── 📄 TRSAT-數據庫設計.md
│
├── 📁 06-使用者回饋與日誌 | User Feedback & Logs/
│   ├── 📄 TRSAT-使用者回饋記錄-20250720.md
│   └── 📄 TRSAT-系統錯誤日誌-20250720.md
│
├── 📁 07-網頁應用開發 | Web Application Development/
│   ├── 📁 frontend/
│   │   ├── 📄 TRSAT-前端架構設計.md
│   │   ├── 📄 index.html
│   │   └── 📄 style.css
│   ├── 📁 backend/
│   │   ├── 📄 TRSAT-後端API設計.md
│   │   └── 📄 server.js
│   └── 📄 TRSAT-網頁應用部署指南.md
│
├── 📁 08-備份與歷史 | Backup & History/
│   ├── 📄 TRSAT-專案備份記錄-20250720.zip
│   └── 📄 TRSAT-歷史版本說明.md
│
├── 📁 TRSAT-資料爬取與處理 | Data Scraping & Processing/
│   ├── 📄 TRSAT-591爬蟲設計.md
│   ├── 📄 TRSAT-數據解析腳本.py
│   └── 📄 TRSAT-數據儲存策略.md
│
├── 📁 TRSAT-AI模型與演算法 | AI Models & Algorithms/
│   ├── 📄 TRSAT-推薦系統設計.md
│   ├── 📄 TRSAT-自然語言處理模組.md
│   └── 📄 TRSAT-模型評估報告.md
│
├── 📊 TRSAT-租屋數據集-20250720.csv
├── 📄 README.md
└── 📄 .gitignore
```

### 完整檔名與對應檔案名稱備註 | Full Filename and Corresponding File Name Remarks

| 完整檔名 (Full Filename)                                                              | 對應檔案名稱/描述 (Corresponding File Name/Description) |
| :------------------------------------------------------------------------------------ | :------------------------------------------------------ |
| `00-文件模板 | Document Templates/`                                                 | 文件模板與導覽系統                                      |
| `00-文件模板 | Document Templates/00-TRSAT 專案導覽系統 Project Navigation System.md` | 專案導覽系統主文件                                      |
| `00-文件模板 | Document Templates/00-TRSAT 專案概述 Project Overview.md`            | 專案概述文件                                            |
| `00-文件模板 | Document Templates/00-檔案命名規範 File Naming Conventions.md`       | 專案檔案命名規範                                        |
| `00-文件模板 | Document Templates/專案架構總覽 Project Structure Overview.md`       | 本專案架構總覽文件                                      |
| `00-文件模板 | Document Templates/Templates/`                                       | 實際模板文件存放資料夾                                  |
| `00-文件模板 | Document Templates/Templates/TRSAT-專案主控模板.md`                  | 專案主控模板                                            |
| `00-文件模板 | Document Templates/Templates/TRSAT-研究筆記模板.md`                  | 研究筆記模板                                            |
| `00-文件模板 | Document Templates/Templates/TRSAT-會議記錄模板.md`                  | 會議記錄模板                                            |
| `01-核心策略文件 | Core Strategy Documents/`                                            | 核心策略與計劃文件夾                                    |
| `01-核心策略文件 | Core Strategy Documents/TRSAT-專案開發策略-20250720.md`              | 專案開發策略文件 (2025年7月20日)                        |
| `01-核心策略文件 | Core Strategy Documents/TRSAT-MVP功能規劃-20250720.md`               | 最小可行產品 (MVP) 功能規劃 (2025年7月20日)             |
| `02-簡報與展示 | Presentations & Demos/`                                              | 簡報文件與展示材料文件夾                                |
| `02-簡報與展示 | Presentations & Demos/TRSAT-專案啟動簡報大綱.md`                     | 專案啟動簡報大綱                                        |
| `02-簡報與展示 | Presentations & Demos/TRSAT-功能展示簡報-20250720.md`                | 功能展示簡報 (2025年7月20日)                            |
| `03-研究報告 | Research Reports/`                                                   | 深度研究與分析報告文件夾                                |
| `03-研究報告 | Research Reports/台北租屋市場分析報告/`                                | 台北租屋市場分析報告子資料夾                            |
| `03-研究報告 | Research Reports/台北租屋市場分析報告/台北租屋市場_價格趨勢_分析報告.md` | 台北租屋市場價格趨勢分析報告                            |
| `03-研究報告 | Research Reports/台北租屋市場分析報告/台北租屋市場_區域熱點_分析報告.md` | 台北租屋市場區域熱點分析報告                            |
| `03-研究報告 | Research Reports/TRSAT-使用者需求研究報告.md`                        | 使用者需求研究報告                                      |
| `04-數據分析與模型 | Data Analysis & Models/`                                         | 數據分析與模型文件夾                                    |
| `04-數據分析與模型 | Data Analysis & Models/數據清洗與預處理/`                          | 數據清洗與預處理子資料夾                                |
| `04-數據分析與模型 | Data Analysis & Models/數據清洗與預處理/TRSAT-數據清洗流程.md`     | 數據清洗流程文件                                        |
| `04-數據分析與模型 | Data Analysis & Models/數據清洗與預處理/TRSAT-數據預處理腳本.py`   | 數據預處理 Python 腳本                                  |
| `04-數據分析與模型 | Data Analysis & Models/租金預測模型/`                              | 租金預測模型子資料夾                                    |
| `04-數據分析與模型 | Data Analysis & Models/租金預測模型/TRSAT-租金預測模型_設計文件.md`  | 租金預測模型設計文件                                    |
| `04-數據分析與模型 | Data Analysis & Models/租金預測模型/TRSAT-租金預測模型_訓練日誌-20250720.md` | 租金預測模型訓練日誌 (2025年7月20日)                    |
| `04-數據分析與模型 | Data Analysis & Models/TRSAT-數據分析報告-20250720.md`             | 數據分析報告 (2025年7月20日)                            |
| `05-技術設定與工具 | Technical Setup & Tools/`                                        | 技術配置與工具設定文件夾                                |
| `05-技術設定與工具 | Technical Setup & Tools/TRSAT-開發環境設定指南.md`                 | 開發環境設定指南                                        |
| `05-技術設定與工具 | Technical Setup & Tools/TRSAT-API整合文件.md`                      | API 整合文件                                            |
| `05-技術設定與工具 | Technical Setup & Tools/TRSAT-數據庫設計.md`                       | 數據庫設計文件                                          |
| `06-使用者回饋與日誌 | User Feedback & Logs/`                                           | 使用者回饋與日誌文件夾                                  |
| `06-使用者回饋與日誌 | User Feedback & Logs/TRSAT-使用者回饋記錄-20250720.md`             | 使用者回饋記錄 (2025年7月20日)                          |
| `06-使用者回饋與日誌 | User Feedback & Logs/TRSAT-系統錯誤日誌-20250720.md`               | 系統錯誤日誌 (2025年7月20日)                            |
| `07-網頁應用開發 | Web Application Development/`                                    | 網頁應用開發文件夾                                      |
| `07-網頁應用開發 | Web Application Development/frontend/`                             | 前端開發子資料夾                                        |
| `07-網頁應用開發 | Web Application Development/frontend/TRSAT-前端架構設計.md`          | 前端架構設計文件                                        |
| `07-網頁應用開發 | Web Application Development/frontend/index.html`                   | 前端網頁主頁                                            |
| `07-網頁應用開發 | Web Application Development/frontend/style.css`                    | 前端樣式表                                              |
| `07-網頁應用開發 | Web Application Development/backend/`                              | 後端開發子資料夾                                        |
| `07-網頁應用開發 | Web Application Development/backend/TRSAT-後端API設計.md`            | 後端 API 設計文件                                       |
| `07-網頁應用開發 | Web Application Development/backend/server.js`                     | 後端伺服器腳本                                          |
| `07-網頁應用開發 | Web Application Development/TRSAT-網頁應用部署指南.md`               | 網頁應用部署指南                                        |
| `08-備份與歷史 | Backup & History/`                                                   | 備份文件與版本歷史文件夾                                |
| `08-備份與歷史 | Backup & History/TRSAT-專案備份記錄-20250720.zip`                      | 專案備份記錄 (2025年7月20日)                            |
| `08-備份與歷史 | Backup & History/TRSAT-歷史版本說明.md`                              | 歷史版本說明文件                                        |
| `TRSAT-資料爬取與處理 | Data Scraping & Processing/`                                 | 資料爬取與處理文件夾                                    |
| `TRSAT-資料爬取與處理 | Data Scraping & Processing/TRSAT-591爬蟲設計.md`               | 591 租屋網爬蟲設計文件                                  |
| `TRSAT-資料爬取與處理 | Data Scraping & Processing/TRSAT-數據解析腳本.py`              | 數據解析 Python 腳本                                    |
| `TRSAT-資料爬取與處理 | Data Scraping & Processing/TRSAT-數據儲存策略.md`              | 數據儲存策略文件                                        |
| `TRSAT-AI模型與演算法 | AI Models & Algorithms/`                                     | AI 模型與演算法文件夾                                   |
| `TRSAT-AI模型與演算法 | AI Models & Algorithms/TRSAT-推薦系統設計.md`                  | 推薦系統設計文件                                        |
| `TRSAT-AI模型與演算法 | AI Models & Algorithms/TRSAT-自然語言處理模組.md`              | 自然語言處理模組文件                                    |
| `TRSAT-AI模型與演算法 | AI Models & Algorithms/TRSAT-模型評估報告.md`                  | 模型評估報告文件                                        |
| `TRSAT-租屋數據集-20250720.csv`                                                       | 租屋數據集 (2025年7月20日)                              |
| `README.md`                                                                           | 專案說明文件 (本文件)                                   |
| `.gitignore`                                                                          | Git 忽略文件                                            |
