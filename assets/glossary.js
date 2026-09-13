/* ============================================================
   LEXFLOW — PLAIN-LANGUAGE GLOSSARY (EN / IT / RU)
   ------------------------------------------------------------
   Merges glossary strings into window.I18N so the existing
   i18n.js engine can switch them like any other key.

   Load order on every page that shows the glossary:
       <script>window.I18N = { en:{...}, it:{...}, ru:{...} }</script>
       <script src="assets/site-config.js"></script>
       <script src="assets/glossary.js"></script>   <-- merges here
       <script src="assets/i18n.js"></script>

   The English text also lives as static HTML in the page so the
   glossary is crawlable without JavaScript. These strings are the
   translations for the Italian and Russian views.

   Wording note: these are definitions of terms, not legal advice,
   and not a claim that LexFlow holds any certification. ISO and
   SOC 2 entries describe what the standards ARE.
   ============================================================ */
(function () {
  'use strict';

  var GLOSS = {
    en: {
      gloss_encryption_t: 'Encryption',
      gloss_encryption_d: 'Data is converted into a protected form so unauthorised people cannot read it.',
      gloss_access_t: 'Secure access controls',
      gloss_access_d: 'Only authorised users can open specific data or functions.',
      gloss_migration_t: 'Data migration',
      gloss_migration_d: 'Moving existing data from one system into another.',
      gloss_guided_t: 'Guided migration',
      gloss_guided_d: 'The firm moves its data with step-by-step support from LexFlow.',
      gloss_whiteglove_t: 'White-glove migration',
      gloss_whiteglove_d: 'LexFlow handles most of the agreed migration work.',
      gloss_token_t: 'Token-secured URL',
      gloss_token_d: 'A private link generated for a specific matter or authorised user to limit access without a conventional password.',
      gloss_matter_t: 'Matter page',
      gloss_matter_d: 'A page where the legal firm\u2019s client sees approved information relating to their matter.',
      gloss_gdpr_t: 'GDPR',
      gloss_gdpr_d: 'The European Union\u2019s principal framework for personal-data protection and privacy.',
      gloss_iso27001_t: 'ISO/IEC 27001',
      gloss_iso27001_d: 'An international standard for information-security management systems.',
      gloss_iso27701_t: 'ISO/IEC 27701',
      gloss_iso27701_d: 'An international standard for privacy-information management systems.',
      gloss_soc2_t: 'SOC 2',
      gloss_soc2_d: 'An auditing framework for assessing controls relevant to customer data and systems.',
      gloss_practice_t: 'Practice area',
      gloss_practice_d: 'A category of legal work, such as family, criminal or real-estate law.',
      gloss_kanban_t: 'Kanban',
      gloss_kanban_d: 'A visual board organising work into stages such as new, in progress, blocked and completed.',
      gloss_intake_t: 'Client intake',
      gloss_intake_d: 'Collecting and reviewing the information a firm needs to assess and organise a new request.'
    },

    it: {
      gloss_encryption_t: 'Crittografia',
      gloss_encryption_d: 'I dati vengono trasformati in una forma protetta affinch\u00e9 chi non \u00e8 autorizzato non possa leggerli.',
      gloss_access_t: 'Controlli di accesso sicuro',
      gloss_access_d: 'Solo gli utenti autorizzati possono aprire determinati dati o funzioni.',
      gloss_migration_t: 'Migrazione dei dati',
      gloss_migration_d: 'Il trasferimento dei dati esistenti da un sistema a un altro.',
      gloss_guided_t: 'Migrazione guidata',
      gloss_guided_d: 'Lo studio trasferisce i dati con il supporto passo dopo passo di LexFlow.',
      gloss_whiteglove_t: 'Migrazione white-glove',
      gloss_whiteglove_d: 'LexFlow gestisce la maggior parte del lavoro di migrazione concordato.',
      gloss_token_t: 'URL protetto da token',
      gloss_token_d: 'Un link privato per una pratica o un utente autorizzato che limita l\u2019accesso senza password tradizionale.',
      gloss_matter_t: 'Pagina della pratica',
      gloss_matter_d: 'La pagina in cui il cliente dello studio vede informazioni approvate sulla propria pratica.',
      gloss_gdpr_t: 'GDPR',
      gloss_gdpr_d: 'Il principale quadro normativo UE per la protezione dei dati personali e della privacy.',
      gloss_iso27001_t: 'ISO/IEC 27001',
      gloss_iso27001_d: 'Uno standard internazionale per i sistemi di gestione della sicurezza delle informazioni.',
      gloss_iso27701_t: 'ISO/IEC 27701',
      gloss_iso27701_d: 'Uno standard internazionale per i sistemi di gestione delle informazioni sulla privacy.',
      gloss_soc2_t: 'SOC 2',
      gloss_soc2_d: 'Un framework di audit per valutare i controlli relativi alla protezione dei dati e dei sistemi.',
      gloss_practice_t: 'Area di attivit\u00e0',
      gloss_practice_d: 'Una categoria di lavoro legale, come diritto di famiglia, penale o immobiliare.',
      gloss_kanban_t: 'Kanban',
      gloss_kanban_d: 'Una bacheca visiva che organizza il lavoro in fasi: nuovo, in corso, bloccato e completato.',
      gloss_intake_t: 'Intake del cliente',
      gloss_intake_d: 'Raccolta e revisione delle informazioni necessarie a valutare e organizzare una nuova richiesta.'
    },

    ru: {
      gloss_encryption_t: '\u0428\u0438\u0444\u0440\u043e\u0432\u0430\u043d\u0438\u0435',
      gloss_encryption_d: '\u0421\u043f\u043e\u0441\u043e\u0431 \u043f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0434\u0430\u043d\u043d\u044b\u0435 \u0432 \u0437\u0430\u0449\u0438\u0449\u0451\u043d\u043d\u044b\u0439 \u0432\u0438\u0434, \u0447\u0442\u043e\u0431\u044b \u043f\u043e\u0441\u0442\u043e\u0440\u043e\u043d\u043d\u0438\u0435 \u043d\u0435 \u043c\u043e\u0433\u043b\u0438 \u0438\u0445 \u043f\u0440\u043e\u0447\u0438\u0442\u0430\u0442\u044c.',
      gloss_access_t: '\u0411\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0435 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0434\u043e\u0441\u0442\u0443\u043f\u043e\u043c',
      gloss_access_d: '\u0422\u043e\u043b\u044c\u043a\u043e \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u043e\u0432\u0430\u043d\u043d\u044b\u0435 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0438 \u043c\u043e\u0433\u0443\u0442 \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0442\u044c \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0451\u043d\u043d\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435 \u0438\u043b\u0438 \u0444\u0443\u043d\u043a\u0446\u0438\u0438.',
      gloss_migration_t: '\u041c\u0438\u0433\u0440\u0430\u0446\u0438\u044f \u0434\u0430\u043d\u043d\u044b\u0445',
      gloss_migration_d: '\u041f\u0435\u0440\u0435\u043d\u043e\u0441 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044e\u0449\u0438\u0445 \u0434\u0430\u043d\u043d\u044b\u0445 \u0438\u0437 \u043e\u0434\u043d\u043e\u0439 \u0441\u0438\u0441\u0442\u0435\u043c\u044b \u0432 \u0434\u0440\u0443\u0433\u0443\u044e.',
      gloss_guided_t: '\u041c\u0438\u0433\u0440\u0430\u0446\u0438\u044f \u0441 \u0441\u043e\u043f\u0440\u043e\u0432\u043e\u0436\u0434\u0435\u043d\u0438\u0435\u043c',
      gloss_guided_d: '\u0424\u0438\u0440\u043c\u0430 \u043f\u0435\u0440\u0435\u043d\u043e\u0441\u0438\u0442 \u0434\u0430\u043d\u043d\u044b\u0435 \u0441 \u043f\u043e\u0448\u0430\u0433\u043e\u0432\u043e\u0439 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u043e\u0439 LexFlow.',
      gloss_whiteglove_t: '\u041c\u0438\u0433\u0440\u0430\u0446\u0438\u044f white-glove',
      gloss_whiteglove_d: 'LexFlow \u0431\u0435\u0440\u0451\u0442 \u043d\u0430 \u0441\u0435\u0431\u044f \u0431\u043e\u043b\u044c\u0448\u0443\u044e \u0447\u0430\u0441\u0442\u044c \u0441\u043e\u0433\u043b\u0430\u0441\u043e\u0432\u0430\u043d\u043d\u043e\u0439 \u0440\u0430\u0431\u043e\u0442\u044b \u043f\u043e \u043f\u0435\u0440\u0435\u043d\u043e\u0441\u0443 \u0434\u0430\u043d\u043d\u044b\u0445.',
      gloss_token_t: 'URL, \u0437\u0430\u0449\u0438\u0449\u0451\u043d\u043d\u044b\u0439 \u0442\u043e\u043a\u0435\u043d\u043e\u043c',
      gloss_token_d: '\u041f\u0440\u0438\u0432\u0430\u0442\u043d\u0430\u044f \u0441\u0441\u044b\u043b\u043a\u0430 \u0434\u043b\u044f \u043a\u043e\u043d\u043a\u0440\u0435\u0442\u043d\u043e\u0433\u043e \u0434\u0435\u043b\u0430 \u0438\u043b\u0438 \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u043e\u0432\u0430\u043d\u043d\u043e\u0433\u043e \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f, \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0438\u0432\u0430\u044e\u0449\u0430\u044f \u0434\u043e\u0441\u0442\u0443\u043f \u0431\u0435\u0437 \u043e\u0431\u044b\u0447\u043d\u043e\u0433\u043e \u043f\u0430\u0440\u043e\u043b\u044f.',
      gloss_matter_t: '\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430 \u0434\u0435\u043b\u0430',
      gloss_matter_d: '\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430, \u0433\u0434\u0435 \u043a\u043b\u0438\u0435\u043d\u0442 \u044e\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043a\u043e\u0439 \u0444\u0438\u0440\u043c\u044b \u0432\u0438\u0434\u0438\u0442 \u043e\u0434\u043e\u0431\u0440\u0435\u043d\u043d\u0443\u044e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044e \u043f\u043e \u0441\u0432\u043e\u0435\u043c\u0443 \u0434\u0435\u043b\u0443.',
      gloss_gdpr_t: 'GDPR',
      gloss_gdpr_d: '\u041e\u0441\u043d\u043e\u0432\u043d\u0430\u044f \u043d\u043e\u0440\u043c\u0430\u0442\u0438\u0432\u043d\u0430\u044f \u0431\u0430\u0437\u0430 \u0415\u0421 \u043f\u043e \u0437\u0430\u0449\u0438\u0442\u0435 \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u0445 \u0434\u0430\u043d\u043d\u044b\u0445 \u0438 \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438.',
      gloss_iso27001_t: 'ISO/IEC 27001',
      gloss_iso27001_d: '\u041c\u0435\u0436\u0434\u0443\u043d\u0430\u0440\u043e\u0434\u043d\u044b\u0439 \u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442 \u0434\u043b\u044f \u0441\u0438\u0441\u0442\u0435\u043c \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u043e\u043d\u043d\u043e\u0439 \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u044c\u044e.',
      gloss_iso27701_t: 'ISO/IEC 27701',
      gloss_iso27701_d: '\u041c\u0435\u0436\u0434\u0443\u043d\u0430\u0440\u043e\u0434\u043d\u044b\u0439 \u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442 \u0434\u043b\u044f \u0441\u0438\u0441\u0442\u0435\u043c \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u0435\u0439 \u043e \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438.',
      gloss_soc2_t: 'SOC 2',
      gloss_soc2_d: '\u0410\u0443\u0434\u0438\u0442\u043e\u0440\u0441\u043a\u0430\u044f \u0441\u0438\u0441\u0442\u0435\u043c\u0430 \u043e\u0446\u0435\u043d\u043a\u0438 \u043c\u0435\u0440 \u043a\u043e\u043d\u0442\u0440\u043e\u043b\u044f \u0437\u0430\u0449\u0438\u0442\u044b \u0434\u0430\u043d\u043d\u044b\u0445 \u043a\u043b\u0438\u0435\u043d\u0442\u043e\u0432 \u0438 \u0441\u0438\u0441\u0442\u0435\u043c.',
      gloss_practice_t: '\u041d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043f\u0440\u0430\u043a\u0442\u0438\u043a\u0438',
      gloss_practice_d: '\u041a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u044f \u044e\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043a\u043e\u0439 \u0440\u0430\u0431\u043e\u0442\u044b, \u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440 \u0441\u0435\u043c\u0435\u0439\u043d\u043e\u0435, \u0443\u0433\u043e\u043b\u043e\u0432\u043d\u043e\u0435 \u0438\u043b\u0438 \u043d\u0435\u0434\u0432\u0438\u0436\u0438\u043c\u043e\u0435 \u043f\u0440\u0430\u0432\u043e.',
      gloss_kanban_t: '\u041a\u0430\u043d\u0431\u0430\u043d',
      gloss_kanban_d: '\u0412\u0438\u0437\u0443\u0430\u043b\u044c\u043d\u0430\u044f \u0434\u043e\u0441\u043a\u0430, \u0440\u0430\u0441\u043f\u0440\u0435\u0434\u0435\u043b\u044f\u044e\u0449\u0430\u044f \u0440\u0430\u0431\u043e\u0442\u0443 \u043f\u043e \u044d\u0442\u0430\u043f\u0430\u043c: \u043d\u043e\u0432\u0430\u044f, \u0432 \u043f\u0440\u043e\u0446\u0435\u0441\u0441\u0435, \u0437\u0430\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u0430\u044f \u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043d\u043d\u0430\u044f.',
      gloss_intake_t: '\u041f\u0435\u0440\u0432\u0438\u0447\u043d\u044b\u0439 \u043f\u0440\u0438\u0451\u043c \u043a\u043b\u0438\u0435\u043d\u0442\u0430',
      gloss_intake_d: '\u0421\u0431\u043e\u0440 \u0438 \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u0438 \u0434\u043b\u044f \u043e\u0446\u0435\u043d\u043a\u0438 \u0438 \u043e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0446\u0438\u0438 \u043d\u043e\u0432\u043e\u0433\u043e \u043e\u0431\u0440\u0430\u0449\u0435\u043d\u0438\u044f.'
    }
  };

  /* Merge into the page dictionary without clobbering existing keys. */
  var T = window.I18N = window.I18N || {};
  Object.keys(GLOSS).forEach(function (lang) {
    T[lang] = T[lang] || {};
    var src = GLOSS[lang];
    Object.keys(src).forEach(function (k) {
      if (!T[lang][k]) T[lang][k] = src[k];
    });
  });

  window.LEXFLOW_GLOSSARY_TERMS = [
    'encryption', 'access', 'migration', 'guided', 'whiteglove', 'token', 'matter',
    'gdpr', 'iso27001', 'iso27701', 'soc2', 'practice', 'kanban', 'intake'
  ];
})();
