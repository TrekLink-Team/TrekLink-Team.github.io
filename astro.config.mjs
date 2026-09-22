// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// `site` is the canonical origin (REQ-UBI-05, design 3.3). `base` is deliberately
// unset: a GitHub Pages user site serves from the root, so a base path would
// break every absolute URL on the page.
export default defineConfig({
  site: 'https://treklink-team.github.io',
  trailingSlash: 'always',
  build: { format: 'directory' },
  vite: {
    plugins: [tailwindcss()],
    // Dev-server only: lets the v0 preview proxy reach this server. Vite's
    // host check has no effect on `astro build`, so the published static
    // site is unaffected. Remove before merging if the leader prefers.
    server: { allowedHosts: true },
  },
});
