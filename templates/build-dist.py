#!/usr/bin/env python3
"""Assemble a clean deploy directory for the LexFlow web-site.

Why this exists
---------------
The repo root is NOT a safe deploy directory: it also holds build sources
(templates/), internal notes (*.md), audit data (*.csv), legacy "(1)" preview
artefacts and scratch files. Publishing the root would ship all of that.

This script copies ONLY the production surface into dist/ using an allowlist,
so exclusion is explicit and reviewable instead of accidental.

Run:  python3 templates/build-dist.py
Then: deploy dist/  (never the repo root)

Add a new public file by adding it to ROOT_FILES / ROOT_GLOBS below.
"""
import os
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"

# --- what ships ------------------------------------------------------------
ROOT_GLOBS = ["lexflow-*.html", "privacy.html", "terms.html", "cookie-policy.html", "404.html"]
ROOT_FILES = ["llms.txt", "robots.txt", "sitemap.xml", "site.webmanifest"]
DIRS = ["it", "ru", "assets", ".well-known"]

# --- what must never ship --------------------------------------------------
DENY_NAME = re.compile(r"^(probe|_probe|_h2check)")           # scratch files
DENY_DIRS = {"templates", "dist", ".git", "__pycache__"}


def is_legacy_artefact(name: str) -> bool:
    """'lexflow-index (1).html' style preview artefacts are not production."""
    return bool(re.search(r"\(\d+\)\.html$", name))


def main() -> int:
    if DIST.exists():
        print("removing previous dist/ ...")
        shutil.rmtree(DIST)
    DIST.mkdir(parents=True)

    copied, skipped = [], []

    # root html + named files
    for pattern in ROOT_GLOBS:
        for src in sorted(ROOT.glob(pattern)):
            if src.is_dir() or is_legacy_artefact(src.name) or DENY_NAME.match(src.name):
                skipped.append(src.name)
                continue
            shutil.copy2(src, DIST / src.name)
            copied.append(src.name)
    for name in ROOT_FILES:
        src = ROOT / name
        if src.exists():
            shutil.copy2(src, DIST / name)
            copied.append(name)
        else:
            print(f"  WARN missing: {name}")

    # whole directories
    for d in DIRS:
        src = ROOT / d
        if not src.is_dir():
            print(f"  WARN missing dir: {d}/")
            continue
        for item in sorted(src.rglob("*")):
            rel = item.relative_to(src)
            if item.is_dir() or DENY_NAME.match(item.name):
                continue
            if any(part in DENY_DIRS for part in rel.parts):
                continue
            dest = DIST / d / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(item, dest)
            copied.append(f"{d}/{rel}")

    total = sum(f.stat().st_size for f in DIST.rglob("*") if f.is_file())
    print(f"\ncopied {len(copied)} files -> {DIST}")
    print(f"total size: {total/1024/1024:.1f} MB")
    if skipped:
        print(f"\nexcluded {len(skipped)} root html artefact(s):")
        for s in skipped:
            print(f"  - {s}")
    print("\nexcluded by design: templates/, *.md, *.csv, dist/, scratch/probe files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
