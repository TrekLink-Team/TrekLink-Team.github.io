# design-sync notes (TrekLink-Team.github.io, landing site)

- Syncs to the Claude Design project "TrekLink Landing" (projectId in config.json). Styles only: the
  site is Astro + Tailwind 4 with no React components, so the converter runs as a tokens-only DS.
  The product console is the separate project "TrekLink Web UI" (treklink-web/frontend/.design-sync).
- Build: `npx astro build` then `node .design-sync/build-pkg.mjs` (cfg.buildCmd). It concatenates
  `dist/_astro/*.css` (global sheet first) into `.ds-pkg/dist/styles.css`, rewrites `/fonts/` URLs and
  copies `public/fonts/*.woff2`.
- The converter needs React only to vendor `_vendor/react*.js`; this repo has none, so pass
  `--node-modules` pointing at a treklink-web install (`<treklink-web>/node_modules`).
- Converter deps (esbuild, ts-morph, playwright) were copied into `.ds-sync/` from the web sync.

## Known render warns
- `[FONT_MISSING] "Manrope", "Oswald"`: second entries of `--font-body` / `--font-display`; the first
  entries ("Manrope Variable", "Oswald Variable") ship as @font-face.
- `[DTS_REACT]`: irrelevant, no components.

## Re-sync risks
- Astro hashes and splits CSS per build; the global sheet is detected by containing @font-face. If the
  fonts move out of the global sheet, the cascade order in build-pkg.mjs needs a different rule.
- Section-scoped styles (Astro `data-astro-cid-*`) ship too but only apply to the site's own markup.
- The conventions header quotes site copy from `src/i18n/en.json`; edit it if that copy changes.
