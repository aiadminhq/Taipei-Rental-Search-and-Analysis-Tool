#!/bin/bash
set -e

echo "🚀 準備啟動 Serena MCP 伺服器..."

# 確保在正確的工作目錄
cd /mnt/persist/workspace

# 確保 uv 在 PATH 中
export PATH="$HOME/.local/bin:$PATH"

echo "📋 Serena MCP 伺服器啟動選項："
echo ""
echo "1. 📡 SSE 模式（推薦用於手動啟動）:"
echo "   uv run serena-mcp-server --transport sse --port 9121 --host 0.0.0.0"
echo ""
echo "2. 📊 SSE 模式 + Web Dashboard:"
echo "   uv run serena-mcp-server --transport sse --port 9121 --enable-web-dashboard true"
echo ""
echo "3. 💻 STDIO 模式（用於 MCP 客戶端）:"
echo "   uv run serena-mcp-server"
echo ""
echo "4. 🎯 指定專案啟動:"
echo "   uv run serena-mcp-server --project /path/to/your/project"
echo ""

echo "🔧 建立範例配置檔案..."

# 建立 serena 配置目錄（如果不存在）
mkdir -p .serena

# 建立範例專案配置檔案
if [ ! -f ".serena/project.yml" ]; then
    cat > .serena/project.yml << 'EOF'
# Serena 專案配置檔案
project_name: "serena-development"
language: python
ignore_all_files_in_gitignore: true
ignored_paths: []
read_only: false
initial_prompt: "這是 Serena 開發專案，一個強大的程式碼代理工具包。"
encoding: "utf-8"
EOF
    echo "✅ 建立專案配置檔案: .serena/project.yml"
fi

echo ""
echo "🎯 現在您可以選擇以下方式啟動伺服器："
echo ""
echo "A. 🌐 啟動 SSE 模式伺服器（推薦）:"
echo "   uv run serena-mcp-server --transport sse --port 9121 --enable-web-dashboard true"
echo ""
echo "B. 📱 啟動 STDIO 模式（用於 MCP 客戶端整合）:"
echo "   uv run serena-mcp-server"
echo ""
echo "C. 🎯 啟動並載入當前專案:"
echo "   uv run serena-mcp-server --project . --transport sse --port 9121"
echo ""

echo "✅ 準備完成！請選擇您想要的啟動模式。"