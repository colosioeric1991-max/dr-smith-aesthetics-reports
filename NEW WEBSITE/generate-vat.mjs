import { writeFileSync } from 'fs';

// Net sales from file 1: 01/01/2025 to 01/01/2026 (366 days)
const raw1 = `£0.00","£232.50","£0.00","£30.00","£343.50","£0.00","£0.00","£0.00","£0.00","£0.00","£0.00","£0.00","£30.00","£0.00","£0.00","£0.00","£100.00","£0.00","£0.00","£0.00","£0.00","£180.00","£0.00","£1,096.50","£100.00","£0.00","£141.00","£216.00","£0.00","£342.00","£826.50","£1,020.00","£0.00","£216.00","£186.00","£0.00","£0.00","£158.30","£0.00","£225.00","£324.41","£0.00","£0.00","£290.00","£90.00","£0.00","£432.00","£50.00","£125.00","£249.00","£159.00","£343.00","£190.00","£310.50","£0.00","£0.00","£675.00","£0.00","£346.66","£369.00","£0.00","£0.00","£0.00","£0.00","£190.00","£0.00","£0.00","£230.00","£60.00","£1,640.00","£240.00","£1,020.00","£0.00","£0.00","£0.00","£0.00","£0.00","£1,056.00","£0.00","£131.50","£263.00","£180.00","£0.00","£640.00","£0.00","£60.00","£471.00","£96.00","£0.00","£30.00","£0.00","£375.00","£80.00","£849.50","£0.00","£381.00","£30.00","£325.00","£160.00","£676.00","£240.00","£0.00","£74.00","£0.00","£1,255.00","£30.00","£0.00","£0.00","£30.00","£0.00","£126.00","£141.00","£710.50","£30.00","£30.00","£0.00","£0.00","£0.00","£510.00","£0.00","£255.00","£396.00","£0.00","£0.00","£0.00","£750.00","£0.00","£30.00","£592.00","£0.00","£403.00","£0.00","£240.00","£637.50","£0.00","£490.00","£0.00","£0.00","£0.00","£0.00","£30.00","£0.00","£261.00","£200.25","£60.00","£0.00","£345.00","£480.00","£240.00","£370.00","£150.00","£0.00","£0.00","£240.00","£170.00","£170.00","£255.00","£247.50","£350.00","£80.00","£755.00","£0.00","£0.00","£525.00","£202.05","£0.00","£0.00","£30.00","£110.00","£395.00","£425.00","£234.00","£60.00","£631.00","£0.00","£693.50","£320.00","£812.00","£0.00","£400.00","£1,630.00","£30.00","£234.00","£0.00","£30.00","£30.00","£30.00","(£30.00)","£330.00","£30.00","£480.00","£540.00","£0.00","£30.00","£1,160.00","£60.00","£330.00","£510.00","£350.00","£50.00","£1,987.50","£0.00","£0.00","£30.00","£0.00","£0.00","£30.00","£0.00","£30.00","£72.50","£1,173.75","£335.00","£880.00","£0.00","£30.00","£270.00","£221.25","£1,166.00","£30.00","£641.00","£445.00","£0.00","£0.00","£195.00","£487.00","£150.00","£171.00","£170.00","£0.00","£341.00","£0.00","£100.00","£50.00","£100.00","£0.00","£0.00","£0.00","£0.00","£100.00","£724.50","£1,043.00","(£50.00)","£140.00","£347.50","£766.00","£637.50","£0.00","£1,062.00","£100.00","£0.00","£860.00","£100.00","£171.00","£50.00","£617.00","£200.00","£210.00","£220.00","£0.00","£0.00","£50.00","£370.00","£0.00","£310.00","£0.00","£50.00","£50.00","£485.00","£0.00","£100.00","£740.00","£170.00","£100.00","£0.00","£359.00","£0.00","£50.00","£0.00","£622.00","£310.00","£480.00","£220.00","£401.00","£0.00","£374.00","£560.00","£50.00","£50.00","£210.00","£553.00","£171.00","£50.00","£50.00","£190.00","£640.00","£1,259.99","£270.00","£130.00","£723.00","£358.00","£500.00","£0.00","£50.00","£580.00","£137.00","£50.00","£50.00","£140.00","£0.00","£340.00","£0.00","£220.00","£420.00","£198.00","£0.00","£859.50","£930.00","£1,038.50","£0.00","£50.00","£360.00","£170.00","£260.00","£50.00","£0.00","£460.00","£0.00","£50.00","£619.50","£100.00","£772.50","£150.00","£100.00","£0.00","£987.50","£280.00","£100.00","£50.00","£1,996.00","£50.00","£0.00","£120.00","£372.00","£741.00","£0.00","£455.00","£0.00","£0.00","£170.00","£260.00","£0.00","£50.00","£431.00","£50.00","£0.00","£710.00","£0.00","£0.00","£0.00","£0.00","£170.00","£200.00","£0.00","£100.00","£260.00","£0.00`;

// Net sales from file 2: 02/01/2026 to 01/04/2026 (90 days)
const raw2 = `£0.00","£202.50","£450.00","£0.00","£1,134.50","£480.00","£170.00","£188.00","£50.00","£300.00","£0.00","£733.00","£461.00","£0.00","£1,245.00","£50.00","£0.00","£100.00","£0.00","£50.00","£50.00","£1,139.00","£911.50","£50.00","£293.00","£0.00","£715.00","£50.00","£0.00","£50.00","£50.00","£937.00","£0.00","£0.00","£184.00","£663.00","£640.00","£585.00","£150.00","£50.00","£260.00","£520.00","£1,220.00","£0.00","£210.00","£300.00","£50.00","£50.00","£2,375.00","£540.00","£0.00","£430.00","£50.00","£0.00","£210.00","£0.00","£50.00","£0.00","£0.00","£873.00","£260.00","£226.00","£2,109.00","£570.00","£1,692.00","£326.00","£0.00","£583.00","£150.00","£1,445.00","£50.00","£0.00","£0.00","£600.00","£740.00","£220.00","£818.00","£522.00","£0.00","£880.00","£0.00","£480.00","£100.00","£715.00","£540.00","£0.00","£100.00","£640.00","£310.00","£929.00`;

const parse = raw => [...raw.matchAll(/\((£[\d,]+\.?\d*)\)|(£[\d,]+\.?\d*)/g)].map(m =>
  m[1] ? -parseFloat(m[1].replace('£','').replace(/,/g,''))
        :  parseFloat(m[2].replace('£','').replace(/,/g,''))
);

const amounts1 = parse(raw1);
const amounts2 = parse(raw2);

const pad = n => String(n).padStart(2,'0');
const fmtKey = dt => `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}`;
const fmtDisplay = dt => `${pad(dt.getDate())}/${pad(dt.getMonth()+1)}/${dt.getFullYear()}`;

// Build date->amount map
const data = {};
let d = new Date(2025, 0, 1);
amounts1.forEach(amt => { data[fmtKey(d)] = amt; d.setDate(d.getDate() + 1); });
amounts2.forEach(amt => { data[fmtKey(d)] = amt; d.setDate(d.getDate() + 1); });

// Build ordered array of all dates
const allDates = [];
d = new Date(2025, 0, 1);
const last = new Date(2026, 3, 1);
while (d <= last) { allDates.push(fmtKey(new Date(d))); d.setDate(d.getDate() + 1); }

// Pre-compute rolling 12-month total at end of each month
const monthEndRolling = {};
for (let y = 2025; y <= 2026; y++) {
  for (let m = 0; m <= 11; m++) {
    if (y === 2026 && m > 2) break;
    const monthEnd = new Date(y, m + 1, 0);
    const windowStart = new Date(y, m - 11, 1);
    let total = 0;
    let dd = new Date(windowStart);
    while (dd <= monthEnd) { total += (data[fmtKey(dd)] || 0); dd.setDate(dd.getDate() + 1); }
    monthEndRolling[`${y}-${pad(m+1)}`] = total;
  }
}

// Find first month threshold was crossed
let crossedYM = null;
for (const [ym, total] of Object.entries(monthEndRolling)) {
  if (total >= 90000) { crossedYM = ym; break; }
}

// Escape CSV field
const esc = s => `"${String(s).replace(/"/g, '""')}"`;

const rows = [];

// Header
rows.push('VAT THRESHOLD ASSESSMENT — UK LTD COMPANY');
rows.push('"Data sources: Square card machine exports (01/01/2025 to 01/04/2026 — two files combined)"');
rows.push('"VAT threshold rule (HMRC): Rolling 12-month taxable turnover must not exceed £90,000"');
rows.push('"IMPORTANT: This file contains Square card machine data only. Payments via booking system (not through Square) must also be added."');
rows.push('');

rows.push('KEY — VAT CATEGORIES,,,,,,');
rows.push(esc('Standard Rated (20%)') + ',' + esc('Cosmetic aesthetics: botox, fillers, skin boosters, microneedling, PRP (cosmetic), product sales, consultations. COUNTS toward threshold.') + ',,,,,');
rows.push(esc('VAT Exempt') + ',' + esc('Genuine medical care (therapeutic/diagnostic purpose). HMRC is strict — most aesthetics do NOT qualify. Does NOT count toward threshold.') + ',,,,,');
rows.push(esc('Outside Scope') + ',' + esc('Refunds, compensation, non-business receipts. Does NOT count toward threshold.') + ',,,,,');
rows.push('');

// Column headers
rows.push('Date,Transaction Source,Description,Net Sales (£),VAT Category,Counts Toward Threshold?,Rolling 12-Month Total (£) — shown at month end only,Notes');

// Data rows
for (const key of allDates) {
  const [y, m, day] = key.split('-');
  const dt = new Date(parseInt(y), parseInt(m)-1, parseInt(day));
  const dateStr = fmtDisplay(dt);
  const amt = data[key] || 0;

  const isMonthEnd = new Date(parseInt(y), parseInt(m), 0).getDate() === parseInt(day);
  const ymKey = `${y}-${m}`;
  const rollingTotal = isMonthEnd && monthEndRolling[ymKey] !== undefined
    ? monthEndRolling[ymKey].toFixed(2)
    : '';

  let note = '';
  if (isMonthEnd && monthEndRolling[ymKey] !== undefined) {
    const t = monthEndRolling[ymKey];
    if (crossedYM === ymKey) {
      note = '*** ROLLING 12-MONTH THRESHOLD CROSSED THIS MONTH — £93,102.79 — HMRC notification deadline was 30/03/2026 — VAT registration effective 01/04/2026 ***';
    } else if (t >= 90000) {
      note = `Over threshold — rolling 12-month total £${t.toFixed(2)}`;
    }
  }

  rows.push([dateStr, 'Square (Card Machine)', 'Daily net sales', amt.toFixed(2), 'Standard Rated (20%)', 'Yes', rollingTotal, note].map(esc).join(','));
}

rows.push('');
rows.push('');

// Monthly summary
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
rows.push('— MONTHLY SUMMARY —');
rows.push('Month,Net Sales (£),Rolling 12-Month Total (£),Status');
for (let y = 2025; y <= 2026; y++) {
  for (let m = 0; m <= 11; m++) {
    if (y === 2026 && m > 2) break;
    const ymKey = `${y}-${pad(m+1)}`;
    const rolling = monthEndRolling[ymKey];
    let monthlySales = 0;
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      monthlySales += (data[`${y}-${pad(m+1)}-${pad(day)}`] || 0);
    }
    const label = `${monthNames[m]} ${y}`;
    const status = rolling >= 90000
      ? (crossedYM === ymKey ? '*** THRESHOLD CROSSED — HMRC NOTIFICATION REQUIRED ***' : 'OVER THRESHOLD')
      : 'Under threshold';
    rows.push([label, monthlySales.toFixed(2), rolling.toFixed(2), status].map(esc).join(','));
  }
}

rows.push('');
rows.push('— ROLLING 12-MONTH ANALYSIS RESULTS —');
rows.push('"Threshold first exceeded at end of:","February 2026",,,');
rows.push('"Rolling 12-month total:","£93,102.79",,,');
rows.push('"HMRC notification deadline:","30 March 2026",,,');
rows.push('"VAT registration effective from:","01 April 2026",,,');
rows.push('"Status as of 02/04/2026:","*** DEADLINE PASSED — CONTACT YOUR ACCOUNTANT IMMEDIATELY ***",,,');
rows.push('');
rows.push('— IMPORTANT ACTIONS —');
rows.push('"1. URGENT: The HMRC notification deadline of 30 March 2026 has ALREADY PASSED."');
rows.push('"2. You should be VAT registered effective 01 April 2026 — contact your accountant TODAY."');
rows.push('"3. VAT (20%) should be applied to all standard-rated sales from 01 April 2026 onwards."');
rows.push('"4. Ask your accountant to submit VAT1 registration form to HMRC immediately."');
rows.push('"5. BOOKING SYSTEM: Add any payments received via booking system not processed through Square."');
rows.push('');
rows.push('— NOTES FOR YOUR ACCOUNTANT —');
rows.push('"1. Data source: Square daily sales summary — Net sales (gross sales minus returns, before Square fees)"');
rows.push('"2. Square processing fees NOT deducted — fees are a business expense, not a deduction from taxable turnover"');
rows.push('"3. Two Square exports combined: 01/01/2025–01/01/2026 and 02/01/2026–01/04/2026 (456 days total)"');
rows.push('"4. Booking system payments not included — please advise if any are separate from Square card machine"');
rows.push('"5. All treatments assumed Standard Rated (20%) — please confirm if any qualify as VAT Exempt medical care"');
rows.push('"6. Rolling 12-month method used per HMRC VAT registration rules"');

writeFileSync('/Users/leesmith/Desktop/VAT-Assessment-Template.csv', rows.join('\n'), 'utf8');
console.log('Done. Rows written: ' + rows.length);
console.log('Dates: ' + allDates.length);
console.log('File 1 values: ' + amounts1.length);
console.log('File 2 values: ' + amounts2.length);
