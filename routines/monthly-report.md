# Monthly Maxi Report — Dr Smith Aesthetics

Run on the 1st of each month at 09:00. Reports on the previous full calendar month.

---

## Step 1: Determine reporting period

Calculate:
- Reporting month label: e.g. "May 2026"
- Start date: first day of last month, formatted YYYY-MM-DD
- End date: last day of last month, formatted YYYY-MM-DD
- File suffix: YYYY-MM of last month (e.g. "2026-05")

---

## Step 2: Pull Wix Analytics

Use the Wix MCP to query site analytics for the reporting period.

First, search the Wix REST documentation for the Analytics Data API to find the correct endpoint for retrieving aggregate traffic data (sessions, unique visitors, page views). Look for measurement types such as `TOTAL_SESSIONS`, `TOTAL_UNIQUE_VISITORS`, `TOTAL_PAGE_VIEWS`.

Retrieve those metrics for:
- The reporting period (start to end date from Step 1)
- The prior month (to calculate month-on-month % change)

Then retrieve top 5 pages by views for the reporting period.

Then retrieve traffic source breakdown (organic, direct, social, referral) as percentages.

Store results as a `wix` object:
```json
{
  "sessions": 842,
  "uniqueVisitors": 651,
  "pageViews": 2103,
  "topPages": [{ "path": "/", "title": "Home", "views": 612 }],
  "sources": { "organic": 48, "direct": 28, "social": 18, "referral": 6 },
  "vsLastMonth": { "sessions": 12, "pageViews": 8 }
}
```

---

## Step 3: Pull Square financials

Use the Square MCP (Payments API) to retrieve all completed payments for the reporting period.

Call the `payments` service, `list` method, with:
- `begin_time`: start date from Step 1 in ISO 8601 format (e.g. `2026-05-01T00:00:00Z`)
- `end_time`: end date from Step 1 in ISO 8601 format (e.g. `2026-05-31T23:59:59Z`)
- `sort_order`: DESC

Sum the `amount_money.amount` values of all payments with `status: "COMPLETED"`. Square amounts are in pence — divide by 100 for pounds.

Count total number of completed transactions.

Calculate month-on-month income % change by fetching the prior month's total the same way.

Store results as a `financials` object (leave `expenses` and `net` as 0 for now):
```json
{
  "income": 11450,
  "transactions": 74,
  "expenses": 0,
  "net": 0,
  "vsLastMonth": { "income": 7 }
}
```

---

## Step 4: Extract expenses from VAT app

Read the file at:
`/Users/leesmith/Desktop/CLAUDE/VAT/VAT-Assessment-DrSmithAesthetics.html`

Scan for manually entered expense rows corresponding to the reporting month. Sum those amounts and set as `expenses` in the financials object. Calculate `net = income - expenses`.

---

## Step 5: Run SEO audit

Run:
```bash
node /Users/leesmith/Desktop/CLAUDE/scripts/seo-audit.mjs
```

Capture the JSON output as `seo`.

---

## Step 6: Check keyword rankings

Use web search to find the current ranking of lsmithaesthetics.com for each keyword. Record the position (1-20) if found, or null if not ranked in top 20. Include a brief snippet if available.

Keywords:
- "botox London"
- "dermal fillers London"
- "aesthetics clinic London"
- "Dr Smith aesthetics"
- "polynucleotides London"

Store results as a `keywords` array:
```json
[
  { "term": "botox London", "position": 7, "snippet": "..." },
  { "term": "dermal fillers London", "position": null, "snippet": "" }
]
```

---

## Step 7: Assemble and write data JSON

Write all collected data to:
`/Users/leesmith/Desktop/CLAUDE/reports/data-[FILE-SUFFIX].json`

Use this shape:
```json
{
  "month": "May 2026",
  "period": { "start": "2026-05-01", "end": "2026-05-31" },
  "wix": { },
  "seo": [ ],
  "keywords": [ ],
  "financials": { }
}
```

---

## Step 8: Generate the HTML report

Run:
```bash
node /Users/leesmith/Desktop/CLAUDE/scripts/run-report.mjs \
  /Users/leesmith/Desktop/CLAUDE/reports/data-[FILE-SUFFIX].json \
  /Users/leesmith/Desktop/CLAUDE/reports/report-[FILE-SUFFIX].html
```

---

## Step 9: Email the report

Use the Gmail MCP to send an email to info@lsmithaesthetics.com:

Subject: `Dr Smith Aesthetics | Monthly Report [MONTH LABEL]`

Body:
```
Monthly report for [MONTH LABEL] is ready.

Key numbers:
- Website sessions: [sessions] ([change vs last month])
- Monthly revenue: £[income] ([change vs last month])
- Net position: £[net]
- SEO issues: [total] ([red count] critical)

Full report attached.
```

Attach or embed the HTML report file contents.

---

## Step 10: Confirm

Log: "Monthly report for [MONTH LABEL] complete. Saved to reports/report-[FILE-SUFFIX].html and emailed to info@lsmithaesthetics.com."
