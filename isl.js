/* ===== isl.js — کپسول جادویی (Dynamic Island) برای همه‌ی صفحه‌ها =====
   از index.html برداشته شده. به kzm-core.js (هسته‌ی اوقات/مراسم/تقویم/ذکر) و isl.css نیاز دارد.
   • تنظیمات در پنل مشترک (gset.js) ← تب «کپسول»؛ همان کلیدهای index.html:  kazemiuon-island · kazemiuon-island-timer · kazemiuon-island-tmin
   • خوش‌آمدگویی فقط در index.html نشان داده می‌شود؛ در صفحه‌های داخلی کپسول مستقیم به حالت قرص یا یادآوری می‌رود.
   استفاده:  <link rel="stylesheet" href="isl.css"> · <script src="kzm-core.js"></script> · <script src="isl.js" defer></script> */
(function(){
  if(window.KZM) return;   /* index.html خودش KZM دارد */
  var T = {"fa": {"holiday": "تعطیل", "nextOcc": "مناسبت بعدی: ", "noOcc": "امروز مناسبت رسمی ثبت‌شده‌ای نیست", "tDhuhr": "ظهر", "tFajr": "صبح", "tMaghrib": "مغرب", "tSunrise": "طلوع", "today": "امروز", "tomorrow": "فردا", "tomorrowParen": "(فردا)", "wTitle": "امروز در یک نگاه", "weSub": "قاضی‌آباد، خرم‌آباد", "weTitle": "مراسم بعدی", "wpCity": "خرم‌آباد", "wpTitle": "وقت بعدی", "zekrDone": "ذکر امروز کامل شد ✓", "zekrOf": " از ", "zekrToday": "امروز "}, "ar": {"holiday": "عطلة", "nextOcc": "المناسبة القادمة: ", "noOcc": "لا توجد مناسبة رسمية مسجّلة اليوم", "tDhuhr": "الظهر", "tFajr": "الفجر", "tMaghrib": "المغرب", "tSunrise": "الشروق", "today": "اليوم", "tomorrow": "غداً", "tomorrowParen": "(غداً)", "wTitle": "اليوم في لمحة", "weSub": "قاضي‌آباد، خرم‌آباد", "weTitle": "المراسم القادمة", "wpCity": "خرم‌آباد", "wpTitle": "الوقت القادم", "zekrDone": "اكتمل ذكر اليوم ✓", "zekrOf": " من ", "zekrToday": "اليوم "}, "en": {"holiday": "Holiday", "nextOcc": "Next: ", "noOcc": "No official occasion today", "tDhuhr": "Dhuhr", "tFajr": "Fajr", "tMaghrib": "Maghrib", "tSunrise": "Sunrise", "today": "Today", "tomorrow": "Tomorrow", "tomorrowParen": "(tomorrow)", "wTitle": "Today at a glance", "weSub": "Qazi-Abad, Khorramabad", "weTitle": "Next ceremony", "wpCity": "Khorramabad", "wpTitle": "Next prayer", "zekrDone": "Today’s dhikr complete ✓", "zekrOf": " of ", "zekrToday": "Today "}};
  var doc = document, root = doc.documentElement;
  function lg(){ var l = String(root.lang || (function(){ try{ return localStorage.getItem('kazemiuon-lang'); }catch(e){ return ''; } })() || 'fa').slice(0, 2); return T[l] ? l : 'fa'; }
  var KZM = window.KZM = {
    t:function(k){ var d = T[lg()]; return (d && d[k] !== undefined) ? d[k] : (T.fa[k] || ''); },
    tick:function(){}
  };
  Object.defineProperty(KZM, 'lang', { get:lg, enumerable:true });
  /* تغییر زبانِ صفحه ← رویداد kzm-lang (کپسول متن‌هایش را دوباره می‌نویسد) */
  try{
    var last = lg();
    new MutationObserver(function(){ var n = lg(); if(n !== last){ last = n; try{ window.dispatchEvent(new CustomEvent('kzm-lang', { detail:{ lang:n } })); }catch(e){} } })
      .observe(root, { attributes:true, attributeFilter:['lang'] });
  }catch(e){}
})();

(function(){
  function __islBoot(){
  'use strict';
  var C = window.KZM_CORE, K = window.KZM;
  if(!C || !C.ok || !K || !document.body){ document.documentElement.classList.remove('isl-pad'); return; }
  var doc = document, html = doc.documentElement, body = doc.body;

  /* ---------- ابزارها ---------- */
  function gRoot(){ try{ return (window.GSET && GSET.root && GSET.root()) || null; }catch(x){ return null; } }
  function $(id){ var e = doc.getElementById(id); if(e) return e; var r = gRoot(); return r ? r.getElementById(id) : null; }
  var IS_HOME = /(^|\/)(index\.html)?$/.test(location.pathname);
  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]; }); }
  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t){ return a + (b - a) * t; }
  function p2(n){ return n < 10 ? '0' + n : String(n); }
  function lang(){ return (K.lang === 'ar' || K.lang === 'en') ? K.lang : 'fa'; }
  function pick(o){ return (o && (o[lang()] || o.fa)) || ''; }
  function clone(o){ return JSON.parse(JSON.stringify(o)); }
  function getP(o, p){ return p.split('.').reduce(function(a, k){ return a == null ? a : a[k]; }, o); }
  function setP(o, p, v){ var a = p.split('.'), l = a.pop(), t = o; a.forEach(function(k){ t = t[k]; }); t[l] = v; }
  function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function lsSet(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
  function ssGet(k){ try{ return sessionStorage.getItem(k); }catch(e){ return null; } }
  function ssSet(k, v){ try{ sessionStorage.setItem(k, v); }catch(e){} }
  function mqReduce(){ try{ return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }catch(e){ return false; } }

  /* ---------- تنظیمات ---------- */
  var KEY = 'kazemiuon-island', FIRED_KEY = 'kzm-isl-fired';
  var DEF = {
    on:true, mode:'always', style:'black', glow:'sky', size:1, top:0, motion:'soft', breathe:true, hideScroll:false,
    pages:{ prayer:true, event:true, clock:true, date:true, occasion:true, zekr:true, salavat:true, guide:true }, rotate:7, primary:'auto',
    clockPill:false, clockSec:false, seconds:false,
    show:{ clock:true, timer:true, prayer:true, event:true, date:true, zekr:true, salavat:true },
    ramadan:true, eve:true, liveEv:true, evDur:120,
    adhan:{ fajr:true, sunrise:false, dhuhr:true, maghrib:true }, evOn:{ majles:true, nodbeh:true },
    actions:true, alertSec:8, snooze:5, quiet:{ on:false, from:23, to:5 },
    vibrate:true, haptic:true, sound:false, tone:'bell', satellite:true, timerAlarm:true, hold:400, fan:true
  };
  var ENUM = { mode:['always', 'alerts'], style:['black', 'glass', 'theme'], glow:['sky', 'theme', 'gold', 'off'], size:[0, 1, 2], top:[0, 1, 2],
    motion:['soft', 'lively', 'minimal'], rotate:[0, 5, 7, 12], primary:['auto', 'prayer', 'event', 'clock', 'date', 'occasion', 'zekr'], evDur:[60, 90, 120, 180],
    alertSec:[5, 8, 12], snooze:[5, 10, 15], tone:['bell', 'drop', 'flute'], hold:[300, 400, 500, 800, 1200, 2000] };
  var FIXED = ['pages', 'rotate', 'primary', 'clockPill', 'clockSec', 'seconds', 'ramadan', 'eve', 'liveEv', 'evDur', 'adhan', 'evOn', 'actions', 'alertSec', 'snooze', 'quiet'];
  function mergeInto(def, o, path){
    var out = {};
    Object.keys(def).forEach(function(k){
      if(!path && FIXED.indexOf(k) > -1){ out[k] = clone(def[k]); return; }
      var dv = def[k], ov = (o && typeof o === 'object') ? o[k] : undefined, full = path ? path + '.' + k : k;
      if(dv && typeof dv === 'object') out[k] = mergeInto(dv, ov, full);
      else if(typeof dv === 'boolean') out[k] = (full.indexOf('show.') === 0) ? true : ((typeof ov === 'boolean') ? ov : dv);   /* همه‌ی بخش‌های کارت همیشه نمایش داده می‌شوند */
      else if(ENUM[full]) out[k] = (ENUM[full].indexOf(ov) > -1) ? ov : dv;
      else if(typeof dv === 'number') out[k] = (typeof ov === 'number' && isFinite(ov)) ? clamp(Math.round(ov), 0, 23) : dv;
      else out[k] = dv;
    });
    return out;
  }
  function deepAssign(t, s){ Object.keys(s).forEach(function(k){ if(s[k] && typeof s[k] === 'object') deepAssign(t[k], s[k]); else t[k] = s[k]; }); return t; }
  var cfg, dirty = false;      /* dirty = تغییرِ ذخیره‌نشده‌ی همین صفحه */
  try{ cfg = mergeInto(DEF, JSON.parse(lsGet(KEY) || 'null'), ''); }catch(e){ cfg = clone(DEF); }
  /* یک‌بار: پیش‌فرض قدیمیِ نگه‌داشتن (۰٫۵ ثانیه) به مقدار سریع‌تر (۰٫۴) می‌رود؛ انتخاب‌های دیگر دست‌نخورده می‌مانند */
  try{ if(lsGet('kzm-isl-hold4') !== '1'){ if(cfg.hold === 500){ cfg.hold = 400; saveCfg(); } lsSet('kzm-isl-hold4', '1'); } }catch(e){}
  function saveCfg(){ dirty = false; lsSet(KEY, JSON.stringify(cfg)); }
  var PRESETS = {
    simple:{ pages:{ prayer:true, event:false, clock:false, date:false, occasion:false, zekr:false, salavat:false }, rotate:0, primary:'prayer', clockPill:false, glow:'theme', breathe:false,
             show:{ clock:false, timer:false, prayer:true, event:true, date:false, zekr:false, salavat:false }, satellite:false, actions:false, seconds:false, clockSec:false },
    balanced:clone(DEF),
    full:{ pages:{ prayer:true, event:true, clock:true, date:true, occasion:true, zekr:true, salavat:true }, rotate:5, clockPill:false, clockSec:true, seconds:true, glow:'sky', breathe:true,
           show:{ clock:true, timer:true, prayer:true, event:true, date:true, zekr:true, salavat:true }, satellite:true, ramadan:true, eve:true, liveEv:true, actions:true }
  };

  /* ---------- متن‌ها: کلید ← [فارسی، عربی، English] ---------- */
  var D = {
    welT:['به سایت کاظمیون خوش آمدید', 'أهلاً بكم في موقع الكاظميون', 'Welcome to the Kazemiyoon website'],
    welM:['وقتتان بخیر', 'أوقاتكم طيبة', 'Have a good time'], welN:['وقتتان بخیر', 'أوقاتكم طيبة', 'Have a good time'],
    welA:['وقتتان بخیر', 'أوقاتكم طيبة', 'Have a good time'], welE:['وقتتان بخیر', 'أوقاتكم طيبة', 'Have a good time'],
    guideP:['راهنمای کپسول جادویی', 'دليل الكبسولة السحرية', 'Magic capsule guide'],
    pgGuide:['راهنمای کپسول', 'دليل الكبسولة', 'Capsule guide'], guideSum:['آموزش گام‌به‌گام', 'شرح خطوة بخطوة', 'Step by step'],
    gdSub:['لمس، تایمر و یادآوری‌ها؛ همه در یک نگاه', 'اللمس والمؤقّت والتنبيهات في لمحة', 'Touch, timer and reminders at a glance'],
    gdTipT:['نکته‌ی مهم', 'ملاحظة مهمة', 'Good to know'],
    tab:['جادویی', 'السحرية', 'Magic'], title:['کپسول جادویی', 'الكبسولة السحرية', 'Magic capsule'],
    unitD:['روز', 'يوم', 'd'], unitH:['ساعت', 'س', 'h'], unitM:['دقیقه', 'د', 'min'],
    xCfg:['تنظیمات کپسول جادویی', 'إعدادات الكبسولة السحرية', 'Magic capsule settings'], xClose:['بستن', 'إغلاق', 'Close'],
    lead:['{d} مانده تا {n}', 'باقي {d} على {n}', '{d} until {n}'], startP:['وقت {n}', 'حان وقت {n}', '{n} time'], startE:['{n} شروع شد', 'بدأ {n}', '{n} is starting'],
    day1:['۲۴ ساعت', '٢٤ ساعة', '24 hours'], min5:['۵ دقیقه', '٥ دقائق', '5 minutes'],
    now:['اکنون', 'الآن', 'Now'], half:['نیم ساعت', 'نصف ساعة', '30 minutes'], hour1:['یک ساعت', 'ساعة واحدة', 'an hour'], hour2:['دو ساعت', 'ساعتان', '2 hours'],
    zekrL:['ذکر روز', 'ذكر اليوم', 'Daily dhikr'], salL:['صلوات‌شمار شما', 'عدّاد صلواتك', 'Your salawat'], salA:['صلوات', 'الصلوات', 'Salawat'], salB:['فرج', 'الفرج', 'Faraj'], salC:['استغفار', 'الاستغفار', 'Istighfar'],
    emptyX:['بخشی برای نمایش انتخاب نشده است', 'لم يتم اختيار أي قسم للعرض', 'No sections selected to show'],
    fanT:['باز شدن قرص‌ها با دو ضربه', 'فتح الصفحات بنقرتين', 'Double-tap to pop out pages'], fanH:['دو ضربه‌ی سریع روی قرص کوچک کنار کپسول، همه‌ی قرص‌ها را به شکل کپسول باز می‌کند؛ ضربه‌ی تکی روی آن با تأخیر خیلی کم همان کار همیشگی را می‌کند. کپسول اصلی بدون تغییر است', 'نقرتان سريعتان على الحبّة الصغيرة بجانب الكبسولة تفتحان كل الصفحات؛ والنقرة الواحدة عليها تعمل كالمعتاد بتأخير بسيط جداً. الكبسولة الرئيسية دون تغيير', 'Two quick taps on the small bubble beside the capsule pop out every page; a single tap on it still works as usual, after a tiny delay. The main capsule is unchanged'], fanHint:['انگشت را روی یک قرص بکشید', 'اسحب إصبعك إلى صفحة', 'Slide onto a page'], fanGuide:['راهنما', 'الدليل', 'Guide'],
    holdL:['نگه داشتن برای کارت کامل', 'اضغط مطولاً للبطاقة الكاملة', 'Hold to open the full card'], xAll:['همه‌ی بخش‌ها', 'كل الأقسام', 'All sections'],
    dtPrayer:['اوقات شرعی', 'مواقيت الصلاة', 'Prayer times'], dtEvent:['مراسم', 'المراسم', 'Gatherings'], dtClock:['ساعت', 'الساعة', 'Clock'],
    dtDate:['تقویم', 'التقويم', 'Calendar'], dtOcc:['مناسبت بعدی', 'المناسبة القادمة', 'Next occasion'], dtSal:['صلوات‌شمار', 'عدّاد الصلوات', 'Salawat counter'],
    evNext:['مراسم بعدی', 'المراسم القادمة', 'Next gathering'], placeK:['هیئت کاظمیون', 'هيئة الكاظميون', 'Kazemiyoon Hayat'], placeQ:['مسجد قائم (عج)', 'مسجد القائم (عج)', 'Qaem Mosque'],
    upL:['مناسبت‌های پیش رو', 'المناسبات القادمة', 'Coming occasions'], upNone:['مناسبتی در پیش نیست', 'لا مناسبات قادمة', 'No upcoming occasions'], todayL:['امروز', 'اليوم', 'Today'],
    tehranT:['به وقت تهران', 'بتوقيت طهران', 'Tehran time'],
    zekrTap:['برای شمارش بزن', 'اضغط للعدّ', 'Tap to count'], wkL:['برنامه‌ی هفتگی', 'البرنامج الأسبوعي', 'Weekly schedule'],
    live:['در حال برگزاری', 'قيد الإقامة', 'Happening now'], liveS:['زنده', 'مباشر', 'Live'], elapsed:['{d} از شروع گذشته', 'مضى {d} على البدء', 'started {d} ago'],
    tonight:['امشب', 'الليلة', 'Tonight'], friEve:['شب جمعه', 'ليلة الجمعة', 'Friday eve'], iftar:['افطار', 'الإفطار', 'Iftar'],
    snoozeBtn:['{n} دقیقه بعد', 'بعد {n} د', 'In {n} min'], openBtn:['باز کردن', 'فتح', 'Open'], icsBtn:['تقویم', 'التقويم', 'Calendar'],
    tapPlus:['افزودن یکی', 'إضافة واحدة', 'Add one'], tapMinus:['کم کردن یکی', 'إنقاص واحدة', 'Remove one'], tmrLeftL:['تایمر · مانده', 'المؤقت · المتبقي', 'Timer · left'], tmrPausedL:['تایمر · متوقف', 'المؤقت · متوقف', 'Timer · paused'], tmrLeftS:['مانده', 'المتبقي', 'left'], tmrPausedS:['متوقف', 'متوقف', 'paused'], today:['امروز', 'اليوم', 'Today'],
    /* تنظیمات */
    onT:['نمایش کپسول جادویی', 'إظهار الكبسولة السحرية', 'Show magic capsule'], onH:['اوقات، مراسم و ساعت بالای صفحه', 'الأوقات والمراسم والساعة أعلى الصفحة', 'Times, events and clock at the top'],
    modeL:['زمان نمایش', 'وقت الظهور', 'When to show'], mAlways:['همیشه', 'دائماً', 'Always'], mAlerts:['فقط یادآوری‌ها', 'التنبيهات فقط', 'Reminders only'],
    presetL:['الگوی آماده', 'نمط جاهز', 'Quick preset'], pSimple:['ساده', 'بسيط', 'Simple'], pBal:['متعادل', 'متوازن', 'Balanced'], pFull:['کامل', 'كامل', 'Full'],
    g_general:['کلی', 'عام', 'General'], g_look:['ظاهر', 'المظهر', 'Look'], g_content:['محتوا', 'المحتوى', 'Content'], g_alerts:['یادآوری', 'التنبيه', 'Alerts'], g_motion:['حرکت', 'الحركة', 'Motion'],
    styleL:['سبک کپسول', 'نمط الكبسولة', 'Capsule style'], sBlack:['مشکی', 'داكن', 'Black'], sGlass:['شیشه‌ای', 'زجاجي', 'Glass'], sTheme:['رنگ تم', 'لون السمة', 'Theme'],
    glowL:['رنگ درخشش', 'لون التوهج', 'Glow colour'], gSky:['آسمان', 'السماء', 'Sky'], gTheme:['تم', 'السمة', 'Theme'], gGold:['طلایی', 'ذهبي', 'Gold'], gOff:['خاموش', 'إيقاف', 'Off'],
    sizeL:['اندازه', 'الحجم', 'Size'], zS:['کوچک', 'صغير', 'Small'], zM:['معمولی', 'عادي', 'Normal'], zL:['بزرگ', 'كبير', 'Large'],
    topL:['فاصله از بالا', 'المسافة من الأعلى', 'Distance from top'], tN:['نزدیک لبه', 'قريب', 'Close'], tM:['معمولی', 'عادي', 'Normal'], tF:['پایین‌تر', 'أسفل', 'Lower'],
    breatheT:['نور نفس‌کشنده', 'توهج هادئ', 'Breathing glow'], breatheH:['درخشش آرام و ملایم دور کپسول', 'توهج لطيف حول الكبسولة', 'A calm, gentle glow'],
    pagesL:['صفحه‌های قرص', 'صفحات الكبسولة', 'Pill pages'], pgPrayer:['اذان', 'الأذان', 'Adhan'], pgEvent:['مراسم', 'المراسم', 'Events'], pgClock:['ساعت', 'الساعة', 'Clock'], pgDate:['تاریخ', 'التاريخ', 'Date'], pgSal:['صلوات', 'الصلوات', 'Salawat'], pgOcc:['مناسبت بعدی', 'المناسبة القادمة', 'Next occasion'], pgZekr:['ذکر روز', 'ذكر اليوم', 'Daily dhikr'], pgAll:['همه', 'الكل', 'All'], pgDef:['پیش‌فرض', 'الافتراضي', 'Default'],
    rotL:['چرخش خودکار بین صفحه‌ها', 'التبديل التلقائي', 'Auto-rotate pages'], rot0:['ثابت', 'ثابت', 'Off'], rotN:['{n} ثانیه', '{n} ث', '{n}s'],
    primL:['وقتی چرخش خاموش است', 'عند إيقاف التبديل', 'When rotation is off'], prAuto:['نزدیک‌ترین', 'الأقرب', 'Nearest'],
    clockPillT:['ساعت کنار قرص', 'ساعة بجانب الكبسولة', 'Clock beside the pill'], clockPillH:['ساعت تهران همیشه کنار شمارش', 'توقيت طهران بجانب العدّاد', 'Tehran time next to the countdown'],
    clockSecT:['ثانیه در ساعت', 'ثواني في الساعة', 'Seconds on clock'], clockSecH:['ثانیه‌ها زنده می‌غلتند', 'الثواني تدور مباشرة', 'Seconds roll live'],
    secT:['ثانیه در شمارش معکوس', 'ثواني في العدّ التنازلي', 'Seconds in countdown'], secH:['برای کمتر از یک ساعت', 'لأقل من ساعة', 'Under one hour'],
    showL:['بخش‌های کارت بازشده', 'أقسام البطاقة المفتوحة', 'Sections in the open card'], shClock:['ساعت', 'الساعة', 'Clock'], shPrayer:['اوقات شرعی', 'أوقات الصلاة', 'Prayer times'], shEvent:['مراسم', 'المراسم', 'Events'], shDate:['تاریخ و مناسبت', 'التاريخ والمناسبة', 'Date & occasion'], shZekr:['ذکر روز', 'ذكر اليوم', 'Dhikr'], shSal:['صلوات‌شمار', 'عدّاد الصلوات', 'Salawat'],
    ramT:['افطار در ماه رمضان', 'الإفطار في رمضان', 'Iftar in Ramadan'], ramH:['برچسب «افطار» برای اذان مغرب', 'وسم «الإفطار» للمغرب', 'Label Maghrib as Iftar'],
    eveT:['شب مناسبت‌ها', 'ليالي المناسبات', 'Eve of occasions'], eveH:['مثل «امشب شب جمعه» یا شب شهادت‌ها', 'مثل «الليلة ليلة الجمعة»', 'e.g. “Tonight is Friday eve”'],
    liveT:['«در حال برگزاری»', '«قيد الإقامة»', '“Happening now”'], liveH:['وسط مجلس، به‌جای شمارش معکوس', 'أثناء المجلس بدل العدّ التنازلي', 'During a gathering instead of a countdown'],
    durL:['مدت مجلس', 'مدة المجلس', 'Gathering length'], durN:['{n} دقیقه', '{n} د', '{n} min'],
    alPL:['یادآوری پیش از اذان', 'تنبيه قبل الأذان', 'Remind before Adhan'], off:['خاموش', 'إيقاف', 'Off'], minN:['{n} دقیقه', '{n} د', '{n} min'],
    adhL:['کدام اذان‌ها یادآوری شوند', 'أي أذان يُذكَّر به', 'Which times to remind'], adFajr:['صبح', 'الفجر', 'Fajr'], adSun:['طلوع', 'الشروق', 'Sunrise'], adDhuhr:['ظهر', 'الظهر', 'Dhuhr'], adMaghrib:['مغرب', 'المغرب', 'Maghrib'],
    alEL:['یادآوری پیش از مراسم', 'تنبيه قبل المراسم', 'Remind before events'], evOnL:['کدام مراسم یادآوری شوند', 'أي مراسم يُذكَّر بها', 'Which events to remind'], evMajles:['مجلس هفتگی', 'المجلس الأسبوعي', 'Weekly gathering'], evNodbeh:['دعای ندبه', 'دعاء الندبة', 'Dua Nudbah'],
    stT:['اعلان لحظه‌ی شروع', 'تنبيه لحظة البدء', 'Alert at start time'], stH:['وقتی اذان یا مراسم شروع می‌شود', 'عند بدء الأذان أو المراسم', 'When the Adhan or event begins'],
    actT:['دکمه‌های سریع', 'أزرار سريعة', 'Quick buttons'], actH:['«چند دقیقه بعد»، باز کردن صفحه و تقویم', '«لاحقاً» وفتح الصفحة والتقويم', 'Snooze, open page and calendar'],
    asL:['مدت نمایش یادآوری', 'مدة ظهور التنبيه', 'Reminder duration'], secN:['{n} ثانیه', '{n} ث', '{n}s'],
    snL:['«چند دقیقه بعد»', '«لاحقاً»', 'Snooze for'],
    quietT:['ساعت سکوت', 'ساعات الهدوء', 'Quiet hours'], quietH:['بدون صدا و لرزش', 'بدون صوت واهتزاز', 'No sound or vibration'], qFrom:['از ساعت', 'من', 'From'], qTo:['تا ساعت', 'إلى', 'Until'],
    vbT:['لرزش یادآوری', 'اهتزاز التنبيه', 'Reminder vibration'], vbH:['فقط اندروید', 'أندرويد فقط', 'Android only'],
    hapT:['لرزش هنگام لمس', 'اهتزاز عند اللمس', 'Touch haptics'], hapH:['لرزش خیلی کوتاه هنگام باز و بسته شدن', 'اهتزاز خفيف عند الفتح والإغلاق', 'A tiny tick when opening and closing'],
    sdT:['صدای یادآوری', 'صوت التنبيه', 'Reminder sound'], sdH:['زنگ ملایم هنگام یادآوری', 'نغمة هادئة عند التنبيه', 'A soft chime'], toneL:['آهنگ', 'النغمة', 'Tone'], tBell:['زنگ', 'جرس', 'Bell'], tDrop:['قطره', 'قطرة', 'Drop'], tFlute:['نی', 'ناي', 'Flute'],
    motionL:['سبک حرکت', 'نمط الحركة', 'Motion style'], moSoft:['نرم', 'ناعم', 'Soft'], moLively:['پرجنب‌وجوش', 'حيوي', 'Lively'], moMin:['ساده', 'بسيط', 'Minimal'],
    hideT:['پنهان شدن هنگام پایین رفتن', 'الإخفاء عند التمرير', 'Hide while scrolling'], hideH:['با بالا رفتن صفحه دوباره پیدا می‌شود', 'يظهر عند الصعود', 'Returns when you scroll up'],
    prev:['پیش‌نمایش یادآوری', 'معاينة التنبيه', 'Preview a reminder'], prev2:['پیش‌نمایش لحظه‌ی شروع', 'معاينة لحظة البدء', 'Preview start alert'], reset:['بازنشانی همه‌ی تنظیمات', 'إعادة ضبط الإعدادات', 'Reset all settings'],
    tmrT:['تایمر', 'مؤقّت', 'Timer'], tmrDone:['تایمر به پایان رسید', 'انتهى المؤقّت', 'Timer finished'], tmrRestart:['تکرار تایمر', 'إعادة المؤقّت', 'Repeat timer'],
    tmrPause:['توقف', 'إيقاف', 'Pause'], tmrResume:['ادامه', 'متابعة', 'Resume'], tmrCancel:['لغو', 'إلغاء', 'Cancel'], tmrAdd:['+۱ دقیقه', '+١ د', '+1 min'], tmrGo:['شروع', 'ابدأ', 'Start'],
    tmrMinN:['{n} دقیقه', '{n} د', '{n} min'], tmrCus:['زمان دلخواه', 'وقت مخصص', 'Custom'], tmrOf:['تایمر {d}', 'مؤقّت {d}', '{d} timer'],
    shTimer:['تایمر', 'المؤقّت', 'Timer'], satT:['حباب کناری', 'الفقاعة الجانبية', 'Side bubble'], satH:['صفحه‌ی بعدی، کوچک کنار قرص (سمت راست)', 'الصفحة التالية بجانب الكبسولة', 'The next page, small beside the pill'],
    tmAlT:['آلارم پایان تایمر', 'منبّه انتهاء المؤقّت', 'Timer alarm'], tmAlH:['صدا و لرزش، حتی در ساعت سکوت', 'صوت واهتزاز حتى في ساعات الهدوء', 'Sound and vibration, even in quiet hours'],
    back:['بازگشت', 'رجوع', 'Back'], pgGeneral:['حالت نمایش', 'وضع العرض', 'Display mode'], pgLook:['ظاهر و حرکت', 'المظهر والحركة', 'Look & motion'], pgPill:['قرص', 'الكبسولة', 'Pill'], pgCard:['کارت بازشده', 'البطاقة', 'Card'], pgAlerts:['یادآوری‌ها', 'التنبيهات', 'Reminders'], pgSound:['صدا و لرزش', 'الصوت والاهتزاز', 'Sound & haptics'], pgMotion:['حرکت', 'الحركة', 'Motion'],
    pagesN:['{n} صفحه', '{n} صفحات', '{n} pages'], sectN:['{n} بخش', '{n} أقسام', '{n} sections'], sumAl:['اذان {a} · مراسم {e}', 'الأذان {a} · المراسم {e}', 'Adhan {a} · Events {e}'], onWord:['روشن', 'مفعّل', 'On'],
    note:['یادآوری‌ها فقط وقتی سایت باز است نشان داده می‌شوند.', 'تظهر التنبيهات فقط أثناء فتح الموقع.', 'Reminders only appear while the site is open.']
  };
  function tt(k){ var a = D[k]; if(!a) return ''; return a[{ fa:0, ar:1, en:2 }[lang()]] || a[0]; }
  function tpl(s, o){ return s.replace(/\{(\w+)\}/g, function(m, k){ return o[k] !== undefined ? o[k] : m; }); }

  /* ---------- آیکن‌ها و رنگ‌ها ---------- */
  var ICONS = {
    fajr:'<path d="M3 19h18M7.5 19a4.5 4.5 0 0 1 9 0"/><path d="M12 2.6l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z"/><path d="M5.2 12.2h2.2M16.6 12.2h2.2"/>',
    sunrise:'<path d="M3 19h18M7 19a5 5 0 0 1 10 0"/><path d="M12 8.2v2.4M5.2 12l1.6 1.6M18.8 12l-1.6 1.6M2.8 15.8h2M19.2 15.8h2"/>',
    dhuhr:'<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>',
    maghrib:'<path d="M3 15.5h18M7 15.5a5 5 0 0 1 10 0"/><path d="M7 19h10M10 22h4"/><path d="M19.6 3.6a3 3 0 1 1-3.2 3.8 2.4 2.4 0 0 0 3.2-3.8z"/>',
    event:'<path d="M12 2.4c1.6 2 2.9 3.2 2.9 5a2.9 2.9 0 0 1-5.8 0c0-1.8 1.3-3 2.9-5z"/><rect x="8" y="12.2" width="8" height="8.8" rx="2"/><path d="M12 10.6v1.6"/>',
    clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    date:'<rect x="4" y="5" width="16" height="15" rx="3.5"/><path d="M4 10h16M9 3v4M15 3v4M8.5 14.2h.01M12 14.2h.01M15.5 14.2h.01M8.5 17.2h.01M12 17.2h.01"/>',
    heart:'<path d="M12 20.5s-7-4.3-7-9.7a3.9 3.9 0 0 1 7-2.4 3.9 3.9 0 0 1 7 2.4c0 5.4-7 9.7-7 9.7z"/><path d="M19.2 2.2l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    grid:'<rect x="4" y="4" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2"/>',
    gear:'<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    up:'<path d="M6 15l6-6 6 6"/>', plus:'<path d="M12 5v14M5 12h14"/>', moon:'<path d="M19.5 14.2A7.6 7.6 0 1 1 9.8 4.5a6.1 6.1 0 0 0 9.7 9.7z"/><path d="M17.6 2.8l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    play:'<path d="M8 5.5v13l11-6.5z"/>', timer:'<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.6 1.6M9.5 3h5M12 3v3"/>',
    pause:'<path d="M9 6.5v11M15 6.5v11"/>', minus:'<path d="M5.5 12h13"/>', zekr:'<circle cx="12.0" cy="2.9" r="1.5"/><circle cx="16.5" cy="4.7" r="1.5"/><circle cx="18.3" cy="9.2" r="1.5"/><circle cx="16.5" cy="13.7" r="1.5"/><circle cx="7.5" cy="13.7" r="1.5"/><circle cx="5.7" cy="9.2" r="1.5"/><circle cx="7.5" cy="4.7" r="1.5"/><path d="M12 15.7v2.6"/><path d="M10.6 21.6h2.8M12 18.3l-1.4 3.3M12 18.3l1.4 3.3"/>', x:'<path d="M7 7l10 10M17 7 7 17"/>',
    book:'<path d="M5 4.5h10a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h10M9.5 8h5"/>',
    bell:'<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 21h4"/>',
    tap:'<circle cx="12" cy="12" r="2.2"/><circle cx="12" cy="12" r="6.2"/><path d="M12 2.5v1.6M12 19.9v1.6M2.5 12h1.6M19.9 12h1.6"/>',
    hold:'<circle cx="12" cy="12" r="8.5" stroke-dasharray="3 2.4"/><circle cx="12" cy="12" r="2.6"/>',
    drag:'<path d="M12 4v16M7 9l5-5 5 5M7 15l5 5 5-5"/>',
    swap:'<path d="M4 10a8 8 0 0 1 14-3.5L20 9M20 4v5h-5M20 14a8 8 0 0 1-14 3.5L4 15M4 20v-5h5"/>',
    fan:'<path d="M4 15a8 8 0 0 1 16 0"/><circle cx="4.8" cy="16.2" r="1.7"/><circle cx="12" cy="7.2" r="1.7"/><circle cx="19.2" cy="16.2" r="1.7"/><path d="M12 20.5v.01"/>',
    hello:'<circle cx="12" cy="12" r="8.5"/><path d="M8.4 13.6c.9 1.7 2.1 2.5 3.6 2.5s2.7-.8 3.6-2.5"/><path d="M9 9.6h.01M15 9.6h.01"/>',
    sparkle:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M18.5 16l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>'
  };
  var COL = { hello:'176,184,196', prayer:'255,203,61', event:'255,142,118', clock:'125,211,252', date:'125,211,252', zekr:'134,239,172', sal:'249,168,212', night:'176,160,255', timer:'255,159,10', guide:'196,181,253' };
  function svg(name){ return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || ICONS.dhuhr) + '</svg>'; }

  /* ---------- فنر (spring) ---------- */
  var HAS_LINEAR = !!(window.CSS && CSS.supports && CSS.supports('animation-timing-function', 'linear(0, 1)'));
  function spring(k, c, m){
    if(!HAS_LINEAR) return { easing:'cubic-bezier(.22,1.12,.36,1)', duration:560 };
    var w0 = Math.sqrt(k / m), z = c / (2 * Math.sqrt(k * m)), wd = w0 * Math.sqrt(Math.max(1e-6, 1 - z * z)), t, i;
    function f(t){ return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + (z * w0 / wd) * Math.sin(wd * t)); }
    var settle = 0;
    for(t = 0; t < 3; t += 1 / 120){ if(Math.abs(1 - f(t)) > 0.0015) settle = t; }
    settle = Math.min(2.2, settle + 0.05);
    var n = Math.max(28, Math.round(settle * 60)), pts = [];
    for(i = 0; i <= n; i++) pts.push(+f(settle * i / n).toFixed(4));
    pts[n] = 1;
    return { easing:'linear(' + pts.join(',') + ')', duration:Math.round(settle * 1000) };
  }
  var SP = { soft:null, open:null };
  function calm(){ return mqReduce() || cfg.motion === 'minimal'; }
  function buildSprings(){
    var m = cfg.motion;
    if(m === 'lively'){ SP.soft = spring(240, 16, 1); SP.open = spring(200, 15, 1.05); }
    else if(m === 'minimal'){ SP.soft = SP.open = { easing:'ease-out', duration:170 }; }
    else { SP.soft = spring(230, 26, 1); SP.open = spring(260, 28, 1); }
    try{ html.style.setProperty('--isl-spring', m === 'minimal' ? 'ease-out' : spring(m === 'lively' ? 220 : 175, m === 'lively' ? 15 : 22, 1).easing); }catch(e){}
    html.classList.toggle('isl-min', calm());
  }

  /* ---------- ارقام غلتان ---------- */
  function Roll(el){ this.el = el; this.t = ''; this.slots = []; this.plain = false; el.setAttribute('aria-hidden', 'true'); }
  /* متن حرف‌دار (مثل «اکنون» یا «در حال برگزاری») نباید حرف‌به‌حرف تکه شود: در جعبه‌ی LTR حروف برعکس و جدا از هم می‌شدند */
  var ROLL_TEXT = /[^0-9\u0660-\u0669\u06F0-\u06F9:.\s\u066B\u066C\u200E\u200F+\-]/;
  Roll.prototype.build = function(t){
    var el = this.el; el.textContent = ''; this.slots = [];
    if(ROLL_TEXT.test(t)){
      var pl = doc.createElement('span'); pl.className = 'rl-t'; pl.textContent = t;
      el.appendChild(pl); this.t = t; this.plain = true; return;
    }
    this.plain = false;
    for(var i = 0; i < t.length; i++){
      var s = doc.createElement('span'), ch = t.charAt(i);
      s.className = 'rl' + (/[0-9\u0660-\u0669\u06F0-\u06F9]/.test(ch) ? ' d' : '');
      s.innerHTML = '<span class="rl-i"><span>' + esc(ch) + '</span></span>';
      el.appendChild(s); this.slots.push(s);
    }
    this.t = t;
  };
  Roll.prototype.set = function(t, animate){
    if(t === this.t) return false;
    var old = this.t;
    if(!animate || !old || old.length !== t.length || this.plain || ROLL_TEXT.test(t) || calm() || !Element.prototype.animate){ this.build(t); return true; }
    this.t = t;
    for(var i = 0; i < t.length; i++){
      var o = old.charAt(i), n = t.charAt(i);
      if(o === n) continue;
      (function(slot, o, n){
        slot.innerHTML = '<span class="rl-i"><span>' + esc(o) + '</span><span>' + esc(n) + '</span></span>';
        var inner = slot.firstChild, a = inner.animate([{ transform:'translateY(0)' }, { transform:'translateY(-50%)' }], { duration:460, easing:'cubic-bezier(.3,1.2,.4,1)' });
        a.onfinish = function(){ slot.innerHTML = '<span class="rl-i"><span>' + esc(n) + '</span></span>'; };
      })(this.slots[i], o, n);
    }
    return true;
  };

  /* ---------- ساخت DOM ---------- */
  var root = doc.createElement('div');
  root.className = 'isl'; root.setAttribute('data-hide', ''); root.setAttribute('data-state', 'idle');
  root.setAttribute('role', 'button'); root.tabIndex = 0; root.setAttribute('aria-expanded', 'false'); root.setAttribute('aria-hidden', 'true');
  root.innerHTML =
    '<div class="isl-s isl-c"><div class="isl-cv"><span class="isl-cw"><span class="isl-ring"><svg class="rg" viewBox="0 0 24 24" aria-hidden="true"><circle class="tr" cx="12" cy="12" r="10.5"/><circle class="pg" cx="12" cy="12" r="10.5"/></svg><span class="isl-ic"></span></span>' +
      '<span class="isl-lb"></span><span class="isl-tm"><b class="rl-box"></b><i></i></span><span class="isl-ck"><b class="rl-box"></b></span></span>' +
      '<span class="isl-tw"><button type="button" class="isl-tb p" data-a="tpause">' + svg('pause') + '</button><button type="button" class="isl-tb x" data-a="tcancel">' + svg('x') + '</button><span class="isl-tt"><small></small><b class="rl-box"></b></span><span class="isl-ring"><svg class="rg" viewBox="0 0 24 24" aria-hidden="true"><circle class="tr" cx="12" cy="12" r="10.5"/><circle class="pg" cx="12" cy="12" r="10.5"/></svg><span class="isl-ic"></span></span><i class="isl-tbar"></i></span></div></div>' +
    '<div class="isl-s isl-a"><div class="isl-ar"><span class="isl-aic"></span><span class="isl-at"><b></b><small></small></span><span class="isl-acd rl-box"></span></div><div class="isl-ab"></div><i class="isl-abar"></i></div>' +
    '<div class="isl-s isl-x"></div>';
  body.appendChild(root);
  var scrim = doc.createElement('div'); scrim.className = 'isl-scrim'; body.appendChild(scrim);
  var sr = doc.createElement('div'); sr.className = 'isl-sr'; sr.setAttribute('role', 'status'); sr.setAttribute('aria-live', 'polite'); body.appendChild(sr);
  var sat = doc.createElement('div'); sat.className = 'isl-sat'; sat.setAttribute('role', 'button'); sat.tabIndex = -1; sat.setAttribute('aria-hidden', 'true');
  sat.innerHTML = '<span class="isl-ring"><svg class="rg" viewBox="0 0 24 24" aria-hidden="true"><circle class="tr" cx="12" cy="12" r="10.5"/><circle class="pg" cx="12" cy="12" r="10.5"/></svg><span class="isl-ic"></span></span>';
  body.appendChild(sat);
  var sPg = sat.querySelector('.pg'), sIc = sat.querySelector('.isl-ic');

  var cL = root.querySelector('.isl-c'), cV = root.querySelector('.isl-cv'), aL = root.querySelector('.isl-a'), xL = root.querySelector('.isl-x');
  var cIc = cL.querySelector('.isl-ic'), cLb = cL.querySelector('.isl-lb'), cU = cL.querySelector('.isl-tm i'), cPg = cL.querySelector('.pg'), cCk = cL.querySelector('.isl-ck');
  var rN = new Roll(cL.querySelector('.isl-tm b')), rCk = new Roll(cCk.querySelector('b'));
  var aIc = aL.querySelector('.isl-aic'), aTi = aL.querySelector('.isl-at b'), aSu = aL.querySelector('.isl-at small'), aAb = aL.querySelector('.isl-ab');
  var rAcd = new Roll(aL.querySelector('.isl-acd'));
  var tPause = cL.querySelector('.isl-tb.p'), tCancel = cL.querySelector('.isl-tb.x'), tLab = cL.querySelector('.isl-tt small'), tBar = cL.querySelector('.isl-tbar'), rT = new Roll(cL.querySelector('.isl-tt b'));
  var LAYERS = { compact:cL, alert:aL, expanded:xL };
  var tRing = cL.querySelector('.isl-tw .pg'), tRIc = cL.querySelector('.isl-tw .isl-ic'); tRIc.innerHTML = svg('timer');

  /* ---------- مقیاس، فاصله و ظاهر ---------- */
  var SIZE_K = [0.92, 1, 1.12], TOP_PX = [10, 18, 28];
  function ch(){ return Math.round(36 * SIZE_K[cfg.size]); }
  function applyLook(){
    root.toggleAttribute('data-breathe', !!cfg.breathe);
    [root, sat].forEach(function(el){
      el.setAttribute('data-style', cfg.style); el.setAttribute('data-glow', cfg.glow);
      el.style.setProperty('--k', String(SIZE_K[cfg.size])); el.style.setProperty('--ch', ch() + 'px'); el.style.setProperty('--isl-top', TOP_PX[cfg.top] + 'px');
    });
  }

  /* ---------- اندازه‌ها و حرکت فنری ---------- */
  var state = 'idle', tgt = { w:14, h:14, r:7 }, animA = null, animB = null, settleT = 0;
  function vw(){ return Math.max(280, html.clientWidth || window.innerWidth || 360); }
  function vh(){ return Math.max(320, window.innerHeight || 640); }

  function dims(st){
    var w, h, r;
    if(st === 'idle') return { w:14, h:14, r:7 };
    if(st === 'compact'){
      cL.style.setProperty('--w', 'max-content');
      h = ch(); w = tm ? timerW() : Math.min(cL.offsetWidth, Math.min(300, capW())); r = Math.round(h / 2);
      cL.style.setProperty('--w', w + 'px');
      return { w:w, h:h, r:r };
    }
    if(st === 'alert'){
      w = Math.min(348, vw() - 24);
      aL.style.setProperty('--w', w + 'px'); aL.style.setProperty('--h', 'auto');
      h = aL.offsetHeight; aL.style.setProperty('--h', h + 'px');
      return { w:w, h:h, r:Math.min(40, Math.round(h / 2)) };
    }
    w = Math.min(372, vw() - 24);
    xL.style.setProperty('--w', w + 'px'); xL.style.setProperty('--h', 'auto');
    h = Math.min(xL.scrollHeight, Math.max(220, vh() - 130));
    xL.classList.toggle('dtf', !!expKind && xL.scrollHeight <= Math.max(220, vh() - 130) + 1);
    xL.style.setProperty('--h', h + 'px');
    return { w:w, h:h, r:30 };
  }

  /* اگر در حین انیمیشن بازشدن، بیش از ۴۰٪ فریم‌ها کندتر از ~۳۰fps بود (سه بار پشت‌سرهم)، حالت سبک روشن می‌شود */
  var probing = false, liteN = 0;
  try{ if(sessionStorage.getItem('kzm-isl-lite') === '1') html.classList.add('isl-lite'); }catch(_){}
  try{ var dMem = navigator.deviceMemory; if(dMem && dMem <= 1) html.classList.add('isl-lite'); }catch(_){}
  function probe(ms){
    if(probing || html.classList.contains('isl-lite') || !window.requestAnimationFrame) return;
    probing = true;
    var last = 0, n = 0, slow = 0, t0 = 0;
    function f(t){
      if(document.hidden){ probing = false; return; }
      if(!t0) t0 = t;
      if(last){ n++; if(t - last > 34) slow++; }
      last = t;
      if(t - t0 < Math.min(ms, 700)){ requestAnimationFrame(f); return; }
      probing = false;
      if(n >= 3 && ((t - t0) / n > 42 || (n >= 10 && slow / n > .5))){
        if(++liteN >= 2){ html.classList.add('isl-lite'); try{ sessionStorage.setItem('kzm-isl-lite', '1'); }catch(_){} }
      } else liteN = Math.max(0, liteN - 1);
    }
    requestAnimationFrame(f);
  }
  function morphTo(d, sp){
    var cs = getComputedStyle(root);
    var fw = parseFloat(cs.width) || d.w, fh = parseFloat(cs.height) || d.h, fr = parseFloat(cs.borderTopLeftRadius) || d.r;
    if(animA){ animA.cancel(); animA = null; }
    if(animB){ animB.cancel(); animB = null; }
    tgt = d;
    root.style.setProperty('--isl-w', d.w + 'px'); root.style.setProperty('--isl-h', d.h + 'px'); root.style.setProperty('--isl-r', d.r + 'px');
    moveSat(fw, d.w, sp);
    if(!root.animate || (Math.abs(fw - d.w) < 0.5 && Math.abs(fh - d.h) < 0.5 && Math.abs(fr - d.r) < 0.5)) return;
    var s = calm() ? { easing:'ease-out', duration:170 } : sp;
    probe(s.duration);
    animA = root.animate([{ width:fw + 'px', height:fh + 'px' }, { width:d.w + 'px', height:d.h + 'px' }], { duration:s.duration, easing:s.easing });
    animB = root.animate([{ borderRadius:fr + 'px' }, { borderRadius:d.r + 'px' }], { duration:Math.min(s.duration, calm() ? 170 : 520), easing:'cubic-bezier(.2,.8,.2,1)' });
    var a = animA, b = animB;
    a.onfinish = function(){ if(animA === a) animA = null; satSync(); };
    b.onfinish = function(){ if(animB === b) animB = null; satSync(); };
  }

  function setLayers(next){
    Object.keys(LAYERS).forEach(function(k){
      var el = LAYERS[k], on = (k === next);
      el.classList.toggle('on', on); el.classList.remove('settled');
      if('inert' in el) el.inert = !on;
      el.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    clearTimeout(settleT);
    settleT = setTimeout(function(){ var el = LAYERS[state]; if(el) el.classList.add('settled'); }, 1000);
  }

  function setState(next){
    if(next === state) return;
    var prev = state;
    state = next;
    root.setAttribute('data-state', next);
    root.setAttribute('aria-expanded', String(next === 'expanded'));
    root.setAttribute('aria-hidden', next === 'idle' ? 'true' : 'false');
    if(next === 'expanded'){ root.setAttribute('role', 'dialog'); root.removeAttribute('tabindex'); root.setAttribute('aria-label', tt('title')); }
    else { root.setAttribute('role', 'button'); root.tabIndex = 0; }
    setLayers(next);
    scrim.classList.toggle('on', next === 'expanded');
    if(next === 'idle') root.setAttribute('data-hide', ''); else root.removeAttribute('data-hide');
    morphTo(dims(next), (next === 'expanded' || prev === 'expanded') ? SP.open : SP.soft);
    if(next === 'compact') labelCompact();
    html.classList.toggle('isl-lock', next === 'expanded');
    if(next === 'expanded') lockY = window.pageYOffset || 0;
    padSync(); rotSync(); satSync();
    if(next === 'expanded') busy(true); else if(prev === 'expanded') busy(false);
    lockSync();
  }
  var lockY = 0;
  var padV = '';
  function padSync(){
    var on = !!(cfg.on && (cfg.mode === 'always' || (tm && state !== 'idle'))), v = (TOP_PX[cfg.top] + ch() - 6) + 'px';
    if(v !== padV){ padV = v; html.style.setProperty('--isl-pad', v); }
    html.classList.toggle('isl-pad', on);
  }
  function refreshDims(){ if(state !== 'idle') morphTo(dims(state), SP.soft); }

  /* ---------- مدل داده ---------- */
  var fmtCache = {}, LOC = { fa:'fa-IR-u-ca-persian', ar:'ar-EG-u-ca-persian', en:'en-GB-u-ca-persian' };
  function dfmt(opts, key){
    var ck = lang() + key;
    if(!fmtCache[ck]){ try{ fmtCache[ck] = new Intl.DateTimeFormat(LOC[lang()], Object.assign({ timeZone:'Asia/Tehran' }, opts)); }catch(e){ fmtCache[ck] = { format:function(){ return ''; } }; } }
    return fmtCache[ck];
  }
  function dateLine(s, withYear){
  var m = s.day && s.day.today;
  if(m) return m.weekday + ' ' + C.fa(m.jd) + ' ' + C.jalaliMonthName(m.jm) + (withYear ? ' ' + C.fa(m.jy) : '');
  return dfmt(withYear ? { weekday:'long', day:'numeric', month:'long', year:'numeric' } : { weekday:'long', day:'numeric', month:'long' }, withYear ? 'full' : 'wd').format(new Date());
}
function clockStr(t, sec){ var f = C.fa; return f(p2(t.h)) + ':' + f(p2(t.mi)) + (sec ? ':' + f(p2(t.s)) : ''); }

  var dayCache = { k:'', v:null };
  function dayModel(s){
    var k = s.jdn + '|' + lang();
    if(dayCache.k !== k){ dayCache = { k:k, v:{ today:C.todayModel(s.jdn), tomorrow:C.todayModel(s.jdn + 1) } }; }
    return dayCache.v;
  }
  function snap(){
    C.setLang(lang());
    var t = C.tehranParts(new Date()), jdn = C.g2jdn(t.y, t.m, t.d), dow = C.jdnWeekday(jdn);
    var s = { t:t, jdn:jdn, dow:dow, pm:C.prayerModel(t, jdn), evs:C.eventsModel(t, dow) };
    s.today = C.prayerFor(t.y, t.m, t.d, C.tz());
    s.nowH = t.h + t.mi / 60 + t.s / 3600;
    s.day = dayModel(s);
    s.ram = !!(cfg.ramadan && s.day.today && s.day.today.lunar && s.day.today.lunar.m === 9);
    s.live = liveEvent(s);
    s.eve = eveInfo(s);
    return s;
  }
  function liveEvent(s){
    if(!cfg.liveEv) return null;
    var nowMin = s.t.h * 60 + s.t.mi + s.t.s / 60, out = null;
    C.WEEKLY.forEach(function(ev){
      if(s.dow !== ev.dow) return;
      var el = nowMin - ev.hour * 60;
      if(el >= 0 && el < cfg.evDur) out = { ev:ev, elapsed:el, progress:el / cfg.evDur };
    });
    return out;
  }
  function eveInfo(s){
    if(!cfg.eve || s.nowH < s.today.maghrib) return null;
    var tm = s.day.tomorrow;
    if(tm && tm.items && tm.items.length) return { title:tm.items[0].title + (tm.items.length > 1 ? ' …' : ''), tone:tm.items[0].tone };
    if(s.dow === 4) return { title:tt('friEve'), tone:'other' };
    return null;
  }
  function prayerLabel(s, key){
    var n = C.PRAYER_NAMES[lang()][key];
    return (s.ram && key === 'maghrib') ? tt('iftar') + ' · ' + n : n;
  }

  /* ---------- صفحه‌های قرص ---------- */
  function pageOk(k){ if(k !== 'occasion') return true; var d = S && S.day && S.day.today; return !S || !!(d && d.next); }
  function pagesList(){ var l = []; ['clock', 'prayer', 'date', 'event', 'guide', 'occasion', 'zekr', 'salavat'].forEach(function(k){ if(cfg.pages[k] && pageOk(k)) l.push(k); }); return l.length ? l : ['prayer']; }
  var pageIdx = 0;
  function intLS(k){ var n = parseInt(lsGet(k), 10); return (isNaN(n) || n < 0) ? 0 : n; }
  function curKind(s){
    if(tmpKind){ if(Date.now() < tmpUntil) return tmpKind; tmpKind = ''; }
    if(cfg.rotate > 0){ var l = pagesList(); return l[pageIdx % l.length]; }
    var p = cfg.primary;
    if(p === 'auto') return (s.evs[0] && s.evs[0].remainMin < s.pm.remainMin) ? 'event' : 'prayer';
    return p;
  }
  function shortRemain(rem){
    var f = C.fa;
    if(rem >= 1440) return { n:f(Math.floor(rem / 1440)), u:tt('unitD') };
    if(rem >= 60){ var tm = Math.ceil(rem); return { n:f(Math.floor(tm / 60)) + ':' + f(p2(tm % 60)), u:tt('unitH') }; }
    if(cfg.seconds){ var ts = Math.max(0, Math.ceil(rem * 60)); return { n:f(p2(Math.floor(ts / 60))) + ':' + f(p2(ts % 60)), u:'' }; }
    return { n:f(Math.max(1, Math.ceil(rem))), u:tt('unitM') };
  }
  function pageModel(kind, s){
    var f = C.fa;
    if(kind === 'guide'){
      return { kind:kind, icon:'book', label:tt('guideP'), n:'', u:'', progress:1, col:COL.guide, roll:false };
    }
    if(kind === 'clock'){
      return { kind:kind, icon:'clock', label:tt('tehranT'), n:clockStr(s.t, cfg.clockSec), u:'',
               progress:(s.t.h * 60 + s.t.mi) / 1440, col:COL.clock, roll:true };
    }
    if(kind === 'date'){
      var m = s.day.today, lab = dateLine(s, false), n = m ? f(m.lunar.d) + ' ' + C.lunarMonthName(m.lunar.m) : '';
      if(s.eve){ lab = tt('tonight') + ' · ' + s.eve.title; n = ''; }
      else if(m && m.items.length){ lab = m.items[0].title; n = ''; }
      return { kind:kind, icon:'date', label:lab, n:n, u:'', progress:(s.t.h * 60 + s.t.mi) / 1440, col:s.eve ? COL.night : COL.date, roll:false };
    }
    if(kind === 'salavat'){
      var c = intLS('kazemiuon-salavat-count-salawat');
      return { kind:kind, icon:'heart', label:tt('salA'), n:f(c), u:'', progress:(c % 100) / 100, col:COL.sal, roll:true };
    }
    if(kind === 'occasion'){
      var dm = s.day.today, nx = dm && dm.next;
      if(!nx) return pageModel('date', s);
      var one = nx.days === 1;
      return { kind:kind, icon:'moon', label:nx.items[0].title + (nx.items.length > 1 ? ' …' : ''), n:one ? C.daysAhead(1) : f(nx.days), u:one ? '' : tt('unitD'),
               progress:clamp(1 - nx.days / 30, 0, 1), col:COL.night, roll:false };
    }
    if(kind === 'zekr'){
      var zk = C.ZEKR_BY_DAY[s.dow], zc = Math.min(intLS(C.zekrKey(s.t)), C.ZEKR_TARGET);
      return { kind:kind, icon:'zekr', label:(zk && zk.text.length <= 24) ? zk.text : tt('zekrL'), n:f(zc), u:'/' + f(C.ZEKR_TARGET),
               progress:zc / C.ZEKR_TARGET, col:COL.zekr, roll:true };
    }
    if(kind === 'event'){
      if(s.live){
        return { kind:kind, icon:'event', label:pick(s.live.ev.title), n:tt('liveS'), u:'', progress:s.live.progress, col:COL.event, roll:false, live:true };
      }
      var it = s.evs[0];
      return { kind:kind, icon:'event', label:pick(it.ev.title), remain:it.remainMin, progress:clamp(1 - it.remainMin / 1440, 0, 1), col:COL.event, roll:true };
    }
    return { kind:'prayer', icon:s.pm.key, label:prayerLabel(s, s.pm.key), remain:s.pm.remainMin, progress:s.pm.progress, col:COL.prayer, roll:true };
  }

  /* ---------- رنگ آسمان خرم‌آباد ---------- */
  var curSky = '';
  function skyRGB(s){
    var tm = s.today, h = s.nowH;
    var pts = [[tm.fajr - 0.8, [70, 88, 205]], [tm.fajr, [96, 190, 225]], [tm.sunrise, [255, 166, 140]], [tm.sunrise + 1.6, [255, 214, 120]], [tm.dhuhr, [255, 238, 170]],
               [tm.maghrib - 1.7, [255, 205, 112]], [tm.maghrib, [255, 138, 92]], [tm.maghrib + 0.8, [150, 108, 230]], [tm.maghrib + 1.9, [70, 88, 205]]];
    if(h <= pts[0][0] || h >= pts[pts.length - 1][0]) return '70,88,205';
    for(var i = 1; i < pts.length; i++){
      if(h <= pts[i][0]){
        var a = pts[i - 1], b = pts[i], u = (h - a[0]) / (b[0] - a[0]);
        return [0, 1, 2].map(function(c){ return Math.round(lerp(a[1][c], b[1][c], u)); }).join(',');
      }
    }
    return '70,88,205';
  }
  function paintSky(s){ var c = skyRGB(s); if(c !== curSky){ curSky = c; root.style.setProperty('--sky', c); } }
  var curAc = '';
  function setAc(rgb){ if(rgb !== curAc){ curAc = rgb; root.style.setProperty('--ac', rgb); } }

  /* ---------- قرص (compact) ---------- */
  var lastSig = '', lastKind = '', iconKey = '';
  function measureCompactW(){ cL.style.setProperty('--w', 'max-content'); return Math.min(cL.offsetWidth, Math.min(300, capW())); }
  function satPossible(){ return !!(cfg.satellite && (tm || (cfg.rotate > 0 && pagesList().length > 1))); }
  function capW(){ return satPossible() ? vw() - 2 * (ch() + 14) : vw() - 24; }
  function timerW(){ var long = tm && timerLeft() >= 3600000; return Math.min(Math.round((long ? 192 : 156) * (ch() / 36)), capW()); }
  function paintCompact(s, force){ if(tm) paintTimerPill(s); else paintCompactMain(s, force); paintSat(s); }
  function paintCompactMain(s, force){
    var kind = curKind(s), m = pageModel(kind, s), n = m.n, u = m.u;
    if(m.remain !== undefined){ var r = shortRemain(m.remain); n = r.n; u = r.u; }
    var ck = (cfg.clockPill && kind !== 'clock') ? clockStr(s.t, cfg.clockSec) : '';
    var sig = m.kind + '|' + m.label + '|' + n + '|' + u + '|' + ck + '|' + (m.live ? 1 : 0);
    if(state !== 'alert' && state !== 'expanded') setAc(m.col);
    if(m.icon !== iconKey){ iconKey = m.icon; cIc.innerHTML = svg(m.icon); }
    cPg.style.strokeDashoffset = String(66 * (1 - clamp(m.progress, 0, 1)));
    cL.classList.toggle('is-live', !!m.live); cL.classList.toggle('is-guide', m.kind === 'guide');
    if(sig === lastSig && !force) return;
    var animate = (m.kind === lastKind) && !force;
    lastSig = sig; lastKind = m.kind;
    cLb.textContent = m.label; cU.textContent = u;
    rN.set(n, animate && m.roll !== false);
    cCk.hidden = !ck; rCk.set(ck, animate);
    var aria = m.label + ' ' + n + ' ' + u + (ck ? ' ' + ck : '');
    root.setAttribute('data-aria', aria);
    if(state === 'compact'){
      root.setAttribute('aria-label', aria);
      var w = measureCompactW();
      if(Math.abs(w - tgt.w) > 1.5 || Math.abs(ch() - tgt.h) > 0.5) morphTo({ w:w, h:ch(), r:Math.round(ch() / 2) }, SP.soft);
    }
  }
  function labelCompact(){ var a = root.getAttribute('data-aria'); if(a) root.setAttribute('aria-label', a); }

  /* چرخش بین صفحه‌ها: محتوا محو و جمع می‌شود، قرص با فنر اندازه‌ی صفحه‌ی بعد را می‌گیرد، محتوای تازه بالا می‌آید */
  var rotT = 0, busyRot = false;
  var ROT_KEY = 'kzm-isl-rot', lastRot = Date.now();
  function rotSave(){ try{ var l = pagesList(); ssSet(ROT_KEY, JSON.stringify({ k:l[pageIdx % l.length], t:lastRot })); }catch(e){} }
  function rotSync(){
    clearInterval(rotT); clearTimeout(rotT); rotT = 0;
    if(state === 'compact' && cfg.on && cfg.rotate > 0 && pagesList().length > 1){
      /* ادامه‌ی چرخش از جایی که صفحه‌ی قبل بود: اولین چرخش بعد از باقی‌مانده‌ی همان دور */
      var per = cfg.rotate * 1000, first = per - (Math.max(0, Date.now() - lastRot) % per);
      if(first < 1500) first += per;
      rotT = setTimeout(function(){ rotStep(); rotT = setInterval(rotStep, per); }, first);
    }
  }
  function swapCompact(fn){
    if(busyRot || calm() || !cV.animate || state !== 'compact'){ fn(); return; }
    busyRot = true;
    var out = cV.animate([{ opacity:1, translate:'0 0', filter:'blur(0px)' }, { opacity:0, translate:'0 -9px', filter:'blur(5px)' }], { duration:200, easing:'cubic-bezier(.5,0,.8,.4)', fill:'forwards' });
    out.onfinish = function(){
      fn();
      cV.animate([{ opacity:0, translate:'0 11px', filter:'blur(6px)' }, { opacity:1, translate:'0 0', filter:'blur(0px)' }], { duration:560, easing:'cubic-bezier(.2,.8,.2,1)' });
      out.cancel(); busyRot = false;
    };
  }
  function rotStep(manual){
    if(manual === true){ if(state !== 'compact' || busyRot) return; }
    else if(doc.hidden || state !== 'compact' || busyRot || drag || fanOn || root.hasAttribute('data-press')) return;
    var l = pagesList(); if(l.length < 2) return;
    pageIdx = (pageIdx + 1) % l.length; tmpKind = ''; lastRot = Date.now(); rotSave();
    var S2 = snap();
    if(tm){ paintSat(S2); return; }
    swapCompact(function(){ paintCompact(S2, true); });
  }

  /* حباب کناری: صفحه‌ی بعدی، کوچک، سمت راست قرص (مثل iOS) */
  var satIcon = '';
  function satWanted(){ return !!(cfg.on && !fanOn && state === 'compact' && !root.hasAttribute('data-sh') && satPossible()); }
  function satSync(){
    var on = satWanted();
    if(on && !sat.classList.contains('on') && !satReady()) on = false;     /* اول قرص جا بیفتد، بعد حباب بیاید */
    if(on) satAlign();
    sat.classList.toggle('on', on); sat.tabIndex = on ? 0 : -1; sat.setAttribute('aria-hidden', String(!on));
    if(on && S) paintSat(S);
  }
  function paintSat(s){
    if(!satWanted()) return;
    var l = pagesList(), kind = tm ? curKind(s) : l[(pageIdx + 1) % l.length], m = pageModel(kind, s);
    sat.style.setProperty('--ac', m.col); sat.style.setProperty('--sky', curSky || '70,88,205');
    sPg.style.strokeDashoffset = String(66 * (1 - clamp(m.progress, 0, 1)));
    if(m.icon !== satIcon){
      var first = !satIcon; satIcon = m.icon; sIc.innerHTML = svg(m.icon); sat.setAttribute('aria-label', m.label);
      if(!first && sat.firstChild.animate && !calm()) sat.firstChild.animate([{ scale:'.5', opacity:.15 }, { scale:'1', opacity:1 }], { duration:600, easing:'cubic-bezier(.2,1.25,.4,1)' });
    }
  }
  /* هم‌ترازی حباب: مرکز عمودی دقیقاً روی مرکز قرص (از روی چیدمان، نه محاسبه‌ی جداگانه)،
     فاصله‌ی افقی ثابت ۸ پیکسل، و جابه‌جایی افقی با همان انیمیشن و فنر قرص (هم‌زمان، بدون عقب‌ماندن) */
  var SAT_GAP = 8, satAnim = null;
  function satAlign(){ sat.style.top = ''; }       /* top از همان فرمول CSS قرص می‌آید؛ هیچ مقدار ثابتی نگه داشته نمی‌شود */
  function satReady(){ return !animA && !animB; }
  function moveSat(fromW, toW, sp){
    var tx = (toW / 2 + SAT_GAP) + 'px 0';
    if(satAnim){ satAnim.cancel(); satAnim = null; }
    sat.style.translate = tx;
    if(!sat.animate || fromW === null || Math.abs(fromW - toW) < 0.5) return;
    var q = calm() ? { easing:'ease-out', duration:170 } : sp;
    satAnim = sat.animate([{ translate:(fromW / 2 + SAT_GAP) + 'px 0' }, { translate:tx }], { duration:q.duration, easing:q.easing });
  }
  sat.addEventListener('click', function(e){
    e.stopPropagation();
    if(state !== 'compact') return;
    var go1 = function(){ if(pagesList().length < 2){ expand(); return; } rotStep(true); rotSync(); };
    if(!dblTap(go1)) go1();
  });
  sat.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); sat.click(); } });

  /* ---------- زمان‌های سکوت و بازخورد ---------- */
  function inQuiet(t){
    if(!cfg.quiet.on) return false;
    var f = cfg.quiet.from, e = cfg.quiet.to, h = (t && typeof t.h === 'number') ? t.h : C.tehranParts(new Date()).h;   /* همیشه ساعت تهران */
    return f === e ? false : (f < e ? (h >= f && h < e) : (h >= f || h < e));
  }
  function buzz(p){ if(navigator.vibrate){ try{ navigator.vibrate(p); }catch(e){} } }
  function tap(){ if(cfg.haptic && !inQuiet(S && S.t)) buzz(8); try{ if(K.tick) K.tick(); }catch(e){} }

  var chimeCtx = null;
  var TONES = {
    bell:[[523.25, 0, 'sine', .06, .95], [659.25, .17, 'sine', .06, .95], [783.99, .34, 'sine', .06, 1]],
    drop:[[880, 0, 'sine', .07, .5], [587.33, .09, 'sine', .05, .55]],
    flute:[[587.33, 0, 'triangle', .05, .7], [739.99, .22, 'triangle', .05, .8], [880, .46, 'triangle', .045, 1.1]]
  };
  function chime(force){
    if(!force && (!cfg.sound || inQuiet(S && S.t))) return;
    try{
      var AC = window.AudioContext || window.webkitAudioContext; if(!AC) return;
      chimeCtx = chimeCtx || new AC();
      if(chimeCtx.state === 'suspended' && chimeCtx.resume) chimeCtx.resume();
      var t0 = chimeCtx.currentTime;
      (TONES[cfg.tone] || TONES.bell).forEach(function(n){
        var o = chimeCtx.createOscillator(), g = chimeCtx.createGain();
        o.type = n[2]; o.frequency.value = n[0];
        g.gain.setValueAtTime(0.0001, t0 + n[1]); g.gain.exponentialRampToValueAtTime(n[3] * 2.4, t0 + n[1] + 0.025); g.gain.exponentialRampToValueAtTime(0.0001, t0 + n[1] + n[4]);
        o.connect(g); g.connect(chimeCtx.destination); o.start(t0 + n[1]); o.stop(t0 + n[1] + n[4] + 0.05);
      });
    }catch(e){}
  }

  /* زنگ تایمر: بلند و تکرارشونده تا کاربر ببندد (حداکثر حدود ۳۵ ثانیه) */
  var ringT = 0;
  function alarmBurst(){
    try{
      var AC = window.AudioContext || window.webkitAudioContext; if(!AC) return;
      chimeCtx = chimeCtx || new AC();
      if(chimeCtx.state === 'suspended' && chimeCtx.resume) chimeCtx.resume();
      var t0 = chimeCtx.currentTime, comp = chimeCtx.createDynamicsCompressor();
      comp.connect(chimeCtx.destination);
      [[0, 988], [0.2, 988], [0.4, 1319], [0.95, 988], [1.15, 988], [1.35, 1319]].forEach(function(n){
        var o = chimeCtx.createOscillator(), g = chimeCtx.createGain();
        o.type = 'square'; o.frequency.value = n[1];
        g.gain.setValueAtTime(0.0001, t0 + n[0]); g.gain.exponentialRampToValueAtTime(0.36, t0 + n[0] + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t0 + n[0] + 0.17);
        o.connect(g); g.connect(comp); o.start(t0 + n[0]); o.stop(t0 + n[0] + 0.2);
      });
    }catch(e){}
  }
  /* مرورگر بدون لمس کاربر اجازه‌ی صدا نمی‌دهد؛ با اولین لمس، صدای زنگ تایمر آماده می‌شود (حتی بعد از بازشدن دوباره‌ی سایت) */
  ['pointerdown', 'keydown', 'touchstart'].forEach(function(ev){ doc.addEventListener(ev, function once(){ doc.removeEventListener(ev, once, true); try{ unlockAudio(); }catch(e){} }, true); });
  function stopRing(){ clearInterval(ringT); ringT = 0; }
  function startRing(a){
    stopRing(); alarmBurst(); buzz([300, 120, 300, 120, 600]);
    var n = 0;
    ringT = setInterval(function(){
      if(cur !== a || state !== 'alert' || ++n > 14){ stopRing(); return; }
      alarmBurst(); buzz([300, 120, 300]);
    }, 2400);
  }

  /* ---------- یادآوری‌ها ---------- */
  var S = null, cur = null, queue = [], alertT = 0, firedMem = null;
  function getFired(){
    if(firedMem) return firedMem;
    firedMem = {};
    try{ (JSON.parse(ssGet(FIRED_KEY) || '[]') || []).forEach(function(id){ firedMem[id] = 1; }); }catch(e){}
    return firedMem;
  }
  /* هشدار فقط در یک تب/پنجره: اگر دو تب هم‌زمان دیده شوند، فقط اولی که ادعا کرد اعلام می‌کند (جلوگیری از صدا و لرزش دوبار) */
  var TAB_ID = Math.random().toString(36).slice(2), CLAIM_KEY = 'kzm-isl-claims';
  var TAB_JIT = Math.floor(Math.random() * 220);      /* تب‌ها دقیقاً هم‌زمان تیک نزنند تا ادعای هشدار تداخل نکند */
  function claimRead(){ try{ var o = JSON.parse(lsGet(CLAIM_KEY) || '{}') || {}, now = Date.now(); Object.keys(o).forEach(function(k){ if(now - o[k].t > 6 * 3600 * 1000) delete o[k]; }); return o; }catch(e){ return {}; } }
  function claimState(id){ var c = claimRead()[id]; return !c ? 'none' : (c.tab === TAB_ID ? 'mine' : 'other'); }
  /* ادعا: بنویس، کمی صبر کن، دوباره بخوان؛ فقط صاحبِ نهایی اعلام می‌کند (دو تب هم‌زمان هم فقط یک اعلام) */
  function claimThen(id, ok, no){
    var st = claimState(id);
    if(st === 'other') return no();
    if(st === 'mine') return ok();
    try{ var o = claimRead(); o[id] = { tab:TAB_ID, t:Date.now() }; lsSet(CLAIM_KEY, JSON.stringify(o)); }catch(e){ return ok(); }
    setTimeout(function(){ if(claimState(id) === 'mine') ok(); else no(); }, 130);
  }
  function markFired(id){ var f = getFired(); f[id] = 1; ssSet(FIRED_KEY, JSON.stringify(Object.keys(f).slice(-80))); }
  var ADHAN = ['fajr', 'sunrise', 'dhuhr', 'maghrib'];

  /* یادآوری‌های ثابت: اذان ۱ ساعت · نیم‌ساعت · ۵ دقیقه پیش؛ مراسم ۲۴ ساعت · ۱ ساعت · نیم‌ساعت · ۵ دقیقه پیش؛ و هنگام شروع.
     همیشه کوچک‌ترین بازه‌ی رسیده انتخاب می‌شود تا با بازکردن سایت چند یادآوری کهنه پشت‌سرهم نیاید. */
  var LEAD_P = [60, 30, 5], LEAD_E = [1440, 60, 30, 5];
  function pickLead(rem, arr){ var b = 0; if(!(rem > 0)) return 0; arr.forEach(function(L){ if(rem <= L && (!b || L < b)) b = L; }); return b; }
  function checkAlerts(s){
    if(!cfg.on) return;
    checkSnoozes();
    var fired = getFired(), t = s.t, nowH = s.nowH, nowMin = t.h * 60 + t.mi + t.s / 60, today = s.today, out = [];
    var dk = t.y + '-' + t.pad.m + '-' + t.pad.d;
    ADHAN.forEach(function(k){
      if(!cfg.adhan[k]) return;
      var rem = (today[k] - nowH) * 60, id = k + ':' + dk, L = pickLead(rem, LEAD_P);
      if(L && !fired['L' + L + ':' + id])
        out.push({ kind:'lead', type:'prayer', key:k, id:'L' + L + ':' + id, lead:L, atH:today[k], targetMs:Date.now() + rem * 60000, rem:rem });
      if(rem <= 0 && rem > -2 && !fired['S:' + id])
        out.push({ kind:'start', type:'prayer', key:k, id:'S:' + id, atH:today[k], targetMs:Date.now(), expireMs:Date.now() + 90000, rem:rem });
    });
    s.evs.forEach(function(it){
      if(!cfg.evOn[it.ev.id]) return;
      var id = it.ev.id + ':' + (s.jdn + it.diff), L = pickLead(it.remainMin, LEAD_E);
      if(L && !fired['L' + L + ':' + id])
        out.push({ kind:'lead', type:'event', ev:it.ev, diff:it.diff, id:'L' + L + ':' + id, lead:L, targetMs:Date.now() + it.remainMin * 60000, rem:it.remainMin });
    });
    C.WEEKLY.forEach(function(ev){
      if(!cfg.evOn[ev.id] || s.dow !== ev.dow) return;
      var rel = nowMin - ev.hour * 60, id = 'S:' + ev.id + ':' + s.jdn;
      if(rel >= 0 && rel < 2 && !fired[id]) out.push({ kind:'start', type:'event', ev:ev, diff:0, id:id, targetMs:Date.now(), expireMs:Date.now() + 90000, rem:-rel });
    });
    out.sort(function(a, b){ return Math.abs(a.rem) - Math.abs(b.rem); });
    out.forEach(function(a){
      if(queue.some(function(q){ return q.id === a.id; }) || (cur && cur.id === a.id)) return;
      queue.push(a);
    });
    if(queue.length && (state === 'compact' || state === 'idle') && !drag) showNext();
  }
  function showNext(){
    if(fanOn) return;
    var a;
    while((a = queue.shift())){
      var stale = !a.preview && (getFired()[a.id] || (a.expireMs && a.expireMs < Date.now()) || (a.kind === 'lead' && a.targetMs <= Date.now()));
      if(!stale) break;
      a = null;
    }
    if(a){
      if(a.preview || a.kind === 'welcome') showAlert(a);
      else { var al = a; claimThen(al.id, function(){ showAlert(al); }, function(){ markFired(al.id); }); }
    }
  }

  function describe(a){
    C.setLang(lang());
    var L = lang(), d = { title:'', sub:'', icon:'', col:'', href:'' }, name;
    if(a.type === 'timer'){ return { title:tt('tmrDone'), sub:tpl(tt('tmrOf'), { d:C.durText(Math.max(1, Math.round(a.dur / 60000))) }), icon:'timer', col:COL.timer, href:'' }; }
    if(a.type === 'welcome'){
      var ws = S || snap(), wh = ws.t.h, wk = wh >= 5 && wh < 12 ? 'welM' : (wh >= 12 && wh < 16 ? 'welN' : (wh >= 16 && wh < 19 ? 'welA' : 'welE'));
      return { title:tt('welT'), sub:'', icon:'hello', col:COL.hello, href:'' };
    }
    if(a.type === 'prayer'){
      name = prayerLabel(S || snap(), a.key); d.icon = a.key; d.col = COL.prayer; d.href = 'owqat.html';
      d.sub = K.t('wpCity') + ' · ' + C.fmtClock(a.atH);
    } else {
      name = pick(a.ev.title); d.icon = 'event'; d.col = COL.event; d.href = a.ev.href;
      var when = a.diff === 0 ? K.t('today') : (a.diff === 1 ? K.t('tomorrow') : C.weekdayName(a.ev.dow));
      d.sub = when + ' · ' + pick(a.ev.time) + ' · ' + K.t('weSub');
    }
    if(a.kind === 'lead'){
      var rem = Math.max(0, (a.targetMs - Date.now()) / 60000), named = { 1440:'day1', 60:'hour1', 30:'half', 5:'min5' }[a.lead];
      var ph = (!a.preview && !a.snoozed && named && rem >= a.lead - 1.5) ? tt(named) : C.durText(Math.max(1, Math.ceil(rem)));
      d.title = tpl(tt('lead'), { d:ph, n:name });
    } else {
      d.title = tpl(tt(a.type === 'prayer' ? 'startP' : 'startE'), { n:name });
    }
    return d;
  }
  function buildActions(a, d){
    var h = '';
    if(a.type === 'timer'){ h = '<button type="button" class="isl-pill" data-a="close">' + esc(tt('xClose')) + '</button><button type="button" class="isl-pill pri" data-a="trestart">' + esc(tt('tmrRestart')) + '</button>'; }
    else if(a.type === 'welcome'){ h = ''; }
    else if(cfg.actions){
      if(a.kind === 'lead') h += '<button type="button" class="isl-pill" data-a="snooze">' + esc(tpl(tt('snoozeBtn'), { n:C.fa(cfg.snooze) })) + '</button>';
      h += '<button type="button" class="isl-pill pri" data-a="open" data-href="' + esc(d.href) + '">' + esc(tt('openBtn')) + '</button>';
      if(a.type === 'event') h += '<button type="button" class="isl-pill" data-a="ics">' + esc(tt('icsBtn')) + '</button>';
    }
    aAb.innerHTML = h; aL.classList.toggle('has-ab', !!h);
  }

  function showAlert(a){
    clearTimeout(alertT); stopRing();
    if(!a.preview) markFired(a.id);
    cur = a;
    var d = describe(a);
    setAc(d.col);
    aIc.innerHTML = svg(d.icon); aTi.textContent = d.title; aSu.textContent = d.sub;
    buildActions(a, d);
    rAcd.set(a.kind === 'welcome' ? '' : ((a.kind === 'start' || a.kind === 'timer') ? (a.kind === 'timer' ? fmtCd(0) : tt('now')) : fmtCd(Math.max(0, Math.ceil((a.targetMs - Date.now()) / 1000)))), false);
    aL.classList.toggle('is-welcome', a.kind === 'welcome');
    aL.classList.toggle('cd-long', rAcd.t.length > 5 && !rAcd.plain);
    aL.classList.toggle('is-tdone', a.kind === 'timer');
    var ms = a.kind === 'welcome' ? 5600 : a.kind === 'timer' ? 45000 : (cfg.alertSec + (a.kind === 'start' ? 2 : 0) + (cfg.actions ? 2 : 0)) * 1000;
    aL.classList.remove('run', 'hold'); void aL.offsetWidth;
    aL.style.setProperty('--bar-d', ms + 'ms'); aL.classList.add('run');
    if(state === 'alert') refreshDims(); else setState('alert');
    alertT = setTimeout(collapse, ms);
    sr.textContent = ''; setTimeout(function(){ sr.textContent = d.title + '. ' + d.sub; }, 60);
    if(a.kind === 'timer'){
      if(cfg.timerAlarm) startRing(a);
    } else if(a.kind !== 'welcome'){
      if(cfg.vibrate && !inQuiet(S && S.t)) buzz(a.kind === 'start' ? [30, 70, 30, 70, 30] : [22, 60, 22]);
    }
  }
  function fmtCd(sec){
    var f = C.fa, h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return (h > 0 ? f(h) + ':' + f(p2(m)) : f(m)) + ':' + f(p2(s));
  }
  function paintAlert(){
    if(state !== 'alert' || !cur) return;
    if(cur.kind === 'start' || cur.kind === 'timer' || cur.kind === 'welcome') return;
    rAcd.set(fmtCd(Math.max(0, Math.ceil((cur.targetMs - Date.now()) / 1000))), true);
    var lg = rAcd.t.length > 5;
    if(lg !== aL.classList.contains('cd-long')){ aL.classList.toggle('cd-long', lg); refreshDims(); }
  }
  function holdAlert(on){
    if(state !== 'alert') return;
    aL.classList.toggle('hold', on);
    clearTimeout(alertT);
    if(!on) alertT = setTimeout(collapse, 2800);
  }
  /* «بعداً یادآوری»: در localStorage می‌ماند، پس با رفتن به صفحه‌ی دیگر لغو نمی‌شود */
  var SNZ_KEY = 'kzm-isl-snooze';
  function snzLoad(){ try{ var l = JSON.parse(lsGet(SNZ_KEY) || '[]'); return Array.isArray(l) ? l : []; }catch(e){ return []; } }
  function snzSave(l){ lsSet(SNZ_KEY, l.length ? JSON.stringify(l.slice(-20)) : ''); }
  function snoozeAlert(){
    var a = cur; if(!a) return;
    collapse();
    var l = snzLoad(), b = Object.assign({}, a, { id:a.id.split('~')[0] + '~' + Date.now(), snoozed:true });
    l.push({ due:Date.now() + cfg.snooze * 60000, a:b }); snzSave(l);
  }
  function checkSnoozes(){
    var l = snzLoad(); if(!l.length) return;
    var now = Date.now(), keep = [], due = [];
    l.forEach(function(x){ ((x && x.due <= now && x.a) ? due : keep).push(x); });
    if(!due.length) return;
    snzSave(keep);                                          /* برداشتن از فهرست = ادعا؛ تب دیگر دوباره اعلام نمی‌کند */
    due.forEach(function(x){ var b = x.a; if(b.kind === 'lead' && b.targetMs <= now) return; queue.push(b); });
    if(queue.length && (state === 'compact' || state === 'idle') && !drag) showNext();
  }

  /* ---------- تایمر (مثل iOS): قرص با دکمه‌ی توقف، لغو و زمان نارنجی ---------- */
  var TKEY = 'kazemiuon-island-timer', TMIN = 'kazemiuon-island-tmin';
  var tm = null, tmrCustom = clamp(parseInt(lsGet(TMIN), 10) || 10, 1, 180), tmMode = '', rTb = null, tPauseState = null;
  try{ var tj = JSON.parse(lsGet(TKEY) || 'null'); if(tj && tj.dur > 0 && (tj.paused ? tj.left > 0 : tj.end > 0)) tm = tj; }catch(e){}
  cL.classList.toggle('is-timer', !!tm);
  function saveTimer(){ lsSet(TKEY, tm ? JSON.stringify(tm) : ''); }
  function timerLeft(){ return !tm ? 0 : (tm.paused ? tm.left : Math.max(0, tm.end - Date.now())); }
  function unlockAudio(){ try{ var AC = window.AudioContext || window.webkitAudioContext; if(!AC) return; chimeCtx = chimeCtx || new AC(); if(chimeCtx.resume) chimeCtx.resume(); }catch(e){} }
  function timerView(animate){
    var on = !!tm;
    var fn = function(){
      cL.classList.toggle('is-timer', on); lastSig = ''; padSync();
      if(!S) S = snap();
      if(state === 'idle'){ if(on){ paintCompact(S, true); setState('compact'); } return; }
      paintCompact(S, true);
      if(!on && state === 'compact' && cfg.mode === 'alerts') setState('idle');
      else if(state === 'compact') refreshDims();
    };
    if(animate && state === 'compact') swapCompact(fn); else fn();
  }
  function timerChanged(swap){
    paintTimerCard(true);
    if(swap) timerView(true); else if(S) paintCompact(S, true);
    satSync(); restartTick();
  }
  function startTimer(min){
    unlockAudio();
    var d = min * 60000;
    tm = { dur:d, end:Date.now() + d, paused:false, left:d, id:Date.now() };
    saveTimer(); tap(); timerChanged(true);
    if(state === 'expanded') setTimeout(function(){ if(state === 'expanded' && tm) collapse(); }, 650);   /* تایمر در کپسول دیده شود */
  }
  function pauseTimer(){
    if(!tm) return;
    if(tm.paused){ tm.end = Date.now() + tm.left; tm.paused = false; } else { tm.left = timerLeft(); tm.paused = true; }
    saveTimer(); tap(); timerChanged(false);
  }
  function cancelTimer(){ tm = null; saveTimer(); tap(); timerChanged(true); }
  function addTimer(min){
    if(!tm) return;
    if(tm.paused) tm.left += min * 60000; else tm.end += min * 60000;
    tm.dur += min * 60000; saveTimer(); tap(); timerChanged(false);
  }
  function timerPaused(){ return !!(tm && tm.paused); }
  function paintTimerPill(s){
    var left = timerLeft(), txt = fmtCd(Math.ceil(left / 1000));
    setAc(COL.timer);
    tLab.textContent = tt(tm.paused ? 'tmrPausedL' : 'tmrLeftL');
    rT.set(txt, !tm.paused);
    if(tPauseState !== tm.paused){
      tPauseState = tm.paused; tPause.innerHTML = svg(tm.paused ? 'play' : 'pause');
      tPause.setAttribute('aria-label', tt(tm.paused ? 'tmrResume' : 'tmrPause')); tCancel.setAttribute('aria-label', tt('tmrCancel'));
    }
    cL.classList.toggle('is-paused', !!tm.paused);
    tBar.style.scale = (tm.dur ? clamp(left / tm.dur, 0, 1) : 0) + ' 1';
    tRing.style.strokeDashoffset = String(66 * (1 - (tm.dur ? clamp(left / tm.dur, 0, 1) : 0)));
    var aria = tt('tmrT') + ' ' + txt;
    root.setAttribute('data-aria', aria);
    if(state === 'compact'){
      root.setAttribute('aria-label', aria);
      var w = timerW();
      if(Math.abs(w - tgt.w) > 1.5 || Math.abs(ch() - tgt.h) > 0.5) morphTo({ w:w, h:ch(), r:Math.round(ch() / 2) }, SP.soft);
    }
  }
  function checkTimer(){
    if(!tm || tm.paused) return;
    var late = Date.now() - tm.end;
    if(late < 0) return;
    var a = { kind:'timer', type:'timer', id:'T:' + tm.id, dur:tm.dur, targetMs:Date.now() };
    tm = null; saveTimer(); timerView(false);
    if(late > 15 * 60000){ paintTimerCard(true); return; }      /* خیلی دیر برگشته: بی‌صدا پاک شود */
    claimThen(a.id, function(){
      if(state === 'expanded' || (drag && drag.on)){ queue.unshift(a); collapse(); } else showAlert(a);
      paintTimerCard(true);
    }, function(){ paintTimerCard(true); });
  }
  function syncTimer(){
    var nt = null;
    try{ var tj = JSON.parse(lsGet(TKEY) || 'null'); if(tj && tj.dur > 0 && (tj.paused ? tj.left > 0 : tj.end > 0)) nt = tj; }catch(e){}
    if((tm ? JSON.stringify(tm) : '') === (nt ? JSON.stringify(nt) : '')) return;
    /* تایمرِ در حال اتمام که صفحه‌ی دیگری پاکش کرده: هشدارش را همین صفحه بدهد تا گم نشود */
    if(!nt && tm && !tm.paused && tm.end - Date.now() < 3000) return;
    var had = !!tm; tm = nt; tPauseState = null;
    timerChanged(had !== !!tm);
  }
  window.addEventListener('storage', function(e){
    if(!e.key || e.key === TKEY) syncTimer();
    if(!e.key || e.key === TMIN){ var n = clamp(parseInt(lsGet(TMIN), 10) || 10, 1, 180); if(n !== tmrCustom){ tmrCustom = n; paintTimerCard(false); } }
    /* شمارش ذکر/صلوات در صفحه یا تب دیگر عوض شد ← قرص و کارت بازشده تازه شوند */
    if(!e.key || e.key.indexOf('kazemiuon-zekr-') === 0 || e.key.indexOf('kazemiuon-salavat-count-') === 0){ lastSig = ''; restartTick(); }
  });
  doc.addEventListener('visibilitychange', function(){ if(!doc.hidden) syncTimer(); });
  window.addEventListener('pageshow', function(e){ if(e.persisted) syncTimer(); });
  function paintTimerCard(force){
    var box = xL.querySelector('.isl-tim'); if(!box) return;
    var mode = tm ? 'run' : 'idle', lg = lang();
    if(mode !== tmMode || force || box.getAttribute('data-l') !== lg){
      tmMode = mode; box.setAttribute('data-l', lg);
      if(mode === 'run'){
        box.innerHTML = '<div class="isl-trun"><div class="isl-tringw"><svg class="isl-tring" viewBox="0 0 120 120" aria-hidden="true"><circle class="tr" cx="60" cy="60" r="52"/><circle class="pg" cx="60" cy="60" r="52"/></svg>' +
          '<div class="isl-tmid"><div class="isl-tbig rl-box"></div><small class="isl-tst"></small></div></div>' +
          '<div class="isl-tbtn"><button type="button" class="isl-pill" data-a="tcancel">' + esc(tt('tmrCancel')) + '</button><button type="button" class="isl-pill pri" data-a="tpause"></button><button type="button" class="isl-pill" data-a="tadd">' + esc(tt('tmrAdd')) + '</button></div></div>';
        rTb = new Roll(box.querySelector('.isl-tbig'));
      } else {
        rTb = null;
        box.innerHTML = '<div class="isl-tpre">' + [1, 5, 10, 15, 30].map(function(m){ return '<button type="button" class="isl-tp" data-a="tstart" data-m="' + m + '"><b>' + C.fa(m) + '</b><small>' + esc(tt('unitM')) + '</small></button>'; }).join('') + '</div>' +
          '<div class="isl-tcus"><span class="isl-stepc"><button type="button" data-a="tstep" data-d="-1" aria-label="-">−</button><output></output><button type="button" data-a="tstep" data-d="1" aria-label="+">+</button></span><button type="button" class="isl-pill pri isl-tgo" data-a="tgo">' + esc(tt('tmrGo')) + '</button></div>';
      }
    }
    if(mode === 'run'){
      var left = timerLeft();
      rTb.set(fmtCd(Math.ceil(left / 1000)), !tm.paused);
      box.querySelector('.pg').style.strokeDashoffset = String(327 * (1 - (tm.dur ? clamp(left / tm.dur, 0, 1) : 0)));
      box.querySelector('.isl-tst').textContent = tt(tm.paused ? 'tmrPausedS' : 'tmrLeftS');
      var pb = box.querySelector('[data-a=tpause]'), want = tt(tm.paused ? 'tmrResume' : 'tmrPause'); if(pb.textContent !== want) pb.textContent = want;
    } else {
      box.querySelector('output').textContent = tpl(tt('tmrMinN'), { n:C.fa(tmrCustom) });
    }
  }
  function stepCustom(d){
    tmrCustom = clamp(d > 0 ? (tmrCustom < 10 ? tmrCustom + 1 : tmrCustom + 5) : (tmrCustom <= 10 ? tmrCustom - 1 : tmrCustom - 5), 1, 180);
    lsSet(TMIN, String(tmrCustom)); paintTimerCard(false);
  }

  /* افزودن مراسم به تقویم گوشی (فایل .ics با هشدار و تکرار هفتگی) */
  function icsFor(ev, diff){
    try{
      var d = C.tehranParts(new Date(Date.now() + (diff || 0) * 86400000));
      var startMs = Date.UTC(d.y, d.m - 1, d.d, ev.hour, 0, 0) - C.tz() * 3600000;
      function z(ms){ return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
      var title = (ev.title && ev.title.fa) || ev.id;
      var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Kazemiyoon//Island//FA', 'BEGIN:VEVENT', 'UID:' + ev.id + '-' + startMs + '@kazemiyoon',
        'DTSTAMP:' + z(Date.now()), 'DTSTART:' + z(startMs), 'DURATION:PT' + Math.round(cfg.evDur) + 'M', 'RRULE:FREQ=WEEKLY', 'SUMMARY:' + title,
        'LOCATION:قاضی‌آباد، خرم‌آباد', 'BEGIN:VALARM', 'TRIGGER:-PT30M', 'ACTION:DISPLAY', 'DESCRIPTION:' + title, 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'];
      var blob = new Blob([lines.join('\r\n') + '\r\n'], { type:'text/calendar;charset=utf-8' }), url = URL.createObjectURL(blob);
      var a = doc.createElement('a'); a.href = url; a.download = ev.id + '.ics'; doc.body.appendChild(a); a.click();
      setTimeout(function(){ URL.revokeObjectURL(url); a.remove(); }, 1500);
    }catch(e){}
  }

  /* ---------- باز و بسته شدن ---------- */
  function idleState(){ return (cfg.mode === 'alerts' && !tm) ? 'idle' : 'compact'; }
  function collapse(){
    clearTimeout(alertT); cur = null; stopRing();
    if(state === 'compact' || state === 'idle') return;
    setState(idleState());
    if(state === 'compact' && S) paintCompact(S);
    setTimeout(function(){ if(queue.length && (state === 'compact' || state === 'idle')) showNext(); }, 700);
  }
  function openCard(){
    clearTimeout(alertT); cur = null; stopRing();
    setAc(expKind ? COL[KIND_COL[expKind]] : COL.prayer);
    setState('expanded');
  }
  /* kind نداشته باشد: کارت کامل؛ kind داشته باشد: نمای جزئیات همان بخش */
  /* کارت از پیش (هنگام نگه داشتن انگشت) ساخته و چیده می‌شود تا لحظه‌ی باز شدن قفل نکند */
  var pre = null, preT = 0, preT2 = 0;
  function preKeyOf(kind){ var sh = ''; try{ sh = JSON.stringify(cfg.show); }catch(_){} return (kind || '') + '|' + lang() + '|' + sh + '|' + (tm ? 1 : 0); }
  function preCancel(){ clearTimeout(preT); clearTimeout(preT2); preT = preT2 = 0; }
  function preBuild(kind){
    if(state !== 'compact' && state !== 'alert') return;
    var keep = expKind;
    try{
      expKind = (typeof kind === 'string' && KIND_COL[kind]) ? kind : null;
      S = snap(); buildExpanded(S); paintExpanded(S, false); void xL.offsetHeight; dims('expanded');
      pre = { key:preKeyOf(expKind), t:performance.now() };
    }catch(_){ pre = null; }
    expKind = keep;
  }
  function expand(kind, quiet){
    if(state === 'expanded' || state === 'idle') return;
    expKind = (typeof kind === 'string' && KIND_COL[kind]) ? kind : null;
    S = snap();
    if(!(pre && pre.key === preKeyOf(expKind) && performance.now() - pre.t < 5000 && xr.ok)) buildExpanded(S);
    pre = null;
    paintExpanded(S);
    void xL.offsetHeight;                 /* سبک اولیه‌ی بخش‌ها ثبت شود تا ورودشان انیمیشن بگیرد */
    if(quiet){ try{ if(K.tick) K.tick(); }catch(e){} } else tap();
    openCard();
  }
  /* ضربه‌ی ساده: جزئیات بخشی که قرص نشان می‌دهد؛ (با تایمر روشن: کارت کامل که کنترل تایمر آنجاست) */
  function expandDetail(){
    if(state !== 'compact' || tm){ expand(); return; }
    expand(curKind(snap()));
  }
  function switchExp(kind){
    if(state !== 'expanded') return;
    expKind = kind; S = snap(); buildExpanded(S); paintExpanded(S, false);
    setAc(expKind ? COL[KIND_COL[expKind]] : COL.prayer);
    xL.scrollTop = 0; xL.classList.add('swap'); void xL.offsetHeight;
    morphTo(dims('expanded'), SP.open);
    requestAnimationFrame(function(){ xL.classList.remove('swap'); });
    tap();
  }
  function go(href){
    if(!href) return;
    body.classList.add('page-exit');
    setTimeout(function(){ location.href = href; }, 200);
  }
  function openSettings(){
    collapse();
    var b = $('kzm-menu-btn'); if(b) b.click();
    setTimeout(function(){ var tb = $('lg-tab-island'); if(tb) tb.click(); }, 70);
  }

  /* ---------- کارت بازشده ---------- */
  var xr = { ok:false }, dateKey = '', rClk = null, rSal = null;
  function sec(k, cls, ac, inner){ return '<div class="isl-sec ' + cls + '" style="--k:' + k + ';--ac:' + ac + '">' + inner + '</div>'; }
  function buildExpanded(s){
    C.setLang(lang());
    var h = '', k = 1, sh = cfg.show, any = false;
    xL.classList.toggle('dtc', expKind === 'clock');
    if(expKind){ h = detailHTML(s); } else {
    var head = sh.clock
      ? '<div class="isl-xc"><div class="isl-xclk"><b class="rl-box clk"></b><small class="csec"></small></div><span class="isl-xdt"></span></div>'
      : '<span class="isl-xt">' + esc(K.t('wTitle')) + '</span>';
    h += '<div class="isl-xh" style="--k:0">' + head +
         '<button type="button" class="isl-xb" data-a="cfg" aria-label="' + esc(tt('xCfg')) + '">' + svg('gear') + '</button>' +
         '<button type="button" class="isl-xb" data-a="close" aria-label="' + esc(tt('xClose')) + '">' + svg('up') + '</button></div>';
    if(sh.timer){ any = true; h += sec(k++, 'isl-t', COL.timer, '<span class="isl-sl">' + esc(tt('tmrT')) + '</span><div class="isl-tim"></div>'); }
    if(sh.prayer){
      any = true;
      var cells = ['fajr', 'sunrise', 'dhuhr', 'maghrib'].map(function(p){
        return '<div class="isl-cell" data-p="' + p + '"><small>' + esc(K.t({ fajr:'tFajr', sunrise:'tSunrise', dhuhr:'tDhuhr', maghrib:'tMaghrib' }[p])) + '</small><b></b></div>';
      }).join('');
      h += sec(k++, 'isl-p', COL.prayer,
        '<div class="isl-prow"><div class="isl-pl"><span class="isl-sl">' + esc(K.t('wpTitle')) + '</span><b class="pn"></b></div>' +
        '<div class="isl-pr"><b class="pt"></b><small class="pc"></small></div></div>' +
        '<div class="isl-bar"><i class="pf"></i></div><div class="isl-cells">' + cells + '</div>');
    }
    if(sh.event){
      any = true;
      var evs = [0, 1].map(function(i){
        return '<div class="isl-evw" data-i="' + i + '"><a class="isl-ev" href="#"><span class="isl-eic">' + svg('event') + '</span><span class="isl-et"><b></b><small></small></span><span class="isl-ec"></span></a>' +
               '<button type="button" class="isl-xb sm" data-a="icsrow" data-i="' + i + '" aria-label="' + esc(tt('icsBtn')) + '">' + svg('date') + '</button></div>';
      }).join('');
      h += sec(k++, 'isl-e', COL.event, '<span class="isl-sl">' + esc(K.t('weTitle')) + '</span>' + evs);
    }
    if(sh.date){ any = true; h += sec(k++, 'isl-d', COL.date, '<div class="isl-dh"><b class="dd"></b><small class="dl"></small></div><div class="isl-occ"></div>'); }
    var two = '';
    if(sh.zekr) two += '<div class="isl-sec isl-z" style="--ac:' + COL.zekr + '"><span class="isl-sl">' + esc(tt('zekrL')) + '</span><div class="isl-zt"></div><div class="isl-bar" style="margin:6px 0 5px"><i class="zf"></i></div><div class="isl-zrow"><span class="isl-zp"></span><span class="isl-pm"><button type="button" class="isl-plus sm minus" data-a="zekm" aria-label="' + esc(tt('tapMinus')) + '">' + svg('minus') + '</button><button type="button" class="isl-plus sm" data-a="zek" aria-label="' + esc(tt('tapPlus')) + '">' + svg('plus') + '</button></span></div></div>';
    if(sh.salavat) two += '<div class="isl-sec isl-sv" style="--ac:' + COL.sal + '"><span class="isl-sl">' + esc(tt('salL')) + '</span><b class="isl-sn rl-box"></b><span class="isl-ss"></span><div class="isl-pm"><button type="button" class="isl-plus minus" data-a="salm" aria-label="' + esc(tt('tapMinus')) + '">' + svg('minus') + '</button><button type="button" class="isl-plus" data-a="sal" aria-label="' + esc(tt('tapPlus')) + '">' + svg('plus') + '</button></div></div>';
    if(two){ any = true; h += '<div class="isl-two' + ((sh.zekr && sh.salavat) ? '' : ' one') + '" style="--k:' + (k++) + '">' + two + '</div>'; }
    if(!any) h += '<div class="isl-empty">' + esc(tt('emptyX')) + '</div>';
    }
    xL.innerHTML = h; tmMode = '';
    rZ = xL.querySelector('.zc') ? new Roll(xL.querySelector('.zc')) : null;
    rClk = xL.querySelector('.clk') ? new Roll(xL.querySelector('.clk')) : null;
    rSal = xL.querySelector('.isl-sn') ? new Roll(xL.querySelector('.isl-sn')) : null;
    xr = { ok:true,
      csec:xL.querySelector('.csec'), xdt:xL.querySelector('.isl-xdt'),
      pn:xL.querySelector('.pn'), pt:xL.querySelector('.pt'), pc:xL.querySelector('.pc'), pf:xL.querySelector('.pf'),
      cells:[].slice.call(xL.querySelectorAll('.isl-cell')), evs:[].slice.call(xL.querySelectorAll('.isl-evw')),
      dd:xL.querySelector('.dd'), dl:xL.querySelector('.dl'), occ:xL.querySelector('.isl-occ'),
      zt:xL.querySelector('.isl-zt'), zf:xL.querySelector('.zf'), zp:xL.querySelector('.isl-zp'), ss:xL.querySelector('.isl-ss') };
    xd = expKind ? { kind:dkind, evt:xL.querySelector('.dt-evt'), evw:xL.querySelector('.dt-evw'), cd:xL.querySelector('.dt-cd'), evl:xL.querySelector('.dt-evl'), evf:xL.querySelector('.dt-evf'),
      zr:xL.querySelector('.dt-ring'), zpg:xL.querySelector('.dt-ring .pg'), zt2:xL.querySelector('.zt'), zfa:xL.querySelector('.dt-fa'), zday:xL.querySelector('.dt-zday'),
      cv:[].slice.call(xL.querySelectorAll('.dt-cv')), up:xL.querySelector('.dt-up') } : null;
    upKey = ''; dateKey = '';
  }

  var xrows = [];
  function paintExpanded(s, animate){
    if(!xr.ok) return;
    C.setLang(lang());
    var pm = s.pm, L = lang();
    if(rClk){
      var t = s.t;
      rClk.set(C.fa(p2(t.h)) + ':' + C.fa(p2(t.mi)), animate !== false);
      xr.csec.textContent = cfg.clockSec ? ':' + C.fa(p2(t.s)) : '';
      xr.xdt.textContent = dateLine(s, true);
    }
    if(xr.pn){
      xr.pn.textContent = prayerLabel(s, pm.key) + (pm.tomorrow ? ' ' + K.t('tomorrowParen') : '');
      xr.pt.textContent = C.fmtClock(pm.at);
      xr.pc.textContent = C.remainText(pm.remainMin);
      xr.pf.style.width = Math.round(pm.progress * 100) + '%';
      xr.cells.forEach(function(c){
        var p = c.getAttribute('data-p');
        c.querySelector('b').textContent = C.fmtClock(pm.times[p]);
        c.classList.toggle('is-next', p === pm.key);
        c.classList.toggle('is-past', !pm.tomorrow && pm.times[p] <= pm.nowH);
      });
    }
    if(xr.evs.length){
      xrows = [];
      if(s.live) xrows.push({ live:true, ev:s.live.ev, elapsed:s.live.elapsed, diff:0 });
      s.evs.forEach(function(it){ xrows.push(it); });
      xrows = xrows.slice(0, 2);
      xr.evs.forEach(function(row, i){
        var it = xrows[i]; if(!it){ row.hidden = true; return; }
        var ev = it.ev, when = it.diff === 0 ? K.t('today') : (it.diff === 1 ? K.t('tomorrow') : C.weekdayName(ev.dow)), a = row.querySelector('.isl-ev');
        row.hidden = false; a.setAttribute('href', ev.href);
        a.classList.toggle('is-live', !!it.live);
        a.querySelector('b').textContent = pick(ev.title);
        a.querySelector('small').textContent = it.live ? tpl(tt('elapsed'), { d:C.durText(Math.max(1, Math.floor(it.elapsed))) }) : when + ' · ' + pick(ev.time);
        a.querySelector('.isl-ec').textContent = it.live ? tt('live') : C.durText(it.remainMin);
        row.setAttribute('data-ev', ev.id); row.setAttribute('data-diff', String(it.diff || 0));
      });
    }
    if(xr.dd){
      var dk = s.jdn + '|' + L + '|' + (s.eve ? s.eve.title : '') ;
      if(dk !== dateKey){
        dateKey = dk;
        var m = s.day.today;
        if(!m){ xr.dd.textContent = dfmt({ weekday:'long', day:'numeric', month:'long', year:'numeric' }, 'full').format(new Date()); xr.dl.textContent = ''; xr.occ.innerHTML = ''; }
        else {
          xr.dd.textContent = m.weekday + ' ' + C.fa(m.jd) + ' ' + C.jalaliMonthName(m.jm) + ' ' + C.fa(m.jy);
          xr.dl.textContent = C.fa(m.lunar.d) + ' ' + C.lunarMonthName(m.lunar.m) + ' ' + C.fa(m.lunar.y) + ' ' + C.HIJRI_SUFFIX[L];
          var tone = { birth:'#ff7eb8', eid:'#2dd4bf', mourn:'#b39dff', other:'#5aa9ff' }, rows = '';
          if(s.eve) rows += '<div class="isl-oi eve" style="color:' + (tone[s.eve.tone] || '#b0a0ff') + '"><i></i><span>' + esc(tt('tonight') + ' · ' + s.eve.title) + '</span></div>';
          if(m.items.length){
            m.items.forEach(function(o){ rows += '<div class="isl-oi" style="color:' + (tone[o.tone] || '#ffcb3d') + '"><i></i><span>' + esc(o.title) + (o.hol ? ' · ' + esc(K.t('holiday')) : '') + '</span></div>'; });
          } else { rows += '<div class="isl-oi dim"><i></i><span>' + esc(K.t('noOcc')) + '</span></div>'; }
          if(m.next){ rows += '<div class="isl-oi dim"><i></i><span>' + esc(K.t('nextOcc')) + esc(m.next.items[0].title + (m.next.items.length > 1 ? ' …' : '')) + ' — ' + esc(C.daysAhead(m.next.days)) + '</span></div>'; }
          xr.occ.innerHTML = rows;
        }
      }
    }
    if(xr.zt){
      var z = C.ZEKR_BY_DAY[s.dow];
      if(z){
        var n = Math.min(intLS(C.zekrKey(s.t)), C.ZEKR_TARGET);
        xr.zt.textContent = z.text;
        xr.zf.style.width = (n / C.ZEKR_TARGET * 100) + '%';
        xr.zp.textContent = n >= C.ZEKR_TARGET ? K.t('zekrDone') : (K.t('zekrToday') + C.fa(n) + K.t('zekrOf') + C.fa(C.ZEKR_TARGET));
      }
    }
    if(rSal){
      var a = intLS('kazemiuon-salavat-count-salawat'), b = intLS('kazemiuon-salavat-count-faraj'), c = intLS('kazemiuon-salavat-count-estighfar');
      rSal.set(C.fa(a), animate !== false);
      if(xr.ss) xr.ss.textContent = tt('salB') + ' ' + C.fa(b) + ' · ' + tt('salC') + ' ' + C.fa(c);
    }
    paintTimerCard(false);
    if(expKind) paintDetailExtras(s, animate);
  }

  /* ---------- نمای جزئیات هر بخش: با یک ضربه روی قرص باز می‌شود و با کشیدن به بالا برمی‌گردد ---------- */
  var expKind = null, xd = null, upKey = '', dkind = '', rZ = null;
  var KIND_COL = { guide:'guide', prayer:'prayer', event:'event', clock:'clock', date:'date', occasion:'night', zekr:'zekr', salavat:'sal' };
  var SAL_ITEMS = [
    { k:'kazemiuon-salavat-count-salawat', ar:'اَللّهُمَّ صَلِّ عَلى مُحَمَّدٍ وَ آلِ مُحَمَّد', l:'salA' },
    { k:'kazemiuon-salavat-count-faraj', ar:'اَللّهُمَّ عَجِّلْ لِوَلِیِّکَ الفَرَج', l:'salB' },
    { k:'kazemiuon-salavat-count-estighfar', ar:'اَسْتَغْفِرُ اللهَ رَبّی وَ اَتُوبُ اِلَیْه', l:'salC' }
  ];
  var TONE = { birth:'#ff7eb8', eid:'#2dd4bf', mourn:'#b39dff', other:'#5aa9ff' };
  function dtHead(s, title, icon, ac, withClock){
    var lead = withClock
      ? '<div class="isl-xc"><div class="isl-xclk"><b class="rl-box clk"></b><small class="csec"></small></div><span class="isl-xdt"></span></div>'
      : '<span class="dt-ic">' + svg(icon) + '</span><span class="isl-xt">' + esc(title) + '</span>';
    return '<div class="isl-xh dt-h" style="--k:0;--ac:' + ac + '">' + lead +
      '<button type="button" class="isl-xb" data-a="xall" aria-label="' + esc(tt('xAll')) + '">' + svg('grid') + '</button>' +
      '<button type="button" class="isl-xb" data-a="close" aria-label="' + esc(tt('xClose')) + '">' + svg('up') + '</button></div>';
  }
  function dtPrayerSec(k){
    var cells = ['fajr', 'sunrise', 'dhuhr', 'maghrib'].map(function(p){
      return '<div class="isl-cell" data-p="' + p + '"><small>' + esc(K.t({ fajr:'tFajr', sunrise:'tSunrise', dhuhr:'tDhuhr', maghrib:'tMaghrib' }[p])) + '</small><b></b></div>';
    }).join('');
    return sec(k, 'isl-p', COL.prayer,
      '<div class="isl-prow"><div class="isl-pl"><span class="isl-sl">' + esc(K.t('wpTitle')) + '</span><b class="pn"></b></div>' +
      '<div class="isl-pr"><b class="pt"></b><small class="pc"></small></div></div>' +
      '<div class="isl-bar"><i class="pf"></i></div><div class="isl-cells">' + cells + '</div>');
  }
  function dtDateSec(k){ return sec(k, 'isl-d', COL.date, '<div class="isl-dh"><b class="dd"></b><small class="dl"></small></div><div class="isl-occ"></div>'); }
  function dtUpSec(k){ return sec(k, 'dt-upc', COL.night, '<span class="isl-sl">' + esc(tt('upL')) + '</span><div class="dt-up"></div>'); }

  /* ---------- راهنمای کپسول جادویی (قرص، کارت بازشده و تنظیمات) ---------- */
  var GUIDE = [
    { ic:'sparkle', col:'255,203,61', sh:'squircle', tag:['آشنایی', 'تعارف', 'Intro'],
      t:['کپسول جادویی چیست؟', 'ما هي الكبسولة السحرية؟', 'What is the Magic Capsule?'],
      b:['یک قرص کوچک و زنده در بالای صفحه که وقت اذان، مراسم هیئت، ساعت و تاریخ تهران، مناسبت‌ها، ذکر روز و صلوات‌شمار را همیشه جلوی چشم شما نگه می‌دارد. همه‌چیز روی خود گوشی محاسبه می‌شود و به سرور نیاز ندارد.',
         'قرص صغير حيّ أعلى الصفحة يضع أمامك دائماً وقت الأذان ومراسم الهيئة وساعة طهران وتاريخها والمناسبات وذكر اليوم وعدّاد الصلوات. كل شيء يُحسب على جهازك ولا يحتاج إلى خادم.',
         'A small live pill at the top of the page that keeps prayer times, gatherings, Tehran time and date, occasions, the daily dhikr and your salawat counter always in view. Everything is calculated on your device, with no server needed.'] },
    { ic:'tap', col:'125,211,252', sh:'circle', tag:['ضربه', 'نقرة', 'Tap'],
      t:['یک ضربه', 'ضغطة واحدة', 'One tap'],
      b:['روی قرص بزنید تا جزئیات همان صفحه‌ای که نشان می‌دهد باز شود؛ مثلاً اوقات شرعی کامل، برنامه‌ی هفتگی یا ذکر امروز.',
         'اضغط على القرص لتُفتح تفاصيل الصفحة المعروضة، مثل أوقات الصلاة كاملة أو البرنامج الأسبوعي أو ذكر اليوم.',
         'Tap the pill to open the details of the page it is showing, such as the full prayer times, the weekly schedule or today’s dhikr.'] },
    { ic:'hold', col:'255,142,118', sh:'hex', tag:['۰٫۴ ثانیه', '٠٫٤ ث', '0.4 s'],
      t:['نگه داشتن', 'الضغط المطوّل', 'Press and hold'],
      b:['انگشت را حدود چهار دهم ثانیه روی قرص نگه دارید تا کارت کامل باز شود: تایمر، اوقات شرعی، مراسم، تقویم، ذکر و صلوات، همه یک‌جا.',
         'أبقِ إصبعك على القرص نحو أربعة أعشار الثانية لتُفتح البطاقة الكاملة: المؤقّت والأوقات والمراسم والتقويم والذكر والصلوات في مكان واحد.',
         'Keep your finger on the pill for about four tenths of a second to open the full card: timer, prayer times, gatherings, calendar, dhikr and salawat in one place.'] },
    { ic:'fan', col:'255,214,120', sh:'ring', tag:['×۲ ضربه', '×٢ نقرة', '×2 tap'],
      t:['باز شدن قرص‌ها با دو ضربه', 'فتح الصفحات بنقرتين', 'Double-tap pop-out'],
      b:['دو ضربه‌ی سریع پشت‌سرهم روی قرص کوچک کنار کپسول (حباب صفحه‌ی بعد) بزنید: همه‌ی قرص‌ها به شکل کپسول‌های کوچک بیرون می‌آیند و زیر کپسول ردیف می‌شوند. روی هر کدام بزنید تا در کپسول بنشیند. ضربه‌ی تکی روی همان قرص، صفحه‌ی بعد را نشان می‌دهد و ضربه‌ی تکی روی خود کپسول جزئیات را باز می‌کند.',
         'انقر نقرتين سريعتين على الحبّة الصغيرة بجانب الكبسولة (فقاعة الصفحة التالية): تخرج كل الصفحات كحبوب كبسولية صغيرة وتصطف تحتها. المس واحدة لتظهر في الكبسولة. والنقرة الواحدة عليها تعرض الصفحة التالية، وعلى الكبسولة نفسها تفتح التفاصيل.',
         'Tap the small bubble beside the capsule (the next-page bubble) twice quickly: every page pops out as a small capsule and lines up below. Tap one to show it in the capsule. A single tap on that bubble shows the next page; a single tap on the capsule itself opens the details.'] },
    { ic:'drag', col:'134,239,172', sh:'diamond', tag:['↓ باز  ·  ↑ بسته', '↓ فتح  ·  ↑ إغلاق', '↓ open  ·  ↑ close'],
      t:['کشیدن با انگشت', 'السحب بالإصبع', 'Drag'],
      b:['قرص را به پایین بکشید؛ کارت زنده دنبال انگشت شما باز می‌شود. برای بستن، سربرگ کارت را به بالا بکشید یا دکمه‌ی فلش بالا، کلید Escape و ضربه روی فضای تیره را بزنید. یادآوری‌ها را هم با کشیدن به بالا کنار بزنید.',
         'اسحب القرص للأسفل فتنفتح البطاقة تتبع إصبعك. للإغلاق اسحب رأس البطاقة للأعلى أو اضغط سهم الأعلى أو مفتاح Escape أو المنطقة المعتمة. ويمكنك إزاحة التنبيهات بسحبها للأعلى.',
         'Drag the pill downwards and the card opens, following your finger. To close it, drag the card header up, or use the up arrow, the Escape key or the dim area. Reminders can be dismissed by dragging them up.'] },
    { ic:'swap', col:'176,160,255', sh:'ring', tag:['خودکار', 'تلقائي', 'Auto'],
      t:['چرخش صفحه‌ها و حباب کناری', 'تبديل الصفحات والفقاعة الجانبية', 'Page rotation and side bubble'],
      b:['قرص هر ۷ ثانیه خودش بین صفحه‌ها می‌چرخد: اذان، مراسم، ساعت، تاریخ، مناسبت بعدی، ذکر روز، صلوات و همین راهنما. حباب کوچک کنار قرص صفحه‌ی بعدی را نشان می‌دهد و با زدن روی آن همان لحظه عوض می‌شود. تا انگشتتان روی قرص است، چرخش می‌ایستد.',
         'تتبدّل الكبسولة كل ٧ ثوانٍ بين الصفحات: الأذان والمراسم والساعة والتاريخ والمناسبة القادمة وذكر اليوم والصلوات وهذا الدليل. الفقاعة الصغيرة بجانبها تعرض الصفحة التالية، وبالضغط عليها تتغيّر فوراً. يتوقف التبديل ما دام إصبعك على القرص.',
         'Every 7 seconds the pill rotates through its pages: Adhan, gatherings, clock, date, next occasion, daily dhikr, salawat and this guide. The small bubble beside it shows the next page, and tapping it switches at once. Rotation pauses while your finger is on the pill.'] },
    { ic:'timer', col:'255,159,10', sh:'leaf', tag:['تایمر', 'مؤقّت', 'Timer'],
      t:['تایمر و زنگ پایان', 'المؤقّت ومنبّه الانتهاء', 'Timer and end alarm'],
      b:['از کارت کامل، تایمر ۱، ۵، ۱۰، ۱۵ یا ۳۰ دقیقه‌ای را بزنید یا عدد دلخواه خودتان را انتخاب کنید. تایمر در خود قرص با دکمه‌های توقف و لغو دیده می‌شود و می‌توانید یک دقیقه به آن اضافه کنید. وقتی تمام شد، زنگ هشدار پخش می‌شود تا آن را ببندید. فقط تایمر صدا دارد؛ یادآوری‌های اذان و مراسم بی‌صدا هستند.',
         'من البطاقة الكاملة اختر مؤقّتاً لدقيقة أو ٥ أو ١٠ أو ١٥ أو ٣٠ دقيقة، أو حدّد الوقت الذي تريده. يظهر المؤقّت في القرص نفسه مع زرّي الإيقاف والإلغاء ويمكنك إضافة دقيقة. عند الانتهاء يرنّ المنبّه حتى تغلقه. الصوت للمؤقّت فقط؛ تنبيهات الأذان والمراسم صامتة.',
         'From the full card start a 1, 5, 10, 15 or 30 minute timer, or pick any number you like. The timer shows in the pill with pause and cancel buttons, and you can add a minute. When it ends an alarm rings until you dismiss it. Only the timer makes sound; Adhan and gathering reminders are silent.'] },
    { ic:'bell', col:'251,113,133', sh:'hex', tag:['یادآوری', 'تنبيه', 'Reminder'],
      t:['یادآوری اذان و مراسم', 'تنبيهات الأذان والمراسم', 'Adhan and gathering reminders'],
      b:['پیش از اذان صبح، ظهر و مغرب (یک ساعت، نیم‌ساعت و پنج دقیقه مانده) و لحظه‌ی شروع آن، و برای مراسم هیئت (۲۴ ساعت، یک ساعت، نیم‌ساعت و پنج دقیقه مانده) کارت یادآوری باز می‌شود. دکمه‌های «۵ دقیقه بعد»، «باز کردن» و «تقویم» زیر آن است و با زدن روی خود کارت، جزئیات کامل را می‌بینید.',
         'قبل أذان الفجر والظهر والمغرب (ساعة ونصف ساعة و٥ دقائق) وعند بدء الوقت، وقبل مراسم الهيئة (٢٤ ساعة وساعة ونصف ساعة و٥ دقائق) تنفتح بطاقة تنبيه. تجد تحتها «بعد ٥ دقائق» و«فتح» و«التقويم»، وبالضغط على البطاقة تظهر التفاصيل.',
         'Before Fajr, Dhuhr and Maghrib (one hour, half an hour and five minutes ahead) and at the start time, and before gatherings (24 hours, one hour, half an hour and five minutes ahead), a reminder card opens. Below it are “In 5 min”, “Open” and “Calendar”; tap the card itself for the full details.'] },
    { ic:'heart', col:'249,168,212', sh:'squircle', tag:['شمارنده', 'عدّاد', 'Counter'],
      t:['ذکر روز و صلوات‌شمار', 'ذكر اليوم وعدّاد الصلوات', 'Daily dhikr and salawat counter'],
      b:['در کارت، ذکر مخصوص امروز و صلوات‌شمار هست. با «+» می‌شمارید و با «−» یکی کم می‌کنید. شمارش‌ها در همین گوشی ذخیره می‌شوند و قرص هم همان عدد را نشان می‌دهد.',
         'في البطاقة ذكر خاص باليوم وعدّاد للصلوات. اضغط «+» للعدّ و«−» لإنقاص واحدة. تُحفظ الأعداد على جهازك وتعرضها الكبسولة نفسها.',
         'The card holds today’s dhikr and a salawat counter. Use “+” to count and “−” to take one away. Counts are saved on your device and the pill shows the same number.'] },
    { ic:'date', col:'45,212,191', sh:'diamond', tag:['تقویم', 'تقويم', 'Calendar'],
      t:['افزودن مراسم به تقویم گوشی', 'إضافة المراسم إلى تقويم الهاتف', 'Add gatherings to your calendar'],
      b:['کنار هر مراسم دکمه‌ی تقویم هست. با زدنش فایلی دریافت می‌شود که مراسم را با تکرار هفتگی و هشدار نیم‌ساعت قبل به تقویم گوشی شما اضافه می‌کند.',
         'بجانب كل مراسم زر التقويم. بالضغط عليه يُنزَّل ملف يضيف المراسم إلى تقويم هاتفك مع تكرار أسبوعي وتنبيه قبل نصف ساعة.',
         'Beside every gathering there is a calendar button. It downloads a file that adds the gathering to your phone calendar with a weekly repeat and a 30 minute alert.'] },
    { ic:'gear', col:'186,230,253', sh:'circle', tag:['تنظیمات', 'الإعدادات', 'Settings'],
      t:['تنظیمات کپسول', 'إعدادات الكبسولة', 'Capsule settings'],
      b:['چرخ‌دنده‌ی بالای کارت، یا برگه‌ی «کپسول» در منوی تنظیمات: روشن و خاموش کردن، حالت «فقط یادآوری‌ها»، ظاهر و اندازه، لرزش و زنگ تایمر.',
         'أيقونة الترس أعلى البطاقة أو تبويب «الكبسولة» في قائمة الإعدادات: التشغيل والإيقاف ووضع «التنبيهات فقط» والمظهر والحجم والاهتزاز ومنبّه المؤقّت.',
         'The gear at the top of the card, or the “Capsule” tab in the settings menu: switch it on or off, “reminders only” mode, look and size, vibration and the timer alarm.'] }
  ];
  var GUIDE_TIP = ['ساعت و اوقات، به وقت تهران و خرم‌آباد است، حتی اگر ساعت گوشی چیز دیگری باشد. یادآوری‌ها و تایمر فقط وقتی کار می‌کنند که همین سایت باز باشد.',
                   'الساعة والأوقات بتوقيت طهران وخرّم‌آباد حتى لو كان توقيت هاتفك مختلفاً. تعمل التنبيهات والمؤقّت فقط ما دام هذا الموقع مفتوحاً.',
                   'The clock and times follow Tehran and Khorramabad, even if your phone is set differently. Reminders and the timer only work while this site is open.'];
  function gt(a){ return a[{ fa:0, ar:1, en:2 }[lang()]] || a[0]; }
  function gdInner(it){
    return '<span class="gd-b gd-' + it.sh + '">' + svg(it.ic) + '</span><div class="gd-t"><b>' + esc(gt(it.t)) + '<i class="gd-tag">' + esc(gt(it.tag)) + '</i></b><p>' + esc(gt(it.b)) + '</p></div>';
  }
  function gdTip(){ return '<div class="gd-tip"><b>' + esc(tt('gdTipT')) + '</b><p>' + esc(gt(GUIDE_TIP)) + '</p></div>'; }
  function guideCardHTML(k){
    return GUIDE.map(function(it, i){
      return '<div class="isl-sec gd-s" style="--k:' + (k + i) + ';--ac:' + it.col + ';--gc:' + it.col + '">' + gdInner(it) + '</div>';
    }).join('') + '<div class="isl-sec gd-s gd-tipw" style="--k:' + (k + GUIDE.length) + ';--ac:255,203,61;--gc:255,203,61">' + gdTip() + '</div>';
  }
  function guideSettingsHTML(){
    return '<div class="gd-hero"><span class="gd-hi">' + svg('book') + '</span><b>' + esc(tt('guideP')) + '</b><small>' + esc(tt('gdSub')) + '</small></div>' +
      GUIDE.map(function(it){ return '<div class="gd-s" style="--gc:' + it.col + '">' + gdInner(it) + '</div>'; }).join('') + gdTip();
  }
  function detailHTML(s){
    var kind = expKind, k = 1, h = '', hasNext = !!(s.day && s.day.today && s.day.today.next);
    if(kind === 'occasion' && !hasNext) kind = 'date';
    dkind = kind;
    if(kind === 'guide'){
      h = dtHead(s, tt('guideP'), 'book', COL.guide) + guideCardHTML(k);
    } else if(kind === 'prayer'){
      h = dtHead(s, tt('dtPrayer'), s.pm.key, COL.prayer) + dtPrayerSec(k++);
    } else if(kind === 'event'){
      h = dtHead(s, tt('dtEvent'), 'event', COL.event) +
        sec(k++, 'dt-evs', COL.event, '<span class="isl-sl dt-evl"></span><div class="dt-evrow"><div class="dt-evm"><b class="dt-evt"></b><small class="dt-evw"></small></div><b class="dt-cd"></b></div><div class="isl-bar"><i class="dt-evf"></i></div>') +
        sec(k++, 'isl-e', COL.event, '<span class="isl-sl">' + esc(tt('wkL')) + '</span>' + [0, 1].map(function(i){
          return '<div class="isl-evw" data-i="' + i + '"><a class="isl-ev" href="#"><span class="isl-eic">' + svg('event') + '</span><span class="isl-et"><b></b><small></small></span><span class="isl-ec"></span></a>' +
                 '<button type="button" class="isl-xb sm" data-a="icsrow" data-i="' + i + '" aria-label="' + esc(tt('icsBtn')) + '">' + svg('date') + '</button></div>';
        }).join(''));
    } else if(kind === 'clock'){
      h = dtHead(s, '', 'clock', COL.clock, true) + dtDateSec(k++) + dtPrayerSec(k++);
    } else if(kind === 'date' || kind === 'occasion'){
      h = dtHead(s, tt(kind === 'occasion' ? 'dtOcc' : 'dtDate'), kind === 'occasion' ? 'moon' : 'date', kind === 'occasion' ? COL.night : COL.date) +
        (kind === 'occasion' ? dtUpSec(k++) + dtDateSec(k++) : dtDateSec(k++) + dtUpSec(k++));
    } else if(kind === 'zekr'){
      h = dtHead(s, tt('zekrL'), 'zekr', COL.zekr) +
        sec(k++, 'dt-zs', COL.zekr, '<span class="isl-sl dt-zday"></span><div class="isl-zt dt-ar"></div><div class="dt-fa"></div>') +
        sec(k++, 'dt-cs', COL.zekr,
          '<button type="button" class="dt-ring" data-a="zek" aria-label="' + esc(tt('tapPlus')) + '"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="tr" cx="50" cy="50" r="44"/><circle class="pg" cx="50" cy="50" r="44"/></svg>' +
          '<span class="dt-rn"><b class="rl-box zc"></b><small class="zt"></small></span></button>' +
          '<div class="dt-crow"><button type="button" class="isl-plus dt-pm minus" data-a="zekm" aria-label="' + esc(tt('tapMinus')) + '">' + svg('minus') + '</button>' +
          '<span class="isl-zp"></span>' +
          '<button type="button" class="isl-plus dt-pm" data-a="zek" aria-label="' + esc(tt('tapPlus')) + '">' + svg('plus') + '</button></div>' +
          '<div class="isl-bar"><i class="zf"></i></div>');
    } else if(kind === 'salavat'){
      h = dtHead(s, tt('dtSal'), 'heart', COL.sal) +
        sec(k++, 'isl-sv dt-svm', COL.sal, '<span class="isl-sl">' + esc(tt('salL')) + '</span><div class="dt-ar">' + esc(SAL_ITEMS[0].ar) + '</div><b class="isl-sn rl-box"></b>' +
          '<div class="isl-pm"><button type="button" class="isl-plus minus" data-a="salm" aria-label="' + esc(tt('tapMinus')) + '">' + svg('minus') + '</button><button type="button" class="isl-plus" data-a="sal" aria-label="' + esc(tt('tapPlus')) + '">' + svg('plus') + '</button></div>') +
        sec(k++, 'dt-sl', COL.sal, [1, 2].map(function(i){
          var it = SAL_ITEMS[i];
          return '<div class="dt-cr"><div class="dt-cl"><b>' + esc(tt(it.l)) + '</b><small>' + esc(it.ar) + '</small></div><div class="dt-cn">' +
            '<button type="button" class="isl-plus sm minus" data-a="cnt" data-i="' + i + '" data-d="-1" aria-label="' + esc(tt('tapMinus')) + '">' + svg('minus') + '</button><output class="dt-cv"></output>' +
            '<button type="button" class="isl-plus sm" data-a="cnt" data-i="' + i + '" data-d="1" aria-label="' + esc(tt('tapPlus')) + '">' + svg('plus') + '</button></div></div>';
        }).join(''));
    }
    return h;
  }
  function upcomingRows(s){
    var out = [], L = lang(), i, m;
    for(i = 1; i <= 90 && out.length < 4; i++){
      m = C.todayModel(s.jdn + i);
      if(m && m.items.length) out.push({ days:i, it:m.items[0], more:m.items.length > 1, jd:m.jd, jm:m.jm });
    }
    if(!out.length) return '<div class="isl-oi dim"><i></i><span>' + esc(tt('upNone')) + '</span></div>';
    return out.map(function(o){
      return '<div class="dt-ur" style="color:' + (TONE[o.it.tone] || '#ffcb3d') + '"><i></i><span class="t">' + esc(o.it.title + (o.more ? ' …' : '')) + '</span>' +
             '<small>' + esc(C.fa(o.jd) + ' ' + C.jalaliMonthName(o.jm) + ' · ' + C.daysAhead(o.days)) + '</small></div>';
    }).join('');
  }
  function paintDetailExtras(s, animate){
    if(!xd) return;
    var L = lang();
    if(xd.kind === 'clock' && xr.csec) xr.csec.textContent = ':' + C.fa(p2(s.t.s));
    if(xd.evt && xrows[0]){
      var it = xrows[0], ev = it.ev, when = it.diff === 0 ? K.t('today') : (it.diff === 1 ? K.t('tomorrow') : C.weekdayName(ev.dow));
      xd.evl.textContent = it.live ? tt('live') : tt('evNext');
      xd.evt.textContent = pick(ev.title);
      xd.evw.textContent = tt(ev.id === 'majles' ? 'placeK' : 'placeQ') + ' · ' + when + ' · ' + pick(ev.time);
      xd.cd.textContent = it.live ? tpl(tt('elapsed'), { d:C.durText(Math.max(1, Math.floor(it.elapsed))) }) : C.durText(it.remainMin);
      xd.cd.classList.toggle('sm', !!it.live);
      xd.evf.style.width = Math.round((it.live ? s.live.progress : clamp(1 - it.remainMin / 10080, 0, 1)) * 100) + '%';
    }
    if(xd.zr){
      var z = C.ZEKR_BY_DAY[s.dow], n = Math.min(intLS(C.zekrKey(s.t)), C.ZEKR_TARGET);
      if(z){
        xd.zday.textContent = C.weekdayName(s.dow);
        xd.zfa.textContent = L === 'fa' ? z.fa : '';
        xd.zfa.hidden = L !== 'fa';
      }
      if(rZ) rZ.set(C.fa(n), animate !== false);
      xd.zt2.textContent = '/' + C.fa(C.ZEKR_TARGET);
      xd.zpg.style.strokeDashoffset = String(276.46 * (1 - n / C.ZEKR_TARGET));
      xd.zr.classList.toggle('done', n >= C.ZEKR_TARGET);
    }
    if(xd.cv.length){ xd.cv.forEach(function(o, i){ o.textContent = C.fa(intLS(SAL_ITEMS[i + 1].k)); }); }
    if(xd.up){
      var key = s.jdn + '|' + L;
      if(key !== upKey){ upKey = key; xd.up.innerHTML = upcomingRows(s); }
    }
  }
  function bumpSal(i, d){
    var it = SAL_ITEMS[i]; if(!it || !d) return;
    var c0 = intLS(it.k);
    if(d < 0 && c0 <= 0){ if(cfg.haptic) buzz([10, 40, 10]); return; }
    lsSet(it.k, String(Math.max(0, c0 + d)));
    if(cfg.haptic && !inQuiet(S.t)) buzz(10);
    try{ if(K.tick) K.tick(); }catch(e){}
    paintExpanded(S, true);
  }
  function bumpCount(act){
    var dec = act.charAt(act.length - 1) === 'm', which = dec ? act.slice(0, -1) : act;      /* salm / zekm = کم کردن */
    var key = which === 'sal' ? 'kazemiuon-salavat-count-salawat' : C.zekrKey(S.t);
    var c0 = intLS(key);
    if(dec && c0 <= 0){ if(cfg.haptic) buzz([10, 40, 10]); return; }
    lsSet(key, String(Math.max(0, c0 + (dec ? -1 : 1))));
    if(cfg.haptic && !inQuiet(S.t)) buzz(10);
    try{ if(K.tick) K.tick(); }catch(e){}
    paintExpanded(S, true);
    if(which === 'zek'){ var zr = xL.querySelector('.dt-ring'); if(zr && zr.animate && !calm()) zr.animate([{ scale:'1' }, { scale:'.93' }, { scale:'1.03' }, { scale:'1' }], { duration:340, easing:'ease-out' }); }
    if(which === 'sal') { var sv = xL.querySelector('.isl-sv'); if(sv && sv.animate) sv.animate([{ scale:'1' }, { scale:'.97' }, { scale:'1' }], { duration:260, easing:'ease-out' }); }
  }

  /* ---------- باز شدن قرص‌ها با دو ضربه‌ی سریع روی کپسول ----------
     ضربه‌ی تکی همان کار همیشگی را می‌کند (جزئیات قرص فعلی؛ با تأخیر بسیار کوتاه تا معلوم شود ضربه‌ی دوم می‌آید).
     دو ضربه‌ی پشت‌سرهم: همه‌ی قرص‌ها، هر کدام به شکل یک کپسول کوچک (همان ظاهر قرص اصلی)، از دل کپسول بیرون می‌آیند
     و با فنر زیر آن ردیف می‌شوند. با یک ضربه روی هر قرص همان در کپسول می‌نشیند؛ ضربه‌ی بیرون یا لمس کپسول آن‌ها را می‌بندد.
     (فقط transform و opacity انیمیت می‌شوند و هیچ بلور یا سایه‌ی سنگینی نیست، تا روی گوشی‌های ضعیف هم روان بماند) */
  var FAN_DBL = 280;
  var FAN_KINDS = ['prayer', 'event', 'clock', 'date', 'occasion', 'zekr', 'salavat', 'guide'];
  var FAN_COLK = { prayer:'prayer', event:'event', clock:'clock', date:'date', occasion:'night', zekr:'zekr', salavat:'sal', guide:'guide' };
  var fanOn = false, fan = null, fanPills = [], fanNear = null, fanMode = '', fanLast = null, fanRaf = 0, fanPid = -1, fanQuiet = 0, dtT = 0, fanGeo = null, fanRef = 0;
  var tmpKind = '', tmpUntil = 0;

  function fanVals(kd, s){
    var m = pageModel(kd, s), n = m.n, u = m.u;
    if(m.remain !== undefined){ var r = shortRemain(m.remain); n = r.n; u = r.u; }
    return { m:m, n:n, u:u };
  }
  /* ضربه روی قرص کناری (حباب کوچک): اگر باز شدن قرص‌ها روشن باشد، ضربه‌ی تکی کمی صبر می‌کند؛ ضربه‌ی دوم قرص‌ها را باز می‌کند.
     کپسول اصلی دست‌نخورده است و ضربه‌ی تکی‌اش بی‌تأخیر کار می‌کند. */
  function dblTap(single){
    if(!cfg.fan || tm) return false;
    if(dtT){ clearTimeout(dtT); dtT = 0; if(cfg.haptic && !inQuiet(S && S.t)) buzz([10, 30, 10]); fanOpenTap(); return true; }
    dtT = setTimeout(function(){ dtT = 0; if(state === 'compact' && !fanOn) single(); }, FAN_DBL);
    return true;
  }
  function dblCancel(){ clearTimeout(dtT); dtT = 0; }
  function fanOpenTap(){
    if(fan || !cfg.on || state !== 'compact' || tm) return;
    fanOn = true; fanMode = 'tap'; fanPid = -1; fanLast = null; fanQuiet = performance.now() + 250;
    html.classList.add('isl-fan-on'); satSync();
    fanBuild(); fanReveal(); fan.classList.add('tap');
    var b = fan.querySelector('.ipl'); if(b){ try{ b.focus({ preventScroll:true }); }catch(_){} }
  }
  function fanBuild(){
    S = snap();
    var kinds = FAN_KINDS.filter(function(k){ return pageOk(k); });
    var n = kinds.length, W = vw(), kk = SIZE_K[cfg.size], h = ch();
    var topPx = parseFloat(getComputedStyle(root).top) || 10;
    var pw = Math.min(Math.round(300 * kk), W - 32), gap = Math.round(8 * kk);
    var first = topPx + h + Math.round(14 * kk), cur = curKind(S);
    var avail = vh() - first - 14;
    if(n > 1 && n * h + (n - 1) * gap > avail) gap = Math.max(3, Math.floor((avail - n * h) / (n - 1)));
    fanGeo = { cx:W / 2, half:pw / 2 + 30, top:first, step:h + gap, gap:gap, n:n, h:h, capY:topPx + h / 2 };
    var f = doc.createElement('div'); f.className = 'ipl-wrap'; f.setAttribute('role', 'group'); f.setAttribute('aria-label', tt('fanT'));
    f.setAttribute('data-style', cfg.style);
    f.style.setProperty('--k', String(kk)); f.style.setProperty('--ch', h + 'px'); f.style.setProperty('--pw', pw + 'px');
    fanPills = []; fanNear = null;
    kinds.forEach(function(kd, i){
      var v = fanVals(kd, S), m = v.m, p = doc.createElement('div');
      p.className = 'ipl' + (kd === cur ? ' cur' : ''); p.setAttribute('role', 'button'); p.tabIndex = 0; p.setAttribute('data-kind', kd);
      p.style.cssText = 'top:' + (first + i * (h + gap)) + 'px;--ac:' + COL[FAN_COLK[kd]];
      p.innerHTML = '<span class="isl-ring"><svg class="rg" viewBox="0 0 24 24" aria-hidden="true"><circle class="tr" cx="12" cy="12" r="10.5"/><circle class="pg" cx="12" cy="12" r="10.5"/></svg><span class="isl-ic">' + svg(m.icon) + '</span></span>' +
        '<span class="isl-lb"></span><span class="isl-tm"><b></b><i></i></span>';
      var o = { el:p, kind:kd, prog:clamp(m.progress, 0, 1), pg:p.querySelector('.pg'), lb:p.querySelector('.isl-lb'), b:p.querySelector('b'), u:p.querySelector('i'), sig:'' };
      p.querySelector('.pg').style.strokeDashoffset = '66';
      fanPaintPill(o, v);
      f.appendChild(p); fanPills.push(o);
    });
    f.addEventListener('click', function(e){
      if(performance.now() < fanQuiet) return;
      var b = e.target.closest && e.target.closest('.ipl');
      if(b){ e.preventDefault(); fanPick(b.getAttribute('data-kind')); return; }
      fanClose();
    });
    f.addEventListener('keydown', function(e){
      var i = fanPills.map(function(p){ return p.el; }).indexOf(doc.activeElement);
      if(e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); var t = fanPills[clamp(i + (e.key === 'ArrowDown' ? 1 : -1), 0, fanPills.length - 1)]; if(t) t.el.focus(); }
      else if((e.key === 'Enter' || e.key === ' ') && i > -1){ e.preventDefault(); fanPick(fanPills[i].kind); }
    });
    body.appendChild(f); fan = f;
    clearInterval(fanRef); fanRef = setInterval(fanRefresh, 1000);
  }
  function fanPaintPill(o, v){
    var sig = v.m.label + '|' + v.n + '|' + v.u;
    if(sig === o.sig) return; o.sig = sig;
    o.lb.textContent = v.m.label; o.b.textContent = v.n; o.u.textContent = v.u;
    o.el.setAttribute('aria-label', v.m.label + ' ' + v.n + ' ' + v.u);
  }
  function fanRefresh(){
    if(!fan) return;
    S = snap();
    fanPills.forEach(function(o){ var v = fanVals(o.kind, S); fanPaintPill(o, v); o.prog = clamp(v.m.progress, 0, 1); o.pg.style.strokeDashoffset = String(66 * (1 - o.prog)); });
  }
  function fanReveal(){
    var f = fan; if(!f || !fanOn) return;
    void f.offsetWidth;
    requestAnimationFrame(function(){
      if(fan !== f) return;
      f.classList.add('open');
      var anim = !!f.animate && !calm(), sp = spring(250, 21, 1), g = fanGeo;
      fanPills.forEach(function(o, i){
        if(anim){
          var dy = g.capY - (parseFloat(o.el.style.top) + g.h / 2);       /* از جای کپسول اصلی شروع می‌شود */
          try{
            o.el.animate([
              { transform:'translateY(' + dy.toFixed(1) + 'px) scale(.6,.5)', opacity:0 },
              { opacity:1, offset:.28 },
              { transform:'none', opacity:1 }
            ], { duration:sp.duration, delay:i * 44, easing:sp.easing, fill:'backwards' });
          }catch(_){}
        }
        setTimeout(function(){ if(fan === f) o.pg.style.strokeDashoffset = String(66 * (1 - o.prog)); }, anim ? 220 + i * 44 : 0);
      });
    });
  }
  function fanClose(instant){
    var f = fan, pills = fanPills, g = fanGeo;
    fanOn = false; fan = null; fanMode = ''; fanNear = null; fanPills = []; fanPid = -1; fanLast = null; fanGeo = null;
    clearInterval(fanRef); fanRef = 0;
    html.classList.remove('isl-fan-on');
    if(!f) return;
    f.classList.remove('open', 'tap'); f.classList.add('closing');
    var wait = 0;
    if(!instant && f.animate && !calm() && g){
      var n = pills.length;
      pills.forEach(function(o, i){                                       /* قرص‌ها دوباره به دل کپسول برمی‌گردند (دورترین اول) */
        var dy = g.capY - (parseFloat(o.el.style.top) + g.h / 2);
        try{ o.el.animate([{ transform:'none', opacity:1 }, { transform:'translateY(' + dy.toFixed(1) + 'px) scale(.6,.5)', opacity:0 }], { duration:230, delay:(n - 1 - i) * 16, easing:'cubic-bezier(.5,0,.75,0)', fill:'forwards' }); }catch(_){}
      });
      wait = 230 + n * 16 + 40;
    }
    setTimeout(function(){ if(f.parentNode) f.parentNode.removeChild(f); }, wait);
    satSync();
    setTimeout(function(){ if(queue.length && state === 'compact') showNext(); }, 450);
  }
  function fanPick(kd){
    var idx = pagesList().indexOf(kd);
    fanClose();
    if(cfg.haptic && !inQuiet(S && S.t)) buzz(12);
    tmpKind = '';
    if(cfg.rotate > 0 && idx > -1){ pageIdx = idx; }
    else { tmpKind = kd; tmpUntil = Date.now() + (cfg.rotate > 0 ? cfg.rotate * 1000 : 30000); }
    if(typeof lastRot !== 'undefined') lastRot = Date.now();
    if(typeof rotSave === 'function') rotSave();
    S = snap(); lastSig = '';
    swapCompact(function(){ paintCompact(S, true); });
    rotSync();
  }
  /* هر قرصی که انگشت روی ردیفش باشد برجسته می‌شود (نوارهای پیوسته، بدون نقطه‌ی مرده) */
  function fanNearUpdate(){
    fanRaf = 0; if(!fan || !fanLast || !fanGeo) return;
    var g = fanGeo, x = fanLast.clientX, y = fanLast.clientY, idx = Math.floor((y - (g.top - g.gap / 2)) / g.step);
    var nn = (idx >= 0 && idx < g.n && Math.abs(x - g.cx) <= g.half) ? fanPills[idx] : null;
    if(nn === fanNear) return;
    if(fanNear) fanNear.el.classList.remove('near');
    if(nn){ nn.el.classList.add('near'); if(cfg.haptic && !inQuiet(S && S.t)) buzz(5); }
    fanNear = nn;
  }
  window.addEventListener('pointermove', function(e){
    if(fan && fanOn && e.pointerType === 'mouse'){ fanLast = e; if(!fanRaf) fanRaf = requestAnimationFrame(fanNearUpdate); }
  }, { passive:true });
  doc.addEventListener('visibilitychange', function(){ if(doc.hidden){ dblCancel(); if(fanOn) fanClose(true); } });
  window.addEventListener('resize', function(){ if(fanOn) fanClose(true); });
  doc.addEventListener('keydown', function(e){ if(e.key === 'Escape' && fanOn){ e.preventDefault(); fanClose(); try{ root.focus(); }catch(_){} } });
  root.addEventListener('keydown', function(e){ if(e.key === 'ArrowDown' && e.target === root && state === 'compact' && cfg.fan && !tm){ e.preventDefault(); fanOpenTap(); } });

  /* ---------- چرخه‌ی زمان ---------- */
  var timer = 0;
  function tick(){
    timer = 0;
    if(doc.hidden || !cfg.on) return;
    S = snap();
    var menuOpen = html.classList.contains('kzm-menu-open');
    if(!menuOpen){
      paintSky(S);
      paintCompact(S);
      if(state === 'alert') paintAlert();
      if(state === 'expanded' && !drag) paintExpanded(S, true);
    }
    checkTimer();
    checkAlerts(S);
    var near = Math.min(S.pm.remainMin, S.evs[0] ? S.evs[0].remainMin : 1e9);
    var kind = curKind(S);
    var secLive = (cfg.clockSec && (kind === 'clock' || cfg.clockPill)) || (cfg.seconds && (kind === 'prayer' || kind === 'event') && near < 60);
    var fast = (state !== 'compact' && state !== 'idle') || near < 1.3 || secLive || !!tm;
    var d;
    if(menuOpen) d = 4000;
    else if(fast) d = 1000 - (Date.now() % 1000) + 15 + TAB_JIT;
    else d = Math.min(15000, 60000 - (Date.now() % 60000) + 40);
    var sz = snzLoad();       /* «بعداً یادآوری» نزدیک است: تیک بعدی درست سر وقتش */
    if(sz.length){ var nd = Math.min.apply(null, sz.map(function(x){ return +x.due || 0; })) - Date.now() + 60 + TAB_JIT; d = Math.min(d, Math.max(300, nd)); }
    timer = setTimeout(tick, d);
  }
  function restartTick(){ clearTimeout(timer); timer = 0; tick(); }

  /* ---------- لمس و کشیدن: کپسول دنبال انگشت می‌آید ---------- */
  var drag = null, swallowUntil = 0;
  function press(on){ if(on) root.setAttribute('data-press', ''); else root.removeAttribute('data-press'); }
  function clearInline(el){ ['opacity', 'scale', 'filter', 'visibility'].forEach(function(p){ el.style.removeProperty(p); }); }
  function startDrag(e){
    drag.on = true; holdClear(); lockSync();
    try{ root.setPointerCapture(e.pointerId); }catch(_){}
    press(false); clearTimeout(alertT); sat.classList.remove('on');
    root.classList.add('dragging');
    S = snap();
    if(drag.from === 'expanded'){
      paintCompact(S, true);
      drag.dFrom = dims('expanded'); drag.dTo = dims('compact'); drag.lf = xL; drag.lt = cL;
    } else {
      expKind = (drag.from === 'compact' && !tm) ? curKind(S) : null;
      buildExpanded(S); paintExpanded(S, false); void xL.offsetHeight;
      drag.dFrom = dims(drag.from); drag.dTo = dims('expanded'); drag.lf = LAYERS[drag.from]; drag.lt = xL;
    }
    drag.dist = Math.max(120, Math.min(220, (drag.dTo.h - drag.dFrom.h) * 0.6));
  }
  function moveDrag(dy){
    var raw = (drag.from === 'expanded' ? -dy : dy) / drag.dist;
    var p = raw < 0 ? raw * 0.22 : (raw > 1 ? 1 + (raw - 1) * 0.16 : raw);
    p = clamp(p, -0.1, 1.12); drag.p = p;
    var q = clamp(p, 0, 1);
    root.style.setProperty('--isl-w', lerp(drag.dFrom.w, drag.dTo.w, p) + 'px');
    root.style.setProperty('--isl-h', lerp(drag.dFrom.h, drag.dTo.h, p) + 'px');
    root.style.setProperty('--isl-r', lerp(drag.dFrom.r, drag.dTo.r, q) + 'px');
    var fe = clamp(1 - q * 2.1, 0, 1), te = clamp((q - 0.3) / 0.5, 0, 1);
    drag.lf.style.visibility = 'visible'; drag.lf.style.opacity = String(fe); drag.lf.style.scale = String(1 - 0.12 * q); drag.lf.style.filter = 'blur(' + (q * 8).toFixed(1) + 'px)';
    drag.lt.style.visibility = 'visible'; drag.lt.style.opacity = String(te); drag.lt.style.scale = String(0.9 + 0.1 * te); drag.lt.style.filter = 'blur(' + ((1 - te) * 8).toFixed(1) + 'px)';
    scrim.style.opacity = String(drag.from === 'expanded' ? 1 - q : q);
  }
  function endDrag(e){
    var d = drag; drag = null;
    clearInline(d.lf); clearInline(d.lt); scrim.style.removeProperty('opacity');
    root.classList.remove('dragging');
    swallowUntil = performance.now() + 450;
    var vel = (e.clientY - d.y) / Math.max(1, performance.now() - d.t) * (d.from === 'expanded' ? -1 : 1);
    var commit = d.p > 0.4 || vel > 0.5;
    if(d.from === 'expanded'){
      if(commit) collapse(); else { setLayers('expanded'); morphTo(dims('expanded'), SP.open); }
    } else {
      if(commit){ tap(); openCard(); }
      else {
        setLayers(state); morphTo(dims(state), SP.soft);
        if(state === 'alert') holdAlert(false);
      }
    }
    satSync(); lockSync();
  }
  /* لمس/بازبودن کپسول: انیمیشن‌های پرهزینه‌ی صفحه‌ی پشت می‌ایستند (کلاس isl-busy)؛ بعد از ۰٫۷ ثانیه که کارت بسته شد دوباره ادامه می‌یابند */
  var busyT = 0;
  function busy(on){
    clearTimeout(busyT); busyT = 0;
    if(on){ html.classList.add('isl-busy'); return; }
    busyT = setTimeout(function(){
      busyT = 0;
      if(state === 'expanded' || (drag && drag.on) || holdT) return;
      html.classList.remove('isl-busy');
    }, 700);
  }
  /* نگه داشتن انگشت روی قرص: کارت کامل (تایمر، اوقات، مراسم و ...) باز می‌شود */
  var holdT = 0, holdFired = false;
  function holdClear(){ clearTimeout(holdT); holdT = 0; preCancel(); root.removeAttribute('data-hold'); }
  function fireHold(){
    holdT = 0; preCancel(); root.removeAttribute('data-hold');
    if(state !== 'compact' || !drag || drag.on) return;
    drag = null; press(false); holdFired = true;
    if(cfg.haptic && !inQuiet(S && S.t)) buzz([14, 36, 14]);
    dblCancel();
    expand(null, true);
  }
  root.addEventListener('contextmenu', function(e){ e.preventDefault(); });
  root.addEventListener('pointerdown', function(e){
    if(fanOn){ fanClose(); holdFired = true; return; }     /* قرص‌ها باز است: لمس کپسول آن را می‌بندد */
    holdFired = false;
    if(state === 'idle' || (e.button !== undefined && e.button > 0)) return;
    if(e.target.closest && e.target.closest('button, a')) { if(state === 'alert') holdAlert(true); return; }
    if(state === 'expanded' && !(e.target.closest && (e.target.closest('.isl-xh') || (expKind && e.target.closest('.isl-x.dtf'))))) return;
    drag = { id:e.pointerId, x:e.clientX, y:e.clientY, t:performance.now(), on:false, from:state, p:0 };
    if(state === 'compact' || state === 'alert') busy(true);
    if(state !== 'expanded') press(true);
    if(state === 'alert') holdAlert(true);
    preCancel();
    if(state === 'compact'){
      root.style.setProperty('--hold', cfg.hold + 'ms'); root.setAttribute('data-hold', '');
      clearTimeout(holdT); holdT = setTimeout(fireHold, cfg.hold);
      /* ضربه‌ی ساده: جزئیات بخش فعلی؛ نگه داشتن: کارت کامل — هر دو از پیش آماده می‌شوند */
      preT = setTimeout(function(){ preT = 0; if(drag && !drag.on && state === 'compact') preBuild(tm ? null : curKind(snap())); }, 30);
      preT2 = setTimeout(function(){ preT2 = 0; if(drag && !drag.on && state === 'compact' && !tm) preBuild(null); }, Math.min(260, Math.round(cfg.hold * 0.4)));
    } else if(state === 'alert'){
      preT = setTimeout(function(){ preT = 0; if(drag && !drag.on && state === 'alert') preBuild(null); }, 30);
    }
  });
  root.addEventListener('pointermove', function(e){
    if(!drag || drag.id !== e.pointerId) return;
    var dy = e.clientY - drag.y, dx = e.clientX - drag.x;
    if(holdT && Math.hypot(dx, dy) > 10) holdClear();
    if(!drag.on){
      if(Math.abs(dy) < 7 || Math.abs(dy) < Math.abs(dx) * 1.2) return;
      if(drag.from === 'expanded' ? dy > 0 : dy < 0){
        if(drag.from === 'alert' && dy < -22){ drag = null; press(false); swallowUntil = performance.now() + 400; collapse(); }
        return;
      }
      startDrag(e);
    }
    moveDrag(dy);
  });
  function releasePtr(e){
    holdClear();
    if(drag && drag.on) endDrag(e);
    else { drag = null; press(false); if(state === 'alert') holdAlert(false); }
    if(state !== 'expanded') busy(false);
  }
  root.addEventListener('pointerup', releasePtr);
  root.addEventListener('pointercancel', releasePtr);
  root.addEventListener('pointerleave', function(e){ if(!drag || !drag.on){ holdClear(); drag = null; press(false); if(state === 'alert') holdAlert(false); if(state !== 'expanded') busy(false); } });

  root.addEventListener('click', function(e){
    if(holdFired){ holdFired = false; return; }
    if(performance.now() < swallowUntil) return;
    var btn = e.target.closest && e.target.closest('[data-a]');
    if(btn){
      var act = btn.getAttribute('data-a');
      if(act === 'close') collapse();
      else if(act === 'cfg') openSettings();
      else if(act === 'snooze') snoozeAlert();
      else if(act === 'open') go(btn.getAttribute('data-href'));
      else if(act === 'ics' && cur && cur.ev) icsFor(cur.ev, cur.diff || 0);
      else if(act === 'icsrow'){ var rw = btn.closest('.isl-evw'); var ev = rw && C.WEEKLY.filter(function(w){ return w.id === rw.getAttribute('data-ev'); })[0]; if(ev) icsFor(ev, parseInt(rw.getAttribute('data-diff'), 10) || 0); }
      else if(act === 'sal' || act === 'zek' || act === 'salm' || act === 'zekm') bumpCount(act);
      else if(act === 'cnt') bumpSal(parseInt(btn.getAttribute('data-i'), 10), parseInt(btn.getAttribute('data-d'), 10));
      else if(act === 'xall') switchExp(null);
      else if(act === 'tpause') pauseTimer();
      else if(act === 'tcancel') cancelTimer();
      else if(act === 'tadd') addTimer(1);
      else if(act === 'tstart') startTimer(parseInt(btn.getAttribute('data-m'), 10) || 5);
      else if(act === 'tgo') startTimer(tmrCustom);
      else if(act === 'tstep') stepCustom(parseInt(btn.getAttribute('data-d'), 10));
      else if(act === 'trestart'){ var dm = cur && cur.dur ? Math.max(1, Math.round(cur.dur / 60000)) : 5; collapse(); startTimer(dm); }
      return;
    }
    var link = e.target.closest && e.target.closest('a.isl-ev');
    if(link){ e.preventDefault(); go(link.getAttribute('href')); return; }
    if(state === 'compact') expandDetail(); else if(state === 'alert') expand();
  });
  root.addEventListener('keydown', function(e){
    if((e.key === 'Enter' || e.key === ' ') && e.target === root && (state === 'compact' || state === 'alert')){ e.preventDefault(); if(e.shiftKey || state === 'alert') expand(); else expandDetail(); }
  });
  scrim.addEventListener('click', function(){ if(state === 'expanded') collapse(); });
  doc.addEventListener('keydown', function(e){ if(e.key === 'Escape' && (state === 'expanded' || state === 'alert')) collapse(); });

  var wasMenuOpen = false;
  (function(){
    var pn = $('kzm-menu'), lb = pn && pn.querySelector('.lg-body'), t = 0;
    if(!lb) return;
    lb.addEventListener('scroll', function(){ pn.classList.add('lg-busy'); clearTimeout(t); t = setTimeout(function(){ pn.classList.remove('lg-busy'); }, 220); }, { passive:true });
    /* در ابتدا و انتهای لیست، کشیدن بیشتر به صفحه‌ی پشت یا برنامه‌ی میزبان منتقل نشود (در بعضی مرورگرهای داخل برنامه، overscroll-behavior را رعایت نمی‌کنند) */
    var ly = 0;
    lb.addEventListener('touchstart', function(e){ ly = e.touches[0].clientY; }, { passive:true });
    lb.addEventListener('touchmove', function(e){
      var y = e.touches[0].clientY, dy = y - ly; ly = y;
      if(e.target.closest && e.target.closest('input')) return;                         /* لغزنده‌ی اندازه‌ی متن */
      var top = lb.scrollTop <= 0, bot = lb.scrollTop + lb.clientHeight >= lb.scrollHeight - 1;
      if(lb.scrollHeight <= lb.clientHeight + 1 || (dy > 0 && top) || (dy < 0 && bot)){ if(e.cancelable) e.preventDefault(); }
    }, { passive:false });
  })();
  if(window.MutationObserver){
    new MutationObserver(function(){
      var open = html.classList.contains('kzm-menu-open');
      if(open){ if(state === 'expanded') collapse(); if(uiPage !== 'home'){ uiPage = 'home'; renderUI(false); } }
      else if(wasMenuOpen){ lastSig = ''; restartTick(); }
      wasMenuOpen = open;
    })
      .observe(html, { attributes:true, attributeFilter:['class'] });
  }
  function lockMove(e){
    if(state !== 'expanded' && !(drag && drag.on)) return;
    var t = e.target, x = t && t.closest ? t.closest('.isl-x') : null;
    if(x && x.scrollHeight > x.clientHeight + 1 && !t.closest('.isl-xh')){
      /* داخل کارت اسکرول کن؛ در ابتدا و انتها هم به صفحه‌ی پشت منتقل نشود */
      if(e.type === 'wheel'){ var up = e.deltaY < 0; if((up && x.scrollTop <= 0) || (!up && x.scrollTop + x.clientHeight >= x.scrollHeight - 1)){ if(e.cancelable) e.preventDefault(); } }
      return;
    }
    if(e.cancelable) e.preventDefault();
  }
  /* شنونده‌ی غیرغیرفعال (passive:false) روی کل صفحه اسکرول و لمس را همیشه کند می‌کند؛ فقط وقتی کارت باز است یا کشیدن جریان دارد نصب می‌شود */
  var lockOn = false;
  function lockSync(){
    var want = (state === 'expanded') || !!(drag && drag.on);
    if(want === lockOn) return;
    lockOn = want;
    if(want){ doc.addEventListener('touchmove', lockMove, { passive:false }); doc.addEventListener('wheel', lockMove, { passive:false }); }
    else { doc.removeEventListener('touchmove', lockMove, { passive:false }); doc.removeEventListener('wheel', lockMove, { passive:false }); }
  }
  /* قفل اسکرول صفحه بدون overflow:hidden روی html (که کل صفحه را دوباره می‌چید و باعث لگ می‌شد): کیبورد هم قفل است */
  doc.addEventListener('keydown', function(e){
    if(state !== 'expanded') return;
    var k = e.key; if(!(k === ' ' || k === 'PageDown' || k === 'PageUp' || k === 'Home' || k === 'End' || k === 'ArrowDown' || k === 'ArrowUp')) return;
    var t = e.target; if(t && t.closest && t.closest('.isl-x, input, textarea, select, button, a, [contenteditable]')) return;
    e.preventDefault();
  });
  doc.addEventListener('visibilitychange', function(){ if(!doc.hidden) restartTick(); });
  window.addEventListener('pageshow', function(e){ if(e.persisted) restartTick(); });
  var rzT = 0, rzW = window.innerWidth, rzH = window.innerHeight;
  window.addEventListener('resize', function(){ clearTimeout(rzT); rzT = setTimeout(function(){
    var w = window.innerWidth, h = window.innerHeight;
    if(state === 'expanded' && w === rzW && Math.abs(h - rzH) < 160) return;      /* نوار آدرس مرورگر بالا/پایین رفت: کارت باز نپرد */
    rzW = w; rzH = h;
    if(cfg.on){ refreshDims(); satSync(); }
  }, 160); });
  /* پنهان شدن هنگام پایین رفتن صفحه */
  var lastY = window.pageYOffset || 0, satRaf = 0;
  window.addEventListener('scroll', function(){
    var y = window.pageYOffset || 0;
    if(state === 'expanded' && y !== lockY){ try{ window.scrollTo({ top:lockY, left:0, behavior:'instant' }); }catch(_){ window.scrollTo(0, lockY); } return; }
    if(cfg.hideScroll && state !== 'expanded'){
      if(y > lastY + 8 && y > 90) root.setAttribute('data-sh', ''); else if(y < lastY - 8 || y < 40) root.removeAttribute('data-sh');
    } else root.removeAttribute('data-sh');
    if(!satRaf) satRaf = requestAnimationFrame(function(){ satRaf = 0; satSync(); });
    lastY = y;
  }, { passive:true });
  try{ matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function(){ buildSprings(); }); }catch(e){}

  /* ---------- تنظیمات: صفحه‌ی اصلی کوتاه + زیرصفحه‌های کوچک (سبک و بدون جلوه‌ی سنگین) ---------- */
  var uiPage = 'home', uiSig = '';
  var PAGES = {
    guide:[],
    general:[
      { t:'seg', k:'mode', l:'modeL', o:[['always', 'mAlways'], ['alerts', 'mAlerts']] },
      { t:'chips', k:'hold', l:'holdL', o:[300, 400, 500, 800, 1200, 2000], f:'ms' },
      { t:'sw', k:'fan', l:'fanT', h:'fanH' },
      { t:'btn', act:'preview', l:'prev', ic:'play' }, { t:'btn', act:'preview2', l:'prev2', ic:'play' }, { t:'btn', act:'reset', l:'reset', ic:'x', cls:'ghost' } ],
    look:[
      { t:'seg', k:'style', l:'styleL', o:[['black', 'sBlack'], ['glass', 'sGlass'], ['theme', 'sTheme']] },
      { t:'seg', k:'glow', l:'glowL', o:[['sky', 'gSky'], ['theme', 'gTheme'], ['gold', 'gGold'], ['off', 'gOff']] },
      { t:'seg', k:'size', l:'sizeL', o:[[0, 'zS'], [1, 'zM'], [2, 'zL']] },
      { t:'seg', k:'top', l:'topL', o:[[0, 'tN'], [1, 'tM'], [2, 'tF']] },
      { t:'seg', k:'motion', l:'motionL', o:[['soft', 'moSoft'], ['lively', 'moLively'], ['minimal', 'moMin']] },
      { t:'sw', k:'breathe', l:'breatheT', h:'breatheH' }, { t:'sw', k:'satellite', l:'satT', h:'satH' }, { t:'sw', k:'hideScroll', l:'hideT', h:'hideH' } ],
    sound:[
      { t:'sw', k:'vibrate', l:'vbT', h:'vbH' }, { t:'sw', k:'haptic', l:'hapT', h:'hapH' }, { t:'sw', k:'timerAlarm', l:'tmAlT', h:'tmAlH' } ]
  };
  /* گزینه‌ی وابسته فقط وقتی لازم است نشان داده می‌شود تا صفحه شلوغ نشود */
  var SHOWIF = {
    primary:function(){ return cfg.rotate === 0; }, 
    snooze:function(){ return cfg.actions; }, evDur:function(){ return cfg.liveEv; }, 
    'quiet.from':function(){ return cfg.quiet.on; }, 'quiet.to':function(){ return cfg.quiet.on; }
  };
  var HOME = [['guide', 'pgGuide'], ['general', 'pgGeneral'], ['look', 'pgLook'], ['sound', 'pgSound']];
  function visItems(p){ return PAGES[p].filter(function(it){ return !(it.k && SHOWIF[it.k] && !SHOWIF[it.k]()); }); }
  function sigFor(p){ return p === 'home' ? 'home' : visItems(p).map(function(it){ return it.k || it.act; }).join(','); }
  function minOrOff(v){ return v ? tpl(tt('minN'), { n:C.fa(v) }) : tt('off'); }
  function summary(p){
    if(p === 'guide') return tt('guideSum');
    if(p === 'look') return tt({ black:'sBlack', glass:'sGlass', theme:'sTheme' }[cfg.style]) + ' · ' + tt({ sky:'gSky', theme:'gTheme', gold:'gGold', off:'gOff' }[cfg.glow]);
    if(p === 'pill') return tpl(tt('pagesN'), { n:C.fa(pagesList().length) }) + (cfg.rotate ? ' · ' + tpl(tt('rotN'), { n:C.fa(cfg.rotate) }) : '');
    if(p === 'card') return tt('xAll');
    if(p === 'alerts') return tt('onWord');
    if(p === 'sound') return (cfg.vibrate || cfg.timerAlarm) ? tt('onWord') : tt('off');
    return tt(cfg.mode === 'alerts' ? 'mAlerts' : 'mAlways');
  }
  function fmtChip(f, v){
    if(v === 0) return tt(f === 'rot' ? 'rot0' : 'off');
    if(f === 'ms') return tpl(tt('secN'), { n:C.fa(String(v / 1000).replace('.', lang() === 'en' ? '.' : '٫')) });
    return tpl(tt({ rot:'rotN', dur:'durN', min:'minN', sec:'secN' }[f]), { n:C.fa(v) });
  }
  function row(it){
    var h = '';
    if(it.t === 'sw'){
      h = '<div class="isl-r"><span class="isl-rt"><b>' + esc(tt(it.l)) + '</b>' + (it.h ? '<small>' + esc(tt(it.h)) + '</small>' : '') + '</span>' +
          '<button type="button" class="kzm-switch" role="switch" aria-checked="false" data-k="' + it.k + '" aria-label="' + esc(tt(it.l)) + '"><i></i></button></div>';
    } else if(it.t === 'seg'){
      h = '<div class="isl-b"><p class="isl-lbl">' + esc(tt(it.l)) + '</p><div class="isl-seg" role="radiogroup" aria-label="' + esc(tt(it.l)) + '">' +
          it.o.map(function(o){ return '<button type="button" role="radio" aria-checked="false" data-k="' + it.k + '" data-v="' + o[0] + '">' + esc(tt(o[1])) + '</button>'; }).join('') + '</div></div>';
    } else if(it.t === 'schip'){
      h = '<div class="isl-b"><p class="isl-lbl">' + esc(tt(it.l)) + '</p><div class="isl-chips" role="radiogroup" aria-label="' + esc(tt(it.l)) + '">' +
          it.o.map(function(o){ return '<button type="button" class="isl-chip" role="radio" aria-checked="false" data-k="' + it.k + '" data-v="' + o[0] + '">' + esc(tt(o[1])) + '</button>'; }).join('') + '</div></div>';
    } else if(it.t === 'quick'){
      h = '<div class="isl-b"><div class="isl-chips">' + [['all', 'pgAll'], ['def', 'pgDef']].map(function(x){ return '<button type="button" class="isl-chip" data-qp="' + x[0] + '">' + esc(tt(x[1])) + '</button>'; }).join('') + '</div></div>';
    } else if(it.t === 'chips'){
      h = '<div class="isl-b"><p class="isl-lbl">' + esc(tt(it.l)) + '</p><div class="isl-chips" role="radiogroup" aria-label="' + esc(tt(it.l)) + '">' +
          it.o.map(function(v){ return '<button type="button" class="isl-chip" role="radio" aria-checked="false" data-k="' + it.k + '" data-v="' + v + '">' + esc(fmtChip(it.f, v)) + '</button>'; }).join('') + '</div></div>';
    } else if(it.t === 'multi'){
      h = '<div class="isl-b"><p class="isl-lbl">' + esc(tt(it.l)) + '</p><div class="isl-chips">' +
          it.o.map(function(o){ return '<button type="button" class="isl-chip" aria-pressed="false" data-k="' + it.k + '.' + o[0] + '">' + esc(tt(o[1])) + '</button>'; }).join('') + '</div></div>';
    } else if(it.t === 'presets'){
      h = '<div class="isl-b"><p class="isl-lbl">' + esc(tt(it.l)) + '</p><div class="isl-chips">' + [['simple', 'pSimple'], ['balanced', 'pBal'], ['full', 'pFull']].map(function(x){ return '<button type="button" class="isl-chip" data-preset="' + x[0] + '">' + esc(tt(x[1])) + '</button>'; }).join('') + '</div></div>';
    } else if(it.t === 'step'){
      h = '<div class="isl-r"><span class="isl-rt"><b>' + esc(tt(it.l)) + '</b></span><span class="isl-stepc"><button type="button" data-k="' + it.k + '" data-d="-1" aria-label="-">−</button><output data-o="' + it.k + '"></output><button type="button" data-k="' + it.k + '" data-d="1" aria-label="+">+</button></span></div>';
    }
    if(it.k && SHOWIF[it.k]) h = h.replace(/^<div class="(isl-r|isl-b)"/, '<div data-if="' + it.k + '" class="$1"');
    return h;
  }
  function pageHTML(p){
    if(p === 'home'){
      return '<div class="isl-card"><div class="isl-r"><span class="isl-rt"><b>' + esc(tt('onT')) + '</b><small>' + esc(tt('onH')) + '</small></span><button type="button" class="kzm-switch" role="switch" aria-checked="false" data-k="on" aria-label="' + esc(tt('onT')) + '"><i></i></button></div></div>' +
        '<div class="isl-card">' + HOME.map(function(x){ return '<button type="button" class="isl-nav" data-nav="' + x[0] + '"><b>' + esc(tt(x[1])) + '</b><em>' + esc(summary(x[0])) + '</em><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>'; }).join('') + '</div>';
    }
    if(p === 'guide'){
      return '<div class="isl-ph"><button type="button" class="isl-back" data-nav="home" aria-label="' + esc(tt('back')) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button><b>' + esc(tt('pgGuide')) + '</b></div>' +
        '<div class="gd-wrap">' + guideSettingsHTML() + '</div>';
    }
    var items = PAGES[p], rows = '', btns = '';
    items.forEach(function(it){
      if(it.t === 'btn') btns += '<button type="button" class="isl-prev ' + (it.cls || '') + '" data-act="' + it.act + '">' + svg(it.ic) + '<span>' + esc(tt(it.l)) + '</span></button>';
      else rows += row(it);
    });
    var title = tt(HOME.filter(function(x){ return x[0] === p; })[0][1]);
    return '<div class="isl-ph"><button type="button" class="isl-back" data-nav="home" aria-label="' + esc(tt('back')) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button><b>' + esc(title) + '</b></div>' +
      '<div class="isl-card">' + rows + '</div>' + (btns ? '<div class="isl-btns">' + btns + '</div>' : '');
  }
  function renderUI(animate){
    var m = $('isl-ui'); if(!m) return;
    C.setLang(lang());
    m.innerHTML = '<div class="isl-pgw">' + pageHTML(uiPage) + '</div>';
    uiSig = sigFor(uiPage); syncUI();
    var w = m.firstChild;
    if(animate && w.animate && !calm()){
      var dx = (html.dir === 'rtl' ? -1 : 1) * (uiPage === 'home' ? -16 : 16);
      w.animate([{ opacity:0, transform:'translateX(' + dx + 'px)' }, { opacity:1, transform:'none' }], { duration:230, easing:'cubic-bezier(.2,.8,.2,1)' });
    }
  }
  function buildUI(){ renderUI(false); }
  function syncUI(){
    var m = $('isl-ui'); if(!m) return;
    [].forEach.call(m.querySelectorAll('[data-k]'), function(el){
      var k = el.getAttribute('data-k'), v = getP(cfg, k), dv = el.getAttribute('data-v');
      if(el.classList.contains('kzm-switch')) el.setAttribute('aria-checked', String(!!v));
      else if(dv !== null) el.setAttribute('aria-checked', String(String(v) === dv));
      else if(el.hasAttribute('aria-pressed')) el.setAttribute('aria-pressed', String(!!v));
    });
    [].forEach.call(m.querySelectorAll('[data-if]'), function(el){ el.hidden = !SHOWIF[el.getAttribute('data-if')](); });
    [].forEach.call(m.querySelectorAll('output[data-o]'), function(o){ o.textContent = C.fa(p2(getP(cfg, o.getAttribute('data-o')))) + ':' + C.fa('00'); });
  }
  function localizeStatic(){
    [].forEach.call([].slice.call(doc.querySelectorAll('[data-isl-t]')).concat(gRoot() ? [].slice.call(gRoot().querySelectorAll('[data-isl-t]')) : []), function(el){ var v = tt(el.getAttribute('data-isl-t')); if(v) el.textContent = v; });
  }
  function onUIClick(e){
    var el = e.target.closest && e.target.closest('button'); if(!el) return;
    var nav = el.getAttribute('data-nav'), k = el.getAttribute('data-k'), pr = el.getAttribute('data-preset'), act = el.getAttribute('data-act');
    if(nav){ uiPage = nav; renderUI(true); var b = doc.querySelector('#lg-sec-island'); var lb = (gRoot() || doc).querySelector('.lg-body'); if(lb) lb.scrollTop = 0; return; }
    if(pr){ cfg = mergeInto(DEF, deepAssign(clone(cfg), clone(PRESETS[pr])), ''); applyCfg(); renderUI(false); return; }
    if(act){
      if(act === 'preview') preview('lead'); else if(act === 'preview2') preview('start');
      else if(act === 'reset'){ cfg = clone(DEF); applyCfg(); uiPage = 'home'; renderUI(true); }
      return;
    }
    var qp = el.getAttribute('data-qp');
    if(qp){ Object.keys(cfg.pages).forEach(function(x){ cfg.pages[x] = (qp === 'all') ? true : DEF.pages[x]; }); applyCfg(); syncUI(); return; }
    if(!k) return;
    if(k.indexOf('pages.') === 0 && getP(cfg, k) && Object.keys(cfg.pages).filter(function(x){ return cfg.pages[x]; }).length <= 1) return;   /* دست‌کم یک صفحه باید روشن بماند */
    var dv = el.getAttribute('data-v'), dd = el.getAttribute('data-d');
    if(el.classList.contains('kzm-switch') || el.hasAttribute('aria-pressed')){
      setP(cfg, k, !getP(cfg, k));
      if(k === 'sound' && cfg.sound) chime(true);
    } else if(dd !== null){
      setP(cfg, k, (getP(cfg, k) + parseInt(dd, 10) + 24) % 24);
    } else if(dv !== null){
      setP(cfg, k, (typeof getP(DEF, k) === 'number') ? Number(dv) : dv);
      if(k === 'tone') chime(true);
    }
    applyCfg(); syncUI();
  }

  var started = false, saveT = 0, applyRaf = 0;
  function applyCfg(){
    cfg = mergeInto(DEF, cfg, ''); dirty = true;
    clearTimeout(saveT); saveT = setTimeout(saveCfg, 160);
    if(applyRaf) return;
    applyRaf = requestAnimationFrame(function(){ applyRaf = 0; applyNow(); });
  }
  window.addEventListener('pagehide', function(){ if(dirty) saveCfg(); });   /* صفحه‌ی کهنه نباید تنظیمِ تازه‌تر را بازنویسی کند */
  function applyNow(){
    buildSprings(); applyLook(); padSync();
    if(!cfg.on){
      clearTimeout(timer); timer = 0; clearTimeout(alertT); queue = []; cur = null; rotSync();
      if(state !== 'idle') setState('idle');
      return;
    }
    if(!started){ start(); return; }
    S = snap(); lastSig = ''; paintSky(S); paintCompact(S, true);
    if(state === 'idle' && cfg.mode === 'always') setState('compact');
    else if(state === 'compact' && cfg.mode === 'alerts') setState('idle');
    else if(state === 'expanded'){ buildExpanded(S); paintExpanded(S, false); refreshDims(); }
    else if(state === 'compact') refreshDims();
    rotSync(); restartTick();
  }

  /* همگام‌سازی بین صفحه‌ها (مثل نوار پایین): خاموش/روشن یا هر تنظیم دیگر در یک صفحه ← بقیه‌ی صفحه‌ها و تب‌ها هم‌زمان */
  function syncFromStore(){
    if(dirty) return;                                   /* تغییر ذخیره‌نشده‌ی همین صفحه اولویت دارد */
    var fresh; try{ fresh = mergeInto(DEF, JSON.parse(lsGet(KEY) || 'null'), ''); }catch(e){ return; }
    if(JSON.stringify(fresh) === JSON.stringify(cfg)) return;
    cfg = fresh; clearTimeout(saveT);
    applyNow(); try{ syncUI(); }catch(e){}
  }
  window.addEventListener('storage', function(e){ if(!e.key || e.key === KEY) syncFromStore(); });
  doc.addEventListener('visibilitychange', function(){ if(!doc.hidden) syncFromStore(); });
  window.addEventListener('pageshow', function(e){ if(e.persisted) syncFromStore(); });

  function preview(kind){
    if(!cfg.on){ cfg.on = true; applyCfg(); }
    var close = $('kzm-close'); if(close) close.click();
    setTimeout(function(){
      S = snap(); var m = pageModel(S.evs[0] && S.evs[0].remainMin < S.pm.remainMin ? 'event' : 'prayer', S), a;
      if(m.kind === 'prayer'){
        var key = S.pm.key;
        a = { kind:kind, type:'prayer', key:key, atH:S.pm.at, lead:30, targetMs:Date.now() + (kind === 'start' ? 0 : S.pm.remainMin * 60000), preview:true, id:'preview' };
      } else {
        var it = S.evs[0];
        a = { kind:kind, type:'event', ev:it.ev, diff:it.diff, lead:30, targetMs:Date.now() + (kind === 'start' ? 0 : it.remainMin * 60000), preview:true, id:'preview' };
      }
      var wasOpen = (state === 'expanded');
      if(wasOpen) collapse();
      setTimeout(function(){ showAlert(a); }, wasOpen ? 560 : 0);
    }, 420);
  }

  window.addEventListener('kzm-lang', function(){
    fmtCache = {}; dayCache = { k:'', v:null };
    localizeStatic(); buildUI();
    if(!cfg.on || !started) return;
    iconKey = ''; lastSig = '';
    S = snap(); paintCompact(S, true);
    if(state === 'expanded'){ buildExpanded(S); paintExpanded(S, false); }
    if(state === 'alert' && cur){ var d = describe(cur); aTi.textContent = d.title; aSu.textContent = d.sub; buildActions(cur, d); }
    setTimeout(refreshDims, 0);
  });

  /* ---------- خوش‌آمدگویی فقط هنگام «ورود» به سایت ----------
     نشان داده می‌شود: ورود تازه (آدرس مستقیم، بوکمارک، لینک از سایت دیگر، تب تازه).
     نشان داده نمی‌شود: بازگشت با دکمه‌ی Back، رفتن از صفحه‌ای دیگر از همین سایت به اینجا، ریلود،
     و برگشت‌های پشت‌سرهم در همان بازدید (نشانه‌ی بازدید در sessionStorage و window.name نگه‌داری می‌شود). */
  var VISIT_KEY = 'kzm-visit-ts', VISIT_MAX = 30 * 60 * 1000, WN = 'kzmv=';
  function visitGet(){
    var v = parseInt(ssGet(VISIT_KEY), 10);
    if(!isFinite(v)){ try{ if(String(window.name).indexOf(WN) === 0) v = parseInt(String(window.name).slice(WN.length), 10); }catch(e){} }
    return isFinite(v) ? v : 0;
  }
  function visitTouch(){
    var now = String(Date.now());
    ssSet(VISIT_KEY, now);
    try{ if(!window.name || String(window.name).indexOf(WN) === 0) window.name = WN + now; }catch(e){}
  }
  function navType(){
    try{ var n = performance.getEntriesByType('navigation')[0]; if(n && n.type) return n.type; }catch(e){}
    try{ var t = performance.navigation && performance.navigation.type; return t === 2 ? 'back_forward' : (t === 1 ? 'reload' : 'navigate'); }catch(e){}
    return 'navigate';
  }
  function shouldWelcome(){
    if(!IS_HOME){ visitTouch(); return false; }     /* خوش‌آمدگویی فقط در صفحه‌ی ورود (index) */
    var show = true, nt = navType(), ref = '', sameSite = false;
    if(nt === 'back_forward' || nt === 'reload') show = false;
    else {
      try{ ref = doc.referrer || ''; if(ref){ var ro = new URL(ref).origin; sameSite = (ro !== 'null' && ro === location.origin); } }catch(e){}
      if(sameSite) show = false;                                   /* آمده از صفحه‌ی دیگرِ همین سایت */
      else if(!ref){ var last = visitGet(); show = !(last && Date.now() - last < VISIT_MAX); }   /* آدرس مستقیم/بدون مرجع: فقط اگر بازدید فعال نبوده */
    }
    visitTouch();
    return show;
  }
  window.addEventListener('pagehide', visitTouch);
  doc.addEventListener('visibilitychange', function(){ if(doc.hidden) visitTouch(); });

  /* ---------- شروع: ورود نرم کپسول از یک نقطه ---------- */
  function start(){
    if(started || !cfg.on) return;
    started = true;
    S = snap(); paintSky(S); paintCompact(S, true);
    var go2 = function(){
      if(!cfg.on) return;
      S = snap(); paintSky(S); paintCompact(S, true);
      /* خوش‌آمدگویی: یک بار در هر نشست، قرص از همان نقطه‌ی کوچک به کارت خوش‌آمد باز می‌شود و بعد خودش جمع می‌شود */
      if(shouldWelcome()){ delete getFired()['W:welcome']; queue.unshift({ kind:'welcome', type:'welcome', id:'W:welcome', targetMs:Date.now() }); showNext(); }
      else if(cfg.mode === 'always') setState('compact');
      tick();
    };
    var ready = (doc.fonts && doc.fonts.ready) ? Promise.race([doc.fonts.ready, new Promise(function(r){ setTimeout(r, 1400); })]) : Promise.resolve();
    ready.then(function(){ setTimeout(go2, 520); });
    if(doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function(){ if(state === 'compact'){ lastSig = ''; if(S) paintCompact(S, true); refreshDims(); } });
  }

  /* چرخش قرص‌ها بین صفحه‌ها ادامه پیدا کند (نه از اول) */
  try{ var ro = JSON.parse(ssGet(ROT_KEY) || 'null'); if(ro){ var rl = pagesList(), ri = rl.indexOf(ro.k); if(ri > -1) pageIdx = ri; if(isFinite(ro.t) && ro.t > 0) lastRot = ro.t; } }catch(e){}
  rotSave();
  buildSprings(); applyLook(); localizeStatic();
  /* تب «کپسول» در پنل تنظیمات مشترک (gset.js، داخل Shadow DOM): استایل‌ها یک‌بار به آن کپی می‌شوند */
  var mounted = null;
  function copyCSS(r){
    if(r.querySelector('style[data-isl]')) return;
    var txt = '';
    try{
      var lk = doc.querySelector('link[rel="stylesheet"][href*="isl.css"]');
      if(lk && lk.sheet) txt = [].map.call(lk.sheet.cssRules, function(x){ return x.cssText; }).join('\n');
    }catch(x){ txt = ''; }
    var st = doc.createElement('style'); st.setAttribute('data-isl', ''); st.textContent = txt; r.insertBefore(st, r.firstChild);
    if(!txt){ try{ fetch('isl.css').then(function(q){ return q.text(); }).then(function(t){ st.textContent = t; }); }catch(x){} }
  }
  function mountUI(){
    var r = gRoot(), m = $('isl-ui');
    if(r) copyCSS(r);
    if(m && mounted !== m){ mounted = m; m.addEventListener('click', onUIClick); }
    localizeStatic(); buildUI();
  }
  mountUI();
  window.addEventListener('gset-ready', mountUI);
  if(cfg.on) start();

  /* برای آزمون و اشکال‌یابی */
  window.KZM_ISLAND = { fanOpen:fanOpenTap, fanClose:fanClose, fanOn:function(){ return fanOn; }, expand:expand, collapse:collapse, preview:preview, state:function(){ return state; }, cfg:function(){ return cfg; }, rot:rotStep, timer:startTimer, timerState:function(){ return tm; } };

  }
  if(document.body) __islBoot(); else document.addEventListener('DOMContentLoaded', __islBoot);
})();
