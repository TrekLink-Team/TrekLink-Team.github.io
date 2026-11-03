# TrekLink Landing: style system

The public marketing site of TrekLink (LoRa-mesh safety devices for trekking groups). This design
system is styles only: there are no React components on `window.TrekLinkLanding`. Build with plain
HTML/JSX elements and the classes and tokens below. The product console is a different system
("TrekLink Web UI"); never mix the two.

## Setup

- Load `styles.css`; it brings the fonts (Oswald for display, Manrope for body), the tokens and the
  shared classes.
- The default theme is dark military olive. `data-theme="light"` on `<html>` switches to the
  parchment theme; every token below switches with it.
- Headings `h1`, `h2`, `h3` are already Oswald, uppercase and tight; do not restyle them per section.

## Shared classes (from the site's global stylesheet)

| Class | Use |
|---|---|
| `shell` | centred content column, `--shell` wide with `--gutter` padding |
| `section` | vertical section rhythm (`--section-y`) |
| `section-head` | heading block of a section; pair with `eyebrow` above the `h2` |
| `eyebrow` | small uppercase kicker line |
| `lede` | intro paragraph under a heading, capped at `--measure` |
| `btn btn-primary` | brass call to action with a pressable shadow; put `<span class="arrow">→</span>` last |
| `btn btn-ghost` | secondary moss-outlined action |
| `chip` | proof chip; wrap the figure in `<b>` |
| `glass` | frosted panel over textured backgrounds |
| `plate` | solid raised panel (`--surface-raised`, `--shadow-neo`) |
| `grain`, `contours` | background textures on a `position: relative` section |
| `glow glow-brass`, `glow glow-moss` | soft colour blooms behind content; content above them gets `above` |
| `sr-only` | visually hidden text |

## Tokens (CSS custom properties, use with `var(--name)`)

- Surfaces: `--surface-base` (page), `--surface-sunken`, `--surface-2` (alternate band), `--surface-raised`, `--surface-ridge` (hairlines).
- Text: `--ink`, `--ink-muted`, `--ink-faint`, `--ink-inverse`.
- Accents: `--brass`, `--brass-lit`, `--brass-tint`, `--brass-glow`; `--moss`, `--moss-lit`, `--moss-tint`, `--moss-line`; `--warn`.
- Type scale: `--step--1`, `--step-0`, `--step-1`, `--step-2`, `--step-3`, `--step-4`; fonts `--font-display`, `--font-body`.
- Layout: `--shell`, `--gutter`, `--section-y`, `--measure`, `--header-h`, `--radius-sm`, `--radius`, `--radius-lg`.
- Depth and motion: `--shadow-glass`, `--shadow-neo`, `--shadow-press`; `--ease`, `--ease-out`, `--dur`.

Never write colour literals; every colour comes from a token. Tailwind 4 utilities the site uses are
also compiled in, but layout is mostly written per section.

## Where the truth lives

`styles.css` imports `_ds_bundle.css` (the site's compiled stylesheet) and `fonts/fonts.css`. Read
`_ds_bundle.css` for the exact class and token definitions before styling.

## Example

```jsx
<section className="section grain" style={{ position: 'relative' }}>
  <div className="glow glow-brass" aria-hidden="true" />
  <div className="shell above">
    <div className="section-head">
      <p className="eyebrow">LoRa mesh safety for no-signal routes</p>
      <h2>Keep your whole group in reach</h2>
    </div>
    <p className="lede">Handsets relay positions to each other, so the group stays connected past the last bar of signal.</p>
    <a className="btn btn-primary" href="#nodes">Find the node for your route <span className="arrow" aria-hidden="true">→</span></a>
    <ul style={{ display: 'flex', gap: '0.75rem', listStyle: 'none', padding: 0 }}>
      <li className="chip"><b>0</b> cell towers between handsets</li>
    </ul>
  </div>
</section>
```
