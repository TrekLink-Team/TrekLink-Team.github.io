/**
 * Generate the typographic placeholders (REQ-OPT-02, AC-08, task 3.7).
 *
 * Each stand-in carries the exact aspect ratio the layout reserves, so the
 * page is laid out final before any photograph exists and dropping the real
 * file in is not a code change. Run with `npm run placeholders`.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'images', 'placeholders');

/** Every slot the layout reserves, with the ratio it reserves it at. */
const slots = [
  { name: 'node-hero', w: 1200, h: 675, caption: 'Hero photograph', ratio: '16 : 9' },
  { name: 'node-v2', w: 800, h: 600, caption: 'Node v2', ratio: '4 : 3' },
  { name: 'node-v3', w: 800, h: 600, caption: 'Node v3', ratio: '4 : 3' },
  { name: 'node-v4', w: 800, h: 600, caption: 'Node v4', ratio: '4 : 3' },
];

/** Escapes the five XML entities. Captions are ours, but this is free. */
const esc = (s) =>
  s.replace(/[&<>"']/g, (c) => `&${{ '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot', "'": 'apos' }[c]};`);

function svg({ w, h, caption, ratio, name }) {
  const unit = Math.min(w, h);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(caption)} placeholder">
  <title>${esc(caption)} placeholder</title>
  <desc>A typographic stand-in at ${esc(ratio)}. Replace with public/images/products/${esc(name)} at the same ratio; no code change is required.</desc>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1a2015"/>
      <stop offset="1" stop-color="#0e120b"/>
    </linearGradient>
    <pattern id="grain" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(3)">
      <rect width="9" height="9" fill="none"/>
      <rect width="2" height="9" fill="#000" opacity=".22"/>
      <rect x="4" width="1" height="9" fill="#96784620" />
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#grain)"/>
  <rect x="12" y="12" width="${w - 24}" height="${h - 24}" fill="none" stroke="#8faf74" stroke-opacity=".28" stroke-width="2" stroke-dasharray="14 10" rx="6"/>
  <g fill="none" stroke="#c08a3e" stroke-opacity=".5" stroke-width="2">
    <path d="M${w / 2 - unit * 0.1} ${h / 2 - unit * 0.06} l${unit * 0.1} ${-unit * 0.07} l${unit * 0.1} ${unit * 0.07}"/>
    <circle cx="${w / 2}" cy="${h / 2 - unit * 0.06}" r="${unit * 0.17}"/>
  </g>
  <text x="${w / 2}" y="${h / 2 + unit * 0.17}" text-anchor="middle" font-family="Oswald, Impact, sans-serif" font-size="${unit * 0.1}" font-weight="700" letter-spacing="${unit * 0.012}" fill="#dce3d4" opacity=".92">${esc(caption.toUpperCase())}</text>
  <text x="${w / 2}" y="${h / 2 + unit * 0.27}" text-anchor="middle" font-family="Manrope, system-ui, sans-serif" font-size="${unit * 0.05}" letter-spacing="${unit * 0.01}" fill="#7c8a70">PHOTOGRAPH PENDING &#183; ${esc(ratio)} &#183; ${w}&#215;${h}</text>
</svg>
`;
}

mkdirSync(outDir, { recursive: true });
for (const slot of slots) {
  writeFileSync(join(outDir, `${slot.name}.svg`), svg(slot), 'utf8');
}
console.log(`wrote ${slots.length} placeholders to public/images/placeholders/`);
