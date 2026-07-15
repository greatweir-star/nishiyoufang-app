const fs = require('fs');
const path = require('path');

const SRC_MODULES = path.resolve(__dirname, '../../nihaixia-src/modules');
const SRC_CASES = path.resolve(__dirname, '../../nihaixia-src/cases');
const OUT_DIR = path.resolve(__dirname, '../www/data');

function copyDir(src, dst) {
  if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const s = path.join(src, name);
    const d = path.join(dst, name);
    if (fs.statSync(s).isFile()) {
      fs.copyFileSync(s, d);
    }
  }
}

function extractHeadings(text, max = 10) {
  const lines = text.split('\n');
  const headings = [];
  for (const line of lines) {
    const m = line.match(/^(#{2,4})\s+(.+)$/);
    if (m) {
      headings.push({ level: m[1].length, title: m[2].trim() });
      if (headings.length >= max) break;
    }
  }
  return headings;
}

function buildIndex(dir, type) {
  const items = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (!fs.statSync(p).isFile() || !name.endsWith('.md')) continue;
    const text = fs.readFileSync(p, 'utf-8');
    const firstLine = text.split('\n')[0].replace(/^#+\s*/, '').trim();
    const headings = extractHeadings(text);
    items.push({
      type,
      file: name,
      title: firstLine || name,
      size: fs.statSync(p).size,
      headings,
      preview: text.slice(0, 300).replace(/\n/g, ' ')
    });
  }
  return items;
}

// 清空并复制数据
if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });
copyDir(SRC_MODULES, path.join(OUT_DIR, 'modules'));
copyDir(SRC_CASES, path.join(OUT_DIR, 'cases'));

const index = {
  generated: new Date().toISOString(),
  modules: buildIndex(SRC_MODULES, 'module'),
  cases: buildIndex(SRC_CASES, 'case')
};

fs.writeFileSync(path.join(OUT_DIR, 'index.json'), JSON.stringify(index, null, 2));
console.log(`Built data index: ${index.modules.length} modules, ${index.cases.length} cases`);
