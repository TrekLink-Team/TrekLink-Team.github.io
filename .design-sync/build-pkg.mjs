// Packages the landing site's styles for design-sync (claude.ai/design "TrekLink Landing"): the site is
// Astro with no React components, so the synced design system is styles only. Run `npx astro build`
// first, then from the repo root: node .design-sync/build-pkg.mjs. Output: .ds-pkg/ (gitignored).
import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const OUT = resolve('.ds-pkg');
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'dist/fonts'), { recursive: true });

// Astro splits the build into the global sheet (tokens, base, Tailwind utilities, shared classes:
// it is the one with @font-face) and per-component sheets. Global first, so the cascade matches the site.
const sheets = readdirSync('dist/_astro').filter((f) => f.endsWith('.css'));
const css = sheets.map((f) => readFileSync(join('dist/_astro', f), 'utf8'));
css.sort((a, b) => Number(b.includes('@font-face')) - Number(a.includes('@font-face')));
writeFileSync(join(OUT, 'dist/styles.css'), css.join('\n').replaceAll('url(/fonts/', 'url(./fonts/'));

for (const f of readdirSync('public/fonts').filter((f) => f.endsWith('.woff2'))) {
  copyFileSync(join('public/fonts', f), join(OUT, 'dist/fonts', f));
}
writeFileSync(join(OUT, 'dist/index.js'), 'export {};\n');
writeFileSync(join(OUT, 'package.json'), JSON.stringify({ name: '@treklink/landing', version: '0.1.0', module: 'dist/index.js' }, null, 2));
console.error(`» packaged ${sheets.length} stylesheet(s) -> ${OUT}`);
