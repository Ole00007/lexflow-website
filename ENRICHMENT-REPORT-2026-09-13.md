# LexFlow web-site — batch report, 2026-09-13

Consolidated documentation for items 0–7 plus the WhatsApp question and the
Cloudflare note. One report, as requested.

---

## 0. Working path (confirmed before any change)

```
repo root : /Users/olesiarasing/Desktop/projects/services/LEGAL/LEXFLOW Production/LEXFLOW Web-Site
branch    : main
HEAD      : dd3dc4a
subfolders: assets/  it/  ru/  templates/
```

This is the ACTIVE multi-page site. Two things worth stating explicitly:

- `~/LexFlow-landing` (the single-page landing page) is a **different, frozen**
  repo. Nothing in this batch touched it.
- The stale `lexflow-index (1).html`, `lexflow-faq (1).html`,
  `lexflow-practice-areas (1).html` and `lexflow-pricing (1).html` copies are
  **not** part of the build. They are unreferenced duplicates of superseded
  versions. They were left alone rather than deleted.

**Important:** most of this batch had already been implemented in commit
`6dde532` (18:09) before this session started work — Elisa's contact-first flow,
the working delivery path, the visible request form, the certification text
move, the Italian nav shortening and the WhatsApp/launcher overlap were all in
that commit. This session verified all of it, then completed items 1, 2 (remainder),
3, and the audit for 5 and 7. Item 6 is the only item not done.

---

## 1. Webhooks pointing at hook.example.com — DONE

### Call sites

All 27 trigger names, with the number of places each appears:

| Trigger | Sites | Example |
|---|---|---|
| `demo-request-nav` | 24 | article-client-intake.html:87 |
| `social-linkedin` / `social-instagram` / `social-whatsapp` / `social-github` / `social-telegram` | 24 each | article-client-intake.html:214–218 |
| `whatsapp-float` | 24 | article-client-intake.html:439 |
| `contact-email` | 15 | faq.html:270 |
| `contact-whatsapp` | 15 | faq.html:269 |
| `contact-demo-email` | 12 | faq.html:271 |
| `cta-demo`, `faq-cta-demo`, `hiw-cta-demo`, `pricing-cta-demo`, `practice-cta-demo`, `blog-cta-demo`, `article-matter-cta-demo`, `article-intake-cta-demo`, `demo-request-hero`, `overview-cta`, `dashboard-preview`, `pricing-select-starter`, `pricing-select-professional`, `pricing-select-enterprise` | 3 each | name each page's own CTA |

All are declared as `data-webhook="<name>"` in the HTML and dispatched by
`initWebhooks()` in `assets/i18n.js`.

### What changed — `assets/i18n.js`

`fireWebhook()` was the problem, not just the URLs:

- **Before:** `var WEBHOOK_BASE = CONFIG.webhookBase || 'https://hook.example.com/lexflow';`
  — so a null/absent config fell back to a placeholder host.
- **Before:** it logged `console.log('[LexFlow] webhook fired:', name)` *before*
  knowing whether anything arrived, so a dead endpoint looked healthy.
- **Before:** `fetch(...)` had no `.catch()`, so failures vanished.

Now:

- The endpoint resolves from exactly one place: `LEXFLOW_CONFIG.webhooks[name]`.
  There is no fallback host.
- An unconfigured webhook logs a warning naming the key, and sends nothing.
- Failures log as `console.error` with the trigger name, the reason and the endpoint.
- Success logs only after a `2xx` response.
- A `lexflow:webhook` CustomEvent fires with `{name, state, detail}` where state
  is `ok` | `failed` | `unconfigured`, so any surface can show real delivery
  state instead of the console being the only witness.

### Where you supply the real URLs

**File:** `assets/site-config.js` — one key per trigger, all now `null` with
comments grouping them (lead/demo, pricing selection, engagement, social):

```js
webhookBase: null,
webhooks: {
  "demo-request-nav": null,   // nav "Book a Demo" (24 sites)
  "intake-submit":    null,   // the visible request form (WH-01)
  ...
}
```

Edit that one file. No page edits, no redeploy of the pages themselves.

**Still pending your input:** the real webhook URLs.

---

## 2. Hardcoded compliance badge + roadmap text — DONE

### Moved to dictionaries (EN / IT / RU)

| Key | English |
|---|---|
| `badge_gdpr` | Handled under EU GDPR requirements |
| `badge_iso27001` | Working towards ISO/IEC 27001 |
| `badge_iso27701` | Working towards ISO/IEC 27701 |
| `roadmap_cloud` | Cloud storage · or your local server |
| `roadmap_notifs` | Automatic email and messenger notifications |
| `roadmap_db` | PostgreSQL secure database |
| `roadmap_calendar` | Legal calendaring |
| `roadmap_soon` | Coming soon: time and expense tracking · payments |

### Mixed-language roadmap line — fixed

The English page carried Italian fragments inside English strings
(`"✓ Archiviazione cloud · or your local server"`, `"✓ Notifiche email e
messenger automatiche"`, `"| Prossimamente: Time & Expense Tracking · Payments"`).
Each language is now wholly in its own language. The Italian roadmap term was
also mixing an English product phrase; it now reads
"Prossimamente: gestione di tempi e spese · Pagamenti".

### Moved to the footer

`compliance_small` (certification status) verified in the **footer** on
`lexflow-pricing.html` in all three languages — not in the body:

```
.    footer   it/  footer   ru/  footer
```

### Also fixed in this item (found by the audit)

- Index feature tags were Italian in every language, so English visitors read
  Italian. Now dictionary-driven.
- All four stat labels (`why_metric1..4`) had Italian values in the EN dict.
- FAQ image tags were Italian on the English page.
- Image `alt` text was Italian on several English pages.
- The pricing comparison table's cells were hardcoded English everywhere.

---

## 3. Full IT/RU vs EN hardcoded-string sweep — DONE

### Deliverable

`i18n-audit-hardcoded-strings.csv` — every hardcoded string found, with
`file`, `line`, `kind`, `text` and a classification column
(`COPY` / `badge/label` / `brand/no-translation-needed` / `numeric/unit`).

Method: the 8 English pages are tokenised, script/style/comment regions are
masked out, and any visible text node or `placeholder` / `aria-label` / `title` /
`alt` attribute **not** covered by a `data-i18n*` hook is reported. This catches
hardcoded strings, which dictionary-key parity checks cannot — that gap is
exactly why the badges, roadmap line and pricing table were missed before.

### Before → after

| Page | Before | After |
|---|---|---|
| lexflow-index.html | 85 | 66 |
| lexflow-how-it-works.html | 69 | 58 |
| lexflow-pricing.html | 100 | 75 |
| lexflow-practice-areas.html | 67 | 56 |
| lexflow-faq.html | 84 | 68 |
| lexflow-blog.html | 64 | 54 |
| lexflow-article-matter-tracker.html | 120 | 111 |
| lexflow-article-client-intake.html | 115 | 94 |
| **Total** | **704** | **582** |

**Nothing approved was removed.** Every change added a translation hook or a
localised value. The only structural deletions were bookkeeping: the pricing
compliance paragraph moved from body to footer (text preserved), and the Elisa
widget's leftover placeholder span.

### What the remaining 582 are — honest breakdown

1. **Article bodies (~340).** The two articles are long-form English by design.
   The `it/` and `ru/` copies exist but their bodies are still English, pending
   the translated text you said you'd supply. This is the single largest
   remaining block and it is **blocked on your copy**, not on engineering.
2. **Elisa widget markup (~120, repeated per page).** All of this *is*
   dictionary-driven — from the widget's own `COPY` table in
   `assets/elisa-widget.js`, which `syncCopy()` applies on load in EN/IT/RU.
   Visitors see correct Italian and Russian. The gap is that the markup is not
   pre-localised in the generated HTML, so a crawler reading `/it/` sees English
   there. Worth fixing, but it does not affect any human visitor.
3. **Blog hub and cluster labels, remaining index/pricing labels.** Same class
   as item 2 — covered at runtime, not pre-localised.
4. **Brand terms and units** (`LexFlow`, `WhatsApp`, `LinkedIn`, `$39 / user / mo`).
   Correctly not translated.

### Verification

- Regeneration reports **zero missing translations** for every `data-i18n` key
  in Italian and Russian.
- Shared dictionary verified at **54 keys with exact three-language parity**.
- **Zero duplicate attributes** across all 27 pages.
- Italian and Russian pricing bodies verified free of English strings.

### New capability added

`data-i18n-alt` support in both the runtime engine and the generator, so `alt`
text is pre-localised in the generated pages rather than only corrected in the
browser.

---

## 4. Elisa — contact-first flow — DONE (verified, built in 6dde532)

Flow as implemented and verified in the browser:

1. **Contact details first** — email and phone, with validation. Elisa opens on
   this step.
2. **Then the dropdowns** — practice area, matter status, urgency.
3. **Then the free-text description.**
4. **Then send.**

Verified behaviour: opens on the contact step, blocks empty and invalid input,
advances on contact and matter, chips and labels localise.

### Endpoint behind a single config value

**File:** `assets/site-config.js`

```js
intakeEndpoint: null,     // e.g. "https://<crm>/api/public/intake"
intakeMethod: "POST",
intakeFormat: "json",     // "json" | "form"
chatbotUrl: "https://web-production-031a6.up.railway.app",
chatbotPath: "/api/chatbot",
```

One setting switches both the visible form and Elisa on.

### Safe mode until the real CRM URL exists

`intakeEndpoint` is `null`, so nothing is posted anywhere. Forms fall back to
WhatsApp with an honest message and **never report success unless the endpoint
accepted the request**. Double submission is blocked. This replaces the previous
behaviour where the handler posted to `/api/contacts` (which returns `401`), then
showed the thank-you panel from its `.catch()` — so a lost lead looked like a
successful submission.

### Still pending your input

The public CRM URL and the endpoint decision (the operator-installer card covers
the backend side).

---

## 5. Blog newsletter band → visitor request form — DONE, one question for you

- The newsletter band was replaced by the visitor request form, and the same
  form added to both articles, in all three languages.
- Fields match what you pasted: name, email, message, privacy consent, optional
  marketing consent, send request. Same field structure and consent wording as
  the main intake form — not a new ad-hoc design.
- Consent wording is dictionary-driven per language (keys `req_consent_privacy`,
  `req_consent_marketing`), not machine-translated at runtime.

### Your explicit decision needed

**Newsletter signup has been dropped from the blog.** The dictionary keys
(`news_title`, `news_lede`, `news_button`, `news_note`) and the
`newsletter-signup` webhook key remain, so it can be restored cheaply.

You asked me not to remove it silently — so: it is removed from the visible page,
and I am flagging it rather than deciding. Confirm one of:

- **Drop entirely** (then I'll remove the leftover keys), or
- **Keep elsewhere** — tell me where (footer? dedicated page?), or
- **Restore on the blog** below the request form.

---

## 6. Kanban visual — NOT DONE (needs three decisions from you)

Nothing was changed here, because the current image is in place and replacing it
has prerequisites I can't settle alone.

**What I plan:** screenshot `https://web-production-031a6.up.railway.app/kanban`,
crop to one clean column or a partial view so it reads as a designed asset rather
than a raw screenshot, and match the site's existing image treatment
(`.premium-visual` styling, gold/navy framing, lazy loading, local asset in
`assets/`).

**Three things I need from you:**

1. **Is the sample data on that board anonymised?** If it shows a real client's
   matter names or personal data, I cannot publish a screenshot of it. Either
   anonymise it in the CRM first, or I generate an equivalent board image with
   placeholder matter names instead (a designed mock, not a real screenshot).
2. **The "two-people" image.** You referenced the one on the a-Lexy LP
   (`coruscating-pegasus-c96710.netlify.app/#faq`). Please confirm the source so
   licensing can be approved before publication. Options: (a) it is a stock image
   you already licensed — send me the licence; (b) reuse the existing
   `assets/romanelli-*.png` photography we already hold (safest, no new licence);
   (c) generate a new image matching the style. **My preference is (b)** — it is
   already in the repo, already styled consistently, and adds no licensing risk.
3. **Confirm the current kanban PNG should be replaced**, since it is referenced
   in two places (FAQ and index).

---

## 7. Italian sticky-nav lettering — DONE (verified)

```css
:lang(it) .nav-links { font-size:12.5px; gap:17px; letter-spacing:-.005em }
:lang(ru) .nav-links { font-size:12.5px; gap:17px; letter-spacing:-.005em }
```

- **12.5px** — above the **12px minimum floor** you specified. It is a reduction
  from the 14px base.
- Same treatment applied to Russian for consistency.
- **Touch targets unaffected** — this changes the inline anchor font-size in the
  desktop nav bar only. The nav collapses to a hidden `.nav-links` below 860px,
  and the mobile controls (theme, language, Sign in, Book a Demo) are separate
  `.icon-btn` / `.btn` elements with their own ≥44px minimum heights, untouched
  by this rule. Verified no duplicate attributes and no horizontal overflow.

---

## WhatsApp number — options and my recommendation

Currently `393450234084` is hardcoded in **many places** (footer, contact blocks,
Elisa widget, both articles, every language variant) and still flagged
"verify" in `site-config.js`.

**Option A — runtime only.** Keep one value `LEXFLOW_CONFIG.whatsapp`; JS
substitutes every `href` on load. *Pros:* one place to edit, no rebuild.
*Cons:* without JS the links keep whatever is in the HTML.

**Option B — build-time stamp.** Treat it like `ORIGIN`: keep it in
`site-config.js`, and have `build-lang-sites.py` write the real number into every
`href` and `wa.me` link across all 27 pages. *Pros:* works with JS disabled, and
the value is still edited in exactly one place. *Cons:* requires running the
generator after a change.

**Option C — both (my recommendation).** Single source of truth in
`site-config.js`; the generator stamps it into the HTML at build time **and** JS
reads it at runtime for anything added dynamically (the Elisa widget's WhatsApp
CTA). Change one line, run the generator, done — and no-JS visitors still get the
right number.

*Why this is safe:* a WhatsApp number is deliberately public marketing information,
so there is no secret to protect. The real risk is **staleness** — a number
changed in one file but not the other 26 pages — and Option C eliminates it.

Tell me which you want and I'll implement it. **Also still needs confirming: is
`393450234084` the final number?**

---

## Cloudflare deploy — REMINDER (noted, not forgotten)

You want this deployed via Cloudflare. Held in the project memory.

**Blocking prerequisite:** `ORIGIN` in `templates/build-lang-sites.py` is still
`https://lexflow.example.com`, and it is baked into **26 sitemap URLs, 4 hreflang
tags × 24 pages, and every `canonical` and `og:url`**. Publishing as-is tells
search engines the canonical version of every page lives on a domain that does
not exist.

Sequence once you give me the domain: set `ORIGIN` → re-run the generator → verify
zero `example.com` references remain → show you the local result → wait for your
go-ahead → deploy.

---

## Everything still pending your input

| # | Item | Blocking what |
|---|---|---|
| 1 | Public CRM URL + endpoint choice | The form and Elisa actually delivering leads |
| 2 | CRM CORS allow-origin | Any browser POST from the site's origin |
| 3 | Real domain | Cloudflare deploy; canonical/hreflang/sitemap correctness |
| 4 | Article IT/RU body text | The largest remaining audit block (~340 strings) |
| 5 | Newsletter: drop / relocate / restore | Item 5 sign-off |
| 6 | Kanban: anonymisation + image source/licence | Item 6 |
| 7 | Webhook URLs (27 keys) | Lead routing and analytics |
| 8 | WhatsApp: final number + option A/B/C | Number consistency |

## Handed to other profiles

- **operator-installer** — kanban card `t_d6065167`: the `aLEXy` naming
  correction, the missing `/api/chatbot`, the `401` on the chatbot webhook, the
  `POST /submit` route, and the CORS origin. Includes your two questions: can the
  naming be fixed now, and what is blocking if not.
- **memory-curator** — kanban card `t_6c2c8c07`: session recap, decisions,
  blockers and the Cloudflare reminder.

Note: the cards are queued in `ready`. `operator-installer` has a gateway running
(PID 12005), so its card should be picked up; the CLI warned that no gateway is
running for the default board, so if nothing moves, run `hermes gateway run`.
