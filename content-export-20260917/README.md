# LexFlow Content Export — Instructions for the Copywriter

You are humanizing the LexFlow marketing copy. You are NOT rewriting the structure
and NOT translating. Your only job: make the copy read naturally for a human.

## Rules
1. Edit ONLY the `humanized_text:` column / the `humanized_text` field. Never change `content_id`.
2. `content_id` is the re-import key. It must stay byte-identical.
3. Preserve placeholders and variables exactly (e.g. `{name}`, brand names, ISO/GDPR wording,
   WhatsApp/phone numbers, URLs, `© 2026`).
4. Respect max lengths in the constraints column (esp. meta_title ~60 ch).
5. Do NOT add legal claims (no certifications we haven't obtained, no P.IVA, no entity identity —
   that is supplied separately by the owner).
6. Keep tone: plain, professional, no hype, no AI-isms ("unlock", "leverage", "seamlessly", "delve",
   "in today's fast-paced world").
7. Work per-file, per-locale. Keep the three voices culturally native — do NOT make IT/RU read as
   word-for-word translations of EN.

## Re-import
Re-import is by `content_id` (see INDEX.md). A script will map each `humanized_text` back to the
authoritative source using `content_id`. Do not add or remove ids.

## Files
- per-page per-locale Markdown: en/, it/, ru/
- INDEX.md — every page, locale, content_id count and path
- _readable/en.md, it.md, ru.md — plain concatenation for quick reading (not for re-import)

Open a PR back to branch `content/humanization-20260917`.
