/* ============================================================
   LEXFLOW WEB-SITE — SITE CONFIG (single source of truth)
   Placeholders marked TODO: are wired for later hookup by Ole.
   ============================================================ */
window.LEXFLOW_CONFIG = {
  /* WhatsApp number — international format, digits only (no + or spaces) */
  whatsapp: "393450234084", // TODO: verify final number with Ole (+39 345 0234 084)

  /* Chatbot backend — the live CRM chatbot endpoint (from LP production widget) */
  chatbotUrl: "https://web-production-031a6.up.railway.app",

  /* Webhook base + named endpoints (WH-01..WH-04 from ID-Trigger-Endpoint-Status.csv).
     TODO: replace hook.example.com with real endpoints when created. */
  webhookBase: "https://hook.example.com/lexflow",
  webhooks: {
    "demo-request-nav":   "https://hook.example.com/lexflow/demo-request",      // WH-01
    "demo-request-hero":  "https://hook.example.com/lexflow/demo-request",      // WH-01
    "newsletter-signup":  "https://hook.example.com/lexflow/newsletter",        // WH-02
    "whatsapp-float":     "https://hook.example.com/lexflow/whatsapp",          // WH-03
    "chatbot-toggle":     "https://hook.example.com/lexflow/chatbot-message",   // WH-04
    "chatbot-send":       "https://hook.example.com/lexflow/chatbot-message",   // WH-04
    "social-linkedin":    "https://hook.example.com/lexflow/social",            // TODO
    "social-instagram":   "https://hook.example.com/lexflow/social"             // TODO
  },

  /* Social profiles — no real profiles yet, hook later */
  social: {
    linkedin:  "#", // TODO: real LinkedIn URL when profile exists
    instagram: "#"  // TODO: real Instagram URL when profile exists
  }
};
