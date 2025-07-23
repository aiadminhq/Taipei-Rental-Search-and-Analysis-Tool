/**
 * Firecrawl MCP 客戶端範例
 * Example client for Firecrawl MCP integration
 */

const axios = require('axios');

class FirecrawlMCPClient {
  constructor(baseUrl = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * 檢查 MCP 服務器狀態
   */
  async checkStatus() {
    try {
      const response = await this.client.get('/mcp/status');
      return response.data;
    } catch (error) {
      throw new Error(`Status check failed: ${error.message}`);
    }
  }

  /**
   * 使用 Firecrawl 抓取網頁
   */
  async scrapeUrl(url, options = {}) {
    try {
      const response = await this.client.post('/mcp/firecrawl/scrape', {
        url,
        options
      });
      return response.data;
    } catch (error) {
      throw new Error(`Scrape failed: ${error.message}`);
    }
  }

  /**
   * 提取 591 房源資料
   */
  async extract591Rental(url, processToNotion = false) {
    try {
      const response = await this.client.post('/mcp/firecrawl/extract-591', {
        url,
        processToNotion
      });
      return response.data;
    } catch (error) {
      throw new Error(`591 extraction failed: ${error.message}`);
    }
  }

  /**
   * 批量抓取網頁
   */
  async batchScrape(urls, options = {}) {
    try {
      const response = await this.client.post('/mcp/firecrawl/batch-scrape', {
        urls,
        options
      });
      return response.data;
    } catch (error) {
      throw new Error(`Batch scrape failed: ${error.message}`);
    }
  }

  /**
   * 處理房源（傳統方式）
   */
  async processRental(rentalData, options = {}) {
    try {
      const response = await this.client.post('/mcp/process-rental', {
        rentalData,
        options
      });
      return response.data;
    } catch (error) {
      throw new Error(`Process rental failed: ${error.message}`);
    }
  }
}

// 使用範例
async function demonstrateFirecrawlMCP() {
  console.log('🔥 Firecrawl MCP 客戶端示範\n');

  const client = new FirecrawlMCPClient();

  try {
    // 1. 檢查服務狀態
    console.log('📡 檢查 MCP 服務器狀態...');
    const status = await client.checkStatus();
    console.log('✅ 服務狀態:', status.status);
    console.log('🔧 服務列表:');
    Object.entries(status.services).forEach(([service, state]) => {
      console.log(`   - ${service}: ${state}`);
    });
    console.log('');

    // 2. 基本網頁抓取示範
    console.log('🌐 基本網頁抓取示範...');
    const scrapeResult = await client.scrapeUrl('https://example.com', {
      formats: ['markdown'],
      onlyMainContent: true
    });
    
    if (scrapeResult.success) {
      console.log('✅ 抓取成功');
      console.log('📄 內容預覽:', scrapeResult.data?.markdown?.substring(0, 200) + '...');
    } else {
      console.log('❌ 抓取失敗:', scrapeResult.error);
    }
    console.log('');

    // 3. 591 房源提取示範（使用模擬資料）
    console.log('🏠 591 房源提取示範...');
    
    // 注意：請替換為真實的 591 房源 URL
    const mock591Url = 'https://rent.591.com.tw/home/14123456';
    console.log('⚠️  使用模擬 URL:', mock591Url);
    
    try {
      const extractResult = await client.extract591Rental(mock591Url, false);
      
      if (extractResult.success) {
        console.log('✅ 591 資料提取成功');
        console.log('📋 提取結果:');
        console.log('   - 標題:', extractResult.extracted?.title || 'N/A');
        console.log('   - 價格:', extractResult.extracted?.price || 'N/A');
        console.log('   - 地點:', extractResult.extracted?.location || 'N/A');
      } else {
        console.log('❌ 591 資料提取失敗:', extractResult.error);
      }
    } catch (error) {
      console.log('⚠️  591 提取測試跳過（可能需要真實 URL）:', error.message);
    }
    console.log('');

    // 4. 批量抓取示範
    console.log('📦 批量抓取示範...');
    const testUrls = [
      'https://httpbin.org/json',
      'https://httpbin.org/html'
    ];
    
    const batchResult = await client.batchScrape(testUrls, {
      batchSize: 2,
      delay: 1000
    });
    
    if (batchResult.success) {
      console.log('✅ 批量抓取完成');
      console.log('📊 統計結果:');
      console.log('   - 總數:', batchResult.summary.total);
      console.log('   - 成功:', batchResult.summary.successful);
      console.log('   - 失敗:', batchResult.summary.failed);
    }
    console.log('');

    console.log('🎉 Firecrawl MCP 示範完成！');
    console.log('');
    console.log('💡 使用提示:');
    console.log('1. 確保 MCP 服務器正在運行 (npm run mcp)');
    console.log('2. 設定正確的 FIRECRAWL_API_KEY 環境變數');
    console.log('3. 使用真實的 591 房源 URL 進行實際測試');
    console.log('4. 監控 API 使用量以避免超出限制');

  } catch (error) {
    console.error('❌ 示範過程中發生錯誤:', error.message);
    console.error('🔍 請檢查:');
    console.error('   - MCP 服務器是否正在運行');
    console.error('   - 網路連接是否正常');
    console.error('   - API 金鑰是否正確設定');
  }
}

// 執行示範
if (require.main === module) {
  demonstrateFirecrawlMCP();
}

module.exports = { FirecrawlMCPClient, demonstrateFirecrawlMCP };
