/* ===== دستیار شناور سایت کاظمیون ===== */
(function(){
  'use strict';

  var CFG = window.KZM_ASSISTANT_CONFIG || {};
  var greeting = CFG.greeting || null;
  var sections = CFG.sections || [];
  var pageKey  = CFG.pageKey || location.pathname;

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
  var bActs  = el('div', 'kzm-bubble-actions');
  var bMore  = el('button', 'kzm-bubble-more', 'بیشتر بدون');
  var bClose = el('button', 'kzm-bubble-close', 'بستن');
  bActs.appendChild(bMore); bActs.appendChild(bClose);
  bubble.appendChild(bTitle); bubble.appendChild(bText); bubble.appendChild(bActs);

  var overlay = el('div', 'kzm-overlay');
  var card = el('div', 'kzm-overlay-card');
  var closeX = el('button', 'kzm-overlay-close', '✕');
  var oTitle = el('div', 'kzm-overlay-title');
  var oText = el('div', 'kzm-overlay-text');
  card.appendChild(closeX); card.appendChild(oTitle); card.appendChild(oText);
  overlay.appendChild(card);

  if(document.readyState === 'complete' || document.readyState === 'interactive'){ mount(); }
  else { document.addEventListener('DOMContentLoaded', mount); }

  var mascot, current = null, hideTimer = null, react = function(){};

  function mount(){
    if(document.getElementById('kzm-mascot')) return;
    document.body.appendChild(wrap);
    document.body.appendChild(bubble);
    document.body.appendChild(overlay);
    mascot = document.getElementById('kzm-mascot');
    initReactions();
    initInteractions();
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

    // در دسترس بودن برای بخش‌هایی از سایت (مثل گفتگوی پرسش‌وپاسخ) که قبلاً با این نام صدا می‌زدند
    window.FaqMascot = { react: react };
    window.KzmMascot = { react: react };

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
    bTitle.textContent = data.title || 'دستیار';
    bText.textContent  = data.short || '';
    bubble.classList.add('kzm-show');
    wrap.classList.add('kzm-has-tip');
    react(reactType || 'happy');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideBubble, 9000);
  }
  function hideBubble(){
    bubble.classList.remove('kzm-show');
    clearTimeout(hideTimer);
  }
  function openOverlay(data){
    if(!data) return;
    oTitle.textContent = data.title || 'دستیار';
    oText.textContent  = data.full || data.short || '';
    overlay.classList.add('kzm-show');
    document.body.style.overflow = 'hidden';
    react('happy', 1200);
    hideBubble();
  }
  function closeOverlay(){
    overlay.classList.remove('kzm-show');
    document.body.style.overflow = '';
  }

  function initInteractions(){
    var lastTap = null;

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
    // نزدیک‌ترین بخشِ دیده‌نشده به موقعیت فعلی اسکرول کاربر؛ اولویت با چیزی که همین الان روی صفحه‌ست
    function findNextUnseen(){
      var best = null, bestDist = Infinity;
      var mid = window.innerHeight / 2;
      sections.forEach(function(s){
        if(seen.indexOf(s.key) !== -1) return;
        var nodes = document.querySelectorAll(s.selector);
        for(var i=0;i<nodes.length;i++){
          var rect = nodes[i].getBoundingClientRect();
          if(rect.bottom < 0 || rect.top > window.innerHeight * 2.2) continue;
          var dist = Math.abs((rect.top + rect.bottom)/2 - mid);
          if(dist < bestDist){ bestDist = dist; best = s; }
        }
      });
      return best;
    }

    // --- کلیک روی شکلک: رفتاری هدفمند به‌جای واکنش کاملاً تصادفی ---
    mascot.addEventListener('click', function(){
      if(bubble.classList.contains('kzm-show')){
        openOverlay(current || greeting);
        return;
      }
      // اگه بخش دیده‌نشده‌ای نزدیک دید کاربره، همون رو به‌جای واکنش تصادفی نشون بده (شبیه یه راهنمای هوشمند)
      var next = findNextUnseen();
      if(next){
        markSeen(next.key);
        showBubble(next, 'think');
        return;
      }
      if(current || greeting){
        showBubble(current || greeting, 'surprised');
        return;
      }
      var pool = ['happy','laugh','shy','surprised','think'].filter(function(r){ return r !== lastTap; });
      var pick = pool[Math.floor(Math.random() * pool.length)];
      lastTap = pick;
      react(pick);
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
})();
