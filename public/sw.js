// --- Finance Tracker Service Worker ---
// Version your cache
const CACHE_NAME = 'finance-tracker-cache-v1';
const OFFLINE_URL = '/offline.html';

// List of routes or assets you want to precache
const PRECACHE_URLS = [
  '/',
  '/offline',
  OFFLINE_URL,
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Installation: cache important files immediately
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(PRECACHE_URLS);
      self.skipWaiting(); // Activate worker immediately
    })()
  );
});

// Activation: clean old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
      self.clients.claim(); // Become available to all pages
    })()
  );
});

// Fetch Handling
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    // Only handle GET requests
    return;
  }

  const isNavigation = event.request.mode === 'navigate';

  if (isNavigation) {
    event.respondWith(
      (async () => {
        try {
          // Try network first
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          const networkResponse = await fetch(event.request);
          
          // Save to cache dynamically
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());

          return networkResponse;
        } catch (error) {
          console.warn('[Service Worker] Network request Failed. Serving offline page:', error);

          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(event.request);
          return cachedResponse || await cache.match(OFFLINE_URL);
        }
      })()
    );
  } else {
    // For static resources (images, icons, fonts, css, js)
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(event.request);
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          console.error('[Service Worker] Resource fetch failed:', error);
          return new Response('Service unavailable', { status: 503 });
        }
      })()
    );
  }
});

// Push Notifications (optional)
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};

  const title = data.title || 'Finance Tracker Notification';
  const options = {
    body: data.body || 'You have a new reminder!',
    icon: '/chart.png',
    badge: '/chart.png',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({ includeUncontrolled: true });
      let appClient = allClients.find(client => client.url.includes('/') && 'focus' in client);

      if (appClient) {
        appClient.focus();
      } else {
        clients.openWindow('/');
      }
    })()
  );
});
