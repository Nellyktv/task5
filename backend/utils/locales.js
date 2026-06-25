import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, '..', 'locales');

const datasets = {};

for (const file of readdirSync(LOCALES_DIR)) {
  if (!file.endsWith('.json')) continue;
  const code = file.replace(/\.json$/, '');
  datasets[code] = JSON.parse(readFileSync(join(LOCALES_DIR, file), 'utf-8'));
}

export const getLocaleData = (lang) => datasets[lang] || datasets.en;
