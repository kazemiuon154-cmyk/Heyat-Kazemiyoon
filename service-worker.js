// service-worker.js — هیئت کاظمیون خرم‌آباد
// نسخه کش را با هر تغییر مهم در سایت افزایش دهید تا کاربران نسخه جدید را بگیرند
const CACHE_VERSION = 'kazemiuon-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.jpg',
  './logo.webp'
];

// نصب: فایل‌های اصلی را از قبل کش کن
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch(() => {}) // اگر یکی از فایل‌ها (مثلاً webp) وجود نداشت، نصب را متوقف نکن
  );
  self.skipWaiting();
});

// فعال‌سازی: کش‌های نسخه قدیمی را پاک کن
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// استراتژی: صفحه اصلی → network-first (تا اعلان‌ها/ساعت مراسم به‌روز بمانند)
//            سایر فایل‌های استاتیک (لوگو، مانیفست) → cache-first
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isHTML = req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html');

  if (isSameOrigin && isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  if (isSameOrigin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, resClone));
          return res;
        }).catch(() => cached);
      })
    );
  }
  // درخواست‌های خارجی (فونت گوگل و ...) دست‌نخورده از شبکه گرفته می‌شوند
});
