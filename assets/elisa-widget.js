/* ============================================================
   LEXFLOW — ELISA DIGITAL INTAKE ASSISTANT (production widget)
   ------------------------------------------------------------
   Behaviour + state model cloned from the a-Lexy LP widget
   (#alLaunch / #alWidget, coruscating-pegasus-c96710.netlify.app).
   Rebranded Elisa for LexFlow. Talks to the real CRM chatbot.

   Cloned states: launcher, open, close, minimise, topic chips,
   message bubbles (assistant/user), typing indicator, send,
   loading, success, failure/fallback, WhatsApp continuation,
   keyboard (Esc / focus trap), reduced motion, 375-1280px.

   Escalation: rendering a bubble is textContent-only (no HTML
   injection). No client identifiers are written to the console.
   ============================================================ */
(function () {
  'use strict';

  var CFG = window.LEXFLOW_CONFIG || {};
  var BASE = (CFG.chatbotUrl || 'https://web-production-031a6.up.railway.app').replace(/\/+$/, '');
  var WHATSAPP = CFG.whatsapp || '393450234084';

  /* ---------- Copy (EN/IT/RU) ---------- */
  var COPY = {
    en: {
      launcher: 'Talk to Elisa',
      name: 'Elisa',
      role: "LexFlow's digital intake assistant",
      status: 'Online — intake only',
      close: 'Close assistant',
      minimise: 'Minimise assistant',
      log: 'Conversation with Elisa',
      greeting: "Hi! I'm Elisa, LexFlow's digital intake assistant. I can gather the first details of your request and pass them into the firm's structured intake flow. How can I help?",
      disclaimer: 'Elisa does not give legal advice and does not replace a lawyer.',
      chipsLabel: 'Suggested topics',
      chips: { new: 'New matter', status: 'Matter status', urgent: 'Urgent', pricing: 'Plans & pricing' },
      urgencyLabel: 'How urgent is this?',
      urgency: { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' },
      intakeTitle: 'Tell us about the request',
      f_practice: 'Practice area',
      f_status: 'Matter status',
      f_urgency: 'Urgency',
      f_message: 'Brief description (no confidential details)',
      ph_message: 'e.g. Contract review before a 15 October deadline',
      send: 'Send request',
      sending: 'Sending…',
      thinking: 'Elisa is typing…',
      sent: "Thank you — your request has been passed to the firm's intake flow. The team will follow up using the contact details you provide.",
      fallback: "Thanks. We couldn't reach the intake service just now, so nothing was sent. You can continue on WhatsApp and the firm will pick it up from there.",
      error: "Something went wrong and your request was not sent. Please try again, or continue on WhatsApp.",
      wa: 'Continue on WhatsApp',
      escalate: 'Urgent matter? Call the firm directly.',
      privacy: 'Do not send confidential case details here. Internal firm notes are never shown to clients.',
      privacyLink: 'Privacy policy',
      p_new: 'New matter', p_status: 'Matter status', p_urgent: 'Urgent',
      practice: { civil: 'Civil law', corporate: 'Corporate & business', family: 'Family law', criminal: 'Criminal defence', realestate: 'Real estate', ip: 'Intellectual property', immigration: 'Immigration', labour: 'Labour & employment', administrative: 'Administrative', other: 'Other / not sure' },
      statusOpt: { new: 'New request', review: 'Under review', existing: 'Existing matter' }
    },
    it: {
      launcher: 'Parla con Elisa',
      name: 'Elisa',
      role: 'Assistente digitale per l\'intake di LexFlow',
      status: 'Online — solo intake',
      close: 'Chiudi assistente',
      minimise: 'Riduci assistente',
      log: 'Conversazione con Elisa',
      greeting: 'Ciao! Sono Elisa, l\'assistente digitale per l\'intake di LexFlow. Posso raccogliere le prime informazioni della tua richiesta e inserirle nel flusso di intake strutturato dello studio. Come posso aiutarti?',
      disclaimer: 'Elisa non fornisce consulenza legale e non sostituisce un avvocato.',
      chipsLabel: 'Argomenti suggeriti',
      chips: { new: 'Nuova pratica', status: 'Stato pratica', urgent: 'Urgenza', pricing: 'Piani e prezzi' },
      urgencyLabel: 'Quanto è urgente?',
      urgency: { low: 'Bassa', medium: 'Media', high: 'Alta', critical: 'Critica' },
      intakeTitle: 'Descrivi la richiesta',
      f_practice: 'Area di attività',
      f_status: 'Stato della pratica',
      f_urgency: 'Urgenza',
      f_message: 'Breve descrizione (senza dettagli riservati)',
      ph_message: 'es. Revisione contratto prima del 15 ottobre',
      send: 'Invia richiesta',
      sending: 'Invio in corso…',
      thinking: 'Elisa sta scrivendo…',
      sent: 'Grazie — la tua richiesta è stata inserita nel flusso di intake dello studio. Il team ti ricontatterà ai recapiti che fornirai.',
      fallback: 'Grazie. Non siamo riusciti a raggiungere il servizio di intake, quindi non è stato inviato nulla. Puoi continuare su WhatsApp e lo studio riprenderà da lì.',
      error: 'Si è verificato un problema e la richiesta non è stata inviata. Riprova oppure continua su WhatsApp.',
      wa: 'Continua su WhatsApp',
      escalate: 'Pratica urgente? Chiama direttamente lo studio.',
      privacy: 'Non inviare qui dettagli riservati sulla pratica. Le note interne dello studio non sono mai visibili ai clienti.',
      privacyLink: 'Informativa privacy',
      p_new: 'Nuova pratica', p_status: 'Stato pratica', p_urgent: 'Urgenza',
      practice: { civil: 'Diritto civile', corporate: 'Societario e d\'impresa', family: 'Diritto di famiglia', criminal: 'Diritto penale', realestate: 'Immobiliare', ip: 'Proprietà intellettuale', immigration: 'Immigrazione', labour: 'Lavoro', administrative: 'Amministrativo', other: 'Altro / non so' },
      statusOpt: { new: 'Nuova richiesta', review: 'In valutazione', existing: 'Pratica esistente' }
    },
    ru: {
      launcher: 'Написать Элизе',
      name: 'Элиза',
      role: 'цифровой ассистент LexFlow по приёму заявок',
      status: 'Онлайн — только приём заявок',
      close: 'Закрыть ассистента',
      minimise: 'Свернуть ассистента',
      log: 'Диалог с Элизой',
      greeting: 'Здравствуйте! Я Элиза, цифровой ассистент LexFlow по приёму заявок. Я могу собрать первые сведения о вашем обращении и передать их в структурированный процесс приёма заявок фирмы. Чем могу помочь?',
      disclaimer: 'Элиза не даёт юридических консультаций и не заменяет адвоката.',
      chipsLabel: 'Предлагаемые темы',
      chips: { new: 'Новое дело', status: 'Статус дела', urgent: 'Срочно', pricing: 'Тарифы' },
      urgencyLabel: 'Насколько срочно?',
      urgency: { low: 'Низкая', medium: 'Средняя', high: 'Высокая', critical: 'Критическая' },
      intakeTitle: 'Опишите обращение',
      f_practice: 'Отрасль права',
      f_status: 'Статус дела',
      f_urgency: 'Срочность',
      f_message: 'Краткое описание (без конфиденциальных деталей)',
      ph_message: 'напр. проверка договора до 15 октября',
      send: 'Отправить заявку',
      sending: 'Отправляем…',
      thinking: 'Элиза печатает…',
      sent: 'Спасибо — ваша заявка передана в процесс приёма заявок фирмы. Команда свяжется с вами по указанным контактам.',
      fallback: 'Спасибо. Не удалось связаться со службой приёма заявок, поэтому ничего не отправлено. Вы можете продолжить в WhatsApp, и фирма ответит там.',
      error: 'Что-то пошло не так, заявка не отправлена. Попробуйте ещё раз или продолжите в WhatsApp.',
      wa: 'Продолжить в WhatsApp',
      escalate: 'Срочное дело? Позвоните в фирму напрямую.',
      privacy: 'Не отправляйте здесь конфиденциальные детали дела. Внутренние заметки фирмы никогда не показываются клиентам.',
      privacyLink: 'Политика конфиденциальности',
      p_new: 'Новое дело', p_status: 'Статус дела', p_urgent: 'Срочно',
      practice: { civil: 'Гражданское право', corporate: 'Корпоративное право', family: 'Семейное право', criminal: 'Уголовное право', realestate: 'Недвижимость', ip: 'Интеллектуальная собственность', immigration: 'Иммиграция', labour: 'Трудовое право', administrative: 'Административное право', other: 'Другое / не знаю' },
      statusOpt: { new: 'Новый запрос', review: 'На рассмотрении', existing: 'Существующее дело' }
    }
  };

  var WA_TEXT = {
    en: 'Hello, I would like to talk about a legal matter.',
    it: 'Buongiorno, vorrei parlare di una pratica legale.',
    ru: 'Здравствуйте, я хотел бы обсудить юридическое дело.'
  };

  function lang() {
    var l = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    return COPY[l] ? l : 'en';
  }
  function t() { return COPY[lang()]; }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- DOM refs ---------- */
  var widget, panel, launcher, log, input, sendBtn, chips, thinking;

  var isSending = false;
  var lastFocus = null;

  /* ---------- i18n sync (called by i18n.js after setLang, and on load) ---------- */
  function syncCopy() {
    if (!widget) return;
    var c = t();

    var ll = $('#elisaLauncherLabel');
    if (ll) ll.textContent = c.launcher;
    launcher.setAttribute('aria-label', c.launcher + ' — ' + c.role);
    panel.setAttribute('aria-label', c.log);
    log.setAttribute('aria-label', c.log);

    var nm = $('#elisaName'); if (nm) nm.textContent = c.name;
    var rl = $('#elisaRole'); if (rl) rl.textContent = c.role;
    var st = $('#elisaStatus'); if (st) st.textContent = c.status;

    var cl = $('#elisaCloseBtn'); if (cl) cl.setAttribute('aria-label', c.close);
    var mn = $('#elisaMinBtn'); if (mn) mn.setAttribute('aria-label', c.minimise);

    var ms = $('#elisaMinLabel'); if (ms) ms.textContent = c.wa;
    var wa = $('#elisaWa'); if (wa) wa.textContent = c.wa;
    var esc = $('#elisaEscalate'); if (esc) esc.textContent = c.escalate;

    var gr = $('#elisaGreeting'); if (gr) gr.textContent = c.greeting;
    var di = $('#elisaDisclaimer'); if (di) di.textContent = c.disclaimer;
    var pv = $('#elisaPrivacy'); if (pv) pv.textContent = c.privacy;
    var pl = $('#elisaPrivacyLink'); if (pl) pl.textContent = c.privacyLink;

    var cg = $('#elisaChipsLabel'); if (cg) cg.textContent = c.chipsLabel;
    $$('.elisa-chip').forEach(function (b) {
      var k = b.getAttribute('data-chip');
      if (k && c.chips[k]) b.textContent = c.chips[k];
    });

    var ul = $('#elisaUrgencyLabel'); if (ul) ul.textContent = c.urgencyLabel;
    $$('.elisa-urg').forEach(function (b) {
      var k = b.getAttribute('data-urg');
      if (k && c.urgency[k]) b.textContent = c.urgency[k];
    });

    var it_ = $('#elisaIntakeTitle'); if (it_) it_.textContent = c.intakeTitle;
    var l1 = $('#elisaL_practice'); if (l1) l1.textContent = c.f_practice;
    var l2 = $('#elisaL_status'); if (l2) l2.textContent = c.f_status;
    var l3 = $('#elisaL_urgency'); if (l3) l3.textContent = c.f_urgency;
    var l4 = $('#elisaL_message'); if (l4) l4.textContent = c.f_message;
    if (input) input.setAttribute('placeholder', c.ph_message);
    if (sendBtn && !isSending) sendBtn.textContent = c.send;

    /* Re-translate the option labels of the two selects */
    $$('#elisaPractice option').forEach(function (o) {
      var k = o.getAttribute('data-area');
      if (k && c.practice && c.practice[k]) o.textContent = c.practice[k];
    });
    $$('#elisaStatusSel option').forEach(function (o) {
      var k = o.getAttribute('data-st');
      if (k && c.statusOpt && c.statusOpt[k]) o.textContent = c.statusOpt[k];
    });
    $$('#elisaUrgency option').forEach(function (o) {
      var k = o.getAttribute('data-urg');
      if (k && c.urgency && c.urgency[k]) o.textContent = c.urgency[k];
    });
  }

  /* ---------- Conversation rendering ---------- */
  function scrollLog() { log.scrollTop = log.scrollHeight; }

  function addBubble(text, who) {
    var wrap = document.createElement('div');
    wrap.className = 'elisa-row' + (who === 'user' ? ' user' : '');
    if (who !== 'user') {
      var img = document.createElement('img');
      img.className = 'elisa-msg-avatar';
      img.src = AVATAR;
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      wrap.appendChild(img);
    }
    var b = document.createElement('div');
    b.className = 'elisa-bubble' + (who === 'user' ? ' user' : '') + (who === 'system' ? ' sys' : '');
    b.textContent = text;               /* textContent only — no HTML injection */
    wrap.appendChild(b);
    log.appendChild(wrap);
    scrollLog();
    return b;
  }

  function showThinking(on) {
    if (!thinking) return;
    thinking.hidden = !on;
    var lb = $('#elisaThinkingLabel');
    if (lb) lb.textContent = t().thinking;
  }

  /* ---------- Send ---------- */
  function collectPayload(message) {
    var practice = ($('#elisaPractice') || {}).value || '';
    var status = ($('#elisaStatusSel') || {}).value || '';
    var urgency = ($('#elisaUrgency') || {}).value || '';
    return {
      message: message || '',
      practice_area: practice,
      status: status,
      urgency: urgency,
      source: 'lexflow-website-elisa',
      lang: lang()
    };
  }

  function send(message, opts) {
    if (isSending) return;
    opts = opts || {};
    var text = (message || '').trim();
    if (!text) return;

    isSending = true;
    var c = t();
    if (opts.echo !== false) addBubble(text, 'user');
    if (input) input.value = '';
    if (sendBtn) { sendBtn.disabled = true; sendBtn.textContent = c.sending; }
    showThinking(true);

    fetch(BASE + '/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collectPayload(text))
    })
      .then(function (r) {
        if (!r.ok) throw new Error('http_' + r.status);
        return r.json();
      })
      .then(function (data) {
        var reply = (data && (data.reply || data.message)) || c.sent;
        addBubble(reply, 'assistant');
      })
      .catch(function () {
        /* Do not log request contents — may contain personal data. */
        addBubble(c.fallback, 'system');
      })
      .then(function () {
        showThinking(false);
        isSending = false;
        if (sendBtn) { sendBtn.disabled = false; sendBtn.textContent = t().send; }
      });
  }

  /* ---------- Open / close ---------- */
  function open() {
    lastFocus = document.activeElement;
    widget.classList.add('open');
    launcher.setAttribute('aria-expanded', 'true');
    var first = $('#elisaCloseBtn');
    if (first) first.focus();
  }
  function close() {
    widget.classList.remove('open');
    launcher.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---------- Focus trap ---------- */
  function trap(e) {
    if (e.key !== 'Tab' || !widget.classList.contains('open')) return;
    var f = $$('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])', panel)
      .filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- Init ---------- */
  var AVATAR = 'assets/elisa-avatar.png';

  function init() {
    widget = document.getElementById('elisaWidget');
    if (!widget) return;
    panel = $('#elisaPanel', widget);
    launcher = $('#elisaLauncher', widget);
    log = $('#elisaLog', widget);
    input = $('#elisaInput', widget);
    sendBtn = $('#elisaSend', widget);
    chips = $('#elisaChips', widget);
    thinking = $('#elisaThinking', widget);

    var av = $('#elisaAvatar', widget);
    if (av) AVATAR = av.getAttribute('src') || AVATAR;

    launcher.addEventListener('click', function () {
      widget.classList.contains('open') ? close() : open();
    });
    var cb = $('#elisaCloseBtn', widget);
    if (cb) cb.addEventListener('click', close);
    var mb = $('#elisaMinBtn', widget);
    if (mb) mb.addEventListener('click', close);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && widget.classList.contains('open')) close();
    });
    panel.addEventListener('keydown', trap);

    /* Chips prefill the composer (LP behaviour) and focus it */
    $$('.elisa-chip', widget).forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-chip');
        var val = (t().chips && t().chips[k]) || b.textContent;
        if (input) { input.value = val; input.focus(); }
      });
    });
    /* Urgency chips set the select */
    $$('.elisa-urg', widget).forEach(function (b) {
      b.addEventListener('click', function () {
        var sel = $('#elisaUrgency');
        if (sel) sel.value = b.getAttribute('data-urg');
        $$('.elisa-urg', widget).forEach(function (o) { o.classList.remove('is-active'); });
        b.classList.add('is-active');
      });
    });

    if (sendBtn) {
      sendBtn.addEventListener('click', function () {
        var txt = (input && input.value || '').trim();
        var urg = ($('#elisaUrgency') || {}).value || '';
        if (!txt) { send(urg ? 'Urgency: ' + urg : ''); return; }
        send(txt);
      });
    }
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (sendBtn) sendBtn.click(); }
      });
    }

    /* Swap WhatsApp hrefs to config number, incl. prefilled text */
    $$('.elisa-wa, #elisaEscalate', widget).forEach(function (a) {
      a.setAttribute('href', 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(WA_TEXT[lang()]));
    });

    window.LexFlowElisaSync = syncCopy;

    /* Re-run on language change (i18n.js sets documentElement.lang) */
    new MutationObserver(syncCopy).observe(document.documentElement, {
      attributes: true, attributeFilter: ['lang']
    });

    syncCopy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
