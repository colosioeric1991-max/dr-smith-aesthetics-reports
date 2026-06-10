import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..', 'NEW WEBSITE');
const EMBEDS_DIR = join(ROOT_DIR, 'wix-embeds');

const PAGES = [
  { dir: ROOT_DIR,    filename: 'index.html' },
  { dir: EMBEDS_DIR,  filename: 'treatment-anti-wrinkle.html' },
  { dir: EMBEDS_DIR,  filename: 'treatment-fillers.html' },
  { dir: EMBEDS_DIR,  filename: 'treatment-microneedling.html' },
  { dir: EMBEDS_DIR,  filename: 'treatment-polynucleotides.html' },
  { dir: EMBEDS_DIR,  filename: 'treatment-prp-prf.html' },
  { dir: EMBEDS_DIR,  filename: 'treatment-skin-boosters.html' },
  { dir: EMBEDS_DIR,  filename: 'obagi-page.html' },
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

function auditPage({ dir, filename }) {
  const html = readFileSync(join(dir, filename), 'utf8');
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
  return PAGES.map(page => {
    try {
      return auditPage(page);
    } catch (e) {
      return { filename: page.filename, error: `Could not read: ${e.message}`, issues: [] };
    }
  });
}

// CLI: node scripts/seo-audit.mjs
if (process.argv[1].endsWith('seo-audit.mjs')) {
  console.log(JSON.stringify(runSeoAudit(), null, 2));
}
