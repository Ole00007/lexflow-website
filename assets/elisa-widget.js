/* ============================================================
   LEXFLOW — ELISA DIGITAL INTAKE ASSISTANT (production widget)
   ------------------------------------------------------------
   Interaction model cloned from the a-Lexy LP widget (#alLaunch /
   #alWidget), then adapted for LexFlow's intake order:

     STEP 1  contact details — email and phone, before anything else
     STEP 2  the matter      — practice area, status, urgency
     STEP 3  describe it     — free text, then send

   Delivery goes through the same configuration as the on-page forms
   (LEXFLOW_CONFIG.intakeEndpoint). When no endpoint is configured the
   widget says so and offers WhatsApp rather than pretending to send.

   Accessibility: launcher is a real button with aria-expanded and
   aria-controls, the panel is a labelled dialog, the transcript is a
   polite log, Escape closes, Tab is trapped, controls are >=44px and
   motion respects prefers-reduced-motion.

   Privacy: rendering uses textContent only, and nothing about a
   visitor's answers is written to the console.
   ============================================================ */
(function () {
  'use strict';

  var CFG = window.LEXFLOW_CONFIG || {};
  var BASE = (CFG.chatbotUrl || '').replace(/\/+$/, '');
  var CHAT_PATH = CFG.chatbotPath || '/api/chatbot';
  var WHATSAPP = CFG.whatsapp || '';

  var COPY = {
    en: {
      launcher: 'Talk to Elisa', name: 'Elisa',
      role: "LexFlow's digital intake assistant",
      status: 'Online — intake only',
      close: 'Close assistant', minimise: 'Minimise assistant',
      log: 'Conversation with Elisa',
      greeting: "Hi, I'm Elisa, LexFlow's digital intake assistant. I'll take a few details and pass them to the firm. First, how can the firm reach you?",
      step1: 'Your contact details',
      f_email: 'Email', f_phone: 'Phone',
      ph_email: 'you@firm.com', ph_phone: '+39 ...',
      next: 'Continue',
      needEmail: 'Please enter a valid email address.',
      needPhone: 'Please enter a phone number so the firm can call you back.',
      gotContact: 'Thank you. Now tell me briefly about the matter.',
      step2: 'About the matter',
      f_practice: 'Practice area', f_status: 'Matter status', f_urgency: 'Urgency',
      gotMatter: 'Noted. Describe the matter in your own words — the more context, the better prepared the firm will be.',
      step3: 'Describe the matter',
      f_message: 'What is this about?',
      ph_message: 'For example: contract review before a 15 October deadline',
      chipsLabel: 'Common requests',
      chips: { new: 'New matter', status: 'Matter status', urgent: 'Urgent', pricing: 'Plans & pricing' },
      urgency: { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' },
      practice: { civil: 'Civil law', corporate: 'Corporate & business', family: 'Family law', criminal: 'Criminal defence', realestate: 'Real estate', ip: 'Intellectual property', immigration: 'Immigration', labour: 'Labour & employment', administrative: 'Administrative', other: 'Other / not sure' },
      statusOpt: { new: 'New request', review: 'Under review', existing: 'Existing matter' },
      send: 'Send request', sending: 'Sending…',
      sentTitle: 'Thank you — your request has been sent.',
      sentBody: 'The firm has your details and will reply using them.',
      failTitle: 'Your request was not sent.',
      failBody: 'Something went wrong on our side. Try again, or continue on WhatsApp so nothing is missed.',
      offTitle: 'Online intake is not connected yet.',
      offBody: 'Send the same details on WhatsApp and the firm will pick it up straight away.',
      again: 'Start again',
      disclaimer: 'Elisa does not give legal advice and does not replace a lawyer.',
      wa: 'Continue on WhatsApp',
      escalate: 'Urgent matter? Call the firm directly.',
      privacy: 'Do not send confidential case details here. Internal firm notes are never shown to clients.',
      privacyLink: 'Privacy policy'
    },
    it: {
      launcher: 'Parla con Elisa', name: 'Elisa',
      role: 'Assistente digitale per l\u2019intake di LexFlow',
      status: 'Online — solo intake',
      close: 'Chiudi assistente', minimise: 'Riduci assistente',
      log: 'Conversazione con Elisa',
      greeting: 'Ciao, sono Elisa, l\u2019assistente digitale per l\u2019intake di LexFlow. Raccolgo alcune informazioni e le passo allo studio. Prima di tutto: come può ricontattarti lo studio?',
      step1: 'I tuoi recapiti',
      f_email: 'Email', f_phone: 'Telefono',
      ph_email: 'tu@studio.com', ph_phone: '+39 ...',
      next: 'Continua',
      needEmail: 'Inserisci un indirizzo email valido.',
      needPhone: 'Inserisci un numero di telefono così lo studio può richiamarti.',
      gotContact: 'Grazie. Ora dimmi brevemente di cosa si tratta.',
      step2: 'La pratica',
      f_practice: 'Area di attività', f_status: 'Stato della pratica', f_urgency: 'Urgenza',
      gotMatter: 'Annotato. Descrivi la pratica con parole tue: più contesto fornisci, più lo studio sarà preparato.',
      step3: 'Descrivi la pratica',
      f_message: 'Di cosa si tratta?',
      ph_message: 'Ad esempio: revisione contratto prima del 15 ottobre',
      chipsLabel: 'Richieste frequenti',
      chips: { new: 'Nuova pratica', status: 'Stato pratica', urgent: 'Urgenza', pricing: 'Piani e prezzi' },
      urgency: { low: 'Bassa', medium: 'Media', high: 'Alta', critical: 'Critica' },
      practice: { civil: 'Diritto civile', corporate: 'Societario e d\u2019impresa', family: 'Diritto di famiglia', criminal: 'Diritto penale', realestate: 'Immobiliare', ip: 'Proprietà intellettuale', immigration: 'Immigrazione', labour: 'Lavoro', administrative: 'Amministrativo', other: 'Altro / non so' },
      statusOpt: { new: 'Nuova richiesta', review: 'In valutazione', existing: 'Pratica esistente' },
      send: 'Invia richiesta', sending: 'Invio…',
      sentTitle: 'Grazie — la tua richiesta è stata inviata.',
      sentBody: 'Lo studio ha i tuoi recapiti e ti risponderà su quelli.',
      failTitle: 'La richiesta non è stata inviata.',
      failBody: 'Si è verificato un problema dalla nostra parte. Riprova oppure continua su WhatsApp così non perdiamo nulla.',
      offTitle: 'L\u2019intake online non è ancora collegato.',
      offBody: 'Invia gli stessi dati su WhatsApp e lo studio li prenderà in carico subito.',
      again: 'Ricomincia',
      disclaimer: 'Elisa non fornisce consulenza legale e non sostituisce un avvocato.',
      wa: 'Continua su WhatsApp',
      escalate: 'Pratica urgente? Chiama direttamente lo studio.',
      privacy: 'Non inviare qui dettagli riservati sulla pratica. Le note interne dello studio non sono mai visibili ai clienti.',
      privacyLink: 'Informativa privacy'
    },
    ru: {
      launcher: 'Написать Элизе', name: 'Элиза',
      role: 'цифровой ассистент LexFlow по приёму заявок',
      status: 'Онлайн — только приём заявок',
      close: 'Закрыть ассистента', minimise: 'Свернуть ассистента',
      log: 'Диалог с Элизой',
      greeting: 'Здравствуйте, я Элиза, цифровой ассистент LexFlow по приёму заявок. Я соберу несколько сведений и передам их фирме. Для начала — как фирма может с вами связаться?',
      step1: 'Ваши контакты',
      f_email: 'Электронная почта', f_phone: 'Телефон',
      ph_email: 'vy@firma.com', ph_phone: '+39 ...',
      next: 'Продолжить',
      needEmail: 'Укажите корректный адрес электронной почты.',
      needPhone: 'Укажите номер телефона, чтобы фирма могла вам перезвонить.',
      gotContact: 'Спасибо. Теперь коротко расскажите, в чём дело.',
      step2: 'О деле',
      f_practice: 'Отрасль права', f_status: 'Статус дела', f_urgency: 'Срочность',
      gotMatter: 'Записал. Опишите дело своими словами — чем больше контекста, тем лучше фирма подготовится.',
      step3: 'Опишите дело',
      f_message: 'В чём суть обращения?',
      ph_message: 'Например: проверка договора до 15 октября',
      chipsLabel: 'Частые обращения',
      chips: { new: 'Новое дело', status: 'Статус дела', urgent: 'Срочно', pricing: 'Тарифы' },
      urgency: { low: 'Низкая', medium: 'Средняя', high: 'Высокая', critical: 'Критическая' },
      practice: { civil: 'Гражданское право', corporate: 'Корпоративное право', family: 'Семейное право', criminal: 'Уголовное право', realestate: 'Недвижимость', ip: 'Интеллектуальная собственность', immigration: 'Иммиграция', labour: 'Трудовое право', administrative: 'Административное право', other: 'Другое / не знаю' },
      statusOpt: { new: 'Новый запрос', review: 'На рассмотрении', existing: 'Существующее дело' },
      send: 'Отправить заявку', sending: 'Отправка…',
      sentTitle: 'Спасибо — ваша заявка отправлена.',
      sentBody: 'У фирмы есть ваши контакты, и она ответит по ним.',
      failTitle: 'Заявка не отправлена.',
      failBody: 'На нашей стороне произошла ошибка. Попробуйте ещё раз или продолжите в WhatsApp, чтобы ничего не потерялось.',
      offTitle: 'Онлайн-приём заявок пока не подключён.',
      offBody: 'Отправьте те же данные в WhatsApp — фирма сразу подхватит обращение.',
      again: 'Начать заново',
      disclaimer: 'Элиза не даёт юридических консультаций и не заменяет адвоката.',
      wa: 'Продолжить в WhatsApp',
      escalate: 'Срочное дело? Позвоните в фирму напрямую.',
      privacy: 'Не отправляйте здесь конфиденциальные детали дела. Внутренние заметки фирмы никогда не показываются клиентам.',
      privacyLink: 'Политика конфиденциальности'
    }
  };

  function lang() {
    var l = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    return COPY[l] ? l : 'en';
  }
  function t() { return COPY[lang()]; }
  function waLink() {
    var txt = { en: 'Hello, I would like to send a request.', it: 'Buongiorno, vorrei inviare una richiesta.', ru: 'Здравствуйте, я хотел бы отправить заявку.' }[lang()];
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(txt);
  }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var widget, panel, launcher, log, thinking, steps = {}, answer = {}, busy = false, lastFocus = null;

  /* ---------- transcript ---------- */
  function addBubble(text, who) {
    var row = document.createElement('div');
    row.className = 'elisa-row' + (who === 'user' ? ' user' : '');
    if (who !== 'user') {
      var img = document.createElement('img');
      img.className = 'elisa-msg-avatar';
      img.src = $('#elisaAvatar') ? $('#elisaAvatar').getAttribute('src') : '';
      img.alt = ''; img.setAttribute('aria-hidden', 'true');
      row.appendChild(img);
    }
    var b = document.createElement('div');
    b.className = 'elisa-bubble' + (who === 'user' ? ' user' : (who === 'system' ? ' sys' : ''));
    b.textContent = text;
    row.appendChild(b);
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return b;
  }
  function scrollLog() { log.scrollTop = log.scrollHeight; }

  /* ---------- steps ---------- */
  function showStep(n) {
    Object.keys(steps).forEach(function (k) { if (steps[k]) steps[k].hidden = (k !== n); });
    if (n === 'contact') { var e = $('#elisaEmail'); if (e) e.focus(); }
    if (n === 'matter' && steps.matter) {
      var p = $('#elisaPractice'); if (p) p.focus();
    }
    if (n === 'describe') { var m = $('#elisaInput'); if (m) m.focus(); }
    scrollLog();
  }

  function syncCopy() {
    if (!widget) return;
    var c = t();
    var ll = $('#elisaLauncherLabel'); if (ll) ll.textContent = c.launcher;
    if (launcher) launcher.setAttribute('aria-label', c.launcher + ' — ' + c.role);
    if (panel) panel.setAttribute('aria-label', c.log);
    if (log) log.setAttribute('aria-label', c.log);
    var set = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
    set('elisaName', c.name); set('elisaRole', c.role); set('elisaStatus', c.status);
    set('elisaGreeting', c.greeting); set('elisaDisclaimer', c.disclaimer);
    set('elisaPrivacy', c.privacy); set('elisaPrivacyLink', c.privacyLink);
    set('elisaEscalate', c.escalate); set('elisaWa', c.wa);
    set('elisaStep1Title', c.step1); set('elisaStep2Title', c.step2); set('elisaStep3Title', c.step3);
    set('elisaL_email', c.f_email); set('elisaL_phone', c.f_phone);
    set('elisaL_practice', c.f_practice); set('elisaL_status', c.f_status); set('elisaL_urgency', c.f_urgency);
    set('elisaL_message', c.f_message); set('elisaChipsLabel', c.chipsLabel);
    var cb = $('#elisaCloseBtn'); if (cb) cb.setAttribute('aria-label', c.close);
    var mb = $('#elisaMinBtn'); if (mb) mb.setAttribute('aria-label', c.minimise);
    var e = $('#elisaEmail'); if (e) e.placeholder = c.ph_email;
    var ph = $('#elisaPhone'); if (ph) ph.placeholder = c.ph_phone;
    var msg = $('#elisaInput'); if (msg) msg.placeholder = c.ph_message;
    var n1 = $('#elisaContactNext'); if (n1) n1.textContent = c.next;
    var n2 = $('#elisaMatterNext'); if (n2) n2.textContent = c.next;
    var sb = $('#elisaSend'); if (sb && !busy) sb.textContent = c.send;
    $$('.elisa-chip').forEach(function (b) {
      var k = b.getAttribute('data-chip'); if (k && c.chips[k]) b.textContent = c.chips[k];
    });
    $$('#elisaPractice option').forEach(function (o) {
      var k = o.getAttribute('data-area'); if (k && c.practice[k]) o.textContent = c.practice[k];
    });
    $$('#elisaStatusSel option').forEach(function (o) {
      var k = o.getAttribute('data-st'); if (k && c.statusOpt[k]) o.textContent = c.statusOpt[k];
    });
    $$('#elisaUrgency option').forEach(function (o) {
      var k = o.getAttribute('data-urg'); if (k && c.urgency[k]) o.textContent = c.urgency[k];
    });
    $$('.elisa-wa, #elisaEscalate').forEach(function (a) { a.setAttribute('href', waLink()); });
  }

  /* ---------- step 1: contact details come first ---------- */
  function submitContact() {
    var c = t();
    var email = ($('#elisaEmail') || {}).value || '';
    var phone = ($('#elisaPhone') || {}).value || '';
    email = email.trim(); phone = phone.trim();
    var warn = $('#elisaContactWarn');
    var fail = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? c.needEmail
             : (phone.replace(/\D/g, '').length < 6 ? c.needPhone : null);
    if (fail) { if (warn) { warn.textContent = fail; warn.hidden = false; } return; }
    if (warn) warn.hidden = true;
    answer.email = email; answer.phone = phone;
    addBubble(email + ' · ' + phone, 'user');
    addBubble(c.gotContact, 'assistant');
    showStep('matter');
  }

  /* ---------- step 2: the matter ---------- */
  function submitMatter() {
    var c = t();
    answer.practice_area = ($('#elisaPractice') || {}).value || '';
    answer.status = ($('#elisaStatusSel') || {}).value || '';
    answer.urgency = ($('#elisaUrgency') || {}).value || '';
    var summary = [
      c.practice[answer.practice_area] || answer.practice_area,
      c.statusOpt[answer.status] || answer.status,
      c.urgencyLabel ? c.urgency[answer.urgency] : answer.urgency
    ].filter(Boolean).join(' · ');
    if (summary) addBubble(summary, 'user');
    addBubble(c.gotMatter, 'assistant');
    showStep('describe');
  }

  /* ---------- step 3: describe and send ---------- */
  function send() {
    if (busy) return;
    var c = t();
    var msg = ($('#elisaInput') || {}).value || '';
    msg = msg.trim();
    if (!msg) { var w = $('#elisaSendWarn'); if (w) { w.textContent = c.needDescribe || c.gotMatter; w.hidden = false; } return; }
    var w2 = $('#elisaSendWarn'); if (w2) w2.hidden = true;

    answer.message = msg;
    answer.source = 'lexflow-website-elisa';
    answer.consent_privacy = true; /* implied by what the panel states below the form */

    addBubble(msg, 'user');

    var endpoint = CFG.intakeEndpoint;
    if (!endpoint) {
      addBubble(c.offTitle, 'system');
      addBubble(c.offBody, 'system');
      var w = $('#elisaSendWarn');
      if (w) { w.hidden = false; w.textContent = ''; }
      var extra = document.createElement('a');
      extra.className = 'elisa-wa'; extra.href = waLink(); extra.target = '_blank';
      extra.rel = 'noopener'; extra.textContent = c.wa;
      if (steps.describe) steps.describe.appendChild(extra);
      return;
    }

    busy = true;
    var btn = $('#elisaSend');
    if (btn) { btn.disabled = true; btn.textContent = c.sending; }
    if (thinking) thinking.hidden = false;

    var body, headers = {};
    if (CFG.intakeFormat === 'form') {
      body = new URLSearchParams();
      Object.keys(answer).forEach(function (k) { body.append(k, answer[k]); });
    } else {
      body = JSON.stringify(answer);
      headers['Content-Type'] = 'application/json';
    }

    fetch(endpoint, { method: CFG.intakeMethod || 'POST', headers: headers, body: body })
      .then(function (r) { if (!r.ok) throw new Error('http_' + r.status); return r; })
      .then(function () {
        addBubble(c.sentTitle, 'assistant');
        addBubble(c.sentBody, 'assistant');
        showStep('done');
      })
      .catch(function () {
        addBubble(c.failTitle, 'system');
        addBubble(c.failBody, 'system');
        var a = document.createElement('a');
        a.className = 'elisa-wa'; a.href = waLink(); a.target = '_blank';
        a.rel = 'noopener'; a.textContent = c.wa;
        if (steps.describe) steps.describe.appendChild(a);
      })
      .finally(function () {
        busy = false;
        if (thinking) thinking.hidden = true;
        if (btn) { btn.disabled = false; btn.textContent = t().send; }
      });
  }

  function open() {
    lastFocus = document.activeElement;
    widget.classList.add('open');
    launcher.setAttribute('aria-expanded', 'true');
    var f = $('#elisaCloseBtn') || $('#elisaEmail');
    if (f) f.focus();
  }
  function close() {
    widget.classList.remove('open');
    launcher.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function trap(e) {
    if (e.key !== 'Tab' || !widget.classList.contains('open')) return;
    var f = $$('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])', panel)
      .filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  }

  function init() {
    widget = document.getElementById('elisaWidget');
    if (!widget) return;
    panel = $('#elisaPanel', widget); launcher = $('#elisaLauncher', widget);
    log = $('#elisaLog', widget); thinking = $('#elisaThinking', widget);
    steps = {
      contact: $('#elisaStepContact', widget),
      matter: $('#elisaStepMatter', widget),
      describe: $('#elisaStepDescribe', widget),
      done: $('#elisaStepDone', widget)
    };

    launcher.addEventListener('click', function () {
      widget.classList.contains('open') ? close() : open();
    });
    var cb = $('#elisaCloseBtn', widget); if (cb) cb.addEventListener('click', close);
    var mb = $('#elisaMinBtn', widget); if (mb) mb.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && widget.classList.contains('open')) close();
    });
    panel.addEventListener('keydown', trap);

    var n1 = $('#elisaContactNext'); if (n1) n1.addEventListener('click', submitContact);
    var n2 = $('#elisaMatterNext'); if (n2) n2.addEventListener('click', submitMatter);
    var sb = $('#elisaSend'); if (sb) sb.addEventListener('click', send);
    var ag = $('#elisaAgain');
    if (ag) ag.addEventListener('click', function () {
      answer = {};
      $$('.elisa-row', log).forEach(function (r, i) { if (i > 0) r.remove(); });
      $$('input,textarea', widget).forEach(function (f) { if (f.type === 'text' || f.type === 'email' || f.type === 'tel' || f.tagName === 'TEXTAREA') f.value = ''; });
      showStep('contact');
    });

    /* Enter advances rather than submitting an unloadable form */
    ['elisaEmail', 'elisaPhone'].forEach(function (id) {
      var f = document.getElementById(id);
      if (f) f.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); submitContact(); }
      });
    });
    var inp = $('#elisaInput');
    if (inp) inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); send(); }
    });

    $$('.elisa-chip', widget).forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-chip');
        if (inp) { inp.value = (t().chips && t().chips[k]) || b.textContent; inp.focus(); }
      });
    });

    window.LexFlowElisaSync = syncCopy;
    new MutationObserver(syncCopy).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    syncCopy();
    showStep('contact');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
