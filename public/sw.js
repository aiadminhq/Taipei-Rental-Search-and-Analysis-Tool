// 房源 CRM 系統 - Service Worker
// 版本: 1.0.0

const CACHE_NAME = 'rental-crm-v1';
const urlsToCache = [
  '/',
  '/assets/css/styles.css',
  '/assets/js/app.js',
  '/public/manifest.json',
  // 外部資源
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js',
  'https://unpkg.com/lucide@latest/dist/umd/lucide.js',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&display=swap'
];

// 安裝事件
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker 安裝中...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 快取檔案中...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker 安裝完成');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker 安裝失敗:', error);
      })
  );
});

// 啟動事件
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker 啟動中...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ 清除舊快取:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker 啟動完成');
      return self.clients.claim();
    })
  );
});

// 網路請求攔截
self.addEventListener('fetch', (event) => {
  // 只處理 GET 請求
  if (event.request.method !== 'GET') {
    return;
  }

  // 跳過 API 請求，讓它們直接通過網路
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果快取中有，直接返回
        if (response) {
          console.log('📦 從快取載入:', event.request.url);
          return response;
        }

        // 否則從網路獲取
        console.log('🌐 從網路載入:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // 檢查回應是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 複製回應以便快取
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('❌ 網路請求失敗:', error);
            
            // 如果是導航請求且網路失敗，返回離線頁面
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            throw error;
          });
      })
  );
});

// 推送通知處理 (未來功能)
self.addEventListener('push', (event) => {
  console.log('📬 收到推送通知:', event);
  
  const options = {
    body: event.data ? event.data.text() : '新的房源通知',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '查看房源',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: '關閉',
        icon: '/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('房源 CRM 系統', options)
  );
});

// 通知點擊處理
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 通知被點擊:', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    // 打開應用程式
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('🎉 Service Worker 腳本載入完成');
