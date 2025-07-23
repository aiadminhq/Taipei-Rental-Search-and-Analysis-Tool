/**
 * Notion 頁面監控主程式 - 完整的自動化監控系統
 * Notion Page Monitor Main App - Complete automated monitoring system
 */

require('dotenv').config();
const winston = require('winston');
const cron = require('node-cron');
const { Client } = require('@notionhq/client');
const AutoProcessor = require('./processors/autoProcessor');

class NotionMonitorApp {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });
    
    this.autoProcessor = new AutoProcessor();
    
    // 監控配置
    this.config = {
      targetPageId: '22cb86cbe9ad80a18fbcca277054512a',
      databaseId: process.env.NOTION_DATABASE_ID,
      checkInterval: '*/5 * * * *', // 每 5 分鐘檢查一次
      signature: 'Augment Agent 🤖',
      minScore: 60
    };
    
    // 已處理的連結記錄
    this.processedLinks = new Set();
    this.lastCheck = null;
    
    // 設定日誌
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
            })
          )
        }),
        new winston.transports.File({ filename: 'logs/monitor-app.log' })
      ]
    });

    // 監控統計
    this.stats = {
      totalChecks: 0,
      linksFound: 0,
      linksProcessed: 0,
      successfulProcessing: 0,
      startTime: new Date()
    };
  }

  /**
   * 啟動監控系統
   */
  async start() {
    try {
      this.logger.info('🚀 啟動 Notion 頁面監控系統');
      this.logger.info(`📄 監控目標: https://www.notion.so/${this.config.targetPageId}`);
      this.logger.info(`🗄️ 目標資料庫: ${this.config.databaseId}`);
      this.logger.info(`⏰ 檢查間隔: ${this.config.checkInterval}`);
      this.logger.info(`🎯 最低分數門檻: ${this.config.minScore}`);

      // 驗證 Notion 連接
      await this.validateNotionConnection();

      // 初始化已處理連結
      await this.initializeProcessedLinks();

      // 立即執行一次檢查
      await this.performCheck();

      // 設定定時監控
      this.setupScheduledMonitoring();

      // 設定優雅關閉
      this.setupGracefulShutdown();

      this.logger.info('✅ 監控系統啟動成功');
      this.displaySystemInfo();

    } catch (error) {
      this.logger.error('❌ 監控系統啟動失敗', { error: error.message });
      throw error;
    }
  }

  /**
   * 驗證 Notion 連接
   */
  async validateNotionConnection() {
    try {
      // 測試目標頁面訪問
      await this.notion.pages.retrieve({
        page_id: this.config.targetPageId
      });

      // 測試資料庫訪問
      await this.notion.databases.retrieve({
        database_id: this.config.databaseId
      });

      this.logger.info('✅ Notion 連接驗證成功');
    } catch (error) {
      throw new Error(`Notion 連接驗證失敗: ${error.message}`);
    }
  }

  /**
   * 初始化已處理連結
   */
  async initializeProcessedLinks() {
    try {
      this.logger.info('🔄 初始化已處理連結清單...');
      
      // 從資料庫獲取所有已存在的連結
      const response = await this.notion.databases.query({
        database_id: this.config.databaseId
      });

      for (const page of response.results) {
        const url = page.properties['網頁連結']?.url || page.properties['網址']?.url;
        if (url) {
          this.processedLinks.add(url);
        }
      }

      this.logger.info(`📋 已載入 ${this.processedLinks.size} 個已處理的連結`);
    } catch (error) {
      this.logger.error('❌ 初始化已處理連結失敗', { error: error.message });
    }
  }

  /**
   * 執行檢查
   */
  async performCheck() {
    try {
      this.stats.totalChecks++;
      this.lastCheck = new Date();
      
      this.logger.info(`🔍 開始第 ${this.stats.totalChecks} 次檢查...`);

      // 獲取頁面內容
      const blocks = await this.getPageBlocks();
      
      // 提取連結
      const links = this.extractLinksFromBlocks(blocks);
      this.stats.linksFound += links.length;
      
      this.logger.info(`🔗 發現 ${links.length} 個連結`);

      // 篩選新連結
      const newLinks = links.filter(link => !this.processedLinks.has(link.url));
      
      if (newLinks.length > 0) {
        this.logger.info(`🆕 發現 ${newLinks.length} 個新連結`);
        
        for (const link of newLinks) {
          await this.processNewLink(link);
        }
      } else {
        this.logger.info('ℹ️ 沒有發現新連結');
      }

      // 更新監控頁面
      await this.updateMonitoringPage();

    } catch (error) {
      this.logger.error('❌ 執行檢查失敗', { error: error.message });
    }
  }

  /**
   * 獲取頁面區塊
   */
  async getPageBlocks() {
    try {
      const response = await this.notion.blocks.children.list({
        block_id: this.config.targetPageId
      });
      
      return response.results;
    } catch (error) {
      this.logger.error('❌ 獲取頁面區塊失敗', { error: error.message });
      return [];
    }
  }

  /**
   * 從區塊中提取連結 - 改進版，支援更多區塊類型
   */
  extractLinksFromBlocks(blocks) {
    const links = [];

    for (const block of blocks) {
      // 處理段落區塊中的連結
      if (block.type === 'paragraph' && block.paragraph?.rich_text) {
        for (const text of block.paragraph.rich_text) {
          if (text.href && this.is591Link(text.href)) {
            links.push({
              url: text.href,
              text: text.plain_text,
              type: 'paragraph',
              blockId: block.id
            });
          }
        }
      }

      // 處理書籤區塊
      if (block.type === 'bookmark' && block.bookmark?.url && this.is591Link(block.bookmark.url)) {
        links.push({
          url: block.bookmark.url,
          text: block.bookmark.caption?.[0]?.plain_text || '',
          type: 'bookmark',
          blockId: block.id
        });
      }

      // 處理嵌入區塊
      if (block.type === 'embed' && block.embed?.url && this.is591Link(block.embed.url)) {
        links.push({
          url: block.embed.url,
          text: block.embed.caption?.[0]?.plain_text || '',
          type: 'embed',
          blockId: block.id
        });
      }

      // 處理連結預覽區塊
      if (block.type === 'link_preview' && block.link_preview?.url && this.is591Link(block.link_preview.url)) {
        links.push({
          url: block.link_preview.url,
          text: '',
          type: 'link_preview',
          blockId: block.id
        });
      }

      // 處理表格中的連結
      if (block.type === 'table') {
        // 表格需要額外的 API 調用來獲取行內容
        // 這裡先記錄，後續可以擴展
        this.logger.info('📋 發現表格區塊，可能包含連結');
      }

      // 處理列表項目中的連結
      if ((block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') &&
          block[block.type]?.rich_text) {
        for (const text of block[block.type].rich_text) {
          if (text.href && this.is591Link(text.href)) {
            links.push({
              url: text.href,
              text: text.plain_text,
              type: block.type,
              blockId: block.id
            });
          }
        }
      }
    }

    return links;
  }

  /**
   * 檢查是否為 591 連結 - 改進版，更寬鬆的檢測
   */
  is591Link(url) {
    // 更寬鬆的 591 連結檢測
    return url.includes('591.com.tw');
  }

  /**
   * 處理新連結
   */
  async processNewLink(link) {
    try {
      this.stats.linksProcessed++;
      this.logger.info(`🔄 處理新連結: ${link.url}`);

      // 使用自動處理器處理連結
      const result = await this.autoProcessor.processLink(link.url, {
        minScore: this.config.minScore,
        signature: this.config.signature,
        source: '頁面監控系統',
        sourcePageId: this.config.targetPageId
      });

      if (result.success) {
        this.stats.successfulProcessing++;
        this.processedLinks.add(link.url);
        
        // 在監控頁面添加成功記錄
        await this.addProcessingRecord(link, result, '成功');
        
        this.logger.info(`✅ 成功處理連結: ${link.url} -> 頁面 ID: ${result.notionPageId}`);
      } else {
        // 檢查是否為網路錯誤，如果是則標記為待手動處理
        const isNetworkError = result.error && result.error.includes('net::ERR_');
        const status = isNetworkError ? '待手動處理 (自動爬蟲暫時無法使用)' : (result.reason || '失敗');

        // 在監控頁面添加記錄
        await this.addProcessingRecord(link, result, status);

        this.logger.warn(`⚠️ 連結處理失敗: ${link.url} - ${result.reason || result.error}`);
      }

    } catch (error) {
      this.logger.error(`❌ 處理新連結失敗: ${link.url}`, { error: error.message });
      
      // 在監控頁面添加錯誤記錄
      await this.addProcessingRecord(link, null, `錯誤: ${error.message}`);
    }
  }

  /**
   * 添加處理記錄到監控頁面
   */
  async addProcessingRecord(link, result, status) {
    try {
      const timestamp = new Date().toLocaleString('zh-TW');
      const statusEmoji = status === '成功' ? '✅' :
                         status.includes('錯誤') ? '❌' :
                         status.includes('待手動處理') ? '📋' : '⚠️';
      
      let recordText = `${statusEmoji} ${status} | ${link.url} | ${timestamp} | ${this.config.signature}`;
      
      if (result && result.notionPageId) {
        recordText += ` | 資料庫頁面: https://www.notion.so/${result.notionPageId}`;
      }
      
      if (result && result.score) {
        recordText += ` | 評分: ${result.score}/100`;
      }

      // 在監控頁面底部添加記錄
      await this.notion.blocks.children.append({
        block_id: this.config.targetPageId,
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: recordText
                  }
                }
              ]
            }
          }
        ]
      });

      this.logger.info(`📝 已添加處理記錄到監控頁面`);
      
    } catch (error) {
      this.logger.error('❌ 添加處理記錄失敗', { error: error.message });
    }
  }

  /**
   * 更新監控頁面狀態
   */
  async updateMonitoringPage() {
    try {
      const statusText = `監控狀態更新 | 檢查次數: ${this.stats.totalChecks} | 處理連結: ${this.stats.linksProcessed} | 成功: ${this.stats.successfulProcessing} | 最後檢查: ${this.lastCheck.toLocaleString('zh-TW')} | ${this.config.signature}`;

      // 更新頁面屬性
      await this.notion.pages.update({
        page_id: this.config.targetPageId,
        properties: {
          '重要優勢': {
            rich_text: [
              {
                text: {
                  content: statusText
                }
              }
            ]
          }
        }
      });

    } catch (error) {
      this.logger.error('❌ 更新監控頁面失敗', { error: error.message });
    }
  }

  /**
   * 設定定時監控
   */
  setupScheduledMonitoring() {
    cron.schedule(this.config.checkInterval, async () => {
      this.logger.info('⏰ 定時檢查觸發');
      await this.performCheck();
    });

    this.logger.info(`⏰ 已設定定時監控: ${this.config.checkInterval}`);
  }

  /**
   * 設定優雅關閉
   */
  setupGracefulShutdown() {
    process.on('SIGINT', async () => {
      this.logger.info('收到 SIGINT 信號，正在安全停止監控系統...');
      await this.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      this.logger.info('收到 SIGTERM 信號，正在安全停止監控系統...');
      await this.stop();
      process.exit(0);
    });
  }

  /**
   * 停止監控
   */
  async stop() {
    try {
      this.logger.info('🛑 停止 Notion 頁面監控系統');
      
      // 添加停止記錄到監控頁面
      const stopTime = new Date().toLocaleString('zh-TW');
      await this.addProcessingRecord(
        { url: '系統停止', text: '監控系統停止' },
        null,
        `系統停止於 ${stopTime}`
      );
      
      this.logger.info('✅ 監控系統已安全停止');
    } catch (error) {
      this.logger.error('❌ 停止監控系統時發生錯誤', { error: error.message });
    }
  }

  /**
   * 顯示系統資訊
   */
  displaySystemInfo() {
    console.log('\n' + '='.repeat(60));
    console.log('🏠 Notion 頁面監控系統');
    console.log('='.repeat(60));
    console.log(`📄 監控頁面: https://www.notion.so/${this.config.targetPageId}`);
    console.log(`🗄️ 目標資料庫: ${this.config.databaseId}`);
    console.log(`⏰ 檢查間隔: ${this.config.checkInterval}`);
    console.log(`🎯 分數門檻: ${this.config.minScore}`);
    console.log(`📋 已處理連結: ${this.processedLinks.size}`);
    console.log(`🤖 處理者簽名: ${this.config.signature}`);
    console.log('='.repeat(60));
    console.log('💡 系統將自動監控指定頁面的新增連結');
    console.log('💡 符合條件的房源將自動添加到資料庫');
    console.log('💡 所有處理記錄將自動簽名並記錄時間');
    console.log('='.repeat(60) + '\n');
  }

  /**
   * 獲取監控統計
   */
  getStats() {
    const uptime = Date.now() - this.stats.startTime.getTime();
    const uptimeHours = Math.round(uptime / (1000 * 60 * 60) * 100) / 100;
    
    return {
      ...this.stats,
      processedLinksCount: this.processedLinks.size,
      successRate: this.stats.linksProcessed > 0 ? 
        Math.round((this.stats.successfulProcessing / this.stats.linksProcessed) * 100) : 0,
      uptimeHours: uptimeHours,
      lastCheck: this.lastCheck
    };
  }
}

// 主要執行函數
async function main() {
  const app = new NotionMonitorApp();
  
  try {
    await app.start();
    
    // 保持程序運行
    setInterval(() => {
      const stats = app.getStats();
      app.logger.info('📊 監控統計', stats);
    }, 30 * 60 * 1000); // 每 30 分鐘輸出一次統計
    
  } catch (error) {
    console.error('❌ 監控系統啟動失敗:', error.message);
    process.exit(1);
  }
}

// 如果直接執行此檔案，啟動監控系統
if (require.main === module) {
  main();
}

module.exports = NotionMonitorApp;
