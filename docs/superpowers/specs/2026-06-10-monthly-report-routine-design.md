# Monthly Report Routine — Dr Smith Aesthetics
**Date:** 2026-06-10  
**Status:** Approved

## Overview

A fully automated monthly routine that runs at 9am on the 1st of each month. It pulls Wix Analytics data and runs an SEO audit for the previous calendar month, compiles findings into a styled HTML report, saves it locally, and emails it to the clinic inbox. No manual action required.

Google Analytics (GA4) will be added as a second phase once API credentials are set up.

---

## Schedule

- **Trigger:** 1st of each month at 09:00
- **Reporting period:** Previous calendar month (e.g. runs 1 June, reports on May 2026)
- **Delivery:** HTML file saved locally + emailed to `info@lsmithaesthetics.com`

---

## Report Sections

### 1. Wix Analytics
Pulled via the Wix MCP connector. Covers the previous full calendar month.

- Total sessions and unique visitors
- Total page views
- Top 5 pages by traffic volume
- Traffic sources breakdown: organic search, direct, social, referral
- Month-on-month comparison for sessions and page views (up/down vs prior month)

### 2. SEO Audit

**Technical checks** (run against local site HTML files in `/Users/leesmith/Desktop/CLAUDE/NEW WEBSITE/`):
- Meta titles: present, unique, 50-60 characters
- Meta descriptions: present, unique, 150-160 characters
- H1 tags: one per page, contains target keyword
- H2/H3 structure: logical hierarchy
- Image alt tags: all images have descriptive alt text
- Issues flagged as red (missing) or amber (suboptimal)

**Keyword ranking checks** (via web search):
- "botox London"
- "dermal fillers London"
- "aesthetics clinic London"
- "Dr Smith aesthetics"
- "polynucleotides London"
- Reports approximate ranking position and whether the site appears in top 10

### 3. Financial Summary
Pulled from two sources:

- **Square (via MCP):** Monthly takings for the reporting period — total revenue, number of transactions, daily average
- **Expenses (from the VAT assessment app):** Manually entered invoices/outgoings already logged in `VAT-Assessment-DrSmithAesthetics.html`

Combines both into a simple P&L snapshot: total income, total expenses, net position for the month. Month-on-month comparison included.

The VAT app is updated automatically each month with the Square data (replacing the current manual CSV import process). The user continues to add expenses manually in the app as before.

### 4. Recommendations
A prioritised action list at the bottom of the report derived from audit findings. Items ranked by impact: High / Medium / Low.

---

## Output

**File path:** `/Users/leesmith/Desktop/CLAUDE/reports/report-YYYY-MM.html`  
**Naming example:** `report-2026-05.html` for the May report

**Styling:** Matches the VAT Assessment tool — dark navy header, summary stat cards at top, colour-coded badges (red/amber/green), clean table layout, clinic logo included.

**Email:** Sent via Gmail MCP to `info@lsmithaesthetics.com` with subject: `Dr Smith Aesthetics — Monthly Report [Month Year]`. The HTML file is attached or embedded.

---

## Maxi Report structure (full combined output)

The single HTML file delivered on the 1st of each month contains all sections in this order:

1. Summary header — key numbers at a glance (sessions, revenue, net position, top SEO issue)
2. Wix Analytics
3. SEO Audit
4. Financial Summary (Square takings + expenses)
5. Recommendations / action list

## Future phases

- **Phase 2:** Add Google Analytics GA4 section once service account credentials are saved to `/Users/leesmith/Desktop/CLAUDE/ga-credentials.json`

---

## Test run

Before the scheduled routine goes live, a manual May 2026 report will be generated to validate the output. Wix Analytics will be queried for 2026-05-01 to 2026-05-31 and the SEO audit will run against the current site files.

---

## Dependencies

- Wix MCP connector (active)
- Square MCP connector (active)
- Gmail MCP connector linked to `info@lsmithaesthetics.com` (active)
- Site HTML files at `/Users/leesmith/Desktop/CLAUDE/NEW WEBSITE/`
- VAT/financial app at `/Users/leesmith/Desktop/CLAUDE/VAT/VAT-Assessment-DrSmithAesthetics.html`
- Reports output folder: `/Users/leesmith/Desktop/CLAUDE/reports/` (to be created)
- Claude Code scheduled routines enabled (confirmed active)
