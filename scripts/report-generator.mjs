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
    const pos = typeof k.position === 'number' ? k.position : null;
    if (!pos || pos > 10) {
      recs.push({ priority: 'Medium', text: `Improve ranking for "${k.term}": not ranked in top 10` });
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

  const days = data.period
    ? Math.round((new Date(data.period.end) - new Date(data.period.start)) / 86400000) + 1
    : 31;

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
<title>Monthly Report | Dr Smith Aesthetics | ${month}</title>
<style>${CSS}</style>
</head>
<body>
<div class="page">

  <div class="header">
    <img class="header-logo" src="${data.logoDataUri || ''}" alt="Dr Smith Aesthetics">
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
      <div class="card-sub">${trend(financials?.vsLastMonth?.changePct)} vs last month</div>
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
          <tr><td>Daily Average</td><td class="r">${fmtGBP((financials?.income || 0) / days)}</td></tr>
          <tr><td>Total Expenses</td><td class="r">${fmtGBP(financials?.expenses)}</td></tr>
          <tr style="font-weight:700"><td>Net Position</td><td class="r">${fmtGBP(financials?.net)}</td></tr>
        </tbody>
      </table>
      <p style="font-size:11px;color:#9ca3af;margin-top:4px">Income vs last month: ${trend(financials?.vsLastMonth?.changePct)}</p>
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
            <td>${(() => {
              const pos = k.position;
              if (!pos) return badge('red', 'Not tracked');
              if (typeof pos === 'number') return badge(pos <= 3 ? 'green' : pos <= 10 ? 'amber' : 'red', `#${pos}`);
              const posStr = String(pos).toLowerCase();
              if (posStr.startsWith('#1') || posStr === '1') return badge('green', pos);
              if (/^#[2-3]$/.test(posStr.trim())) return badge('green', pos);
              if (/not in top/i.test(posStr)) return badge('red', 'Not in top 10');
              return badge('amber', pos);
            })()}</td>
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
