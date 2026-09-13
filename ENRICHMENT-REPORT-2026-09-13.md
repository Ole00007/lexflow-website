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

---

# Batch 2 — 2026-09-13, later session

Owner decisions received and acted on. Commit `471d033`.

## WhatsApp — Option C implemented

Two values, one file: **`assets/site-config.js`**

```js
whatsapp: "393450234084",           // digits only, used for wa.me links
whatsappDisplay: "+39 345 023 4084", // the human-readable form
```

`build-lang-sites.py` stamps both into every page at build time (so no-JS
visitors get the right number too), and the runtime reads the same config for
anything JavaScript adds — Elisa's CTA and the floating button.

**Proven:** changing both values and regenerating rewrote **98 wa.me links** and
**38 displayed numbers** across all 27 pages, leaving **zero** occurrences of the
old number anywhere.

**Still needs you:** confirm `393450234084` is final. You said you would confirm
shortly — until then the site carries the number currently in config.

## FAQ images

- **Done:** the schematic "notifications" image is replaced by the approved
  `romanelli-sala-riunioni.png` in all three languages.
- **Still blocked:** the Kanban image. Confirm the `/kanban` sample data is
  anonymised before I screenshot it.
- **You asked about "the old kanban cards":** I have not created any cards on the
  CRM's `/kanban` board. The "kanban cards" I reported creating were **Hermes
  kanban tasks** for handing work to other profiles — a different thing with a
  confusingly similar name. Nothing was added to the CRM board. So if the board
  still shows old sample cards, that is expected: I have not touched it.
  Say the word and I can populate the CRM board with anonymised sample cards, but
  that is a CRM-side write and I would want your explicit go-ahead first.

## Handed-off tasks — they FAILED, and here is why

Both tasks are now `blocked`, and the log gives the reason:

```
No access token found for Nous Portal login. Run `hermes model` to re-authenticate.
```

The worker profiles spawn, immediately exit (`rc=0`), and never call
`kanban_complete` — reported as a protocol violation. This is **not** a stalled
gateway, so `hermes gateway run` would not have fixed it.

**Action needed from you:** run `hermes model` and re-authenticate, then unblock
the two cards (`hermes kanban unblock t_d6065167` and `t_6c2c8c07`) so they are
retried. Until then the CRM questions reach nobody.

## Also fixed in this pass

Two generator safety guards, both prompted by real failures found here:

1. **The English-page loop must read its own page before writing.** An earlier
   version of this change reused a stale loop variable and **overwrote all ten
   English pages with the last localised page** — the site briefly had Russian
   article content at English URLs. Caught and restored from git within the same
   session. There is now a guard that snapshots every English page title up front
   and aborts the build if a page comes out with different content, plus an
   assertion that each page keeps `lang="en"`.
2. **Any malformed `wa.me` link aborts the build.** A display-substitution
   pattern previously matched the digits inside a `wa.me` URL and would have
   published `wa.me/+39 345 023 4084`. Two patterns also silently degraded to
   "matches nothing" after surviving two layers of source escaping; both are now
   built from character classes with no backslash escapes, and verified
   idempotent across consecutive runs.

## Updated pending list

| # | Item | Status |
|---|---|---|
| 1 | Public CRM URL + endpoint choice | **open** — blocks lead delivery |
| 2 | CRM CORS allow-origin | **open** |
| 3 | Real domain | **open** — you sent `[insert real domain]` literally, so I still need the actual string |
| 4 | Article IT/RU body text | ongoing, not blocking (your call) |
| 5 | Newsletter | **resolved** — dropped, keys kept |
| 6 | Kanban anonymisation confirmation | **open** |
| 7 | Webhook URLs (27 keys) | **open** |
| 8 | WhatsApp final number | **open** — Option C built and proven |
| 9 | `hermes model` re-auth for worker profiles | **open** — blocks the handoffs |

---

# Batch 3 — humanizer pass, and the exact cause of the blocked handoffs

Commit `63f46d4`. Owner decisions 1–5 from the previous round are all applied.

## Humanizer pass — 259 replacements, 34 distinct strings, EN/IT/RU

Em dash overuse (pattern 14) was the main finding; the copy was otherwise already
free of AI-isms. Prose em dashes became commas, periods or colons. The final dash
was also inconsistent (a plain hyphen in some strings, an em dash in others) and
is now normalised. Accent-accordion titles use a colon consistently.

Your example is applied: Russian **"Напишите нам." → "Свяжитесь с нами."**
0 occurrences of the old phrasing remain; 18 of the new.

Italian and Russian got the equivalent treatment rather than only the English
being edited, so the three languages stay parallel.

## Two real bugs found while humanising — both were live on the site

**1. Italian rendered inside English pages.** The runtime only cleared an
element's *direct* text nodes when swapping language. `<em>disordine</em>` is a
single Element node, so that Italian word survived and the English home page
rendered:

- `Every legal firm loses time to chaosdisordine`
- `Gli studi che usano LexFlow chiudono di più.più.`

`setText` now walks all descendant text nodes with a TreeWalker, matching what the
build script's `localise_inner` already did.

**2. Italian values sitting in the English dictionary slot.** 13 dictionary values
and 16 static elements held Italian, so English visitors read Italian:
`why_results_title/sub`, `problem_label/title/sub`, `problem1_h/p`, `problem3_h/p`,
`contact_intro`, `contact_consent1/2`, `contact_privacy`, `contact_submit`,
`contact_name`, `contact_message`, `chatbot_greeting/note/status_new`,
`contact_title`.

Verified in the browser afterwards: the English page now reads "Firms using
LexFlow close more.", "Every legal firm loses time to chaos", English consent
checkboxes, "Name" / "Message" / "Send request".

## Item 2 confirmed — Kanban visual replaced

You confirmed the board data is anonymised. In practice the board is **behind a
login**, so I could read the column structure but no card data. I did not attempt
to log in, and no credentials were used.

So the artefact is built from the real structure with placeholder matters only:

- **Real columns read off the live board:** Intake, Conflict Check, Review,
  In Progress, Waiting Docs, To Verify, Engaged, Closed.
- Clean three-column excerpt (a partial view, per your earlier instruction not to
  publish a raw full-board screenshot).
- Palette and typography taken from `assets/style.css`, not from the CRM, so it
  is UI-native here: gold `#D4AF37` on the surface/navy ground, Inter, same
  border and radius treatment.
- Rendered at 1600×1200 (4:3) to match `.preview-visual`'s aspect-ratio exactly,
  so `object-fit: cover` does not crop it.
- Source kept at `templates/kanban-artefact.html` so it can be edited or
  regenerated rather than only replaced.
- No client names, no real matters.

The FAQ "notifications" image is now the approved `romanelli-sala-riunioni.png`.

---

# Item 5 — the blocked handoffs, explained, with what to run

## What is actually wrong

`hermes model` performs the **Nous Portal OAuth login**. Each Hermes profile has
its **own** credential store at `~/.hermes/profiles/<name>/auth.json`, so logging
in as one profile does nothing for the others.

Status right now, checked directly:

| Profile | Nous Portal |
|---|---|
| `default` | logged in |
| `operator-installer` | **logged out** |
| `memory-curator` | **logged out** |
| `lexflow_dev_head_admin` | **logged out** |

The dispatcher runs under `operator-installer`'s gateway (PID 12005). Every
worker it spawns exits immediately with:

```
No access token found for Nous Portal login. Run `hermes model` to re-authenticate.
```

That is why the workers exit `rc=0` without calling `kanban_complete` — logged as
a protocol violation. **This is an auth problem, not a gateway problem**, so
`hermes gateway run` would not have fixed it.

## What to run — one command per profile

Each opens your browser for the OAuth flow:

```bash
hermes -p operator-installer model
hermes -p memory-curator model
hermes -p lexflow_dev_head_admin model
```

Confirm it worked:

```bash
hermes -p operator-installer auth status nous     # expect: nous: logged in
```

Then retry the four cards:

```bash
hermes kanban unblock t_d6065167 t_6c2c8c07 t_85d62411 t_76668155
```

## Alternative that avoids the browser login

`operator-installer` already holds a working **OpenRouter** credential in its pool
and `OPENROUTER_API_KEY` is present in its `.env`, while its config points at the
Nous provider:

```yaml
model:
  default: deepseek/deepseek-v4-flash
  provider: nous
```

Switching `provider` to `openrouter` would sidestep the login entirely, but the
model id would also need to change to OpenRouter's naming for that model, and it
changes how every worker reasons.

**My recommendation:** do the Nous re-login. It is the smaller change, it keeps
the workers on the model you already chose, and it fixes all three profiles at
once. I have **not** touched another profile's config — that is yours to approve.

## Docs

- Base: https://hermes-agent.nousresearch.com/docs — verified it returns 200.
- I could not extract the deep links to the auth pages: the web-extraction tooling
  is failing right now with a DNS error resolving `firecrawl-gateway.nousresearch.com`.
  The commands above are verified locally, which is the part that matters.
- Fastest in-tool reference: `hermes model --help` and `hermes auth --help`.

---

# Handoffs passed (both profiles, as asked)

| Card | Assignee | Contents |
|---|---|---|
| `t_85d62411` | operator-installer | The four questions: public lead endpoint, CORS, aLEXy naming, and **what is blocking him** — for you to get an answer back |
| `t_76668155` | memory-curator | Full batch-3 recap: humanizer work, both leakage bugs, WhatsApp Option C, the Kanban artefact, and the reusable lesson about escaping in the build script |
| `t_d6065167`, `t_6c2c8c07` | both | The earlier cards, still blocked — unblock after re-auth |

All four sit in `ready`/`blocked` until the re-auth is done.

---

# Everything still to do — consolidated

| # | Item | Status |
|---|---|---|
| 1 | Cloudflare deploy | Waiting on you approving a version; you then supply the domain |
| 2 | Kanban anonymisation | **done** — artefact shipped |
| 3 | WhatsApp number | **confirmed as-is**; Option C built and proven |
| 4 | CRM endpoint + CORS | Question handed to operator-installer; awaiting his reply |
| 5 | Worker re-auth | **explained above** — needs you to run 3 commands |
| 6 | Domain in `ORIGIN` | Blocked on #1. Still `https://lexflow.example.com`, baked into 26 sitemap URLs, 4 hreflang tags × 24 pages, every canonical |
| 7 | 27 webhook URLs | Declared as `null`; they log a warning instead of sending |
| 8 | Article IT/RU bodies | You are sending in batches; not blocking |
| 9 | Elisa widget pre-localisation | Crawler-only gap; visitors already see correct IT/RU |
