const CACHE_NAME = 'magcity-v1';
const ASSETS = [
  '/errands-website/',
  '/errands-website/index.html',
  '/errands-website/order.html',
  '/errands-website/track.html',
  '/errands-website/style.css',
  '/errands-website/main.js'
];

// Install — cache all assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// Fetch — serve from cache, fallback to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});