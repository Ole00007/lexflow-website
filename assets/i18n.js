/* ============================================================
   LEXFLOW WEB-SITE — SHARED i18n ENGINE (production)
   Each page defines window.I18N = {en:{...}, it:{...}, ru:{...}}
   before including this file. This engine handles:
   - Language switching (EN/IT/RU) with localStorage persistence
   - Theme toggle (dark/light)
   - FAQ accordion
   - WhatsApp float link (from window.LEXFLOW_CONFIG)
   - Webhook event firing (demo requests, social clicks)
   ============================================================ */
(function () {
  'use strict';

  var I18N = window.I18N || { en: {}, it: {}, ru: {} };

  /* ---- Language ---- */
  /* Some [data-i18n] elements contain markup (a link, an <em>). Assigning
     textContent would delete that markup, which used to break the "Pricing page"
     link inside faq_a2 and the Privacy link inside cookie_text as soon as a
     visitor switched language. Replace only the element's own text nodes and
     leave any child elements in place. */
  function setText(el, value) {
    if (!el.children || el.children.length === 0) {
      el.textContent = value;
      return;
    }
    var replaced = false;
    Array.prototype.forEach.call(el.childNodes, function (node) {
      if (node.nodeType === 3 && node.nodeValue.trim() !== '') {
        node.nodeValue = replaced ? '' : value;
        replaced = true;
      }
    });
    if (!replaced) {
      el.insertBefore(document.createTextNode(value), el.firstChild);
    }
  }

  /* Language URLs, when a page declares them. Used so that switching language on
     a localised URL navigates to the equivalent page rather than only swapping
     text in place. */
  var LANG_URLS = window.LEXFLOW_LANG_URLS || null;

  function goToLang(lang) {
    if (LANG_URLS && LANG_URLS[lang] && LANG_URLS[lang] !== location.pathname.split('/').pop()) {
      localStorage.setItem('lexflow-lang', lang);
      location.href = LANG_URLS[lang];
      return true;
    }
    return false;
  }

  function setLang(lang) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (I18N[lang] && I18N[lang][k]) { setText(el, I18N[lang][k]); }
      else if (I18N.en && I18N.en[k]) { setText(el, I18N.en[k]); }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-placeholder');
      if (I18N[lang] && I18N[lang][k]) { el.setAttribute('placeholder', I18N[lang][k]); }
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-aria');
      if (I18N[lang] && I18N[lang][k]) { el.setAttribute('aria-label', I18N[lang][k]); }
    });
    document.querySelectorAll('.lang-menu button').forEach(function (b) {
      b.classList.toggle('active-lang', b.getAttribute('data-lang') === lang);
    });
    var label = document.getElementById('langLabel');
    if (label) { label.textContent = lang.toUpperCase(); }
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('lexflow-lang', lang);
    var menu = document.getElementById('langMenu');
    if (menu) { menu.classList.remove('open'); }
    /* Keep the Elisa assistant copy in sync deterministically */
    if (window.LexFlowElisaSync) { window.LexFlowElisaSync(); }
  }

  function initLang() {
    var langBtn = document.getElementById('langBtn');
    var langMenu = document.getElementById('langMenu');
    if (langBtn && langMenu) {
      langBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        langMenu.classList.toggle('open');
      });
      document.addEventListener('click', function () { langMenu.classList.remove('open'); });
    }
    document.querySelectorAll('.lang-menu button').forEach(function (b) {
      b.addEventListener('click', function () {
        var target = b.getAttribute('data-lang');
        /* On a page that declares language URLs, switching navigates so the
           visitor lands on the correct URL for that language. */
        if (!goToLang(target)) { setLang(target); }
      });
    });
    /* A localised URL (/it/, /ru/) pins the language regardless of what a
       previous page stored in localStorage. */
    var lock = document.documentElement.getAttribute('data-lang-lock');
    setLang(lock || localStorage.getItem('lexflow-lang') || 'en');
  }

  /* ---- Theme ---- */
  function initTheme() {
    var themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var html = document.documentElement;
        var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('lexflow-theme', next);
      });
    }
    var saved = localStorage.getItem('lexflow-theme');
    if (saved) { document.documentElement.setAttribute('data-theme', saved); }
  }

  /* ---- FAQ accordion ---- */
  function initFaq() {
    var items = document.querySelectorAll('.faq-item');
    /* Keep ARIA state in step with the .open class. This used to toggle the
       class only, so every control announced aria-expanded="false" even while
       its answer was visible to screen readers. */
    function syncAria() {
      items.forEach(function (item) {
        var btn = item.querySelector('.faq-q');
        if (btn) {
          btn.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
        }
      });
    }
    document.querySelectorAll('.faq-q').forEach(function (q) {
      q.addEventListener('click', function () {
        var item = q.closest('.faq-item');
        var wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(function (i) { i.classList.remove('open'); });
        if (!wasOpen) { item.classList.add('open'); }
        syncAria();
      });
    });
    syncAria();
  }

  /* ---- Config / webhooks ---- */
  var CONFIG = window.LEXFLOW_CONFIG || {};
  var WEBHOOK_BASE = CONFIG.webhookBase || 'https://hook.example.com/lexflow';

  function fireWebhook(name, payload) {
    var endpoint = (CONFIG.webhooks && CONFIG.webhooks[name]) || (WEBHOOK_BASE + '/' + name);
    var body = Object.assign({ trigger: name, page: location.pathname.split('/').pop(), lang: document.documentElement.lang || 'en' }, payload || {});
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(endpoint, new Blob([JSON.stringify(body)], { type: 'application/json' }));
      } else {
        fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true });
      }
      console.log('[LexFlow] webhook fired:', name, body);
    } catch (err) {
      console.warn('[LexFlow] webhook failed:', name, err);
    }
  }

  function initWebhooks() {
    document.querySelectorAll('[data-webhook]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        var name = el.getAttribute('data-webhook');
        fireWebhook(name, { id: el.getAttribute('data-webhook-id') || undefined });
      });
    });
  }

  /* ---- WhatsApp float ---- */
  function initWhatsApp() {
    var wa = document.querySelector('.wa-float');
    if (wa && CONFIG.whatsapp) {
      wa.setAttribute('href', 'https://wa.me/' + CONFIG.whatsapp);
    }
  }

  /* ---- Chat (legacy fallback) ---- */
  function initChat() {
    var chatToggle = document.getElementById('chatToggle');
    var chatPanel = document.getElementById('chatPanel');
    if (chatToggle && chatPanel) {
      chatToggle.addEventListener('click', function () { chatPanel.classList.toggle('open'); });
    }
  }

  /* ---- Reveal on scroll ---- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initLang();
    initTheme();
    initFaq();
    initWebhooks();
    initWhatsApp();
    initChat();
    initReveal();
  });
})();
