# 台北市租屋資料庫欄位設計

**Created:** 7/13/2025 7:47  
**Updated:** 7/13/2025 9:32  
**Exported:** 7/13/2025 9:46  
**Link:** [https://claude.ai/chat/405f0688-568b-4a16-8e12-0090d185aeba](https://claude.ai/chat/405f0688-568b-4a16-8e12-0090d185aeba)  

## Prompt:
**好台北市租屋資料庫欄位，你覺得還有需要新增更多哪些資訊嗎？我希望越詳細越好**
1. 系統支援完整的 23 個欄位自動映射：
**核心資訊**
   * 房源名稱 (title)
   * 租金 (number)
   * 房型 (select)
   * 地址 (rich_text)
   * 區域名稱 (rich_text)
   * 市區名稱 (rich_text)
**評估資訊**
   * 適合度 (rich_text)
   * 平均評分 (number)
   * 重要優勢 (rich_text)
   * 看房狀態 (select)
**詳細資訊**
   * 設備與特色 (multi_select)
   * 交通便利性 (rich_text)
   * 生活機能 (rich_text)
   * 公共設施及空間 (multi_select)
**財務資訊**
   * 水電費 (rich_text)
   * 押金（個月）(number)
**聯繫資訊**
   * 房東聯繫方式 (rich_text)
   * 網頁連結 (url)
   * 網址 (url)
**管理欄位**
   * 備註 (rich_text)
   * 簽約注意事項 (rich_text)
   * 照片 (files)
   * 更新日期 (date)



## Response:
基於提供的 23 個欄位結構，建議可考慮新增以下資訊以建立更完整的租屋資料庫：

## 物件基本規格
- **坪數/室內面積** (number) - 精確的居住空間大小
- **樓層資訊** (rich_text) - 所在樓層/總樓層數
- **屋齡** (number) - 建築物年份，影響居住品質
- **朝向** (select) - 採光與通風評估依據
- **陽台數量** (number) - 戶外空間配置

## 租賃條件細節
- **最短租期** (select) - 一年/半年/月租等選項
- **入住日期** (date) - 可入住的最早時間
- **寵物政策** (select) - 允許/不允許/限制條件
- **性別限制** (select) - 男性/女性/不限
- **身份限制** (multi_select) - 學生/上班族/外國人等

## 財務透明化
- **管理費** (number) - 社區管理相關費用
- **網路費用** (rich_text) - 是否包含及費用詳情
- **停車費** (number) - 機車/汽車停車月費
- **仲介費** (rich_text) - 相關服務費用說明

## 安全與法規
- **消防設備** (multi_select) - 滅火器/煙霧偵測器等
- **門禁系統** (select) - 有/無/電子鎖等級
- **合法性** (select) - 合法隔間/違建狀況
- **保險狀況** (rich_text) - 火險/地震險等保障

## 周邊環境分析
- **最近捷運站** (rich_text) - 站名及步行時間
- **生活採買** (rich_text) - 超市/市場距離
- **醫療資源** (rich_text) - 診所/醫院可及性
- **教育機構** (rich_text) - 鄰近學校資訊

此架構可提供租客更全面的決策資訊，同時協助房東建立專業的物件描述標準。



## Prompt:
認同加入底下的，再幫我加入，並全部統籌在一起
1. 房子配置（幾房幾廳幾衛浴，還有什麼公共空間）
1. 其餘房源備注
1. 請幫我判斷欄位優先順序，依照使用者比較會想看到的去排序
1. 地址能否嵌入是google map地圖url，若不行則增加欄位
---
物件基本規格
* **坪數/室內面積** (number) - 精確的居住空間大小
* **樓層資訊** (rich_text) - 所在樓層/總樓層數
* **屋齡** (number) - 建築物年份，影響居住品質
* **朝向** (select) - 採光與通風評估依據
* **陽台數量** (number) - 戶外空間配置
租賃條件細節
* **最短租期** (select) - 一年/半年/月租等選項
* **入住日期** (date) - 可入住的最早時間
* **寵物政策** (select) - 允許/不允許/限制條件
* **性別限制** (select) - 男性/女性/不限
* **身份限制** (multi_select) - 學生/上班族/外國人等
財務透明化
* **管理費** (number) - 社區管理相關費用
* **網路費用** (rich_text) - 是否包含及費用詳情
* **仲介費** (rich_text) - 相關服務費用說明
周邊環境分析
* **最近捷運站** (rich_text) - 站名及步行時間



## Response:
## 完整台北市租屋資料庫欄位結構（依優先順序排列）

### 第一優先級 - 核心篩選資訊
1. **房源名稱** (title)
2. **租金** (number)
3. **房型配置** (rich_text) - 幾房幾廳幾衛浴及公共空間
4. **坪數/室內面積** (number) - 精確的居住空間大小
5. **地址** (rich_text)
6. **Google Maps 地圖連結** (url) - 精確位置定位
7. **區域名稱** (rich_text)
8. **市區名稱** (rich_text)

### 第二優先級 - 關鍵決策因素
9. **照片** (files)
10. **樓層資訊** (rich_text) - 所在樓層/總樓層數
11. **入住日期** (date) - 可入住的最早時間
12. **押金（個月）** (number)
13. **水電費** (rich_text)
14. **管理費** (number) - 社區管理相關費用
15. **房東聯繫方式** (rich_text)

### 第三優先級 - 詳細規格與條件
16. **設備與特色** (multi_select)
17. **屋齡** (number) - 建築物年份，影響居住品質
18. **朝向** (select) - 採光與通風評估依據
19. **最短租期** (select) - 一年/半年/月租等選項
20. **寵物政策** (select) - 允許/不允許/限制條件
21. **性別限制** (select) - 男性/女性/不限
22. **身份限制** (multi_select) - 學生/上班族/外國人等

### 第四優先級 - 環境與交通
23. **最近捷運站** (rich_text) - 站名及步行時間
24. **交通便利性** (rich_text)
25. **生活機能** (rich_text)
26. **公共設施及空間** (multi_select)

### 第五優先級 - 補充資訊
27. **陽台數量** (number) - 戶外空間配置
28. **網路費用** (rich_text) - 是否包含及費用詳情
29. **仲介費** (rich_text) - 相關服務費用說明
30. **網頁連結** (url)
31. **網址** (url)

### 第六優先級 - 評估與管理
32. **適合度** (rich_text)
33. **平均評分** (number)
34. **重要優勢** (rich_text)
35. **看房狀態** (select)
36. **備註** (rich_text)
37. **其餘房源備註** (rich_text) - 額外補充說明
38. **簽約注意事項** (rich_text)
39. **更新日期** (date)

### 關於 Google Maps 整合說明
**地址欄位建議保持 rich_text 格式**，另新增獨立的「Google Maps 地圖連結」(url) 欄位，原因：
- 地址文字便於快速瀏覽與搜尋
- URL 欄位可直接嵌入 Google Maps 連結
- 兩者分離提供更佳的使用體驗與資料管理彈性

此結構優先展示租客最關注的核心資訊，再逐步提供詳細規格，最後補充管理用途的評估欄位。



## Prompt:
> File: 房源CRM系統-手機優先一日開發方案.md

> File: APP_BLUEPRINT.md

> File: README.md

> File: 資料庫欄位.md

那你參考參考附件資料後，如底下我附註條件，你覺得有沒有更快速更好的方式？
1.先不考慮一定要用mcp還有歸檔notion
2.希望手機或著電腦可以傳送連結，他可能不是只有591(但主要以他為主），還有透過上傳截圖就可以辨識內容，後有是網站一次性搜索出來很多的連結房源呢？這可能需要Google Gemini Pro 2.5 API，我有。



## Response:
基於您的需求和資源，我建議一個**更快速、更靈活的現代化解決方案**：

## 🚀 **Claude + Gemini 雙 AI 驅動的智能房源分析平台**

### 🎯 **核心優勢**
- **多元輸入**: 支援 591/其他租屋網站連結、截圖上傳、批量搜索
- **雙 AI 協作**: Claude 負責智能分析，Gemini Pro 2.5 負責視覺識別與批量搜索
- **無需 MCP/Notion**: 直接使用瀏覽器本地存儲 + 可選雲端同步
- **30 分鐘部署**: 使用 Replit 快速上線

### 🏗️ **技術架構重設計**

```
智能房源分析平台
├── 前端 (React + Tailwind)
│   ├── 多元輸入組件
│   │   ├── URL 貼入 (支援各大租屋網站)
│   │   ├── 圖片上傳 (拖拽/相機)
│   │   └── 批量搜索 (關鍵字 + 條件)
│   ├── AI 分析展示
│   │   ├── 即時分析進度
│   │   ├── 智能評分卡片
│   │   └── 對比分析表格
│   └── 資料管理
│       ├── 本地存儲管理
│       ├── 匯出功能 (Excel/PDF)
│       └── 雲端同步 (可選)
├── 後端 API (Node.js + Express)
│   ├── Claude 整合服務
│   │   ├── 智能資料分析
│   │   ├── 評分系統
│   │   └── 建議生成
│   ├── Gemini Pro 2.5 服務
│   │   ├── 圖片內容識別
│   │   ├── 網站批量搜索
│   │   └── 多語言處理
│   └── 網站爬蟲服務
│       ├── 591 專用爬蟲
│       ├── 通用房源爬蟲
│       └── 反檢測機制
└── 資料層
    ├── 瀏覽器 IndexedDB (主要)
    ├── JSON 匯出/匯入
    └── 雲端同步 (Firebase/Supabase)
```

### 🎨 **用戶體驗流程**

```mermaid
graph TD
    A[打開應用] --> B{選擇輸入方式}
    B -->|貼入連結| C[URL 分析]
    B -->|上傳截圖| D[圖片識別]
    B -->|批量搜索| E[智能搜索]
    
    C --> F[Claude 智能分析]
    D --> G[Gemini 內容提取]
    E --> H[Gemini 批量處理]
    
    G --> F
    H --> F
    
    F --> I[生成評分報告]
    I --> J[房源卡片展示]
    J --> K{用戶操作}
    
    K -->|收藏| L[加入收藏]
    K -->|對比| M[多房源對比]
    K -->|匯出| N[資料匯出]
    K -->|分享| O[生成分享連結]
```

### 💡 **核心功能實現**

#### **1. 多元輸入處理器**
```javascript
class UniversalInputProcessor {
    async processInput(input, type) {
        switch(type) {
            case 'url':
                return await this.processURL(input);
            case 'image':
                return await this.processImage(input);
            case 'search':
                return await this.processBatchSearch(input);
        }
    }
    
    async processURL(url) {
        // 智能判斷網站類型
        const siteType = this.detectSiteType(url);
        
        // 使用對應爬蟲策略
        const rawData = await this.universalScraper.scrape(url, siteType);
        
        // Claude 智能分析
        const analysisPrompt = `
        分析這個房源資料，提供 110 分制評分：
        ${JSON.stringify(rawData)}
        
        請依照以下結構回應：
        {
            "score": 85,
            "suitability": "很適合",
            "highlights": ["近捷運", "寵物友善", "設備齊全"],
            "concerns": ["價格偏高"],
            "recommendation": "建議盡快預約看房"
        }
        `;
        
        return await window.claude.complete(analysisPrompt);
    }
    
    async processImage(imageFile) {
        // Gemini Pro 2.5 圖片識別
        const geminiResult = await fetch('/api/gemini/analyze-image', {
            method: 'POST',
            body: this.createFormData(imageFile),
        });
        
        const extractedData = await geminiResult.json();
        
        // Claude 後續分析
        return await this.processURL(extractedData.extractedUrl || extractedData);
    }
    
    async processBatchSearch(searchCriteria) {
        // Gemini Pro 2.5 批量搜索
        const searchPrompt = `
        在台北地區搜索符合以下條件的租屋資訊：
        - 預算: ${searchCriteria.budget}
        - 房型: ${searchCriteria.roomType}
        - 區域: ${searchCriteria.area}
        - 特殊需求: ${searchCriteria.requirements}
        
        請提供 10-20 個相關房源連結
        `;
        
        const searchResults = await this.callGeminiAPI(searchPrompt);
        
        // 批量處理每個房源
        const results = [];
        for (const url of searchResults.urls) {
            results.push(await this.processURL(url));
        }
        
        return results;
    }
}
```

#### **2. Gemini Pro 2.5 整合服務**
```javascript
class GeminiService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-2.5:generateContent';
    }
    
    async analyzeImage(imageFile) {
        const base64Image = await this.fileToBase64(imageFile);
        
        const prompt = {
            contents: [{
                parts: [
                    { text: "分析這張房源截圖，提取所有可見的租屋資訊，包括：價格、地址、房型、設備、聯繫方式、網站連結等。如果有網站連結，請一併提取。" },
                    { 
                        inlineData: {
                            mimeType: imageFile.type,
                            data: base64Image
                        }
                    }
                ]
            }]
        };
        
        const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prompt)
        });
        
        return await response.json();
    }
    
    async batchSearch(searchQuery) {
        const prompt = {
            contents: [{
                parts: [{
                    text: `作為一個專業的房源搜索助手，請根據以下條件搜索台北地區的租屋資訊：
                    
                    ${searchQuery}
                    
                    請提供 15-20 個相關的房源連結，優先從以下網站搜索：
                    1. 591租屋網
                    2. 樂屋網
                    3. 好房網
                    4. 房天下
                    
                    回應格式：
                    {
                        "results": [
                            {
                                "url": "房源連結",
                                "title": "房源標題",
                                "price": "租金",
                                "area": "區域",
                                "type": "房型"
                            }
                        ]
                    }`
                }]
            }]
        };
        
        const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prompt)
        });
        
        return await response.json();
    }
}
```

#### **3. 本地存儲管理**
```javascript
class LocalStorageManager {
    constructor() {
        this.dbName = 'RentalPropertiesDB';
        this.version = 1;
        this.db = null;
    }
    
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                
                // 建立房源表
                if (!this.db.objectStoreNames.contains('properties')) {
                    const propertyStore = this.db.createObjectStore('properties', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    propertyStore.createIndex('score', 'score', { unique: false });
                    propertyStore.createIndex('area', 'area', { unique: false });
                    propertyStore.createIndex('price', 'price', { unique: false });
                }
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };
            
            request.onerror = () => reject(request.error);
        });
    }
    
    async saveProperty(propertyData) {
        const transaction = this.db.transaction(['properties'], 'readwrite');
        const store = transaction.objectStore('properties');
        
        const propertyWithTimestamp = {
            ...propertyData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        return store.add(propertyWithTimestamp);
    }
    
    async getAllProperties() {
        const transaction = this.db.transaction(['properties'], 'readonly');
        const store = transaction.objectStore('properties');
        
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    async exportToJSON() {
        const properties = await this.getAllProperties();
        const exportData = {
            exportDate: new Date(),
            version: '1.0',
            properties: properties
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rental-properties-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}
```

### 🎨 **手機優化界面設計**

**Claude + Gemini 智能房源分析平台**

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>智能房源分析平台</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lucide/0.263.1/umd/lucide.js"></script>
    <style>
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .card-hover {
            transition: all 0.3s ease;
        }
        .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .input-file {
            opacity: 0;
            position: absolute;
            z-index: -1;
        }
        .file-drop-zone {
            border: 2px dashed #cbd5e0;
            transition: all 0.3s ease;
        }
        .file-drop-zone.dragover {
            border-color: #4299e1;
            background-color: #ebf8ff;
        }
        .score-ring {
            background: conic-gradient(from 0deg, #10b981 0%, #10b981 var(--score-percent), #e5e7eb var(--score-percent));
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen" x-data="rentalAnalyzer()">
    <!-- 頂部導航 -->
    <header class="gradient-bg text-white sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center space-x-3">
                    <div class="bg-white/20 p-2 rounded-lg">
                        <i data-lucide="home" class="w-6 h-6"></i>
                    </div>
                    <h1 class="text-xl font-bold">智能房源分析</h1>
                </div>
                <div class="flex items-center space-x-4">
                    <button @click="showStats = !showStats" 
                            class="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors">
                        <i data-lucide="bar-chart-3" class="w-5 h-5"></i>
                    </button>
                    <button @click="exportData()" 
                            class="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors">
                        <i data-lucide="download" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- 統計概覽 -->
    <div x-show="showStats" class="bg-white border-b shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-6">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600" x-text="stats.total"></div>
                    <div class="text-sm text-gray-600">總房源數</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-green-600" x-text="stats.highScore"></div>
                    <div class="text-sm text-gray-600">高分房源</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-orange-600" x-text="Math.round(stats.avgScore)"></div>
                    <div class="text-sm text-gray-600">平均評分</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-purple-600" x-text="stats.favorites"></div>
                    <div class="text-sm text-gray-600">收藏數量</div>
                </div>
            </div>
        </div>
    </div>

    <!-- 主要內容 -->
    <main class="max-w-7xl mx-auto px-4 py-6">
        <!-- 輸入區域 -->
        <div class="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div class="mb-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">添加房源資料</h2>
                
                <!-- 輸入方式選擇 -->
                <div class="flex flex-wrap gap-2 mb-4">
                    <button @click="inputMode = 'url'" 
                            :class="inputMode === 'url' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'"
                            class="px-4 py-2 rounded-lg font-medium transition-colors">
                        <i data-lucide="link" class="w-4 h-4 inline mr-2"></i>
                        網站連結
                    </button>
                    <button @click="inputMode = 'image'" 
                            :class="inputMode === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'"
                            class="px-4 py-2 rounded-lg font-medium transition-colors">
                        <i data-lucide="image" class="w-4 h-4 inline mr-2"></i>
                        圖片上傳
                    </button>
                    <button @click="inputMode = 'search'" 
                            :class="inputMode === 'search' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'"
                            class="px-4 py-2 rounded-lg font-medium transition-colors">
                        <i data-lucide="search" class="w-4 h-4 inline mr-2"></i>
                        智能搜索
                    </button>
                </div>

                <!-- URL 輸入 -->
                <div x-show="inputMode === 'url'" class="space-y-4">
                    <textarea x-model="urlInput" 
                              placeholder="貼上房源連結（支援 591、樂屋網、好房網等）&#10;可同時貼上多個連結，每行一個"
                              class="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows="4"></textarea>
                    <button @click="processUrls()" 
                            :disabled="!urlInput.trim() || processing"
                            class="w-full md:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 transition-colors">
                        <i data-lucide="sparkles" class="w-4 h-4 inline mr-2"></i>
                        開始分析
                    </button>
                </div>

                <!-- 圖片上傳 -->
                <div x-show="inputMode === 'image'" class="space-y-4">
                    <div class="file-drop-zone rounded-lg p-8 text-center"
                         @dragover.prevent="$el.classList.add('dragover')"
                         @dragleave.prevent="$el.classList.remove('dragover')"
                         @drop.prevent="handleFileDrop($event)">
                        <i data-lucide="upload" class="w-12 h-12 mx-auto text-gray-400 mb-4"></i>
                        <p class="text-gray-600 mb-2">拖拽圖片到此處或點擊上傳</p>
                        <p class="text-sm text-gray-500 mb-4">支援 JPG、PNG、WEBP 格式</p>
                        <input type="file" 
                               class="input-file" 
                               accept="image/*" 
                               @change="handleFileSelect($event)">
                        <button type="button" 
                                @click="$el.previousElementSibling.click()"
                                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            選擇圖片
                        </button>
                    </div>
                    <div x-show="selectedImage" class="mt-4">
                        <img :src="selectedImage" class="max-w-xs mx-auto rounded-lg shadow-md">
                        <button @click="processImage()" 
                                :disabled="!selectedImage || processing"
                                class="w-full md:w-auto mt-4 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-300 transition-colors">
                            <i data-lucide="eye" class="w-4 h-4 inline mr-2"></i>
                            AI 識別內容
                        </button>
                    </div>
                </div>

                <!-- 智能搜索 -->
                <div x-show="inputMode === 'search'" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">預算範圍</label>
                            <select x-model="searchCriteria.budget" class="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">不限</option>
                                <option value="8000-12000">8,000 - 12,000</option>
                                <option value="12000-18000">12,000 - 18,000</option>
                                <option value="18000-25000">18,000 - 25,000</option>
                                <option value="25000+">25,000 以上</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">房型</label>
                            <select x-model="searchCriteria.roomType" class="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">不限</option>
                                <option value="雅房">雅房</option>
                                <option value="套房">套房</option>
                                <option value="1房1廳">1房1廳</option>
                                <option value="2房1廳">2房1廳</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">區域</label>
                            <select x-model="searchCriteria.area" class="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">不限</option>
                                <option value="大安區">大安區</option>
                                <option value="信義區">信義區</option>
                                <option value="中山區">中山區</option>
                                <option value="松山區">松山區</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">特殊需求</label>
                            <input x-model="searchCriteria.requirements" 
                                   type="text" 
                                   placeholder="如：寵物友善、近捷運站"
                                   class="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    <button @click="processSearch()" 
                            :disabled="processing"
                            class="w-full md:w-auto px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:bg-gray-300 transition-colors">
                        <i data-lucide="search" class="w-4 h-4 inline mr-2"></i>
                        智能搜索房源
                    </button>
                </div>
            </div>

            <!-- 處理進度 -->
            <div x-show="processing" class="mt-6 p-4 bg-blue-50 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-blue-900">處理進度</span>
                    <span class="text-sm text-blue-700" x-text="`${processedCount}/${totalCount}`"></span>
                </div>
                <div class="w-full bg-blue-200 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                         :style="`width: ${totalCount > 0 ? (processedCount / totalCount) * 100 : 0}%`"></div>
                </div>
                <div class="mt-2 text-sm text-blue-700" x-text="currentProcessing"></div>
            </div>
        </div>

        <!-- 篩選器 -->
        <div class="bg-white rounded-xl shadow-sm border p-4 mb-6">
            <div class="flex flex-wrap items-center gap-4">
                <div class="flex-1 min-w-48">
                    <input x-model="filters.search" 
                           type="text" 
                           placeholder="搜索房源標題、地址..."
                           class="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <select x-model="filters.scoreRange" class="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">全部評分</option>
                    <option value="90+">90+ 分 (非常適合)</option>
                    <option value="80-89">80-89 分 (很適合)</option>
                    <option value="70-79">70-79 分 (適合)</option>
                    <option value="60-69">60-69 分 (尚可)</option>
                </select>
                <select x-model="filters.sortBy" class="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="score">按評分排序</option>
                    <option value="price">按價格排序</option>
                    <option value="date">按時間排序</option>
                </select>
            </div>
        </div>

        <!-- 房源列表 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <template x-for="property in filteredProperties" :key="property.id">
                <div class="bg-white rounded-xl shadow-sm border card-hover overflow-hidden">
                    <!-- 房源圖片 -->
                    <div class="relative h-48 bg-gray-200">
                        <img x-show="property.image" 
                             :src="property.image" 
                             :alt="property.title"
                             class="w-full h-full object-cover">
                        <div x-show="!property.image" 
                             class="w-full h-full flex items-center justify-center">
                            <i data-lucide="image" class="w-12 h-12 text-gray-400"></i>
                        </div>
                        
                        <!-- 評分圓環 -->
                        <div class="absolute top-4 right-4 w-16 h-16 score-ring rounded-full flex items-center justify-center"
                             :style="`--score-percent: ${property.score}%`">
                            <div class="bg-white rounded-full w-12 h-12 flex items-center justify-center">
                                <span class="text-sm font-bold" :class="getScoreColor(property.score)" x-text="property.score"></span>
                            </div>
                        </div>
                        
                        <!-- 收藏按鈕 -->
                        <button @click="toggleFavorite(property.id)"
                                class="absolute top-4 left-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                            <i :data-lucide="property.favorite ? 'heart' : 'heart'" 
                               :class="property.favorite ? 'text-red-500 fill-current' : 'text-gray-400'"
                               class="w-4 h-4"></i>
                        </button>
                    </div>

                    <!-- 房源資訊 -->
                    <div class="p-5">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2" x-text="property.title"></h3>
                        
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-2xl font-bold text-blue-600" x-text="formatPrice(property.price)"></span>
                            <span class="text-sm px-2 py-1 rounded-full" 
                                  :class="getSuitabilityClass(property.score)"
                                  x-text="property.suitability"></span>
                        </div>
                        
                        <p class="text-sm text-gray-600 mb-3 line-clamp-2" x-text="property.address"></p>
                        
                        <!-- 特色標籤 -->
                        <div class="flex flex-wrap gap-1
```



## Prompt:
幫我寫個app blueprint



## Response:


**Claude + Gemini 智能房源分析平台 - App Blueprint**

```markdown
# Claude + Gemini 智能房源分析平台 - App Blueprint

## 🎯 系統概述

### 核心理念
- **AI 驅動**: Claude 負責智能分析，Gemini Pro 2.5 負責視覺識別與批量搜索
- **多元輸入**: 支援 URL、截圖、智能搜索三種輸入方式
- **手機優先**: 100% 手機優化的響應式設計
- **無需複雜基礎設施**: 免 MCP、免 Notion，使用瀏覽器本地存儲
- **30 分鐘部署**: Replit 一鍵部署，即開即用

### 目標用戶
- **租屋族**: 需要快速篩選和分析房源
- **房產仲介**: 需要批量處理和對比房源
- **投資者**: 需要數據化分析房源價值

## 🏗️ 技術架構

### 前端架構
```
前端層 (React + Tailwind + Alpine.js)
├── 輸入處理模組
│   ├── URL 解析器 (支援多租屋網站)
│   ├── 圖片上傳器 (拖拽 + 相機)
│   └── 智能搜索器 (條件篩選)
├── AI 整合模組
│   ├── Claude API 客戶端
│   ├── Gemini Pro 2.5 客戶端
│   └── 結果合併處理器
├── 資料展示模組
│   ├── 房源卡片組件
│   ├── 對比分析表格
│   └── 統計圖表組件
└── 本地存儲模組
    ├── IndexedDB 管理器
    ├── 資料匯出功能
    └── 雲端同步接口
```

### 後端架構
```
後端層 (Node.js + Express)
├── API 路由層
│   ├── /api/analyze-url
│   ├── /api/analyze-image
│   ├── /api/batch-search
│   └── /api/export-data
├── AI 服務層
│   ├── Claude 整合服務
│   ├── Gemini Pro 2.5 服務
│   └── 結果處理服務
├── 爬蟲服務層
│   ├── 591 專用爬蟲
│   ├── 通用房源爬蟲
│   └── 反檢測機制
└── 工具服務層
    ├── 圖片處理工具
    ├── 資料驗證工具
    └── 錯誤處理工具
```

## 📱 使用者介面設計

### 主畫面佈局
```
┌─────────────────────────────────┐
│ 🏠 智能房源分析 [📊] [⬇️] [⚙️]     │ ← 頂部導航
├─────────────────────────────────┤
│ 📈 [總數:15] [高分:8] [收藏:3]     │ ← 統計卡片
├─────────────────────────────────┤
│ 🔗 URL | 📷 圖片 | 🔍 搜索        │ ← 輸入方式選擇
├─────────────────────────────────┤
│ [輸入區域 - 動態切換]              │ ← 輸入介面
├─────────────────────────────────┤
│ 🔍 [搜索] [評分▼] [排序▼]         │ ← 篩選器
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ 📷    │ 💰 $18,000  ⭐ 92   │ │ ← 房源卡片
│ │ 圖片   │ 📍 大安區         │ │
│ │      │ 🏷️ 非常適合       │ │
│ │ [❤️] [👁️] [🔗] [📋]        │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### 核心組件設計

#### 1. 多元輸入組件
```javascript
// InputModeSelector 組件
const InputModeSelector = {
  modes: [
    { id: 'url', icon: 'link', label: '網站連結', color: 'blue' },
    { id: 'image', icon: 'image', label: '圖片上傳', color: 'green' },
    { id: 'search', icon: 'search', label: '智能搜索', color: 'purple' }
  ],
  
  features: {
    url: {
      placeholder: '貼上房源連結（支援 591、樂屋網、好房網等）\n可同時貼上多個連結，每行一個',
      supportedSites: ['591.com.tw', 'rakuya.com.tw', 'housefun.com.tw'],
      batchSupport: true
    },
    
    image: {
      acceptTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxSize: '10MB',
      features: ['拖拽上傳', '相機拍攝', 'AI 內容識別']
    },
    
    search: {
      criteria: ['預算範圍', '房型', '區域', '特殊需求'],
      aiPowered: true,
      batchResults: '15-20 個房源'
    }
  }
};
```

#### 2. 房源卡片組件
```javascript
// PropertyCard 組件
const PropertyCard = {
  layout: {
    image: '左側 40%',
    info: '右側 60%',
    actions: '底部按鈕列'
  },
  
  elements: {
    scoreRing: {
      position: '右上角',
      style: 'circular progress',
      colors: {
        90: 'green',
        80: 'blue', 
        70: 'yellow',
        60: 'orange',
        default: 'red'
      }
    },
    
    favoriteButton: {
      position: '左上角',
      style: 'heart icon',
      states: ['empty', 'filled']
    },
    
    priceDisplay: {
      format: '大字體顯示',
      currency: 'NT$',
      emphasis: 'primary color'
    },
    
    tagSystem: {
      maxTags: 3,
      priority: ['寵物友善', '近捷運', '設備齊全'],
      style: 'rounded pills'
    }
  },
  
  actions: [
    { icon: 'eye', label: '查看', action: 'viewDetails' },
    { icon: 'external-link', label: '原網頁', action: 'openSource' },
    { icon: 'compare', label: '對比', action: 'addToCompare' },
    { icon: 'more-horizontal', label: '更多', action: 'showMenu' }
  ]
};
```

#### 3. AI 分析進度組件
```javascript
// AnalysisProgress 組件
const AnalysisProgress = {
  stages: [
    { id: 'fetch', label: '獲取資料', icon: 'download' },
    { id: 'extract', label: '提取資訊', icon: 'search' },
    { id: 'analyze', label: 'AI 分析', icon: 'brain' },
    { id: 'score', label: '評分計算', icon: 'star' },
    { id: 'complete', label: '完成', icon: 'check' }
  ],
  
  display: {
    progressBar: 'linear with percentage',
    currentStage: 'highlighted with animation',
    estimatedTime: 'dynamic calculation',
    cancellation: 'available during processing'
  },
  
  feedback: {
    success: 'green checkmark with animation',
    error: 'red x with retry option',
    partial: 'yellow warning with details'
  }
};
```

## 🤖 AI 整合策略

### Claude API 整合
```javascript
class ClaudeAnalyzer {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.basePrompt = `
作為專業的房源分析師，請分析以下房源資料並提供：
1. 110 分制評分（價格25分+設備40分+位置20分+加分15分+寵物10分）
2. 適合度評語（非常適合/很適合/適合/尚可考慮/需要評估/不適合）
3. 重要優勢（最多3個）
4. 潛在問題（如有）
5. 建議行動

回應格式：嚴格遵循 JSON 格式
`;
  }

  async analyzeProperty(propertyData) {
    const prompt = `${this.basePrompt}

房源資料：
${JSON.stringify(propertyData, null, 2)}

請提供 JSON 格式的分析結果：
{
  "score": 85,
  "suitability": "很適合",
  "highlights": ["近捷運站", "寵物友善", "設備齊全"],
  "concerns": ["價格偏高"],
  "recommendation": "建議盡快預約看房",
  "scoreBreakdown": {
    "price": 20,
    "equipment": 35,
    "location": 18,
    "bonus": 12,
    "petFriendly": 0
  }
}`;

    const response = await window.claude.complete(prompt);
    return JSON.parse(response);
  }

  async batchAnalyze(propertiesData) {
    const results = [];
    for (const property of propertiesData) {
      try {
        const analysis = await this.analyzeProperty(property);
        results.push({ ...property, analysis });
        
        // 避免 API 限制
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({ ...property, error: error.message });
      }
    }
    return results;
  }
}
```

### Gemini Pro 2.5 整合
```javascript
class GeminiService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-2.5:generateContent';
  }

  async analyzeImage(imageFile) {
    const base64Image = await this.fileToBase64(imageFile);
    
    const request = {
      contents: [{
        parts: [
          { 
            text: `請分析這張房源圖片，提取所有可見的租屋資訊。

請以 JSON 格式回應：
{
  "extractedData": {
    "title": "房源標題",
    "price": "租金數字",
    "address": "地址",
    "roomType": "房型",
    "features": ["設備1", "設備2"],
    "contact": "聯絡方式",
    "url": "如果有網址"
  },
  "confidence": 0.95,
  "notes": "額外觀察"
}` 
          },
          { 
            inlineData: {
              mimeType: imageFile.type,
              data: base64Image
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      }
    };

    const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    const result = await response.json();
    return JSON.parse(result.candidates[0].content.parts[0].text);
  }

  async batchSearch(searchCriteria) {
    const searchPrompt = `作為專業的房源搜索助手，請根據以下條件在台北地區搜索租屋資訊：

搜索條件：
- 預算：${searchCriteria.budget || '不限'}
- 房型：${searchCriteria.roomType || '不限'}
- 區域：${searchCriteria.area || '不限'}
- 特殊需求：${searchCriteria.requirements || '無'}

請搜索以下租屋網站並提供 15-20 個相關房源：
1. 591租屋網 (rent.591.com.tw)
2. 樂屋網 (www.rakuya.com.tw)
3. 好房網 (buy.housefun.com.tw)
4. 房天下 (esf.fang.com)

請以 JSON 格式回應：
{
  "results": [
    {
      "url": "完整房源連結",
      "title": "房源標題",
      "price": "租金",
      "area": "區域",
      "roomType": "房型",
      "source": "網站名稱"
    }
  ],
  "searchSummary": {
    "totalFound": 18,
    "avgPrice": 16500,
    "topAreas": ["大安區", "中山區"]
  }
}`;

    const request = {
      contents: [{ parts: [{ text: searchPrompt }] }],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      }
    };

    const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    const result = await response.json();
    return JSON.parse(result.candidates[0].content.parts[0].text);
  }
}
```

## 📊 資料管理架構

### 本地存儲策略
```javascript
class LocalStorageManager {
  constructor() {
    this.dbName = 'RentalAnalyzerDB';
    this.version = 2;
    this.stores = {
      properties: 'id, title, price, score, area, favorite, createdAt',
      searches: 'id, criteria, results, timestamp',
      comparisons: 'id, propertyIds, notes, createdAt',
      settings: 'key, value'
    };
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // 建立房源表
        if (!db.objectStoreNames.contains('properties')) {
          const propertyStore = db.createObjectStore('properties', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          propertyStore.createIndex('score', 'score');
          propertyStore.createIndex('area', 'area');
          propertyStore.createIndex('price', 'price');
          propertyStore.createIndex('favorite', 'favorite');
          propertyStore.createIndex('createdAt', 'createdAt');
        }
        
        // 建立搜索歷史表
        if (!db.objectStoreNames.contains('searches')) {
          const searchStore = db.createObjectStore('searches', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          searchStore.createIndex('timestamp', 'timestamp');
        }
        
        // 建立對比表
        if (!db.objectStoreNames.contains('comparisons')) {
          const compareStore = db.createObjectStore('comparisons', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          compareStore.createIndex('createdAt', 'createdAt');
        }
        
        // 建立設定表
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
      
      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve();
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // CRUD 操作
  async saveProperty(propertyData) {
    const transaction = this.db.transaction(['properties'], 'readwrite');
    const store = transaction.objectStore('properties');
    
    const property = {
      ...propertyData,
      id: propertyData.id || Date.now() + Math.random(),
      createdAt: new Date(),
      updatedAt: new Date(),
      favorite: false
    };
    
    return store.put(property);
  }

  async getAllProperties() {
    const transaction = this.db.transaction(['properties'], 'readonly');
    const store = transaction.objectStore('properties');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateProperty(id, updates) {
    const transaction = this.db.transaction(['properties'], 'readwrite');
    const store = transaction.objectStore('properties');
    
    const property = await this.getProperty(id);
    if (property) {
      const updatedProperty = {
        ...property,
        ...updates,
        updatedAt: new Date()
      };
      return store.put(updatedProperty);
    }
  }

  async deleteProperty(id) {
    const transaction = this.db.transaction(['properties'], 'readwrite');
    const store = transaction.objectStore('properties');
    return store.delete(id);
  }

  // 資料匯出
  async exportToJSON() {
    const properties = await this.getAllProperties();
    const searches = await this.getAllSearches();
    
    const exportData = {
      exportDate: new Date(),
      version: '2.0',
      data: {
        properties: properties,
        searches: searches,
        stats: await this.getStats()
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rental-analysis-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  async exportToCSV() {
    const properties = await this.getAllProperties();
    
    const headers = [
      'ID', '房源名稱', '租金', '評分', '適合度', '地址', 
      '區域', '房型', '收藏', '建立時間'
    ];
    
    const csvContent = [
      headers.join(','),
      ...properties.map(p => [
        p.id,
        `"${p.title}"`,
        p.price,
        p.score,
        `"${p.suitability}"`,
        `"${p.address}"`,
        `"${p.area}"`,
        `"${p.roomType}"`,
        p.favorite ? '是' : '否',
        p.createdAt.toISOString().split('T')[0]
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rental-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    URL.revokeObjectURL(url);
  }
}
```

### 雲端同步策略（可選）
```javascript
class CloudSyncService {
  constructor() {
    this.providers = {
      firebase: FirebaseSync,
      supabase: SupabaseSync,
      cloudflare: CloudflareSync
    };
    this.currentProvider = null;
  }

  async setupSync(provider, config) {
    this.currentProvider = new this.providers[provider](config);
    await this.currentProvider.init();
  }

  async syncUp(data) {
    if (!this.currentProvider) return;
    
    try {
      const result = await this.currentProvider.upload(data);
      return { success: true, syncId: result.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async syncDown() {
    if (!this.currentProvider) return;
    
    try {
      const data = await this.currentProvider.download();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

## 🚀 部署架構

### Replit 部署配置
```toml
# replit.nix
{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.npm-9_x
  ];
}
```

```bash
# .replit
run = "npm start"
entrypoint = "server/index.js"

[env]
NODE_ENV = "production"

[packager]
language = "nodejs"

[packager.features]
packageSearch = true
guessImports = true

[languages.javascript]
pattern = "**/{*.js,*.jsx,*.ts,*.tsx,*.mjs,*.cjs}"

[gitHubImport]
requiredFiles = [".replit", "replit.nix", "package.json"]
```

```json
{
  "name": "rental-analyzer-app",
  "version": "2.0.0",
  "description": "Claude + Gemini powered rental property analyzer",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js",
    "dev": "nodemon server/index.js",
    "build": "npm run build:css",
    "build:css": "tailwindcss -i src/styles/input.css -o public/styles/output.css --minify",
    "test": "jest",
    "deploy": "replit deploy"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "multer": "^1.4.5",
    "sharp": "^0.32.6",
    "axios": "^1.6.0",
    "cheerio": "^1.0.0-rc.12",
    "puppeteer": "^21.5.2",
    "winston": "^3.11.0",
    "helmet": "^7.1.0",
    "rate-limiter-flexible": "^3.0.8"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "tailwindcss": "^3.3.5",
    "jest": "^29.7.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 環境變數配置
```env
# API Keys
CLAUDE_API_KEY=your_claude_api_key
GEMINI_API_KEY=your_gemini_api_key

# Server Configuration
PORT=3000
NODE_ENV=production

# Security
JWT_SECRET=your_jwt_secret
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# Optional Cloud Sync
FIREBASE_CONFIG={}
SUPABASE_URL=
SUPABASE_ANON_KEY=

# Scraping Configuration
USER_AGENT="Mozilla/5.0 (compatible; PropertyAnalyzer/2.0)"
REQUEST_DELAY=1000
MAX_CONCURRENT_REQUESTS=3
```

## 📱 使用者體驗流程

### 新用戶引導流程
```
1. 歡迎畫面
   ├── 功能介紹輪播
   ├── 範例演示
   └── 開始使用按鈕

2. 功能導覽
   ├── URL 輸入示範
   ├── 圖片上傳示範
   └── 智能搜索示範

3. 首次分析
   ├── 選擇輸入方式
   ├── 輸入示例資料
   ├── 觀看分析過程
   └── 查看結果解釋

4. 完成設定
   ├── 個人偏好設定
   ├── 通知設定
   └── 資料匯出偏好
```

### 核心使用流程
```mermaid
graph TD
    A[開啟應用] --> B{選擇輸入方式}
    
    B -->|URL| C[貼入房源連結]
    B -->|圖片| D[上傳/拍攝圖片]
    B -->|搜索| E[設定搜索條件]
    
    C --> F[URL 解析與爬取]
    D --> G[Gemini 圖片識別]
    E --> H[Gemini 批量搜索]
    
    F --> I[Claude 智能分析]
    G --> I
    H --> I
    
    I --> J[生成評分報告]
    J --> K[展示房源卡片]
    
    K --> L{用戶操作}
    L -->|收藏| M[加入收藏清單]
    L -->|對比| N[多房源對比]
    L -->|分享| O[生成分享連結]
    L -->|匯出| P[資料匯出]
    L -->|設定| Q[個人化設定]
    
    M --> K
    N --> K
    O --> K
    P --> K
    Q --> K
```

### 錯誤處理流程
```
錯誤類型與處理：
├── 網路錯誤
│   ├── 自動重試 (3次)
│   ├── 離線模式提示
│   └── 快取資料使用
├── API 錯誤
│   ├── 降級處理
│   ├── 錯誤訊息顯示
│   └── 替代方案建議
├── 資料錯誤
│   ├── 格式驗證
│   ├── 部分資料處理
│   └── 手動修正介面
└── 系統錯誤
    ├── 錯誤報告收集
    ├── 自動回復嘗試
    └── 聯繫支援選項
```

## 🔧 開發階段規劃

### Phase 1: 核心功能開發 (第1-2週)
```
核心元件開發
├── 前端基礎架構
│   ├── React 專案建置
│   ├── Tailwind CSS 設定
│   ├── 路由設定
│   └── 狀態管理設定
├── AI 服務整合
│   ├── Claude API 整合
│   ├── Gemini Pro 2.5 整合
│   ├── 錯誤處理機制
│   └── 回應格式標準化
└── 基本 UI 組件
    ├── 輸入表單組件
    ├── 房源卡片組件
    ├── 進度指示器
    └── 通知系統
```

### Phase 2: 進階功能開發 (第3-4週)
```
進階功能實現
├── 資料管理
│   ├── IndexedDB 整合
│   ├── 資料匯出功能
│   ├── 搜索與篩選
│   └── 收藏系統
├── 批量處理
│   ├── 多URL處理
│   ├── 批量搜索
│   ├── 進度追蹤
│   └── 結果合併
└── 使用者體驗
    ├── 響應式設計
    ├── 載入動畫
    ├── 錯誤處理
    └── 使用者引導
```

### Phase 3: 優化與部署 (第5-6週)
```
系統優化
├── 效能優化
│   ├── 程式碼分割
│   ├── 圖片最佳化
│   ├── 快取策略
│   └── Bundle 最佳化
├── 安全性強化
│   ├── API 限制
│   ├── 輸入驗證
│   ├── XSS 防護
│   └── CSRF 防護
└── 部署準備
    ├── Replit 配置
    ├── 環境變數設定
    ├── 監控設定
    └── 備份策略
```

## 🎯 成功指標

### 技術指標
- **載入時間**: < 2 秒
- **分析速度**: 單一房源 < 10 秒
- **準確率**: AI 分析準確率 > 85%
- **可用性**: 系統可用率 > 99%

### 使用者體驗指標
- **完成率**: 分析完成率 > 90%
- **重複使用**:
```



## Prompt:
![image.png](data:image/webp;base64,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)

![image.png](data:image/webp;base64,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)

先不要寫程式，先討論怎麼樣呈現者個網站最好，我覺得需要增加：1.增加視覺化圖表的dashboard跟一些ai insight 2.一到資料庫的其中一房源會顯示hover"查看到的房源"，提供尋找更多類似約三個的房源（透過ai搜尋外網，所以需要判斷優先價格>格局>大小，然後盡量算同區）3.呈現不同表現方式：條列式/兩欄卡片/符合視窗寬度的橫條卡片，如附件 4.排序方式：租金/坪數/平均評分。你有更好想法嗎



## Response:
```plaintext
Thought process: 分析房源網站需求，提出多元呈現與AI增強方案

使用者提供了兩張圖片和一些關於改進網站的想法。讓我先分析這些圖片和需求：

圖片1：顯示了一個Mobile Web Application的架構圖，包含：
- Navigation Component
- Main Content Container  
- Sidebar Menu Component
- Property Cards
- Add Property Form
- Statistics Dashboard
- Filter Bar Component
- Progress Component
- Notification Component

圖片2：顯示了一個591租屋網的房源資訊，包含：
- 房源圖片
- 標題：中壢南亞技術學院旁大套房
- 價格：8,500元/月
- 房型：獨立套房，10坪，1F/3F
- 地址：中壢區中山東路三段
- 距離：距小肥鵝麵食坊87公尺
- 其他資訊：仲介庭小姐，8小時內更新，昨日0人瀏覽

使用者的需求：
1. 增加視覺化圖表的dashboard和AI insight
2. hover顯示"查看到的房源"，提供尋找更多類似的房源（透過AI搜尋外網）
3. 不同呈現方式：條列式/兩欄卡片/符合視窗寬度的橫條卡片
4. 排序方式：租金/坪數/平均評分

我需要根據userStyle提供一個comprehensive, structured的設計指南，重點關注modern web development practices。
```

# 智能房源分析平台 - UI/UX 設計優化方案

## 🎯 整體設計理念

基於您提供的架構圖和591房源範例，建議採用**適應性設計系統**，結合**AI驅動的智能互動**和**多維度資料視覺化**，打造現代化的房源分析體驗。

## 📊 1. Dashboard 視覺化與 AI Insight 設計

### 主要 Dashboard 架構
```typescript
interface DashboardMetrics {
  overview: {
    totalProperties: number;
    averageScore: number;
    highScoreCount: number;
    favoriteCount: number;
  };
  trends: {
    priceDistribution: ChartData[];
    scoreDistribution: ChartData[];
    areaAnalysis: ChartData[];
    timeSeriesData: ChartData[];
  };
  aiInsights: {
    marketTrends: string[];
    recommendations: string[];
    alerts: AlertData[];
  };
}
```

### 視覺化組件設計建議

#### **Smart Analytics Dashboard**
```
┌─────────────────────────────────────────────────────┐
│ 📊 市場洞察儀表板                                      │
├─────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ 總房源數  │ │ 平均評分  │ │ 高分房源  │ │ 收藏數量  │ │
│ │   156    │ │   78.2   │ │    23    │ │    8     │ │
│ │  ↑ 12%   │ │  ↑ 3.1   │ │  ↑ 18%   │ │  ↑ 2     │ │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────────────────┐ │
│ │ 📈 價格分布圖    │ │ 🎯 AI 市場洞察              │ │
│ │                │ │                             │ │
│ │ [價格分布圖表]   │ │ • 大安區房價呈上漲趨勢       │ │
│ │                │ │ • 寵物友善房源供應緊缺       │ │
│ │                │ │ • 建議關注信義區新房源       │ │
│ └─────────────────┘ └─────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────────────────┐ │
│ │ 🗺️ 區域熱力圖    │ │ ⚡ 智能推薦                 │ │
│ │                │ │                             │ │
│ │ [互動地圖]       │ │ 基於您的偏好，推薦以下房源：  │ │
│ │                │ │ 1. 中山區精緻套房 (89分)     │ │
│ │                │ │ 2. 大安區寵物友善 (87分)     │ │
│ └─────────────────┘ └─────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### AI Insight 組件
```typescript
const AIInsightPanel: React.FC = () => {
  const insights = useAIInsights();
  
  return (
    <motion.div 
      className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center mb-4">
        <Brain className="w-6 h-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold">AI 市場洞察</h3>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-700">{insight.content}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
          查看詳細分析 →
        </button>
      </div>
    </motion.div>
  );
};
```

## 🔍 2. 智能相似房源推薦系統

### Hover 互動設計
```typescript
interface SimilarPropertySystem {
  onHover: (propertyId: string) => Promise<SimilarProperty[]>;
  searchCriteria: {
    priceWeight: 0.4;
    layoutWeight: 0.35;
    sizeWeight: 0.15;
    locationWeight: 0.1;
  };
}
```

### 相似房源 Hover 卡片設計
```
房源卡片 (Hover 狀態)
┌─────────────────────────────────────────┐
│ [房源圖片]     💰 $18,000  ⭐ 92分      │
│              📍 大安區敦化南路          │
│              🏠 1房1廳 25坪            │
│ ┌─────────────────────────────────────┐ │
│ │ 🔍 相似房源推薦 (AI 搜尋)            │ │
│ │ ┌─────┐ ┌─────┐ ┌─────┐             │ │
│ │ │房源A│ │房源B│ │房源C│             │ │
│ │ │89分 │ │85分 │ │82分 │             │ │
│ │ └─────┘ └─────┘ └─────┘             │ │
│ │ [查看全部相似房源]                   │ │
│ └─────────────────────────────────────┘ │
│ [❤️] [👁️] [🔗] [📋] [🔍找相似]        │
└─────────────────────────────────────────┘
```

### 智能推薦實現
```typescript
const useSimilarProperties = (property: Property) => {
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  const findSimilarProperties = useCallback(async () => {
    setLoading(true);
    
    // 構建 AI 搜索查詢
    const searchQuery = {
      priceRange: [property.price * 0.8, property.price * 1.2],
      layout: property.layout,
      area: property.area,
      features: property.features.slice(0, 3) // 取前3個重要特徵
    };
    
    try {
      // 使用 Gemini 搜索外部房源
      const externalResults = await geminiService.searchSimilarProperties(searchQuery);
      
      // 使用 Claude 分析和評分
      const analyzedResults = await Promise.all(
        externalResults.map(async (result) => {
          const analysis = await claudeService.analyzeProperty(result);
          return { ...result, ...analysis };
        })
      );
      
      // 按相似度排序
      const sortedResults = analyzedResults
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, 3);
        
      setSimilarProperties(sortedResults);
    } catch (error) {
      console.error('Failed to fetch similar properties:', error);
    } finally {
      setLoading(false);
    }
  }, [property]);

  return { similarProperties, loading, findSimilarProperties };
};
```

## 📱 3. 多元呈現方式設計

### 響應式佈局系統
```typescript
type ViewMode = 'list' | 'card-2col' | 'card-full-width';

interface ViewModeConfig {
  list: {
    itemHeight: '120px';
    columns: 1;
    showImage: boolean;
    showDetails: boolean;
  };
  'card-2col': {
    columns: 2;
    aspectRatio: '4:3';
    spacing: '1rem';
  };
  'card-full-width': {
    columns: 1;
    layout: 'horizontal';
    minHeight: '200px';
  };
}
```

### 檢視模式切換器
```
┌─────────────────────────────────────────┐
│ 🔍 [搜索框] [篩選▼] [排序▼] │ ≡ □□ ▬ │ ← 檢視模式
└─────────────────────────────────────────┘
```

### 不同檢視模式實現
```typescript
const PropertyView: React.FC<{ mode: ViewMode }> = ({ mode }) => {
  const getLayoutClasses = () => {
    switch (mode) {
      case 'list':
        return 'flex flex-col space-y-2';
      case 'card-2col':
        return 'grid grid-cols-1 md:grid-cols-2 gap-6';
      case 'card-full-width':
        return 'flex flex-col space-y-4';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
  };

  return (
    <div className={getLayoutClasses()}>
      {properties.map((property) => (
        <PropertyCard 
          key={property.id} 
          property={property} 
          viewMode={mode} 
        />
      ))}
    </div>
  );
};
```

#### **條列式檢視**
```
┌────────────────────────────────────────────────────┐
│ [圖] 中壢南亞技術學院旁大套房    $8,500  ⭐ 78分   │
│ [片] 📍 中壢區中山東路三段      🏠 獨立套房 10坪    │
│     🎯 近商圈 免管理費          [❤️][👁️][🔗]      │
├────────────────────────────────────────────────────┤
│ [圖] 大安區精緻套房            $18,000  ⭐ 92分   │
│ [片] 📍 大安區敦化南路          🏠 1房1廳 25坪     │
│     🐱 寵物友善 變頻冷氣        [❤️][👁️][🔗]      │
└────────────────────────────────────────────────────┘
```

#### **兩欄卡片檢視**
```
┌─────────────────────┐ ┌─────────────────────┐
│ [房源圖片]           │ │ [房源圖片]           │
│                    │ │                    │
│ 中壢南亞技術學院旁   │ │ 大安區精緻套房      │
│ $8,500  ⭐ 78分     │ │ $18,000  ⭐ 92分    │
│ 📍 中壢區           │ │ 📍 大安區           │
│ 🏠 獨立套房 10坪    │ │ 🏠 1房1廳 25坪     │
│ [❤️] [👁️] [🔗] [📋] │ │ [❤️] [👁️] [🔗] [📋] │
└─────────────────────┘ └─────────────────────┘
```

#### **全寬橫條卡片檢視**
```
┌──────────────────────────────────────────────────────────────┐
│ [大圖片] │ 中壢南亞技術學院旁大套房              $8,500  ⭐ 78分 │
│        │ 📍 中壢區中山東路三段                              │
│ [180px] │ 🏠 獨立套房 • 10坪 • 1F/3F                       │
│        │ 🎯 近商圈 • 免管理費 • 隨時可遷入                  │
│        │ [❤️收藏] [👁️查看] [🔗原網頁] [🔍找相似] [📋狀態]    │
└──────────────────────────────────────────────────────────────┘
```

## 🔄 4. 進階排序與篩選系統

### 排序選項設計
```typescript
interface SortOption {
  key: keyof Property;
  label: string;
  icon: LucideIcon;
  direction: 'asc' | 'desc';
  defaultDirection: 'asc' | 'desc';
}

const sortOptions: SortOption[] = [
  { key: 'price', label: '租金', icon: DollarSign, direction: 'asc', defaultDirection: 'asc' },
  { key: 'area', label: '坪數', icon: Maximize, direction: 'desc', defaultDirection: 'desc' },
  { key: 'score', label: '評分', icon: Star, direction: 'desc', defaultDirection: 'desc' },
  { key: 'createdAt', label: '新增時間', icon: Clock, direction: 'desc', defaultDirection: 'desc' },
  { key: 'updatedAt', label: '更新時間', icon: RefreshCw, direction: 'desc', defaultDirection: 'desc' }
];
```

### 智能篩選介面
```
┌─────────────────────────────────────────────────────┐
│ 🔍 [搜索關鍵字]                              [清除] │
├─────────────────────────────────────────────────────┤
│ 💰 租金範圍: [8000] ——————○————— [25000]            │
│ ⭐ 評分範圍: [60] ———————————○—— [100]               │
│ 📏 坪數範圍: [10] ————○————————— [50]                │
├─────────────────────────────────────────────────────┤
│ 🏷️ 標籤篩選:                                        │
│ [✓ 寵物友善] [✓ 近捷運] [  冷氣] [  電梯]            │
│ [  停車位] [  陽台] [  管理費] [  家具]              │
├─────────────────────────────────────────────────────┤
│ 📍 區域篩選:                                        │
│ [✓ 大安區] [✓ 信義區] [  中山區] [  松山區]          │
├─────────────────────────────────────────────────────┤
│ 🔄 排序方式:                                        │
│ ○ 租金 ↑  ○ 租金 ↓  ● 評分 ↓  ○ 坪數 ↓           │
└─────────────────────────────────────────────────────┘
```

## 🎨 其他優化建議

### 1. **漸進式載入與虛擬化**
```typescript
const VirtualizedPropertyList: React.FC = () => {
  const { loadMore, hasMore, properties } = useInfiniteProperties();
  
  return (
    <FixedSizeList
      height={600}
      itemCount={properties.length}
      itemSize={200}
      onItemsRendered={({ visibleStopIndex }) => {
        if (visibleStopIndex >= properties.length - 5 && hasMore) {
          loadMore();
        }
      }}
    >
      {PropertyCard}
    </FixedSizeList>
  );
};
```

### 2. **智能通知系統**
- 新增高分房源時自動通知
- 價格變動提醒
- 相似房源出現提醒
- 定期市場報告

### 3. **協作功能**
- 房源分享連結
- 評論和筆記系統
- 團隊協作看房
- 決策投票功能

### 4. **進階 AI 功能**
- 房源照片品質評估
- 虛假房源識別
- 議價建議
- 最佳看房時間推薦

## 📐 技術實現架構

```typescript
// 主要狀態管理
interface AppState {
  properties: Property[];
  viewMode: ViewMode;
  sortConfig: SortConfig;
  filterConfig: FilterConfig;
  dashboard: DashboardData;
  similarProperties: Record<string, Property[]>;
}

// 核心 Hooks
const usePropertyManager = () => {
  const [state, dispatch] = useReducer(propertyReducer, initialState);
  
  const actions = {
    setViewMode: (mode: ViewMode) => dispatch({ type: 'SET_VIEW_MODE', payload: mode }),
    updateSort: (config: SortConfig) => dispatch({ type: 'UPDATE_SORT', payload: config }),
    applyFilters: (filters: FilterConfig) => dispatch({ type: 'APPLY_FILTERS', payload: filters }),
    loadSimilarProperties: async (propertyId: string) => {
      const similar = await fetchSimilarProperties(propertyId);
      dispatch({ type: 'SET_SIMILAR_PROPERTIES', payload: { propertyId, similar } });
    }
  };
  
  return { state, actions };
};
```

這個設計方案結合了現代 Web 開發最佳實踐，提供了豐富的互動體驗和智能化功能，同時保持了優秀的使用者體驗和技術可維護性。



## Prompt:
![image.png](data:image/webp;base64,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)

如果第三頁面為：如附件連結 https://rent.591.com.tw/list?region=1&kind=2&sort=posttime_desc 跟截圖那樣搜尋欄位模仿並優化，如可以可複選：台北/新北市/桃園/台中/台南)，按鄉鎮區（可複選），還有捷運線可複選）再來是捷運站（可複選）（如果那個城市有的話），學校不用，案商圈。
特色新增：頂加
並增加搜尋不同平台：1. 591租屋網 2. 樂屋網 3. 好房網 4. 房天下 5.facebook社團 6. dcard
類型也可以複選價格如他那樣但最後自訂可以用滑桿，最低5,000最高60,000，每500為一單位用slider前後形式設定並顯示數字在後面，沒動就是無限小或著無限大
先寫出來不要寫程式



## Response:
```plaintext
Thought process: 剖析租屋搜尋需求，設計優化多平台介面架構。

用戶想要我設計一個類似591租屋網的搜尋頁面，但是要優化和擴展功能。基於用戶提供的591網站截圖，我需要設計一個更完善的搜尋介面。

用戶的具體需求：
1. 多城市選擇：台北/新北市/桃園/台中/台南（可複選）
2. 按鄉鎮區（可複選）
3. 捷運線可複選
4. 捷運站可複選（如果該城市有的話）
5. 商圈
6. 特色新增：頂加
7. 增加搜尋不同平台：591租屋網、樂屋網、好房網、房天下、facebook社團、dcard
8. 類型可以複選
9. 價格用滑桿，最低5,000最高60,000，每500為一單位
10. 沒動滑桿就是無限制

我需要用用戶提供的style來回應，要系統化、邏輯性強、技術洞見、中英雙語、結構清晰。

我應該設計一個完整的搜尋介面架構，包括各個組件的佈局和邏輯。
```

# 智能房源搜尋系統設計 | Intelligent Property Search System Design

## 🎯 系統化搜尋介面架構 | Systematic Search Interface Architecture

### 核心設計原則 | Core Design Principles

**Multi-Platform Integration** | **多平台整合策略**
- 統一搜尋介面，整合六大房源平台
- 智能去重機制，避免重複房源
- 平台特性適配，針對不同平台優化搜尋邏輯

## 📍 地理位置篩選系統 | Geographic Location Filtering System

### 1. 多級聯動地理篩選 | Multi-Level Cascading Geographic Filter

```
地理篩選架構 | Geographic Filter Architecture
├── 城市選擇 | City Selection [可複選 | Multi-Select]
│   ├── 台北市 | Taipei City
│   ├── 新北市 | New Taipei City  
│   ├── 桃園市 | Taoyuan City
│   ├── 台中市 | Taichung City
│   └── 台南市 | Tainan City
├── 行政區選擇 | District Selection [依城市動態載入 | Dynamic Loading]
├── 捷運線選擇 | MRT Line Selection [條件性顯示 | Conditional Display]
└── 捷運站選擇 | MRT Station Selection [聯動篩選 | Linked Filtering]
```

### 2. 智能地理邏輯 | Intelligent Geographic Logic

**邏輯流程 | Logic Flow**：
1. **城市選擇觸發** → 動態載入對應行政區選項
2. **MRT 系統檢測** → 僅有捷運城市顯示捷運選項
3. **區域聯動** → 捷運線/站選擇自動篩選相關區域
4. **商圈智能匹配** → 基於選定區域推薦熱門商圈

## 🏢 平台整合搜尋架構 | Platform Integration Search Architecture

### 多源平台搜尋策略 | Multi-Source Platform Search Strategy

```
平台搜尋矩陣 | Platform Search Matrix
┌─────────────────┬────────────┬────────────┬─────────────┐
│ 平台 | Platform  │ 搜尋深度   │ 更新頻率   │ 特色功能    │
├─────────────────┼────────────┼────────────┼─────────────┤
│ 591租屋網        │ ★★★★★     │ 即時       │ 官方認證    │
│ 樂屋網          │ ★★★★      │ 每小時     │ VR看房      │
│ 好房網          │ ★★★★      │ 每2小時    │ 市場分析    │
│ 房天下          │ ★★★       │ 每6小時    │ 大陸房源    │
│ Facebook社團     │ ★★★★      │ 每30分鐘   │ 社群驗證    │
│ Dcard          │ ★★★       │ 每小時     │ 學生房源    │
└─────────────────┴────────────┴────────────┴─────────────┘
```

### 平台選擇器設計 | Platform Selector Design

**視覺呈現邏輯**：
- **全選/取消全選** 快速操作按鈕
- **平台圖標** + **名稱** + **即時房源數量**
- **搜尋狀態指示器**（搜尋中/完成/錯誤）

## 🏠 房型與特色篩選優化 | Property Type & Feature Filter Optimization

### 1. 房型複選系統 | Multi-Select Property Type System

```
房型分類架構 | Property Type Classification
├── 基礎房型 | Basic Types [可複選 | Multi-Select]
│   ├── 雅房 | Shared Room
│   ├── 套房 | Studio
│   ├── 獨立套房 | Independent Studio  
│   ├── 分租套房 | Shared Apartment
│   ├── 整層住家 | Whole Floor
│   ├── 車位 | Parking Space
│   └── 其他 | Others
└── 進階篩選 | Advanced Filters
    ├── 樓層偏好 | Floor Preference
    ├── 衛浴數量 | Bathroom Count
    └── 房間數量 | Room Count
```

### 2. 特色標籤系統 | Feature Tag System

**特色分類優化 | Feature Category Optimization**：

```
特色標籤矩陣 | Feature Tag Matrix
├── 基礎設施 | Infrastructure
│   ├── 近捷運 | Near MRT
│   ├── 可養寵物 | Pet Friendly
│   ├── 可開伙 | Cooking Allowed
│   ├── 有車位 | Parking Available
│   ├── 有電梯 | Elevator
│   ├── 有陽台 | Balcony
│   ├── 頂加 | Rooftop Addition ⭐ [新增]
│   └── 可短期租賃 | Short-term Rental
├── 設備完善度 | Equipment Level  
│   ├── 有冷氣 | Air Conditioning
│   ├── 有洗衣機 | Washing Machine
│   ├── 有冰箱 | Refrigerator
│   ├── 有熱水器 | Water Heater
│   ├── 有天然瓦斯 | Natural Gas
│   ├── 有網路 | Internet
│   └── 床 | Bed Provided
└── 房屋品質 | Property Quality
    ├── 新裝潢 | Newly Renovated
    ├── 中檔裝潢 | Mid-level Renovation
    └── 高檔裝潢 | Luxury Renovation
```

## 💰 智能價格篩選系統 | Intelligent Price Filtering System

### 動態價格滑桿設計 | Dynamic Price Slider Design

**技術規格 | Technical Specifications**：

```typescript
interface PriceSliderConfig {
  range: {
    min: 5000;
    max: 60000;
    step: 500;
  };
  defaultState: {
    minValue: null;  // 無下限 | No Lower Limit
    maxValue: null;  // 無上限 | No Upper Limit
  };
  displayFormat: {
    currency: 'NT$';
    separator: ',';
    suffix: '元/月';
  };
}
```

**視覺互動邏輯 | Visual Interaction Logic**：

```
價格滑桿佈局 | Price Slider Layout
┌─────────────────────────────────────────────────────┐
│ 租金範圍 | Rent Range                              │
├─────────────────────────────────────────────────────┤
│ 最低價格 | Min Price                               │
│ ○————————————————————————————————————————————————○ │
│ 5,000                                        60,000 │
│                                                     │
│ [未設定] ←→ [未設定]                                │
│ No Limit    No Limit                               │
│                                                     │
│ 快速選項 | Quick Options:                          │
│ [5K-10K] [10K-15K] [15K-20K] [20K-30K] [30K+]     │
└─────────────────────────────────────────────────────┘
```

## 🔍 搜尋介面整體佈局 | Overall Search Interface Layout

### 響應式搜尋面板設計 | Responsive Search Panel Design

```
智能搜尋介面 | Intelligent Search Interface
┌─────────────────────────────────────────────────────┐
│ 🔍 智能房源搜尋 | Intelligent Property Search      │
├─────────────────────────────────────────────────────┤
│ 📍 地理位置 | Geographic Location                  │
│ ┌─────────────────┬─────────────────┬─────────────┐ │
│ │ 城市 | Cities   │ 行政區 | Districts│ 捷運 | MRT │ │
│ │ [☑台北] [☑新北] │ [☑大安] [☑信義] │ [☑板南線]  │ │
│ │ [☐桃園] [☐台中] │ [☐中山] [☐松山] │ [☐淡水線]  │ │
│ └─────────────────┴─────────────────┴─────────────┘ │
├─────────────────────────────────────────────────────┤
│ 🏢 搜尋平台 | Search Platforms                     │
│ [☑591] [☑樂屋網] [☑好房網] [☐房天下] [☑FB] [☐Dcard] │
├─────────────────────────────────────────────────────┤
│ 🏠 房型選擇 | Property Types                       │
│ [☑雅房] [☑套房] [☑獨立套房] [☐整層住家] [☐車位]    │
├─────────────────────────────────────────────────────┤
│ 💰 價格範圍 | Price Range                          │
│ ○————————————————————————————————————————————————○  │
│ 5,000                                        60,000  │
│ [未設定] ←→ [未設定]                                │
├─────────────────────────────────────────────────────┤
│ 🎯 特色篩選 | Feature Filters                      │
│ [☑寵物友善] [☑近捷運] [☐頂加] [☐可開伙] [☐車位]    │
│ [☐電梯] [☐陽台] [☐短租] [☐新裝潢] [☐家具]          │
├─────────────────────────────────────────────────────┤
│ ⚙️ 進階選項 | Advanced Options                     │
│ [展開更多篩選條件...]                              │
├─────────────────────────────────────────────────────┤
│ [🔍 開始搜尋] [🔄 重置條件] [💾 儲存條件]          │
└─────────────────────────────────────────────────────┘
```

## ⚡ 搜尋邏輯流程優化 | Search Logic Flow Optimization

### 智能搜尋工作流程 | Intelligent Search Workflow

```mermaid
graph TD
    A[用戶輸入搜尋條件] --> B{條件驗證}
    B -->|有效| C[條件預處理]
    B -->|無效| D[錯誤提示]
    
    C --> E[平台分發搜尋]
    E --> F[591搜尋] 
    E --> G[樂屋網搜尋]
    E --> H[好房網搜尋]
    E --> I[社群平台搜尋]
    
    F --> J[結果聚合]
    G --> J
    H --> J
    I --> J
    
    J --> K[智能去重]
    K --> L[AI評分排序]
    L --> M[結果展示]
```

### 條件儲存與快速搜尋 | Condition Storage & Quick Search

**功能邏輯**：
- **搜尋條件模板化** | Search Condition Templates
- **歷史搜尋記錄** | Search History
- **智能推薦條件** | Intelligent Condition Recommendations
- **一鍵複製分享** | One-Click Copy & Share

## 🎨 使用者體驗優化建議 | UX Optimization Recommendations

### 漸進式揭露設計 | Progressive Disclosure Design

**基礎模式** | **Basic Mode**：
- 顯示最常用的5-6個篩選條件
- 一鍵展開進階選項

**進階模式** | **Advanced Mode**：
- 完整篩選選項展示
- 專業用戶快速操作

### 即時回饋系統 | Real-time Feedback System

**搜尋預覽邏輯**：
- 條件變更時顯示**預估結果數量**
- **熱門組合推薦**
- **搜尋時間預估**

---

**系統架構優勢** | **System Architecture Advantages**：
- ✅ **Multi-Platform Integration** | 多平台資源整合
- ✅ **Intelligent Filtering** | 智能篩選邏輯  
- ✅ **Responsive Design** | 響應式設計適配
- ✅ **User Experience Optimization** | 使用者體驗最佳化



## Prompt:
那增加兩個按鈕：
* 勾選部分後可以透過搜尋google
* 自動寫成搜尋的Prompts 給不同ai做deep research （如：Grok/Claude/Gemini/Perplexity/Felo)



## Response:
```plaintext
Thought process: Engineered two-button research feature for enhanced information gathering.

用戶提到增加兩個按鈕：
1. 勾選部分後可以透過搜尋google
2. 自動寫成搜尋的Prompts 給不同ai做deep research（Grok/Claude/Gemini/Perplexity/Felo）

需要按照用戶的系統化、邏輯性強且富有技術洞見的工作流程溝通風格來設計這兩個功能。要使用中英雙語說明，提供結構清晰的建議。

我需要：
1. 設計Google搜尋整合功能
2. 設計AI深度研究Prompt生成系統
3. 提供技術架構和實現邏輯
4. 確保可操作性和透明度
```

# 智能搜尋增強系統 | Intelligent Search Enhancement System

## 🎯 雙引擎搜尋策略架構 | Dual-Engine Search Strategy Architecture

### 核心增強功能設計 | Core Enhancement Feature Design

**建議工作流程**：`!search, !research, !analyze`

- **執行邏輯 | Execution Logic**：
    1. `!search`：條件式Google搜尋引擎整合
    2. `!research`：多AI平台深度研究Prompt生成
    3. `!analyze`：跨平台結果整合與分析

## 🔍 Google搜尋整合引擎 | Google Search Integration Engine

### 1. 智能搜尋條件轉換器 | Intelligent Search Condition Converter

**技術架構透明化 | Technical Architecture Transparency**：

```typescript
interface GoogleSearchIntegration {
  conditionProcessor: {
    locationMapping: (conditions: LocationFilter) => string;
    priceRangeFormatter: (range: PriceRange) => string;
    featureKeywordGenerator: (features: Feature[]) => string[];
    platformTargeting: (platforms: Platform[]) => string;
  };
  searchQueryBuilder: {
    baseQuery: string;
    locationModifiers: string[];
    priceModifiers: string[];
    featureModifiers: string[];
    platformModifiers: string[];
  };
}
```

### 2. Google搜尋查詢生成邏輯 | Google Search Query Generation Logic

**模組化設計範例 | Modular Design Example**：

```
搜尋條件轉換矩陣 | Search Condition Conversion Matrix
┌─────────────────┬─────────────────┬──────────────────┐
│ 使用者選擇條件  │ Google查詢語法  │ 搜尋優化策略     │
├─────────────────┼─────────────────┼──────────────────┤
│ 台北市大安區    │ "台北市大安區"  │ 地理精確定位     │
│ 寵物友善        │ "可養寵物" OR   │ 關鍵字擴展       │
│                │ "寵物友善"      │                  │
│ 15000-20000元   │ "15000..20000"  │ 數值範圍查詢     │
│ 591+樂屋網      │ site:591.com.tw │ 平台特定搜尋     │
│                │ OR site:rakuya  │                  │
└─────────────────┴─────────────────┴──────────────────┘
```

### 3. 搜尋按鈕設計規格 | Search Button Design Specifications

**視覺互動邏輯 | Visual Interaction Logic**：

```
Google搜尋整合按鈕 | Google Search Integration Button
┌─────────────────────────────────────────────────────┐
│ [🔍 Google深度搜尋] [預覽查詢語法]                  │
│                                                     │
│ 搜尋範圍預覽 | Search Scope Preview:                │
│ • 地理範圍: 台北市大安區、信義區                    │
│ • 價格範圍: 15,000-20,000元                        │
│ • 特色條件: 寵物友善, 近捷運                       │
│ • 目標平台: 591, 樂屋網, Facebook社團              │
│                                                     │
│ 預估結果: ~1,200筆 | Estimated Results             │
│ [開始搜尋] [修改條件]                              │
└─────────────────────────────────────────────────────┘
```

## 🤖 AI深度研究Prompt生成系統 | AI Deep Research Prompt Generation System

### 1. 多AI平台適配策略 | Multi-AI Platform Adaptation Strategy

**跨系統溝通標準化 | Cross-System Communication Standardization**：

```typescript
interface AIResearchPromptGenerator {
  platformAdapters: {
    grok: GrokPromptAdapter;
    claude: ClaudePromptAdapter;
    gemini: GeminiPromptAdapter;
    perplexity: PerplexityPromptAdapter;
    felo: FeloPromptAdapter;
  };
  promptTemplates: {
    marketAnalysis: string;
    priceComparison: string;
    areaInsights: string;
    trendPrediction: string;
  };
}
```

### 2. AI平台特化Prompt設計 | AI Platform-Specific Prompt Design

**安全性考量與多層次風險管理 | Security Considerations & Multi-layer Risk Management**：

#### Grok專用Prompt模板 | Grok-Specific Prompt Template
```
租屋市場分析專家模式 | Rental Market Analysis Expert Mode

基於以下條件進行台北租屋市場深度分析：
• 目標區域: {selectedAreas}
• 價格範圍: {priceRange}
• 房型偏好: {propertyTypes}
• 特殊需求: {features}

請從以下角度提供專業洞察：
1. 🏠 市場供需現況分析
2. 💰 價格趨勢與合理性評估  
3. 🚇 交通便利性影響評估
4. 📈 未來6個月市場預測
5. ⚠️ 投資風險提醒

輸出格式: 結構化報告，包含數據支撐和actionable建議
```

#### Claude專用Prompt模板 | Claude-Specific Prompt Template
```
台北租屋市場智能顧問 | Taipei Rental Market Intelligence Advisor

作為專業的房地產分析師，請基於以下搜尋條件：

搜尋參數 | Search Parameters:
- 地理範圍: {locationFilter}
- 預算範圍: {budgetRange}  
- 房型需求: {propertyTypeSelection}
- 特色要求: {featureRequirements}

請提供三個層次的分析 | Three-Level Analysis:

🔍 Level 1: 市場現況掃描 | Market Status Scan
- 供應量分析
- 競爭程度評估
- 價格分布情況

📊 Level 2: 深度比較分析 | Deep Comparative Analysis  
- 跨區域價格效益比較
- 交通成本效益分析
- 生活機能評分比較

🎯 Level 3: 決策建議生成 | Decision Recommendation Generation
- 最佳選擇推薦理由
- 替代方案建議
- 談判策略建議

請以可量化的數據和clear action items回應。
```

#### Gemini Pro專用Prompt模板 | Gemini Pro-Specific Prompt Template
```
多維度租屋市場研究 | Multi-Dimensional Rental Market Research

🎯 研究目標: 基於用戶篩選條件的台北租屋市場全面分析

輸入參數 | Input Parameters:
```json
{
  "locations": {selectedLocations},
  "priceRange": {priceParameters},
  "propertyTypes": {propertySelection},
  "features": {featureArray},
  "platforms": {platformSelection}
}
```

研究維度 | Research Dimensions:

🏘️ 地理經濟學分析 | Geographical Economics Analysis
- 區域發展潛力評估
- 房價租金比合理性
- 周邊建設影響評估

🔄 市場動態監控 | Market Dynamics Monitoring  
- 房源流動性分析
- 季節性價格波動
- 供需平衡狀況

🤖 AI輔助決策支援 | AI-Assisted Decision Support
- 機器學習價格預測
- 相似房源智能匹配
- 最佳看房時機建議

請以結構化JSON格式輸出，包含confidence scores和data sources。
```

### 3. AI研究按鈕設計架構 | AI Research Button Design Architecture

**介面標準化設計 | Interface Standardization Design**：

```
AI深度研究中心 | AI Deep Research Center
┌─────────────────────────────────────────────────────┐
│ 🤖 AI深度市場研究 | AI Deep Market Research          │
├─────────────────────────────────────────────────────┤
│ 選擇AI研究引擎 | Select AI Research Engine:          │
│                                                     │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│ │ [🔥Grok] │ │[⭐Claude]│ │[💎Gemini]│ │[🎯Perplx]│    │
│ │ 市場趨勢 │ │ 智能顧問 │ │ 多維分析 │ │ 即時研究 │    │
│ │ 專家     │ │         │ │         │ │         │    │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
│                                                     │
│ ┌─────────┐ [全選] [一鍵生成所有Prompt]              │
│ │ [🌐Felo] │                                       │
│ │ 全球視野 │                                       │
│ └─────────┘                                       │
├─────────────────────────────────────────────────────┤
│ 研究深度選擇 | Research Depth Selection:             │
│ ○ 快速掃描 (2-3分鐘)    ● 標準分析 (5-8分鐘)       │
│ ○ 深度研究 (10-15分鐘)  ○ 專業報告 (20-30分鐘)     │
├─────────────────────────────────────────────────────┤
│ [📋 生成Prompt] [📤 批量發送] [💾 儲存模板]        │
└─────────────────────────────────────────────────────┘
```

## ⚙️ 系統整合工作流程 | System Integration Workflow

### 技術實現邏輯 | Technical Implementation Logic

**模組化架構設計 | Modular Architecture Design**：

```mermaid
graph TD
    A[用戶條件選擇] --> B{選擇搜尋模式}
    B -->|Google搜尋| C[條件轉換引擎]
    B -->|AI研究| D[Prompt生成引擎]
    
    C --> E[查詢語法生成]
    E --> F[Google搜尋執行]
    F --> G[結果聚合分析]
    
    D --> H[AI平台適配]
    H --> I[多AI Prompt生成]
    I --> J[批量研究執行]
    J --> K[跨AI結果整合]
    
    G --> L[智能結果呈現]
    K --> L
```

### 跨平台資料整合策略 | Cross-Platform Data Integration Strategy

**確保系統可擴展性 | Ensuring System Scalability**：

```typescript
interface CrossPlatformIntegration {
  dataHarmonization: {
    googleResults: GoogleResultNormalizer;
    aiInsights: AIInsightAggregator;
    platformSpecificData: PlatformDataMapper;
  };
  resultSynthesis: {
    confidenceScoring: (results: SearchResult[]) => number;
    redundancyElimination: (results: SearchResult[]) => SearchResult[];
    insightPrioritization: (insights: AIInsight[]) => AIInsight[];
  };
}
```

## 📊 使用者體驗優化策略 | User Experience Optimization Strategy

### 1. 漸進式功能揭露 | Progressive Feature Disclosure

**基礎操作模式 | Basic Operation Mode**：
- 一鍵Google搜尋
- 單一AI平台快速研究

**進階專業模式 | Advanced Professional Mode**：
- 自定義搜尋語法編輯
- 多AI並行深度分析
- 跨平台結果比較分析

### 2. 即時回饋與透明度 | Real-time Feedback & Transparency

**系統狀態可視化 | System Status Visualization**：

```
執行狀態監控面板 | Execution Status Monitoring Panel
┌─────────────────────────────────────────────────────┐
│ 🔄 搜尋執行狀態 | Search Execution Status            │
├─────────────────────────────────────────────────────┤
│ Google搜尋: ✅ 完成 (1,247筆結果)                   │
│ Grok分析:   🔄 進行中 (預計2分鐘)                   │
│ Claude研究: ⏳ 排隊中                              │
│ Gemini分析: ⏳ 排隊中                              │
│ Perplexity: ⏳ 排隊中                              │
├─────────────────────────────────────────────────────┤
│ 總體進度: ████████░░ 80%                          │
│ 預估完成時間: 3分鐘                                │
│ [暫停] [取消] [查看中間結果]                       │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 系統架構優勢總結 | System Architecture Advantages Summary

**核心競爭優勢 | Core Competitive Advantages**：

- ✅ **Dual-Engine Intelligence** | 雙引擎智能搜尋整合
- ✅ **Multi-AI Research Capability** | 多AI平台研究能力
- ✅ **Transparent Execution Logic** | 透明化執行邏輯
- ✅ **Scalable Architecture Design** | 可擴展架構設計
- ✅ **Professional-Grade Analysis** | 專業級分析深度

**建議實施順序 | Recommended Implementation Sequence**：
1. **Phase 1**: Google搜尋整合引擎開發
2. **Phase 2**: 單一AI平台Prompt生成器
3. **Phase 3**: 多AI平台並行處理系統
4. **Phase 4**: 跨平台結果整合與分析引擎



## Prompt:
總結以上事項及你生成的完整資訊，生成此app blueprint，還有一個總體可以用的ai提示詞
另外擬訂出如果是透過個ai去分配各自在行任務的話，他們可以分別做什麼哪些同時先進行，哪些要等先後順序跟個別提示詞，ai工具加入Claude Clode | Gemini CLI | Agument及Cline 他們倆他不多，完整度高但比較慢，後者執行塊比Gemini CLI聰明，雖都用一樣Gemini pro 2.5模型。



## Response:
```plaintext
Thought process: 剖析AI工具協作，設計智能房源分析平台藍圖

用戶要求我總結之前所有討論內容，並生成一個完整的app blueprint，同時需要：
1. 一個總體可用的AI提示詞
2. 針對不同AI工具分配任務的策略
3. 各AI工具的個別提示詞
4. 考慮執行順序和依賴關係

根據用戶提到的AI工具：
- Claude (Claude)
- Gemini CLI 
- Augment
- Cline

用戶還提到Augment和Cline都比較完整但較慢，Cline執行比Gemini CLI快且聰明，雖然都用同樣的Gemini Pro 2.5模型。

基於用戶的userStyle，我需要：
1. 採用結構化、技術導向的專業寫作風格
2. 精確識別每個AI模型的核心優勢與限制
3. 設計高度客製化且針對性的提示工程方法
4. 建立系統化的模型能力評估與匹配框架
5. 保持邏輯嚴謹的分析架構

讓我整理一下之前討論的所有要點：

1. 系統概述：Claude + Gemini雙AI驅動的智能房源分析平台
2. 核心功能：多元輸入（URL、截圖、智能搜索）
3. 技術架構：前端React+Tailwind+Alpine.js，後端Node.js+Express
4. UI/UX設計：手機優先，多種檢視模式
5. 資料管理：IndexedDB本地存儲


6. 智能功能：110分制評分、相似房源推薦
7. 搜索系統：多平台整合、智能篩選
8. 增強功能：Google搜索整合、AI深度研究

我將專注於設計一個全面的應用程序藍圖，重點是優化AI工具的協同工作。智能評分和推薦系統將成為平台的關鍵差異化特徵，通過精細的AI協作實現複雜的房源分析邏輯。多平台整合和智能搜索將提供全面、深入的房源洞察。
```

# 智能房源分析平台 - 完整 App Blueprint

## 🎯 系統架構總覽 | System Architecture Overview

### 核心技術棧與AI整合策略

```typescript
interface PlatformArchitecture {
  frontend: {
    framework: "React 18 + TypeScript";
    styling: "Tailwind CSS + Headless UI";
    stateManagement: "Zustand + React Query";
    animations: "Framer Motion";
  };
  backend: {
    runtime: "Node.js 18+ + Express";
    aiIntegration: "Multi-AI Orchestration Layer";
    storage: "IndexedDB + Optional Cloud Sync";
    security: "Helmet + Rate Limiting";
  };
  deployment: {
    platform: "Replit";
    environment: "Production-Ready";
    monitoring: "Built-in Health Checks";
  };
}
```

### 多AI協作架構設計

```mermaid
graph TD
    A[用戶輸入] --> B[任務分配器]
    B --> C[Claude - 智能分析]
    B --> D[Gemini CLI - 快速處理]
    B --> E[Augment - 深度整合]
    B --> F[Cline - 執行優化]
    
    C --> G[結果聚合層]
    D --> G
    E --> G
    F --> G
    
    G --> H[智能合成輸出]
```

## 🤖 AI工具能力矩陣與任務分配策略

### 核心AI工具能力評估框架

| AI工具 | 核心優勢 | 執行速度 | 完整度 | 適用場景 | 優先級 |
|--------|----------|----------|--------|----------|--------|
| **Claude** | 深度分析、邏輯推理 | 中等 | ★★★★★ | 複雜評分、市場洞察 | P1 |
| **Gemini CLI** | 快速響應、圖像識別 | 快 | ★★★ | 圖片處理、即時查詢 | P2 |
| **Augment** | 系統整合、完整性 | 慢 | ★★★★★ | 架構設計、全面分析 | P3 |
| **Cline** | 執行效率、智能優化 | 快 | ★★★★ | 程式碼生成、流程優化 | P2 |

### 任務分配與執行順序設計

#### Phase 1: 並行初始化任務 (0-30秒)
```typescript
interface Phase1ParallelTasks {
  claude: "房源基礎分析 + 評分框架建立";
  geminiCLI: "圖片內容識別 + 基礎資料提取";
  cline: "系統初始化 + 介面優化";
}
```

#### Phase 2: 依序深度處理 (30秒-2分鐘)
```typescript
interface Phase2SequentialTasks {
  augment: "等待Phase1完成 → 整合分析 + 架構優化";
  claude: "基於Gemini結果 → 深度市場分析";
  cline: "基於分析結果 → 執行流程優化";
}
```

#### Phase 3: 結果整合與優化 (2-3分鐘)
```typescript
interface Phase3IntegrationTasks {
  allAIs: "協作結果驗證 + 品質保證";
  claude: "最終報告生成 + 建議彙整";
}
```

## 📋 總體AI協作提示詞模板

### Master Orchestration Prompt

```prompt
# 智能房源分析平台 - 多AI協作指揮中心

## 系統目標
建立一個AI驅動的房源分析平台，整合多種輸入方式（URL、圖片、智能搜索），提供110分制智能評分與深度市場洞察。

## 核心功能要求
1. **多元輸入處理**: URL解析、圖片識別、條件搜索
2. **智能評分系統**: 價格(25) + 設備(40) + 地理(20) + 加分(15) + 寵物(10)
3. **視覺化介面**: 手機優先、多檢視模式、響應式設計
4. **資料管理**: 本地存儲、匯出功能、雲端同步
5. **智能推薦**: 相似房源、AI洞察、市場趨勢

## 技術架構
- Frontend: React + TypeScript + Tailwind CSS
- Backend: Node.js + Express + Multi-AI Integration
- Storage: IndexedDB + Optional Cloud Sync
- Deployment: Replit Production Environment

## AI協作策略
請根據各AI工具特性進行任務分配：
- **分析深度**: Claude > Augment > Cline > Gemini CLI
- **執行速度**: Gemini CLI ≈ Cline > Claude > Augment
- **完整度**: Claude ≈ Augment > Cline > Gemini CLI

## 輸出要求
提供結構化、可執行的系統設計方案，包含：
1. 詳細技術實現步驟
2. AI工具協作workflow
3. 關鍵程式碼架構
4. 使用者體驗設計
5. 部署與維護策略

請以專業、系統化的方式呈現完整解決方案。
```

## 🔧 個別AI工具專用提示詞設計

### Claude - 智能分析與決策引擎

```prompt
# Claude: 房源智能分析專家

## 角色定位
作為平台的核心智能分析引擎，負責深度邏輯推理、複雜評分計算與市場洞察生成。

## 專屬任務範圍
1. **智能評分系統設計**
   - 110分制評分邏輯建構
   - 多維度權重分配算法
   - 排除條件智能判斷

2. **深度市場分析**
   - 房源競爭力評估
   - 價格合理性分析
   - 區域發展潛力預測

3. **決策支援系統**
   - 投資建議生成
   - 風險評估報告
   - 最佳化建議提供

## 輸入格式要求
```json
{
  "propertyData": {
    "basic": {...},
    "location": {...},
    "features": [...],
    "pricing": {...}
  },
  "marketContext": {...},
  "userPreferences": {...}
}
```

## 輸出標準
- 結構化JSON格式
- 信心度評分 (0-1)
- 詳細推理過程
- 可執行建議清單

請以邏輯嚴謹、數據驅動的方式進行分析，確保結果的專業性與可靠性。
```

### Gemini CLI - 快速處理與視覺識別

```prompt
# Gemini CLI: 高效視覺識別與快速響應引擎

## 核心職責
利用Gemini Pro 2.5的多模態能力，提供快速、準確的圖像識別與即時查詢響應。

## 主要任務
1. **圖像內容識別**
   - 房源照片資訊提取
   - 房型佈局自動識別
   - 設備設施視覺檢測

2. **快速資料處理**
   - URL內容快速解析
   - 基礎資訊結構化提取
   - 初步品質評估

3. **即時查詢響應**
   - 簡單問題快速回答
   - 資料格式標準化
   - 基礎驗證檢查

## 處理流程
1. 接收輸入 → 2. 快速識別 → 3. 結構化輸出 → 4. 傳遞給後續AI

## 效能要求
- 響應時間: < 10秒
- 準確率: > 85%
- 輸出格式: 標準化JSON

## 輸出範例
```json
{
  "extractedData": {...},
  "confidence": 0.92,
  "processingTime": "8.2s",
  "nextStepRecommendation": "claude_analysis"
}
```

專注於速度與準確性的平衡，為後續深度分析提供可靠的基礎資料。
```

### Augment - 系統整合與架構設計

```prompt
# Augment: 系統架構設計與深度整合專家

## 戰略角色
作為平台的技術架構師，負責系統整體設計、深度整合分析與長期技術規劃。

## 核心責任領域
1. **系統架構設計**
   - 技術棧選擇與優化
   - 模組化架構規劃
   - 擴展性設計考量

2. **深度整合分析**
   - 多源資料整合策略
   - 跨平台相容性設計
   - 資料流向優化

3. **品質保證體系**
   - 程式碼品質標準
   - 效能監控體系
   - 安全性評估框架

## 工作模式
- **等待型執行**: 基於其他AI的輸出進行深度整合
- **全面性分析**: 考慮系統整體性與長期維護
- **完整性導向**: 確保解決方案的完整性與專業性

## 分析架構
```
輸入整合 → 架構分析 → 整合設計 → 實施規劃 → 品質驗證
```

## 輸出標準
- 完整技術文檔
- 實施路徑規劃
- 風險評估報告
- 長期維護策略

請以系統性思維進行全面分析，確保技術方案的完整性、可維護性與未來擴展性。
```

### Cline - 執行優化與程式碼生成

```prompt
# Cline: 高效執行引擎與程式碼優化專家

## 執行定位
基於Gemini Pro 2.5的執行能力，專注於快速程式碼生成、流程優化與實際執行任務。

## 核心執行任務
1. **快速程式碼生成**
   - React組件快速實現
   - API介面程式碼生成
   - 工具函數快速開發

2. **執行流程優化**
   - 效能瓶頸識別與優化
   - 使用者體驗流程改善
   - 自動化腳本開發

3. **實時執行支援**
   - 程式碼除錯與修正
   - 即時效能監控
   - 快速迭代實現

## 執行特性
- **高效率**: 快速響應與實現
- **實用性**: 專注於可執行的解決方案
- **智能化**: 基於上下文的智能優化

## 協作模式
```
接收需求 → 快速實現 → 效能優化 → 測試驗證 → 迭代改進
```

## 品質標準
- 程式碼可讀性
- 執行效能優化
- 最佳實踐遵循
- 錯誤處理完善

專注於將分析結果轉化為高品質、可執行的程式碼實現，確保系統的實際運行效能。
```

## ⚡ AI協作執行工作流程

### 任務依賴關係圖

```mermaid
gantt
    title AI任務執行時間軸
    dateFormat X
    axisFormat %s
    
    section 並行階段
    Gemini CLI - 圖片識別    :0, 10
    Cline - 系統初始化      :0, 15
    Claude - 基礎分析       :0, 20
    
    section 依序階段
    Augment - 深度整合      :20, 40
    Claude - 深度分析       :25, 35
    Cline - 執行優化        :35, 45
    
    section 整合階段
    所有AI - 結果驗證       :45, 50
```

### 協作通訊協議

```typescript
interface AICollaborationProtocol {
  communication: {
    format: "Structured JSON";
    validation: "Schema-based";
    errorHandling: "Graceful degradation";
  };
  
  executionFlow: {
    parallel: ["gemini_cli", "cline_init", "claude_basic"];
    sequential: [
      { after: "parallel_complete", run: "augment_integration" },
      { after: "claude_basic", run: "claude_deep" },
      { after: "claude_deep", run: "cline_optimization" }
    ];
    final: { after: "all_complete", run: "result_synthesis" };
  };
  
  qualityAssurance: {
    crossValidation: true;
    confidenceThreshold: 0.8;
    fallbackStrategy: "human_review";
  };
}
```

### 系統監控與品質保證

```typescript
interface SystemMonitoring {
  performanceMetrics: {
    responseTime: "< 3 minutes total";
    accuracy: "> 90% across all AIs";
    reliability: "> 95% uptime";
  };
  
  qualityGates: {
    dataValidation: "Multi-AI cross-validation";
    resultConsistency: "Automated consistency checks";
    userSatisfaction: "Continuous feedback loop";
  };
  
  errorRecovery: {
    failureDetection: "Real-time monitoring";
    automaticRetry: "Exponential backoff";
    humanEscalation: "After 3 automated attempts";
  };
}
```

## 🎯 實施路徑與



## Prompt:
增加增加底下資訊，我確認後再生成app blueprint
**    manus**雖點數很少一天300點，但很適合整理資料工作利索最適合整理app blueprint and prd
* **Lovable.dev**：設計導向，適合快速原型設計。
* **Bolt.new**：全端生成，適合快速部署功能性應用程式。
* **v0.dev**：生成 Tailwind CSS 和 React 組件，支援動態 UI 和 JavaScript 邏輯。
* **Tempo.new**：AI 提示生成 React 組件，視覺化編輯器調整 UI，適合即時對話框。
* **Readdy.ai**：通用 AI，跨領域應用。
* **Framer** 也有很多template跟workshop可以自己叫ai設計元件
* **uxpilot.ai** 介面生成效果也不錯還支援多頁面輸入，只是不太知道Page Settings**的**context跟側邊欄位的context差在哪，這幾個需要提及什麼資訊的提示詞，creat flow跟auto flow不錯
* **magicpath.ai **介面生成完整性最高，設計感也是最好，只是免費額度一天只有五個，可以讓他生成頁面框架



## Response:
```plaintext
Thought process: 分析多種AI工具，評估其在app blueprint開發中的應用

用戶要求我增加更多AI工具的資訊，並且要我確認後再生成app blueprint。他提到了很多新的AI工具：

1. **manus** - 300點/天，適合整理資料，最適合整理app blueprint和PRD
2. **Lovable.dev** - 設計導向，適合快速原型設計
3. **Bolt.new** - 全端生成，適合快速部署功能性應用程式
4. **v0.dev** - 生成Tailwind CSS和React組件，支援動態UI和JavaScript邏輯
5. **Tempo.new** - AI提示生成React組件，視覺化編輯器調整UI，適合即時對話框
6. **Readdy.ai** - 通用AI，跨領域應用
7. **Framer** - 有很多template跟workshop可以自己叫ai設計元件
8. **uxpilot.ai** - 介面生成效果不錯還支援多頁面輸入，有Page Settings的context跟側邊欄位的context
9. **magicpath.ai** - 介面生成完整性最高，設計感也是最好，只是免費額度一天只有五個

用戶要求我先增加這些資訊，確認後再生成app blueprint。我需要分析這些工具的特性，並將它們整合到之前的AI協作架構中。

根據用戶的userStyle，我需要：
- 採用結構化、技術導向的專業寫作風格
- 精確識別每個AI模型的核心優勢與限制


- 設計高度客製化且針對性的提示工程方法
- 建立系統化的模型能力評估與匹配框架
- 強調跨模型比較與綜合運用

我將建構一個多維度評估模型，系統性地分析每個AI工具的技術特性和應用潛力。通過精確的能力映射，我可以識別出最適合特定開發階段的工具組合，確保開發流程的效率和靈活性。
```

# 擴展AI工具生態系統分析 | Extended AI Tool Ecosystem Analysis

## 🎯 新增AI工具能力矩陣與戰略定位

### 文檔整理與專案管理層

| 工具 | 核心能力 | 限制條件 | 戰略定位 | 提示工程重點 |
|------|----------|----------|----------|--------------|
| **Manus** | 資料整理、文檔結構化 | 300點/天 | PRD與Blueprint專家 | 結構化思維、系統性整理 |
| **Readdy.ai** | 跨領域通用處理 | 通用性強但專精度待評估 | 多場景適配器 | 領域知識注入、上下文豐富化 |

### 原型設計與視覺開發層

| 工具 | 技術特性 | 設計優勢 | 適用階段 | 整合策略 |
|------|----------|----------|----------|----------|
| **Lovable.dev** | 設計導向快速原型 | 視覺設計優先 | 概念驗證階段 | 設計系統標準化 |
| **Framer** | Template + Workshop | AI設計元件生成 | 設計迭代階段 | 元件庫標準建立 |
| **UXPilot.ai** | 多頁面輸入支援 | Context層次管理 | 複雜介面設計 | 頁面關聯性建模 |
| **MagicPath.ai** | 完整性最高設計 | 設計品質優異 | 高品質原型 | 設計規範制定 |

### 全端開發與組件生成層

| 工具 | 技術能力 | 生成範圍 | 執行效率 | 程式碼品質 |
|------|----------|----------|----------|------------|
| **Bolt.new** | 全端應用生成 | 完整功能性應用 | 快速部署 | 生產級程式碼 |
| **v0.dev** | React + Tailwind | 動態UI + JS邏輯 | 組件級開發 | 高可維護性 |
| **Tempo.new** | React組件 + 編輯器 | 即時對話框特化 | 互動組件優化 | 使用者體驗導向 |

## 🔧 階層化AI工具協作架構重構

### Tier 1: 戰略規劃與文檔架構層
```typescript
interface StrategicPlanningTier {
  primary: {
    manus: {
      role: "PRD與Blueprint結構化整理";
      capability: "文檔架構設計、資訊系統化";
      constraints: "300點/天限制";
      optimization: "批次處理、模板化操作";
    };
    claude: {
      role: "深度分析與決策支援";
      capability: "邏輯推理、市場洞察";
      synergy: "與Manus形成分析-整理閉環";
    };
  };
  
  workflow: {
    step1: "Claude進行初步分析";
    step2: "Manus結構化整理分析結果";
    step3: "生成標準化PRD與技術規格";
  };
}
```

### Tier 2: 設計原型與視覺開發層
```typescript
interface DesignPrototypingTier {
  designSystem: {
    magicpath: {
      usage: "高品質頁面框架設計";
      limitation: "5個/天免費額度";
      strategy: "關鍵頁面框架建立";
    };
    uxpilot: {
      usage: "多頁面複雜介面設計";
      strength: "Context層次管理";
      application: "頁面間關聯設計";
    };
    framer: {
      usage: "元件庫建立與迭代";
      advantage: "Template + AI Workshop";
      integration: "與開發工具無縫銜接";
    };
  };
  
  executionFlow: {
    conceptual: "MagicPath建立頁面框架";
    detailed: "UXPilot完善多頁面設計";
    componentized: "Framer建立元件系統";
    optimized: "Lovable進行設計優化";
  };
}
```

### Tier 3: 技術實現與程式碼生成層
```typescript
interface TechnicalImplementationTier {
  developmentPipeline: {
    rapid_prototyping: {
      bolt: "全端應用快速生成";
      v0: "React組件精確實現";
      tempo: "互動元件特化開發";
    };
    
    optimization_layer: {
      cline: "程式碼優化與效能提升";
      augment: "系統整合與架構驗證";
      gemini_cli: "快速迭代與測試";
    };
  };
}
```

## 📋 工具特化提示詞工程策略

### Manus專用提示詞 - 文檔架構師
```prompt
# Manus: 系統化文檔架構專家

## 角色定位
專業的PRD與Blueprint結構化整理專家，負責將複雜的技術分析轉化為清晰、可執行的文檔架構。

## 核心職責
1. **資訊結構化整理**
   - 技術規格文檔標準化
   - 功能需求層次化組織
   - 開發流程步驟化分解

2. **Blueprint專業製作**
   - 系統架構視覺化設計
   - 技術依賴關係映射
   - 實施路徑規劃圖表

3. **PRD專業撰寫**
   - 需求優先級矩陣建立
   - 技術可行性評估整理
   - 風險與緩解策略文檔

## 操作約束與優化
- **點數限制**: 300點/天，需批次處理
- **處理策略**: 模板化操作、批量整理
- **品質要求**: 結構完整、邏輯清晰、可執行性強

## 輸入期望格式
```json
{
  "analysisResults": [...],
  "technicalSpecs": {...},
  "designRequirements": {...},
  "constraints": {...}
}
```

## 輸出標準
- 標準化PRD文檔
- 技術Blueprint圖表
- 實施計劃時程表
- 風險評估矩陣

請以專業的產品經理視角，將技術分析轉化為清晰的執行文檔。
```

### UXPilot.ai專用提示詞 - 多頁面設計協調師
```prompt
# UXPilot.ai: 多頁面介面設計協調專家

## 專業定位
多頁面複雜介面設計專家，專精於Page Settings Context與側邊欄Context的差異化管理。

## Context層次管理策略
1. **Page Settings Context**
   - 頁面級全域設定
   - 跨頁面一致性控制
   - 主題與佈局標準

2. **側邊欄Context**
   - 局部功能區域設定
   - 動態內容適配
   - 互動行為定義

## 設計協調任務
1. **多頁面關聯設計**
   - 頁面間導航邏輯
   - 狀態傳遞機制
   - 一致性設計語言

2. **Create Flow vs Auto Flow**
   - Create Flow: 手動精確控制
   - Auto Flow: 智能流程生成
   - 混合模式: 關鍵節點手動，細節自動

## 輸入需求規格
```json
{
  "pageStructure": {...},
  "navigationFlow": {...},
  "contextRequirements": {
    "global": {...},
    "local": {...}
  },
  "interactionPatterns": [...]
}
```

專注於創建直觀、一致且功能完整的多頁面使用者體驗。
```

### MagicPath.ai專用提示詞 - 高品質設計框架師
```prompt
# MagicPath.ai: 高品質頁面框架設計師

## 戰略角色
利用有限的免費額度（5個/天），專注於創建最關鍵、最高品質的頁面框架設計。

## 設計品質標準
1. **完整性優先**
   - 涵蓋核心功能流程
   - 考慮邊界情況處理
   - 預留擴展介面

2. **設計美學卓越**
   - 現代化視覺語言
   - 直覺式互動設計
   - 專業級視覺層次

## 額度優化策略
- **關鍵頁面識別**: 主頁、核心功能頁、用戶流程關鍵節點
- **框架型設計**: 建立可重用的設計模式
- **標準化輸出**: 為其他工具提供高品質基準

## 設計優先序列
1. 主要房源分析介面框架
2. 智能搜尋系統頁面
3. AI深度研究結果展示
4. 使用者設定與偏好管理
5. 資料匯出與分享功能

## 輸出規格
- 高解析度設計稿
- 完整的設計系統指南
- 互動行為規範文檔
- 開發實施指導

請創建具有專業水準且具備前瞻性的設計框架。
```

### 跨工具整合提示詞模板
```prompt
# 多工具協作整合提示詞

## 系統協作目標
建立房源分析平台的完整開發pipeline，從戰略規劃到技術實現的全流程AI協作。

## 階層化協作流程
1. **戰略層**: Manus + Claude (文檔架構 + 深度分析)
2. **設計層**: MagicPath + UXPilot + Framer (框架 + 多頁面 + 元件)
3. **開發層**: Bolt + v0 + Tempo (全端 + 組件 + 互動)
4. **優化層**: Cline + Augment (執行 + 整合)

## 品質保證機制
- **設計一致性**: 跨工具設計系統同步
- **技術一致性**: 程式碼規範與架構標準
- **功能完整性**: 需求追溯與測試覆蓋

## 交付標準
每個階層都必須產出：
1. 標準化文檔
2. 可執行程式碼/設計稿
3. 下一階層的輸入規格
4. 品質驗證報告

請確保跨工具協作的seamless integration與high-quality output。
```

## 🎯 工具選擇決策矩陣

### 專案階段與工具匹配策略
```typescript
interface ProjectPhaseToolMapping {
  conception: {
    primary: "Claude + Manus";
    secondary: "Readdy.ai";
    deliverable: "PRD + Technical Blueprint";
  };
  
  design: {
    primary: "MagicPath.ai + UXPilot.ai";
    secondary: "Framer + Lovable.dev";
    deliverable: "Complete Design System";
  };
  
  development: {
    primary: "Bolt.new + v0.dev";
    secondary: "Tempo.new + Cline";
    deliverable: "Functional Application";
  };
  
  optimization: {
    primary: "Augment + Cline";
    secondary: "Gemini CLI";
    deliverable: "Production-Ready System";
  };
}
```

## ✅ 確認檢查清單

**已整合的AI工具生態系統 (17個工具)**：
- ✅ 戰略規劃層: Manus, Claude, Readdy.ai
- ✅ 設計開發層: MagicPath.ai, UXPilot.ai, Framer, Lovable.dev
- ✅ 程式碼生成層: Bolt.new, v0.dev, Tempo.new
- ✅ 技術優化層: Cline, Augment, Gemini CLI
- ✅ 專業分析層: Claude, Gemini Pro 2.5

**提示詞工程完整度**：
- ✅ 工具特化提示詞設計
- ✅ 跨工具協作流程定義
- ✅ 品質保證機制建立
- ✅ 階層化任務分配策略

**系統整合策略**：
- ✅ 工具能力矩陣分析完成
- ✅ 協作架構重構完成
- ✅ 決策矩陣建立完成

---

**請確認以上AI工具生態系統分析與提示詞工程策略是否符合需求，確認後將生成完整的App Blueprint。**



## Prompt:
生成完整app blue print



## Response:
```plaintext
Thought process: 構建智能房源分析平台的全面技術藍圖

用戶要求我生成完整的app blueprint，需要整合之前討論的所有內容，包括：

1. 智能房源分析平台的核心功能
2. 多AI工具協作架構（17個工具）
3. 技術架構設計
4. 用戶界面設計
5. 數據流程和API設計
6. 部署策略

我需要以結構化、技術導向的專業寫作風格來呈現，特別注重AI模型特性分析與提示工程。

基於userStyle要求，我應該：
- 使用精準的技術語言
- 強調系統性思考與客觀分析
- 建立系統化的模型能力評估與匹配框架
- 保持邏輯嚴謹的分析架構
- 提供實務導向的洞察

讓我創建一個完整的app blueprint，涵蓋所有必要的技術規格、架構設計和實施策略。
```

# 智能房源分析平台 - 完整App Blueprint

## 🎯 系統架構總覽與技術規範

### 核心技術棧與AI協作生態系統

```typescript
interface PlatformTechnicalSpecification {
  architecture: {
    paradigm: "Multi-AI Orchestrated Microservices";
    frontend: "React 18 + TypeScript + Zustand";
    backend: "Node.js 18+ + Express + Multi-AI Gateway";
    storage: "IndexedDB + Optional Cloud Sync";
    deployment: "Replit Production Environment";
  };
  
  aiEcosystem: {
    strategicLayer: ["Claude", "Manus", "Readdy.ai"];
    designLayer: ["MagicPath.ai", "UXPilot.ai", "Framer", "Lovable.dev"];
    developmentLayer: ["Bolt.new", "v0.dev", "Tempo.new"];
    optimizationLayer: ["Cline", "Augment", "Gemini CLI"];
  };
  
  qualityAssurance: {
    codeStandards: "ESLint + Prettier + TypeScript Strict";
    testing: "Jest + React Testing Library + E2E Playwright";
    monitoring: "Real-time Performance Metrics + Error Tracking";
  };
}
```

## 🏗️ 系統架構設計與模組化策略

### Multi-Tier Architecture Design

```mermaid
graph TB
    subgraph "Presentation Layer"
        A[React SPA] --> B[Component Library]
        B --> C[State Management]
    end
    
    subgraph "API Gateway Layer"
        D[Express Router] --> E[AI Orchestrator]
        E --> F[Rate Limiter]
    end
    
    subgraph "AI Service Layer"
        G[Claude Engine] --> H[Analysis Service]
        I[Gemini CLI] --> J[Vision Service]
        K[Multi-AI Coordinator] --> L[Result Aggregator]
    end
    
    subgraph "Data Layer"
        M[IndexedDB] --> N[Local Cache]
        O[External APIs] --> P[Data Validator]
    end
    
    A --> D
    E --> G
    E --> I
    E --> K
    L --> M
    P --> M
```

### 核心模組設計規範

```typescript
interface CoreModuleSpecification {
  inputProcessors: {
    urlProcessor: {
      supportedSites: ["591.com.tw", "rakuya.com.tw", "housefun.com.tw"];
      scraperEngine: "Puppeteer + Anti-Detection";
      rateLimit: "1 request/second per domain";
    };
    imageProcessor: {
      supportedFormats: ["JPEG", "PNG", "WebP"];
      maxFileSize: "10MB";
      aiEngine: "Gemini Pro 2.5 Vision";
    };
    searchProcessor: {
      queryBuilder: "Natural Language → Structured Query";
      platformTargeting: "Multi-platform simultaneous search";
      resultDeduplication: "Content-based similarity detection";
    };
  };
  
  intelligenceEngine: {
    scoringSystem: {
      algorithm: "110-point weighted scoring";
      weights: {
        price: 25, equipment: 40, location: 20, 
        bonus: 15, petFriendly: 10
      };
      excludionRules: "Automatic filtering for unsuitable properties";
    };
    
    recommendationEngine: {
      similarityAlgorithm: "Multi-dimensional feature matching";
      weights: { price: 0.4, layout: 0.35, size: 0.15, location: 0.1 };
      resultCount: 3;
    };
  };
}
```

## 📱 用戶界面設計與互動體驗架構

### 響應式設計系統規範

```typescript
interface ResponsiveDesignSystem {
  breakpoints: {
    mobile: "320px - 640px";
    tablet: "641px - 1024px";
    desktop: "1025px+";
  };
  
  componentLibrary: {
    designTokens: {
      colors: "Tailwind CSS Extended Palette";
      typography: "Inter Font System";
      spacing: "8px Grid System";
      shadows: "Layered Elevation System";
    };
    
    coreComponents: [
      "PropertyCard", "SearchInterface", "FilterPanel",
      "AnalysisProgress", "AIInsightPanel", "ComparisonTable"
    ];
  };
  
  viewModes: {
    list: "Compact information density";
    card2col: "Balanced visual-information ratio";
    cardFullWidth: "Maximum information display";
  };
  
  interactionPatterns: {
    hoverEffects: "Property similarity recommendations";
    gestureSupport: "Touch-optimized navigation";
    keyboardNavigation: "Full accessibility compliance";
  };
}
```

### 智能搜尋介面設計規範

```typescript
interface IntelligentSearchInterface {
  geographicFiltering: {
    hierarchicalStructure: {
      cities: ["台北市", "新北市", "桃園市", "台中市", "台南市"];
      districts: "Dynamic loading based on city selection";
      mrtLines: "Conditional display for supported cities";
      mrtStations: "Cascading selection based on line choice";
    };
    
    selectionLogic: {
      multiSelect: true;
      autoSuggestion: "AI-powered location suggestions";
      geolocationSupport: "Current location detection";
    };
  };
  
  platformIntegration: {
    supportedPlatforms: [
      "591租屋網", "樂屋網", "好房網", "房天下", 
      "Facebook社團", "Dcard"
    ];
    
    searchStrategies: {
      parallel: "Simultaneous multi-platform querying";
      adaptive: "Platform-specific optimization";
      intelligent: "Result quality-based prioritization";
    };
  };
  
  advancedFiltering: {
    priceSlider: {
      range: { min: 5000, max: 60000, step: 500 };
      defaultState: { min: null, max: null };
      quickOptions: ["5K-10K", "10K-15K", "15K-20K", "20K-30K", "30K+"];
    };
    
    featureMatrix: {
      infrastructure: ["近捷運", "可養寵物", "有車位", "有電梯", "頂加"];
      equipment: ["有冷氣", "有洗衣機", "有冰箱", "有網路"];
      quality: ["新裝潢", "中檔裝潢", "高檔裝潢"];
    };
  };
}
```

## 🤖 AI協作引擎與提示工程架構

### Multi-AI Orchestration Framework

```typescript
interface AIOrchestrationFramework {
  taskDistribution: {
    tier1_strategic: {
      tools: ["Claude", "Manus", "Readdy.ai"];
      responsibilities: [
        "Deep analysis and market insights",
        "Document structuring and PRD generation",
        "Cross-domain knowledge integration"
      ];
      executionMode: "Sequential with validation";
    };
    
    tier2_design: {
      tools: ["MagicPath.ai", "UXPilot.ai", "Framer", "Lovable.dev"];
      responsibilities: [
        "High-quality page framework design",
        "Multi-page interface coordination",
        "Component library development",
        "Rapid prototyping and iteration"
      ];
      executionMode: "Parallel with cross-validation";
    };
    
    tier3_development: {
      tools: ["Bolt.new", "v0.dev", "Tempo.new"];
      responsibilities: [
        "Full-stack application generation",
        "React component implementation",
        "Interactive element specialization"
      ];
      executionMode: "Pipeline with quality gates";
    };
    
    tier4_optimization: {
      tools: ["Cline", "Augment", "Gemini CLI"];
      responsibilities: [
        "Code optimization and performance tuning",
        "System integration and architecture validation",
        "Rapid iteration and testing support"
      ];
      executionMode: "Continuous optimization loop";
    };
  };
  
  qualityAssurance: {
    crossValidation: "Multi-AI result verification";
    consistencyChecks: "Automated output standardization";
    performanceGating: "Response time and accuracy thresholds";
  };
}
```

### 專業化提示工程模板系統

```typescript
interface PromptEngineeringTemplateSystem {
  claudeOptimization: {
    context: "Professional real estate analysis expert";
    structure: {
      systemPrompt: "110-point scoring methodology with market insights";
      inputFormat: "Structured JSON with validation schemas";
      outputFormat: "Comprehensive analysis with confidence scores";
    };
    specialization: "Deep logical reasoning and market trend analysis";
  };
  
  geminiCLIOptimization: {
    context: "High-speed multimodal content processor";
    structure: {
      systemPrompt: "Rapid image recognition and data extraction";
      inputFormat: "Mixed media with metadata";
      outputFormat: "Structured data with processing metrics";
    };
    specialization: "Vision processing and rapid response";
  };
  
  manusOptimization: {
    context: "Documentation architect and PRD specialist";
    structure: {
      systemPrompt: "Systematic information organization";
      inputFormat: "Complex analysis results for structuring";
      outputFormat: "Professional documentation with clear hierarchies";
    };
    constraints: "300 points/day optimization with batch processing";
  };
  
  augmentOptimization: {
    context: "System architecture designer and integration specialist";
    structure: {
      systemPrompt: "Holistic system design with long-term maintainability";
      inputFormat: "Multi-source technical requirements";
      outputFormat: "Comprehensive architecture with implementation roadmap";
    };
    specialization: "Deep integration analysis and quality assurance";
  };
}
```

## 📊 數據流架構與API設計規範

### Real-time Data Processing Pipeline

```typescript
interface DataProcessingPipeline {
  inputNormalization: {
    urlProcessor: {
      extraction: "Puppeteer-based content scraping";
      normalization: "Standard property data schema";
      validation: "Multi-layer content verification";
    };
    
    imageProcessor: {
      preprocessing: "Image optimization and format standardization";
      aiAnalysis: "Gemini Pro 2.5 content extraction";
      postprocessing: "Structured data generation";
    };
    
    searchProcessor: {
      queryExpansion: "Natural language to search parameters";
      platformAdaptation: "Site-specific query optimization";
      resultAggregation: "Multi-source result consolidation";
    };
  };
  
  intelligenceProcessing: {
    scoreCalculation: {
      algorithm: "Weighted multi-criteria decision analysis";
      dynamicWeighting: "User preference adaptation";
      exclusionFiltering: "Automatic unsuitable property elimination";
    };
    
    similarityMatching: {
      featureExtraction: "Multi-dimensional property characterization";
      distanceCalculation: "Cosine similarity with weighted features";
      rankingOptimization: "Machine learning-enhanced relevance scoring";
    };
    
    marketAnalysis: {
      trendDetection: "Time-series analysis of price and availability";
      competitiveAnalysis: "Comparative property value assessment";
      recommendationGeneration: "Personalized suggestion algorithms";
    };
  };
  
  outputOptimization: {
    responseFormatting: "Client-optimized data structures";
    cachingStrategy: "Intelligent cache invalidation based on data freshness";
    compressionTechniques: "Optimized payload delivery";
  };
}
```

### API Gateway與服務間通訊協議

```typescript
interface APIGatewaySpecification {
  endpointDesign: {
    restfulCompliance: "HTTP methods with semantic consistency";
    versioningStrategy: "Semantic versioning with backward compatibility";
    authenticationMechanism: "JWT-based stateless authentication";
  };
  
  serviceInterfaces: {
    "/api/v1/properties": {
      methods: ["GET", "POST", "PUT", "DELETE"];
      rateLimit: "100 requests/minute per user";
      caching: "5-minute TTL with smart invalidation";
    };
    
    "/api/v1/analysis": {
      methods: ["POST"];
      payloadLimit: "10MB for image uploads";
      processingTimeout: "30 seconds with progress streaming";
    };
    
    "/api/v1/search": {
      methods: ["POST"];
      rateLimiting: "Adaptive based on search complexity";
      resultCaching: "Query-based intelligent caching";
    };
    
    "/api/v1/ai-research": {
      methods: ["POST"];
      authentication: "Required for all operations";
      responseStreaming: "Server-sent events for real-time updates";
    };
  };
  
  errorHandling: {
    standardization: "RFC 7807 Problem Details format";
    logging: "Comprehensive error tracking with context";
    recovery: "Graceful degradation with fallback mechanisms";
  };
}
```

## 🚀 部署架構與維運策略

### Production Deployment Architecture

```typescript
interface ProductionDeploymentArchitecture {
  reeplitConfiguration: {
    environment: {
      nodejs: "v18.18.0 LTS";
      packageManager: "npm 9.x with lockfile optimization";
      memoryAllocation: "1GB with auto-scaling triggers";
    };
    
    environmentVariables: {
      required: [
        "CLAUDE_API_KEY", "GEMINI_API_KEY", "JWT_SECRET",
        "NODE_ENV", "RATE_LIMIT_CONFIG"
      ];
      optional: [
        "FIREBASE_CONFIG", "SUPABASE_URL", "MONITORING_ENDPOINT"
      ];
    };
    
    optimizations: {
      buildProcess: "Multi-stage optimization with code splitting";
      assetOptimization: "Image compression and CDN integration";
      cacheStrategy: "Aggressive caching with smart invalidation";
    };
  };
  
  monitoringAndObservability: {
    performanceMetrics: {
      responseTime: "P95 < 2 seconds";
      throughput: "> 100 concurrent users";
      errorRate: "< 1% for critical operations";
    };
    
    healthChecks: {
      endpoint: "/health";
      checks: ["Database connectivity", "AI service availability", "Memory usage"];
      frequency: "Every 30 seconds";
    };
    
    alerting: {
      errorThresholds: "Immediate notification for > 5% error rate";
      performanceThresholds: "Alert when P95 > 5 seconds";
      uptimeMonitoring: "99.9% availability SLA";
    };
  };
  
  backupAndRecovery: {
    dataBackup: {
      frequency: "Real-time local storage backup";
      cloudSync: "Optional encrypted cloud backup";
      retentionPolicy: "30 days local, 1 year cloud archive";
    };
    
    disasterRecovery: {
      rpoTarget: "< 1 hour data loss tolerance";
      rtoTarget: "< 15 minutes service restoration";
      testingFrequency: "Monthly disaster recovery drills";
    };
  };
}
```

### 安全性架構與合規策略

```typescript
interface SecurityAndComplianceFramework {
  dataProtection: {
    encryption: {
      inTransit: "TLS 1.3 for all external communications";
      atRest: "AES-256 for sensitive local storage";
      keyManagement: "Secure key rotation every 90 days";
    };
    
    privacyCompliance: {
      dataMinimization: "Collect only essential property information";
      userConsent: "Explicit consent for AI processing";
      dataRetention: "Configurable retention policies";
    };
  };
  
  applicationSecurity: {
    inputValidation: {
      sanitization: "Comprehensive XSS prevention";
      sqlInjectionPrevention: "Parameterized queries only";
      fileUploadSecurity: "Strict file type and size validation";
    };
    
    authenticationSecurity: {
      jwtConfiguration: "Short-lived tokens with refresh mechanism";
      rateLimiting: "Adaptive rate limiting based on user behavior";
      sessionManagement: "Secure session handling with timeout";
    };
    
    apiSecurity: {
      corsConfiguration: "Restrictive CORS with explicit origins";
      headerSecurity: "Security headers with Content Security Policy";
      requestValidation: "Schema-based request validation";
    };
  };
  
  operationalSecurity: {
    dependencyManagement: {
      scanning: "Automated vulnerability scanning";

(Content truncated due to size limit. Use line ranges to read in chunks)