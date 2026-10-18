// service-worker.js — هیئت کاظمیون خرم‌آباد
// نسخه کش را با هر تغییر مهم در سایت افزایش دهید تا کاربران نسخه جدید را بگیرند
// تاریخچه‌ی نسخه‌ها (جدیدترین بالا):
//   v20: افزودن بقیه‌ی صفحه‌ها (اوقات شرعی، قرآن ۲۴، صلوات‌شمار، ادعیه، ذکر، راهنما، FAQ، نصب، تبدیل تاریخ، نذورات، پخش زنده، وضعیت) به پیش‌کش تا بعد از اولین بازدید از سایت، آفلاین هم باز شوند
//   v19: حذف صفحه‌های مداحی (madahi.html) و گالری (gallery.html)؛ انتقال صلوات‌شمار، ذکر روز، اوقات شرعی و قرآن ۲۴ به صفحه‌ی مسجد قائم؛ افزودن ادعیه و زیارت‌نامه‌ها به مسجد قائم و کاظمیون
//   v18: حذف کامل دستیار شناور (assistant.js/css) از کش و صفحات
//   v17: تصویر تم «حرم» داخل kazemiyoon.html جاسازی شد (فایل جدا لازم نیست)
//   v16: افزودن تصویر پس‌زمینه‌ی تم «حرم» (پیش‌فرض)
//   v15: رفع قفل/صفحه‌ی خالی هنگام رفتن از صفحه‌ی «سایر» به صفحات دیگر؛ ناوبری network-first حالا بعد از ۴ ثانیه (اگر نسخه‌ی کش‌شده هست) از کش جواب می‌دهد
//   v14: صفحه‌ی ورود اولین صفحه‌ی سایت شد (index.html)، صفحه‌ی هیئت به kazemiyoon.html منتقل شد و لینک همه‌ی صفحه‌ها اصلاح شد
//   v13: انتقال منوی «دسترسی سریع به صفحات» از index.html به صفحه‌ی مستقل «سایر» (other.html) و حذف کامل آن از صفحه‌ی هیئت
//   v12: صفحه‌ی ورود به سایت (welcome.html) با سه ورودی: هیئت کاظمیون، مسجد قائم (صفحه‌ی مستقل) و سایر (صفحه‌ی مستقل)
//   v11: بازطراحی ظاهر صفحه‌ی اصلی (داشبورد بالای صفحه، اعلان ویژه، هیرو و لوگو، تقویم و رویدادهای ماه، تماس و شبکه‌های اجتماعی)،
//        رفع نمایش QR (بدون وابستگی به CDN) و روان‌تر شدن بازشدن کاشی‌های ساعت/تاریخ/هوا/اذان
//   v10: اصلاح کش (عدم کش صوت/206/خطا، precache مقاوم) و رفع باگ‌های ترجمه و عملکرد
//   v9:  صفحه‌ی جدید «قرآن ۲۴» و میان‌بر آن در منوی دسترسی سریع
//   v8:  صفحه‌ی جدید «زیارت سه‌بعدی»، دسته‌بندی منوی دسترسی سریع و انتقال مرکز دانلود به منوی همبرگری
//   v7:  کارت اشتراک‌گذاری روز، اصلاح اوقات شرعی نزدیک نوروز و تاریخ قمری صفحه‌ی تبدیل، ثبت درست SW در همه‌ی صفحه‌ها
//   v6:  کارت اشتراک‌گذاری به index.html اضافه شد
const CACHE_VERSION = 'kazemiuon-v20';
const CORE_ASSETS = [
  './',
  './index.html',
  './kazemiyoon.html',
  './masjed-qaem.html',
  './other.html',
  './virtual-tour.html',
  './frame.html',
  './page2.html',
  './owqat.html',
  './zekr.html',
  './salavat.html',
  './quran24.html',
  './convert.html',
  './nazr.html',
  './live.html',
  './guide.html',
  './faq.html',
  './install.html',
  './status.html',
  './other-icon.webp',
  './404.html',
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
  const isAssistantAsset = /\/(status\.json)$/.test(url.pathname); // status.json هم network-first تا وضعیت قدیمی نمایش داده نشه

  // فقط پاسخ‌های سالم (200) کش می‌شوند؛ قبلاً صفحه‌ی 404/خطا هم کش می‌شد و آفلاین نمایش داده می‌شد
  const store = (request, res) => {
    if (!res || res.status !== 200 || res.type === 'opaque') return Promise.resolve();
    const copy = res.clone();
    return caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy)).catch(() => {});
  };

  if (isHTML || isAssistantAsset) {
    // network-first با مهلت: روی اینترنت ضعیف، اگر شبکه دیر جواب داد و نسخه‌ی کش‌شده هست، همان نمایش داده می‌شود
    // (قبلاً بدون مهلت منتظر می‌ماند و صفحه ساعتی خالی/غیرقابل‌لمس می‌ماند)
    event.respondWith(new Promise((resolve) => {
      let settled = false;
      const done = (r) => { if (!settled) { settled = true; resolve(r); } };
      const fallback = () =>
        caches.match(req).then((cached) =>
          cached || (isHTML ? caches.match('./kazemiyoon.html') : undefined) || Response.error()
        );
      const timer = isHTML ? setTimeout(() => {
        caches.match(req).then((cached) => { if (cached) done(cached); });
      }, 4000) : null;
      fetch(req)
        .then((res) => { clearTimeout(timer); event.waitUntil(store(req, res)); done(res); })
        .catch(() => { clearTimeout(timer); fallback().then(done); });
    }));
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
