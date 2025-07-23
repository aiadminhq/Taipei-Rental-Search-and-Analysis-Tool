# MCP 整合版 - 租屋分析工具

**技術棧**：MCP (@21st-dev/magic) + Claude + Gemini Pro 2.5 + React + Node.js  
**開發時間**：8小時  
**部署**：Replit + MCP 服務器

---

## 🔧 MCP 整合架構

### 系統架構圖
```
┌─────────────────────────────────┐
│ 前端 React 應用                 │
│ ├── 房源輸入組件               │
│ ├── AI 分析展示                │
│ └── 結果管理界面               │
├─────────────────────────────────┤
│ Node.js API 服務器              │
│ ├── MCP 客戶端                 │
│ ├── 房源爬蟲服務               │
│ └── Gemini Pro 2.5 整合        │
├─────────────────────────────────┤
│ MCP 服務器層                   │
│ ├── @21st-dev/magic           │
│ ├── Claude API 整合            │
│ └── 智能分析工具               │
├─────────────────────────────────┤
│ 資料存儲層                     │
│ ├── MCP 管理的分析結果         │
│ ├── 瀏覽器 IndexedDB           │
│ └── 可選雲端同步               │
└─────────────────────────────────┘
```

### MCP 配置設定

#### 1. MCP 服務器配置
```json
// mcp/config.json
{
  "mcpServers": {
    "@21st-dev/magic": {
      "command": "npx",
      "args": [
        "-y",
        "@21st-dev/magic@latest",
        "API_KEY=\"2f7832c86dfbe8e3c61e329443a5ff1b2c0c9b6e9ecfb1514d5d9a8db102ebaf\""
      ]
    }
  }
}
```

#### 2. MCP 客戶端實現
```javascript
// mcp/client.js
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');

class MCPClient {
  constructor() {
    this.client = null;
    this.connected = false;
  }
  
  async connect() {
    try {
      const transport = new StdioClientTransport({
        command: 'npx',
        args: [
          '-y',
          '@21st-dev/magic@latest',
          'API_KEY="2f7832c86dfbe8e3c61e329443a5ff1b2c0c9b6e9ecfb1514d5d9a8db102ebaf"'
        ]
      });
      
      this.client = new Client({
        name: "rental-analyzer",
        version: "1.0.0"
      }, {
        capabilities: {
          tools: {}
        }
      });
      
      await this.client.connect(transport);
      this.connected = true;
      console.log('MCP 客戶端連接成功');
      
      // 列出可用工具
      const tools = await this.client.listTools();
      console.log('可用工具:', tools);
      
    } catch (error) {
      console.error('MCP 連接失敗:', error);
      throw error;
    }
  }
  
  async analyzeProperty(propertyData) {
    if (!this.connected) {
      await this.connect();
    }
    
    try {
      const result = await this.client.callTool({
        name: "claude_analyze",
        arguments: {
          prompt: this.buildAnalysisPrompt(propertyData),
          model: "claude-3-sonnet-20241022"
        }
      });
      
      return this.parseAnalysisResult(result);
    } catch (error) {
      console.error('MCP 分析失敗:', error);
      throw error;
    }
  }
  
  buildAnalysisPrompt(propertyData) {
    return `
作為專業房源分析師，請分析以下台北市租屋資訊：

房源資料：
${JSON.stringify(propertyData, null, 2)}

請提供 110 分制評分分析：
- 價格合理性 (25分)：評估租金是否符合市場行情
- 設備完整性 (40分)：評估房屋設備和裝潢狀況
- 位置便利性 (20分)：評估交通和生活機能
- 加分項目 (15分)：特殊優勢或亮點
- 寵物友善 (10分)：是否允許寵物

請以 JSON 格式回應：
{
  "score": 85,
  "suitability": "很適合",
  "highlights": ["近捷運站", "設備齊全", "價格合理"],
  "concerns": ["樓層較低", "停車不便"],
  "recommendation": "建議盡快預約看房，這個價位在此區域很有競爭力",
  "scoreBreakdown": {
    "price": 20,
    "equipment": 35,
    "location": 18,
    "bonus": 12,
    "petFriendly": 0
  },
  "analysis": {
    "priceAnalysis": "租金 18,000 元在大安區屬於合理範圍",
    "equipmentAnalysis": "基本設備齊全，但缺少洗衣機",
    "locationAnalysis": "距離捷運站 5 分鐘，生活機能便利"
  }
}
`;
  }
  
  parseAnalysisResult(result) {
    try {
      // 解析 MCP 返回的結果
      const content = result.content[0].text;
      return JSON.parse(content);
    } catch (error) {
      console.error('解析分析結果失敗:', error);
      return {
        score: 0,
        suitability: "分析失敗",
        highlights: [],
        concerns: ["分析過程發生錯誤"],
        recommendation: "請重新嘗試分析"
      };
    }
  }
  
  async disconnect() {
    if (this.client && this.connected) {
      await this.client.close();
      this.connected = false;
    }
  }
}

module.exports = { MCPClient };
```

#### 3. 整合的 AI 服務
```javascript
// services/aiService.js
const { MCPClient } = require('../mcp/client');

class AIService {
  constructor() {
    this.mcpClient = new MCPClient();
    this.geminiApiKey = process.env.GEMINI_API_KEY;
  }
  
  async analyzeProperty(propertyData) {
    try {
      // 使用 MCP 進行 Claude 分析
      const analysis = await this.mcpClient.analyzeProperty(propertyData);
      
      // 添加時間戳和 ID
      return {
        id: Date.now() + Math.random(),
        timestamp: new Date(),
        property: propertyData,
        analysis: analysis,
        source: 'mcp-claude'
      };
    } catch (error) {
      console.error('房源分析失敗:', error);
      throw new Error('AI 分析服務暫時不可用');
    }
  }
  
  async analyzeImage(imageFile) {
    // 使用 Gemini Pro 2.5 進行圖片識別
    try {
      const base64Image = await this.fileToBase64(imageFile);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-2.5:generateContent?key=${this.geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: "請分析這張房源圖片，提取所有可見的租屋資訊，包括價格、地址、房型、設備等。" },
                { 
                  inlineData: {
                    mimeType: imageFile.type,
                    data: base64Image
                  }
                }
              ]
            }]
          })
        }
      );
      
      const result = await response.json();
      const extractedData = this.parseImageAnalysis(result);
      
      // 如果成功提取到房源資訊，進行進一步分析
      if (extractedData && extractedData.price) {
        return await this.analyzeProperty(extractedData);
      }
      
      return extractedData;
    } catch (error) {
      console.error('圖片分析失敗:', error);
      throw new Error('圖片識別服務暫時不可用');
    }
  }
  
  async batchAnalyze(urls) {
    const results = [];
    
    for (const url of urls) {
      try {
        // 爬取房源資料
        const propertyData = await this.scrapeProperty(url);
        
        // MCP 分析
        const analysis = await this.analyzeProperty(propertyData);
        results.push(analysis);
        
        // 避免 API 限制
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({
          url,
          error: error.message,
          timestamp: new Date()
        });
      }
    }
    
    return results;
  }
  
  async scrapeProperty(url) {
    // 房源爬蟲邏輯（與之前相同）
    const siteType = this.detectSiteType(url);
    
    switch(siteType) {
      case '591':
        return await this.scrape591(url);
      case 'rakuya':
        return await this.scrapeRakuya(url);
      default:
        return await this.scrapeGeneric(url);
    }
  }
  
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  }
  
  parseImageAnalysis(result) {
    try {
      const content = result.candidates[0].content.parts[0].text;
      // 解析 Gemini 返回的房源資訊
      return JSON.parse(content);
    } catch (error) {
      return { error: '圖片內容解析失敗' };
    }
  }
}

module.exports = { AIService };
```

---

## 🚀 MCP 整合優勢

### 1. 統一的 AI 服務管理
- **集中管理**：透過 MCP 統一管理 Claude API 調用
- **錯誤處理**：MCP 提供更好的錯誤處理和重試機制
- **資源管理**：自動管理 API 連接和資源釋放

### 2. 擴展性
- **工具整合**：可以輕鬆整合更多 AI 工具和服務
- **插件系統**：支援插件式的功能擴展
- **版本管理**：MCP 提供更好的版本控制和更新機制

### 3. 開發效率
- **標準化接口**：統一的 API 調用方式
- **調試支援**：更好的調試和監控功能
- **文檔完整**：MCP 提供完整的文檔和範例

---

## 📋 開發檢查清單

### MCP 設定檢查
- [ ] MCP 服務器配置正確
- [ ] API Key 設定正確
- [ ] MCP 客戶端連接成功
- [ ] 可用工具列表正常

### 功能測試檢查
- [ ] Claude 分析功能正常
- [ ] Gemini 圖片識別正常
- [ ] 批量處理功能正常
- [ ] 錯誤處理機制完善

### 部署檢查
- [ ] Replit 環境設定
- [ ] MCP 服務器在生產環境運行
- [ ] API 限制和配額管理
- [ ] 監控和日誌記錄

---

**總結**：MCP 整合版本提供了更強大的 AI 服務管理能力，雖然增加了一些複雜度，但帶來了更好的擴展性和維護性。適合需要更專業 AI 整合的使用場景。
