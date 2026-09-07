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
  function setLang(lang) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (I18N[lang] && I18N[lang][k]) { el.textContent = I18N[lang][k]; }
      else if (I18N.en && I18N.en[k]) { el.textContent = I18N.en[k]; }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-placeholder');
      if (I18N[lang] && I18N[lang][k]) { el.setAttribute('placeholder', I18N[lang][k]); }
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
    /* Keep Alessia widget copy in sync deterministically */
    if (window.LexFlowAlessiaSync) { window.LexFlowAlessiaSync(); }
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
      b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
    });
    setLang(localStorage.getItem('lexflow-lang') || 'en');
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
    document.querySelectorAll('.faq-q').forEach(function (q) {
      q.addEventListener('click', function () {
        var item = q.closest('.faq-item');
        var wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(function (i) { i.classList.remove('open'); });
        if (!wasOpen) { item.classList.add('open'); }
      });
    });
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

  document.addEventListener('DOMContentLoaded', function () {
    initLang();
    initTheme();
    initFaq();
    initWebhooks();
    initWhatsApp();
    initChat();
  });
})();
