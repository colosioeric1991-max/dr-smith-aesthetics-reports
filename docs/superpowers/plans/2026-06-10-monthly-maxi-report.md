# Monthly Maxi Report Routine — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a monthly automated routine that generates a Maxi Report (Wix Analytics + SEO Audit + Financial Summary) on the 1st of each month, saves it as a styled HTML file, and emails it to info@lsmithaesthetics.com.

**Architecture:** A Claude Code scheduled routine gathers data via Wix and Square MCP connectors, runs a local Node.js SEO audit script, passes all structured data to a report generator script that outputs a polished HTML file, then emails it via Gmail MCP. Scripts are pure functions testable in isolation; the routine prompt handles all orchestration.

**Tech Stack:** Node.js (ESM, built-ins only), Wix Analytics Data API (via Wix MCP), Square Payments API (via Square MCP), Gmail MCP, Claude Code scheduled routines.

---

## File Structure

```
/Users/leesmith/Desktop/CLAUDE/
├── scripts/
│   ├── seo-audit.mjs          # Reads local HTML files, returns structured SEO findings JSON
│   ├── report-generator.mjs   # Pure function: data JSON in, HTML string out
│   └── run-report.mjs         # CLI entrypoint: reads data JSON file, writes HTML report file
├── routines/
│   └── monthly-report.md      # Claude routine prompt — step-by-step orchestration instructions
└── reports/
    ├── data-YYYY-MM.json       # Raw data collected each month (kept for reference)
    └── report-YYYY-MM.html     # Generated HTML reports
```

**Existing files touched:**
- None. All new files. The VAT app and website files are read-only inputs.

---

### Task 1: Create project directories

**Files:**
- Create: `scripts/` directory
- Create: `reports/` directory
- Create: `routines/` directory

- [ ] **Step 1: Create directories**

```bash
mkdir -p /Users/leesmith/Desktop/CLAUDE/scripts
mkdir -p /Users/leesmith/Desktop/CLAUDE/reports
mkdir -p /Users/leesmith/Desktop/CLAUDE/routines
```

- [ ] **Step 2: Verify**

```bash
ls /Users/leesmith/Desktop/CLAUDE/
```

Expected: `scripts/`, `reports/`, and `routines/` now appear alongside `VAT/`, `NEW WEBSITE/`, etc.

---

### Task 2: Build the SEO audit script

**Files:**
- Create: `/Users/leesmith/Desktop/CLAUDE/scripts/seo-audit.mjs`

Reads the 8 main HTML page files from the local website directory. For each page, checks title, meta description, H1 count, and images missing alt text. Returns a JSON array — one object per page. No dependencies beyond Node.js built-ins.

- [ ] **Step 1: Create the script**

`/Users/leesmith/Desktop/CLAUDE/scripts/seo-audit.mjs`:

```javascript
import { readFileSync } from 'fs';
import { join } from 'path';

const SITE_DIR = '/Users/leesmith/Desktop/CLAUDE/NEW WEBSITE';

const PAGES = [
  'index.html',
  'treatment-anti-wrinkle.html',
  'treatment-fillers.html',
  'treatment-microneedling.html',
  'treatment-polynucleotides.html',
  'treatment-prp-prf.html',
  'treatment-skin-boosters.html',
  'obagi-page.html',
];

function extractTitle(html) {
  const m = html.match(/<title>([^<]+)<\/title>/i);
  return m ? m[1].trim() : null;
}

function extractMeta(html, name) {
  const m = html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'))
    || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, 'i'));
  return m ? m[1].trim() : null;
}

function countH1s(html) {
  return (html.match(/<h1[\s>]/gi) || []).length;
}

function countImagesWithoutAlt(html) {
  const imgs = html.match(/<img[^>]+>/gi) || [];
  return imgs.filter(tag => !/alt=["'][^"']+["']/.test(tag)).length;
}

function auditPage(filename) {
  const html = readFileSync(join(SITE_DIR, filename), 'utf8');
  const title = extractTitle(html);
  const description = extractMeta(html, 'description');
  const h1Count = countH1s(html);
  const imagesWithoutAlt = countImagesWithoutAlt(html);
  const issues = [];

  if (!title) {
    issues.push({ severity: 'red', text: 'Missing title tag' });
  } else if (title.length < 30) {
    issues.push({ severity: 'amber', text: `Title too short (${title.length} chars, aim 50-60)` });
  } else if (title.length > 65) {
    issues.push({ severity: 'amber', text: `Title too long (${title.length} chars, aim 50-60)` });
  }

  if (!description) {
    issues.push({ severity: 'red', text: 'Missing meta description' });
  } else if (description.length < 120) {
    issues.push({ severity: 'amber', text: `Description too short (${description.length} chars, aim 150-160)` });
  } else if (description.length > 165) {
    issues.push({ severity: 'amber', text: `Description too long (${description.length} chars, aim 150-160)` });
  }

  if (h1Count === 0) {
    issues.push({ severity: 'red', text: 'No H1 tag found' });
  } else if (h1Count > 1) {
    issues.push({ severity: 'amber', text: `Multiple H1 tags (${h1Count})` });
  }

  if (imagesWithoutAlt > 0) {
    issues.push({ severity: 'amber', text: `${imagesWithoutAlt} image(s) missing alt text` });
  }

  return { filename, title, description, h1Count, imagesWithoutAlt, issues };
}

export function runSeoAudit() {
  return PAGES.map(filename => {
    try {
      return auditPage(filename);
    } catch (e) {
      return { filename, error: `Could not read: ${e.message}`, issues: [] };
    }
  });
}

// CLI: node scripts/seo-audit.mjs
if (process.argv[1].endsWith('seo-audit.mjs')) {
  console.log(JSON.stringify(runSeoAudit(), null, 2));
}
```

- [ ] **Step 2: Run and verify**

```bash
node /Users/leesmith/Desktop/CLAUDE/scripts/seo-audit.mjs
```

Expected: a JSON array with 8 objects. Each has `filename`, `title`, `description`, `h1Count`, `imagesWithoutAlt`, and `issues`. Pages with problems show non-empty `issues` arrays with `severity` and `text` fields.

---

### Task 3: Build the report HTML generator

**Files:**
- Create: `/Users/leesmith/Desktop/CLAUDE/scripts/report-generator.mjs`
- Create: `/Users/leesmith/Desktop/CLAUDE/scripts/run-report.mjs`

`report-generator.mjs` is a pure function: takes a data object, returns an HTML string. No file I/O, no side effects. `run-report.mjs` is the CLI wrapper that reads a JSON file and writes the HTML file.

**Input data shape** (the exact shape the routine will produce in Task 4):

```json
{
  "month": "May 2026",
  "period": { "start": "2026-05-01", "end": "2026-05-31" },
  "wix": {
    "sessions": 842,
    "uniqueVisitors": 651,
    "pageViews": 2103,
    "topPages": [
      { "path": "/", "title": "Home", "views": 612 }
    ],
    "sources": { "organic": 48, "direct": 28, "social": 18, "referral": 6 },
    "vsLastMonth": { "sessions": 12, "pageViews": 8 }
  },
  "seo": [
    { "filename": "index.html", "title": "Dr Smith Aesthetics | London", "issues": [] }
  ],
  "keywords": [
    { "term": "botox London", "position": 7, "snippet": "Dr Smith Aesthetics offers..." }
  ],
  "financials": {
    "income": 11450,
    "transactions": 74,
    "expenses": 3200,
    "net": 8250,
    "vsLastMonth": { "income": 7 }
  }
}
```

- [ ] **Step 1: Create the report generator**

`/Users/leesmith/Desktop/CLAUDE/scripts/report-generator.mjs`:

```javascript
const LOGO_PATH = '/Users/leesmith/Desktop/CLAUDE/NEW WEBSITE/DrSmith_Aesthetics_Logo_Transparentpng.png';

function fmt(n) {
  return new Intl.NumberFormat('en-GB').format(Math.round(n || 0));
}

function fmtGBP(n) {
  return `£${fmt(n)}`;
}

function trend(val) {
  if (!val && val !== 0) return '<span style="color:#6b7280">n/a</span>';
  if (val > 0) return `<span style="color:#16a34a">+${val}%</span>`;
  if (val < 0) return `<span style="color:#dc2626">${val}%</span>`;
  return '<span style="color:#6b7280">0%</span>';
}

function badge(severity, text) {
  const s = {
    red:   'background:#fee2e2;color:#dc2626',
    amber: 'background:#fef3c7;color:#92400e',
    green: 'background:#dcfce7;color:#16a34a',
  }[severity] || 'background:#fef3c7;color:#92400e';
  return `<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;${s}">${text}</span>`;
}

function buildRecommendations(seo, keywords, wix, financials) {
  const recs = [];

  (seo || []).forEach(page => {
    (page.issues || []).forEach(issue => {
      recs.push({
        priority: issue.severity === 'red' ? 'High' : 'Medium',
        text: `${page.filename}: ${issue.text}`,
      });
    });
  });

  (keywords || []).forEach(k => {
    if (!k.position || k.position > 10) {
      recs.push({ priority: 'Medium', text: `Improve ranking for "${k.term}" — not in top 10` });
    }
  });

  if (wix?.vsLastMonth?.sessions < -10) {
    recs.push({
      priority: 'High',
      text: `Traffic dropped ${Math.abs(wix.vsLastMonth.sessions)}% vs last month. Review traffic sources.`,
    });
  }

  if (financials?.net < 0) {
    recs.push({
      priority: 'High',
      text: `Net position negative this month. Expenses exceed income by ${fmtGBP(Math.abs(financials.net))}.`,
    });
  }

  if (recs.length === 0) {
    recs.push({ priority: 'Low', text: 'No critical issues found. Continue monitoring.' });
  }

  return recs;
}

export function generateReport(data) {
  const { month, wix, seo, keywords, financials } = data;

  const totalSeoIssues = (seo || []).reduce((s, p) => s + (p.issues?.length || 0), 0);
  const redSeoIssues   = (seo || []).reduce((s, p) => s + (p.issues?.filter(i => i.severity === 'red').length || 0), 0);
  const recs = buildRecommendations(seo, keywords, wix, financials);

  const CSS = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1a1a2e; background: #f7f8fc; }
    .page { max-width: 1100px; margin: 0 auto; padding: 32px 24px; }
    .header { display: flex; align-items: center; justify-content: space-between; padding: 28px 36px; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,20,40,0.08); margin-bottom: 24px; }
    .header-logo { height: 48px; }
    .header-right { text-align: right; }
    .header-right h1 { font-size: 18px; font-weight: 700; color: #062336; letter-spacing: -0.02em; }
    .header-right p { font-size: 12px; color: #6b7280; margin-top: 4px; }
    .cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .card { background: #fff; border-radius: 10px; padding: 18px 20px; box-shadow: 0 1px 6px rgba(0,20,40,0.07); border-top: 3px solid #062336; }
    .card.green { border-top-color: #16a34a; } .card.red { border-top-color: #dc2626; } .card.amber { border-top-color: #d97706; }
    .card-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280; margin-bottom: 6px; }
    .card-value { font-size: 22px; font-weight: 700; color: #062336; letter-spacing: -0.02em; }
    .card-sub { font-size: 11px; color: #9ca3af; margin-top: 4px; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .section { background: #fff; border-radius: 10px; padding: 20px 24px; margin-bottom: 20px; box-shadow: 0 1px 6px rgba(0,20,40,0.07); }
    .section h2 { font-size: 14px; font-weight: 700; color: #062336; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb; }
    table { width: 100%; border-collapse: collapse; font-size: 12.5px; margin-bottom: 16px; }
    thead th { background: #062336; color: #fff; padding: 9px 12px; text-align: left; font-weight: 600; font-size: 11.5px; letter-spacing: 0.03em; }
    thead th.r { text-align: right; }
    tbody tr:nth-child(even) { background: #f9fafb; }
    tbody td { padding: 7px 12px; border-bottom: 1px solid #f0f0f0; color: #374151; }
    tbody td.r { text-align: right; }
    .rec-list { list-style: none; }
    .rec-list li { padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; color: #374151; }
    .rec-list li:last-child { border-bottom: none; }
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Monthly Report — Dr Smith Aesthetics — ${month}</title>
<style>${CSS}</style>
</head>
<body>
<div class="page">

  <div class="header">
    <img class="header-logo" src="${LOGO_PATH}" alt="Dr Smith Aesthetics">
    <div class="header-right">
      <h1>Monthly Report</h1>
      <p>${month} &nbsp;|&nbsp; Generated ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
    </div>
  </div>

  <div class="cards">
    <div class="card ${(wix?.vsLastMonth?.sessions || 0) >= 0 ? 'green' : 'red'}">
      <div class="card-label">Website Sessions</div>
      <div class="card-value">${fmt(wix?.sessions)}</div>
      <div class="card-sub">${trend(wix?.vsLastMonth?.sessions)} vs last month</div>
    </div>
    <div class="card ${(financials?.vsLastMonth?.income || 0) >= 0 ? 'green' : 'red'}">
      <div class="card-label">Monthly Revenue</div>
      <div class="card-value">${fmtGBP(financials?.income)}</div>
      <div class="card-sub">${trend(financials?.vsLastMonth?.income)} vs last month</div>
    </div>
    <div class="card ${(financials?.net || 0) >= 0 ? 'green' : 'red'}">
      <div class="card-label">Net Position</div>
      <div class="card-value">${fmtGBP(financials?.net)}</div>
      <div class="card-sub">Income minus expenses</div>
    </div>
    <div class="card ${redSeoIssues > 0 ? 'red' : totalSeoIssues > 0 ? 'amber' : 'green'}">
      <div class="card-label">SEO Issues</div>
      <div class="card-value">${totalSeoIssues}</div>
      <div class="card-sub">${redSeoIssues} critical</div>
    </div>
  </div>

  <div class="two-col">
    <div class="section">
      <h2>Wix Analytics</h2>
      <table>
        <thead><tr><th>Metric</th><th class="r">Value</th><th class="r">vs Last Month</th></tr></thead>
        <tbody>
          <tr><td>Sessions</td><td class="r">${fmt(wix?.sessions)}</td><td class="r">${trend(wix?.vsLastMonth?.sessions)}</td></tr>
          <tr><td>Unique Visitors</td><td class="r">${fmt(wix?.uniqueVisitors)}</td><td class="r">n/a</td></tr>
          <tr><td>Page Views</td><td class="r">${fmt(wix?.pageViews)}</td><td class="r">${trend(wix?.vsLastMonth?.pageViews)}</td></tr>
        </tbody>
      </table>
      <table>
        <thead><tr><th>Traffic Source</th><th class="r">Share</th></tr></thead>
        <tbody>
          ${Object.entries(wix?.sources || {}).map(([src, pct]) =>
            `<tr><td>${src.charAt(0).toUpperCase() + src.slice(1)}</td><td class="r">${pct}%</td></tr>`
          ).join('')}
        </tbody>
      </table>
      <table>
        <thead><tr><th>Top Pages</th><th class="r">Views</th></tr></thead>
        <tbody>
          ${(wix?.topPages || []).map(p =>
            `<tr><td>${p.title || p.path}</td><td class="r">${fmt(p.views)}</td></tr>`
          ).join('')}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Financial Summary</h2>
      <table>
        <thead><tr><th>Item</th><th class="r">Amount</th></tr></thead>
        <tbody>
          <tr><td>Total Income (Square)</td><td class="r">${fmtGBP(financials?.income)}</td></tr>
          <tr><td>Transactions</td><td class="r">${fmt(financials?.transactions)}</td></tr>
          <tr><td>Daily Average</td><td class="r">${fmtGBP((financials?.income || 0) / 31)}</td></tr>
          <tr><td>Total Expenses</td><td class="r">${fmtGBP(financials?.expenses)}</td></tr>
          <tr style="font-weight:700"><td>Net Position</td><td class="r">${fmtGBP(financials?.net)}</td></tr>
        </tbody>
      </table>
      <p style="font-size:11px;color:#9ca3af;margin-top:4px">Income vs last month: ${trend(financials?.vsLastMonth?.income)}</p>
    </div>
  </div>

  <div class="section">
    <h2>SEO Audit</h2>
    <table>
      <thead><tr><th>Page</th><th>Title</th><th>Issues</th></tr></thead>
      <tbody>
        ${(seo || []).map(p => `
          <tr>
            <td style="white-space:nowrap">${p.filename}</td>
            <td style="max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:${p.title ? '#374151' : '#dc2626'}">${p.title || 'MISSING'}</td>
            <td>${(p.issues?.length > 0)
              ? p.issues.map(i => `${badge(i.severity, i.text)} `).join('')
              : badge('green', 'OK')
            }</td>
          </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Keyword Rankings</h2>
    <table>
      <thead><tr><th>Keyword</th><th>Ranking</th><th>Snippet</th></tr></thead>
      <tbody>
        ${(keywords || []).map(k => `
          <tr>
            <td>${k.term}</td>
            <td>${k.position
              ? badge(k.position <= 3 ? 'green' : k.position <= 10 ? 'amber' : 'red', `#${k.position}`)
              : badge('red', 'Not in top 20')}</td>
            <td style="font-size:11px;color:#6b7280;max-width:300px">${k.snippet || ''}</td>
          </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Recommendations</h2>
    <ul class="rec-list">
      ${recs.map(r => `
        <li>${badge(r.priority === 'High' ? 'red' : r.priority === 'Medium' ? 'amber' : 'green', r.priority)} &nbsp;${r.text}</li>
      `).join('')}
    </ul>
  </div>

</div>
</body>
</html>`;
}
```

- [ ] **Step 2: Create the CLI entrypoint**

`/Users/leesmith/Desktop/CLAUDE/scripts/run-report.mjs`:

```javascript
import { writeFileSync, readFileSync } from 'fs';
import { generateReport } from './report-generator.mjs';

const [,, dataPath, outputPath] = process.argv;

if (!dataPath || !outputPath) {
  console.error('Usage: node scripts/run-report.mjs <data.json> <output.html>');
  process.exit(1);
}

const data = JSON.parse(readFileSync(dataPath, 'utf8'));
const html = generateReport(data);
writeFileSync(outputPath, html, 'utf8');
console.log(`Report saved: ${outputPath}`);
```

- [ ] **Step 3: Test with sample data**

Create `/Users/leesmith/Desktop/CLAUDE/scripts/test-data.json`:

```json
{
  "month": "May 2026",
  "period": { "start": "2026-05-01", "end": "2026-05-31" },
  "wix": {
    "sessions": 842, "uniqueVisitors": 651, "pageViews": 2103,
    "topPages": [
      { "path": "/", "title": "Home", "views": 612 },
      { "path": "/treatment-anti-wrinkle", "title": "Anti-Wrinkle Injections", "views": 287 },
      { "path": "/treatment-fillers", "title": "Dermal Fillers", "views": 241 },
      { "path": "/obagi-page", "title": "Obagi Skincare", "views": 189 },
      { "path": "/treatment-prp-prf", "title": "PRP and PRF", "views": 142 }
    ],
    "sources": { "organic": 48, "direct": 28, "social": 18, "referral": 6 },
    "vsLastMonth": { "sessions": 12, "pageViews": 8 }
  },
  "seo": [],
  "keywords": [
    { "term": "botox London", "position": 7, "snippet": "Dr Smith Aesthetics — expert anti-wrinkle treatments in London." },
    { "term": "dermal fillers London", "position": null, "snippet": "" },
    { "term": "aesthetics clinic London", "position": 14, "snippet": "" },
    { "term": "Dr Smith aesthetics", "position": 1, "snippet": "Official site of Dr Smith Aesthetics." },
    { "term": "polynucleotides London", "position": null, "snippet": "" }
  ],
  "financials": {
    "income": 11450, "transactions": 74, "expenses": 3200, "net": 8250,
    "vsLastMonth": { "income": 7 }
  }
}
```

Run with SEO data populated:

```bash
node /Users/leesmith/Desktop/CLAUDE/scripts/seo-audit.mjs > /tmp/seo.json
```

Then manually copy the JSON array output into the `"seo"` field of `test-data.json`. Then run:

```bash
node /Users/leesmith/Desktop/CLAUDE/scripts/run-report.mjs \
  /Users/leesmith/Desktop/CLAUDE/scripts/test-data.json \
  /Users/leesmith/Desktop/CLAUDE/reports/report-test.html && \
open /Users/leesmith/Desktop/CLAUDE/reports/report-test.html
```

Expected: a polished HTML report opens in the browser with all five sections visible (summary cards, Wix Analytics, Financial Summary, SEO Audit, Keyword Rankings, Recommendations).

---

### Task 4: Write the routine prompt

**Files:**
- Create: `/Users/leesmith/Desktop/CLAUDE/routines/monthly-report.md`

This file contains the step-by-step instructions Claude follows each time the routine runs. It is not code — it is a natural language prompt. It must be precise enough that Claude can execute it without any human input.

- [ ] **Step 1: Create the routine prompt**

`/Users/leesmith/Desktop/CLAUDE/routines/monthly-report.md`:

```markdown
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

Store results as a `wix` object matching this shape:
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

Calculate month-on-month income % change using the prior month's total.

Store results as a `financials` object:
```json
{
  "income": 11450,
  "transactions": 74,
  "expenses": 0,
  "net": 0,
  "vsLastMonth": { "income": 7 }
}
```

Note: `expenses` will be filled in manually below. Leave as 0 for now.

---

## Step 4: Extract expenses from VAT app

Read the file at:
`/Users/leesmith/Desktop/CLAUDE/VAT/VAT-Assessment-DrSmithAesthetics.html`

Scan for any manually entered expense rows that correspond to the reporting month. Look for rows where the date falls within the reporting period and the VAT Category is not "Standard Rated" (i.e. genuine expenses/outgoings rather than income).

Sum those amounts and set as `expenses` in the financials object.
Calculate `net = income - expenses`.

---

## Step 5: Run SEO audit

Run this command and capture the JSON output:
```bash
node /Users/leesmith/Desktop/CLAUDE/scripts/seo-audit.mjs
```

Store the output array as `seo`.

---

## Step 6: Check keyword rankings

Use web search to find the current ranking of lsmithaesthetics.com for each keyword below. Record the position (1-20) if found, or null if not in top 20. Include a brief snippet if available.

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
  "wix": { ... },
  "seo": [ ... ],
  "keywords": [ ... ],
  "financials": { ... }
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

- Subject: `Dr Smith Aesthetics — Monthly Report [MONTH LABEL]`
- Body (plain text):

```
Monthly report for [MONTH LABEL] is ready.

Key numbers:
- Website sessions: [sessions] ([change vs last month])
- Monthly revenue: £[income] ([change vs last month])
- Net position: £[net]
- SEO issues: [total] ([red count] critical)

Full report attached.
```

Attach or embed the contents of the HTML report file.

---

## Step 10: Confirm

Log: "Monthly report for [MONTH LABEL] complete. Saved to reports/report-[FILE-SUFFIX].html and emailed to info@lsmithaesthetics.com."
```

---

### Task 5: Register the scheduled routine

- [ ] **Step 1: Invoke the schedule skill**

Use the `schedule` skill to register a new routine with these parameters:
- Name: `Monthly Maxi Report — Dr Smith Aesthetics`
- Prompt: the contents of `/Users/leesmith/Desktop/CLAUDE/routines/monthly-report.md`
- Schedule: `0 9 1 * *` (09:00 on the 1st of every month)
- Working directory: `/Users/leesmith/Desktop/CLAUDE`

- [ ] **Step 2: Verify the routine appears in the schedule list**

List all routines and confirm the monthly report appears with cron `0 9 1 * *`.

---

### Task 6: Test run for May 2026

- [ ] **Step 1: Trigger the routine manually for May 2026**

Run the routine now, with the reporting period overridden to May 2026 (2026-05-01 to 2026-05-31). This validates the full pipeline end-to-end with real data.

- [ ] **Step 2: Verify the HTML report**

```bash
open /Users/leesmith/Desktop/CLAUDE/reports/report-2026-05.html
```

Check:
- Summary cards show real numbers (not zeros)
- Wix Analytics has actual May traffic data
- Financial Summary shows Square income for May
- SEO table has real findings for all 8 pages
- Keyword rankings reflect live search results
- Recommendations list is generated from actual findings

- [ ] **Step 3: Verify the email**

Check inbox at info@lsmithaesthetics.com for the report email with subject `Dr Smith Aesthetics — Monthly Report May 2026`.
