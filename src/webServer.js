const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const ScraperService = require('./scrapers/scraperService');

const app = express();
const PORT = process.env.PORT || 50000;
const MCP_PORT = process.env.MCP_PORT || 3001; // MCP 服務的端口
const MCP_URL = `http://localhost:${MCP_PORT}`;

const scraperService = new ScraperService();

// 簡單的 API 驗證中介軟體
const apiAuth = (req, res, next) => {
    // 跳過健康檢查端點
    if (req.path === '/api/health') {
        return next();
    }

    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    const validApiKey = process.env.API_KEY || 'rental-crm-dev-key';

    if (!apiKey || apiKey !== validApiKey) {
        return res.status(401).json({
            success: false,
            message: '未授權的請求：需要有效的 API Key',
            code: 'UNAUTHORIZED'
        });
    }

    next();
};

// 輸入驗證中介軟體
const validateInput = (req, res, next) => {
    // 清理和驗證輸入
    if (req.body) {
        // 移除潛在的危險字符
        const cleanBody = JSON.parse(JSON.stringify(req.body, (key, value) => {
            if (typeof value === 'string') {
                return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            }
            return value;
        }));
        req.body = cleanBody;
    }
    next();
};

// 中介軟體
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// 對 API 路由套用驗證
app.use('/api', apiAuth);
app.use('/api', validateInput);

// API 路由
app.get('/api/health', async (req, res) => {
    try {
        const mcpStatus = await axios.get(`${MCP_URL}/health`);
        res.json({ 
            status: 'healthy', 
            timestamp: new Date().toISOString(),
            version: '2.0.0',
            mcp: mcpStatus.data.status
        });
    } catch (error) {
        res.json({ 
            status: 'healthy', 
            timestamp: new Date().toISOString(),
            version: '2.0.0',
            mcp: 'disconnected'
        });
    }
});

app.get('/api/properties', async (req, res) => {
    try {
        const response = await axios.get(`${MCP_URL}/mcp/properties`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ success: false, message: '獲取房源失敗', error: error.message });
    }
});

app.post('/api/process', async (req, res) => {
    const { url, autoScore, dryRun } = req.body;

    if (!url || !url.includes('rent.591.com.tw')) {
        return res.status(400).json({ success: false, message: '無效的 591 房源 URL' });
    }

    try {
        const rentalData = await scraperService.scrape591(url);
        const response = await axios.post(`${MCP_URL}/mcp/process-rental`, { 
            rentalData,
            options: { dryRun }
        });
        res.json(response.data);
    } catch (error) {
        const errorMessage = error.response ? error.response.data.error : error.message;
        res.status(500).json({ success: false, message: '處理房源失敗', error: errorMessage });
    }
});

app.get('/api/stats', async (req, res) => {
    try {
        const response = await axios.get(`${MCP_URL}/mcp/stats`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ success: false, message: '獲取統計資料失敗', error: error.message });
    }
});

// SPA 路由處理
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 錯誤處理中介軟體
app.use((error, req, res, next) => {
    console.error('伺服器錯誤:', error);
    res.status(500).json({
        success: false,
        message: '內部伺服器錯誤',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

// 404 處理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '找不到請求的資源'
    });
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`🚀 房源 CRM 系統 Web 伺服器啟動於 http://localhost:${PORT}`);
    console.log(`📱 手機優先響應式介面已就緒`);
    console.log(`🔗 後端 MCP 服務預期運行於 http://localhost:${MCP_PORT}`);
});

module.exports = app;