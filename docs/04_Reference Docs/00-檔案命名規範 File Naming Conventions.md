# 📝 檔案命名規範 | File Naming Conventions

## 🎯 規範目的 | Purpose

建立統一的檔案命名標準，確保專案檔案的一致性、可維護性和易於搜尋。所有團隊成員都應遵循這些規範，以維持專案的整潔和專業性。

## 📋 基本原則 | Basic Principles

### 1. 一致性原則 | Consistency
- 同類型檔案使用相同的命名模式
- 保持命名風格的統一性
- 遵循既定的分類和結構

### 2. 可讀性原則 | Readability
- 使用有意義的檔案名稱
- 避免過於簡化的縮寫
- 優先使用繁體中文，必要時加英文對照

### 3. 可維護性原則 | Maintainability
- 包含版本資訊（如需要）
- 包含日期資訊（如需要）
- 便於排序和分類

## 🗂️ 資料夾命名規範 | Folder Naming Standards

### 主要分類資料夾 | Main Category Folders
```
格式：[編號]-[中文名稱] | [English Name]
範例：
├── 01-核心策略文件
├── 02-簡報與展示
├── 03-研究報告
├── 04-組織架構
├── 05-技術設定與工具
├── 06-對話記錄
├── 07-網頁開發
└── 08-備份與歷史
```

### 子資料夾命名 | Subfolder Naming
```
格式：[功能描述]_[詳細說明]
範例：
├── AI工具投資ROI深度驗證研究報告/
├── presentation_assets/
├── index-cline/
└── backup_2025-06-23/
```

## 📄 檔案命名規範 | File Naming Standards

### 1. 策略文件 | Strategic Documents
```
格式：[公司名稱]_[文件類型]_[具體內容].md
範例：
├── 12Group 轉型策略 - Claude_250620.md
├── 企業數位轉型與AI導入策略 - 案例研究_250624.md
└── 完整組織架構建議 | Complete Organization Structure Proposal.md
```

### 2. 研究報告 | Research Reports
```
格式：[主題]_[研究類型]_[版本/狀態].md
範例：
├── AI工具投資ROI深度驗證研究報告-VERIFIED.md
├── 設計業AI工具深度研究分析報告.md
└── 市場趨勢分析報告_2025Q2.md
```

### 3. 簡報文件 | Presentation Files
```
格式：[時長/類型]_[主題]_[用途].md
範例：
├── 10分鐘簡報架構：12Group轉型與設計創新策略.md
├── 提案簡報大綱.md
└── 執行時程表與行動方案_深化版.md
```

### 4. 技術文件 | Technical Documents
```
格式：[工具/系統名稱]_[文件類型]_[版本].md
範例：
├── Augment_MCP_Setup_Guide.md
├── Figma_MCP_Services_Comparison.md
└── Python_Setup_Guide.md
```

### 5. 對話記錄 | Conversation Records
```
格式：對話框架與詳細結論-[AI模型名稱].md
範例：
├── 對話框架與詳細結論-Claude.md
├── 對話框架與詳細結論-DeepSeek.md
├── 對話框架與詳細結論-Gemini.md
└── 對話框架與詳細結論Grok.md
```

### 6. 組織架構文件 | Organization Documents
```
格式：[文件類型]_[具體內容].[副檔名]
範例：
├── Organization_Chart.svg
├── organization_summary.md
├── organization_matrix_table.pdf
└── final_organization_chart.mermaid
```

### 7. 網頁開發檔案 | Web Development Files
```
格式：[專案名稱]-[檔案類型].[副檔名]
範例：
├── index-cline.html
├── styles-cline.css
├── script.js
└── logo-placeholder.svg
```

## 🏷️ 特殊標記規範 | Special Marking Standards

### 版本標記 | Version Marking
```
格式：[檔案名稱]_v[版本號].md
範例：
├── 轉型計劃書_v2.0.md
├── ROI分析報告_v1.3.md
└── 組織架構圖_v2.1.svg
```

### 日期標記 | Date Marking
```
格式：[檔案名稱]_YYYY-MM-DD.md
範例：
├── Tasks_2025-06-23.md
├── 會議記錄_2025-06-20.md
└── 進度報告_2025-06-15.md
```

### 狀態標記 | Status Marking
```
格式：[檔案名稱]-[狀態].md
狀態標記：
├── DRAFT (草稿)
├── REVIEW (審核中)
├── VERIFIED (已驗證)
├── FINAL (最終版)
└── ARCHIVED (已歸檔)

範例：
├── AI研究報告-VERIFIED.md
├── 策略計劃-DRAFT.md
└── 組織架構-FINAL.md
```

## 🚫 命名禁忌 | Naming Restrictions

### 避免使用 | Avoid Using
- **特殊字元**: `< > : " | ? * /`
- **空格開頭或結尾**: ` filename ` ❌
- **連續空格**: `file  name` ❌
- **保留字**: `CON`, `PRN`, `AUX`, `NUL`
- **過長檔名**: 超過 255 字元

### 不建議使用 | Not Recommended
- **純數字檔名**: `123.md` ❌
- **無意義縮寫**: `abc_def.md` ❌
- **混合語言**: `file檔案name.md` ❌
- **特殊符號**: `file@#$.md` ❌

## ✅ 最佳實務 | Best Practices

### 1. 檔案名稱長度 | File Name Length
- **建議長度**: 20-50 字元
- **最大長度**: 不超過 100 字元
- **最小長度**: 至少 5 字元

### 2. 字元使用 | Character Usage
- **優先使用**: 中文、英文、數字、連字號 `-`、底線 `_`
- **分隔符號**: 使用 `-` 分隔不同概念，使用 `_` 分隔同一概念的不同部分
- **大小寫**: 英文使用 PascalCase 或 snake_case

### 3. 排序友好 | Sort-friendly
```
✅ 好的排序：
├── 01-核心策略文件/
├── 02-簡報與展示/
├── 03-研究報告/

✅ 好的版本排序：
├── 報告_v1.0.md
├── 報告_v1.1.md
├── 報告_v2.0.md

✅ 好的日期排序：
├── 記錄_2025-06-20.md
├── 記錄_2025-06-21.md
├── 記錄_2025-06-22.md
```

## 🔄 檔案重命名流程 | File Renaming Process

### 重命名步驟 | Renaming Steps
1. **備份原檔案** → 複製到 `08-備份與歷史/`
2. **更新檔案名稱** → 按照規範重新命名
3. **更新相關連結** → 檢查並更新所有引用
4. **更新索引檔案** → 修改對應的 INDEX.md
5. **測試連結** → 確認所有連結正常運作

### 批量重命名 | Batch Renaming
- 使用一致的命名模式
- 保持檔案的邏輯關係
- 記錄重命名的對應關係
- 更新相關文件的引用

## 📊 命名規範檢查清單 | Naming Convention Checklist

### 新檔案檢查 | New File Checklist
- [ ] 檔案名稱符合分類規範
- [ ] 使用正確的分隔符號
- [ ] 避免特殊字元和保留字
- [ ] 檔案名稱長度適中
- [ ] 包含必要的版本或日期資訊
- [ ] 檔案名稱具有描述性

### 定期檢查 | Regular Review
- **每週**: 檢查新增檔案的命名
- **每月**: 檢視整體命名一致性
- **每季**: 評估命名規範的適用性
- **每年**: 更新和優化命名規範

---

**命名規範維護**: Christian Wu  
**最後更新**: 2025-06-23  
**版本**: v1.0  
**狀態**: 已建立完成

## 📞 聯絡與建議 | Contact & Suggestions

如對命名規範有任何建議或疑問，請聯絡專案負責人。規範會根據實際使用情況定期更新和優化。
