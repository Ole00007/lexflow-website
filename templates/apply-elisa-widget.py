#!/usr/bin/env python3
"""Replace the assistant widget block in every LexFlow page with the canonical
Elisa markup from assets/elisa-widget.html.

Idempotent: pages already carrying the ELISA WIDGET markers are re-synced in
place, so this can be re-run after editing assets/elisa-widget.html.

Usage:  python3 templates/apply-elisa-widget.py
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SNIPPET = ROOT / "assets" / "elisa-widget.html"
PAGES = [
    "lexflow-index.html",
    "lexflow-how-it-works.html",
    "lexflow-pricing.html",
    "lexflow-practice-areas.html",
    "lexflow-faq.html",
    "lexflow-blog.html",
    "privacy.html",
    "terms.html",
]

START = "<!-- ELISA WIDGET:START -->"
END = "<!-- ELISA WIDGET:END -->"


def load_snippet() -> str:
    html = SNIPPET.read_text(encoding="utf-8")
    m = re.search(re.escape(START) + r".*?" + re.escape(END), html, re.S)
    if not m:
        sys.exit("canonical snippet is missing its START/END markers")
    return m.group(0)


def migrate(page: Path, snippet: str) -> str:
    src = page.read_text(encoding="utf-8")
    tag = '<script src="assets/elisa-widget.js"></script>'

    if START in src and END in src:
        # Re-sync an already-migrated page.
        new = re.sub(re.escape(START) + r".*?" + re.escape(END), lambda _: snippet, src, flags=re.S)
        if tag not in new:
            new = new.replace('<script src="assets/alessia-widget.js"></script>', tag)
        return new

    # First migration: the legacy block runs from the alessia-widget div through
    # its script include. Anything between (comments, blank lines) goes with it.
    pat = re.compile(
        r"[ \t]*(?:<!--[^\n]*?-->\s*)?<div class=\"alessia-widget\".*?"
        r'<script src="assets/(?:alessia|elisa)-widget\.js"></script>',
        re.S,
    )
    m = pat.search(src)
    if not m:
        return ""

    replacement = snippet + "\n" + tag
    return src[: m.start()] + replacement + src[m.end():]


def main() -> None:
    snippet = load_snippet()
    changed = skipped = 0
    for name in PAGES:
        page = ROOT / name
        if not page.exists():
            print(f"  - {name}: not found, skipped")
            continue
        out = migrate(page, snippet)
        if out == "":
            print(f"  ! {name}: no widget block found, left untouched")
            skipped += 1
            continue
        if out == page.read_text(encoding="utf-8"):
            print(f"  = {name}: already current")
            continue
        page.write_text(out, encoding="utf-8")
        print(f"  + {name}: widget updated")
        changed += 1
    print(f"\n{changed} page(s) updated, {skipped} skipped.")


if __name__ == "__main__":
    main()
