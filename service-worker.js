const CACHE_NAME = 'fishing-app-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/gallery.html',
  'https://cdn.tailwindcss.com',
  'https://api.open-meteo.com'
];

// Install event - cache essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(URLS_TO_CACHE).catch(() => {
          // Some URLs might fail, that's okay - continue with what we can cache
          return Promise.resolve();
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
  // Don't cache POST requests or API calls that modify data
  if (event.request.method !== 'GET') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Store failed requests for later retry
          if (event.request.method === 'POST') {
            // Will be handled by sync logic
            return new Response(JSON.stringify({ offline: true }), {
              status: 202,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          throw new Error('Offline');
        })
    );
    return;
  }

  // For GET requests, try network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fall back to cache
        return caches.match(event.request)
          .then(response => {
            return response || new Response(
              JSON.stringify({ message: 'Offline - no cached data available' }),
              { status: 503, headers: { 'Content-Type': 'application/json' } }
            );
          });
      })
  );
});

// Handle background sync for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'sync-catches') {
    event.waitUntil(syncCatches());
  }
});

async function syncCatches() {
  try {
    const db = await openDB();
    const offlineCatches = await getOfflineCatches(db);
    
    // Send all offline catches to server
    for (const catchData of offlineCatches) {
      try {
        const response = await fetch('https://fishing-app-4b031-default-rtdb.firebaseio.com/catches.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(catchData)
        });
        
        if (response.ok) {
          await removeOfflineCatch(db, catchData.timestamp);
        }
      } catch (e) {
        console.error('Sync failed for catch:', e);
      }
    }
  } catch (e) {
    console.error('Sync error:', e);
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FishingAppDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offlineCatches')) {
        db.createObjectStore('offlineCatches', { keyPath: 'timestamp' });
      }
    };
  });
}

function getOfflineCatches(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['offlineCatches'], 'readonly');
    const store = transaction.objectStore('offlineCatches');
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function removeOfflineCatch(db, timestamp) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['offlineCatches'], 'readwrite');
    const store = transaction.objectStore('offlineCatches');
    const request = store.delete(timestamp);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
