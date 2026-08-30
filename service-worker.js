// service-worker.js — هیئت کاظمیون خرم‌آباد
// نسخه کش را با هر تغییر مهم در سایت افزایش دهید تا کاربران نسخه جدید را بگیرند
const CACHE_VERSION = 'kazemiuon-v5'; // v4 → v5: assistant.js/css هم network-first شدند تا با تأخیر آپدیت نشن
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

// استراتژی: صفحه اصلی و فایل‌های دستیار (assistant.js/css) → network-first
//            (همیشه اول از سرور گرفته می‌شن تا اعلان نسخه/تغییرات بدون تأخیر نمایش داده بشه؛
//            فقط وقتی آفلاینه از کش استفاده می‌شه)
//            سایر فایل‌های استاتیک هم‌مبدأ (لوگو، مانیفست و ...) →
//            stale-while-revalidate: نسخه‌ی کش‌شده فوری نمایش داده می‌شه (برای سرعت و آفلاین)،
//            ولی هم‌زمان یه درخواست به شبکه هم می‌ره و کش با نسخه‌ی تازه‌تر آپدیت می‌شه.
//            (نکته: قبلاً اینجا cache-first بود که باعث می‌شد assistant.js بعد از اولین کش، دیگه
//            هیچ‌وقت آپدیت نشه — حتی با انتشار نسخه‌ی جدید روی سرور.)
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isHTML = req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html');
  const isAssistantAsset = /\/(assistant\.js|assistant\.css)$/.test(url.pathname);

  if (isSameOrigin && (isHTML || isAssistantAsset)) {
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
        const networkFetch = fetch(req)
          .then((res) => {
            const resClone = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, resClone));
            return res;
          })
          .catch(() => cached); // آفلاین: اگه شبکه در دسترس نبود، همون کش رو نگه دار
        return cached || networkFetch;
      })
    );
  }
  // درخواست‌های خارجی (فونت گوگل و ...) دست‌نخورده از شبکه گرفته می‌شوند
});
