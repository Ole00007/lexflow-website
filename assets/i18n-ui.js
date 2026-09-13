/* ============================================================
   LEXFLOW — SHARED UI STRINGS (EN / IT / RU)
   ------------------------------------------------------------
   Strings that appear on several pages but were missing from the
   per-page dictionaries, so they stayed English when a visitor
   switched language:

     - the footer Privacy / Terms links
     - the cookie consent banner
     - the "more questions?" contact heading

   Load order on every page:

       <script>window.I18N = { en:{...}, it:{...}, ru:{...} }</script>
       <script src="assets/site-config.js"></script>
       <script src="assets/glossary.js"></script>
       <script src="assets/i18n-faq.js"></script>
       <script src="assets/i18n-ui.js"></script>   <-- merges here
       <script src="assets/i18n.js"></script>

   Merged after the page dictionary, so these values win where a page
   is missing a key. Keys already present and correct are overwritten
   with the same wording.
   ============================================================ */
(function () {
  'use strict';

  var UI = {
    en: {
      footer_privacy: 'Privacy',
      footer_terms: 'Terms',
      cookie_text: 'We use local storage only for your language and theme preferences. No advertising trackers. Read our Privacy Policy.',
      cookie_accept: 'Accept',
      cookie_decline: 'Decline',
      contact_title: 'More questions, or need more detail? Write to us.',
      compliance_small: 'Certification status: ISO/IEC 27001 and ISO/IEC 27701 certification is in progress, not yet held. SOC 2 is an auditing framework we align our practices with. These are reference points for how we build, not claims of completed certification.',
      req_label: 'Contact',
      req_title: 'Let\u2019s discuss your firm\u2019s workflow.',
      req_lede: 'Message us on WhatsApp for a fast reply, or send a request. We will respond using the details you provide.',
      req_name: 'Name',
      req_email: 'Email',
      req_message: 'Message',
      req_consent_privacy: 'I consent to processing my contact details to receive a response to my request, under the Privacy Policy.',
      req_consent_marketing: 'I optionally agree to receive marketing communications by email or WhatsApp. I can withdraw consent at any time.',
      req_send: 'Send request',
      req_note: 'We use your details only to answer this request. Internal firm notes are never shared.',
      ctrl_theme: 'Toggle dark or light theme',
      ctrl_lang: 'Change language',
      aria_dashboard: 'Open dashboard preview',
      aria_cookie: 'Cookie consent',
      aria_wa: 'Chat on WhatsApp'
    },
    it: {
      footer_privacy: 'Privacy',
      footer_terms: 'Termini',
      cookie_text: 'Usiamo la memoria locale del browser solo per le tue preferenze di lingua e tema. Nessun tracciamento pubblicitario. Leggi la nostra Informativa Privacy.',
      cookie_accept: 'Accetta',
      cookie_decline: 'Rifiuta',
      contact_title: 'Hai altre domande o hai bisogno di informazioni pi\u00f9 dettagliate? Scrivici.',
      compliance_small: 'Stato delle certificazioni: le certificazioni ISO/IEC 27001 e ISO/IEC 27701 sono in corso, non ancora conseguite. SOC 2 \u00e8 un framework di audit rispetto al quale allineiamo le nostre pratiche. Sono punti di riferimento per come costruiamo, non dichiarazioni di certificazione conseguita.',
      req_label: 'Contatti',
      req_title: 'Parliamo del flusso di lavoro del tuo studio.',
      req_lede: 'Scrivici su WhatsApp per una risposta rapida, oppure inviaci una richiesta. Ti risponderemo usando i recapiti forniti.',
      req_name: 'Nome',
      req_email: 'Email',
      req_message: 'Messaggio',
      req_consent_privacy: 'Acconsento al trattamento dei miei dati di contatto per ricevere una risposta alla mia richiesta, secondo l\u2019Informativa Privacy.',
      req_consent_marketing: 'Acconsento facoltativamente a ricevere comunicazioni marketing via email o WhatsApp. Posso revocare il consenso in qualsiasi momento.',
      req_send: 'Invia richiesta',
      req_note: 'Usiamo i tuoi recapiti solo per rispondere a questa richiesta. Le note interne dello studio non vengono mai condivise.',
      ctrl_theme: 'Cambia tema chiaro o scuro',
      ctrl_lang: 'Cambia lingua',
      aria_dashboard: 'Apri l’anteprima della dashboard',
      aria_cookie: 'Consenso ai cookie',
      aria_wa: 'Scrivi su WhatsApp'
    },
    ru: {
      footer_privacy: '\u041a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u044c',
      footer_terms: '\u0423\u0441\u043b\u043e\u0432\u0438\u044f',
      cookie_text: '\u041c\u044b \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c \u043b\u043e\u043a\u0430\u043b\u044c\u043d\u043e\u0435 \u0445\u0440\u0430\u043d\u0438\u043b\u0438\u0449\u0435 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430 \u0442\u043e\u043b\u044c\u043a\u043e \u0434\u043b\u044f \u0432\u0430\u0448\u0438\u0445 \u043d\u0430\u0441\u0442\u0440\u043e\u0435\u043a \u044f\u0437\u044b\u043a\u0430 \u0438 \u0442\u0435\u043c\u044b. \u0420\u0435\u043a\u043b\u0430\u043c\u043d\u044b\u0445 \u0442\u0440\u0435\u043a\u0435\u0440\u043e\u0432 \u043d\u0435\u0442. \u0427\u0438\u0442\u0430\u0439\u0442\u0435 \u041f\u043e\u043b\u0438\u0442\u0438\u043a\u0443 \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438.',
      cookie_accept: '\u041f\u0440\u0438\u043d\u044f\u0442\u044c',
      cookie_decline: '\u041e\u0442\u043a\u043b\u043e\u043d\u0438\u0442\u044c',
      contact_title: '\u041e\u0441\u0442\u0430\u043b\u0438\u0441\u044c \u0432\u043e\u043f\u0440\u043e\u0441\u044b \u0438\u043b\u0438 \u043d\u0443\u0436\u043d\u0430 \u0431\u043e\u043b\u0435\u0435 \u043f\u043e\u0434\u0440\u043e\u0431\u043d\u0430\u044f \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f? \u041d\u0430\u043f\u0438\u0448\u0438\u0442\u0435 \u043d\u0430\u043c.',
      compliance_small: '\u0421\u0442\u0430\u0442\u0443\u0441 \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u0438: \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u044f ISO/IEC 27001 \u0438 ISO/IEC 27701 \u0432 \u043f\u0440\u043e\u0446\u0435\u0441\u0441\u0435, \u043d\u043e \u043f\u043e\u043a\u0430 \u043d\u0435 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0430. SOC 2 \u2014 \u044d\u0442\u043e \u0430\u0443\u0434\u0438\u0442\u043e\u0440\u0441\u043a\u0438\u0439 \u0444\u0440\u0435\u0439\u043c\u0432\u043e\u0440\u043a, \u0441 \u043a\u043e\u0442\u043e\u0440\u044b\u043c \u043c\u044b \u0441\u043e\u043e\u0442\u043d\u043e\u0441\u0438\u043c \u043d\u0430\u0448\u0438 \u043f\u0440\u0430\u043a\u0442\u0438\u043a\u0438.',
      req_label: '\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b',
      req_title: '\u041e\u0431\u0441\u0443\u0434\u0438\u043c \u0440\u0430\u0431\u043e\u0447\u0438\u0439 \u043f\u0440\u043e\u0446\u0435\u0441\u0441 \u0432\u0430\u0448\u0435\u0439 \u0444\u0438\u0440\u043c\u044b.',
      req_lede: '\u041d\u0430\u043f\u0438\u0448\u0438\u0442\u0435 \u043d\u0430\u043c \u0432 WhatsApp \u0434\u043b\u044f \u0431\u044b\u0441\u0442\u0440\u043e\u0433\u043e \u043e\u0442\u0432\u0435\u0442\u0430 \u0438\u043b\u0438 \u043e\u0442\u043f\u0440\u0430\u0432\u044c\u0442\u0435 \u0437\u0430\u044f\u0432\u043a\u0443. \u041c\u044b \u043e\u0442\u0432\u0435\u0442\u0438\u043c \u043f\u043e \u0443\u043a\u0430\u0437\u0430\u043d\u043d\u044b\u043c \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u0430\u043c.',
      req_name: '\u0418\u043c\u044f',
      req_email: '\u042d\u043b\u0435\u043a\u0442\u0440\u043e\u043d\u043d\u0430\u044f \u043f\u043e\u0447\u0442\u0430',
      req_message: '\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435',
      req_consent_privacy: '\u042f \u0441\u043e\u0433\u043b\u0430\u0441\u0435\u043d \u043d\u0430 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0443 \u043c\u043e\u0438\u0445 \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u043d\u044b\u0445 \u0434\u0430\u043d\u043d\u044b\u0445 \u0434\u043b\u044f \u043e\u0442\u0432\u0435\u0442\u0430 \u043d\u0430 \u0437\u0430\u044f\u0432\u043a\u0443, \u0441\u043e\u0433\u043b\u0430\u0441\u043d\u043e \u041f\u043e\u043b\u0438\u0442\u0438\u043a\u0435 \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438.',
      req_consent_marketing: '\u042f \u0434\u043e\u0431\u0440\u043e\u0432\u043e\u043b\u044c\u043d\u043e \u0441\u043e\u0433\u043b\u0430\u0448\u0430\u044e\u0441\u044c \u043f\u043e\u043b\u0443\u0447\u0430\u0442\u044c \u043c\u0430\u0440\u043a\u0435\u0442\u0438\u043d\u0433\u043e\u0432\u044b\u0435 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u044f \u043f\u043e \u043f\u043e\u0447\u0442\u0435 \u0438\u043b\u0438 \u0432 WhatsApp. \u0421\u043e\u0433\u043b\u0430\u0441\u0438\u0435 \u043c\u043e\u0436\u043d\u043e \u043e\u0442\u043e\u0437\u0432\u0430\u0442\u044c \u0432 \u043b\u044e\u0431\u043e\u0439 \u043c\u043e\u043c\u0435\u043d\u0442.',
      req_send: '\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443',
      req_note: '\u041c\u044b \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c \u0432\u0430\u0448\u0438 \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u044b \u0442\u043e\u043b\u044c\u043a\u043e \u0434\u043b\u044f \u043e\u0442\u0432\u0435\u0442\u0430 \u043d\u0430 \u044d\u0442\u0443 \u0437\u0430\u044f\u0432\u043a\u0443. \u0412\u043d\u0443\u0442\u0440\u0435\u043d\u043d\u0438\u0435 \u0437\u0430\u043c\u0435\u0442\u043a\u0438 \u0444\u0438\u0440\u043c\u044b \u043d\u0435 \u043f\u0435\u0440\u0435\u0434\u0430\u044e\u0442\u0441\u044f.',
      ctrl_theme: '\u041f\u0435\u0440\u0435\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0442\u0451\u043c\u043d\u0443\u044e \u0438\u043b\u0438 \u0441\u0432\u0435\u0442\u043b\u0443\u044e \u0442\u0435\u043c\u0443',
      ctrl_lang: '\u0421\u043c\u0435\u043d\u0438\u0442\u044c \u044f\u0437\u044b\u043a',
      aria_dashboard: '\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043f\u0440\u0435\u0434\u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u043f\u0430\u043d\u0435\u043b\u0438',
      aria_cookie: '\u0421\u043e\u0433\u043b\u0430\u0441\u0438\u0435 \u043d\u0430 cookie',
      aria_wa: '\u041d\u0430\u043f\u0438\u0441\u0430\u0442\u044c \u0432 WhatsApp'
    }
  };

  var T = window.I18N = window.I18N || {};
  Object.keys(UI).forEach(function (lang) {
    T[lang] = T[lang] || {};
    var src = UI[lang];
    Object.keys(src).forEach(function (k) { T[lang][k] = src[k]; });
  });
})();
