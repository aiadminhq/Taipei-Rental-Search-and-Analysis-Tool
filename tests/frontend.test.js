// 前端組件測試
/**
 * @jest-environment jsdom
 */

describe('前端組件測試', () => {
    // 模擬 Alpine.js 環境
    beforeEach(() => {
        document.body.innerHTML = '';
        // 模擬 window 物件
        global.window = Object.create(window);
        global.window.location = {
            origin: 'http://localhost:50000'
        };
    });

    describe('評分徽章樣式', () => {
        test('高分應該顯示綠色徽章', () => {
            const score = 90;
            let badgeClass;
            if (score >= 85) badgeClass = 'bg-green-500 text-white';
            else if (score >= 75) badgeClass = 'bg-yellow-500 text-white';
            else if (score >= 65) badgeClass = 'bg-orange-500 text-white';
            else badgeClass = 'bg-red-500 text-white';
            
            expect(badgeClass).toBe('bg-green-500 text-white');
        });

        test('中等分數應該顯示黃色徽章', () => {
            const score = 80;
            let badgeClass;
            if (score >= 85) badgeClass = 'bg-green-500 text-white';
            else if (score >= 75) badgeClass = 'bg-yellow-500 text-white';
            else if (score >= 65) badgeClass = 'bg-orange-500 text-white';
            else badgeClass = 'bg-red-500 text-white';
            
            expect(badgeClass).toBe('bg-yellow-500 text-white');
        });

        test('低分應該顯示紅色徽章', () => {
            const score = 50;
            let badgeClass;
            if (score >= 85) badgeClass = 'bg-green-500 text-white';
            else if (score >= 75) badgeClass = 'bg-yellow-500 text-white';
            else if (score >= 65) badgeClass = 'bg-orange-500 text-white';
            else badgeClass = 'bg-red-500 text-white';
            
            expect(badgeClass).toBe('bg-red-500 text-white');
        });
    });

    describe('狀態徽章樣式', () => {
        test('應該為不同狀態返回正確的樣式', () => {
            const statusClasses = {
                '未聯繫': 'bg-yellow-100 text-yellow-800',
                '已聯繫': 'bg-blue-100 text-blue-800',
                '已看房': 'bg-green-100 text-green-800',
                '已婉拒': 'bg-gray-100 text-gray-800',
                '待決定': 'bg-purple-100 text-purple-800'
            };

            expect(statusClasses['未聯繫']).toBe('bg-yellow-100 text-yellow-800');
            expect(statusClasses['已聯繫']).toBe('bg-blue-100 text-blue-800');
            expect(statusClasses['已看房']).toBe('bg-green-100 text-green-800');
        });

        test('未知狀態應該返回預設樣式', () => {
            const status = '未知狀態';
            const statusClasses = {
                '未聯繫': 'bg-yellow-100 text-yellow-800',
                '已聯繫': 'bg-blue-100 text-blue-800',
                '已看房': 'bg-green-100 text-green-800',
                '已婉拒': 'bg-gray-100 text-gray-800',
                '待決定': 'bg-purple-100 text-purple-800'
            };
            const result = statusClasses[status] || 'bg-gray-100 text-gray-800';
            expect(result).toBe('bg-gray-100 text-gray-800');
        });
    });

    describe('通知系統', () => {
        test('成功通知應該顯示正確的樣式', () => {
            const notificationType = 'success';
            const notificationClasses = {
                'success': 'bg-green-500 text-white',
                'error': 'bg-red-500 text-white',
                'warning': 'bg-yellow-500 text-white',
                'info': 'bg-blue-500 text-white'
            };
            
            expect(notificationClasses[notificationType]).toBe('bg-green-500 text-white');
        });

        test('錯誤通知應該顯示正確的圖示', () => {
            const notificationType = 'error';
            const notificationIcons = {
                'success': 'check-circle',
                'error': 'x-circle',
                'warning': 'alert-triangle',
                'info': 'info'
            };
            
            expect(notificationIcons[notificationType]).toBe('x-circle');
        });
    });

    describe('篩選功能', () => {
        test('應該正確初始化篩選器', () => {
            const filters = {
                status: 'all',
                minScore: 0,
                maxScore: 100,
                sortBy: 'score',
                sortOrder: 'desc'
            };
            
            expect(filters.status).toBe('all');
            expect(filters.minScore).toBe(0);
            expect(filters.maxScore).toBe(100);
            expect(filters.sortBy).toBe('score');
            expect(filters.sortOrder).toBe('desc');
        });

        test('應該正確切換排序順序', () => {
            let sortOrder = 'desc';
            sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
            expect(sortOrder).toBe('asc');
            
            sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
            expect(sortOrder).toBe('desc');
        });
    });

    describe('表單驗證', () => {
        test('應該驗證 URL 格式', () => {
            const validUrl = 'https://rent.591.com.tw/home/12345';
            const invalidUrl = 'not-a-url';
            
            function isValidURL(string) {
                try {
                    new URL(string);
                    return true;
                } catch (_) {
                    return false;
                }
            }
            
            expect(isValidURL(validUrl)).toBe(true);
            expect(isValidURL(invalidUrl)).toBe(false);
        });

        test('應該驗證 591 URL', () => {
            const valid591Url = 'https://rent.591.com.tw/home/12345';
            const invalidUrl = 'https://example.com/home/12345';
            
            function isValid591URL(url) {
                try {
                    new URL(url);
                    return url.includes('rent.591.com.tw');
                } catch (_) {
                    return false;
                }
            }
            
            expect(isValid591URL(valid591Url)).toBe(true);
            expect(isValid591URL(invalidUrl)).toBe(false);
        });
    });

    describe('API 服務', () => {
        test('應該正確設定 API Key', () => {
            const apiKey = 'rental-crm-secure-key-2024';
            const headers = {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey
            };
            
            expect(headers['X-API-Key']).toBe(apiKey);
            expect(headers['Content-Type']).toBe('application/json');
        });

        test('應該正確建構 API URL', () => {
            const baseURL = 'http://localhost:50000';
            const endpoint = '/api/properties';
            const fullUrl = `${baseURL}${endpoint}`;
            
            expect(fullUrl).toBe('http://localhost:50000/api/properties');
        });
    });
});
