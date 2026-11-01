/**
 * Every environment-dependent value on the site (REQ-UBI-05, D-015).
 *
 * No component may hold any of these as a literal. The values live here, in
 * source, so that the two public builds of this repository, GitHub Pages
 * (treklink-team.github.io, built by deploy.yml) and the Vercel preview
 * (treklink-team-github-io.vercel.app), link to the same place. A per-host
 * environment variable would let the two drift apart.
 *
 * The operations system is not deployed (D-055 staging is not up, and D-031
 * keeps the OpenStreetMap build off public hosting), so during the course it
 * runs on the team's demo laptop and the link points at that laptop's loopback
 * address: the frontend from `npm run dev` on port 5173 and the backend health
 * route on port 3000. On any other machine nothing answers there, the check
 * fails, and the page shows the toast, which is the behaviour REQ-EVT-04 asks
 * for. Open question Q1 in specs/landing/requirements.md records this.
 *
 * Two settings on the demo laptop make the check pass, for both origins:
 * the backend's CORS_ORIGINS lists https://treklink-team.github.io and
 * https://treklink-team-github-io.vercel.app next to the frontend origin,
 * and Chrome's "Local network access" site permission is set to Allow for
 * both. Without the permission, Chrome holds the request on a prompt and the
 * timeout below fires first (verified in Chrome 156 on 2026-11-01).
 */
export const siteConfig = {
  /** Canonical origin. Used for absolute URLs and the sitemap. */
  site: 'https://treklink-team.github.io',

  /** Where the header link sends a visitor once the health check passes. */
  operationsUrl: 'http://localhost:5173/',

  /** What the availability check requests. Must return a success status. */
  healthEndpoint: 'http://localhost:3000/api/health',

  /** Abort threshold for that check. Long enough for a cold backend. */
  healthTimeoutMs: 3000,

  /**
   * Where privacy and legal requests go. Named in the Privacy Policy and the
   * Terms. A private channel on purpose: a request filed as a public GitHub
   * issue would publish the requester's own personal data.
   */
  contactEmail: 'treklink.team@gmail.com',

  /**
   * Cloudflare Web Analytics site token. Cookieless, so no consent banner is
   * required (REQ-UBI-08). Empty means the beacon is not rendered at all,
   * which is the correct state until the leader supplies the token.
   */
  analyticsToken: 'f0000e54d43d415eb25c617b46a36b01',
} as const;

export type SiteConfig = typeof siteConfig;
