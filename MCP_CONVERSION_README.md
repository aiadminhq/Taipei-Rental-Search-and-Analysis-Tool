# MCP 配置轉換說明

## 檔案說明

1. **`.mcp.json`** - Claude Code 相容配置檔案
2. **`claude_desktop_config_converted.json`** - Claude Desktop 相容配置檔案
3. **原始檔案**: `/Users/christianwu/Library/Application Support/Windsurf/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

## 主要轉換變更

### Claude Code 格式 (`.mcp.json`)
- ✅ 新增 `"type": "stdio"` 欄位
- ✅ 移除 `autoApprove`, `timeout`, `disabled` 欄位  
- ✅ 使用環境變數展開語法 `${VAR:-default}`
- ✅ 保留 `cwd` 工作目錄設定
- ✅ 啟用動態配置管理

### Claude Desktop 格式 (`claude_desktop_config_converted.json`)
- ✅ 移除 Claude Code 專用欄位
- ✅ 移除 `cwd` 欄位 (不支援)
- ✅ 使用靜態環境變數值
- ✅ 保持簡化的配置結構

## 使用方式

### Claude Code
```bash
# 檔案會自動被 Claude Code 偵測
# 位置: 專案根目錄/.mcp.json
```

### Claude Desktop
```bash
# 複製到 Claude Desktop 配置目錄:
# macOS: ~/Library/Application Support/Claude/claude_desktop_config.json
# Windows: %APPDATA%\Claude\claude_desktop_config.json
```

## 環境變數設定建議

建議在系統環境中設定以下變數:

```bash
export FIGMA_API_KEY="your_figma_api_key"
export GITHUB_PERSONAL_ACCESS_TOKEN="your_github_token"
export NOTION_TOKEN="your_notion_token"
export GITLAB_PERSONAL_ACCESS_TOKEN="your_gitlab_token"
export FIRECRAWL_API_KEY="your_firecrawl_key"
export MAGIC_API_KEY="your_magic_key"
```

## 安全性注意事項

⚠️ **重要**: 請更新配置檔案中的 API 金鑰為您自己的金鑰，避免使用範例中的預設值。

- 將敏感資訊設為環境變數
- 不要將包含 API 金鑰的檔案提交到版本控制系統
- 定期更新和輪換 API 金鑰