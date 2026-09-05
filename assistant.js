/* ===== دستیار شناور سایت کاظمیون ===== */
(function(){
  'use strict';

  var CFG = window.KZM_ASSISTANT_CONFIG || {};
  var greeting = CFG.greeting || null;
  var sections = CFG.sections || [];
  var pageKey  = CFG.pageKey || location.pathname;

  // نقشه‌ی صفحات سایت؛ هم برای جستجو و هم برای شبکه‌ی میان‌برهای پنجره‌ی تمام‌صفحه استفاده می‌شود
  var SITE_MAP = [
    { icon:'🏠', keywords:['خانه','صفحه اصلی','صفحه اول'], label:'صفحه اصلی', url:'index.html', desc:'بازگشت به صفحه اصلی سایت.' },
    { icon:'📿', keywords:['صلوات‌شمار','صلوات شمار','شمارنده صلوات','صلوات','تعجیل در فرج','استغفار'], label:'صلوات‌شمار', url:'salavat.html', desc:'شمارنده صلوات، تعجیل در فرج و استغفار با هدف روزانه.' },
    { icon:'🕯️', keywords:['نذر','نذورات','نذری'], label:'نذورات', url:'nazr.html', desc:'ثبت و پیگیری نذرهاتون.' },
    { icon:'🎙️', keywords:['مداحی','مولودی','نوحه','روضه'], label:'مداحی و مولودی', url:'madahi.html', desc:'فایل‌های صوتی مداحی و مولودی.' },
    { icon:'📸', keywords:['گالری','عکس ها','تصاویر','آلبوم'], label:'گالری تصاویر', url:'gallery.html', desc:'تصاویر مراسم و برنامه‌های هیئت.' },
    { icon:'🕌', keywords:['اوقات شرعی','اذان','وقت نماز','ساعت اذان','اذان ظهر','اذان صبح','اذان مغرب'], label:'اوقات شرعی', url:'owqat.html', desc:'اذان صبح تا عشاء برای چند شهر.' },
    { icon:'📅', keywords:['تبدیل تاریخ','تاریخ شمسی','تاریخ قمری','تاریخ میلادی'], label:'تبدیل تاریخ', url:'convert.html', desc:'تبدیل تاریخ بین شمسی، قمری و میلادی.' },
    { icon:'📖', keywords:['دعا','زیارت','زیارت نامه','دعای کمیل','زیارت عاشورا','دعای ندبه'], label:'ادعیه و زیارت‌نامه‌ها', url:'page2.html', desc:'متن کامل دعاها و زیارت‌نامه‌های معروف.' },
    { icon:'✨', keywords:['ذکر روز','ذکر امروز'], label:'ذکر روز', url:'zekr.html', desc:'ذکر هرروز رو اینجا ببین.' },
    { icon:'🖼️', keywords:['فریم','قاب عکس','فریم ساز','فریم پروفایل'], label:'فریم‌ساز عکس', url:'frame.html', desc:'عکس‌تو با فریم مخصوص هیئت بساز.' },
    { icon:'❓', keywords:['راهنما','راهنمای سایت','کمک'], label:'راهنمای سایت', url:'guide.html', desc:'راهنمای کامل استفاده از سایت.' },
    { icon:'💬', keywords:['سوال','پرسش','پرسش و پاسخ'], label:'پرسش و پاسخ', url:'faq.html', desc:'سوالات پرتکرار رو اینجا جواب می‌دیم.' },
    { icon:'🆕', keywords:['نسخه','ورژن','تغییرات','بروزرسانی','به روزرسانی','آپدیت','changelog'], label:'نسخه سایت', action:'version', desc:'تاریخچه‌ی تغییرات و به‌روزرسانی‌های سایت رو اینجا ببین.' }
  ];
  function currentPageFile(){
    return location.pathname.split('/').pop() || 'index.html';
  }

  // ---------------- نسخه‌ی سایت و تاریخچه‌ی تغییرات ----------------
  // نکته برای نگهداری: با هر انتشار مهم، APP_VERSION رو عوض کنید و یک آیتم جدید بالای CHANGELOG اضافه کنید.
  var APP_VERSION = '4.2';
  var CHANGELOG = [
    { v:'4.2', items:[
      'طراحی تازه‌ی صفحه اصلی: نشان، عنوان و شمارش‌معکوس در یک بخش یکپارچه (Hero) کنار هم قرار گرفتن',
      'اضافه شدن نشان وضعیت زنده‌ی مراسم؛ با لمسش، ساعت و مکان دقیق مراسم رو می‌بینید',
      'امکان بزرگ و کوچک کردن اندازه‌ی کل صفحه از منوی ☰ (برای راحتی افراد کم‌بینا)'
    ]},
    { v:'4.1', items:[
      'رفع اشکالی که باعث می‌شد چند صفحه از سایت (اوقات شرعی، ذکر روز، فریم‌ساز) بدون اینترنت باز نشن',
      'اضافه شدن دکمه تغییر زبان (فارسی/عربی/انگلیسی) و تغییر رنگ‌بندی به همین سه صفحه',
      'امکان نصب اپ (PWA) هم به این سه صفحه اضافه شد'
    ]},
    { v:'4.0', items:[
      'رفع مشکلی که باعث می‌شد بعضی وقت‌ها سایت نسخه‌ی قدیمی رو روی گوشی نشون بده',
      'اضافه شدن بخش «نسخه سایت» به دستیار و منو تا همیشه از تازه‌ترین تغییرات باخبر باشید'
    ]},
    { v:'3.0', items:[
      'اضافه شدن بخش نذورات',
      'بهبود نمایش صلوات‌شمار در گوشی‌های کوچک'
    ]},
    { v:'2.0', items:[
      'افزوده شدن گالری تصاویر مراسم',
      'پشتیبانی آفلاین و امکان نصب سایت به‌عنوان اپلیکیشن (PWA)'
    ]}
  ];

  var MASCOT_HTML =
    '<div class="kzm-mascot" id="kzm-mascot" aria-hidden="true">' +
      '<div class="kzm-mascot-glow"></div>' +
      '<div class="kzm-mascot-ring"></div>' +
      '<div class="kzm-mascot-sparkle s1"></div>' +
      '<div class="kzm-mascot-sparkle s2"></div>' +
      '<div class="kzm-mascot-sparkle s3"></div>' +
      '<div class="kzm-mascot-body">' +
        '<div class="kzm-mascot-face">' +
          '<div class="kzm-mascot-eyebrow left"></div>' +
          '<div class="kzm-mascot-eyebrow right"></div>' +
          '<div class="kzm-mascot-cheek left"></div>' +
          '<div class="kzm-mascot-cheek right"></div>' +
          '<div class="kzm-mascot-eye left"></div>' +
          '<div class="kzm-mascot-eye right"></div>' +
          '<div class="kzm-mascot-tear left"></div>' +
          '<div class="kzm-mascot-tear right"></div>' +
          '<div class="kzm-mascot-mouth"></div>' +
        '</div>' +
        '<div class="kzm-mascot-hand right">' +
          '<div class="kzm-mascot-hand-shape">' +
            '<span class="kzm-finger f1"></span>' +
            '<span class="kzm-finger f2"></span>' +
            '<span class="kzm-finger f3"></span>' +
            '<span class="kzm-finger f4"></span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<span class="kzm-mascot-dot"></span>' +
    '</div>';

  function el(tag, cls, html){
    var e = document.createElement(tag);
    if(cls) e.className = cls;
    if(html !== undefined) e.innerHTML = html;
    return e;
  }

  var wrap = el('div', 'kzm-mascot-wrap', MASCOT_HTML);

  var bubble = el('div', 'kzm-bubble');
  var bTitle = el('div', 'kzm-bubble-title');
  var bText  = el('div', 'kzm-bubble-text');
  var bLink  = document.createElement('a');
  bLink.className = 'kzm-bubble-link';
  bLink.textContent = 'برو به این بخش ←';
  var bActs  = el('div', 'kzm-bubble-actions');
  var bMore  = el('button', 'kzm-bubble-more', 'بیشتر بدون');
  var bClose = el('button', 'kzm-bubble-close', 'بستن');
  bActs.appendChild(bMore); bActs.appendChild(bClose);
  bubble.appendChild(bTitle); bubble.appendChild(bText); bubble.appendChild(bLink); bubble.appendChild(bActs);
  bLink.addEventListener('click', function(e){
    if(current && current.action === 'version'){
      e.preventDefault();
      hideBubble();
      openVersionModal();
    }
  });

  var searchBtn = el('button', 'kzm-search-btn', '🔍');
  searchBtn.setAttribute('type', 'button');
  searchBtn.setAttribute('aria-label', 'جستجوی بخش‌های سایت');

  var searchPanel = el('div', 'kzm-search-panel');
  var sTitle = el('div', 'kzm-search-title', 'دنبال چی می‌گردی؟');
  var sRow   = el('div', 'kzm-search-row');
  var sInput = document.createElement('input');
  sInput.type = 'text';
  sInput.className = 'kzm-search-input';
  sInput.placeholder = 'مثلاً: صلوات‌شمار';
  sInput.setAttribute('dir', 'rtl');
  var sSubmit = el('button', 'kzm-search-submit', '→');
  sSubmit.setAttribute('type', 'button');
  sRow.appendChild(sInput); sRow.appendChild(sSubmit);
  searchPanel.appendChild(sTitle); searchPanel.appendChild(sRow);

  var overlay = el('div', 'kzm-overlay');
  var card = el('div', 'kzm-overlay-card');
  var closeX = el('button', 'kzm-overlay-close', '✕');
  var oBody = el('div', 'kzm-overlay-body');
  var oTitle = el('div', 'kzm-overlay-title');
  var oText = el('div', 'kzm-overlay-text');
  var oHint = el('div', 'kzm-overlay-hint', '👇 پایین‌تر می‌تونی میان‌برهای همه‌ی بخش‌های سایت رو هم ببینی');
  var oGridHeading = el('div', 'kzm-overlay-grid-heading', 'میان‌برهای سایت');
  var oGrid = el('div', 'kzm-overlay-grid');
  (function buildShortcuts(){
    var curFile = currentPageFile();
    SITE_MAP.forEach(function(item){
      var a = document.createElement(item.action ? 'button' : 'a');
      a.className = 'kzm-shortcut' + (item.url === curFile ? ' kzm-shortcut-active' : '');
      if(item.action){
        a.setAttribute('type', 'button');
        a.addEventListener('click', function(){
          closeOverlay();
          if(item.action === 'version') openVersionModal();
        });
      } else {
        a.href = item.url;
      }
      a.innerHTML = '<span class="icon">' + item.icon + '</span><span>' + item.label + '</span>';
      oGrid.appendChild(a);
    });
  })();

  // ---------------- مودال نسخه سایت / تاریخچه تغییرات ----------------
  var vOverlay = el('div', 'kzm-version-overlay');
  var vCard    = el('div', 'kzm-version-card');
  var vClose   = el('button', 'kzm-version-x', '✕');
  var vTitle   = el('div', 'kzm-version-title', '🎉 به‌روزرسانی سایت');
  var vTag     = el('div', 'kzm-version-tag');
  var vList    = el('div', 'kzm-version-list');
  var vThanks  = el('div', 'kzm-version-thanks', '🙏 با تشکر از همراهی همیشگی شما با هیئت کاظمیون خرم‌آباد');
  var vBtn     = el('button', 'kzm-version-btn', 'متوجه شدم');
  vClose.setAttribute('type', 'button');
  vClose.setAttribute('aria-label', 'بستن');
  vBtn.setAttribute('type', 'button');
  vCard.appendChild(vClose);
  vCard.appendChild(vTitle);
  vCard.appendChild(vTag);
  vCard.appendChild(vList);
  vCard.appendChild(vThanks);
  vCard.appendChild(vBtn);
  vOverlay.appendChild(vCard);

  function renderChangelog(){
    vTag.textContent = 'نسخه فعلی: ' + APP_VERSION;
    vList.innerHTML = CHANGELOG.map(function(c, idx){
      var isLatest = idx === 0;
      return '<div class="kzm-version-item' + (isLatest ? ' latest' : '') + '">' +
        '<div class="v">' + (isLatest ? '<span class="badge">جدیدترین</span>' : '') + 'نسخه ' + c.v + '</div><ul>' +
        c.items.map(function(i){ return '<li>' + i + '</li>'; }).join('') +
        '</ul></div>';
    }).join('');
  }
  function markVersionSeen(){
    try { localStorage.setItem('kzmSeenVersion', APP_VERSION); } catch(err){}
  }
  function openVersionModal(){
    renderChangelog();
    closeOverlay();
    closeSearch();
    hideBubble();
    vOverlay.classList.add('kzm-show');
    lockPageScroll();
  }
  function closeVersionModal(){
    vOverlay.classList.remove('kzm-show');
    unlockPageScroll();
    markVersionSeen();
  }
  vBtn.addEventListener('click', closeVersionModal);
  vClose.addEventListener('click', closeVersionModal);
  vOverlay.addEventListener('click', function(e){ if(e.target === vOverlay) closeVersionModal(); });
  oBody.appendChild(oTitle); oBody.appendChild(oText); oBody.appendChild(oHint);
  oBody.appendChild(oGridHeading); oBody.appendChild(oGrid);
  card.appendChild(closeX); card.appendChild(oBody);
  overlay.appendChild(card);

  if(document.readyState === 'complete' || document.readyState === 'interactive'){ mount(); }
  else { document.addEventListener('DOMContentLoaded', mount); }

  var mascot, current = null, hideTimer = null, react = function(){};

  function mount(){
    if(document.getElementById('kzm-mascot')) return;
    document.body.appendChild(wrap);
    document.body.appendChild(bubble);
    document.body.appendChild(overlay);
    var topbarSearchBtn = document.getElementById('kzm-topbar-search-btn');
    if(!topbarSearchBtn){
      document.body.appendChild(searchBtn);
    }
    document.body.appendChild(searchPanel);
    document.body.appendChild(vOverlay);
    mascot = document.getElementById('kzm-mascot');
    initReactions();
    initInteractions();
    initSearch(topbarSearchBtn);
    injectVersionMenuItem();
    initVersionCheck();
  }

  // ---------------- افزودن ردیف «نسخه سایت» به منوی همبرگری (در صورت وجود در این صفحه) ----------------
  function injectVersionMenuItem(){
    var panel = document.getElementById('quick-menu-panel');
    if(!panel || document.getElementById('kzm-version-menu-row')) return;
    var row = el('div', 'quick-menu-row');
    row.id = 'kzm-version-menu-row';
    var label = el('span', 'quick-menu-label', 'نسخه سایت');
    var btn = el('button', 'sound-toggle', '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.5v5l3.2 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', 'نمایش تاریخچه تغییرات و نسخه سایت');
    btn.addEventListener('click', function(){
      panel.classList.remove('show');
      var menuBtn = document.getElementById('quick-menu-btn');
      if(menuBtn){ menuBtn.classList.remove('active'); menuBtn.setAttribute('aria-expanded', 'false'); }
      openVersionModal();
    });
    row.appendChild(label);
    row.appendChild(btn);
    panel.appendChild(row);
  }

  // ---------------- نمایش خودکار مودال نسخه فقط یک‌بار برای هر نسخه‌ی جدید ----------------
  function initVersionCheck(){
    var isReturningUser = false;
    try { isReturningUser = !!localStorage.getItem('kzmAssistGreeted'); } catch(err){}
    var seenVersion = null;
    try { seenVersion = localStorage.getItem('kzmSeenVersion'); } catch(err){}
    if(seenVersion === APP_VERSION) return;
    if(!isReturningUser){
      // کاربر تازه‌واردیه؛ چیزی که براش «جدید» نیست رو بهش اعلام نکن، فقط نسخه‌ی فعلی رو ثبت کن
      markVersionSeen();
      return;
    }
    setTimeout(function(){ openVersionModal(); }, 1800);
  }

  // ---------------- ری‌اکشن‌های شکلک (برداشته‌شده از دستیار صفحه‌ی پرسش‌وپاسخ) ----------------
  function initReactions(){
    var REACTIONS = ['happy', 'laugh', 'cry', 'angry', 'surprised', 'shy', 'think'];
    var DURATIONS = { happy:700, laugh:1300, cry:1700, angry:1000, surprised:800, shy:1000, think:1700 };
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cur = null, revertTimer = null;

    react = function(type, customDuration){
      if(REACTIONS.indexOf(type) === -1) return;
      clearTimeout(revertTimer);
      if(cur) mascot.classList.remove(cur);
      mascot.classList.add(type);
      cur = type;
      var dur = customDuration || DURATIONS[type] || 900;
      revertTimer = setTimeout(function(){
        mascot.classList.remove(type);
        if(cur === type) cur = null;
      }, dur);
    };

    // در دسترس بودن برای بخش‌هایی از سایت (مثل گفتگوی پرسش‌وپاسخ، یادآور اذان، جشن صلوات‌شمار) که قبلاً با این نام صدا می‌زدند
    window.FaqMascot = { react: react };
    window.KzmMascot = {
      react: react,
      // نمایش یه پیام از طرف دستیار؛ data می‌تونه title/short/full/url داشته باشه
      notify: function(data, reactType){ showBubble(data, reactType); },
      // مخفی/نمایش کامل ویجت (مثلاً وقتی کاربر داره دعا می‌خونه)
      hide: function(){ setVisible(false); },
      show: function(){ setVisible(true); },
      // نمایش دستی مودال نسخه/تاریخچه تغییرات سایت
      showVersion: function(){ openVersionModal(); }
    };

    if(!reduceMotion){
      var idlePool = ['happy', 'shy', 'surprised', 'think', 'laugh'];
      (function scheduleIdle(){
        var delay = 9000 + Math.random() * 7000;
        setTimeout(function(){
          var bubbleShown = bubble.classList.contains('kzm-show');
          var overlayShown = overlay.classList.contains('kzm-show');
          if(!cur && !bubbleShown && !overlayShown){
            var pick = idlePool[Math.floor(Math.random() * idlePool.length)];
            react(pick, (DURATIONS[pick] || 900) * 0.7);
          }
          scheduleIdle();
        }, delay);
      })();
    }
  }

  // ---------------- حباب گفتگو و پنجره‌ی تمام‌صفحه ----------------
  function showBubble(data, reactType){
    if(!data) return;
    current = data;
    closeSearch();
    bTitle.textContent = data.title || 'دستیار';
    bText.textContent  = data.short || '';
    if(data.url){
      bLink.setAttribute('href', data.url);
      bLink.textContent = 'برو به این بخش ←';
      bLink.style.display = 'inline-flex';
    } else if(data.action){
      bLink.removeAttribute('href');
      bLink.textContent = 'دیدن تغییرات ←';
      bLink.style.display = 'inline-flex';
    } else {
      bLink.removeAttribute('href');
      bLink.style.display = 'none';
    }
    bubble.classList.add('kzm-show');
    wrap.classList.add('kzm-has-tip');
    react(reactType || 'happy');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideBubble, data.url ? 14000 : 9000);
  }
  function hideBubble(){
    bubble.classList.remove('kzm-show');
    clearTimeout(hideTimer);
  }
  function openOverlay(data){
    if(!data) return;
    closeSearch();
    oTitle.textContent = data.title || 'دستیار';
    oText.textContent  = data.full || data.short || '';
    overlay.classList.add('kzm-show');
    lockPageScroll();
    react('happy', 1200);
    hideBubble();
  }
  function closeOverlay(){
    overlay.classList.remove('kzm-show');
    unlockPageScroll();
  }
  // قفل کامل اسکرول پشت پنجره‌ی تمام‌صفحه؛ هم روی body و هم روی html
  // (فقط overflow:hidden روی body کافی نیست و باعث می‌شه با اسکرول داخل پنجره،
  // نوار آدرس مرورگر موبایل جمع/باز بشه و ارتفاع vh عوض بشه و پنجره از صفحه بزنه بیرون)
  var savedScrollY = 0, pageScrollLocked = false;
  function lockPageScroll(){
    if(pageScrollLocked) return;
    pageScrollLocked = true;
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = (-savedScrollY) + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
  }
  function unlockPageScroll(){
    if(!pageScrollLocked) return;
    pageScrollLocked = false;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    window.scrollTo(0, savedScrollY);
  }
  function closeSearch(){
    searchPanel.classList.remove('kzm-show');
  }
  function openSearch(){
    hideBubble();
    searchPanel.classList.add('kzm-show');
    setTimeout(function(){ sInput.focus(); }, 50);
  }
  // مخفی/آشکار کردن کامل ویجت دستیار؛ برای مواقعی که یه بخش دیگه سایت (مثل خواندن دعا در حالت تمام‌صفحه) نباید دستیار روش باشه
  function setVisible(visible){
    document.body.classList.toggle('kzm-widget-hidden', !visible);
    if(!visible){
      hideBubble();
      closeSearch();
      closeOverlay();
    }
  }

  function initInteractions(){
    // --- حافظه‌ی بخش‌هایی که قبلاً برای کاربر توضیح داده شده (برای یک تور هوشمند و بدون تکرار) ---
    var seenKey = 'kzmAssistSeen_' + pageKey;
    var seen = [];
    try { seen = JSON.parse(sessionStorage.getItem(seenKey) || '[]'); } catch(err){ seen = []; }
    function markSeen(key){
      if(seen.indexOf(key) === -1){
        seen.push(key);
        try { sessionStorage.setItem(seenKey, JSON.stringify(seen)); } catch(err){}
      }
    }

    var DEFAULT_OVERLAY_DATA = {
      title: 'دستیار سایت',
      short: 'از این‌جا می‌تونی به هر بخشی از سایت سر بزنی.',
      full: 'از این‌جا می‌تونی به هر بخشی از سایت سر بزنی؛ کافیه روی یکی از میان‌برهای پایین بزنی.'
    };

    // --- کلیک روی شکلک: مستقیم پنجره‌ی تمام‌صفحه با میان‌برهای کل سایت باز می‌شه ---
    mascot.addEventListener('click', function(){
      openOverlay(current || greeting || DEFAULT_OVERLAY_DATA);
    });
    bMore.addEventListener('click', function(e){ e.stopPropagation(); openOverlay(current); });
    bClose.addEventListener('click', function(e){ e.stopPropagation(); hideBubble(); });
    closeX.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', function(e){ if(e.target === overlay) closeOverlay(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeOverlay(); });

    // --- سلام و خوش‌آمد؛ فقط یک‌بار برای هر کاربر در کل سایت ---
    if(greeting && !localStorage.getItem('kzmAssistGreeted')){
      setTimeout(function(){
        showBubble(greeting, 'happy');
        localStorage.setItem('kzmAssistGreeted', '1');
      }, 1400);
    }

    // --- توضیح خودکار بخش‌ها هنگام ورود کاربر به آن‌ها هنگام اسکرول ---
    if(sections.length && 'IntersectionObserver' in window){
      var map = new Map();

      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting && entry.intersectionRatio >= 0.5){
            var data = map.get(entry.target);
            if(!data || seen.indexOf(data.key) !== -1) return;
            markSeen(data.key);
            showBubble(data, 'think');
          }
        });
      }, {threshold:[0.5]});

      sections.forEach(function(s){
        document.querySelectorAll(s.selector).forEach(function(node){
          map.set(node, s);
          io.observe(node);
        });
      });
    }
  }

  // ---------------- جستجوی بخش‌های سایت ----------------
  function initSearch(topbarTrigger){
    var trigger = topbarTrigger || searchBtn;
    if(topbarTrigger){
      searchPanel.classList.add('kzm-search-panel-top');
    }

    function normalize(s){
      return (s || '').replace(/‌/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function findMatch(query){
      var q = normalize(query);
      if(!q) return null;
      var best = null, bestScore = 0;
      SITE_MAP.forEach(function(item){
        item.keywords.forEach(function(kw){
          var k = normalize(kw);
          if(q.indexOf(k) !== -1 || k.indexOf(q) !== -1){
            var score = Math.min(k.length, q.length);
            if(score > bestScore){ bestScore = score; best = item; }
          }
        });
      });
      return best;
    }

    function runSearch(){
      var q = sInput.value;
      var match = findMatch(q);
      var currentFile = currentPageFile();
      closeSearch();
      if(!q.trim()){
        // ورودی خالی، کاری نکن
      } else if(match && match.url === currentFile){
        showBubble({ title:'😊 همین‌جایی!', short:'الان توی همین بخش («' + match.label + '») هستی.' }, 'shy');
      } else if(match){
        showBubble({ title:'🔍 ' + match.label, short:match.desc, url:match.url, action:match.action }, 'happy');
      } else {
        showBubble({ title:'🤔 پیدا نکردم', short:'دقیق متوجه نشدم؛ می‌تونی توی صفحه راهنما همه بخش‌ها رو ببینی.', url:'guide.html' }, 'think');
      }
      sInput.value = '';
    }

    trigger.addEventListener('click', function(e){
      e.stopPropagation();
      if(searchPanel.classList.contains('kzm-show')) closeSearch();
      else openSearch();
    });
    if(topbarTrigger){
      trigger.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          if(searchPanel.classList.contains('kzm-show')) closeSearch();
          else openSearch();
        }
      });
    }
    sSubmit.addEventListener('click', function(e){ e.stopPropagation(); runSearch(); });
    sInput.addEventListener('click', function(e){ e.stopPropagation(); });
    sInput.addEventListener('keydown', function(e){
      e.stopPropagation();
      if(e.key === 'Enter'){ e.preventDefault(); runSearch(); }
      else if(e.key === 'Escape'){ closeSearch(); }
    });
    document.addEventListener('click', function(e){
      if(searchPanel.classList.contains('kzm-show') && !searchPanel.contains(e.target) && e.target !== trigger){
        closeSearch();
      }
    });
  }
})();
