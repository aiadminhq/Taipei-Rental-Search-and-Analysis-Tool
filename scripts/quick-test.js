/**
 * 快速測試腳本 - 驗證 Firecrawl 整合
 * Quick test script to verify Firecrawl integration
 */

require('dotenv').config();

async function quickTest() {
  console.log('🚀 快速測試 - Firecrawl 整合驗證\n');

  // 測試 1: 環境變數檢查
  console.log('1️⃣ 檢查環境變數...');
  const requiredEnvVars = [
    'FIRECRAWL_API_KEY',
    'NOTION_API_KEY', 
    'NOTION_DATABASE_ID'
  ];

  let envCheckPassed = true;
  requiredEnvVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`   ✅ ${varName}: 已設定`);
    } else {
      console.log(`   ❌ ${varName}: 未設定`);
      envCheckPassed = false;
    }
  });

  if (!envCheckPassed) {
    console.log('\n❌ 環境變數檢查失敗，請檢查 .env 檔案');
    return;
  }

  // 測試 2: 模組載入檢查
  console.log('\n2️⃣ 檢查模組載入...');
  try {
    const FirecrawlService = require('./src/services/firecrawlService');
    console.log('   ✅ FirecrawlService 載入成功');
    
    const MCPServer = require('./src/mcp/mcpServer');
    console.log('   ✅ MCPServer 載入成功');
    
    const NotionService = require('./src/services/notionService');
    console.log('   ✅ NotionService 載入成功');
  } catch (error) {
    console.log('   ❌ 模組載入失敗:', error.message);
    return;
  }

  // 測試 3: Firecrawl 服務初始化
  console.log('\n3️⃣ 測試 Firecrawl 服務初始化...');
  try {
    const FirecrawlService = require('./src/services/firecrawlService');
    const firecrawl = new FirecrawlService();
    console.log('   ✅ Firecrawl 服務初始化成功');
    
    // 測試連接
    await firecrawl.testConnection();
    console.log('   ✅ Firecrawl API 連接測試成功');
  } catch (error) {
    console.log('   ❌ Firecrawl 服務測試失敗:', error.message);
    console.log('   💡 請檢查 FIRECRAWL_API_KEY 是否正確');
    return;
  }

  // 測試 4: Notion 服務檢查
  console.log('\n4️⃣ 測試 Notion 服務...');
  try {
    const NotionService = require('./src/services/notionService');
    const notion = new NotionService();
    await notion.testConnection();
    console.log('   ✅ Notion API 連接測試成功');
  } catch (error) {
    console.log('   ❌ Notion 服務測試失敗:', error.message);
    console.log('   💡 請檢查 NOTION_API_KEY 和 NOTION_DATABASE_ID 是否正確');
    return;
  }

  // 測試 5: MCP 服務器初始化
  console.log('\n5️⃣ 測試 MCP 服務器初始化...');
  try {
    const MCPServer = require('./src/mcp/mcpServer');
    const mcpServer = new MCPServer();
    console.log('   ✅ MCP 服務器初始化成功');
    
    // 不實際啟動服務器，只測試初始化
    console.log('   ✅ 所有服務整合正常');
  } catch (error) {
    console.log('   ❌ MCP 服務器初始化失敗:', error.message);
    return;
  }

  // 測試完成
  console.log('\n🎉 快速測試完成！');
  console.log('\n📋 測試結果摘要:');
  console.log('   ✅ 環境變數配置正確');
  console.log('   ✅ 所有模組載入成功');
  console.log('   ✅ Firecrawl API 連接正常');
  console.log('   ✅ Notion API 連接正常');
  console.log('   ✅ MCP 服務器整合完成');
  
  console.log('\n🚀 下一步操作:');
  console.log('   1. 啟動完整系統: ./start-firecrawl-system.sh');
  console.log('   2. 執行詳細測試: npm run test:firecrawl');
  console.log('   3. 啟動 MCP 服務器: npm run mcp');
  console.log('   4. 測試 MCP 客戶端: npm run example:firecrawl');
}

// 執行測試
if (require.main === module) {
  quickTest().catch(error => {
    console.error('\n❌ 快速測試失敗:', error.message);
    process.exit(1);
  });
}

module.exports = { quickTest };
