import fs from 'fs';
const c = fs.readFileSync('src/data/mcqs.ts', 'utf8');
const ids = [...c.matchAll(/id: "(u2t\d+)-q(\d+)"/g)];
const map = {};
ids.forEach(m => { const t = m[1]; map[t] = (map[t] || 0) + 1; });
console.log('Total MCQs:', ids.length);
Object.entries(map).forEach(([k, v]) => console.log(k + ':', v));
