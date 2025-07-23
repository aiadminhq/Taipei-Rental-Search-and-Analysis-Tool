# MCP 整合指南 - 21st.dev Magic

**建立日期**: 2025-07-13  
**版本**: v1.0  
**目標**: 整合 21st.dev Magic 到 Claude Desktop 和 Claude Code

---

## 🎯 配置概述

### 已完成配置項目

#### 1. **Claude Desktop 配置**
檔案位置: `/Users/christianwu/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "@21st-dev/magic": {
      "command": "npx",
      "args": ["-y", "@21st-dev/magic@latest", "API_KEY=\"2f7832c86dfbe8e3c61e329443a5ff1b2c0c9b6e9ecfb1514d5d9a8db102ebaf\""],
      "env": {
        "NODE_ENV": "production",
        "PROJECT_TYPE": "rental-analysis-platform", 
        "DESIGN_SYSTEM": "modern-tech"
      }
    },
    "mcp-server-firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-6f5e1e3b20174bdeb0b5250e54238476"
      }
    }
  }
}
```

#### 2. **Claude Code 專案配置**
檔案位置: `.claude_project_config.json`

包含完整的專案設定：
- MCP 服務器配置
- 設計系統參數
- 開發階段規劃
- 工具整合設定

#### 3. **Claude Code Settings 更新**
檔案位置: `~/.claude/settings.json`

新增環境變數：
- `MAGIC_API_KEY`: API 認證金鑰
- `PROJECT_TYPE`: 專案類型識別
- `DESIGN_SYSTEM`: 設計系統標識

---

## 🚀 使用方法

### 在 Claude Desktop 中

1. **重啟 Claude Desktop** 應用程式
2. **確認 MCP 連接** - 查看是否出現 Magic 工具
3. **測試基本功能**:
   ```
   使用 21st Magic 生成一個現代科技風格的房源卡片組件
   ```

### 在 Claude Code 中

1. **開啟專案目錄**:
   ```bash
   cd /Users/christianwu/Claudia/scripts/591-Notion/591-notion-automation-Augment
   ```

2. **確認配置載入**:
   ```bash
   cat .claude_project_config.json
   ```

3. **開始使用 Magic 工具**:
   - 快速組件生成
   - AI 輔助開發
   - 設計系統整合

---

## 🛠️ MCP 工具功能

### 21st.dev Magic 核心能力

#### 1. **快速原型開發**
```bash
# 生成房源卡片組件
npx -y @21st-dev/magic@latest generate-component \
  --type="property-card" \
  --style="modern-tech" \
  --primary-color="#0400ff" \
  --accent-color="#00ffcc"
```

#### 2. **AI 驅動開發**
- 智能代碼生成
- 設計系統整合
- 響應式佈局優化

#### 3. **與現有工具協作**
- **UX Pilot**: 設計 → Magic 實現
- **v0.dev**: Magic 生成 → v0 優化
- **Claude Code**: Magic 輔助 → 系統整合

### Firecrawl 核心能力

#### 1. **網站內容爬取**
```bash
# 爬取房源網站內容
firecrawl-mcp crawl --url="https://rent.591.com.tw" \
  --format="structured" \
  --extract="property-listings"
```

#### 2. **結構化數據提取**
- 自動識別房源資訊
- 提取價格、地址、設備等關鍵數據
- 支援多租屋網站格式

#### 3. **批量處理能力**
- 批量爬取多個房源頁面
- 自動處理反爬蟲機制
- 高效的數據清理和標準化

#### 4. **與 AI 分析整合**
- **Firecrawl**: 數據爬取 → Claude 分析
- **結構化輸出**: 直接整合到 AI 分析流程
- **即時更新**: 持續監控房源變化

### 專案特定配置

#### 環境變數設置
```bash
PROJECT_TYPE="rental-analysis-platform"
DESIGN_SYSTEM="modern-tech"
PRIMARY_COLOR="#0400ff"
ACCENT_COLOR="#00ffcc"
INTERACTIVE_COLOR="#ff00c8"
TARGET_FRAMEWORK="react"
CSS_FRAMEWORK="tailwindcss"
FONT_FAMILY="Outfit"
```

#### 開發階段整合

**Phase 1: 設計階段**
- UX Pilot 生成設計
- Magic 快速原型實現
- 設計系統標準化

**Phase 2: 開發階段**
- Magic 生成 React 組件
- v0.dev 細節優化
- 響應式佈局實現

**Phase 3: 整合階段**
- Claude Code 系統整合
- Magic 效能優化
- AI 功能集成

**Phase 4: 部署階段**
- Replit 部署準備
- Magic 生產優化
- 監控系統設置

---

## 🔧 故障排除

### 常見問題

#### 1. **MCP 服務器無法啟動**
```bash
# 檢查 npx 是否可用
npx --version

# 檢查網路連接
ping 21st.dev

# 手動測試 Magic
npx -y @21st-dev/magic@latest --help
```

#### 2. **API 金鑰問題**
- 確認金鑰格式正確
- 檢查 API 配額限制
- 驗證網路權限

#### 3. **環境變數不生效**
```bash
# 檢查環境變數
echo $MAGIC_API_KEY
echo $PROJECT_TYPE

# 重新載入設置
source ~/.claude/settings.json
```

### 除錯步驟

1. **檢查配置檔案**:
   ```bash
   cat "/Users/christianwu/Library/Application Support/Claude/claude_desktop_config.json"
   ```

2. **驗證工具可用性**:
   ```bash
   npx -y @21st-dev/magic@latest status
   ```

3. **測試基本功能**:
   ```bash
   npx -y @21st-dev/magic@latest generate --type="test" --style="modern"
   ```

---

## 📈 效能監控

### 使用指標

- **生成速度**: 組件生成時間
- **代碼品質**: 生成代碼的可維護性
- **設計一致性**: 與設計系統的符合度
- **API 使用量**: 配額使用監控

### 最佳化建議

1. **批次處理**: 一次生成多個相關組件
2. **模板重用**: 建立常用組件模板
3. **快取策略**: 利用本地快取提升速度
4. **漸進式生成**: 從簡單到複雜逐步建構

---

## 🎯 下一步行動

### 即時可執行任務

1. **測試 Magic 工具**:
   - 生成第一個房源卡片組件
   - 驗證設計系統整合
   - 測試與 UX Pilot 的協作

2. **建立開發工作流程**:
   - 定義組件生成標準
   - 建立代碼審查流程
   - 設置自動化測試

3. **整合其他工具**:
   - 連接 v0.dev 工作流程
   - 設置 Replit 部署管道
   - 配置監控和日誌系統

### 長期發展規劃

1. **擴展 MCP 生態**:
   - 整合更多 AI 開發工具
   - 建立自定義 MCP 服務器
   - 優化工具間協作效率

2. **建立最佳實踐**:
   - 記錄成功案例
   - 建立組件庫標準
   - 分享開發經驗

---

**配置完成！** 🎉 

現在您可以在 Claude Desktop 和 Claude Code 中使用 21st.dev Magic 工具來加速智能房源分析平台的開發進程。