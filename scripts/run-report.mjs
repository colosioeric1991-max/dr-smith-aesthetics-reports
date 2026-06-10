import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateReport } from './report-generator.mjs';

const [,, dataPath, outputPath] = process.argv;

if (!dataPath || !outputPath) {
  console.error('Usage: node scripts/run-report.mjs <data.json> <output.html>');
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOGO_FILE = join(__dirname, '..', 'NEW WEBSITE', 'DrSmith_Aesthetics_Logo_Transparentpng.png');

try {
  const data = JSON.parse(readFileSync(dataPath, 'utf8'));

  try {
    const logoBytes = readFileSync(LOGO_FILE);
    data.logoDataUri = `data:image/png;base64,${logoBytes.toString('base64')}`;
  } catch {
    data.logoDataUri = '';
  }

  const html = generateReport(data);
  writeFileSync(outputPath, html, 'utf8');
  console.log(`Report saved: ${outputPath}`);
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}
