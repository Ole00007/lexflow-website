# Lexflow — Cookie Consent, Privacy and CMP Implementation Specification

**Purpose:** implementation brief for Hermes for the Lexflow website. It contains production-ready UI copy, consent behaviour, data model, cookie-register template, technical acceptance criteria, and reference examples.

> **Scope note:** This is a product and implementation specification, not legal advice. Before launch, replace all `[PLACEHOLDER]` fields with verified data from the deployed stack and have the final Cookie Policy / Privacy Notice reviewed for Lexflow's actual controller details, vendors, countries and data flows.

## 1. Baseline legal framework

Lexflow is an Italian/EU-facing website. The relevant framework is:

- GDPR, especially consent requirements: consent must be freely given, specific, informed and unambiguous.
- The ePrivacy rules implemented in Italy, including the Italian Data Protection Authority (**Garante**) Cookie and Tracking Tools Guidelines of 10 June 2021.
- Consent is required **before** setting or reading non-essential cookies / comparable tracking technologies. Strictly necessary cookies may operate without consent.
- The first-layer banner must let a visitor accept or refuse non-essential tracking with comparable ease and prominence. Do not make refusal harder than acceptance.
- No pre-ticked categories, no consent inferred from scrolling, inactivity or merely closing the page.
- The user must be able to reopen and change consent easily at any time.

Authoritative starting points:

- Garante Privacy: [Cookie and other tracking tools guidelines](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876)
- European Commission: [GDPR overview](https://commission.europa.eu/law/law-topic/data-protection/data-protection-eu_en)
- EDPB: [Guidelines on consent](https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-052020-consent-regulation-2016679_en)

## 2. Product decision for Lexflow

### Required choice model

Use an **opt-in** consent-management platform (CMP) or a custom consent layer with equivalent capabilities.

At first visit, Lexflow must show a modal/banner before any analytics, advertising, session-recording, social-media pixels or other non-essential tracker loads.

The first layer must show all three actions:

1. `Accept all`
2. `Reject non-essential`
3. `Manage preferences`

`Accept all` and `Reject non-essential` must have the **same visual weight**:

- Same button dimensions.
- Same font size and contrast.
- Same visual hierarchy.
- One click for each choice.
- Neither may be hidden behind the settings panel.

`Manage preferences` may be a secondary button/link, but it must be clear and easy to find.

### Default state

| Category | Default | Can user change it? | May scripts load before consent? |
|---|---:|---:|---:|
| Strictly necessary | On | No | Yes |
| Functional / preferences | Off | Yes | No |
| Analytics | Off | Yes | No |
| Marketing / advertising | Off | Yes | No |

Do **not** currently create categories that Lexflow does not actually use. If Lexflow only uses strictly necessary cookies, do not show a consent banner; provide an accessible Cookie Policy and a footer link. If Lexflow uses analytics or any advertising / retargeting, use the banner described here.

### Recommended stack

For speed and auditability, prefer a recognised CMP rather than creating consent logic from scratch:

- [Cookiebot by Usercentrics](https://www.cookiebot.com/) — automated scanning/classification and consent controls.
- [CookieYes](https://www.cookieyes.com/) — CMP and cookie scanning.
- [iubenda](https://www.iubenda.com/) — useful for Italian/EU policy and consent tooling.

The chosen CMP must be configured to block non-essential tags prior to consent. A visual banner alone is not enough.

## 3. Production-ready banner copy

### Locale strategy

Default locale: English, if the public Lexflow product is English-first.

Add Italian before or at Italian-market launch. If Lexflow actively targets Russian-speaking users, Russian may be offered as a convenience locale, but English/Italian legal notices must remain authoritative as stated in the policy.

### English — first layer

**Title**

`Your privacy choices`

**Body**

`Lexflow uses strictly necessary cookies to make the website work. With your permission, we also use optional cookies and similar technologies to understand how the site is used and to measure or personalise marketing. You can accept all optional cookies, reject them, or choose by category. You can change your choice at any time in Cookie Settings.`

**Buttons**

- Primary-equivalent button: `Accept all`
- Primary-equivalent button: `Reject non-essential`
- Secondary button/link: `Manage preferences`
- Policy link: `Cookie Policy`
- Policy link: `Privacy Notice`

**Close control**

If an `X` close control is used, it must keep the default state: strictly necessary only. It must not record consent for optional categories.

### Italian — first layer

**Title**

`Le tue preferenze sulla privacy`

**Body**

`Lexflow utilizza cookie strettamente necessari per il funzionamento del sito. Solo con il tuo consenso utilizziamo cookie e tecnologie analoghe facoltativi per comprendere l'utilizzo del sito e per misurare o personalizzare le attività di marketing. Puoi accettare tutti i cookie facoltativi, rifiutarli oppure scegliere per categoria. Puoi modificare la tua scelta in qualsiasi momento nelle Impostazioni cookie.`

**Buttons**

- `Accetta tutti`
- `Rifiuta i cookie non necessari`
- `Gestisci preferenze`
- `Cookie Policy`
- `Informativa Privacy`

### Russian — first layer (optional convenience translation)

**Title**

`Ваши настройки конфиденциальности`

**Body**

`Lexflow использует строго необходимые cookie для работы сайта. Только с вашего согласия мы также используем необязательные cookie и аналогичные технологии, чтобы понимать, как используется сайт, а также измерять или персонализировать маркетинг. Вы можете принять все необязательные cookie, отклонить их или выбрать категории отдельно. Вы можете изменить выбор в любой момент в разделе «Настройки cookie».`

**Buttons**

- `Принять все`
- `Отклонить необязательные cookie`
- `Настроить предпочтения`
- `Политика cookie`
- `Политика конфиденциальности`

## 4. Preference-centre copy

### English

**Heading**

`Cookie preferences`

**Intro**

`Choose which optional categories Lexflow may use. Strictly necessary cookies are always active because they are needed to provide the site and protect it from abuse.`

**Category 1 — always enabled**

`Strictly necessary`

`These cookies are required for core website functions, security, load balancing, fraud prevention, remembering your cookie choice and, where applicable, authentication. They cannot be switched off in our systems.`

Toggle label: `Always active`

**Category 2**

`Functional`

`These cookies remember choices such as language, interface preferences or embedded-content settings. They are not required for the website to work.`

Toggle default: `Off`

**Category 3**

`Analytics`

`These cookies help us understand how visitors use Lexflow, such as pages viewed, traffic source, device type and site performance. We use aggregated reporting to improve the product and website.`

Toggle default: `Off`

**Category 4**

`Marketing`

`These cookies and similar technologies may be used to measure campaigns, build audiences, limit repeated ads and show advertising that is more relevant to you on third-party services. They may be set by Lexflow or by our advertising partners.`

Toggle default: `Off`

**Actions**

- `Accept all`
- `Reject non-essential`
- `Save my choices`
- `Back`

### Italian

**Titolo**

`Preferenze sui cookie`

**Introduzione**

`Puoi scegliere quali categorie facoltative Lexflow può utilizzare. I cookie strettamente necessari rimangono sempre attivi perché necessari per fornire il sito e proteggerlo da utilizzi illeciti.`

**Cookie strettamente necessari**

`Sono necessari per le funzionalità essenziali del sito, la sicurezza, il bilanciamento del carico, la prevenzione delle frodi, la memorizzazione della scelta sui cookie e, ove applicabile, l'autenticazione. Non possono essere disattivati nei nostri sistemi.`

Etichetta: `Sempre attivi`

**Funzionali**

`Memorizzano scelte come lingua, preferenze dell'interfaccia o impostazioni per contenuti incorporati. Non sono necessari per il funzionamento del sito.`

**Analitici**

`Ci aiutano a comprendere come i visitatori utilizzano Lexflow, ad esempio pagine visitate, provenienza del traffico, tipo di dispositivo e prestazioni del sito. Utilizziamo report aggregati per migliorare prodotto e sito.`

**Marketing**

`Questi cookie e tecnologie analoghe possono essere utilizzati per misurare le campagne, creare pubblici, limitare la ripetizione degli annunci e mostrare pubblicità più pertinente su servizi di terze parti. Possono essere impostati da Lexflow o dai partner pubblicitari.`

**Azioni**

- `Accetta tutti`
- `Rifiuta i cookie non necessari`
- `Salva le mie preferenze`
- `Indietro`

## 5. Cookie Policy — precise draft

> Publish this as `/cookie-policy`. It must be updated after a pre-launch cookie scan and whenever a tag, embedded service or vendor changes.

# Cookie Policy

**Last updated:** `[DATE]`

## 1. Who we are

This Cookie Policy explains how **[LEGAL COMPANY NAME]**, with registered office at **[REGISTERED ADDRESS]**, VAT / company number **[NUMBER]** (`Lexflow`, `we`, `us`), uses cookies and similar technologies on **[https://lexflow.example]** (the `Website`).

For questions about cookies or personal-data processing, contact us at **[privacy@lexflow.example]** or **[PEC / postal address]**.

## 2. What cookies and similar technologies are

Cookies are small text files stored on your device when you visit a website. Similar technologies can include local storage, pixels, SDKs, tags and device identifiers. They may be used to make the Website function, protect it, remember choices, analyse use or measure marketing activity.

## 3. How Lexflow uses them

Lexflow uses the following categories:

| Category | Purpose | Legal basis | Consent required? |
|---|---|---|---:|
| Strictly necessary | Operation, security, fraud prevention, load balancing, authentication, remembering cookie preferences | Legitimate interest and/or necessity to provide the requested service, as applicable | No |
| Functional | Remembering optional settings and enabling optional embedded features | Consent | Yes |
| Analytics | Understanding site usage and improving performance/product experience | Consent, unless a verified configuration qualifies as exempt under applicable Italian guidance | Usually yes |
| Marketing | Measuring campaigns, retargeting, audience creation and delivering relevant advertising | Consent | Yes |

## 4. Your choices

When you first visit the Website, you may:

- accept all optional cookies;
- reject all non-essential cookies; or
- select categories individually.

Optional cookies are disabled by default and are not activated unless you make an affirmative choice. You can withdraw or change consent at any time through **Cookie Settings** in the Website footer.

Withdrawing consent does not affect the lawfulness of processing based on consent before its withdrawal.

## 5. Cookie register

The list below must reflect the production deployment. Do not publish illustrative vendors that are not actually present on Lexflow.

| Provider / cookie | Category | Purpose | Duration | First / third party | Data location / transfer note |
|---|---|---|---|---|---|
| `[consent_cookie_name]` | Strictly necessary | Stores consent choices | `[duration]` | First party | `[EEA / details]` |
| `[session_cookie_name]` | Strictly necessary | Session, authentication or security | `[duration]` | First party | `[EEA / details]` |
| `[analytics_vendor + cookie names]` | Analytics | Usage measurement | `[duration]` | `[first/third]` | `[transfer safeguards if applicable]` |
| `[marketing_vendor + pixel/cookie names]` | Marketing | Campaign measurement / retargeting | `[duration]` | Third party | `[transfer safeguards if applicable]` |
| `[embedded_provider + cookie names]` | Functional or Marketing | Embedded content | `[duration]` | Third party | `[transfer safeguards if applicable]` |

## 6. Third parties and international transfers

Where optional third-party providers process personal data, they may process data outside the European Economic Area. Before enabling any such provider, Lexflow will identify the provider, the relevant transfer mechanism and safeguards in the Cookie Policy and/or Privacy Notice, as applicable.

## 7. Managing browser cookies

Most browsers let you delete or block cookies through browser settings. Blocking some cookies may affect Website functionality. Browser-level controls do not replace the choices available in Lexflow Cookie Settings.

## 8. Changes to this Cookie Policy

We may update this Policy to reflect changes in technology, legal requirements or our use of tracking technologies. The `Last updated` date shows when the Policy was last revised. Where required, Lexflow will request consent again before enabling materially changed optional tracking.

## 9. Contact and complaints

For questions, contact **[privacy@lexflow.example]**. You may also have the right to lodge a complaint with the competent supervisory authority, including the Italian Garante per la protezione dei dati personali where applicable.

## 6. Technical implementation requirements

### A. Consent must control loading, not merely reporting

Before consent, block:

- Google Analytics / Google Tag Manager tags that create or read non-essential identifiers.
- Meta Pixel / Conversions API identifiers, LinkedIn Insight Tag, TikTok Pixel and ad-platform tags.
- Hotjar, Microsoft Clarity, FullStory and other session-recording / heatmap tools.
- YouTube, Vimeo, Calendly, chat widgets, maps and other third-party embeds that set non-essential cookies.
- A/B testing, attribution, affiliate, behavioural analytics and fingerprinting scripts.

Load only strictly necessary resources before an affirmative decision.

### B. Google Tag Manager

If GTM is present, do not use it as a reason to load all tags immediately. Configure consent mode / CMP integration so each tag has a category dependency. Test in a clean browser profile and verify that declined tags never fire.

### C. Embedded media and external services

Use a two-click / privacy-enhanced embed pattern:

1. Initially show a placeholder: `This content is provided by [Provider]. Loading it may allow [Provider] to set cookies and process data. Choose “Accept [category] cookies” to load it.`
2. Give the visitor an action to enable the relevant category or open Cookie Settings.
3. Do not load the iframe or vendor script before that action.

### D. Consent record

Maintain a consent record sufficient to demonstrate:

- consent identifier or pseudonymous event identifier;
- date/time and policy version;
- locale;
- categories accepted/rejected;
- CMP version;
- evidence that no optional categories were pre-selected.

Do not store raw IP addresses in the consent record unless there is a documented necessity and valid legal basis.

### E. Renewal and withdrawal

- The footer must include a persistent `Cookie Settings` link on every public page.
- Withdrawal must be as easy as consent.
- On withdrawal, stop future optional tracking and delete first-party optional cookies where technically possible.
- Renew consent at appropriate intervals and after material changes in vendors/purposes. For Italian implementation, do not re-prompt persistently or more frequently than justified; the Garante guidance discusses a six-month interval as a reference point in the absence of changed conditions.

### F. No dark patterns

Prohibited patterns:

- Pre-checked category toggles.
- An oversized / brightly coloured `Accept all` button with a hidden, muted or text-only refusal route.
- Requiring more clicks to reject than to accept.
- Interpreting scroll, continued browsing, inactivity or closing the banner as consent.
- Blocking all access merely because a visitor rejects non-essential cookies, unless a narrow, legally reviewed alternative-access model applies.
- Repeatedly showing the banner to pressure a visitor after a valid refusal.

## 7. Developer acceptance tests

Hermes must treat all items below as release blockers.

| Test | Expected result |
|---|---|
| Fresh visit with no consent stored | Only strictly necessary cookies/network calls occur; banner appears |
| Click `Reject non-essential` | No Analytics, Functional or Marketing tags/cookies fire; choice is stored |
| Click `Accept all` | All configured categories activate; choice is stored |
| Choose Analytics only | Analytics starts; marketing and functional vendors remain blocked |
| Close with `X` | Equivalent to retaining strictly necessary defaults; no optional tags fire |
| Open Cookie Settings after accepting | Visitor can revoke one or all optional categories |
| Revoke Marketing | Marketing pixels/scripts stop; first-party marketing cookies are removed where possible |
| Load YouTube/Vimeo/Calendly before consent | No provider iframe/tag loads; placeholder is visible |
| Mobile screen 320 px wide | All choices remain visible, readable, and equally actionable |
| Keyboard-only navigation | Banner and toggles can be reached, operated and dismissed accessibly |
| Screen reader | Buttons and toggles have clear labels/states; modal focus is managed correctly |
| Browser DevTools Network check | No blocked-vendor requests appear before category consent |
| Cookie scan after deployment | Published cookie register matches observed cookies, local storage, pixels and third-party endpoints |

## 8. Recommended information architecture

Public footer links:

- Privacy Notice
- Cookie Policy
- Cookie Settings
- Terms of Service
- Data Processing Addendum (if Lexflow sells B2B SaaS and processes customer data)
- Subprocessors (if relevant)

Suggested URLs:

- `/privacy`
- `/cookie-policy`
- `/cookie-settings` or CMP modal trigger
- `/terms`
- `/dpa`
- `/subprocessors`

## 9. Useful implementation and writing examples

These are references for structure and patterns, not templates to copy blindly. Lexflow must publish only its own verified cookies, vendors and purposes.

| Website / resource | Why review it | Link |
|---|---|---|
| Cookiebot | CMP, cookie scanning and preference-centre implementation patterns | [Cookiebot CMP](https://www.cookiebot.com/) |
| CookieYes | Cookie-policy structure and CMP examples | [CookieYes cookie-policy examples](https://www.cookieyes.com/blog/cookie-policy-examples/) |
| Intercom | B2B SaaS privacy/legal-centre information architecture | [Intercom legal](https://www.intercom.com/legal) |
| Notion | Product-company privacy and cookie documentation structure | [Notion Cookie Policy](https://www.notion.so/help/cookie-policy) |
| Slack | SaaS legal-centre organisation and cookie-policy navigation | [Slack legal](https://slack.com/legal) |
| Figma | B2B SaaS privacy documentation and policy structure | [Figma privacy](https://www.figma.com/privacy/) |
| Garante Privacy | Primary Italian guidance for cookie/tracker use | [Garante Cookie Guidelines](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876) |

## 10. Inputs Hermes must obtain before deployment

Do not finalise the public policy or activate a CMP until the following are known:

1. Exact legal controller name, registered address, VAT/company number, privacy contact and PEC where applicable.
2. Whether Lexflow is operating as sole trader, Italian company, EU company or another entity.
3. Deployment architecture: domain/subdomains, hosting, CDN, authentication and error monitoring.
4. All frontend packages and tags: GTM, GA4, Meta, LinkedIn, TikTok, PostHog, Plausible, Mixpanel, Sentry, Hotjar/Clarity, cookie CMP, chat, CRM, calendar, video, maps, payment and affiliate services.
5. Whether each provider sets cookies, uses local storage, creates identifiers, records sessions or transfers data outside the EEA.
6. Cookie name, purpose, category, party, expiration, recipient and transfer mechanism for each production tracker.
7. Whether analytics can be configured in a genuinely privacy-preserving / exempt manner under Italian guidance; obtain legal confirmation rather than assuming exemption.
8. Whether the site targets children, collects special-category data or embeds third-party content by default.
9. The consent-retention period and method.
10. Who owns ongoing monitoring: a named person must re-scan after releases and update the register/policy.

## 11. Final launch checklist

- [ ] All optional trackers blocked before consent.
- [ ] `Accept all` and `Reject non-essential` equally prominent and one click each.
- [ ] Optional toggles off by default.
- [ ] A clear `Manage preferences` route is present.
- [ ] `Cookie Settings` persistent in footer.
- [ ] No tracking consent inferred from scrolling, continued browsing or closing.
- [ ] Cookie Policy includes the verified, live cookie register.
- [ ] Privacy Notice identifies Lexflow and relevant recipients/transfer safeguards.
- [ ] Vendor contracts and DPA/subprocessor assessments completed where relevant.
- [ ] DevTools and independent cookie scan performed in a clean browser profile.
- [ ] Consent/revocation event tested on desktop and mobile.
- [ ] Accessible keyboard and screen-reader behaviour tested.

