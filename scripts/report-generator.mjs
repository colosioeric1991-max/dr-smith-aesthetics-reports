const PAGE_NAMES = {
  'index.html':                    'Homepage',
  'treatment-anti-wrinkle.html':   'Anti-Wrinkle Injections',
  'treatment-fillers.html':        'Dermal Fillers',
  'treatment-microneedling.html':  'Microneedling',
  'treatment-polynucleotides.html':'Polynucleotides',
  'treatment-prp-prf.html':        'PRP / PRF',
  'treatment-skin-boosters.html':  'Skin Boosters',
  'obagi-page.html':               'Obagi',
};

const TITLE_SUGGESTIONS = {
  'index.html':                    'Dr Smith Aesthetics | Anti-Wrinkle, Fillers & Skin Treatments, London',
  'treatment-anti-wrinkle.html':   'Anti-Wrinkle Injections London | Dr Smith Aesthetics',
  'treatment-fillers.html':        'Dermal Fillers London | Lip & Facial Fillers | Dr Smith Aesthetics',
  'treatment-microneedling.html':  'Microneedling London | Skin Rejuvenation | Dr Smith Aesthetics',
  'treatment-polynucleotides.html':'Polynucleotides London | Regenerative Skin Treatment | Dr Smith Aesthetics',
  'treatment-prp-prf.html':        'PRP & PRF Treatment London | Platelet-Rich Plasma | Dr Smith Aesthetics',
  'treatment-skin-boosters.html':  'Skin Boosters London | Hydration & Glow | Dr Smith Aesthetics',
  'obagi-page.html':               'Obagi Skincare London | Medical-Grade Products | Dr Smith Aesthetics',
};

const DESC_SUGGESTIONS = {
  'index.html':                    'Dr Smith is a medical doctor offering anti-wrinkle injections, dermal fillers, polynucleotides and skin treatments in London. Book a consultation today.',
  'treatment-anti-wrinkle.html':   'Natural-looking anti-wrinkle injections in London, delivered by Dr Smith. Treat forehead lines, crow\'s feet and frown lines. From £X. Book online.',
  'treatment-fillers.html':        'Expert dermal filler treatments in London with Dr Smith. Lip fillers, cheek fillers and facial contouring. Fully qualified medical doctor. Book today.',
  'treatment-microneedling.html':  'Professional microneedling in London with Dr Smith. Improve skin texture, reduce scarring and stimulate collagen. Medical-grade treatment. Book now.',
  'treatment-polynucleotides.html':'Polynucleotide skin treatment in London with Dr Smith. Regenerate collagen, improve skin quality and slow visible ageing. Book a consultation.',
  'treatment-prp-prf.html':        'PRP and PRF treatments in London with Dr Smith. Use your body\'s own growth factors to rejuvenate skin and stimulate hair growth. Book online.',
  'treatment-skin-boosters.html':  'Skin booster injections in London with Dr Smith. Deep hydration, improved elasticity and a natural glow. Profhilo and Juvederm available. Book now.',
  'obagi-page.html':               'Medical-grade Obagi skincare products available at Dr Smith Aesthetics, London. Clinically proven formulas for brighter, healthier skin. Shop now.',
};

function fmt(n) {
  return new Intl.NumberFormat('en-GB').format(Math.round(n || 0));
}

function fmtGBP(n) {
  if (n === null || n === undefined) return '<span style="color:#9ca3af">—</span>';
  return `£${fmt(n)}`;
}

function trend(val, suffix = '%') {
  if (val === null || val === undefined || (val !== 0 && !val)) return '<span style="color:#6b7280">n/a</span>';
  if (val > 0) return `<span style="color:#16a34a;font-weight:600">+${val}${suffix}</span>`;
  if (val < 0) return `<span style="color:#dc2626;font-weight:600">${val}${suffix}</span>`;
  return '<span style="color:#6b7280">0%</span>';
}

function badge(severity, text) {
  const s = {
    red:   'background:#fee2e2;color:#dc2626',
    amber: 'background:#fef3c7;color:#92400e',
    green: 'background:#dcfce7;color:#16a34a',
    blue:  'background:#dbeafe;color:#1d4ed8',
  }[severity] || 'background:#fef3c7;color:#92400e';
  return `<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;${s}">${text}</span>`;
}

function buildActionPlan(seo, keywords, wix, financials, ga4) {
  const traffic = ga4 || wix;
  const actions = [];

  // --- SEO: missing titles (group all pages together) ---
  const missingTitles = (seo || []).filter(p =>
    p.issues?.some(i => i.text.includes('Missing title') || i.text.includes('Title too short'))
  );
  if (missingTitles.length > 0) {
    const pageList = missingTitles.map(p => PAGE_NAMES[p.filename] || p.filename);
    const examples = missingTitles.slice(0, 2).map(p =>
      TITLE_SUGGESTIONS[p.filename] ? `<em>${PAGE_NAMES[p.filename]}:</em> "${TITLE_SUGGESTIONS[p.filename]}"` : ''
    ).filter(Boolean).join('<br>');
    actions.push({
      priority: 'High',
      category: 'SEO',
      title: `Add title tags to ${missingTitles.length} page${missingTitles.length > 1 ? 's' : ''}`,
      detail: `The following pages are missing a title tag: <strong>${pageList.join(', ')}</strong>. Title tags are the single most important SEO element — Google uses them to understand what each page is about and displays them in search results. Without one, these pages will not rank for any relevant searches.`,
      howTo: `In Wix, go to each page > SEO Settings > Page Title. Aim for 50-60 characters including your main keyword and location. Examples:<br>${examples}`,
    });
  }

  // --- SEO: missing meta descriptions (group) ---
  const missingDesc = (seo || []).filter(p =>
    p.issues?.some(i => i.text.includes('Missing meta description'))
  );
  if (missingDesc.length > 0) {
    const pageList = missingDesc.map(p => PAGE_NAMES[p.filename] || p.filename);
    const example = missingDesc[0];
    actions.push({
      priority: 'High',
      category: 'SEO',
      title: `Add meta descriptions to ${missingDesc.length} page${missingDesc.length > 1 ? 's' : ''}`,
      detail: `The following pages have no meta description: <strong>${pageList.join(', ')}</strong>. While meta descriptions do not directly affect rankings, they appear under your page title in Google search results. A compelling description significantly increases the number of people who click through to your site.`,
      howTo: `In Wix, go to each page > SEO Settings > Meta Description. Aim for 150-160 characters. Include the treatment name, the word "London", and a call to action (e.g. "Book online" or "From £X"). Example for ${PAGE_NAMES[example?.filename]}: "${DESC_SUGGESTIONS[example?.filename] || 'Add a compelling 150-160 character description here.'}"`,
    });
  }

  // --- SEO: missing H1 ---
  const missingH1 = (seo || []).filter(p =>
    p.issues?.some(i => i.text.includes('No H1'))
  );
  if (missingH1.length > 0) {
    actions.push({
      priority: 'High',
      category: 'SEO',
      title: `Add H1 heading to ${missingH1.map(p => PAGE_NAMES[p.filename] || p.filename).join(', ')}`,
      detail: `The ${missingH1.map(p => PAGE_NAMES[p.filename]).join(' and ')} page${missingH1.length > 1 ? 's are' : ' is'} missing an H1 heading. Google uses H1 headings as a strong signal for what the page is about. Every page should have exactly one H1 that includes the main keyword.`,
      howTo: `In Wix, ensure the main headline on the page is set to Heading 1 (H1) in the text editor. For example: "Obagi Skincare London" or "Obagi Medical-Grade Skincare".`,
    });
  }

  // --- Keywords not ranking ---
  const notRanking = (keywords || []).filter(k => {
    const pos = k.position;
    if (!pos) return true;
    if (typeof pos === 'number') return pos > 10;
    return /not in top/i.test(String(pos));
  });
  if (notRanking.length > 0) {
    const terms = notRanking.map(k => `"${k.term}"`).join(', ');
    actions.push({
      priority: 'Medium',
      category: 'SEO',
      title: 'Improve rankings for key treatment searches',
      detail: `The site does not currently appear in the top 10 Google results for ${terms}. These are high-value commercial searches made by people actively looking to book aesthetic treatments in London. Competitors like Dr Nyla, LPA, Harley Street clinics, and Omniya currently dominate these terms.`,
      howTo: `The fastest route to ranking for these terms is fixing the missing title tags and meta descriptions above — that is the foundation. Beyond that, each treatment page needs more written content (at least 300 words covering what the treatment is, what to expect, and pricing). Adding a FAQ section to each page also helps significantly.`,
    });
  }

  // --- Revenue drop ---
  const revPct = financials?.vsLastMonth?.changePct;
  if (revPct !== null && revPct !== undefined && revPct < -10) {
    const changeAmt = financials?.vsLastMonth?.changeGBP;
    const prevTx = financials?.vsLastMonth?.transactions;
    const thisTx = financials?.transactions;
    actions.push({
      priority: 'High',
      category: 'Revenue',
      title: `Investigate ${Math.abs(revPct)}% revenue drop vs last month`,
      detail: `Revenue fell from ${fmtGBP(financials?.vsLastMonth?.income)} to ${fmtGBP(financials?.income)} (${changeAmt ? fmtGBP(Math.abs(changeAmt)) : ''} less). Transactions also dropped from ${prevTx || 'n/a'} to ${thisTx || 'n/a'}. This could reflect seasonal patterns (bank holidays, school holidays reducing bookings), a drop in new enquiries, or fewer repeat visits.`,
      howTo: `Check your booking calendar for the month — were there gaps that should have been filled? Review your social media posting frequency for the prior month, as content consistency typically drives enquiry volume. Consider a re-engagement campaign targeting past clients if bookings are slow.`,
    });
  }

  // --- Revenue positive ---
  if (revPct !== null && revPct !== undefined && revPct > 5) {
    actions.push({
      priority: 'Low',
      category: 'Revenue',
      title: 'Revenue up — identify what drove growth',
      detail: `Revenue grew ${revPct}% vs last month. Understanding what drove this helps you repeat it.`,
      howTo: `Review which treatments were most booked, whether any promotional posts or offers ran, and whether a specific referral source brought in new clients. Document it so you can repeat the approach.`,
    });
  }

  // --- Traffic drop ---
  const sessionsPct = traffic?.vsLastMonth?.sessions;
  if (sessionsPct !== null && sessionsPct !== undefined && sessionsPct < -15) {
    const bounceNote = ga4?.bounceRate > 50
      ? ` The bounce rate is ${ga4.bounceRate}% — more than half of visitors leave without viewing a second page, suggesting the landing page experience may not be compelling enough.`
      : '';
    actions.push({
      priority: 'Medium',
      category: 'Traffic',
      title: `Website traffic dropped ${Math.abs(sessionsPct)}% — review content activity`,
      detail: `Sessions fell noticeably vs last month.${bounceNote} Website traffic for aesthetic clinics is heavily influenced by social media activity and Google search visibility. A drop often follows a period of reduced posting or a change in Instagram algorithm reach.`,
      howTo: `Check whether social media posting frequency changed in the weeks before the drop. Also check Google Search Console for any ranking changes (if set up). Consistent content — at least 3-4 posts per week — is the most reliable driver of traffic to the site.`,
    });
  }

  if (actions.length === 0) {
    actions.push({
      priority: 'Low',
      category: 'General',
      title: 'No critical issues this month',
      detail: 'All key metrics are within normal range. Continue monitoring month on month.',
      howTo: 'Keep up the current approach. Review keyword rankings monthly to track progress.',
    });
  }

  return actions;
}

function buildExecutiveSummary(wix, financials, seo, keywords, ga4) {
  const traffic = ga4 || wix;
  const lines = [];

  // Revenue
  const revPct = financials?.vsLastMonth?.changePct;
  if (revPct !== null && revPct !== undefined) {
    const dir = revPct > 0 ? 'up' : revPct < 0 ? 'down' : 'flat';
    const colour = revPct > 0 ? '#16a34a' : revPct < 0 ? '#dc2626' : '#6b7280';
    lines.push(`Revenue was <strong style="color:${colour}">${fmtGBP(financials?.income)} (${dir} ${Math.abs(revPct)}% vs last month)</strong> from ${fmt(financials?.transactions)} transactions.`);
  } else {
    lines.push(`Revenue was <strong>${fmtGBP(financials?.income)}</strong> from ${fmt(financials?.transactions)} transactions.`);
  }

  // Traffic
  const sessionsPct = traffic?.vsLastMonth?.sessions;
  if (sessionsPct !== null && sessionsPct !== undefined) {
    const dir = sessionsPct > 0 ? 'up' : sessionsPct < 0 ? 'down' : 'unchanged';
    const extra = ga4 ? `, with a ${ga4.bounceRate}% bounce rate and average session of ${Math.floor(ga4.avgSessionDuration/60)}m ${ga4.avgSessionDuration%60}s` : '';
    lines.push(`Website had <strong>${fmt(traffic?.sessions)} sessions via Google Analytics</strong> (${dir} ${Math.abs(sessionsPct)}% vs last month)${extra}.`);
  } else {
    const src = ga4 ? 'Google Analytics' : 'Wix';
    lines.push(`Website had <strong>${fmt(traffic?.sessions)} sessions</strong> (via ${src}) this month.`);
  }

  // SEO
  const redCount = (seo || []).reduce((s, p) => s + (p.issues?.filter(i => i.severity === 'red').length || 0), 0);
  const totalIssues = (seo || []).reduce((s, p) => s + (p.issues?.length || 0), 0);
  if (redCount > 0) {
    lines.push(`The SEO audit found <strong style="color:#dc2626">${redCount} critical issue${redCount > 1 ? 's' : ''}</strong> across the site — primarily missing title tags and meta descriptions on treatment pages. These are preventing Google from indexing the site correctly.`);
  } else if (totalIssues > 0) {
    lines.push(`The SEO audit found ${totalIssues} minor issues. No critical problems this month.`);
  } else {
    lines.push(`SEO audit passed with no issues.`);
  }

  // Keywords
  const ranked = (keywords || []).filter(k => {
    const pos = k.position;
    if (!pos) return false;
    if (typeof pos === 'number') return pos <= 10;
    return /^#[0-9]/.test(String(pos));
  });
  const notRanked = (keywords || []).length - ranked.length;
  if (ranked.length > 0 && notRanked > 0) {
    lines.push(`Of ${(keywords || []).length} tracked keywords, <strong>${ranked.length} rank${ranked.length === 1 ? 's' : ''} in the top 10</strong> and ${notRanked} do not — representing significant untapped search traffic.`);
  } else if (notRanked === (keywords || []).length) {
    lines.push(`None of the ${(keywords || []).length} tracked keywords currently rank in the top 10. Fixing the SEO metadata issues is the first step towards changing this.`);
  }

  return lines;
}

export function generateReport(data) {
  const { month, wix, seo, keywords, financials, ga4 } = data;
  // Use GA4 as primary traffic source; fall back to Wix if GA4 unavailable
  const traffic = ga4 || wix;

  const days = data.period
    ? Math.round((new Date(data.period.end) - new Date(data.period.start)) / 86400000) + 1
    : 31;

  const totalSeoIssues = (seo || []).reduce((s, p) => s + (p.issues?.length || 0), 0);
  const redSeoIssues   = (seo || []).reduce((s, p) => s + (p.issues?.filter(i => i.severity === 'red').length || 0), 0);
  const aov = financials?.transactions ? (financials.income / financials.transactions) : 0;
  const prevAov = financials?.vsLastMonth?.transactions ? (financials.vsLastMonth.income / financials.vsLastMonth.transactions) : 0;
  const aovPct = prevAov ? Math.round(((aov - prevAov) / prevAov) * 100) : null;

  const actions = buildActionPlan(seo, keywords, wix, financials, ga4);
  const highActions = actions.filter(a => a.priority === 'High');
  const summaryLines = buildExecutiveSummary(wix, financials, seo, keywords, ga4);

  const CSS = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1a1a2e; background: #f7f8fc; }
    .page { max-width: 1100px; margin: 0 auto; padding: 32px 24px; }
    .header { display: flex; align-items: center; justify-content: space-between; padding: 28px 36px; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,20,40,0.08); margin-bottom: 24px; }
    .header-logo { height: 52px; }
    .header-right { text-align: right; }
    .header-right h1 { font-size: 20px; font-weight: 700; color: #062336; letter-spacing: -0.02em; }
    .header-right p { font-size: 12px; color: #6b7280; margin-top: 4px; }
    .cards { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 24px; }
    .card { background: #fff; border-radius: 10px; padding: 18px 20px; box-shadow: 0 1px 6px rgba(0,20,40,0.07); border-top: 3px solid #062336; }
    .card.green { border-top-color: #16a34a; } .card.red { border-top-color: #dc2626; } .card.amber { border-top-color: #d97706; }
    .card-label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280; margin-bottom: 6px; }
    .card-value { font-size: 22px; font-weight: 700; color: #062336; letter-spacing: -0.02em; }
    .card-sub { font-size: 11px; color: #9ca3af; margin-top: 4px; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .section { background: #fff; border-radius: 10px; padding: 22px 26px; margin-bottom: 20px; box-shadow: 0 1px 6px rgba(0,20,40,0.07); }
    .section h2 { font-size: 13px; font-weight: 700; color: #062336; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 2px solid #062336; }
    .section-note { font-size: 11.5px; color: #6b7280; margin-top: 12px; font-style: italic; }
    table { width: 100%; border-collapse: collapse; font-size: 12.5px; margin-bottom: 14px; }
    thead th { background: #062336; color: #fff; padding: 9px 12px; text-align: left; font-weight: 600; font-size: 11.5px; letter-spacing: 0.03em; }
    thead th.r { text-align: right; }
    tbody tr:nth-child(even) { background: #f9fafb; }
    tbody tr:last-child td { border-bottom: none; }
    tbody td { padding: 8px 12px; border-bottom: 1px solid #f0f0f0; color: #374151; vertical-align: middle; }
    tbody td.r { text-align: right; }
    tbody tr.total-row td { font-weight: 700; background: #f0f4f8; border-top: 2px solid #e5e7eb; }
    .summary-box { background: #f0f6ff; border-left: 4px solid #062336; border-radius: 0 8px 8px 0; padding: 16px 20px; margin-bottom: 24px; }
    .summary-box p { font-size: 13.5px; line-height: 1.7; color: #1a1a2e; margin-bottom: 6px; }
    .summary-box p:last-child { margin-bottom: 0; }
    .action { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 18px; margin-bottom: 14px; }
    .action:last-child { margin-bottom: 0; }
    .action.high { border-left: 4px solid #dc2626; }
    .action.medium { border-left: 4px solid #d97706; }
    .action.low { border-left: 4px solid #16a34a; }
    .action-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .action-title { font-size: 13.5px; font-weight: 700; color: #062336; }
    .action-body { font-size: 12.5px; color: #374151; line-height: 1.65; margin-bottom: 10px; }
    .action-howto { font-size: 12px; color: #374151; line-height: 1.65; background: #f9fafb; border-radius: 6px; padding: 10px 12px; border-left: 3px solid #d1d5db; }
    .action-howto strong { color: #062336; }
    .how-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280; margin-bottom: 4px; }
  `;

  const positionBadge = (pos) => {
    if (!pos) return badge('red', 'Not tracked');
    if (typeof pos === 'number') return badge(pos <= 3 ? 'green' : pos <= 10 ? 'amber' : 'red', `#${pos}`);
    const s = String(pos).toLowerCase();
    if (s.startsWith('#1') || s === '1') return badge('green', pos);
    if (/^#[2-3]$/.test(s.trim())) return badge('green', pos);
    if (/not in top/i.test(s)) return badge('red', 'Not in top 10');
    return badge('amber', pos);
  };

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

  <!-- Header -->
  <div class="header">
    <img class="header-logo" src="${data.logoDataUri || ''}" alt="Dr Smith Aesthetics">
    <div class="header-right">
      <h1>Monthly Maxi Report</h1>
      <p>${month} &nbsp;|&nbsp; Generated ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
    </div>
  </div>

  <!-- Executive Summary -->
  <div class="summary-box">
    ${summaryLines.map(l => `<p>${l}</p>`).join('')}
    ${highActions.length > 0 ? `<p style="margin-top:8px"><strong>${highActions.length} high-priority action${highActions.length > 1 ? 's' : ''} require attention this month</strong> — see the Action Plan below.</p>` : ''}
  </div>

  <!-- Summary Cards -->
  <div class="cards">
    <div class="card ${(financials?.vsLastMonth?.changePct || 0) >= 0 ? 'green' : 'red'}">
      <div class="card-label">Monthly Revenue</div>
      <div class="card-value">${fmtGBP(financials?.income)}</div>
      <div class="card-sub">${trend(financials?.vsLastMonth?.changePct)} vs last month</div>
    </div>
    <div class="card">
      <div class="card-label">Avg Order Value</div>
      <div class="card-value">${fmtGBP(aov)}</div>
      <div class="card-sub">${trend(aovPct)} vs last month</div>
    </div>
    <div class="card ${(traffic?.vsLastMonth?.sessions || 0) >= 0 ? 'green' : 'red'}">
      <div class="card-label">Website Sessions</div>
      <div class="card-value">${fmt(traffic?.sessions)}</div>
      <div class="card-sub">${trend(traffic?.vsLastMonth?.sessions)} vs last month</div>
    </div>
    <div class="card ${redSeoIssues > 0 ? 'red' : totalSeoIssues > 0 ? 'amber' : 'green'}">
      <div class="card-label">SEO Issues</div>
      <div class="card-value">${totalSeoIssues}</div>
      <div class="card-sub">${redSeoIssues} critical, ${totalSeoIssues - redSeoIssues} warnings</div>
    </div>
    <div class="card ${highActions.length > 0 ? 'red' : 'green'}">
      <div class="card-label">Actions Required</div>
      <div class="card-value">${actions.length}</div>
      <div class="card-sub">${highActions.length} high priority</div>
    </div>
  </div>

  <!-- Financials + Traffic side by side -->
  <div class="two-col">
    <div class="section">
      <h2>Financial Summary</h2>
      <table>
        <thead><tr><th>Metric</th><th class="r">This Month</th><th class="r">Last Month</th></tr></thead>
        <tbody>
          <tr><td>Total Revenue</td><td class="r">${fmtGBP(financials?.income)}</td><td class="r" style="color:#6b7280">${fmtGBP(financials?.vsLastMonth?.income)}</td></tr>
          <tr><td>Transactions</td><td class="r">${fmt(financials?.transactions)}</td><td class="r" style="color:#6b7280">${fmt(financials?.vsLastMonth?.transactions)}</td></tr>
          <tr><td>Avg Order Value</td><td class="r">${fmtGBP(aov)}</td><td class="r" style="color:#6b7280">${fmtGBP(prevAov)}</td></tr>
          <tr><td>Daily Average</td><td class="r">${fmtGBP((financials?.income || 0) / days)}</td><td class="r" style="color:#6b7280">—</td></tr>
          <tr><td>Expenses</td><td class="r">${financials?.expenses ? fmtGBP(financials.expenses) : '<span style="color:#9ca3af;font-style:italic">manual entry</span>'}</td><td class="r" style="color:#6b7280">—</td></tr>
          <tr class="total-row"><td>Net Position</td><td class="r">${financials?.net ? fmtGBP(financials.net) : '<span style="color:#9ca3af;font-style:italic">pending expenses</span>'}</td><td class="r">—</td></tr>
        </tbody>
      </table>
      <div class="section-note">Month-on-month change: ${trend(financials?.vsLastMonth?.changePct)} &nbsp;(${financials?.vsLastMonth?.changeGBP ? fmtGBP(Math.abs(financials.vsLastMonth.changeGBP)) + ' ' + (financials.vsLastMonth.changeGBP < 0 ? 'less' : 'more') + ' than last month' : 'no comparison available'})</div>
    </div>

    <div class="section">
      <h2>Website Traffic ${ga4 ? '<span style="font-size:10px;font-weight:400;color:#6b7280;text-transform:none;letter-spacing:0">via Google Analytics</span>' : '<span style="font-size:10px;font-weight:400;color:#6b7280;text-transform:none;letter-spacing:0">via Wix</span>'}</h2>
      <table>
        <thead><tr><th>Metric</th><th class="r">This Month</th><th class="r">vs Last Month</th></tr></thead>
        <tbody>
          <tr><td>Sessions</td><td class="r">${fmt(traffic?.sessions)}</td><td class="r">${trend(traffic?.vsLastMonth?.sessions)}</td></tr>
          <tr><td>${ga4 ? 'Users' : 'Unique Visitors'}</td><td class="r">${fmt(ga4 ? ga4.users : traffic?.uniqueVisitors)}</td><td class="r"><span style="color:#6b7280">—</span></td></tr>
          <tr><td>Page Views</td><td class="r">${fmt(ga4 ? ga4.pageViews : traffic?.pageViews)}</td><td class="r">${trend(traffic?.vsLastMonth?.pageViews)}</td></tr>
          <tr><td>Daily Average (Sessions)</td><td class="r">${fmt(Math.round((traffic?.sessions || 0) / days))}</td><td class="r">—</td></tr>
          ${ga4 ? `<tr><td>Bounce Rate</td><td class="r">${ga4.bounceRate}%</td><td class="r">—</td></tr>
          <tr><td>Avg Session Duration</td><td class="r">${Math.floor(ga4.avgSessionDuration / 60)}m ${ga4.avgSessionDuration % 60}s</td><td class="r">—</td></tr>` : ''}
        </tbody>
      </table>
      ${Object.keys(traffic?.sources || {}).length > 0 ? `
      <table>
        <thead><tr><th>Traffic Source</th><th class="r">Share</th></tr></thead>
        <tbody>
          ${Object.entries(traffic?.sources || {}).map(([src, pct]) =>
            `<tr><td>${src.charAt(0).toUpperCase() + src.slice(1).replace(/_/g, ' ')}</td><td class="r">${pct}%</td></tr>`
          ).join('')}
        </tbody>
      </table>` : `<div class="section-note">Traffic source breakdown not available this month.</div>`}
      ${(traffic?.topPages || []).length > 0 ? `
      <table>
        <thead><tr><th>Top Pages</th><th class="r">Views</th></tr></thead>
        <tbody>
          ${(traffic.topPages || []).map(p =>
            `<tr><td>${p.title || p.path}</td><td class="r">${fmt(p.views)}</td></tr>`
          ).join('')}
        </tbody>
      </table>` : ''}
      ${!ga4 && wix?.vsLastMonth?.note ? `<div class="section-note">${wix.vsLastMonth.note}</div>` : ''}
    </div>
  </div>

  <!-- SEO Audit -->
  <div class="section">
    <h2>SEO Audit</h2>
    <table>
      <thead><tr><th>Page</th><th>Current Title</th><th>Description</th><th>Issues</th></tr></thead>
      <tbody>
        ${(seo || []).map(p => `
          <tr>
            <td style="white-space:nowrap;font-weight:600;color:#062336">${PAGE_NAMES[p.filename] || p.filename}</td>
            <td style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:${p.title ? '#374151' : '#dc2626'}">${p.title || 'MISSING'}</td>
            <td style="color:${p.description ? '#374151' : '#dc2626'}">${p.description ? badge('green', 'Present') : badge('red', 'Missing')}</td>
            <td>${(p.issues?.length > 0)
              ? p.issues.map(i => `${badge(i.severity, i.text)} `).join('')
              : badge('green', 'OK')
            }</td>
          </tr>`).join('')}
      </tbody>
    </table>
    <div class="section-note">All 8 site pages audited. ${redSeoIssues} critical issue${redSeoIssues !== 1 ? 's' : ''} found. See Action Plan for specific fixes and suggested copy.</div>
  </div>

  <!-- Keyword Rankings -->
  <div class="section">
    <h2>Keyword Rankings</h2>
    <table>
      <thead><tr><th>Keyword</th><th>Ranking</th><th>Context</th></tr></thead>
      <tbody>
        ${(keywords || []).map(k => `
          <tr>
            <td style="font-weight:600">${k.term}</td>
            <td>${positionBadge(k.position)}</td>
            <td style="font-size:12px;color:#6b7280">${k.snippet || ''}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    <div class="section-note">Rankings are checked manually via web search on the date this report was generated. Positions can vary by location and device. Fixing title tags and meta descriptions is the foundation for improving all non-branded rankings.</div>
  </div>

  <!-- Action Plan -->
  <div class="section">
    <h2>Action Plan</h2>
    ${actions.map(a => `
      <div class="action ${a.priority.toLowerCase()}">
        <div class="action-header">
          ${badge(a.priority === 'High' ? 'red' : a.priority === 'Medium' ? 'amber' : 'green', a.priority)}
          ${badge('blue', a.category)}
          <span class="action-title">${a.title}</span>
        </div>
        <div class="action-body">${a.detail}</div>
        <div class="how-label">How to fix</div>
        <div class="action-howto">${a.howTo}</div>
      </div>
    `).join('')}
  </div>

</div>
</body>
</html>`;
}
