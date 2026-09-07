# LexFlow Web-Site

> AI-native legal practice management — marketing website (static HTML, multi-page, trilingual EN/IT/RU).

**Live preview (local):** served from this directory via `python3 -m http.server`
**Status:** 🚧 Production-ready build in progress — **NOT deployed** (awaiting Ole's sign-off)

---

## 1. Site architecture

```
LEXFLOW Web-Site/
├── lexflow-index.html            # Home — hero, features, pilot results, testimonials, intake, contact
├── lexflow-how-it-works.html     # 3-step client journey, roles, matter timeline, kanban preview
├── lexflow-pricing.html          # 3 tiers + competitive comparison table
├── lexflow-practice-areas.html   # 11 + 12 practice areas (EN/IT/RU) + customisation
├── lexflow-faq.html              # 13 Q&As (FAQPage JSON-LD schema)
├── lexflow-blog.html             # Blog / News hub (index of posts)
├── privacy.html                  # Privacy Policy (GDPR)
├── terms.html                    # Terms of Service
├── 404.html                      # Not-found page
├── assets/
│   ├── style.css                 # Shared design system (navy/gold, dark/light, widgets)
│   ├── i18n.js                   # i18n engine (EN/IT/RU, theme, FAQ accordion, webhooks)
│   ├── site-config.js            # ⚙️ SINGLE SOURCE OF TRUTH for placeholders
│   ├── alessia-widget.js         # Alessia chatbot (→ live CRM chatbot)
│   ├── alessia-widget.html       # (used as reference; inlined into pages)
│   ├── romanelli-*.png           # Premium studio imagery
│   ├── avatar-client-*.png       # Testimonial client faces (generated)
│   ├── alessia-young.png         # Young blond Alessia avatar
│   └── lexflow-logo-120.{png,jpg,bmp}
├── templates/                    # 📦 Originals backed up (pre-transform)
├── sitemap.xml                   # SEO sitemap
├── robots.txt                    # Crawler rules + AI-bot allowlist
├── llms.txt                      # LLM/agent-friendly site description
├── site.webmanifest              # PWA manifest
└── README.md                     # This file
```

## 2. Design system

- **Palette:** navy `#152238` · gold `#D4AF37` / `#C5A55A` · dark surface `#0F1826`
- **Typography:** Inter (body) + Instrument Serif (display headings)
- **Themes:** dark/light (persisted in localStorage, `lexflow-theme`)
- **Languages:** EN/IT/RU — globe switcher in nav (persisted `lexflow-lang`), `data-i18n` attributes + per-page `window.I18N` dictionaries

## 3. Key components

| Component | File | Notes |
|---|---|---|
| i18n engine | `assets/i18n.js` | `setLang()`, theme toggle, FAQ accordion, webhook firing, WhatsApp float |
| Site config | `assets/site-config.js` | WhatsApp number, chatbot URL, webhook endpoints, socials |
| Alessia chatbot | `assets/alessia-widget.js` + inlined HTML | Talks to `web-production-031a6.up.railway.app`, syncs language via `LexFlowAlessiaSync` |
| Intake form | index `#intake` | Posts to CRM contacts API; notifies `ms.okuneva@internet.ru` |
| Contact block | all pages `#contact` | WhatsApp · info@ · demo@ |

## 4. Placeholders still TODO (see `assets/site-config.js`)

- `hook.example.com/*` webhook endpoints → real endpoints
- `lexflow.example.com` canonical/OG/sitemap URLs → real domain
- Social profile URLs (`#`) → LinkedIn/Instagram/GitHub/Telegram once created
- **Pricing** ($39/$79) → confirm real LexFlow prices with Ole
- `og:image` → generate branded share card
- Analytics (Plausible/GA4) → add snippet when ready

## 5. Deploy

- **Static hosting** (Netlify recommended): `netlify deploy --prod --dir=.`
- Netlify site: `poetic-kleicha-28d058` (repo: `~/LexFlow-landing`)
- **Gate:** NO auto-deploy — Ole explicitly signs off first.

## 6. Maintenance notes

- All i18n copy lives in each page's `window.I18N` (page-scoped). Add a key in **all 3 languages** or it falls back to EN.
- New pages: copy nav from an existing page, set `.active` on current, register in `sitemap.xml` + `llms.txt`.
- Images: keep in `assets/`, reference relative (`assets/...`), add `loading="lazy"`.
