const CACHE = 'register-v2';
const FILES = ['./', './index.html', './manifest.json', './icon.svg', './apple-touch-icon.png'];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 画面ファイルはキャッシュ優先
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});