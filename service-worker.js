// service-worker.js — هیئت کاظمیون خرم‌آباد
// نسخه کش را با هر تغییر مهم در سایت افزایش دهید تا کاربران نسخه جدید را بگیرند
const CACHE_VERSION = 'kazemiuon-v10'; // v9 → v10: اصلاح کش (عدم کش صوت/206/خطا، precache مقاوم) و رفع باگ‌های ترجمه و عملکرد (v8 → v9: صفحه‌ی جدید «قرآن ۲۴» و میان‌بر آن در منوی دسترسی سریع (v7 → v8: صفحه‌ی جدید «زیارت سه‌بعدی»، دسته‌بندی منوی دسترسی سریع و انتقال مرکز دانلود به منوی همبرگری (v6 → v7: کارت اشتراک‌گذاری روز، اصلاح اوقات شرعی نزدیک نوروز و تاریخ قمری صفحه‌ی تبدیل، ثبت درست SW در همه‌ی صفحه‌ها (v5 → v6: کارت اشتراک‌گذاری به index.html اضافه شد))))
const CORE_ASSETS = [
  './',
  './index.html',
  './404.html',
  './assistant.js',
  './assistant.css',
  './manifest.json',
  './logo.jpg',
  './logo.webp'
];

// نصب: فایل‌های اصلی را از قبل کش کن
self.addEventListener('install', (event) => {
  event.waitUntil(
    // cache.addAll اگر حتی یک فایل پیدا نشود کل عملیات را رد می‌کند و هیچ‌چیز کش نمی‌شود؛
    // پس هر فایل جداگانه اضافه می‌شود تا نبودِ یک فایل (مثلاً logo.webp) بقیه را خراب نکند.
    caches.open(CACHE_VERSION).then((cache) =>
      Promise.allSettled(CORE_ASSETS.map((u) => cache.add(u)))
    )
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

  // درخواست‌های Range (پخش/جلو-عقب‌کردن صوت و ویدیو) را به SW نمی‌دهیم:
  // پاسخ 206 قابل کش‌شدن نیست و برگرداندن نسخه‌ی کامل کش‌شده، سیک صوت را خراب می‌کند.
  if (req.headers.has('range')) return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;
  if (!isSameOrigin) return; // فونت گوگل، تایل نقشه، API آب‌وهوا و ... مستقیم از شبکه

  // فایل‌های صوتی/تصویری حجیم کش نمی‌شوند (قبلاً هر بار دوباره‌دانلود و ذخیره می‌شدند)
  if (req.destination === 'audio' || req.destination === 'video' || /\.(mp3|m4a|ogg|wav|mp4|webm)$/i.test(url.pathname)) return;

  const isHTML = req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html');
  const isAssistantAsset = /\/(assistant\.js|assistant\.css|status\.json)$/.test(url.pathname); // status.json هم network-first تا وضعیت قدیمی نمایش داده نشه

  // فقط پاسخ‌های سالم (200) کش می‌شوند؛ قبلاً صفحه‌ی 404/خطا هم کش می‌شد و آفلاین نمایش داده می‌شد
  const store = (request, res) => {
    if (!res || res.status !== 200 || res.type === 'opaque') return Promise.resolve();
    const copy = res.clone();
    return caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy)).catch(() => {});
  };

  if (isHTML || isAssistantAsset) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          event.waitUntil(store(req, res));
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) =>
            cached || (isHTML ? caches.match('./index.html') : undefined) || Response.error()
          )
        )
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const networkFetch = fetch(req)
        .then((res) => { event.waitUntil(store(req, res)); return res; })
        .catch(() => cached || Response.error()); // آفلاین: اگه شبکه در دسترس نبود، همون کش رو نگه دار
      return cached || networkFetch;
    })
  );
});
