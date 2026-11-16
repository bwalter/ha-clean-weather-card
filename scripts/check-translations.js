#!/usr/bin/env node
// Checks that every language in dist/clean-weather-card.js has all keys of the English reference.
// Usage: node scripts/check-translations.js
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "dist", "clean-weather-card.js"), "utf8");
const start = src.indexOf("const I18N = {");
const end = src.indexOf("\n};", start);
if (start < 0 || end < 0) { console.error("I18N block not found"); process.exit(2); }
const I18N = new Function(`${src.slice(start, end + 3)}; return I18N;`)();
const flat = (o, p = "") => Object.entries(o).flatMap(([k, v]) =>
  v && typeof v === "object" && !Array.isArray(v) ? flat(v, `${p}${k}.`) : [[`${p}${k}`, v]]);
const ref = new Map(flat(I18N.en));
let bad = 0;
for (const [lang, tr] of Object.entries(I18N)) {
  const have = new Map(flat(tr));
  const missing = [...ref.keys()].filter((k) => !have.has(k));
  const extra = [...have.keys()].filter((k) => !ref.has(k));
  const empty = [...have].filter(([, v]) => v === "" || (Array.isArray(v) && v.length !== ref.get(`compass`)?.length && false)).map(([k]) => k);
  const comp = tr.compass && tr.compass.length !== 16 ? ["compass (needs 16 entries)"] : [];
  const problems = [...missing.map((k) => `missing ${k}`), ...extra.map((k) => `unknown ${k}`), ...empty.map((k) => `empty ${k}`), ...comp];
  console.log(`${lang}: ${problems.length ? problems.join(", ") : "ok"}`);
  bad += problems.length;
}
process.exit(bad ? 1 : 0);
