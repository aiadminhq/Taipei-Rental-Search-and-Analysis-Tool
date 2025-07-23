# UX Pilot 智能房源分析平台設計指南 - 更新版

**創建日期**: 2025-07-13  
**版本**: v1.1  
**更新內容**: 採用新配色系統  
**平台**: 桌面版完整功能版本

---

## 🎨 新設計系統配色

### Light Mode (主要配色)
```css
:root {
  --background: #f8f9fa;           /* 淺灰背景 */
  --foreground: #0c0c1d;           /* 深藍文字 */
  --card: #ffffff;                 /* 白色卡片 */
  --primary: #0400ff;              /* 鮮明藍色主色 */
  --accent: #00ffcc;               /* 青綠強調色 */
  --secondary: #f0f0ff;            /* 淺藍次要色 */
  --destructive: #ff3d00;          /* 橙紅警告色 */
  --ring: #ff00c8;                 /* 洋紅環形色 */
  --sidebar: #f0f0ff;              /* 淺藍側邊欄 */
  --sidebar-primary: #ff00c8;      /* 洋紅側邊欄主色 */
  --sidebar-accent: #00ffcc;       /* 青綠側邊欄強調 */
}
```

### Dark Mode (暗色配色)
```css
.dark {
  --background: #0c0c1d;           /* 深藍背景 */
  --foreground: #eceff4;           /* 淺色文字 */
  --card: #1e1e3f;                 /* 深紫卡片 */
  --primary: #ff4d00;              /* 橙色主色 */
  --accent: #00ffcc;               /* 青綠強調色 */
  --secondary: #1e1e3f;            /* 深紫次要色 */
}
```

---

## 🎯 第一個頁面：主要分析頁面（更新版設計）

### Page Name: 
```
智能房源分析 - 主要分析介面 (Modern Tech Style)
```

### Page Context:
```
桌面版智能房源分析平台主頁面 - 現代科技風格設計

這是一個採用現代科技美學的AI驅動房源分析平台，整合Claude + Gemini雙AI引擎。設計風格突出科技感、專業性和視覺衝擊力。

區塊結構：

1. 頂部導航欄 (Header & Navigation)
   - 左側：品牌Logo「🏠 智能房源分析平台」(使用primary藍色 #0400ff)
   - 中央：主要導航選單（分析、Dashboard、收藏、設定）
   - 右側：用戶資訊、匯出功能、說明按鈕
   - 背景：純白 #ffffff，底部邊框 #dfe6e9

2. 統計卡片區 (Statistics Cards) - 科技儀表板風格
   - 四個並列卡片：總房源數(156, ↑12%)、平均評分(78.2, ↑3.1)、高分房源(23, ↑18%)、收藏數量(8, ↑2)
   - 卡片背景：純白 #ffffff
   - 數字顏色：主要藍色 #0400ff (大數字)
   - 趨勢箭頭：青綠色 #00ffcc (上升)、橙紅色 #ff3d00 (下降)
   - 微妙陰影和0.5rem圓角

3. 輸入方式選擇區 (Input Method Selector) - 現代標籤設計
   - 三個並列標籤：🔗 URL連結、📷 圖片上傳、🔍 智能搜索
   - 啟用狀態：primary藍色背景 #0400ff，白色文字
   - 未啟用：secondary淺藍背景 #f0f0ff，深藍文字 #0c0c1d
   - 懸停效果：洋紅色邊框 #ff00c8

4. 主要輸入區域 (Primary Input Area) - 高科技介面
   - URL輸入框：大型區域，背景 #f8f9fa，邊框 #dfe6e9
   - 提示文字：「貼上房源連結（支援591、樂屋網、好房網等）可同時貼上多個連結，每行一個」
   - 分析按鈕：漸層設計(#0400ff到#ff00c8)，白色文字「🤖 開始AI分析」
   - 進度條：5階段設計，使用chart色彩 (#ff00c8, #9000ff, #00e5ff, #00ffcc, #ffe600)

5. 篩選與排序控制區 (Filter & Sort Controls) - 精緻工具列
   - 背景：subtle #f0f0ff
   - 搜索框：圓角設計，洋紅色focus環 #ff00c8
   - 篩選器：dropdown按鈕使用primary色彩
   - 檢視模式：icon buttons with accent color #00ffcc

6. 房源結果展示區 (Property Results Area) - 現代卡片設計
   - 卡片背景：純白 #ffffff
   - 價格顯示：大字體，primary藍色 #0400ff
   - 評分環：使用chart-1色彩 #ff00c8
   - 標籤：accent青綠色 #00ffcc背景
   - 操作按鈕：
     * 收藏按鈕：未收藏時透明，收藏時用accent色 #00ffcc
     * 查看按鈕：primary藍色 #0400ff
     * 原網頁：secondary色彩
     * 找相似：洋紅色 #ff00c8
   - hover效果：微妙陰影提升，邊框變洋紅色

7. 側邊AI洞察面板 (AI Insights Panel) - 科技感面板
   - 固定右側欄位(320px寬)
   - 背景：從primary藍 #0400ff漸層到深紫 #9000ff
   - 文字：白色 #ffffff
   - 內容區塊：
     * 🧠 AI市場洞察 (使用chart-3色 #00e5ff做icon)
     * ⚡智能推薦 (使用chart-4色 #00ffcc做icon)
     * 📈趨勢分析 (使用chart-5色 #ffe600做icon)
   - 可收合按鈕：洋紅色 #ff00c8

設計風格要求：
- 主色調：鮮明藍色 #0400ff (科技感)
- 強調色：青綠色 #00ffcc (未來感)
- 互動色：洋紅色 #ff00c8 (活力感)
- 警告色：橙紅色 #ff3d00 (注意感)
- 背景：淺灰 #f8f9fa (舒適感)
- 卡片：純白 #ffffff (清潔感)
- 字體：Outfit無襯線字體 (現代感)
- 圓角：0.5rem 統一標準
- 陰影：精緻分層陰影系統
- 動畫：subtle transitions和hover effects

用戶體驗目標：
- 科技感十足的視覺體驗
- 直觀的操作流程
- 清晰的資訊層次
- 強烈的品牌識別
- 優雅的互動回饋
```

---

## 🏗️ 完整頁面架構（更新配色版）

### 1. **主要分析介面** ⭐ 最重要
**Page Name**: `智能房源分析 - 主要分析介面 (Tech Style)`

### 2. **Dashboard 儀表板**
**Page Name**: `市場洞察儀表板 - 數據視覺化 (Tech Style)`

**Page Context**:
```
智能房源分析平台 - 科技風格市場洞察儀表板

專為租屋市場數據視覺化設計的高科技Dashboard，採用現代配色系統展示AI分析結果。

區塊結構：
1. 頂部KPI指標區 - 四個科技感指標卡片
   - 卡片背景：純白 #ffffff
   - 主要數字：primary藍色 #0400ff
   - 趨勢指標：chart配色系統
   - 背景圖案：subtle geometric patterns

2. 數據視覺化區域
   - 價格分布圖：使用chart-1到chart-5的漸層配色
   - 區域熱力圖：青綠 #00ffcc到洋紅 #ff00c8的漸層
   - 趨勢線圖：primary藍色 #0400ff主線
   - 圖表背景：卡片白色 #ffffff，邊框 #dfe6e9

3. AI洞察面板
   - 背景：從深藍 #0400ff到深紫 #9000ff的漸層
   - 文字：白色 #ffffff
   - accent點綴：使用 #00ffcc做重點標示
   - icon色彩：chart色彩系統

4. 智能推薦區
   - 推薦卡片：白色背景，洋紅色 #ff00c8邊框
   - 評分環：chart-1色彩 #ff00c8
   - 行動按鈕：accent色 #00ffcc

設計重點：科技感、數據美學、色彩層次豐富
```

### 3. **房源詳情頁**
**Page Name**: `房源詳情 - 完整分析報告 (Tech Style)`

**Page Context**:
```
房源詳細分析頁面 - 高科技風格設計

採用現代科技美學的單一房源完整分析報告頁面。

設計元素：
- 主要圖片：大尺寸展示，圓角 0.5rem
- 價格顯示：特大字體，primary藍色 #0400ff
- 評分系統：
  * 總分環形圖：洋紅色 #ff00c8
  * 分項評分：chart色彩系統
  * 背景：淺藍 #f0f0ff
- AI分析文字區：
  * 背景：漸層從淺灰 #f8f9fa到白色
  * 重點標示：accent青綠色 #00ffcc
- 操作按鈕：
  * 主要按鈕：primary藍色 #0400ff
  * 次要按鈕：secondary淺藍 #f0f0ff
  * 危險按鈕：destructive橙紅 #ff3d00

交互設計：hover效果使用ring洋紅色 #ff00c8
```

### 4. **比較分析頁**
**Page Name**: `房源比較 - 多維度對比 (Tech Style)`

**Page Context**:
```
房源比較分析頁面 - 科技對比介面

多房源並排比較的高科技風格設計。

視覺設計：
- 比較表格：
  * 表頭：primary藍色背景 #0400ff，白色文字
  * 奇數行：淺灰背景 #f8f9fa
  * 偶數行：白色背景 #ffffff
  * 邊框：統一使用 #dfe6e9
- 優勢標示：accent青綠色 #00ffcc背景
- 劣勢標示：destructive橙紅色 #ff3d00背景
- 雷達圖：chart配色系統，透明度50%
- 決策建議框：
  * 背景：洋紅漸層 #ff00c8到紫色 #9000ff
  * 文字：白色 #ffffff

互動元素：拖拽區域使用ring色彩 #ff00c8
```

### 5. **收藏管理頁**
**Page Name**: `我的收藏 - 房源管理 (Tech Style)`

**Page Context**:
```
個人收藏房源管理中心 - 現代管理介面

採用科技感設計的個人房源收藏管理系統。

介面元素：
- 統計面板：
  * 背景：白色卡片 #ffffff
  * 數字：primary藍色 #0400ff
  * 圖示：chart配色系統
- 標籤系統：
  * 標籤背景：accent青綠色 #00ffcc
  * 文字：深色 #0c0c1d
  * 選中狀態：洋紅邊框 #ff00c8
- 房源卡片：
  * 收藏愛心：填充時用accent色 #00ffcc
  * 刪除按鈕：destructive色 #ff3d00
- 批量操作：
  * 全選框：ring洋紅色 #ff00c8
  * 操作按鈕：primary藍色系統

功能配色：成功用綠色，警告用橙色，錯誤用紅色
```

### 6. **設定頁面**
**Page Name**: `系統設定 - 偏好設置 (Tech Style)`

**Page Context**:
```
系統設定與個人偏好頁面 - 高科技控制中心

現代化的系統設定介面，突出科技感和易用性。

設計方案：
- 設定側邊欄：
  * 背景：sidebar淺藍色 #f0f0ff
  * 選中項：sidebar-primary洋紅色 #ff00c8
  * 文字：深藍 #0c0c1d
- 設定面板：
  * 背景：白色 #ffffff
  * 分組邊框：border灰色 #dfe6e9
- 控制元件：
  * 開關：啟用時用primary藍色 #0400ff
  * 滑桿：軌道用secondary色，把手用accent色
  * 輸入框：focus時用ring洋紅色 #ff00c8
- 預覽區域：
  * 背景：淺灰 #f8f9fa
  * 示例元素：使用完整配色展示

即時反饋：變更時用accent色閃爍提示
```

---

## 📱 v0.dev 版型搜尋指南（更新版）

### 🎯 推薦搜尋關鍵字（配合新配色）

#### 1. **現代科技風Dashboard**
- **搜尋詞**: `modern tech dashboard`, `futuristic analytics`, `purple blue dashboard`
- **重點**: 找有鮮明配色和科技感的設計

#### 2. **Property Tech Platform**
- **搜尋詞**: `property tech`, `real estate saas`, `modern rental platform`
- **重點**: 找有創新設計風格的房地產平台

#### 3. **Data Visualization**
- **搜尋詞**: `data visualization dark`, `analytics dashboard neon`, `modern charts`
- **重點**: 找有豐富圖表和鮮明配色的設計

### 📝 v0.dev 提示詞（更新配色版）

#### 主要分析介面提示詞：
```
Create a modern property analysis dashboard with vibrant tech aesthetic:

Design System:
- Primary: Bright blue #0400ff
- Accent: Cyan #00ffcc  
- Interactive: Magenta #ff00c8
- Background: Light gray #f8f9fa
- Cards: Pure white #ffffff
- Typography: Outfit font family
- Radius: 0.5rem consistent
- Shadows: Subtle layered system

Layout Structure:
Header: White background, bright blue logo, modern navigation
Statistics: 4 cards with bright blue numbers, cyan trend arrows
Input Tabs: Blue active state, light blue inactive, magenta hover
Analysis Button: Blue to magenta gradient, prominent CTA
Property Cards: White cards, blue prices, magenta score rings, cyan tags
AI Sidebar: Blue to purple gradient background, white text
Filters: Magenta focus rings, cyan accent colors

Features:
- Hover effects with magenta borders
- Smooth transitions
- Modern geometric patterns
- Tech-inspired iconography
- High contrast for accessibility

Target: Professional rental analysis platform with futuristic appeal
Tech Stack: React + Tailwind CSS
Screen: Desktop 1440px
```

#### Dashboard 儀表板提示詞：
```
Create a futuristic property market dashboard:

Color Palette:
- Chart colors: Magenta #ff00c8, Purple #9000ff, Cyan #00e5ff, Mint #00ffcc, Yellow #ffe600
- Backgrounds: White cards on light gray #f8f9fa
- Accents: Bright blue #0400ff primary

Components:
- KPI cards with tech-style numbers
- Interactive charts with vibrant gradients
- AI insights panel with blue-purple gradient
- Heatmap with cyan-magenta gradient
- Modern data tables with alternating rows

Style: High-tech, vibrant, professional
Animations: Subtle hover effects, smooth transitions
```

### 🔍 尋找策略（更新版）

#### 在 v0.dev 的評估標準：
- ✅ **配色現代感**: 是否使用鮮明、高對比配色
- ✅ **科技美學**: 是否有漸層、霓虹效果、幾何圖案
- ✅ **互動設計**: 是否有豐富的hover、focus狀態
- ✅ **版面層次**: 是否有清晰的視覺層級
- ✅ **組件豐富**: 是否包含圖表、卡片、面板等

#### 如果需要客製化：
1. **選擇最接近的科技風設計**作為基礎
2. **強調配色要求**：使用完整的color variables
3. **重點描述**：
   - 鮮明的藍色 #0400ff 作為主色
   - 青綠色 #00ffcc 作為強調色  
   - 洋紅色 #ff00c8 作為互動色
   - 現代幾何美學
   - 高科技視覺效果

您現在可以在 v0.dev 中使用這些更新的提示詞和搜尋策略，這個新配色系統會讓您的智能房源分析平台具有非常現代化和專業的科技感！