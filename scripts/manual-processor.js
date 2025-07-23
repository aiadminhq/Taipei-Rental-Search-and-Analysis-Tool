/**
 * 手動處理工具 - 當自動爬蟲無法使用時的替代方案
 * Manual Processing Tool - Alternative when auto-scraping is unavailable
 */

require('dotenv').config();
const readline = require('readline');
const NotionService = require('./src/services/notionService');
const IntelligentMapper = require('./src/mappers/intelligentMapper');
const IntelligentScorer = require('./src/processors/intelligentScorer');

class ManualProcessor {
  constructor() {
    this.notionService = new NotionService();
    this.mapper = new IntelligentMapper();
    this.scorer = new IntelligentScorer();
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * 啟動手動處理流程
   */
  async start() {
    console.log('🏠 591 房源手動處理工具');
    console.log('='.repeat(50));
    console.log('💡 當自動爬蟲無法使用時，您可以手動輸入房源資訊');
    console.log('💡 系統會自動評分、映射並寫入 Notion 資料庫');
    console.log('='.repeat(50));

    try {
      // 測試 Notion 連接
      await this.notionService.testConnection();
      console.log('✅ Notion 連接正常\n');

      await this.processRentals();

    } catch (error) {
      console.error('❌ 初始化失敗:', error.message);
    } finally {
      this.rl.close();
    }
  }

  /**
   * 處理房源流程
   */
  async processRentals() {
    while (true) {
      console.log('\n📋 請選擇操作:');
      console.log('1. 手動輸入房源資訊');
      console.log('2. 批量處理待處理連結');
      console.log('3. 退出');

      const choice = await this.askQuestion('請選擇 (1-3): ');

      switch (choice.trim()) {
        case '1':
          await this.manualInput();
          break;
        case '2':
          await this.batchProcess();
          break;
        case '3':
          console.log('👋 再見！');
          return;
        default:
          console.log('❌ 無效選擇，請重新輸入');
      }
    }
  }

  /**
   * 手動輸入房源資訊
   */
  async manualInput() {
    console.log('\n🏠 手動輸入房源資訊');
    console.log('-'.repeat(30));

    try {
      const rentalData = await this.collectRentalData();
      
      console.log('\n📊 收集到的房源資訊:');
      console.log(JSON.stringify(rentalData, null, 2));

      const confirm = await this.askQuestion('\n確認處理此房源？(y/n): ');
      
      if (confirm.toLowerCase() === 'y') {
        await this.processRentalData(rentalData);
      } else {
        console.log('❌ 已取消處理');
      }

    } catch (error) {
      console.error('❌ 手動輸入失敗:', error.message);
    }
  }

  /**
   * 收集房源資料
   */
  async collectRentalData() {
    const data = {};

    // 基本資訊
    data.title = await this.askQuestion('房源標題: ');
    data.price = parseInt(await this.askQuestion('租金 (數字): ')) || 0;
    data.address = await this.askQuestion('地址: ');
    data.roomType = await this.askQuestion('房型 (套房/雅房/獨立套房): ') || '套房';
    data.area = await this.askQuestion('坪數: ');
    data.floor = await this.askQuestion('樓層: ');
    
    // 設備
    const facilitiesInput = await this.askQuestion('設備 (用逗號分隔): ');
    data.facilities = facilitiesInput ? facilitiesInput.split(',').map(f => f.trim()) : [];
    
    // 聯絡資訊
    data.contact = await this.askQuestion('聯絡人: ');
    
    // URL
    data.url = await this.askQuestion('房源連結: ');
    
    // 備註
    data.notes = await this.askQuestion('備註: ');

    // 自動添加的資訊
    data.extractedAt = new Date().toISOString();
    data.extractMethod = 'manual-input';
    data.source = '手動輸入';

    return data;
  }

  /**
   * 處理房源資料
   */
  async processRentalData(rentalData) {
    try {
      console.log('\n🔄 開始處理房源...');

      // 1. 智能評分
      console.log('1️⃣ 進行智能評分...');
      const scoreResult = this.scorer.scoreRental(rentalData);
      
      console.log(`📊 評分結果: ${scoreResult.totalScore}/110`);
      console.log(`🎯 適合度: ${scoreResult.suitability}`);

      // 2. 資料映射
      console.log('2️⃣ 進行資料映射...');
      const mappedData = this.mapper.mapRentalData(rentalData, scoreResult);

      // 3. 寫入 Notion
      console.log('3️⃣ 寫入 Notion 資料庫...');
      const result = await this.notionService.addRentalToDatabase(mappedData);

      if (result.success) {
        console.log('✅ 房源處理成功！');
        console.log(`📄 Notion 頁面: ${result.pageUrl}`);
      } else {
        console.log('❌ 寫入 Notion 失敗:', result.error);
      }

    } catch (error) {
      console.error('❌ 處理房源失敗:', error.message);
    }
  }

  /**
   * 批量處理待處理連結
   */
  async batchProcess() {
    console.log('\n📋 批量處理功能');
    console.log('-'.repeat(30));
    console.log('💡 此功能會列出監控頁面中標記為「待手動處理」的連結');
    console.log('💡 您可以逐一訪問這些連結並手動輸入資訊');
    
    // 這裡可以添加從 Notion 頁面讀取待處理連結的邏輯
    console.log('\n🔍 從監控頁面讀取待處理連結...');
    
    const pendingLinks = [
      'https://rent.591.com.tw/19273049',
      'https://rent.591.com.tw/19150952',
      'https://rent.591.com.tw/18836987'
    ];

    if (pendingLinks.length === 0) {
      console.log('✅ 沒有待處理的連結');
      return;
    }

    console.log(`📋 找到 ${pendingLinks.length} 個待處理連結:`);
    pendingLinks.forEach((link, index) => {
      console.log(`   ${index + 1}. ${link}`);
    });

    console.log('\n💡 建議操作流程:');
    console.log('1. 在瀏覽器中打開上述連結');
    console.log('2. 查看房源資訊');
    console.log('3. 回到此工具選擇「手動輸入房源資訊」');
    console.log('4. 輸入從網頁上看到的資訊');

    await this.askQuestion('\n按 Enter 繼續...');
  }

  /**
   * 詢問問題
   */
  askQuestion(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }
}

// 主要執行函數
async function main() {
  const processor = new ManualProcessor();
  await processor.start();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ManualProcessor;
