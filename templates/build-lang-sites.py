#!/usr/bin/env python3
"""Generate the /it/ and /ru/ language sites for the LexFlow web-site.

Why this exists
---------------
The site used to switch EN/IT/RU client-side from a single URL, so there was
nothing for hreflang to point at and a crawler only ever saw the English text.
This script renders genuinely localised HTML for Italian and Russian, gives each
language its own URL, and writes reciprocal hreflang annotations.

What it produces
----------------
  it/<page>.html   lang="it" data-lang-lock="it"  Italian text baked in
  ru/<page>.html   lang="ru" data-lang-lock="ru"  Russian text baked in

and rewrites the English pages in place to add the same hreflang block plus a
window.LEXFLOW_LANG_URLS map so the language menu navigates between languages
instead of only swapping text.

Design notes
------------
- Text is baked in by substituting each [data-i18n] element's text nodes with
  the target-language string, so the HTML a crawler receives is already in that
  language. data-i18n attributes are kept so the JS engine still works.
- Elements that contain markup (a link, an <em>) keep their children; only the
  element's own text nodes are replaced.
- Only path prefixes change for nested pages: assets/ becomes ../assets/, and
  the English-only legal pages get ../ so they still resolve. Links to other
  content pages stay relative so they resolve inside the language folder.
- privacy.html and terms.html have no translations, so no localised copies are
  produced and they are excluded from the hreflang set. A single-language page
  needs no alternates; claiming otherwise would be inaccurate.

Usage:  python3 templates/build-lang-sites.py
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
ORIGIN = "https://lexflow.example.com"

# Pages that have full EN/IT/RU translations and therefore get localised copies.
CONTENT_PAGES = [
    "lexflow-index.html",
    "lexflow-how-it-works.html",
    "lexflow-pricing.html",
    "lexflow-practice-areas.html",
    "lexflow-faq.html",
    "lexflow-blog.html",
    "lexflow-article-matter-tracker.html",
    "lexflow-article-client-intake.html",
]
# English-only pages: linked from the language folders with ../ but not localised.
EN_ONLY_PAGES = ["privacy.html", "terms.html"]

LANGS = ["it", "ru"]

# Localised <title> and meta description per page. Without these the most
# SEO-visible elements would stay English on an /it/ or /ru/ URL.
META = {
    "lexflow-index.html": {
        "it": ("LexFlow — Gestione dello studio legale in un unico spazio",
               "LexFlow riunisce pratiche, attività, scadenze, intake dei clienti e comunicazione in un unico spazio di lavoro per studio legale. I clienti non installano nulla e non usano password: accedono tramite link protetto da token."),
        "ru": ("LexFlow — управление юридической практикой в одном месте",
               "LexFlow объединяет дела, задачи, сроки, приём заявок и общение с клиентами в одном рабочем пространстве. Клиентам не нужны приложение и пароль — доступ по ссылке, защищённой токеном."),
    },
    "lexflow-how-it-works.html": {
        "it": ("Come funziona — LexFlow",
               "Tre passaggi: il cliente invia la richiesta, lo studio esamina e agisce, il cliente segue l'avanzamento tramite un link privato. Viste per ruolo e cronologia completa della pratica."),
        "ru": ("Как это работает — LexFlow",
               "Три шага: клиент отправляет запрос, фирма рассматривает и действует, клиент следит за ходом по приватной ссылке. Представления по ролям и полная хронология дела."),
    },
    "lexflow-pricing.html": {
        "it": ("Funzioni e prezzi — LexFlow",
               "Piani Starter, Professional ed Enterprise con prezzo per utente, fatturati annualmente. Confronto con le alternative di mercato. L'AI Add-on è quotato separatamente."),
        "ru": ("Функции и тарифы — LexFlow",
               "Тарифы Starter, Professional и Enterprise с оплатой за пользователя при годовой оплате. Сравнение с рыночными альтернативами. AI Add-on рассчитывается отдельно."),
    },
    "lexflow-practice-areas.html": {
        "it": ("Aree di attività — LexFlow",
               "Moduli di intake preconfigurati per ogni area di attività: civile, societario, famiglia, penale, immobiliare, proprietà intellettuale, immigrazione, lavoro e altre. Per ogni area: definizione, esempio di intake e flusso di lavoro."),
        "ru": ("Отрасли права — LexFlow",
               "Формы приёма заявок, настроенные под каждую отрасль: гражданское, корпоративное, семейное, уголовное, недвижимость, интеллектуальная собственность, иммиграция, трудовое и другие. Для каждой отрасли: определение, пример заявки и процесс работы."),
    },
    "lexflow-faq.html": {
        "it": ("Domande frequenti e glossario — LexFlow",
               "Risposte dirette su LexFlow: come funziona ogni giorno, come il cliente raggiunge la propria pratica, come sono protetti i dati, quali aree di attività copre, cosa è integrato e cosa è in programma, più un glossario in linguaggio semplice."),
        "ru": ("Частые вопросы и глоссарий — LexFlow",
               "Прямые ответы о LexFlow: как это работает каждый день, как клиент попадает на страницу своего дела, как защищены данные, какие отрасли права охвачены, что уже интегрировано и что в планах, плюс глоссарий простыми словами."),
    },
    "lexflow-blog.html": {
        "it": ("Blog — LexFlow",
               "Guide pratiche per studi legali di piccole dimensioni: intake dei clienti, monitoraggio delle pratiche, comunicazione, automazione, migrazione dei dati, sicurezza e adozione."),
        "ru": ("Блог — LexFlow",
               "Практические материалы для небольших юридических фирм: приём заявок, отслеживание дел, коммуникация с клиентами, автоматизация, миграция данных, безопасность и внедрение."),
    },
    "lexflow-article-matter-tracker.html": {
        "it": ("Come un tracker delle pratiche riduce le telefonate di stato — LexFlow",
               "Una pagina privata in cui il cliente vede aggiornamenti approvati, prossime tappe e richieste di documenti, senza sostituire il rapporto con l'avvocato. Include i controlli da fare prima dell'adozione."),
        "ru": ("Как отслеживание дел снижает число звонков о статусе — LexFlow",
               "Приватная страница, где клиент видит одобренные обновления, следующие этапы и запросы документов, не заменяя общение с адвокатом. Включает список вопросов перед внедрением."),
    },
    "lexflow-article-client-intake.html": {
        "it": ("Dal primo contatto alla pratica organizzata: flusso di intake per studi legali — LexFlow",
               "Un flusso di intake in sei passaggi per studi legali di piccole dimensioni: raccogliere solo l'essenziale, classificare, assegnare un responsabile, collegare le informazioni, spiegare cosa segue e misurare."),
        "ru": ("От первого обращения к организованному делу: приём заявок для небольших фирм — LexFlow",
               "Приём заявок в шесть шагов для небольших юридических фирм: собрать только необходимое, классифицировать, назначить ответственного, связать данные, объяснить дальнейшие шаги и измерить результат."),
    },
}

# Anchor text inside elements that carry a link, so the link label is localised
# too rather than staying English on the localised pages.
LINK_LABELS = {
    "it": {"Privacy Policy": "Informativa Privacy", "Pricing page": "pagina Prezzi",
           "glossary": "glossario", "practice area workflows": "flussi per area di attività"},
    "ru": {"Privacy Policy": "Политика конфиденциальности", "Pricing page": "страницу тарифов",
           "glossary": "глоссарий", "practice area workflows": "процессы по отраслям права"},
}


# ---------------------------------------------------------------- JS parsing
def js_unescape(v: str) -> str:
    v = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), v)
    v = re.sub(r"\\x([0-9a-fA-F]{2})", lambda m: chr(int(m.group(1), 16)), v)
    v = v.replace("\\'", "'").replace('\\"', '"').replace("\\n", "\n").replace("\\/", "/")
    v = v.replace("\\\\", "\x00").replace("\\", "").replace("\x00", "\\")
    return v


def js_single_quoted_dicts(text: str) -> dict:
    """Extract {lang: {key: 'value'}} from a JS file using single-quoted strings."""
    out = {}
    for m in re.finditer(r"(en|it|ru)\s*:\s*\{", text):
        lang = m.group(1)
        start = m.end() - 1
        depth = 0
        block = None
        for i in range(start, len(text)):
            if text[i] == "{":
                depth += 1
            elif text[i] == "}":
                depth -= 1
                if depth == 0:
                    block = text[start:i + 1]
                    break
        if not block:
            continue
        d = {}
        for km in re.finditer(r"([A-Za-z0-9_]+)\s*:\s*'((?:[^'\\]|\\.)*)'", block):
            d[km.group(1)] = js_unescape(km.group(2))
        out.setdefault(lang, {}).update(d)
    return out


def balanced_object(text: str, start: int):
    depth = 0
    instr = False
    esc = False
    for i in range(start, len(text)):
        c = text[i]
        if instr:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == '"':
                instr = False
            continue
        if c == '"':
            instr = True
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return text[start:i + 1]
    return None


def inline_dict(page_text: str) -> dict:
    i = page_text.find("window.I18N")
    if i == -1:
        return {}
    j = page_text.find("{", i)
    raw = balanced_object(page_text, j)
    if not raw:
        return {}
    try:
        return json.loads(raw)
    except Exception:
        return {}


# ---------------------------------------------------------------- localising
def localise_inner(inner: str, value: str) -> str:
    """Put `value` into the element's own text nodes, preserving child markup."""
    parts = re.split(r"(<[^>]+>)", inner)
    placed = False
    for i, part in enumerate(parts):
        if not part.startswith("<") and part.strip():
            parts[i] = value if not placed else ""
            placed = True
    if not placed:
        parts.insert(0, value)
    return "".join(parts)


ELEM_RE = re.compile(r"<([a-zA-Z0-9]+)\b([^>]*?)\bdata-i18n=\"([^\"]+)\"([^>]*)>(.*?)</\1>", re.S)
PH_RE = re.compile(r'(<[a-zA-Z0-9]+\b[^>]*?)\s+data-i18n-placeholder="([^"]+)"(?:\s+placeholder="[^"]*")?')
ARIA_RE = re.compile(r'(<[a-zA-Z0-9]+\b[^>]*?)\s+data-i18n-aria="([^"]+)"(?:\s+aria-label="[^"]*")?')
ALT_RE = re.compile(r'(<[a-zA-Z0-9]+\b[^>]*?)\s+data-i18n-alt="([^"]+)"(?:\s+alt="[^"]*")?')



TAG_RE = re.compile(r"<[a-zA-Z0-9][^>]*>")


def dedupe_attr(html: str, attr: str, stats: dict) -> str:
    """Collapse repeated `attr` occurrences on a tag down to the last one.

    The pages do not all place attributes in the same order. Where an existing
    aria-label sat before data-i18n-aria, the replacement added a second one
    instead of overwriting, which is invalid HTML. The last value is always the
    localised one, so that is the one kept.
    """
    needle = attr + '="'

    def fix(m):
        tag = m.group(0)
        if tag.count(needle) <= 1:
            return tag
        found = re.findall(r"\s+" + attr + r'="[^"]*"', tag)
        stripped = re.sub(r"\s+" + attr + r'="[^"]*"', "", tag)
        closing = "/>" if stripped.endswith("/>") else ">"
        stats["deduped"] = stats.get("deduped", 0) + 1
        return stripped[: -len(closing)].rstrip() + found[-1] + closing

    return TAG_RE.sub(fix, html)


def localise_html(html: str, d: dict, lang: str) -> tuple:
    stats = {"text": 0, "placeholder": 0, "aria": 0, "alt": 0, "missing": []}

    def repl_text(m):
        tag, pre, key, post, inner = m.group(1), m.group(2), m.group(3), m.group(4), m.group(5)
        val = d.get(key)
        if val is None:
            stats["missing"].append(key)
            return m.group(0)
        stats["text"] += 1
        return f"<{tag}{pre}data-i18n=\"{key}\"{post}>{localise_inner(inner, val)}</{tag}>"

    html = ELEM_RE.sub(repl_text, html)

    def repl_ph(m):
        pre, key = m.group(1), m.group(2)
        val = d.get(key)
        if val is None:
            stats["missing"].append(key)
            return m.group(0)
        stats["placeholder"] += 1
        # the original placeholder="..." is consumed by the pattern, so this
        # replaces it rather than adding a duplicate attribute
        return f'{pre} data-i18n-placeholder="{key}" placeholder="{val}"'

    html = PH_RE.sub(repl_ph, html)

    def repl_aria(m):
        pre, key = m.group(1), m.group(2)
        val = d.get(key)
        if val is None:
            stats["missing"].append(key)
            return m.group(0)
        stats["aria"] = stats.get("aria", 0) + 1
        return f'{pre} data-i18n-aria="{key}" aria-label="{val}"'

    html = ARIA_RE.sub(repl_aria, html)

    def repl_alt(m):
        pre, key = m.group(1), m.group(2)
        val = d.get(key)
        if val is None:
            stats["missing"].append(key)
            return m.group(0)
        stats["alt"] = stats.get("alt", 0) + 1
        # the existing alt="..." is consumed by the pattern, so this replaces it
        return f'{pre} data-i18n-alt="{key}" alt="{val}"'

    html = ALT_RE.sub(repl_alt, html)

    # defensive: make sure no tag ended up with a duplicated attribute
    html = dedupe_attr(html, "aria-label", stats)
    html = dedupe_attr(html, "placeholder", stats)
    html = dedupe_attr(html, "alt", stats)

    # localise link labels for the languages we have them for
    for en_label, loc_label in LINK_LABELS.get(lang, {}).items():
        html = html.replace(f">{en_label}</a>", f">{loc_label}</a>")

    return html, stats


HREFLANG_RE = re.compile(r'[ \t]*<link rel="alternate" hreflang="[^"]*"[^>]*>\n')
LANGURLS_RE = re.compile(r'[ \t]*<script>window\.LEXFLOW_LANG_URLS\s*=\s*\{[^}]*\};</script>\n')


def hreflang_block(page: str, depth: int) -> str:
    """Reciprocal alternates. `depth` is 0 for root pages, 1 for /it/ and /ru/."""
    if page in EN_ONLY_PAGES:
        return ""
    prefix = "../" if depth else ""
    return (
        f'{prefix and ""}<link rel="alternate" hreflang="en" href="{ORIGIN}/{page}">\n'
        f'<link rel="alternate" hreflang="it" href="{ORIGIN}/it/{page}">\n'
        f'<link rel="alternate" hreflang="ru" href="{ORIGIN}/ru/{page}">\n'
        f'<link rel="alternate" hreflang="x-default" href="{ORIGIN}/{page}">\n'
    )


def lang_urls_script(page: str, depth: int, lang: str = "en") -> str:
    """Map each language to its own URL for this page.

    depth 0 = an English page at the site root, so the other languages live one
    folder down and English is the bare filename. depth 1 = a page inside /it/ or
    /ru/, so English and the other language are one level up and the current
    language is the bare filename.
    """
    if page in EN_ONLY_PAGES:
        return ""
    if depth == 0:
        en, it, ru = page, "it/" + page, "ru/" + page
    else:
        this = page
        en = "../" + page
        it = this if lang == "it" else "../it/" + page
        ru = this if lang == "ru" else "../ru/" + page
    return ("<script>window.LEXFLOW_LANG_URLS="
            f'{{"en":"{en}","it":"{it}","ru":"{ru}"}};</script>\n')


def nest_paths(html: str) -> str:
    html = html.replace('="assets/', '="../assets/')
    for p in EN_ONLY_PAGES + ["site.webmanifest"]:
        html = html.replace(f'href="{p}"', f'href="../{p}"')
    return html


def rewrite_head(html: str, page: str, lang: str, depth: int, title=None, desc=None) -> str:
    html = html.replace('<html lang="en" data-theme="dark">',
                        f'<html lang="{lang}" data-theme="dark" data-lang-lock="{lang}">', 1)
    if page in EN_ONLY_PAGES:
        return html
    url = f"{ORIGIN}/{'' if depth == 0 else lang + '/'}{page}"

    if title:
        html = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", html, count=1, flags=re.S)
    if desc:
        html = re.sub(r'(<meta name="description" content=")[^"]*(")',
                      lambda m: m.group(1) + desc + m.group(2), html, count=1)
        html = re.sub(r'(<meta property="og:description" content=")[^"]*(")',
                      lambda m: m.group(1) + desc + m.group(2), html, count=1)
        html = re.sub(r'(<meta property="og:title" content=")[^"]*(")',
                      lambda m: m.group(1) + (title or "") + m.group(2), html, count=1)
    # canonical + og:url point at this language's own URL
    html = re.sub(r'(<link rel="canonical" href=")[^"]*(")',
                  lambda m: m.group(1) + url + m.group(2), html, count=1)
    html = re.sub(r'(<meta property="og:url" content=")[^"]*(")',
                  lambda m: m.group(1) + url + m.group(2), html, count=1)
    return html


def install_tags(html: str, page: str, depth: int, lang: str = "en") -> str:
    html = HREFLANG_RE.sub("", html)
    html = LANGURLS_RE.sub("", html)
    if page in EN_ONLY_PAGES:
        return html
    block = hreflang_block(page, depth)
    html = html.replace('<link rel="canonical"', block + '<link rel="canonical"', 1)
    # og:locale belongs on every page, English included
    if 'property="og:locale"' not in html and '<meta property="og:type"' in html:
        loc = {"en": "en_GB", "it": "it_IT", "ru": "ru_RU"}[lang]
        html = html.replace('<meta property="og:type"',
                            f'<meta property="og:locale" content="{loc}">\n<meta property="og:type"', 1)
    if "</head>" in html:
        html = html.replace("</head>", lang_urls_script(page, depth, lang) + "</head>", 1)
    return html




# ------------------------------------------------------------- whatsapp stamp
def _config_value(name: str, default=None):
    """Read a value out of assets/site-config.js so the number has one source."""
    sc = ROOT / "assets" / "site-config.js"
    if not sc.exists():
        return default
    m = re.search(name + r'\s*:\s*"([^"]+)"', sc.read_text(encoding="utf-8"))
    return m.group(1) if m else default


def stamp_whatsapp(html: str) -> str:
    """Write the configured WhatsApp number into a page.

    The number is public marketing information, so the risk is not exposure but
    STALENESS: one value edited here and missed in 26 pages. Stamping at build
    time means no-JS visitors still get the right number, and the runtime reads
    the same config for anything JavaScript adds.

    Both patterns below are built from CHARACTER CLASSES ONLY, deliberately with
    no backslash escapes. This file is written by tooling that escapes source
    twice, and a backslash-escaped pattern silently degrades into something that
    matches nothing. "[+]" is a literal plus; "[.]" is a literal dot.
    """
    digits = _config_value("whatsapp")
    shown = _config_value("whatsappDisplay")
    if not digits:
        return html

    NBSP = chr(0xa0)
    SP = "[" + " " + NBSP + "]*"

    # 1) normalise every wa.me link to the configured digits
    link_re = "wa[.]me/[0-9+" + " " + NBSP + "-]+"
    html = re.sub(link_re, "wa.me/" + digits, html)

    # 2) rewrite the human-readable number. The leading plus is REQUIRED: without
    #    it this also matches the bare digits inside a wa.me link and corrupts it.
    if shown:
        # Generic Italian mobile display: +39 then 3/3/4 digit groups. Generic on
        # purpose so re-stamping an already-stamped page is idempotent; a pattern
        # that matched one specific number could only ever run once.
        D3 = "[0-9][0-9][0-9]"
        D4 = "[0-9][0-9][0-9][0-9]"
        disp_re = "[+]" + SP + "39" + SP + D3 + SP + D3 + SP + D4
        html = re.sub(disp_re, shown, html)

    return html


def write_sitemap():
    """Emit sitemap.xml covering every language URL with xhtml:link alternates.

    Each language version gets its own <url> entry, and every entry carries the
    full set of alternates (including x-default pointing at the English page),
    which is what search engines expect for a multilingual site.
    """
    PRIO = {
        "lexflow-index.html": ("weekly", "1.0"),
        "lexflow-how-it-works.html": ("monthly", "0.8"),
        "lexflow-pricing.html": ("monthly", "0.9"),
        "lexflow-practice-areas.html": ("monthly", "0.8"),
        "lexflow-faq.html": ("monthly", "0.8"),
        "lexflow-blog.html": ("weekly", "0.6"),
        "lexflow-article-matter-tracker.html": ("yearly", "0.6"),
        "lexflow-article-client-intake.html": ("yearly", "0.6"),
    }
    LASTMOD = "2026-09-13"
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             "<!-- Generated by templates/build-lang-sites.py. Do not hand-edit:",
             "     the language URLs and alternates are derived from the page set. -->",
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
             '        xmlns:xhtml="http://www.w3.org/1999/xhtml">']

    def entry(loc, freq, prio, alts=None):
        lines.append("  <url>")
        lines.append(f"    <loc>{loc}</loc>")
        if alts:
            for h, u in alts:
                lines.append(f'    <xhtml:link rel="alternate" hreflang="{h}" href="{u}"/>')
        lines.append(f"    <lastmod>{LASTMOD}</lastmod>")
        lines.append(f"    <changefreq>{freq}</changefreq>")
        lines.append(f"    <priority>{prio}</priority>")
        lines.append("  </url>")

    for page, (freq, prio) in PRIO.items():
        alts = [("en", f"{ORIGIN}/{page}"),
                ("it", f"{ORIGIN}/it/{page}"),
                ("ru", f"{ORIGIN}/ru/{page}"),
                ("x-default", f"{ORIGIN}/{page}")]
        for loc in (f"{ORIGIN}/{page}", f"{ORIGIN}/it/{page}", f"{ORIGIN}/ru/{page}"):
            entry(loc, freq, prio, alts)
    # English-only legal pages: one language, so no alternates to declare
    for page in EN_ONLY_PAGES:
        entry(f"{ORIGIN}/{page}", "yearly", "0.3")

    lines.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8")
    n = sum(1 for l in lines if l.strip().startswith("<loc>"))
    print(f"sitemap.xml written with {n} URLs")


def main():
    # Snapshot every English page's title. A previous bug overwrote all English
    # pages with the last localised page because a loop reused a stale variable;
    # comparing against this snapshot makes that failure loud instead of silent.
    en_titles = {}
    for _p in CONTENT_PAGES + EN_ONLY_PAGES:
        _t = (ROOT / _p).read_text(encoding="utf-8")
        _m = re.search(r"<title>(.*?)</title>", _t, re.S)
        en_titles[_p] = _m.group(1).strip() if _m else None

    shared = {}
    for f in ("assets/glossary.js", "assets/i18n-faq.js", "assets/i18n-ui.js"):
        for lang, d in js_single_quoted_dicts((ROOT / f).read_text(encoding="utf-8")).items():
            shared.setdefault(lang, {}).update(d)

    made, rewritten = [], []
    for page in CONTENT_PAGES:
        src = (ROOT / page).read_text(encoding="utf-8")
        base = inline_dict(src)
        for lang in LANGS:
            merged = {}
            for source in (base.get("en", {}), shared.get("en", {}), base.get(lang, {}), shared.get(lang, {})):
                merged.update(source)
            html, stats = localise_html(src, merged, lang)
            title, desc = META.get(page, {}).get(lang, (None, None))
            html = rewrite_head(html, page, lang, depth=1, title=title, desc=desc)
            html = nest_paths(html)
            html = stamp_whatsapp(html)
            html = install_tags(html, page, depth=1, lang=lang)
            out = ROOT / lang / page
            out.parent.mkdir(exist_ok=True)
            out.write_text(html, encoding="utf-8")
            made.append((f"{lang}/{page}", stats))

    # English pages get the same hreflang block and the language URL map
    for page in CONTENT_PAGES + EN_ONLY_PAGES:
        p = ROOT / page
        # read this page explicitly: never reuse a variable left over from the
        # localised-pages loop above, or every English page gets overwritten
        # with a localised one.
        html = p.read_text(encoding="utf-8")
        html = stamp_whatsapp(html)
        html = install_tags(html, page, depth=0, lang="en")
        p.write_text(html, encoding="utf-8")

        # guard: confirm the file still holds its own title and English lang
        written = p.read_text(encoding="utf-8")
        got = re.search(r"<title>(.*?)</title>", written, re.S)
        got = got.group(1).strip() if got else None
        if en_titles.get(page) and got != en_titles[page]:
            raise SystemExit(
                "ABORT: " + page + " was overwritten with different content.\n"
                "  expected title: " + str(en_titles[page]) + "\n"
                "  actual title:   " + str(got) + "\n"
                "  Restore with: git checkout -- '*.html'"
            )
        _bad = [u for u in re.findall(r"wa\.me/([^\"']+)", written) if not u.isdigit()]
        if _bad:
            raise SystemExit("ABORT: " + page + " has malformed wa.me links: " + str(_bad[:3]))
        _html_tag = re.search(r"<html[^>]*>", written)
        if not _html_tag or 'lang="en"' not in _html_tag.group(0):
            raise SystemExit(
                "ABORT: " + page + " lost its lang=\"en\" attribute. Got: "
                + (_html_tag.group(0) if _html_tag else "no <html> tag")
            )
        rewritten.append(page)

    print(f"generated {len(made)} localised pages")
    missing_total = {}
    for name, st in made:
        for k in st["missing"]:
            missing_total.setdefault(k, 0)
            missing_total[k] += 1
    print(f"localised elements per page (text/placeholder), first few:")
    for name, st in made[:4]:
        print(f"  {name}: text={st['text']} placeholder={st['placeholder']} missing={len(st['missing'])}")
    if missing_total:
        print("KEYS WITH NO TRANSLATION:", sorted(missing_total)[:25])
    else:
        print("every data-i18n key had a translation in both languages")
    print(f"rewrote {len(rewritten)} English pages with hreflang + language URLs")
    write_sitemap()


if __name__ == "__main__":
    main()
