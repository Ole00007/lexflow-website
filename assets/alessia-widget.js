/* ============================================================
   LEXFLOW — ALESSIA CHAT WIDGET (production)
   Ported from the live LP widget; talks to the real CRM chatbot.
   ============================================================ */
(function () {
  'use strict';

  var CHATBOT_URL = (window.LEXFLOW_CONFIG && window.LEXFLOW_CONFIG.chatbotUrl) || "https://web-production-031a6.up.railway.app";

  var i18n = {
    it: {
      launcher: "Parla con Alessia",
      status: "Assistenza Online",
      chips: { low: "Bassa", medium: "Media", high: "Alta", critical: "Critica" },
      cta: "Chiamaci ora",
      sending: "Sto inviando la richiesta...",
      fallback: "Grazie. Abbiamo ricevuto la tua richiesta. Contattaci ora su WhatsApp per parlare subito con lo studio.",
      error: "C'è stato un problema. Riprova o contattaci su WhatsApp.",
      greeting: "Ciao! Sono Alessia, l'assistente dello studio. Come posso aiutarti?"
    },
    en: {
      launcher: "Talk to Alessia",
      status: "Online Support",
      chips: { low: "Low", medium: "Medium", high: "High", critical: "Critical" },
      cta: "Call us now",
      sending: "Sending your request...",
      fallback: "Thank you. We received your request. Contact us on WhatsApp now to talk to the firm directly.",
      error: "Something went wrong. Try again or reach us on WhatsApp.",
      greeting: "Hi! I'm Alessia, the firm's assistant. How can I help?"
    },
    ru: {
      launcher: "Написать Алессии",
      status: "Онлайн-поддержка",
      chips: { low: "Низкая", medium: "Средняя", high: "Высокая", critical: "Критическая" },
      cta: "Позвоните нам",
      sending: "Отправляем запрос...",
      fallback: "Спасибо. Мы получили ваш запрос. Свяжитесь с нами в WhatsApp, чтобы поговорить с фирмой напрямую.",
      error: "Что-то пошло не так. Попробуйте ещё раз или напишите нам в WhatsApp.",
      greeting: "Здравствуйте! Я Алессия, ассистент фирмы. Чем могу помочь?"
    }
  };

  function getLang() {
    return (document.documentElement.lang || 'en').slice(0, 2);
  }

  function syncCopy() {
    var lang = getLang();
    var t = i18n[lang] || i18n.en;
    var label = document.getElementById('alessiaLauncherLabel');
    if (label) label.textContent = t.launcher;
    var status = document.querySelector('.alessia-status');
    if (status) status.textContent = t.status;
    var greeting = document.querySelector('.alessia-message p');
    var pageI18n = window.I18N && window.I18N[lang] ? window.I18N[lang] : (window.I18N && window.I18N.en ? window.I18N.en : {});
    if (greeting) {
      if (pageI18n.chatbot_greeting) greeting.textContent = pageI18n.chatbot_greeting;
      else greeting.textContent = t.greeting;
    }
    var cta = document.getElementById('alessiaCtaLabel');
    if (cta) {
      if (pageI18n.chatbot_wa_cta) cta.textContent = pageI18n.chatbot_wa_cta;
      else cta.textContent = t.cta;
    }
    /* Translate chips */
    document.querySelectorAll('.alessia-chip').forEach(function (chip) {
      var val = chip.getAttribute('data-value');
      if (val && t.chips[val]) chip.textContent = t.chips[val];
    });
    /* Translate intake fields (from page I18N dict) */
    var pageI18n = window.I18N && window.I18N[lang] ? window.I18N[lang] : (window.I18N && window.I18N.en ? window.I18N.en : {});
    var intake = document.querySelector('.alessia-intake');
    if (intake) {
      var fieldLabels = intake.querySelectorAll('label');
      if (fieldLabels[0] && pageI18n.chatbot_field_topic) fieldLabels[0].textContent = pageI18n.chatbot_field_topic;
      if (fieldLabels[1] && pageI18n.chatbot_field_status) fieldLabels[1].textContent = pageI18n.chatbot_field_status;
      if (fieldLabels[2] && pageI18n.chatbot_field_urgency) fieldLabels[2].textContent = pageI18n.chatbot_field_urgency;
      var ta = intake.querySelector('textarea');
      if (ta && pageI18n.chatbot_message) ta.setAttribute('placeholder', pageI18n.chatbot_message);
      var sb = intake.querySelector('.alessia-send');
      if (sb && pageI18n.chatbot_send) sb.textContent = pageI18n.chatbot_send;
      /* Translate select options */
      var topicOpts = intake.querySelectorAll('select:nth-of-type(1) option');
      if (topicOpts.length >= 5 && pageI18n.chatbot_topic_civil) {
        topicOpts[0].textContent = pageI18n.chatbot_topic_civil;
        topicOpts[1].textContent = pageI18n.chatbot_topic_criminal;
        topicOpts[2].textContent = pageI18n.chatbot_topic_family;
        topicOpts[3].textContent = pageI18n.chatbot_topic_labor;
        topicOpts[4].textContent = pageI18n.chatbot_topic_other;
      }
      var statusOpts = intake.querySelectorAll('select:nth-of-type(2) option');
      if (statusOpts.length >= 3 && pageI18n.chatbot_status_new) {
        statusOpts[0].textContent = pageI18n.chatbot_status_new;
        statusOpts[1].textContent = pageI18n.chatbot_status_active;
        statusOpts[2].textContent = pageI18n.chatbot_status_closed;
      }
      var urgOpts = intake.querySelectorAll('select:nth-of-type(3) option');
      if (urgOpts.length >= 4 && pageI18n.chatbot_urgency_low) {
        urgOpts[0].textContent = pageI18n.chatbot_urgency_low;
        urgOpts[1].textContent = pageI18n.chatbot_urgency_medium;
        urgOpts[2].textContent = pageI18n.chatbot_urgency_high;
        urgOpts[3].textContent = pageI18n.chatbot_urgency_critical;
      }
    }
    var note = document.querySelector('.alessia-note');
    if (note && pageI18n.chatbot_note) note.textContent = pageI18n.chatbot_note;
    /* WA CTA — use page dict if present */
    if (pageI18n.chatbot_wa_cta) {
      if (cta) cta.textContent = pageI18n.chatbot_wa_cta;
    } else if (cta) {
      cta.textContent = t.cta;
    }
  }

  function openWidget() {
    var w = document.getElementById('alessiaWidget');
    if (w) w.classList.add('open');
  }

  function closeWidget() {
    var w = document.getElementById('alessiaWidget');
    if (w) w.classList.remove('open');
  }

  var isSending = false;

  function sendMessage(text) {
    if (isSending) return;
    isSending = true;
    var btn = document.querySelector('.alessia-cta');
    var sendLabel = i18n[getLang()] || i18n.en;
    var original = btn ? btn.innerHTML : '';
    if (btn) btn.innerHTML = sendLabel.sending + '…';

    fetch(CHATBOT_URL + '/api/chatbot', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, source: "lexflow-website", lang: getLang() })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var reply = (data && (data.reply || data.message)) || sendLabel.fallback;
        var body = document.querySelector('.alessia-message p');
        if (body) body.textContent = reply;
      })
      .catch(function (err) {
        console.error("chatbot widget error:", err);
        var body = document.querySelector('.alessia-message p');
        if (body) body.textContent = sendLabel.error;
      })
      .finally(function () {
        isSending = false;
        if (btn) btn.innerHTML = original;
      });
  }

  function init() {
    var launcher = document.getElementById('alessiaLauncher');
    if (launcher) launcher.addEventListener('click', openWidget);
    var closeBtn = document.querySelector('.alessia-control[data-action="close"]');
    if (closeBtn) closeBtn.addEventListener('click', closeWidget);

    document.querySelectorAll('.alessia-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.alessia-chip').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var val = btn.getAttribute('data-value') || btn.textContent;
        sendMessage(val);
      });
    });

    var cta = document.querySelector('.alessia-cta');
    if (cta) cta.addEventListener('click', function () { sendMessage("demo-request"); });

    /* Intake send button — collects fields and POSTs to CRM contacts */
    var sendBtn = document.querySelector('.alessia-send');
    if (sendBtn) {
      sendBtn.addEventListener('click', function () {
        var intake = document.querySelector('.alessia-intake');
        if (!intake) return;
        var topic = intake.querySelector('select:nth-of-type(1)').value;
        var status = intake.querySelector('select:nth-of-type(2)').value;
        var urgency = intake.querySelector('select:nth-of-type(3)').value;
        var text = intake.querySelector('textarea').value;
        var payload = {
          message: text,
          topic: topic,
          status: status,
          urgency: urgency,
          source: 'lexflow-website-chatbot',
          lang: getLang()
        };
        sendMessage(text || topic + ' / ' + urgency);
        try {
          if (window.LEXFLOW_CONFIG && window.LEXFLOW_CONFIG.webhookBase) {
            var wh = (window.LEXFLOW_CONFIG.webhooks && window.LEXFLOW_CONFIG.webhooks['chatbot-send']) || (window.LEXFLOW_CONFIG.webhookBase + '/chatbot-message');
            fetch(wh, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true }).catch(function(){});
          }
        } catch(err) {}
      });
    }

    // Expose global sync so i18n.js can call it deterministically after setLang
    window.LexFlowAlessiaSync = syncCopy;

    var observer = new MutationObserver(syncCopy);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    syncCopy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
