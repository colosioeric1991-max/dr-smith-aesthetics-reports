import { createSign } from 'crypto';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROPERTY_ID = '455008661';
const OAUTH_FILE = join(__dirname, '..', 'ga-oauth-token.json');
const SA_FILE = join(__dirname, '..', 'ga-credentials.json');

async function getTokenViaOAuth() {
  const { client_id, client_secret, refresh_token } = JSON.parse(readFileSync(OAUTH_FILE, 'utf8'));
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', client_id, client_secret, refresh_token }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`OAuth failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function getTokenViaServiceAccount() {
  const creds = JSON.parse(readFileSync(SA_FILE, 'utf8'));
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const claim = Buffer.from(JSON.stringify({
    iss: creds.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  })).toString('base64url');
  const sign = createSign('RSA-SHA256');
  sign.update(`${header}.${claim}`);
  const jwt = `${header}.${claim}.${sign.sign(creds.private_key, 'base64url')}`;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`SA auth failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function getToken() {
  if (existsSync(OAUTH_FILE)) return getTokenViaOAuth();
  if (existsSync(SA_FILE)) return getTokenViaServiceAccount();
  throw new Error('No GA4 credentials found. Need ga-oauth-token.json or ga-credentials.json');
}

async function runReport(token, body, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    const text = await res.text();
    if (res.ok) return JSON.parse(text);
    if (res.status !== 502 || i === retries - 1) throw new Error(`GA4 API ${res.status}: ${text.slice(0, 200)}`);
    await new Promise(r => setTimeout(r, 2000 * (i + 1)));
  }
}

export async function fetchGA4(startDate, endDate, prevStartDate, prevEndDate) {
  const token = await getToken();

  const metrics = [
    { name: 'sessions' },
    { name: 'totalUsers' },
    { name: 'screenPageViews' },
    { name: 'bounceRate' },
    { name: 'averageSessionDuration' },
  ];
  const overview = await runReport(token, {
    dateRanges: [{ startDate, endDate }],
    metrics,
  });
  const prevOverview = await runReport(token, {
    dateRanges: [{ startDate: prevStartDate, endDate: prevEndDate }],
    metrics,
  });
  const topPages = await runReport(token, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
    metrics: [{ name: 'screenPageViews' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 5,
  });
  const sources = await runReport(token, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
    metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
  });

  const val = (report, row, col) => parseFloat(report?.rows?.[row]?.metricValues?.[col]?.value || 0);
  const int = (report, row, col) => parseInt(report?.rows?.[row]?.metricValues?.[col]?.value || 0, 10);

  const sessions    = int(overview, 0, 0);
  const users       = int(overview, 0, 1);
  const pageViews   = int(overview, 0, 2);
  const bounceRate  = Math.round(val(overview, 0, 3) * 100);
  const avgDuration = Math.round(val(overview, 0, 4));

  const prevSessions  = int(prevOverview, 0, 0);
  const prevPageViews = int(prevOverview, 0, 2);
  const sessionsPct   = prevSessions ? Math.round(((sessions - prevSessions) / prevSessions) * 100) : null;
  const pageViewsPct  = prevPageViews ? Math.round(((pageViews - prevPageViews) / prevPageViews) * 100) : null;

  const pages = (topPages?.rows || []).map(r => ({
    path:  r.dimensionValues[0].value,
    title: r.dimensionValues[1].value,
    views: parseInt(r.metricValues[0].value, 10),
  }));

  const totalSrcSessions = (sources?.rows || []).reduce((s, r) => s + parseInt(r.metricValues[0].value, 10), 0);
  const sourcesMap = {};
  (sources?.rows || []).forEach(r => {
    const name = r.dimensionValues[0].value.toLowerCase().replace(/\s+/g, '_');
    sourcesMap[name] = totalSrcSessions
      ? Math.round((parseInt(r.metricValues[0].value, 10) / totalSrcSessions) * 100)
      : 0;
  });

  return {
    sessions,
    users,
    pageViews,
    bounceRate,
    avgSessionDuration: avgDuration,
    topPages: pages,
    sources: sourcesMap,
    vsLastMonth: { sessions: sessionsPct, pageViews: pageViewsPct },
  };
}

// CLI: node scripts/ga4-fetch.mjs 2026-05-01 2026-05-31 2026-04-01 2026-04-30
if (process.argv[1]?.endsWith('ga4-fetch.mjs')) {
  const [,, start, end, prevStart, prevEnd] = process.argv;
  fetchGA4(start, end, prevStart || '2026-04-01', prevEnd || '2026-04-30')
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(e => { console.error(e.message); process.exit(1); });
}
