/**
 * Firecrawl 服務整合 - 提供進階網頁抓取和資料提取功能
 * Firecrawl Service Integration - Advanced web scraping and data extraction
 */

const axios = require('axios');
const winston = require('winston');

class FirecrawlService {
  constructor() {
    this.apiKey = process.env.FIRECRAWL_API_KEY;
    this.baseUrl = 'https://api.firecrawl.dev/v1';
    
    if (!this.apiKey) {
      throw new Error('FIRECRAWL_API_KEY environment variable is required');
    }

    // 設定日誌
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/firecrawl.log' })
      ]
    });

    // 設定 axios 實例
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  /**
   * 抓取單一網頁並提取結構化資料
   * @param {string} url - 目標網址
   * @param {Object} options - 抓取選項
   * @returns {Promise<Object>} 抓取結果
   */
  async scrapeUrl(url, options = {}) {
    try {
      this.logger.info('開始 Firecrawl 抓取', { url, options });

      const payload = {
        url,
        formats: options.formats || ['markdown', 'html'],
        includeTags: options.includeTags || ['title', 'meta', 'h1', 'h2', 'h3', 'p', 'div', 'span'],
        excludeTags: options.excludeTags || ['script', 'style', 'nav', 'footer'],
        onlyMainContent: options.onlyMainContent !== false,
        waitFor: options.waitFor || 2000,
        timeout: options.timeout || 30000
      };

      const response = await this.client.post('/scrape', payload);
      
      if (response.data.success) {
        this.logger.info('Firecrawl 抓取成功', { 
          url, 
          contentLength: response.data.data?.markdown?.length || 0 
        });
        
        return {
          success: true,
          data: response.data.data,
          metadata: response.data.metadata || {}
        };
      } else {
        throw new Error(response.data.error || 'Firecrawl scraping failed');
      }

    } catch (error) {
      this.logger.error('Firecrawl 抓取失敗', { 
        url, 
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      return {
        success: false,
        error: error.message,
        status: error.response?.status || 500
      };
    }
  }

  /**
   * 批量抓取多個網址
   * @param {Array<string>} urls - 網址陣列
   * @param {Object} options - 抓取選項
   * @returns {Promise<Array>} 批量抓取結果
   */
  async batchScrape(urls, options = {}) {
    try {
      this.logger.info('開始批量 Firecrawl 抓取', { count: urls.length });

      const results = [];
      const batchSize = options.batchSize || 5;
      const delay = options.delay || 1000;

      for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        const batchPromises = batch.map(url => this.scrapeUrl(url, options));
        
        const batchResults = await Promise.allSettled(batchPromises);
        
        batchResults.forEach((result, index) => {
          const url = batch[index];
          if (result.status === 'fulfilled') {
            results.push({ url, ...result.value });
          } else {
            results.push({ 
              url, 
              success: false, 
              error: result.reason?.message || 'Unknown error' 
            });
          }
        });

        // 避免 API 限制
        if (i + batchSize < urls.length) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      this.logger.info('批量 Firecrawl 抓取完成', { 
        total: urls.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      });

      return results;

    } catch (error) {
      this.logger.error('批量 Firecrawl 抓取失敗', { error: error.message });
      throw error;
    }
  }

  /**
   * 專門針對 591 租屋網站的資料提取
   * @param {string} url - 591 房源網址
   * @returns {Promise<Object>} 提取的房源資料
   */
  async extract591RentalData(url) {
    try {
      const scrapeResult = await this.scrapeUrl(url, {
        formats: ['markdown', 'html'],
        includeTags: ['title', 'meta', 'h1', 'h2', 'h3', 'p', 'div', 'span', 'img'],
        onlyMainContent: true,
        waitFor: 3000
      });

      if (!scrapeResult.success) {
        return scrapeResult;
      }

      const { markdown, html } = scrapeResult.data;
      
      // 使用 AI 輔助提取結構化資料
      const extractedData = await this._extractRentalInfo(markdown, html, url);
      
      return {
        success: true,
        data: extractedData,
        raw: scrapeResult.data,
        metadata: scrapeResult.metadata
      };

    } catch (error) {
      this.logger.error('591 資料提取失敗', { url, error: error.message });
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 從 markdown 和 HTML 內容中提取房源資訊
   * @private
   */
  async _extractRentalInfo(markdown, html, url) {
    // 基本資訊提取邏輯
    const extractedData = {
      url,
      title: this._extractTitle(markdown),
      price: this._extractPrice(markdown),
      location: this._extractLocation(markdown),
      roomType: this._extractRoomType(markdown),
      area: this._extractArea(markdown),
      floor: this._extractFloor(markdown),
      description: this._extractDescription(markdown),
      features: this._extractFeatures(markdown),
      contact: this._extractContact(markdown),
      images: this._extractImages(html),
      extractedAt: new Date().toISOString()
    };

    return extractedData;
  }

  /**
   * 提取標題
   * @private
   */
  _extractTitle(markdown) {
    const titleMatch = markdown.match(/^#\s+(.+)$/m) || 
                      markdown.match(/租屋.*?([^\n]+)/i);
    return titleMatch ? titleMatch[1].trim() : null;
  }

  /**
   * 提取價格
   * @private
   */
  _extractPrice(markdown) {
    const priceMatch = markdown.match(/(\d{1,2}[,，]\d{3}|\d{4,6})\s*元/i) ||
                      markdown.match(/月租.*?(\d{1,2}[,，]\d{3}|\d{4,6})/i);
    if (priceMatch) {
      return parseInt(priceMatch[1].replace(/[,，]/g, ''));
    }
    return null;
  }

  /**
   * 提取地點
   * @private
   */
  _extractLocation(markdown) {
    const locationMatch = markdown.match(/(台北市|新北市|桃園市|台中市|台南市|高雄市).*?([^\n]+)/i) ||
                         markdown.match(/地址.*?([^\n]+)/i);
    return locationMatch ? locationMatch[0].trim() : null;
  }

  /**
   * 提取房型
   * @private
   */
  _extractRoomType(markdown) {
    const roomMatch = markdown.match(/(\d+房\d+廳|\d+房|\d+廳|套房|雅房|分租套房)/i);
    return roomMatch ? roomMatch[1] : null;
  }

  /**
   * 提取坪數
   * @private
   */
  _extractArea(markdown) {
    const areaMatch = markdown.match(/(\d+(?:\.\d+)?)\s*坪/i);
    return areaMatch ? parseFloat(areaMatch[1]) : null;
  }

  /**
   * 提取樓層
   * @private
   */
  _extractFloor(markdown) {
    const floorMatch = markdown.match(/(\d+)樓/i) ||
                      markdown.match(/樓層.*?(\d+)/i);
    return floorMatch ? parseInt(floorMatch[1]) : null;
  }

  /**
   * 提取描述
   * @private
   */
  _extractDescription(markdown) {
    // 尋找較長的段落作為描述
    const paragraphs = markdown.split('\n\n').filter(p => p.length > 50);
    return paragraphs.length > 0 ? paragraphs[0].trim() : null;
  }

  /**
   * 提取特色
   * @private
   */
  _extractFeatures(markdown) {
    const features = [];
    const featureKeywords = ['電梯', '停車位', '陽台', '冷氣', '洗衣機', '冰箱', '網路', '第四台'];
    
    featureKeywords.forEach(keyword => {
      if (markdown.includes(keyword)) {
        features.push(keyword);
      }
    });
    
    return features;
  }

  /**
   * 提取聯絡資訊
   * @private
   */
  _extractContact(markdown) {
    const phoneMatch = markdown.match(/09\d{8}|\d{2,4}-\d{6,8}/);
    return phoneMatch ? phoneMatch[0] : null;
  }

  /**
   * 提取圖片
   * @private
   */
  _extractImages(html) {
    const imgRegex = /<img[^>]+src="([^"]+)"/gi;
    const images = [];
    let match;
    
    while ((match = imgRegex.exec(html)) !== null) {
      images.push(match[1]);
    }
    
    return images;
  }

  /**
   * 測試 Firecrawl 連接
   */
  async testConnection() {
    try {
      const response = await this.client.get('/status');
      this.logger.info('Firecrawl 連接測試成功', { status: response.status });
      return true;
    } catch (error) {
      this.logger.error('Firecrawl 連接測試失敗', { error: error.message });
      throw error;
    }
  }
}

module.exports = FirecrawlService;
