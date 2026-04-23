// Orbis Service Worker — enables offline access
const CACHE = 'orbis-v6';
const ASSETS = ['./', './index.html', './data/tasks.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Delete ALL old caches when version changes
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Always fetch fresh for HTML and JSON — only cache static assets
  const url = new URL(e.request.url);
  if (url.pathname.endsWith('.html') || url.pathname.endsWith('.json') || url.pathname === '/') {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
