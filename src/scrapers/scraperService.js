/**
 * 591 爬蟲服務
 * Scraper Service for 591
 */

const puppeteer = require('puppeteer');
const winston = require('winston');

class ScraperService {
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/scraper.log' })
      ]
    });
  }

  /**
   * 爬取 591 房源頁面
   */
  async scrape591(url) {
    this.logger.info(`準備爬取: ${url}`);
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle2' });

      const rentalData = await page.evaluate(() => {
        const title = document.querySelector('.house-title h1')?.textContent.trim() || '';
        const address = document.querySelector('.address')?.textContent.trim() || '';
        const price = document.querySelector('.price .num')?.textContent.trim() || '';
        
        return { title, address, price };
      });

      this.logger.info(`爬取成功: ${rentalData.title}`);
      return rentalData;

    } catch (error) {
      this.logger.error(`爬取失敗: ${url}`, { error: error.message });
      throw error;
    } finally {
      await browser.close();
    }
  }
}

module.exports = ScraperService;
