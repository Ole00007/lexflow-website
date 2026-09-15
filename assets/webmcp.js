/* ============================================================
   LEXFLOW WEB-SITE — WebMCP TOOL REGISTRATION
   ============================================================
   WebMCP is a W3C Community Group proposal
   (https://webmachinelearning.github.io/webmcp/) that lets a page
   declare its capabilities as structured tools for AI agents:

       navigator.modelContext.registerTool({ name, description,
                                             inputSchema, execute })

   A browser-side agent can then call those tools directly instead of
   scraping the DOM and guessing which element to click.

   Everything in this file is progressive enhancement. If the browser
   does not implement navigator.modelContext the file returns
   immediately and the site behaves exactly as before. No network
   calls, no data collection, no side effects at load time.

   The tool set deliberately covers only what the marketing site can
   actually do: navigate, answer from published facts, and hand the
   visitor to a real human channel. It does not expose the CRM, does
   not write anything, and gives no legal advice.
   ============================================================ */
(function () {
  'use strict';

  var mc = navigator.modelContext;
  if (!mc || typeof mc.registerTool !== 'function') { return; }

  /* Resolve a site-relative path against wherever this page lives, so the
     tools work on /lexflow-index.html and on /it/ or /ru/ copies alike. */
  function url(rel) {
    try { return new URL(rel, window.location.href).href; }
    catch (e) { return rel; }
  }

  /* Spanish/Italian/Russian pages live one directory down; ../ is correct
     there and harmless at the root because we resolve, not concatenate. */
  var BASE = /^\/(it|ru)\//.test(window.location.pathname) ? '../' : '';

  /* Link the visitor to a page, or focus a form if it is already there. */
  function go(rel) {
    window.location.href = url(BASE + rel);
    return { navigated_to: url(BASE + rel) };
  }

  var TOOLS = [

    {
      name: 'get_product_facts',
      description: 'Return authoritative LexFlow product facts: what it does, who it is for, ' +
                   'the assistant, the client access model, data protection posture and the ' +
                   'limits we do not overstate. Use this before answering any question about ' +
                   'LexFlow capabilities.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: function () {
        return {
          product: 'Legal practice management: matters, activities, deadlines, client intake ' +
                   'and client-facing matter status in one role-aware workspace.',
          audience: 'Law firms of all sizes.',
          assistant: 'Elisa, the digital intake assistant. Gathers initial information and ' +
                     'passes it into the firm structured intake flow. She does not give legal ' +
                     'advice and does not replace a lawyer.',
          client_access: 'No client install and no client password. Each firm client receives ' +
                         'a unique token-secured URL that opens their own matter page.',
          roles: ['lawyer', 'legal assistant', 'firm owner', 'clients'],
          languages: ['English', 'Italian', 'Russian'],
          data_protection: 'Handled under EU GDPR requirements, with encryption and secure ' +
                           'access controls. ISO/IEC 27001 and ISO/IEC 27701 certification is ' +
                           'in progress, NOT yet held. SOC 2 is an auditing framework we align ' +
                           'our practices with, not a completed certification.',
          do_not_overstate: [
            'Automated email notifications, cloud storage integration and Google Calendar sync ' +
            'are NOT shipping today. They are planned.',
            'The "20+" integration figure is pending verification.',
            'Pilot metric figures are early indications from a pilot deployment; methodology and ' +
            'formal measurement are not yet documented.',
            'The site publishes no real named client testimonials. Items labelled as ' +
            'illustrative examples are descriptive, not quotations.',
            'There is no video overview.'
          ],
          note: 'This describes the product only. It is not legal advice.',
          authoritative_source: url(BASE + 'llms.txt')
        };
      }
    },

    {
      name: 'get_pricing',
      description: 'Return the published LexFlow plan names and the URL of the pricing page, ' +
                   'which also carries a comparison against market alternatives.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: function () {
        return {
          plans: [
            { name: 'Organisation & Control', url: url(BASE + 'lexflow-pricing.html') },
            { name: 'Steady Growth', url: url(BASE + 'lexflow-pricing.html') },
            { name: 'Enterprise', url: url(BASE + 'lexflow-pricing.html') }
          ],
          billing: 'Per-user monthly pricing, billed annually.',
          note: 'Prices shown on the pricing page are the published figures. Competitor ' +
                'pricing reflects publicly listed rates as of the research date and can change.',
          pricing_page: url(BASE + 'lexflow-pricing.html')
        };
      }
    },

    {
      name: 'request_demo',
      description: 'Send the visitor to the LexFlow demo request form so they can book a ' +
                   'walkthrough and start the 14-day free trial.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: function () {
        var form = document.getElementById('intake') || document.querySelector('form[data-source*="intake"]');
        if (form) {
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
          var first = form.querySelector('input[type="text"], input[type="email"]');
          if (first) { first.focus(); }
          return { action: 'focused_demo_form', page: window.location.href };
        }
        return go('lexflow-index.html#intake');
      }
    },

    {
      name: 'ask_elisa',
      description: 'Open Elisa, the LexFlow digital intake assistant, so the visitor can describe ' +
                   'their request. Elisa collects information and does not give legal advice.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: function () {
        var toggle = document.getElementById('elisaToggle') ||
                     document.querySelector('[aria-label*="Elisa"]');
        if (toggle) { toggle.click(); return { action: 'opened_elisa' }; }
        return { error: 'Elisa widget not found on this page.' };
      }
    },

    {
      name: 'contact_lexflow',
      description: 'Return the official LexFlow contact channels (WhatsApp and email).',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: function () {
        var cfg = window.LEXFLOW_CONFIG || {};
        return {
          whatsapp: cfg.whatsapp ? 'https://wa.me/' + cfg.whatsapp : null,
          email_demo: 'mailto:demo@lexflow.com',
          email_info: 'mailto:info@lexflow.com',
          contact_page: url(BASE + 'lexflow-index.html#contact')
        };
      }
    },

    {
      name: 'find_article',
      description: 'Find LexFlow articles by topic. Returns matching article titles and URLs. ' +
                   'Call this when the visitor asks how to do something in a law firm.',
      inputSchema: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            description: 'Topic to look for, for example "intake", "matter tracking", ' +
                         '"client communication", "automation", "migration", "security", ' +
                         '"AI", "workflows" or "adoption".'
          }
        },
        required: ['topic'],
        additionalProperties: false
      },
      execute: function (args) {
        var q = String((args && args.topic) || '').toLowerCase();
        var index = [
          { k: 'intake enquiry lead onboarding', f: 'lexflow-article-client-intake.html' },
          { k: 'matter tracker status progress calls', f: 'lexflow-article-matter-tracker.html' },
          { k: 'communication updates expectations', f: 'lexflow-article-client-communication.html' },
          { k: 'automation repetition admin', f: 'lexflow-article-law-firm-automation.html' },
          { k: 'crm migration data spreadsheets', f: 'lexflow-article-crm-migration.html' },
          { k: 'security privacy gdpr iso', f: 'lexflow-article-security-privacy.html' },
          { k: 'ai assisted reviewable judgement', f: 'lexflow-article-ai-assisted-operations.html' },
          { k: 'workflows handoffs roles', f: 'lexflow-article-law-firm-workflows.html' },
          { k: 'adoption change rollout onboarding', f: 'lexflow-article-adoption-in-small-firm.html' }
        ];
        var hits = index.filter(function (e) {
          return e.k.split(' ').some(function (w) { return q && w.indexOf(q) === 0; });
        });
        if (!hits.length) { hits = index; }
        return {
          query: q,
          matches: hits.map(function (e) { return { url: url(BASE + e.f), keywords: e.k }; }),
          blog_index: url(BASE + 'lexflow-blog.html')
        };
      }
    }
  ];

  TOOLS.forEach(function (tool) {
    /* Look up the callable shape at registration time. Some early
       implementations used provideContext({tools:[...]}); if only that form
       exists, register through it instead so the tools still surface. */
    try {
      mc.registerTool(tool);
    } catch (e) {
      if (typeof mc.provideContext === 'function') {
        try { mc.provideContext({ tools: [tool] }); } catch (e2) { /* give up quietly */ }
      }
    }
  });
})();
