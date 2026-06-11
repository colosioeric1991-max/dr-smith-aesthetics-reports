const BASE_URL = 'https://www.lsmithaesthetics.com';

const PAGES = [
  { slug: 'home',           url: '/',               label: 'Homepage' },
  { slug: 'treatments',     url: '/treatments',      label: 'Treatments Overview' },
  { slug: 'anti-wrinkle',   url: '/anti-wrinkle',    label: 'Anti-Wrinkle Injections' },
  { slug: 'filler',         url: '/filler',          label: 'Dermal Fillers' },
  { slug: 'skinbooster',    url: '/skinbooster',     label: 'Skin Boosters' },
  { slug: 'polynucleotides',url: '/polynucleotides', label: 'Polynucleotides' },
  { slug: 'prf',            url: '/prf',             label: 'PRP & PRF' },
  { slug: 'microneedling',  url: '/microneedling',   label: 'Microneedling' },
  { slug: 'pricelist',      url: '/pricelist',       label: 'Price List' },
  { slug: 'obagi',          url: '/obagi',           label: 'Obagi' },
  { slug: 'contact',        url: '/contact',         label: 'Contact' },
  { slug: 'gift-card',      url: '/gift-card',       label: 'Gift Card' },
];

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; DrSmithSEOAudit/1.0)',
  'Accept': 'text/html',
};

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&#x27;/g, "'");
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? decodeEntities(m[1].trim()) : null;
}

function extractDescription(html) {
  // Match content="..." allowing any characters including apostrophes
  const m =
    html.match(/<meta[^>]+name=["']description["'][^>]+content="([^"]+)"/i) ||
    html.match(/<meta[^>]+content="([^"]+)"[^>]+name=["']description["']/i) ||
    html.match(/<meta[^>]+name=["']description["'][^>]+content='([^']+)'/i) ||
    html.match(/<meta[^>]+content='([^']+)'[^>]+name=["']description["']/i);
  return m ? decodeEntities(m[1].trim()) : null;
}

async function auditPage({ slug, url, label }) {
  const fullUrl = `${BASE_URL}${url}`;
  let html;
  try {
    const res = await fetch(fullUrl, { headers: HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch (e) {
    return { slug, label, url: fullUrl, error: `Fetch failed: ${e.message}`, issues: [] };
  }

  const title = extractTitle(html);
  const description = extractDescription(html);
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

  return { slug, label, url: fullUrl, title, description, issues };
}

export async function runSeoAudit() {
  const results = [];
  for (const page of PAGES) {
    results.push(await auditPage(page));
  }
  return results;
}

// CLI: node scripts/seo-audit.mjs
if (process.argv[1]?.endsWith('seo-audit.mjs')) {
  runSeoAudit()
    .then(r => console.log(JSON.stringify(r, null, 2)))
    .catch(e => { console.error(e.message); process.exit(1); });
}
