#!/bin/bash

# 591 Notion 自動化系統 - Firecrawl 整合啟動腳本
# Start script for 591 Notion Automation System with Firecrawl integration

echo "🔥 啟動 591 Notion 自動化系統 - Firecrawl 整合版"
echo "=================================================="

# 檢查 Node.js 版本
echo "📋 檢查系統需求..."
node_version=$(node -v)
echo "Node.js 版本: $node_version"

if ! command -v node &> /dev/null; then
    echo "❌ 錯誤: 未找到 Node.js，請先安裝 Node.js"
    exit 1
fi

# 檢查環境變數檔案
if [ ! -f ".env" ]; then
    echo "⚠️  警告: 未找到 .env 檔案"
    echo "📝 正在從 .env.example 建立 .env 檔案..."
    cp .env.example .env
    echo "✅ .env 檔案已建立，請編輯並填入正確的 API 金鑰"
    echo ""
fi

# 檢查必要的環境變數
echo "🔑 檢查環境變數..."
source .env

if [ -z "$FIRECRAWL_API_KEY" ]; then
    echo "❌ 錯誤: FIRECRAWL_API_KEY 未設定"
    echo "請在 .env 檔案中設定 FIRECRAWL_API_KEY"
    exit 1
fi

if [ -z "$NOTION_API_KEY" ]; then
    echo "❌ 錯誤: NOTION_API_KEY 未設定"
    echo "請在 .env 檔案中設定 NOTION_API_KEY"
    exit 1
fi

if [ -z "$NOTION_DATABASE_ID" ]; then
    echo "❌ 錯誤: NOTION_DATABASE_ID 未設定"
    echo "請在 .env 檔案中設定 NOTION_DATABASE_ID"
    exit 1
fi

echo "✅ 環境變數檢查完成"

# 檢查依賴套件
echo "📦 檢查依賴套件..."
if [ ! -d "node_modules" ]; then
    echo "📥 安裝依賴套件..."
    npm install
fi

# 建立日誌目錄
echo "📁 建立日誌目錄..."
mkdir -p logs

# 檢查 Firecrawl MCP 套件
echo "🔥 檢查 Firecrawl MCP 套件..."
if ! npx -y firecrawl-mcp --version &> /dev/null; then
    echo "❌ 錯誤: 無法執行 firecrawl-mcp"
    echo "請檢查網路連接和 npm 配置"
    exit 1
fi

echo "✅ Firecrawl MCP 套件檢查完成"

# 執行系統測試
echo ""
echo "🧪 執行系統測試..."
echo "1. 測試 Firecrawl 整合..."
node test-firecrawl-integration.js

if [ $? -ne 0 ]; then
    echo "❌ Firecrawl 整合測試失敗"
    echo "請檢查 API 金鑰和網路連接"
    exit 1
fi

echo ""
echo "2. 測試 MCP 客戶端..."
timeout 30s node examples/firecrawlMcpClient.js &
MCP_CLIENT_PID=$!

# 啟動 MCP 服務器
echo ""
echo "🚀 啟動 MCP 服務器..."
npm run mcp &
MCP_SERVER_PID=$!

# 等待服務器啟動
echo "⏳ 等待服務器啟動..."
sleep 5

# 檢查服務器狀態
echo "📡 檢查服務器狀態..."
if curl -s http://localhost:3001/mcp/status > /dev/null; then
    echo "✅ MCP 服務器啟動成功"
else
    echo "❌ MCP 服務器啟動失敗"
    kill $MCP_SERVER_PID 2>/dev/null
    exit 1
fi

# 顯示服務資訊
echo ""
echo "🎉 系統啟動完成！"
echo "=================================================="
echo "📊 服務資訊:"
echo "   - MCP 服務器: http://localhost:3001"
echo "   - 健康檢查: http://localhost:3001/health"
echo "   - 服務狀態: http://localhost:3001/mcp/status"
echo ""
echo "📚 可用的 API 接口:"
echo "   - POST /mcp/firecrawl/scrape - 基本網頁抓取"
echo "   - POST /mcp/firecrawl/extract-591 - 591 房源提取"
echo "   - POST /mcp/firecrawl/batch-scrape - 批量抓取"
echo "   - POST /mcp/process-rental - 處理房源資料"
echo ""
echo "📝 日誌檔案:"
echo "   - Firecrawl: logs/firecrawl.log"
echo "   - MCP 服務器: logs/mcp-server.log"
echo "   - 應用程式: logs/app.log"
echo ""
echo "🛠️  管理指令:"
echo "   - 查看日誌: npm run logs"
echo "   - 測試 Firecrawl: npm run test:firecrawl"
echo "   - MCP 客戶端示範: npm run example:firecrawl"
echo ""
echo "按 Ctrl+C 停止服務器"

# 等待用戶中斷
wait $MCP_SERVER_PID
