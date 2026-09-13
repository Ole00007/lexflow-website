/* ============================================================
   LEXFLOW WEB-SITE — SITE CONFIG (single source of truth)
   ============================================================
   Everything the front end needs to talk to the backend lives here.
   Change a value in this file and every page picks it up — the
   forms, the Elisa assistant and the contact blocks all read it.
   ============================================================ */
window.LEXFLOW_CONFIG = {

  /* WhatsApp number — international format, digits only (no + or spaces) */
  whatsapp: "393450234084", // TODO: confirm final number with Ole

  /* ---------------------------------------------------------------
     INTAKE / CONTACT DELIVERY
     ---------------------------------------------------------------
     Status as of 2026-09-13: the deployed CRM does NOT yet expose a
     public route the browser may post to.

       GET  /api/contacts  -> 200 (readable)
       POST /api/contacts  -> 401 {"msg":"Missing Authorization Header"}
       /api/chatbot        -> 404 (does not exist)

     So a browser form cannot deliver a lead today, and no API token
     may be placed in this file because it would ship to every visitor.

     What the CRM needs to add (pick one):
       a) POST /api/public/intake  — no auth, CORS-open to the site
          origin, accepts JSON, writes a contact row, returns 201.
       b) a webhook URL (Zapier / Make / n8n) that inserts the contact.
       c) a Netlify function or similar holding the token server side.

     Until then: intakeEndpoint stays null, forms fall back to
     WhatsApp, and they never report a false success.
  --------------------------------------------------------------- */
  intakeEndpoint: null,        // e.g. "https://web-production-031a6.up.railway.app/api/public/intake"
  intakeMethod: "POST",
  intakeFormat: "json",        // "json" | "form"

  /* Elisa assistant backend.
     /api/chatbot does not exist yet (404). Point this at the real
     chat route once it ships; the widget reads it from here, so it is
     a one-line change with no page edits. */
  chatbotUrl: "https://web-production-031a6.up.railway.app",
  chatbotPath: "/api/chatbot", // TODO: confirm real path when deployed

  /* Generic webhook base. Leave null to disable — calls to a
     placeholder host fail silently, which hides real errors. */
  webhookBase: null,           // e.g. "https://hooks.zapier.com/hooks/catch/xxxx/yyyy"
  webhooks: {
    "intake-submit":     null, // WH-01 demo/intake request
    "newsletter-signup": null, // WH-02 newsletter
    "whatsapp-float":    null, // WH-03
    "chatbot-toggle":    null  // WH-04
  },

  /* Social profiles — no real profiles yet, hook later */
  social: {
    linkedin:  null,
    instagram: null
  }
};
