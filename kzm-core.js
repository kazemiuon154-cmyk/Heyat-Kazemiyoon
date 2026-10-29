/* ===== kzm-core.js — هسته‌ی مشترک اوقات شرعی خرم‌آباد، مراسم هفتگی، تقویم و ذکر روز (از index.html برداشته شده) =====
   کپسول جادویی (isl.js) از این هسته داده می‌گیرد. بدون سرور و بدون اینترنت.
   بخش اول: رزرو فضای کپسول از همان فریم اول، تا صفحه بعداً پایین نپرد. */
(function(){try{
  var c = JSON.parse(localStorage.getItem('kazemiuon-island') || 'null') || {};
  var on = (typeof c.on === 'boolean') ? c.on : true, mode = (c.mode === 'alerts') ? 'alerts' : 'always';
  var top = [0, 1, 2].indexOf(c.top) > -1 ? c.top : 0, size = [0, 1, 2].indexOf(c.size) > -1 ? c.size : 1;
  if(on && mode === 'always'){
    var h = document.documentElement;
    h.style.setProperty('--isl-pad', ([10, 18, 28][top] + Math.round(36 * [0.92, 1, 1.12][size]) - 6) + 'px');
    h.classList.add('isl-pad');
  }
}catch(e){}})();

(function(){
  if(window.KZM_CORE) return;
  try{
var faD = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
var CUR_LANG = 'fa';
function setCoreLang(l){ CUR_LANG = (l === 'ar' || l === 'en') ? l : 'fa'; }
var arD = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
/* ارقام به زبان فعلی: فارسی ۱۲۳، عربی ١٢٣، انگلیسی 123 */
function fa(n){
  var tbl = CUR_LANG === 'fa' ? faD : (CUR_LANG === 'ar' ? arD : null);
  return tbl ? String(n).replace(/[0-9]/g, function(d){ return tbl[+d]; }) : String(n);
}

/* ---- تقویم: همان هسته‌ی صفحه‌ی «تبدیل تاریخ» و صفحه‌ی هیئت ---- */
function div(a, b){ return Math.trunc(a / b); }
function mod(a, b){ return a - Math.trunc(a / b) * b; }
var JAL_BREAKS = [-61,9,38,199,426,686,756,818,1111,1181,1210,1635,2060,2097,2192,2262,2324,2394,2456,3178];

    function jalCal(jy){
      var bl = JAL_BREAKS.length, gy = jy + 621, leapJ = -14, jp = JAL_BREAKS[0], jm, jump, leap, leapG, march, n, i;
      for(i = 1; i < bl; i += 1){
        jm = JAL_BREAKS[i];
        jump = jm - jp;
        if(jy < jm) break;
        leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
        jp = jm;
      }
      n = jy - jp;
      leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
      if(mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
      leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
      march = 20 + leapJ - leapG;
      if(jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
      leap = mod(mod(n + 1, 33) - 1, 4);
      if(leap === -1) leap = 4;
      return { leap: leap, gy: gy, march: march };
    }

    function g2jdn(gy, gm, gd){
      var d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * mod(gm + 9, 12) + 2, 5) + gd - 34840408;
      d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
      return d;
    }

    function jdn2g(jdn){
      var j = 4 * jdn + 139361631;
      j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
      var i = div(mod(j, 1461), 4) * 5 + 308;
      var gd = div(mod(i, 153), 5) + 1;
      var gm = mod(div(i, 153), 12) + 1;
      var gy = div(j, 1461) - 100100 + div(8 - gm, 6);
      return { y: gy, m: gm, d: gd };
    }

    function j2jdn(jy, jm, jd){
      var r = jalCal(jy);
      return g2jdn(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
    }

    function jdn2j(jdn){
      var gy = jdn2g(jdn).y, jy = gy - 621, r = jalCal(jy), jdn1f = g2jdn(r.gy, 3, r.march), jd, jm, k;
      k = jdn - jdn1f;
      if(k >= 0){
        if(k <= 185){
          jm = 1 + div(k, 31);
          jd = mod(k, 31) + 1;
          return { y: jy, m: jm, d: jd };
        } else { k -= 186; }
      } else {
        jy -= 1; k += 179;
        if(r.leap === 1) k += 1;
      }
      jm = 7 + div(k, 30);
      jd = mod(k, 30) + 1;
      return { y: jy, m: jm, d: jd };
    }

    
function jdnWeekday(jdn){ return mod(jdn + 1, 7); } /* 0=یکشنبه ... 6=شنبه */
var JALALI_MONTHS = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
var JALALI_MONTHS_L = { fa:JALALI_MONTHS,
  ar:['فروردين','أرديبهشت','خرداد','تير','مرداد','شهريور','مهر','آبان','آذر','دي','بهمن','إسفند'],
  en:['Farvardin','Ordibehesht','Khordad','Tir','Mordad','Shahrivar','Mehr','Aban','Azar','Dey','Bahman','Esfand'] };
function jalaliMonthName(m){ return JALALI_MONTHS_L[CUR_LANG][m - 1]; }
var WEEKDAYS = ['یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه','شنبه'];
var WEEKDAYS_L = { fa:WEEKDAYS,
  ar:['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],
  en:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] };
function weekdayName(i){ return WEEKDAYS_L[CUR_LANG][i]; }
var LUNAR_MONTHS = ['محرم','صفر','ربیع‌الاول','ربیع‌الثانی','جمادی‌الاول','جمادی‌الثانی','رجب','شعبان','رمضان','شوال','ذی‌القعده','ذی‌الحجه'];
var LUNAR_MONTHS_L = { fa:LUNAR_MONTHS,
  ar:['محرم','صفر','ربيع الأول','ربيع الآخر','جمادى الأولى','جمادى الآخرة','رجب','شعبان','رمضان','شوال','ذو القعدة','ذو الحجة'],
  en:['Muharram','Safar','Rabi\u2018 al-Awwal','Rabi\u2018 al-Thani','Jumada al-Awwal','Jumada al-Thani','Rajab','Sha\u2018ban','Ramadan','Shawwal','Dhu al-Qa\u2018dah','Dhu al-Hijjah'] };
function lunarMonthName(m){ return LUNAR_MONTHS_L[CUR_LANG][m - 1]; }
var HIJRI_SUFFIX = { fa:'ه‍.ق', ar:'هـ', en:'AH' };

/* آغاز ماه‌های قمری از تقویم رسمی — [سال قمری، ماه قمری، سال شمسی، ماه شمسی، روز شمسی]
   (کپی همان جدول kazemiyoon.html و convert.html؛ سال جدید که اضافه شد، اینجا هم اضافه شود) */
var LUNAR_STARTS_RAW = [
  [1447,10,1405,1,1],  [1447,11,1405,1,30], [1447,12,1405,2,28],
  [1448,1,1405,3,26],  [1448,2,1405,4,25],  [1448,3,1405,5,23],
  [1448,4,1405,6,22],  [1448,5,1405,7,20],  [1448,6,1405,8,20],
  [1448,7,1405,9,20],  [1448,8,1405,10,20], [1448,9,1405,11,19],
  [1448,10,1405,12,19]
];
var LUNAR_END = [1405,12,29];
var LUNAR_STARTS = LUNAR_STARTS_RAW.map(function(r){ return { y:r[0], m:r[1], jdn:j2jdn(r[2], r[3], r[4]) }; });
var LUNAR_END_JDN = j2jdn(LUNAR_END[0], LUNAR_END[1], LUNAR_END[2]);
function lunarOf(jdn){
  if(jdn < LUNAR_STARTS[0].jdn || jdn > LUNAR_END_JDN) return null;
  for(var i = LUNAR_STARTS.length - 1; i >= 0; i--){
    if(jdn >= LUNAR_STARTS[i].jdn){
      var nx = LUNAR_STARTS[i + 1];
      return { y:LUNAR_STARTS[i].y, m:LUNAR_STARTS[i].m, d:jdn - LUNAR_STARTS[i].jdn + 1, len: nx ? (nx.jdn - LUNAR_STARTS[i].jdn) : null };
    }
  }
  return null;
}

/* مناسبت‌های مذهبی (همان قاعده‌های صفحه‌ی هیئت): [ماه قمری، روز قمری یا 'last'، نوع، تعطیل؟، [عنوان فارسی، عربی، انگلیسی]] */
var OCCASION_RULES = [
  [10,1,'eid',1,['عید سعید فطر','عيد الفطر المبارك','Eid al-Fitr']],
  [10,2,'eid',1,['تعطیل به مناسبت عید سعید فطر','عطلة عيد الفطر المبارك (اليوم الثاني)','Eid al-Fitr holiday (second day)']],
  [10,25,'mourn',1,['شهادت امام جعفر صادق (ع)','استشهاد الإمام جعفر الصادق (ع)','Martyrdom of Imam Ja\u2018far al-Sadiq (AS)']],
  [11,1,'birth',0,['ولادت حضرت معصومه (س)','ميلاد السيدة معصومة (ع)','Birth of Lady Masuma (SA)']],
  [11,5,'other',0,['روز تجلیل از امامزادگان و بقاع متبرکه','يوم تكريم أبناء الأئمة والمقامات المقدسة','Day of Honoring Imamzadehs and Holy Shrines']],
  [11,5,'other',0,['بزرگداشت حضرت صالح بن موسی کاظم (ع)','تكريم السيد صالح بن موسى الكاظم (ع)','Commemoration of Hazrat Salih ibn Musa al-Kazim (AS)']],
  [11,6,'other',0,['بزرگداشت حضرت احمد بن موسی شاهچراغ (ع)','تكريم السيد أحمد بن موسى شاه چراغ (ع)','Commemoration of Hazrat Ahmad ibn Musa Shah-Cheragh (AS)']],
  [11,11,'birth',0,['ولادت امام رضا (ع)','ميلاد الإمام الرضا (ع)','Birth of Imam Reza (AS)']],
  [11,'last','mourn',0,['شهادت امام محمد تقی (ع)','استشهاد الإمام محمد الجواد (ع)','Martyrdom of Imam Muhammad al-Jawad (AS)']],
  [12,1,'other',0,['سالروز ازدواج حضرت علی (ع) و حضرت فاطمه (س)','ذكرى زواج الإمام علي (ع) والسيدة فاطمة (ع)','Anniversary of the marriage of Imam Ali (AS) and Lady Fatima (SA)']],
  [12,7,'mourn',0,['شهادت امام محمد باقر (ع)','استشهاد الإمام محمد الباقر (ع)','Martyrdom of Imam Muhammad al-Baqir (AS)']],
  [12,9,'other',0,['روز عرفه','يوم عرفة','Day of Arafah']],
  [12,10,'eid',1,['عید سعید قربان','عيد الأضحى المبارك','Eid al-Adha']],
  [12,15,'birth',0,['ولادت امام علی النقی الهادی (ع)','ميلاد الإمام علي الهادي (ع)','Birth of Imam Ali al-Hadi (AS)']],
  [12,18,'eid',1,['عید سعید غدیر خم','عيد الغدير الأغر','Eid al-Ghadir']],
  [12,20,'birth',0,['ولادت امام موسی کاظم (ع)','ميلاد الإمام موسى الكاظم (ع)','Birth of Imam Musa al-Kazim (AS)']],
  [12,24,'other',0,['مباهله پیامبر اسلام (ص)','مباهلة النبي (ص)','Mubahala of the Prophet (PBUH)']],
  [1,1,'other',0,['آغاز سال {y} هجری قمری','بداية السنة الهجرية {y}','Start of Hijri year {y}']],
  [1,9,'mourn',1,['تاسوعای حسینی','تاسوعاء الحسين (ع)','Tasu’a of Imam Hussain (AS)']],
  [1,10,'mourn',1,['عاشورای حسینی','عاشوراء الحسين (ع)','Ashura of Imam Hussain (AS)']],
  [1,12,'mourn',0,['شهادت امام زین\u200cالعابدین (ع)','استشهاد الإمام زين العابدين (ع)','Martyrdom of Imam Zayn al-Abidin (AS)']],
  [1,25,'mourn',0,['شهادت امام زین\u200cالعابدین (ع) (به روایتی)','استشهاد الإمام زين العابدين (ع) (على رواية)','Martyrdom of Imam Zayn al-Abidin (AS) (per another narration)']],
  [2,3,'birth',0,['ولادت امام محمد باقر (ع) (به روایتی)','ميلاد الإمام محمد الباقر (ع) (على رواية)','Birth of Imam Muhammad al-Baqir (AS) (per another narration)']],
  [2,7,'mourn',0,['شهادت امام حسن مجتبی (ع) (به روایتی)','استشهاد الإمام الحسن المجتبى (ع) (على رواية)','Martyrdom of Imam Hasan al-Mujtaba (AS) (per another narration)']],
  [2,20,'mourn',1,['اربعین حسینی','أربعينية الإمام الحسين (ع)','Arbaeen of Imam Hussain (AS)']],
  [2,28,'mourn',1,['رحلت حضرت رسول اکرم (ص) و شهادت امام حسن مجتبی (ع)','رحيل الرسول الأكرم (ص) واستشهاد الإمام الحسن المجتبى (ع)','Passing of the Holy Prophet (PBUH) and Martyrdom of Imam Hasan al-Mujtaba (AS)']],
  [2,'last','mourn',1,['شهادت امام رضا (ع)','استشهاد الإمام الرضا (ع)','Martyrdom of Imam Reza (AS)']],
  [3,1,'other',0,['هجرت حضرت رسول اکرم (ص) از مکه به مدینه','هجرة الرسول الأكرم (ص) من مكة إلى المدينة','Hijra of the Holy Prophet (PBUH) from Mecca to Medina']],
  [3,8,'mourn',1,['شهادت امام حسن عسکری (ع) و آغاز امامت حضرت ولی\u200cعصر (عج)','استشهاد الإمام الحسن العسكري (ع) وبداية إمامة الإمام المهدي (عج)','Martyrdom of Imam Hasan al-Askari (AS) and start of the Imamate of Imam al-Mahdi (AJ)']],
  [3,12,'birth',0,['ولادت حضرت رسول اکرم (ص) به روایت اهل سنت','ميلاد الرسول الأكرم (ص) على رواية أهل السنة','Birth of the Holy Prophet (PBUH) per Sunni narration']],
  [3,17,'birth',1,['ولادت حضرت رسول اکرم (ص) و امام جعفر صادق (ع)','ميلاد الرسول الأكرم (ص) والإمام جعفر الصادق (ع)','Birth of the Holy Prophet (PBUH) and Imam Ja\u2018far al-Sadiq (AS)']],
  [4,4,'birth',0,['ولادت حضرت عبدالعظیم حسنی (ع)','ميلاد السيد عبد العظيم الحسني (ع)','Birth of Hazrat Abdul-Azim al-Hasani (AS)']],
  [4,8,'birth',0,['ولادت امام حسن عسکری (ع)','ميلاد الإمام الحسن العسكري (ع)','Birth of Imam Hasan al-Askari (AS)']],
  [4,10,'mourn',0,['وفات حضرت معصومه (س)','وفاة السيدة معصومة (ع)','Passing of Lady Masuma (SA)']],
  [5,5,'birth',0,['ولادت حضرت زینب (س)','ميلاد السيدة زينب (ع)','Birth of Lady Zaynab (SA)']],
  [5,13,'mourn',0,['شهادت حضرت فاطمه زهرا (س) (به روایتی)','استشهاد السيدة فاطمة الزهراء (ع) (على رواية)','Martyrdom of Lady Fatima al-Zahra (SA) (per another narration)']],
  [6,3,'mourn',1,['شهادت حضرت فاطمه زهرا (س)','استشهاد السيدة فاطمة الزهراء (ع)','Martyrdom of Lady Fatima al-Zahra (SA)']],
  [6,13,'mourn',0,['وفات حضرت ام\u200cالبنین (س)','وفاة أم البنين (ع)','Passing of Umm al-Banin (SA)']],
  [6,20,'birth',0,['ولادت حضرت فاطمه زهرا (س)','ميلاد السيدة فاطمة الزهراء (ع)','Birth of Lady Fatima al-Zahra (SA)']],
  [7,1,'birth',0,['ولادت امام محمد باقر (ع)','ميلاد الإمام محمد الباقر (ع)','Birth of Imam Muhammad al-Baqir (AS)']],
  [7,3,'mourn',0,['شهادت امام علی النقی الهادی (ع)','استشهاد الإمام علي الهادي (ع)','Martyrdom of Imam Ali al-Hadi (AS)']],
  [7,10,'birth',0,['ولادت امام محمد تقی (ع)','ميلاد الإمام محمد الجواد (ع)','Birth of Imam Muhammad al-Jawad (AS)']],
  [7,13,'birth',1,['ولادت امام علی (ع)','ميلاد الإمام علي (ع)','Birth of Imam Ali (AS)']],
  [7,15,'mourn',0,['وفات حضرت زینب (س)','وفاة السيدة زينب (ع)','Passing of Lady Zaynab (SA)']],
  [7,25,'mourn',0,['شهادت امام موسی کاظم (ع)','استشهاد الإمام موسى الكاظم (ع)','Martyrdom of Imam Musa al-Kazim (AS)']],
  [7,27,'other',1,['مبعث حضرت رسول اکرم (ص)','المبعث النبوي الشريف','Mab\u2018ath — the Prophet’s Mission (PBUH)']],
  [8,3,'birth',0,['ولادت امام حسین (ع)','ميلاد الإمام الحسين (ع)','Birth of Imam Hussain (AS)']],
  [8,4,'birth',0,['ولادت حضرت ابوالفضل العباس (ع)','ميلاد أبي الفضل العباس (ع)','Birth of Hazrat Abbas (AS)']],
  [8,5,'birth',0,['ولادت امام زین\u200cالعابدین (ع)','ميلاد الإمام زين العابدين (ع)','Birth of Imam Zayn al-Abidin (AS)']],
  [8,11,'birth',0,['ولادت حضرت علی\u200cاکبر (ع)','ميلاد علي الأكبر (ع)','Birth of Ali al-Akbar (AS)']],
  [8,15,'birth',1,['ولادت حضرت قائم (عج) و جشن نیمه شعبان','ميلاد الإمام القائم (عج) وليلة النصف من شعبان','Birth of Imam al-Qa’im (AJ) and Mid-Sha\u2018ban Celebration']],
  [9,10,'mourn',0,['وفات حضرت خدیجه (س)','وفاة السيدة خديجة الكبرى (ع)','Passing of Lady Khadija (SA)']],
  [9,15,'birth',0,['ولادت امام حسن مجتبی (ع)','ميلاد الإمام الحسن المجتبى (ع)','Birth of Imam Hasan al-Mujtaba (AS)']],
  [9,18,'other',0,['شب قدر','ليلة القدر','Laylat al-Qadr']],
  [9,19,'mourn',0,['ضربت خوردن حضرت علی (ع)','ضربة الإمام علي (ع)','Imam Ali (AS) is struck']],
  [9,20,'other',0,['شب قدر','ليلة القدر','Laylat al-Qadr']],
  [9,21,'mourn',1,['شهادت امام علی (ع)','استشهاد الإمام علي (ع)','Martyrdom of Imam Ali (AS)']],
  [9,22,'other',0,['شب قدر','ليلة القدر','Laylat al-Qadr']]
];
function occasionsOn(jdn){
  var L = lunarOf(jdn), out = [];
  if(!L) return out;
  OCCASION_RULES.forEach(function(r){
    var hit = (r[1] === 'last') ? (L.len !== null && L.d === L.len) : (r[1] === L.d);
    if(r[0] === L.m && hit) out.push({ tone:r[2], hol:!!r[3], title:r[4][CUR_LANG === 'ar' ? 1 : (CUR_LANG === 'en' ? 2 : 0)].replace('{y}', fa(L.y)), note:'', lunar:L });
  });
  return out;
}

/* ---- اوقات شرعی خرم‌آباد (همان محاسبات صفحه‌ی اوقات شرعی) ---- */
function fmod(a, n){ return a - n * Math.floor(a / n); }
function toRad(d){ return d * Math.PI / 180; }
function toDeg(r){ return r * 180 / Math.PI; }
function julianDate(year, month, day){
  if(month <= 2){ year -= 1; month += 12; }
  var A = Math.floor(year / 100), B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}
function sunPosition(JD){
  var D = JD - 2451545.0;
  var g = fmod(357.529 + 0.98560028 * D, 360);
  var q = fmod(280.459 + 0.98564736 * D, 360);
  var L = fmod(q + 1.915 * Math.sin(toRad(g)) + 0.020 * Math.sin(toRad(2 * g)), 360);
  var e = 23.439 - 0.00000036 * D;
  var RA = fmod(toDeg(Math.atan2(Math.cos(toRad(e)) * Math.sin(toRad(L)), Math.cos(toRad(L)))) / 15, 24);
  var decl = toDeg(Math.asin(Math.sin(toRad(e)) * Math.sin(toRad(L))));
  var eqt = q / 15 - RA;
  if(eqt > 12) eqt -= 24; else if(eqt < -12) eqt += 24;
  return { decl:decl, eqt:eqt };
}
function hourAngle(lat, decl, angle){
  var num = -Math.sin(toRad(angle)) - Math.sin(toRad(lat)) * Math.sin(toRad(decl));
  var den = Math.cos(toRad(lat)) * Math.cos(toRad(decl));
  var val = Math.max(-1, Math.min(1, num / den));
  return toDeg(Math.acos(val)) / 15;
}
var LAT = 33.4869, LON = 48.3557; /* خرم‌آباد */
var tzFmt = null, tzCache = { at:0, v:3.5 };
function tehranOffsetHours(date){
  var now = (date || new Date()).getTime();
  if(tzCache.at && Math.abs(now - tzCache.at) < 600000) return tzCache.v;   /* ساخت Intl گران است؛ ۱۰ دقیقه کش می‌شود */
  var v = 3.5;
  try{
    if(!tzFmt) tzFmt = new Intl.DateTimeFormat('en-US', { timeZone:'Asia/Tehran', timeZoneName:'shortOffset' });
    var parts = tzFmt.formatToParts(date || new Date());
    var tz = parts.filter(function(p){ return p.type === 'timeZoneName'; })[0];
    if(tz){
      var m = tz.value.match(/GMT([+-]\d+)(?::(\d+))?/);
      if(m){ var h = parseInt(m[1], 10), mins = m[2] ? parseInt(m[2], 10) : 0; v = h + (h < 0 ? -mins / 60 : mins / 60); }
    }
  }catch(e){}
  tzCache.at = now; tzCache.v = v;
  return v;
}
function prayerFor(y, m, d, TZ){
  var sp = sunPosition(julianDate(y, m, d));
  var dhuhr = 12 + TZ - LON / 15 - sp.eqt;
  return {
    fajr: dhuhr - hourAngle(LAT, sp.decl, 17.7),
    sunrise: dhuhr - hourAngle(LAT, sp.decl, 0.833),
    dhuhr: dhuhr,
    maghrib: dhuhr + hourAngle(LAT, sp.decl, 4.5)
  };
}
function fmtClock(hours){
  hours = fmod(hours, 24);
  var h = Math.floor(hours), m = Math.round((hours - h) * 60);
  if(m === 60){ m = 0; h += 1; }
  h = h % 24;
  return fa(h) + ':' + fa(String(m).padStart(2, '0'));
}

/* ---- ساعت و تاریخ رسمی تهران (مستقل از تایم‌زون گوشی) ---- */
var tehranFmt = null;
try{
  tehranFmt = new Intl.DateTimeFormat('en-US', { timeZone:'Asia/Tehran', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false });
}catch(e){}
function tehranParts(date){
  var o = {};
  tehranFmt.formatToParts(date || new Date()).forEach(function(p){ o[p.type] = p.value; });
  return { y:parseInt(o.year, 10), m:parseInt(o.month, 10), d:parseInt(o.day, 10), h:parseInt(o.hour, 10) % 24, mi:parseInt(o.minute, 10), s:parseInt(o.second, 10), pad:{ m:o.month, d:o.day } };
}
var AR_UNITS = { d:['يوم','يومان','أيام','يوماً'], h:['ساعة','ساعتان','ساعات','ساعة'], m:['دقيقة','دقيقتان','دقائق','دقيقة'] };
function arCount(n, u){
  var w = AR_UNITS[u];
  if(n === 1) return w[0];
  if(n === 2) return w[1];
  return fa(n) + ' ' + (n <= 10 ? w[2] : w[3]);
}
function durText(min){
  min = Math.max(0, Math.ceil(min));
  var d = Math.floor(min / 1440), h = Math.floor((min % 1440) / 60), m = min % 60;
  if(CUR_LANG === 'ar'){
    if(d > 0) return arCount(d, 'd') + (h ? ' و' + arCount(h, 'h') : '');
    if(h > 0) return arCount(h, 'h') + (m ? ' و' + arCount(m, 'm') : '');
    return m > 0 ? arCount(m, 'm') : 'أقل من دقيقة';
  }
  if(CUR_LANG === 'en'){
    if(d > 0) return d + 'd' + (h ? ' ' + h + 'h' : '');
    if(h > 0) return h + 'h' + (m ? ' ' + m + 'm' : '');
    return m > 0 ? m + 'm' : 'less than a minute';
  }
  if(d > 0) return fa(d) + ' روز' + (h ? ' و ' + fa(h) + ' ساعت' : '');
  if(h > 0) return fa(h) + ' ساعت' + (m ? ' و ' + fa(m) + ' دقیقه' : '');
  return m > 0 ? fa(m) + ' دقیقه' : 'کمتر از یک دقیقه';
}
function remainText(min){
  var d = durText(min);
  return CUR_LANG === 'ar' ? 'بعد ' + d : (CUR_LANG === 'en' ? 'in ' + d : d + ' دیگر');
}
function daysAhead(days){
  if(CUR_LANG === 'ar') return days === 1 ? 'غداً' : 'بعد ' + arCount(days, 'd');
  if(CUR_LANG === 'en') return days === 1 ? 'tomorrow' : 'in ' + days + ' days';
  return days === 1 ? 'فردا' : fa(days) + ' روز دیگر';
}

/* ۱) وقت بعدی (صبح، طلوع، ظهر، مغرب) */
var PRAYER_ORDER = [['fajr','اذان صبح'], ['sunrise','طلوع آفتاب'], ['dhuhr','اذان ظهر'], ['maghrib','اذان مغرب']];
var PRAYER_NAMES = {
  fa:{ fajr:'اذان صبح', sunrise:'طلوع آفتاب', dhuhr:'اذان ظهر', maghrib:'اذان مغرب' },
  ar:{ fajr:'أذان الفجر', sunrise:'شروق الشمس', dhuhr:'أذان الظهر', maghrib:'أذان المغرب' },
  en:{ fajr:'Fajr Adhan', sunrise:'Sunrise', dhuhr:'Dhuhr Adhan', maghrib:'Maghrib Adhan' }
};
function prayerModel(t, jdn){
  var TZ = tehranOffsetHours(new Date());
  var times = prayerFor(t.y, t.m, t.d, TZ);
  var nowH = t.h + t.mi / 60 + t.s / 3600;
  var next = null, tomorrow = false;
  for(var i = 0; i < PRAYER_ORDER.length; i++){
    if(times[PRAYER_ORDER[i][0]] > nowH){ next = PRAYER_ORDER[i]; break; }
  }
  var at;
  if(next){ at = times[next[0]]; }
  else {
    var g = jdn2g(jdn + 1);
    times = prayerFor(g.y, g.m, g.d, TZ);
    next = PRAYER_ORDER[0]; at = times.fajr + 24; tomorrow = true;
  }
  /* پیشرفت بین وقت قبلی و وقت بعدی (برای نوار باریک کارت) */
  var yd = jdn2g(jdn - 1), td = prayerFor(t.y, t.m, t.d, TZ), tm = jdn2g(jdn + 1);
  var seq = [prayerFor(yd.y, yd.m, yd.d, TZ).maghrib - 24, td.fajr, td.sunrise, td.dhuhr, td.maghrib, prayerFor(tm.y, tm.m, tm.d, TZ).fajr + 24];
  var k = 1;
  while(k < seq.length - 1 && seq[k] <= nowH) k++;
  var progress = Math.max(0, Math.min(1, (nowH - seq[k - 1]) / (seq[k] - seq[k - 1])));
  return { times:times, key:next[0], label:PRAYER_NAMES[CUR_LANG][next[0]], tomorrow:tomorrow, at:at, remainMin:(at - nowH) * 60, nowH:nowH, progress:progress };
}

/* ۲) مراسم بعدی هیئت و مسجد قائم (همان برنامه‌ی هفتگی صفحه‌ی هیئت) */
var WEEKLY = [
  { id:'majles', dow:2, hour:21, href:'kazemiyoon.html',
    title:{ fa:'مجلس هفتگی', ar:'المجلس الأسبوعي', en:'Weekly Gathering' }, time:{ fa:'۲۱:۰۰', ar:'٢١:٠٠', en:'9:00 PM' } },
  { id:'nodbeh', dow:5, hour:7, href:'masjed-qaem.html',
    title:{ fa:'دعای ندبه', ar:'دعاء الندبة', en:'Dua Nudbah' }, time:{ fa:'۷:۰۰ صبح', ar:'٧:٠٠ صباحاً', en:'7:00 AM' } }
];
function eventsModel(t, dow){
  var nowMin = t.h * 60 + t.mi + t.s / 60;
  return WEEKLY.map(function(ev){
    var diff = (ev.dow - dow + 7) % 7;
    if(diff === 0 && nowMin >= ev.hour * 60) diff = 7;
    return { ev:ev, diff:diff, remainMin: diff * 1440 + ev.hour * 60 - nowMin };
  }).sort(function(a, b){ return a.remainMin - b.remainMin; });
}

/* ۳) تاریخ قمری و مناسبت امروز و مناسبت بعدی (فقط در بازه‌ی تقویم رسمی؛ تاریخ حدسی نشان داده نمی‌شود) */
function todayModel(jdn){
  var L = lunarOf(jdn);
  if(!L) return null;
  var next = null;
  for(var k = 1; k <= 120 && jdn + k <= LUNAR_END_JDN; k++){
    var o = occasionsOn(jdn + k);
    if(o.length){ var j = jdn2j(jdn + k); next = { days:k, items:o, jm:j.m, jd:j.d }; break; }
  }
  var j0 = jdn2j(jdn);
  return { lunar:L, items:occasionsOn(jdn), next:next, weekday:weekdayName(jdnWeekday(jdn)), jd:j0.d, jm:j0.m, jy:j0.y };
}

/* ۴) ذکر روز هفته (همان ذکرهای صفحه‌ی ذکر روز) */
var ZEKR_BY_DAY = {
  6: { day:'شنبه',     text:'يا رَبَّ العالَمين', fa:'ای پروردگار جهانیان' },
  0: { day:'یک‌شنبه',   text:'يا ذَاالجَلالِ وَ الاِکرام', fa:'ای صاحبِ جلال و بزرگواری' },
  1: { day:'دوشنبه',    text:'يا قاضِیَ الحاجات', fa:'ای برآورندهٔ حاجت‌ها' },
  2: { day:'سه‌شنبه',   text:'يا اَرحَمَ الرّاحِمین', fa:'ای مهربان‌ترینِ مهربانان' },
  3: { day:'چهارشنبه',  text:'يا حَیُّ یا قَیّوم', fa:'ای زنده، ای پاینده' },
  4: { day:'پنج‌شنبه',  text:'لا اِلهَ اِلاَّ اللهُ المَلِکُ الحَقُّ المُبین', fa:'هیچ معبودی جز خدای پادشاهِ حق و آشکار نیست' },
  5: { day:'جمعه',      text:'اَللّهُمَّ صَلِّ عَلی مُحَمَّدٍ وَ آلِ مُحَمَّد', fa:'خدایا بر محمد و خاندان محمد درود فرست' }
};
var ZEKR_TARGET = 100;
function zekrKey(t){ return 'kazemiuon-zekr-' + t.y + '-' + t.pad.m + '-' + t.pad.d; }

/* ۶) ادامه‌ی مطالعه: فقط شناسه‌های شناخته‌شده‌ی صفحه‌ی ادعیه پذیرفته می‌شود */
var DOA_IDS = ['doa-modal-kumayl-arabic','doa-modal-nudba-arabic','doa-modal-tavassul-arabic','doa-modal-samat-arabic','doa-modal-arabic','doa-modal-translation','doa-modal-audio','doa-modal-aminollah-arabic','doa-modal-faraj-arabic','doa-modal-salamati-arabic','doa-modal-salamati-translation','doa-modal-ahd-arabic','doa-modal-aalyasin-arabic'];
function parseLastDoa(raw){
  try{
    var o = JSON.parse(raw);
    if(!o || DOA_IDS.indexOf(o.id) < 0) return null;
    var name = String(o.name || '').slice(0, 60), sub = String(o.sub || '').slice(0, 40);
    if(!name) return null;
    return { id:o.id, name:name, sub:sub };
  }catch(e){ return null; }
}
window.KZM_CORE = { ok:!!tehranFmt, setLang:setCoreLang, fa:fa, g2jdn:g2jdn, jdnWeekday:jdnWeekday, tehranParts:tehranParts,
  tz:function(){ return tehranOffsetHours(new Date()); }, prayerFor:prayerFor, prayerModel:prayerModel, eventsModel:eventsModel, todayModel:todayModel,
  durText:durText, remainText:remainText, daysAhead:daysAhead, fmtClock:fmtClock, weekdayName:weekdayName, jalaliMonthName:jalaliMonthName,
  lunarMonthName:lunarMonthName, HIJRI_SUFFIX:HIJRI_SUFFIX, PRAYER_NAMES:PRAYER_NAMES, WEEKLY:WEEKLY, ZEKR_BY_DAY:ZEKR_BY_DAY,
  ZEKR_TARGET:ZEKR_TARGET, zekrKey:zekrKey };
  }catch(e){ window.KZM_CORE = { ok:false }; }
})();
