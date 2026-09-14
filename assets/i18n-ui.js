/* ============================================================
   LEXFLOW — SHARED UI STRINGS (EN / IT / RU)
   ------------------------------------------------------------
   Strings used on several pages, or appearing in markup that sits
   outside the per-page dictionaries. Keeping them here means one
   place to edit and guaranteed three-language parity.

   Covers: footer legal links, cookie consent banner, the "more
   questions?" heading, the visitor request form, the theme/language
   control labels, compliance and roadmap badges, eyebrow labels,
   image alt text and the FAQ glossary filter.

   Load order on every page:

       <script>window.I18N = { en:{...}, it:{...}, ru:{...} }</script>
       <script src="assets/site-config.js"></script>
       <script src="assets/glossary.js"></script>
       <script src="assets/i18n-faq.js"></script>
       <script src="assets/i18n-ui.js"></script>   <-- merges here
       <script src="assets/i18n.js"></script>

   Merged after the page dictionary, so these values win where a page
   is missing a key.

   Note on badges: these describe standards we work towards. They are
   not claims of completed certification.
   ============================================================ */
(function () {
  'use strict';

  var UI = {
    en: {
      /* footer + consent + contact */
      footer_privacy: 'Privacy',
      footer_terms: 'Terms',
      footer_cookie: 'Cookie settings',
      footer_cookie_policy: 'Cookie Policy',
      cookie_text: 'We use local storage only for your language and theme preferences. No advertising trackers. Read our Privacy Policy.',
      cookie_accept: 'Accept',
      cookie_decline: 'Decline',
      contact_title: 'More questions, or need more detail? Get in touch.',
      ctrl_theme: 'Toggle dark or light theme',
      ctrl_lang: 'Change language',
      aria_dashboard: 'Open dashboard preview',
      aria_cookie: 'Cookie consent',
      aria_wa: 'Chat on WhatsApp',

      /* visitor request form */
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

      /* compliance + roadmap badges */
      compliance_small: 'Certification status: ISO/IEC 27001 and ISO/IEC 27701 certification is in progress, not yet held. SOC 2 is an auditing framework we align our practices with. These are reference points for how we build, not claims of completed certification.',
      badge_gdpr: 'Handled under EU GDPR requirements',
      badge_iso27001: 'Working towards ISO/IEC 27001',
      badge_iso27701: 'Working towards ISO/IEC 27701',
      roadmap_cloud: 'Cloud storage \u00b7 or your local server',
      roadmap_notifs: 'Automatic email and messenger notifications',
      roadmap_db: 'PostgreSQL secure database',
      roadmap_calendar: 'Legal calendaring',
      roadmap_soon: 'Coming soon: time and expense tracking \u00b7 payments',
      tbl_billed: 'Billed annually',
      tbl_custom_quote: 'Custom quote',
      tbl_contact_sales: 'Contact sales',
      tbl_public_listed: 'Publicly listed, billed annually',
      tbl_contact_vendor: 'Contact vendor',
      tbl_vincent_note: 'No published pricing; third-party reviews cite ~$399/mo for comparable tiers',
      price_popular: 'Popular',

      /* eyebrow labels */
      eyebrow_active_matters: 'Active Matters',
      eyebrow_transparent: 'Transparent Plans',
      eyebrow_journey: 'The Client Journey',
      eyebrow_practice: 'Practice Areas',

      /* feature tags */
      idx_tag1: 'Automatic notifications synced to the calendar',
      idx_tag2: 'Priority visible at a glance',
      idx_tag3: 'The whole team updated in real time',
      faq_tag_kanban: 'Kanban board for every matter',
      faq_tag_calendar: 'Notifications synced to the calendar',

      /* glossary filter */
      gloss_filter_ph: 'Type a term, for example migration or token',
      gloss_empty_msg: 'No term matches that. Try a shorter word.',

      /* image alt text */
      alt_studio_interni: 'Law firm interior',
      alt_studio_ingresso: 'Law firm entrance',
      alt_sala_riunioni: 'Meeting room',
      alt_bilancia: 'Scales of justice',
      alt_kanban_board: 'LexFlow matter board showing matters grouped by stage',
      alt_team: 'Law firm team working together'
    },

    it: {
      footer_privacy: 'Privacy',
      footer_terms: 'Termini',
      footer_cookie: 'Impostazioni cookie',
      footer_cookie_policy: 'Cookie Policy',
      cookie_text: 'Usiamo la memoria locale del browser solo per le tue preferenze di lingua e tema. Nessun tracciamento pubblicitario. Leggi la nostra Informativa Privacy.',
      cookie_accept: 'Accetta',
      cookie_decline: 'Rifiuta',
      contact_title: 'Hai altre domande o hai bisogno di informazioni pi\u00f9 dettagliate? Scrivici.',
      ctrl_theme: 'Cambia tema chiaro o scuro',
      ctrl_lang: 'Cambia lingua',
      aria_dashboard: 'Apri l\u2019anteprima della dashboard',
      aria_cookie: 'Consenso ai cookie',
      aria_wa: 'Scrivi su WhatsApp',

      req_label: 'Contatti',
      req_title: 'Parliamo del flusso di lavoro del tuo studio.',
      req_lede: 'Scrivici su WhatsApp per una risposta rapida, oppure invia una richiesta. Ti risponderemo usando i recapiti che fornisci.',
      req_name: 'Nome',
      req_email: 'Email',
      req_message: 'Messaggio',
      req_consent_privacy: 'Acconsento al trattamento dei miei dati di contatto per ricevere una risposta alla mia richiesta, secondo l\u2019Informativa Privacy.',
      req_consent_marketing: 'Acconsento facoltativamente a ricevere comunicazioni marketing via email o WhatsApp. Posso revocare il consenso in qualsiasi momento.',
      req_send: 'Invia richiesta',
      req_note: 'Usiamo i tuoi dati solo per rispondere a questa richiesta. Le note interne dello studio non vengono mai condivise.',

      compliance_small: 'Stato delle certificazioni: le certificazioni ISO/IEC 27001 e ISO/IEC 27701 sono in corso, non ancora conseguite. SOC 2 \u00e8 un framework di audit rispetto al quale allineiamo le nostre pratiche. Sono punti di riferimento per come costruiamo, non dichiarazioni di certificazione conseguita.',
      badge_gdpr: 'Gestito secondo i requisiti del GDPR UE',
      badge_iso27001: 'In corso verso ISO/IEC 27001',
      badge_iso27701: 'In corso verso ISO/IEC 27701',
      roadmap_cloud: 'Archiviazione cloud \u00b7 o il tuo server locale',
      roadmap_notifs: 'Notifiche email e messenger automatiche',
      roadmap_db: 'Database sicuro PostgreSQL',
      roadmap_calendar: 'Calendario legale',
      roadmap_soon: 'Prossimamente: gestione di tempi e spese \u00b7 Pagamenti',
      tbl_billed: 'Fatturato annualmente',
      tbl_custom_quote: 'Preventivo personalizzato',
      tbl_contact_sales: 'Contatta le vendite',
      tbl_public_listed: 'Tariffa pubblica, fatturata annualmente',
      tbl_contact_vendor: 'Contatta il fornitore',
      tbl_vincent_note: 'Prezzo non pubblicato; recensioni di terze parti indicano circa $399/mese per livelli comparabili',
      price_popular: 'Popolare',

      eyebrow_active_matters: 'Pratiche attive',
      eyebrow_transparent: 'Piani trasparenti',
      eyebrow_journey: 'Il percorso del cliente',
      eyebrow_practice: 'Aree di attivit\u00e0',

      idx_tag1: 'Notifiche automatiche sincronizzate al calendario',
      idx_tag2: 'Priorit\u00e0 visiva a colpo d\u2019occhio',
      idx_tag3: 'Tutto il team aggiornato in tempo reale',
      faq_tag_kanban: 'Board Kanban per ogni pratica',
      faq_tag_calendar: 'Notifiche sincronizzate al calendario',

      gloss_filter_ph: 'Scrivi un termine, ad esempio migrazione o token',
      gloss_empty_msg: 'Nessun termine corrisponde. Prova con una parola pi\u00f9 breve.',

      alt_studio_interni: 'Interni dello studio legale',
      alt_studio_ingresso: 'Ingresso dello studio legale',
      alt_sala_riunioni: 'Sala riunioni',
      alt_bilancia: 'Bilancia della giustizia',
      alt_kanban_board: 'Board delle pratiche LexFlow raggruppate per fase',
      alt_team: 'Team dello studio legale al lavoro'
    },

    ru: {
      footer_privacy: '\u041a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u044c',
      footer_terms: '\u0423\u0441\u043b\u043e\u0432\u0438\u044f',
      footer_cookie: '\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 cookie',
      footer_cookie_policy: '\u041f\u043e\u043b\u0438\u0442\u0438\u043a\u0430 cookie',
      cookie_text: '\u041c\u044b \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c \u043b\u043e\u043a\u0430\u043b\u044c\u043d\u043e\u0435 \u0445\u0440\u0430\u043d\u0438\u043b\u0438\u0449\u0435 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430 \u0442\u043e\u043b\u044c\u043a\u043e \u0434\u043b\u044f \u0432\u0430\u0448\u0438\u0445 \u043d\u0430\u0441\u0442\u0440\u043e\u0435\u043a \u044f\u0437\u044b\u043a\u0430 \u0438 \u0442\u0435\u043c\u044b. \u0420\u0435\u043a\u043b\u0430\u043c\u043d\u044b\u0445 \u0442\u0440\u0435\u043a\u0435\u0440\u043e\u0432 \u043d\u0435\u0442. \u0427\u0438\u0442\u0430\u0439\u0442\u0435 \u041f\u043e\u043b\u0438\u0442\u0438\u043a\u0443 \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438.',
      cookie_accept: '\u041f\u0440\u0438\u043d\u044f\u0442\u044c',
      cookie_decline: '\u041e\u0442\u043a\u043b\u043e\u043d\u0438\u0442\u044c',
      contact_title: 'Остались вопросы или нужна более подробная информация? Свяжитесь с нами.',
      ctrl_theme: '\u041f\u0435\u0440\u0435\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0442\u0451\u043c\u043d\u0443\u044e \u0438\u043b\u0438 \u0441\u0432\u0435\u0442\u043b\u0443\u044e \u0442\u0435\u043c\u0443',
      ctrl_lang: '\u0421\u043c\u0435\u043d\u0438\u0442\u044c \u044f\u0437\u044b\u043a',
      aria_dashboard: '\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043f\u0440\u0435\u0434\u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u043f\u0430\u043d\u0435\u043b\u0438',
      aria_cookie: '\u0421\u043e\u0433\u043b\u0430\u0441\u0438\u0435 \u043d\u0430 cookie',
      aria_wa: '\u041d\u0430\u043f\u0438\u0441\u0430\u0442\u044c \u0432 WhatsApp',

      req_label: '\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b',
      req_title: '\u041e\u0431\u0441\u0443\u0434\u0438\u043c \u0440\u0430\u0431\u043e\u0447\u0438\u0439 \u043f\u0440\u043e\u0446\u0435\u0441\u0441 \u0432\u0430\u0448\u0435\u0439 \u0444\u0438\u0440\u043c\u044b.',
      req_lede: 'Свяжитесь с нами в WhatsApp \u0434\u043b\u044f \u0431\u044b\u0441\u0442\u0440\u043e\u0433\u043e \u043e\u0442\u0432\u0435\u0442\u0430 \u0438\u043b\u0438 \u043e\u0442\u043f\u0440\u0430\u0432\u044c\u0442\u0435 \u0437\u0430\u043f\u0440\u043e\u0441. \u041c\u044b \u043e\u0442\u0432\u0435\u0442\u0438\u043c \u043f\u043e \u0443\u043a\u0430\u0437\u0430\u043d\u043d\u044b\u043c \u0432\u0430\u043c\u0438 \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u0430\u043c.',
      req_name: '\u0418\u043c\u044f',
      req_email: 'Email',
      req_message: '\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435',
      req_consent_privacy: '\u042f \u0441\u043e\u0433\u043b\u0430\u0441\u0435\u043d \u043d\u0430 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0443 \u043c\u043e\u0438\u0445 \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u043d\u044b\u0445 \u0434\u0430\u043d\u043d\u044b\u0445 \u0434\u043b\u044f \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u044f \u043e\u0442\u0432\u0435\u0442\u0430 \u043d\u0430 \u0437\u0430\u043f\u0440\u043e\u0441, \u0432 \u0441\u043e\u043e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0438 \u0441 \u041f\u043e\u043b\u0438\u0442\u0438\u043a\u043e\u0439 \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438.',
      req_consent_marketing: '\u042f \u0434\u043e\u0431\u0440\u043e\u0432\u043e\u043b\u044c\u043d\u043e \u0441\u043e\u0433\u043b\u0430\u0448\u0430\u044e\u0441\u044c \u043d\u0430 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u0435 \u043c\u0430\u0440\u043a\u0435\u0442\u0438\u043d\u0433\u043e\u0432\u044b\u0445 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0439 \u043f\u043e \u044d\u043b\u0435\u043a\u0442\u0440\u043e\u043d\u043d\u043e\u0439 \u043f\u043e\u0447\u0442\u0435 \u0438\u043b\u0438 \u0432 WhatsApp. \u0421\u043e\u0433\u043b\u0430\u0441\u0438\u0435 \u043c\u043e\u0436\u043d\u043e \u043e\u0442\u043e\u0437\u0432\u0430\u0442\u044c \u0432 \u043b\u044e\u0431\u043e\u0439 \u043c\u043e\u043c\u0435\u043d\u0442.',
      req_send: '\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u043f\u0440\u043e\u0441',
      req_note: '\u041c\u044b \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c \u0432\u0430\u0448\u0438 \u0434\u0430\u043d\u043d\u044b\u0435 \u0442\u043e\u043b\u044c\u043a\u043e \u0434\u043b\u044f \u043e\u0442\u0432\u0435\u0442\u0430 \u043d\u0430 \u044d\u0442\u043e\u0442 \u0437\u0430\u043f\u0440\u043e\u0441. \u0412\u043d\u0443\u0442\u0440\u0435\u043d\u043d\u0438\u0435 \u0437\u0430\u043c\u0435\u0442\u043a\u0438 \u0444\u0438\u0440\u043c\u044b \u043d\u0438\u043a\u043e\u0433\u0434\u0430 \u043d\u0435 \u043f\u0435\u0440\u0435\u0434\u0430\u044e\u0442\u0441\u044f.',

      compliance_small: '\u0421\u0442\u0430\u0442\u0443\u0441 \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u0438: \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u044f ISO/IEC 27001 \u0438 ISO/IEC 27701 \u0432 \u043f\u0440\u043e\u0446\u0435\u0441\u0441\u0435 \u0438 \u043f\u043e\u043a\u0430 \u043d\u0435 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0430. SOC 2 \u2014 \u044d\u0442\u043e \u0430\u0443\u0434\u0438\u0442\u043e\u0440\u0441\u043a\u0438\u0439 \u0444\u0440\u0435\u0439\u043c\u0432\u043e\u0440\u043a, \u0441 \u043a\u043e\u0442\u043e\u0440\u044b\u043c \u043c\u044b \u0441\u043e\u043e\u0442\u043d\u043e\u0441\u0438\u043c \u0441\u0432\u043e\u0438 \u043f\u0440\u0430\u043a\u0442\u0438\u043a\u0438.',
      badge_gdpr: '\u041e\u0431\u0440\u0430\u0431\u0430\u0442\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u0441\u043e\u0433\u043b\u0430\u0441\u043d\u043e \u0442\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u044f\u043c GDPR \u0415\u0421',
      badge_iso27001: '\u0412 \u043f\u0440\u043e\u0446\u0435\u0441\u0441\u0435 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u044f ISO/IEC 27001',
      badge_iso27701: '\u0412 \u043f\u0440\u043e\u0446\u0435\u0441\u0441\u0435 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u044f ISO/IEC 27701',
      roadmap_cloud: '\u041e\u0431\u043b\u0430\u0447\u043d\u043e\u0435 \u0445\u0440\u0430\u043d\u0438\u043b\u0438\u0449\u0435 \u00b7 \u0438\u043b\u0438 \u0432\u0430\u0448 \u043b\u043e\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u0441\u0435\u0440\u0432\u0435\u0440',
      roadmap_notifs: '\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u0443\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f \u043f\u043e \u043f\u043e\u0447\u0442\u0435 \u0438 \u0432 \u043c\u0435\u0441\u0441\u0435\u043d\u0434\u0436\u0435\u0440\u0430\u0445',
      roadmap_db: '\u0417\u0430\u0449\u0438\u0449\u0451\u043d\u043d\u0430\u044f \u0431\u0430\u0437\u0430 \u0434\u0430\u043d\u043d\u044b\u0445 PostgreSQL',
      roadmap_calendar: '\u042e\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u043a\u0430\u043b\u0435\u043d\u0434\u0430\u0440\u044c',
      roadmap_soon: '\u0421\u043a\u043e\u0440\u043e: \u0443\u0447\u0451\u0442 \u0432\u0440\u0435\u043c\u0435\u043d\u0438 \u0438 \u0440\u0430\u0441\u0445\u043e\u0434\u043e\u0432 \u00b7 \u041f\u043b\u0430\u0442\u0435\u0436\u0438',
      tbl_billed: '\u041e\u043f\u043b\u0430\u0442\u0430 \u0437\u0430 \u0433\u043e\u0434',
      tbl_custom_quote: '\u0418\u043d\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043b\u044c\u043d\u044b\u0439 \u0440\u0430\u0441\u0447\u0451\u0442',
      tbl_contact_sales: '\u0421\u0432\u044f\u0437\u0430\u0442\u044c\u0441\u044f \u0441 \u043e\u0442\u0434\u0435\u043b\u043e\u043c \u043f\u0440\u043e\u0434\u0430\u0436',
      tbl_public_listed: '\u041f\u0443\u0431\u043b\u0438\u0447\u043d\u044b\u0439 \u0442\u0430\u0440\u0438\u0444, \u043e\u043f\u043b\u0430\u0442\u0430 \u0437\u0430 \u0433\u043e\u0434',
      tbl_contact_vendor: '\u0421\u0432\u044f\u0437\u0430\u0442\u044c\u0441\u044f \u0441 \u043f\u043e\u0441\u0442\u0430\u0432\u0449\u0438\u043a\u043e\u043c',
      tbl_vincent_note: '\u0426\u0435\u043d\u0430 \u043d\u0435 \u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d\u0430; \u043e\u0431\u0437\u043e\u0440\u044b \u0442\u0440\u0435\u0442\u044c\u0438\u0445 \u0441\u0442\u043e\u0440\u043e\u043d \u0443\u043a\u0430\u0437\u044b\u0432\u0430\u044e\u0442 \u043e\u043a\u043e\u043b\u043e $399/\u043c\u0435\u0441 \u0434\u043b\u044f \u0441\u043e\u043f\u043e\u0441\u0442\u0430\u0432\u0438\u043c\u044b\u0445 \u0442\u0430\u0440\u0438\u0444\u043e\u0432',
      price_popular: '\u041f\u043e\u043f\u0443\u043b\u044f\u0440\u043d\u044b\u0439',

      eyebrow_active_matters: '\u0410\u043a\u0442\u0438\u0432\u043d\u044b\u0435 \u0434\u0435\u043b\u0430',
      eyebrow_transparent: '\u041f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u044b\u0435 \u0442\u0430\u0440\u0438\u0444\u044b',
      eyebrow_journey: '\u041f\u0443\u0442\u044c \u043a\u043b\u0438\u0435\u043d\u0442\u0430',
      eyebrow_practice: '\u041e\u0442\u0440\u0430\u0441\u043b\u0438 \u043f\u0440\u0430\u0432\u0430',

      idx_tag1: '\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u0443\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f, \u0441\u0438\u043d\u0445\u0440\u043e\u043d\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0435 \u0441 \u043a\u0430\u043b\u0435\u043d\u0434\u0430\u0440\u0451\u043c',
      idx_tag2: '\u041f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442 \u0432\u0438\u0434\u0435\u043d \u0441\u0440\u0430\u0437\u0443',
      idx_tag3: '\u0412\u0441\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u0430 \u043e\u0431\u043d\u043e\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u0432 \u0440\u0435\u0430\u043b\u044c\u043d\u043e\u043c \u0432\u0440\u0435\u043c\u0435\u043d\u0438',
      faq_tag_kanban: '\u041a\u0430\u043d\u0431\u0430\u043d-\u0434\u043e\u0441\u043a\u0430 \u0434\u043b\u044f \u043a\u0430\u0436\u0434\u043e\u0433\u043e \u0434\u0435\u043b\u0430',
      faq_tag_calendar: '\u0423\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f, \u0441\u0438\u043d\u0445\u0440\u043e\u043d\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0435 \u0441 \u043a\u0430\u043b\u0435\u043d\u0434\u0430\u0440\u0451\u043c',

      gloss_filter_ph: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0442\u0435\u0440\u043c\u0438\u043d, \u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440 \u043c\u0438\u0433\u0440\u0430\u0446\u0438\u044f \u0438\u043b\u0438 \u0442\u043e\u043a\u0435\u043d',
      gloss_empty_msg: '\u041d\u0438 \u043e\u0434\u0438\u043d \u0442\u0435\u0440\u043c\u0438\u043d \u043d\u0435 \u0441\u043e\u043e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0431\u043e\u043b\u0435\u0435 \u043a\u043e\u0440\u043e\u0442\u043a\u043e\u0435 \u0441\u043b\u043e\u0432\u043e.',

      alt_studio_interni: '\u0418\u043d\u0442\u0435\u0440\u044c\u0435\u0440 \u044e\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043a\u043e\u0439 \u0444\u0438\u0440\u043c\u044b',
      alt_studio_ingresso: '\u0412\u0445\u043e\u0434 \u0432 \u044e\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043a\u0443\u044e \u0444\u0438\u0440\u043c\u0443',
      alt_sala_riunioni: '\u041f\u0435\u0440\u0435\u0433\u043e\u0432\u043e\u0440\u043d\u0430\u044f',
      alt_bilancia: '\u0412\u0435\u0441\u044b \u043f\u0440\u0430\u0432\u043e\u0441\u0443\u0434\u0438\u044f',
      alt_kanban_board: '\u0414\u043e\u0441\u043a\u0430 \u0434\u0435\u043b LexFlow \u043f\u043e \u044d\u0442\u0430\u043f\u0430\u043c',
      alt_team: '\u041a\u043e\u043c\u0430\u043d\u0434\u0430 \u044e\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043a\u043e\u0439 \u0444\u0438\u0440\u043c\u044b \u0437\u0430 \u0440\u0430\u0431\u043e\u0442\u043e\u0439'
    }
  };

  var T = window.I18N = window.I18N || {};
  Object.keys(UI).forEach(function (lang) {
    T[lang] = T[lang] || {};
    var src = UI[lang];
    Object.keys(src).forEach(function (k) { T[lang][k] = src[k]; });
  });

  window.LEXFLOW_UI_KEYS = Object.keys(UI.en);
})();
