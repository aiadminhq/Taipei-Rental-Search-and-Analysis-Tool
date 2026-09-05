# Firecrawl 整合指南 - 591 Notion 自動化系統

**建立日期**: 2025-07-13  
**版本**: v1.0  
**目標**: 整合 Firecrawl 進階網頁抓取功能到租屋 CRM 系統

---

## 🎯 整合概述

### 什麼是 Firecrawl？

Firecrawl 是一個進階的網頁抓取和資料提取服務，提供：
- **智能內容提取**: 自動識別主要內容
- **多格式輸出**: 支援 Markdown、HTML、結構化資料
- **反爬蟲處理**: 處理 JavaScript 渲染和動態內容
- **批量處理**: 高效的大規模抓取能力

### 整合優勢

1. **提升資料品質**: 更準確的房源資訊提取
2. **增強穩定性**: 減少因網站變更導致的抓取失敗
3. **擴展功能**: 支援更多房源網站
4. **智能處理**: AI 輔助的內容理解和結構化

---

## 🚀 快速開始

### 1. 環境設定

```bash
# 1. 設定環境變數
cp .env.example .env

# 2. 編輯 .env 檔案，添加 Firecrawl API 金鑰
FIRECRAWL_API_KEY=fc-your-firecrawl-key
```

### 2. 安裝依賴

```bash
# 安裝 Firecrawl MCP 套件
npm install -g firecrawl-mcp

# 或使用 npx (推薦)
npx -y firecrawl-mcp --version
```

### 3. 配置 Claude Desktop

將以下配置添加到 Claude Desktop 配置檔案：

**檔案位置**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-your-firecrawl-key"
      }
    },
    "rental-crm-mcp": {
      "command": "node",
      "args": ["src/mcp/mcpServer.js"],
      "cwd": "/path/to/your/project",
      "env": {
        "NODE_ENV": "production",
        "MCP_PORT": "3001",
        "FIRECRAWL_API_KEY": "fc-your-firecrawl-key"
      }
    }
  }
}
```

### 4. 啟動服務

```bash
# 啟動 MCP 服務器
npm run mcp

# 或啟動完整 CRM 系統
npm run crm
```

---

## 🛠️ 使用方法

### 基本網頁抓取

```javascript
const FirecrawlService = require('./src/services/firecrawlService');

const firecrawl = new FirecrawlService();

// 抓取單一網頁
const result = await firecrawl.scrapeUrl('https://example.com', {
  formats: ['markdown', 'html'],
  onlyMainContent: true,
  waitFor: 2000
});

console.log(result.data.markdown);
```

### 591 房源資料提取

```javascript
// 提取 591 房源資料
const extractResult = await firecrawl.extract591RentalData(
  'https://rent.591.com.tw/home/14123456'
);

if (extractResult.success) {
  console.log('房源資料:', extractResult.data);
  // 輸出: { title, price, location, roomType, area, ... }
}
```

### 批量處理

```javascript
const urls = [
  'https://rent.591.com.tw/home/14123456',
  'https://rent.591.com.tw/home/14123457',
  'https://rent.591.com.tw/home/14123458'
];

const batchResult = await firecrawl.batchScrape(urls, {
  batchSize: 5,
  delay: 1000
});

console.log('批量處理結果:', batchResult);
```

---

## 🔌 MCP API 接口

### 1. 基本抓取接口

**POST** `/mcp/firecrawl/scrape`

```json
{
  "url": "https://example.com",
  "options": {
    "formats": ["markdown", "html"],
    "onlyMainContent": true,
    "waitFor": 2000
  }
}
```

### 2. 591 房源提取接口

**POST** `/mcp/firecrawl/extract-591`

```json
{
  "url": "https://rent.591.com.tw/home/14123456",
  "processToNotion": true
}
```

### 3. 批量抓取接口

**POST** `/mcp/firecrawl/batch-scrape`

```json
{
  "urls": ["url1", "url2", "url3"],
  "options": {
    "batchSize": 5,
    "delay": 1000
  }
}
```

### 4. 服務狀態檢查

**GET** `/mcp/status`

回應包含 Firecrawl 服務狀態：

```json
{
  "success": true,
  "services": {
    "notion": "connected",
    "firecrawl": "connected",
    "mapper": "ready",
    "scorer": "ready"
  }
}
```

---

## 🧪 測試和驗證

### 1. 基本連接測試

```bash
# 執行 Firecrawl 整合測試
node test-firecrawl-integration.js
```

### 2. MCP 客戶端測試

```bash
# 執行 MCP 客戶端示範
node examples/firecrawlMcpClient.js
```

### 3. 手動測試步驟

1. **檢查服務狀態**:
   ```bash
   curl http://localhost:3001/mcp/status
   ```

2. **測試基本抓取**:
   ```bash
   curl -X POST http://localhost:3001/mcp/firecrawl/scrape \
     -H "Content-Type: application/json" \
     -d '{"url": "https://example.com"}'
   ```

3. **測試 591 提取**:
   ```bash
   curl -X POST http://localhost:3001/mcp/firecrawl/extract-591 \
     -H "Content-Type: application/json" \
     -d '{"url": "https://rent.591.com.tw/home/14123456"}'
   ```

---

## 📊 監控和日誌

### 日誌檔案

- **Firecrawl 服務日誌**: `logs/firecrawl.log`
- **MCP 服務器日誌**: `logs/mcp-server.log`
- **應用程式主日誌**: `logs/app.log`

### 監控指標

```bash
# 查看 Firecrawl 日誌
tail -f logs/firecrawl.log

# 查看 MCP 服務器日誌
tail -f logs/mcp-server.log

# 查看所有相關日誌
npm run logs:enhanced
```

### 效能監控

- **API 使用量**: 監控 Firecrawl API 配額
- **抓取成功率**: 追蹤抓取成功/失敗比例
- **處理時間**: 監控平均處理時間
- **錯誤率**: 追蹤錯誤類型和頻率

---

## 🔧 故障排除

### 常見問題

#### 1. **Firecrawl API 金鑰錯誤**

```
錯誤: FIRECRAWL_API_KEY environment variable is required
```

**解決方案**:
- 檢查 `.env` 檔案中的 `FIRECRAWL_API_KEY` 設定
- 確認 API 金鑰格式正確
- 驗證 API 金鑰是否有效

#### 2. **MCP 服務器無法啟動**

```
錯誤: MCP Server 啟動失敗
```

**解決方案**:
```bash
# 檢查端口是否被佔用
lsof -i :3001

# 檢查環境變數
echo $FIRECRAWL_API_KEY
echo $NOTION_API_KEY

# 重新啟動服務
npm run mcp
```

#### 3. **抓取失敗或超時**

```
錯誤: Firecrawl scraping failed
```

**解決方案**:
- 檢查目標網站是否可訪問
- 增加 `timeout` 設定值
- 檢查網路連接
- 驗證 API 配額是否充足

### 除錯步驟

1. **檢查服務狀態**:
   ```bash
   curl http://localhost:3001/mcp/status
   ```

2. **驗證 Firecrawl 連接**:
   ```bash
   node -e "
   const FirecrawlService = require('./src/services/firecrawlService');
   const service = new FirecrawlService();
   service.testConnection().then(() => console.log('✅ 連接成功')).catch(console.error);
   "
   ```

3. **檢查日誌**:
   ```bash
   tail -n 50 logs/firecrawl.log
   tail -n 50 logs/mcp-server.log
   ```

---

## 🎯 最佳實踐

### 1. API 使用優化

- **批量處理**: 使用批量接口處理多個 URL
- **快取策略**: 啟用快取以減少重複請求
- **請求間隔**: 設定適當的請求延遲
- **錯誤重試**: 實施智能重試機制

### 2. 資料品質保證

- **資料驗證**: 驗證提取的資料完整性
- **格式標準化**: 統一資料格式和結構
- **錯誤處理**: 優雅處理抓取失敗情況
- **監控警報**: 設定品質監控警報

### 3. 效能優化

- **並行處理**: 合理使用並行抓取
- **資源管理**: 監控記憶體和 CPU 使用
- **連接池**: 使用連接池管理 HTTP 請求
- **負載均衡**: 分散 API 請求負載

---

## 🚀 下一步發展

### 短期目標

1. **擴展支援網站**: 支援更多房源網站
2. **智能分類**: AI 輔助的房源分類
3. **即時監控**: 實時房源變更監控
4. **自動化流程**: 完全自動化的處理流程

### 長期規劃

1. **機器學習整合**: 使用 ML 提升提取準確性
2. **多語言支援**: 支援多語言房源網站
3. **API 生態系統**: 建立完整的 API 生態
4. **雲端部署**: 支援雲端規模化部署

---

**整合完成！** 🎉

現在您可以使用 Firecrawl 的強大功能來提升 591 Notion 自動化系統的資料抓取和處理能力。
