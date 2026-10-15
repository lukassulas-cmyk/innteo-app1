// Rychlá kontrola před vydáním: syntaxe JS, manifest, soubory pro offline cache.
import fs from 'node:fs';
import path from 'node:path';

const www = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'www');
let errors = 0;
const fail = msg => { console.error('✗ ' + msg); errors++; };
const ok = msg => console.log('✓ ' + msg);

const html = fs.readFileSync(path.join(www, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
scripts.forEach((src, i) => {
  try { new Function(src); ok(`index.html script #${i + 1} – syntaxe OK`); }
  catch (e) { fail(`index.html script #${i + 1}: ${e.message}`); }
});

const manifest = JSON.parse(fs.readFileSync(path.join(www, 'manifest.json'), 'utf8'));
for (const icon of manifest.icons) {
  if (!fs.existsSync(path.join(www, icon.src))) fail(`manifest: chybí ikona ${icon.src}`);
}
ok('manifest.json – ikony existují');

const sw = fs.readFileSync(path.join(www, 'sw.js'), 'utf8');
const assets = JSON.parse(sw.match(/const ASSETS = (\[[\s\S]*?\]);/)[1].replace(/'/g, '"'));
for (const a of assets) {
  const p = a === './' ? 'index.html' : a.replace('./', '');
  if (!fs.existsSync(path.join(www, p))) fail(`sw.js: chybí soubor ${a}`);
}
ok('sw.js – všechny cachované soubory existují');

const appVer = html.match(/const APP_VERSION="([^"]+)"/)?.[1];
const swVer = sw.match(/VERSION = 'innteo-v([^']+)'/)?.[1];
const pkgVer = JSON.parse(fs.readFileSync(path.join(www, '..', 'package.json'), 'utf8')).version;
if (appVer !== swVer || appVer !== pkgVer) fail(`nesouhlasí verze: app ${appVer}, sw ${swVer}, package ${pkgVer}`);
else ok(`verze ${appVer} souhlasí (app / sw.js / package.json)`);

process.exit(errors ? 1 : 0);
