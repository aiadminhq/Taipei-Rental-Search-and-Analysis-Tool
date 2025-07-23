- 然後先透過Calude Code生成UX Pilot生成ui看看。如果桌面版並且是完整功能的版本，我需要提示語：1.New Design File的要有幾個pages?每個Page Name, Page Context 2.進入畫面有會問我要打什麼Context，這邊我很困惑。看完底下資料請詳細的跟我說我要填寫什麼資訊。
  請參考我請gemini讀取他教學影片重點，並且也把底下資訊加到你對於ux pilot的知識庫：

### UX Pilot Prompts 內容要點

#### 主要論點：
*   **簡單提示詞產生通用結果：** 使用如「一個銷售膠合板凳子的公司網站」等簡單提示詞，AI 只能生成一個通用、缺乏品牌細節的版面。
*   **AI 增強提示詞可提供結構，但可能不符需求：** 使用工具內建的「增強提示詞」功能，雖能自動生成結構化提示詞，但其內容（如頁面類型）可能與設計師的具體目標不符。
*   **詳細且結構化的提示詞是成功的關鍵：** 提供一個包含明確頁面目標、分區塊 (Sections) 內容、甚至具體文案和功能的詳細提示詞，是讓 AI 生成最精確、最符合需求設計的最佳方法。
*   **結合手動與 AI 增強的工作流程 ：** 一個高效的工作流程是，先手動編寫詳細的提示詞，再利用 AI 的「增強」功能對其進行優化和精簡，這可以使提示詞更簡潔並補充設計師可能忽略的細節（如色彩樣式）。
*   **迭代與節省資源的策略：** 在使用 AI 工具時，建議一次只生成一個畫面，根據結果進行迭代和調整，而不是一次生成多個版本。這不僅能更精準地控制設計方向，還能有效節省生成所需的時間與點數 (credits)。

#### 關鍵技術／名詞：
*   UX-Pilot
*   Figma
*   UI Design
*   AI Generator
*   Prompt Engineering
*   High-fidelity (Hifi) Designs
*   Wireframes
*   Design System

#### 核心關鍵字：
*   AI
*   Prompt
*   UI Design
*   UX-Pilot
*   Figma

### 4. 延伸議題：
1.  當 AI 生成的設計包含多個頁面（如首頁、產品頁、結帳頁）時，如何編寫提示詞以確保所有頁面之間風格、佈局和品牌元素的一致性？
2.  除了結構和內容，還有哪些「無形」的設計元素（如品牌調性、情感體驗、用戶旅程）可以被有效地轉化為提示詞，並讓 AI 理解與執行？
3.  在團隊協作中，如何建立一套標準化的提示詞撰寫指南或模板，以確保不同設計師在使用 AI 工具時能產出風格統一且高品質的設計稿？

5.  

---

### ✍️ # 提示詞技巧與範例

影片中展示了從簡單到複雜的提示詞演進過程，以下是關鍵的提示詞範例：

#### 1. 簡單提示詞 (Simple Prompt) (02:12)
這個提示詞只給出了最基本的概念，導致結果非常通用。

*   **英文原文:** `A website app for a company that sells plywood stools.`
*   **中文翻譯:** `一個為銷售膠合板凳子的公司設計的網站應用程式。`

#### 2. AI 增強後的提示詞 (Enhanced Prompt) (02:59)
這是使用 UX-Pilot 內建功能對簡單提示詞進行增強後的結果，結構更完整，但內容未必是我們想要的。

*   **英文原文:**
    ```
    Name/Context: Plywood Perch - Shopping & Checkout Screen
    UI Components:
    - Product Gallery: Grid layout, 3 columns, hover zoom effect
    - Details Panel: Right sidebar featuring product descriptions and customer reviews
    - Cart Overview: Fixed bottom panel with checkout button
    Styling Details:
    - Primary Colors: Earthy tones with natural beige (#F5F5DC), deep brown (#4E342E) accents.
    - Spacing: 20px component spacing for readability and flow
    - Border Rounding: 10px on images and buttons for softness.
    ```
*   **中文翻譯:**
    ```
    名稱/情境：Plywood Perch - 購物與結帳畫面
    UI 組件：
    - 產品畫廊：網格佈局，3 欄，懸停縮放效果
    - 細節面板：右側邊欄，包含產品描述和客戶評論
    - 購物車概覽：帶有結帳按鈕的固定底部面板
    樣式細節：
    - 主色：帶有自然米色 (#F5F5DC) 和深棕色 (#4E342E) 的大地色調。
    - 間距：20px 的組件間距，以提高可讀性和流暢度
    - 邊框圓角：圖片和按鈕使用 10px 圓角，以營造柔和感。
    ```

#### 3. 設計師手動編寫的詳細提示詞 (Better Prompt) (04:02)
這是影片的重點，一個結構清晰、內容豐富的提示詞，能最大程度地引導 AI。

*   **英文原文 (結構摘要):**
    ```
    Home Page for a Plywood Stool E-commerce Website
    This Home Page serves as the welcoming entry point...
    
    Sections
    1. Header & Navigation
       - Logo & Brand Name (e.g., "PlyCraft Stools")
       - Navigation Menu: Home, Store, About Us, Blog...
       - Search Bar
    2. Hero Section - Introducing Our Plywood Stools
       - Large Hero Image
       - Tagline: "Handcrafted Plywood Stools – Timeless, Sustainable, and Designed for Modern Living."
       - Call-to-Action (CTA) Buttons: Shop Now, Discover Our Story
    3. Why Choose Us? - Unique Selling Points
       - Sustainable Materials, Handcrafted Quality...
    4. Featured Products - Best Sellers
       - Showcase 3-4 top-selling stools with images, short descriptions, and price.
    5. Our Story - Meet the Makers
       - A small team with a big vision...
    6. Customer Reviews
       - "Finally, a stylish stool that's also eco-friendly..."
    7. Footer - Stay Connected
       - Newsletter Signup, Social Media Links, Quick Links...
    ```
*   **中文翻譯 (結構摘要):**
    ```
    膠合板凳電商網站首頁
    此首頁作為歡迎的入口點...
    
    區塊
    1. 頁首與導航
       - Logo 與品牌名稱 (例如 "PlyCraft Stools")
       - 導航菜單：首頁、商店、關於我們、部落格...
       - 搜尋列
    2. 英雄區塊 - 介紹我們的膠合板凳
       - 大型英雄圖片
       - 標語：「手工製作的膠合板凳 – 永恆、可持續，為現代生活而設計。」
       - 行動呼籲 (CTA) 按鈕：立即購物、探索我們的故事
    3. 為何選擇我們？ - 獨特賣點
       - 可持續材料、手工品質...
    4. 特色產品 - 暢銷品
       - 展示 3-4 款暢銷凳子，附圖片、簡短描述和價格。
    5. 我們的故事 - 認識製作者
       - 一個懷有遠大願景的小團隊...
    6. 客戶評論
       - 「終於有了一款既時尚又環保的凳子...」
    7. 頁尾 - 保持聯繫
       - 電子報註冊、社群媒體連結、快速連結...
    ```

