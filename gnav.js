/* ===== gnav.js — نوار ناوبری پایین (مشترک بین صفحه‌های داخلی) =====
   از نوار پایین index.html برداشته شده. دو تنظیم را از localStorage می‌خواند و همان لحظه اعمال می‌کند:
     kazemiuon-navtheme  → تم نوار (neon · beam · bubble · labels · magic)
     kazemiuon-nav       → «off» یعنی نوار در همه‌ی صفحه‌ها خاموش
   این تنظیم‌ها فقط در تنظیمات index.html عوض می‌شوند؛ این فایل هرگز چیزی در آن‌ها نمی‌نویسد.
   استفاده: در <head> هر صفحه  ←  <link rel="stylesheet" href="gnav.css"> و <script src="gnav.js"></script>
   اختیاری: <script src="gnav.js" data-active="qaem"></script> تا آیتم فعال دستی تعیین شود (home|heyat|qaem|other|settings) */
(function(){
  'use strict';
  if(window.__gnavLoaded) return; window.__gnavLoaded = true;

  var root = document.documentElement;
  var LS = {
    get:function(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } },
    set:function(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
  };
  var THEMES = ['neon', 'beam', 'bubble', 'labels', 'magic'];
  var D = {"fa": {"nNav": "ناوبری اصلی", "nHome": "خانه", "nHeyat": "کاظمیون", "nQaem": "مسجد قائم", "nOther": "سایر", "nSet": "تنظیمات", "sOwqat": "اوقات شرعی", "sZekr": "ذکر روز", "sDua": "ادعیه", "sCal": "تقویم", "sSalavat": "صلوات‌شمار", "sQuran": "قرآن ۲۴", "sLive": "پخش زنده", "sTour": "سه‌بعدی", "sFrame": "فریم‌ساز", "sNazr": "نذورات", "sConvert": "تبدیل تاریخ", "sFaq": "دستیار", "sInstall": "نصب اپ"}, "ar": {"nNav": "التنقل الرئيسي", "nHome": "الرئيسية", "nHeyat": "الكاظميون", "nQaem": "مسجد القائم", "nOther": "أخرى", "nSet": "الإعدادات", "sOwqat": "أوقات الصلاة", "sZekr": "ذكر اليوم", "sDua": "الأدعية", "sCal": "التقويم", "sSalavat": "عدّاد الصلوات", "sQuran": "القرآن ٢٤", "sLive": "بث مباشر", "sTour": "ثلاثي الأبعاد", "sFrame": "إطار الصور", "sNazr": "النذور", "sConvert": "محوّل التاريخ", "sFaq": "المساعد", "sInstall": "تثبيت التطبيق"}, "en": {"nNav": "Main navigation", "nHome": "Home", "nHeyat": "Kazemiyoon", "nQaem": "Qaem Mosque", "nOther": "More", "nSet": "Settings", "sOwqat": "Prayer times", "sZekr": "Daily dhikr", "sDua": "Duas", "sCal": "Calendar", "sSalavat": "Salawat", "sQuran": "Quran 24", "sLive": "Live", "sTour": "3D tour", "sFrame": "Photo frame", "sNazr": "Vows", "sConvert": "Date converter", "sFaq": "Assistant", "sInstall": "Install app"}};
  var NAV_HTML = "<nav class=\"gnav\" id=\"gnav\" aria-label=\"ناوبری اصلی\" data-i18n-aria=\"nNav\">\n  <ul>\n    <li class=\"list active\" style=\"--clr:#22c17f;\">\n      <a href=\"#\" data-nav=\"home\" aria-label=\"خانه\" data-i18n-aria=\"nHome\">\n        <span class=\"icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\"><path d=\"M3.5 11.2 12 4l8.5 7.2\"/><path d=\"M5.5 9.8V20h13V9.8\"/><path d=\"M10 20v-5.5h4V20\"/></svg></span>\n        <span class=\"lbl\" data-i18n=\"nHome\" aria-hidden=\"true\">خانه</span>\n      </a>\n    </li>\n    <li class=\"list\" style=\"--clr:#e0a21b;\">\n      <a href=\"kazemiyoon.html\" data-nav=\"heyat\" data-key=\"heyat\" aria-label=\"کاظمیون\" data-i18n-aria=\"nHeyat\" data-fan=\"heyat\" aria-haspopup=\"true\" draggable=\"false\">\n        <span class=\"icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\"><path d=\"M6 21V3.5\"/><path d=\"M6 4.5h12l-2.6 4 2.6 4H6\"/></svg></span>\n        <span class=\"lbl\" data-i18n=\"nHeyat\" aria-hidden=\"true\">کاظمیون</span>\n      </a>\n    </li>\n    <li class=\"list\" style=\"--clr:#468cff;\">\n      <a href=\"masjed-qaem.html\" data-nav=\"qaem\" data-key=\"qaem\" aria-label=\"مسجد قائم\" data-i18n-aria=\"nQaem\" data-fan=\"qaem\" aria-haspopup=\"true\" draggable=\"false\">\n        <span class=\"icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\"><path d=\"M12 2.8v2.2\"/><path d=\"M5.5 20v-7a6.5 6.5 0 0 1 13 0v7\"/><path d=\"M3 20h18\"/><path d=\"M10 20v-3.5a2 2 0 0 1 4 0V20\"/></svg></span>\n        <span class=\"lbl\" data-i18n=\"nQaem\" aria-hidden=\"true\">مسجد قائم</span>\n      </a>\n    </li>\n    <li class=\"list\" style=\"--clr:#b270ff;\">\n      <a href=\"other.html\" data-nav=\"other\" data-key=\"other\" aria-label=\"سایر\" data-i18n-aria=\"nOther\" data-fan=\"other\" aria-haspopup=\"true\" draggable=\"false\">\n        <span class=\"icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\"><rect x=\"4\" y=\"4\" width=\"6.5\" height=\"6.5\" rx=\"1.6\"/><rect x=\"13.5\" y=\"4\" width=\"6.5\" height=\"6.5\" rx=\"1.6\"/><rect x=\"4\" y=\"13.5\" width=\"6.5\" height=\"6.5\" rx=\"1.6\"/><rect x=\"13.5\" y=\"13.5\" width=\"6.5\" height=\"6.5\" rx=\"1.6\"/></svg></span>\n        <span class=\"lbl\" data-i18n=\"nOther\" aria-hidden=\"true\">سایر</span>\n      </a>\n    </li>\n    <li class=\"list\" style=\"--clr:#f0566a;\">\n      <a href=\"#\" data-nav=\"settings\" aria-label=\"تنظیمات\" data-i18n-aria=\"nSet\" id=\"gnav-settings\" aria-haspopup=\"dialog\">\n        <span class=\"icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\"><path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg></span>\n        <span class=\"lbl\" data-i18n=\"nSet\" aria-hidden=\"true\">تنظیمات</span>\n        <span class=\"gbadge\" id=\"gnav-badge\" aria-hidden=\"true\" hidden></span>\n      </a>\n    </li>\n    <li class=\"indicator\" aria-hidden=\"true\" role=\"presentation\"></li>\n  </ul>\n</nav>";
  var SCRIPT = document.currentScript;
  var OVERRIDE = SCRIPT ? SCRIPT.getAttribute('data-active') : null;
  var KEY = 'kzm-portal-last';

  function curLang(){ var l = String(root.lang || LS.get('kazemiuon-lang') || 'fa').slice(0, 2); return D[l] ? l : 'fa'; }
  function tr(k){ var d = D[curLang()]; return (d && d[k] !== undefined) ? d[k] : (D.fa[k] || k); }

  /* ---------- وضعیت مشترک: تم نوار + روشن/خاموش ---------- */
  var ntTok = 0;
  function swapNavTheme(name){
    var nv = document.getElementById('gnav'), tok = ++ntTok;
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!nv || !nv.animate || calm){ root.setAttribute('data-nt', name); return; }
    var from = parseFloat(getComputedStyle(nv).opacity); if(!(from > 0)) from = 1;
    nv.getAnimations().forEach(function(a){ a.cancel(); });
    root.classList.add('gnav-switching');
    var out = nv.animate([{ opacity:from }, { opacity:0 }], { duration:Math.round(90 * from), easing:'ease-in', fill:'forwards' });
    out.onfinish = function(){
      if(tok !== ntTok) return;
      root.setAttribute('data-nt', name);
      void nv.offsetWidth;
      var inn = nv.animate([{ opacity:0 }, { opacity:1 }], { duration:170, easing:'ease-out' });
      out.cancel();
      inn.onfinish = inn.oncancel = function(){ if(tok === ntTok) root.classList.remove('gnav-switching'); };
    };
  }
  function applyState(animate){
    var off = LS.get('kazemiuon-nav') === 'off';
    root.classList.toggle('gnav-off', off);
    var nt = LS.get('kazemiuon-navtheme'); if(THEMES.indexOf(nt) < 0) nt = 'neon';
    if(root.getAttribute('data-nt') !== nt){ if(animate) swapNavTheme(nt); else root.setAttribute('data-nt', nt); }
    var nv = document.getElementById('gnav'); if(nv && 'inert' in nv) nv.inert = off;
  }
  applyState(false);                                   /* قبل از اولین رسم: بدون چشمک */
  window.addEventListener('storage', function(e){      /* تغییر در تب/صفحه‌ی دیگر */
    if(e.key === null || e.key === 'kazemiuon-nav' || e.key === 'kazemiuon-navtheme') applyState(true);
  });
  document.addEventListener('visibilitychange', function(){ if(!document.hidden) applyState(true); });

  /* ---------- کدام آیتم نوار برای این صفحه فعال باشد ---------- */
  function fileOf(p){
    var f = String(p || '').split('?')[0].split('#')[0].split('/').pop().toLowerCase();
    if(!f) return 'index.html';
    return /\./.test(f) ? f : f + '.html';
  }
  var FILE = fileOf(location.pathname);
  var MAP = { 'index.html':'home', 'kazemiyoon.html':'heyat', 'masjed-qaem.html':'qaem', 'other.html':'other',
    'salavat.html':'qaem', 'quran24.html':'qaem',
    'live.html':'other', 'virtual-tour.html':'other', 'frame.html':'other', 'nazr.html':'other', 'convert.html':'other',
    'faq.html':'other', 'install.html':'other', 'guide.html':'other', 'status.html':'other' };
  /* صفحه‌هایی که در چند نیم‌دایره هستند: بخشی که کاربر از آن آمده فعال می‌شود */
  var AMBIG = { 'owqat.html':['heyat','qaem'], 'zekr.html':['heyat','qaem'], 'page2.html':['heyat','qaem','other'] };
  function resolveKey(){
    if(OVERRIDE && /^(home|heyat|qaem|other|settings)$/.test(OVERRIDE)) return OVERRIDE;
    if(AMBIG[FILE]){ var last = LS.get(KEY); return AMBIG[FILE].indexOf(last) >= 0 ? last : AMBIG[FILE][0]; }
    return MAP[FILE] || 'other';
  }

  function init(){
    if(document.getElementById('gnav') || !document.body) return;
    var tmp = document.createElement('div'); tmp.innerHTML = NAV_HTML;
    var nav = tmp.firstElementChild;
    var items = [].slice.call(nav.querySelectorAll('.list'));
    var KEYS = ['home', 'heyat', 'qaem', 'other', 'settings'];
    var base = items[Math.max(0, KEYS.indexOf(resolveKey()))];
    items[0].querySelector('a').setAttribute('href', 'index.html');   /* در صفحه‌های داخلی «خانه» = صفحه‌ی ورود */

    function paintLabels(){
      [].forEach.call(nav.querySelectorAll('[data-i18n]'), function(el){ el.textContent = tr(el.getAttribute('data-i18n')); });
      [nav].concat([].slice.call(nav.querySelectorAll('[data-i18n-aria]'))).forEach(function(el){ el.setAttribute('aria-label', tr(el.getAttribute('data-i18n-aria'))); });
    }
    function setActive(li){
      var idx = items.indexOf(li); if(idx < 0) return;
      items.forEach(function(x){
        var a = x.querySelector('a');
        x.classList.toggle('active', x === li);
        if(x === li && x === base) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      });
      nav.style.setProperty('--pos', idx);
      nav.style.setProperty('--ac', (li.style.getPropertyValue('--clr') || '#22c17f').trim());
    }
    paintLabels();
    setActive(base);                       /* قبل از افزودن به صفحه => نشانگر از اول زیر آیتم درست است و حرکتی دیده نمی‌شود */
    document.body.appendChild(nav);
    try{ var an = getComputedStyle(document.body).animationName; nav.classList.add(an && an !== 'none' ? 'gnav-in-late' : 'gnav-in'); }catch(e){}
    applyState(false);

    function settingsOpen(){ return !!(window.GSET && GSET.isOpen && GSET.isOpen()); }
    var busy = false, clickPending = false, curKey = null;

    function go(href, key){
      if(busy) return; busy = true;
      if(key) LS.set(KEY, key);
      document.body.classList.add('page-exit');
      setTimeout(function(){ location.href = href; }, 200);
    }

    items.forEach(function(li){
      var a = li.querySelector('a'), kind = a.getAttribute('data-nav');
      a.addEventListener('click', function(ev){
        if(kind === 'settings'){            /* پنجره‌ی تنظیمات همین صفحه؛ اگر صفحه نداشت، تنظیمات صفحه‌ی اصلی */
          ev.preventDefault();
          if(fan) closeFan(true, true);
          setActive(li);
          if(window.GSET) GSET.open(); else go('index.html#settings');   /* پنل تنظیمات مشترک (gset.js) در همین صفحه باز می‌شود */
          return;
        }
        if(ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button === 1) return;
        ev.preventDefault();
        if(busy) return;
        if(fileOf(a.pathname) === FILE && !a.hash){     /* همین صفحه: فقط برگرد بالا */
          if(fan) closeFan();
          setActive(li);
          try{ window.scrollTo({ top:0, behavior:'smooth' }); }catch(e){ window.scrollTo(0, 0); }
          return;
        }
        clickPending = true;
        setActive(li);                      /* اول انیمیشن نشانگر، بعد رفتن به صفحه */
        setTimeout(function(){ go(a.getAttribute('href'), a.getAttribute('data-key') || 'home'); }, 380);
      });
    });

  /* ================= نیم‌دایره‌ی زیرمجموعه‌ها ================= */
  var IC = {
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    beads:'<circle cx="12" cy="5" r="1.9"/><circle cx="18.4" cy="9.6" r="1.9"/><circle cx="16" cy="17.2" r="1.9"/><circle cx="8" cy="17.2" r="1.9"/><circle cx="5.6" cy="9.6" r="1.9"/>',
    book:'<path d="M12 6.5C10.5 5 8 4.5 4 4.5V18c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2V4.5c-4 0-6.5.5-8 2z"/><path d="M12 6.5V20"/>',
    cal:'<rect x="4" y="5.5" width="16" height="14.5" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
    count:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    quran:'<path d="M5 4.5h11a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
    live:'<circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/>',
    cube:'<path d="M12 3 4 7.5v9L12 21l8-4.5v-9z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>',
    frame:'<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5"/>',
    heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    swap:'<path d="M5 8h13l-3-3M19 16H6l3 3"/>',
    chat:'<path d="M4 5.5h16v10H10l-4.5 3.5v-3.5H4z"/><path d="M8.5 10h.01M12 10h.01M15.5 10h.01"/>',
    down:'<path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"/>'
  };
  var PAL = ['34,224,138','255,210,63','61,220,255','255,79,163','255,159,67','178,112,255','70,140,255','45,212,191','240,86,106'];
  var CAL = 'kazemiyoon.html#heyat-calendar';
  var SUBS = {
    heyat:{ t:'nHeyat', list:[['owqat.html','sOwqat','clock'], ['zekr.html','sZekr','beads'], ['page2.html','sDua','book'], [CAL,'sCal','cal']] },
    qaem: { t:'nQaem',  list:[['page2.html','sDua','book'], ['salavat.html','sSalavat','count'], ['zekr.html','sZekr','beads'], ['owqat.html','sOwqat','clock'], ['quran24.html','sQuran','quran']] },
    other:{ t:'nOther', list:[['live.html','sLive','live'], ['virtual-tour.html','sTour','cube'], [CAL,'sCal','cal'], ['page2.html','sDua','book'], ['frame.html','sFrame','frame'], ['nazr.html','sNazr','heart'], ['convert.html','sConvert','swap'], ['faq.html','sFaq','chat'], ['install.html','sInstall','down']] }
  };
  var SVGNS = 'http://www.w3.org/2000/svg';
  var fan = null, mode = null, holdT = 0, prepT = 0, sx = 0, sy = 0, held = null, heldA = null, suppress = false;
  var nearest = null, pts = [], geo = null, moveRaf = 0, lastE = null;

  function hexRgb(h){
    h = String(h || '').trim().replace('#', '');
    if(h.length === 3) h = h.replace(/./g, function(c){ return c + c; });
    var n = parseInt(h, 16); if(isNaN(n) || h.length !== 6) return '34,224,138';
    return ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255);
  }
  function icon(inner, cls){
    var s = document.createElementNS(SVGNS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true');
    if(cls) s.setAttribute('class', cls);
    s.innerHTML = inner; return s;
  }
  function div(cls){ var d = document.createElement('div'); d.className = cls; return d; }
  function arc(cx, cy, R){ return 'M' + (cx - R).toFixed(1) + ' ' + cy.toFixed(1) + ' A' + R.toFixed(1) + ' ' + R.toFixed(1) + ' 0 0 1 ' + (cx + R).toFixed(1) + ' ' + cy.toFixed(1); }

  function closeFan(immediate, keepActive){
    if(!fan) return;
    var f = fan; fan = null; mode = null; nearest = null; pts = []; geo = null;
    f.classList.remove('open', 'tap'); f.classList.add('closing');
    document.documentElement.classList.remove('gfan-on');
    items.forEach(function(x){ x.classList.remove('pressing'); });
    setTimeout(function(){ if(f.parentNode) f.parentNode.removeChild(f); }, immediate ? 0 : 220);
    if(!keepActive && !items[4].classList.contains('active')) setActive(base);
  }

  function buildFan(li, key){
    var cfg = SUBS[key]; if(!cfg) return; curKey = key;
    var n = cfg.list.length, vw = window.innerWidth;
    var two = n > 6, Rout, Rin;
    var S = two ? (vw < 370 ? 44 : 48) : (vw < 370 ? 46 : 52);                 /* بیش از ۶ آیتم: دو حلقه‌ی تو در تو تا برچسب‌ها روی هم نیفتند */
    if(two){ Rout = Math.min(166, (vw - 90) / 2); Rin = Rout * 0.66; }
    else   { Rout = Math.min(n <= 4 ? 118 : (n === 5 ? 130 : 140), (vw - 100) / 2); Rin = Rout; }
    var lr = li.getBoundingClientRect(), nr = nav.getBoundingClientRect();
    var hx = lr.left + lr.width / 2;
    var cx = Math.max(Rout + 50, Math.min(vw - Rout - 50, hx));
    var py = nr.top - 74;
    var rtl = document.documentElement.dir === 'rtl';
    var sr = hexRgb(li.style.getPropertyValue('--clr'));
    var coreS = Math.round(S * 1.08);
    geo = { cx:cx, py:py };

    fan = div('gfan' + (two ? ' dense' : '')); fan.id = 'gfan';
    fan.style.setProperty('--sr', sr); fan.style.setProperty('--bx', (cx / vw * 100).toFixed(1) + '%');
    fan.appendChild(div('gfan-bg'));
    var glow = div('gfan-glow'); glow.style.left = (cx - 280) + 'px'; fan.appendChild(glow);

    /* مدارها: دایره‌ی خط‌چینِ چرخان، فقط نیمه‌ی بالایش دیده می‌شود */
    function orbit(R){
      var sz = 2 * R + 16, o = div('gfan-orbit'), sp = div('gfan-spin'), c = (sz / 2).toFixed(1);
      o.style.cssText = 'left:' + (cx - R - 8).toFixed(1) + 'px;top:' + (py - R - 8).toFixed(1) + 'px;width:' + sz.toFixed(1) + 'px;height:' + (R + 16).toFixed(1) + 'px';
      sp.style.width = sp.style.height = sz.toFixed(1) + 'px';
      sp.innerHTML = '<svg viewBox="0 0 ' + sz.toFixed(1) + ' ' + sz.toFixed(1) + '" aria-hidden="true"><circle class="orbg" cx="' + c + '" cy="' + c + '" r="' + R.toFixed(1) + '"/><circle class="orb" cx="' + c + '" cy="' + c + '" r="' + R.toFixed(1) + '"/></svg>';
      o.appendChild(sp); return o;
    }
    fan.appendChild(orbit(Rout)); if(two) fan.appendChild(orbit(Rin));

    var pulse = div('gfan-pulse'); pulse.style.left = cx + 'px'; pulse.style.top = py + 'px'; fan.appendChild(pulse);

    var core = div('gfan-core'); core.style.left = cx + 'px'; core.style.top = py + 'px'; core.style.width = core.style.height = coreS + 'px';
    var liSvg = li.querySelector('svg'); if(liSvg) core.appendChild(icon(liSvg.innerHTML));
    fan.appendChild(core);

    /* اسم بخش: بالای کمان، نه وسط آن، تا جلوی هیچ برچسبی را نگیرد */
    var title = div('gfan-title'); title.textContent = tr(cfg.t);
    title.style.left = cx + 'px'; title.style.top = (py - Rout - S / 2 - (two ? 54 : 32)) + 'px';
    fan.appendChild(title);

    var grp = document.createElement('div'); grp.setAttribute('role', 'group'); grp.setAttribute('aria-label', tr(cfg.t));
    pts = [];
    var step = n === 1 ? 0 : Math.PI / (n - 1);
    cfg.list.forEach(function(it, i){
      var th = n === 1 ? Math.PI / 2 : (rtl ? i * step : Math.PI - i * step);
      var R = two ? (i % 2 === 0 ? Rout : Rin) : Rout;
      var x = cx + R * Math.cos(th), y = py - R * Math.sin(th);
      var a = document.createElement('a');
      a.className = 'fw' + ((two && i % 2 === 0) ? ' up' : ''); a.href = it[0]; a.setAttribute('aria-label', tr(it[1])); a.draggable = false;
      a.style.setProperty('--px', cx.toFixed(1) + 'px'); a.style.setProperty('--py', py.toFixed(1) + 'px');
      a.style.setProperty('--tx', (x - cx).toFixed(1) + 'px'); a.style.setProperty('--ty', (y - py).toFixed(1) + 'px');
      a.style.setProperty('--S', S + 'px'); a.style.setProperty('--i', i); a.style.setProperty('--k', 0);
      a.style.setProperty('--cr', PAL[i % PAL.length]);
      var fc = document.createElement('span'); fc.className = 'fc';
      fc.appendChild(icon(IC[it[2]] || IC.chat)); fc.appendChild(icon(IC[it[2]] || IC.chat, 'w'));
      var fl = document.createElement('span'); fl.className = 'fl'; fl.textContent = tr(it[1]);
      a.appendChild(fc); a.appendChild(fl); grp.appendChild(a);
      pts.push({ x:x, y:y, el:a, href:it[0], cr:PAL[i % PAL.length], k:0 });
    });
    fan.appendChild(grp);
    document.body.appendChild(fan);

    fan.addEventListener('click', function(ev){
      var a = ev.target.closest && ev.target.closest('.fw');
      if(a){ ev.preventDefault(); go(a.getAttribute('href'), curKey); return; }
      closeFan();
    });
    setActive(li);
  }

  /* نمایش: ساختن و محاسبه‌ی سبک از قبل (هنگام نگه داشتن) انجام شده؛ اینجا فقط کلاس open اضافه می‌شود تا هنگام باز شدن هیچ کار سنگینی نباشد */
  function revealFan(){
    if(!fan) return;
    var f = fan; void f.offsetWidth;
    requestAnimationFrame(function(){
      if(fan !== f) return;
      f.classList.add('open');
      document.documentElement.classList.add('gfan-on');
      var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      if(f.animate && !calm){
        [].forEach.call(f.querySelectorAll('.fw'), function(a, i){
          var tx = a.style.getPropertyValue('--tx'), ty = a.style.getPropertyValue('--ty');
          try{
            a.animate([
              { transform:'translate(-50%,-50%) translate(0px,0px) scale(.3)', opacity:0 },
              { transform:'translate(-50%,-50%) translate(' + tx + ',' + ty + ') scale(1)', opacity:1 }
            ], { duration:520, delay:i * 28, easing:'cubic-bezier(.2,1.25,.4,1)', fill:'backwards' });
          }catch(_){}
        });
      }
    });
  }
  function openFan(li, key){ buildFan(li, key); revealFan(); }
  function discardFan(){
    if(!fan || fan.classList.contains('open')) return;
    var f = fan; fan = null; pts = []; nearest = null; geo = null;
    document.documentElement.classList.remove('gfan-on');
    if(f.parentNode) f.parentNode.removeChild(f);
  }

  /* افکت مغناطیسی: هرچه انگشت به یک آیتم نزدیک‌تر باشد بزرگ‌تر و درخشان‌تر می‌شود */
  function updateNear(){
    moveRaf = 0; if(!fan || !lastE) return;
    var best = null, bd = 1e9;
    pts.forEach(function(p){
      var d = Math.hypot(lastE.clientX - p.x, lastE.clientY - p.y);
      var k = Math.max(0, 1 - d / 88); k = k * k * (3 - 2 * k);          /* منحنی نرم */
      if(Math.abs(k - p.k) > 0.012){ p.k = k; p.el.style.setProperty('--k', k.toFixed(3)); }
      if(d < bd){ bd = d; best = p; }
    });
    var nn = (best && bd <= 46) ? best : null;
    if(nn !== nearest){
      if(nearest) nearest.el.removeAttribute('data-near');
      if(nn) nn.el.setAttribute('data-near', '1');
      nearest = nn;
    }
  }
  window.addEventListener('pointermove', function(e){
    if(!fan) return;
    lastE = e; if(!moveRaf) moveRaf = requestAnimationFrame(updateNear);
  }, { passive:true });

  function endPress(cancel){
    clearTimeout(holdT); holdT = 0; clearTimeout(prepT); prepT = 0; discardFan();
    if(held) held.classList.remove('pressing');
    setTimeout(function(){ suppress = false; }, 80);
    if(fan && mode === 'drag'){
      if(cancel){ closeFan(); }
      else if(nearest){ go(nearest.href, curKey); }
      else { mode = 'tap'; fan.classList.add('tap'); }
    }
  }

  items.forEach(function(li){
    var a = li.querySelector('a'), key = a.getAttribute('data-fan'); if(!key) return;
    a.addEventListener('contextmenu', function(e){ e.preventDefault(); });
    a.addEventListener('dragstart', function(e){ e.preventDefault(); });
    a.addEventListener('pointerdown', function(e){
      if(e.pointerType === 'mouse' && e.button !== 0) return;
      if(fan) closeFan(true, true);          /* بدون برگشتن نشانگر به «خانه» */
      setActive(li);                          /* نشانگر همان لحظه‌ی لمس زیر انگشت می‌آید */
      held = li; heldA = a; sx = e.clientX; sy = e.clientY; lastE = e;
      li.classList.add('pressing');
      clearTimeout(holdT); clearTimeout(prepT);
      prepT = setTimeout(function(){ prepT = 0; if(!fan) buildFan(li, key); }, 110);   /* آماده‌سازی پشت صحنه تا لحظه‌ی باز شدن لگ نکند */
      holdT = setTimeout(function(){
        holdT = 0; clearTimeout(prepT); prepT = 0;
        try{ a.setPointerCapture(e.pointerId); }catch(_){}
        if(!fan) buildFan(li, key);
        revealFan(); mode = 'drag'; suppress = true;
        if(navigator.vibrate){ try{ navigator.vibrate(12); }catch(_){} }
        updateNear();
      }, 360);
    });
    a.addEventListener('pointermove', function(e){
      if(holdT && Math.hypot(e.clientX - sx, e.clientY - sy) > 14){
        clearTimeout(holdT); holdT = 0; clearTimeout(prepT); prepT = 0; discardFan(); li.classList.remove('pressing');
      }
    });
    a.addEventListener('pointerup', function(){ endPress(false); });
    a.addEventListener('pointercancel', function(){ endPress(true); });
    a.addEventListener('keydown', function(e){   /* صفحه‌کلید: ↑ نیم‌دایره را باز می‌کند */
      if(e.key === 'ArrowUp' || e.key === 'ContextMenu'){
        e.preventDefault(); if(fan) closeFan(true, true);
        held = li; heldA = a; openFan(li, key); mode = 'tap'; fan.classList.add('tap');
        var f = fan.querySelector('.fw'); if(f) f.focus({ preventScroll:true });
      }
    });
  });

  /* بازخورد لمس برای همه‌ی آیتم‌ها: نشانگر همان لحظه زیر انگشت می‌رود؛ اگر کاربر انگشتش را کنار کشید، یک‌بار و نرم به «خانه» برمی‌گردد */
  function settle(){
    setTimeout(function(){
      if(busy || clickPending || fan) return;
      if(settingsOpen()) return;
      if(!base.classList.contains('active')) setActive(base);
    }, 140);
  }
  items.forEach(function(li, idx){
    var a = li.querySelector('a');
    if(!a.hasAttribute('data-fan')){            /* تنظیمات */
      a.addEventListener('pointerdown', function(e){
        if(e.pointerType === 'mouse' && e.button !== 0) return;
        if(fan) closeFan(true, true);
        setActive(li);
      });
    }
    a.addEventListener('pointerup', settle);
    a.addEventListener('pointercancel', settle);
    a.addEventListener('pointerleave', function(e){ if(e.pointerType !== 'mouse' && !fan) settle(); });
  });

  /* لمس «خانه» وقتی نیم‌دایره‌ی یکی از سه بخش باز است => همان لحظه بسته می‌شود */
  items[0].querySelector('a').addEventListener('pointerdown', function(e){
    if(e.pointerType === 'mouse' && e.button !== 0) return;
    if(fan) closeFan();
  });

  /* جلوگیری از رفتن به صفحه‌ی بخش، وقتی کاربر برای باز کردن نیم‌دایره انگشت را نگه داشته بود */
  nav.addEventListener('click', function(ev){
    if(suppress){ suppress = false; ev.preventDefault(); ev.stopImmediatePropagation(); }
  }, true);
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && fan){ closeFan(); if(heldA){ try{ heldA.focus({ preventScroll:true }); }catch(_){} } }
  });
  window.addEventListener('resize', function(){ closeFan(true); });
  window.addEventListener('kzm-lang', function(){ closeFan(true); });

  /* ---------- زبان: برچسب‌ها با زبان صفحه عوض می‌شوند ---------- */
  try{ new MutationObserver(function(){ paintLabels(); closeFan(true); }).observe(root, { attributes:true, attributeFilter:['lang'] }); }catch(e){}

  /* بسته شدن پنجره‌ی تنظیمات (دکمه‌ی بستن، Esc یا لمس بیرون) => برگشت نشانگر به آیتم این صفحه */
  window.addEventListener('gset-close', function(){
    if(items[4].classList.contains('active')){
      setActive(base);
      var ae = document.activeElement;
      if(!ae || ae === document.body){ try{ items[4].querySelector('a').focus({ preventScroll:true }); }catch(e){} }
    }
  });

  /* برگشت با دکمه‌ی مرورگر (bfcache): تنظیمات را دوباره از localStorage بخوان */
  window.addEventListener('pageshow', function(e){
    applyState(false);
    if(e.persisted){ busy = false; clickPending = false; closeFan(true); document.body.classList.remove('page-exit'); setActive(base); }
  });
  }   /* پایان init */

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
