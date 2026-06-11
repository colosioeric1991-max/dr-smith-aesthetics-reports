# Monthly Maxi Report — Dr Smith Aesthetics

Run on the 1st of each month at 09:00 BST. Reports on the previous full calendar month.

Note: all file paths below are relative to the cloned repo root (your working directory).

---

## Step 1: Determine reporting period

Calculate:
- Reporting month label: e.g. "May 2026"
- Start date: first day of last month, formatted YYYY-MM-DD
- End date: last day of last month, formatted YYYY-MM-DD
- File suffix: YYYY-MM of last month (e.g. "2026-05")

---

## Step 2: Pull Wix Analytics

Use the Wix MCP to query site analytics for site ID `37239859-70c1-4361-bd60-cdecdc8423a1`.

Call the Analytics Data API:
```
GET https://www.wixapis.com/analytics/v2/site-analytics/data
  ?date_range.start_date=YYYY-MM-DD
  &date_range.end_date=YYYY-MM-DD
  &measurement_types[]=TOTAL_SESSIONS
  &measurement_types[]=TOTAL_UNIQUE_VISITORS
```

Note: TOTAL_PAGE_VIEWS is not a valid measurement type — do not include it.

Retrieve those metrics for:
- The reporting period (start to end date from Step 1)
- The prior month (to calculate month-on-month % change)

Store results as a `wix` object:
```json
{
  "sessions": 313,
  "uniqueVisitors": 185,
  "pageViews": null,
  "topPages": [],
  "sources": {},
  "vsLastMonth": {
    "sessions": null,
    "uniqueVisitors": null,
    "note": "Prior month data may be unavailable beyond 62-day retention window"
  }
}
```

---

## Step 3: Pull Square financials

Use the Square MCP (Payments API) to retrieve all completed payments for the reporting period.

Call the `payments` service, `list` method, with:
- `begin_time`: start date in ISO 8601 (e.g. `2026-05-01T00:00:00Z`)
- `end_time`: end date in ISO 8601 (e.g. `2026-05-31T23:59:59Z`)
- `sort_order`: DESC
- `limit`: 100

Sum the `total_money.amount` values (currency GBP) of all COMPLETED payments. Square amounts are in pence — divide by 100 for pounds.

Count total number of completed transactions.

Fetch the prior month the same way for month-on-month comparison.

Store results as a `financials` object:
```json
{
  "income": 12323.50,
  "transactions": 69,
  "expenses": null,
  "expensesNote": "Expenses entered manually in the VAT app",
  "net": null,
  "vsLastMonth": {
    "income": 15705.00,
    "transactions": 99,
    "changeGBP": -3381.50,
    "changePct": -21.5
  }
}
```

---

## Step 4: Run SEO audit

Run from the repo root:
```bash
node scripts/seo-audit.mjs
```

Capture the JSON output as `seo`.

---

## Step 5: Check keyword rankings

Use web search to find the current ranking of lsmithaesthetics.com for each keyword. Record the position as a string: "#1", "#5", or "Not in top 10". Include a brief snippet of competing results.

Keywords:
- "botox London"
- "dermal fillers London"
- "aesthetics clinic London"
- "Dr Smith aesthetics"
- "polynucleotides London"

Store results as a `keywords` array:
```json
[
  { "term": "botox London", "position": "Not in top 10", "snippet": "Competitors: Dr Nyla, LPA..." },
  { "term": "Dr Smith aesthetics", "position": "#1", "snippet": "lsmithaesthetics.com ranks first" }
]
```

---

## Step 6: Pull Google Analytics (GA4) data

Run from the repo root:
```bash
node scripts/ga4-fetch.mjs [START-DATE] [END-DATE] [PREV-START-DATE] [PREV-END-DATE]
```

Example for May 2026:
```bash
node scripts/ga4-fetch.mjs 2026-05-01 2026-05-31 2026-04-01 2026-04-30
```

This requires `ga-oauth-token.json` to be present in the repo root (not committed to GitHub — stored locally only).

Capture the JSON output as `ga4`.

---

## Step 7: Assemble and write data JSON

Write all collected data to `reports/data-[FILE-SUFFIX].json`:
```json
{
  "month": "May 2026",
  "period": { "start": "2026-05-01", "end": "2026-05-31" },
  "wix": { },
  "ga4": { },
  "seo": [ ],
  "keywords": [ ],
  "financials": { }
}
```

---

## Step 8: Generate the HTML report

Run from the repo root:
```bash
node scripts/run-report.mjs reports/data-[FILE-SUFFIX].json reports/report-[FILE-SUFFIX].html
```

---

## Step 9: Email the report draft

Use the Gmail MCP `create_draft` tool to create a draft email at info@lsmithaesthetics.com:

Subject: `Dr Smith Aesthetics | Monthly Report | [MONTH LABEL]`

Body: an HTML summary of the key metrics (sessions, revenue vs last month, SEO issue count, top recommendations). Keep it concise — full detail is in the saved report file.

---

## Step 10: Create Google Calendar notification

Use the Google Calendar MCP to create an event on the primary calendar:

- Title: `Monthly Report Ready — [MONTH LABEL]`
- Date: today (the 1st of the current month)
- Time: the current time (make it a 15-minute event)
- Description: "The Dr Smith Aesthetics monthly report has been generated. Key numbers: Sessions [sessions] | Revenue £[income] ([changePct]% vs last month) | SEO issues [total] ([red] critical). Check the Gmail draft at info@lsmithaesthetics.com to review and send."
- Use the `create_event` tool

This will send a push notification to your phone via Google Calendar.

---

## Step 11: Confirm

Log: "Monthly report for [MONTH LABEL] complete. Gmail draft created at info@lsmithaesthetics.com. Calendar notification sent."
