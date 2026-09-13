# LexFlow — how to verify the pilot indicator figures

You asked for a path to verify the figures shown on the site. This is that path,
written against the actual CRM schema rather than a generic checklist.

## The figures currently on the site

| id | Figure | Where shown |
|----|--------|-------------|
| CR-09 | 34% faster matter closure | index stats grid, FAQ stats grid |
| CR-10 | 2.4x billable activities recorded | index, FAQ |
| CR-12 | under 5 min average setup | index, FAQ |
| CR-11 | 91% weekly active use | index, FAQ |
| CR-15 | -1.5 to -3 h/day admin per colleague, 0 missed intakes, 10x client satisfaction | index results section |

While the site was being edited these were retitled from "Verified impact from a
live pilot" to "Early indicators from our first pilot", and a visible disclaimer
now states that methodology and formal measurement are not yet documented.
Nothing was deleted. Confirm or replace them using the steps below.

## What the CRM can actually prove

Source of truth: the CRM database on the Railway service referenced in
`assets/site-config.js` (`web-production-031a6.up.railway.app`).
Schema (from `aLEXy/app.py`, the `init_db` block):

```
matters  (id, created_at, token, client_name, email, phone, company,
          practice_area, urgency, description, status, internal_notes)
documents(id, matter_id, stored_name, original_name, uploaded_at)
events   (id, matter_id, event_time, status, note)

STATUSES = New intake, Conflict check, Lawyer review,
           Waiting client docs, Quoted, Engaged, Closed
```

### Verifiable from the database

**Matter cycle time — the basis for CR-09 (34% faster).**
Closure time is computable because `events` records `Closed` with a timestamp.

```sql
-- Median, minimum and maximum days from intake to closure
SELECT
  COUNT(*)                                                   AS closed_matters,
  ROUND(AVG(julianday(closed_at) - julianday(created_at)), 1) AS avg_days,
  ROUND(MIN(julianday(closed_at) - julianday(created_at)), 1) AS min_days,
  ROUND(MAX(julianday(closed_at) - julianday(created_at)), 1) AS max_days
FROM (
  SELECT m.id, m.created_at, MIN(e.event_time) AS closed_at
  FROM matters m
  JOIN events e ON e.matter_id = m.id AND e.status = 'Closed'
  GROUP BY m.id
);
```

To support a **34% faster** claim you must compare two cohorts: matters handled
before the workflow change and matters handled after. You need a cutover date.

```sql
-- Cohort comparison. Replace :cutover with the real ISO date.
SELECT
  CASE WHEN m.created_at < :cutover THEN 'before' ELSE 'after' END AS cohort,
  COUNT(*) AS matters,
  ROUND(AVG(julianday(c.event_time) - julianday(m.created_at)), 1) AS avg_days_to_close
FROM matters m
JOIN (SELECT matter_id, MIN(event_time) AS event_time
      FROM events WHERE status = 'Closed' GROUP BY matter_id) c
  ON c.matter_id = m.id
GROUP BY cohort;
```

If both cohorts are not present in the data, the 34% figure has no baseline and
cannot be supported. That is the most likely outcome and it is worth knowing.

**Intake handling and "0 missed intakes" (part of CR-15).**
This is definable once you fix the definition of "missed". A workable one: an
intake that never received an event beyond `New intake`.

```sql
-- Intakes with no progress beyond the initial state
SELECT m.id, m.created_at, m.practice_area, m.status
FROM matters m
LEFT JOIN events e ON e.matter_id = m.id AND e.status <> 'New intake'
WHERE e.id IS NULL
ORDER BY m.created_at;

-- Intake volume and per-area distribution
SELECT practice_area, status, COUNT(*) AS n
FROM matters GROUP BY practice_area, status ORDER BY n DESC;

-- Documentation attached per matter (are intakes actually being completed?)
SELECT m.id, COUNT(d.id) AS docs
FROM matters m LEFT JOIN documents d ON d.matter_id = m.id
GROUP BY m.id ORDER BY docs ASC;
```

### NOT verifiable from this database

Say this plainly rather than trying to infer a number:

- **CR-10 (2.4x billable activities).** There is no time-entry or billing table
  in the schema. This figure has no instrumentation behind it. To support it you
  need charted time entries or an export from an existing billing tool covering
  the same period and people.
- **CR-12 (under 5 min setup).** Nothing records setup duration. Needs a timed
  study: onboard a stated number of firms, start the clock at first login, stop
  when the firm completes its first matter intake.
- **CR-11 (91% weekly active use).** There is no user, session or login table
  (the client flow is deliberately passwordless, so no login events exist).
  Needs web analytics or an application-level activity log, with "active"
  defined explicitly.
- **CR-15 (-1.5 to -3 h/day admin, 10x client satisfaction).** Admin time needs a
  time-diary or before/after time study. Client satisfaction needs a survey
  instrument and a response count. Neither exists today.

## Critical check before using any figure

`aLEXy/app.py` exposes an admin route:

```
@app.route("/admin/load-demo")
```

If the pilot database was ever seeded through that route, the rows are demo
rows, not client work, and every metric derived from them is demo data. Check
this before presenting anything as a pilot result:

```sql
-- Row counts and the date span actually present
SELECT COUNT(*) AS matters,
       MIN(created_at) AS first_row,
       MAX(created_at) AS last_row
FROM matters;

-- Repeated filler client names are a strong demo-data signal
SELECT client_name, COUNT(*) AS n
FROM matters GROUP BY client_name HAVING n > 1 ORDER BY n DESC;

-- Placeholder-looking domains are another signal
SELECT email, COUNT(*) AS n
FROM matters GROUP BY email ORDER BY n DESC LIMIT 20;
```

If the rows look synthetic (filler names, example.com addresses, a burst of rows
inside a few minutes), do not publish derived figures as pilot results.

## The three states a figure can be in, and the exact wording for each

Use these distinctions consistently, per your own instruction to distinguish
certified, aligned, designed to support, in progress and planned.

| State | Wording to use | When |
|-------|----------------|------|
| Measured | "X%, measured across N matters between DATE and DATE" | Two real cohorts exist and the query above returns them |
| Designed / intended | "designed to reduce routine status calls" | No measurement, but the mechanism is real |
| Working towards | "we are working towards X" | Standards and certifications not yet held |

Until a figure reaches the first row, the honest placement is the second row, or
the figure comes down. The current site wording ("early indicators … formal
measurement not yet documented") sits in a defensible middle position, but it is
a placeholder for a decision, not a final state.

## Recommended sequence

1. Run the demo-data check. If the data is seeded, stop and decide to either
   measure properly or remove the figures.
2. Run the cycle-time queries. Establish whether a before/after cohort exists.
3. For CR-10, CR-11, CR-12 and the CR-15 hospital items, decide per figure:
   instrument it, restate it as "designed to", or remove it.
4. Record the outcome per figure in `claims-register.csv` so the next person
   does not re-litigate it.
5. If a figure is confirmed, replace the disclaimer with the measurement window
   and sample size. A dated, scoped number is more persuasive than a bare
   percentage anyway.
