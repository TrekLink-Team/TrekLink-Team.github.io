/**
 * Every environment-dependent value on the site (REQ-UBI-05, D-015).
 *
 * No component may hold any of these as a literal.
 *
 * Where the operations system runs is not decided here (D-088). When a
 * visitor presses "Open the system", the page reads `systemEndpointsUrl`, a
 * JSON file in the treklink-web repository, probes each candidate's health
 * route in order and opens the first that answers. Moving the system, from the
 * demo laptop to a hosted environment, edits that file and never this site, so
 * the GitHub Pages build (treklink-team.github.io) and the Vercel build behave
 * the same without a rebuild. The file's shape is in treklink-web
 * deploy/README.md.
 *
 * The fallback below is used when the file cannot be read or is malformed, and
 * is the anchor's href, so a visitor without JavaScript still has a link. It
 * is the demo laptop, the only place the system runs during the course
 * (D-055 staging is not up). Its timeout is long because Chrome holds a
 * request from a public page to localhost on a local network access prompt
 * until the visitor answers it (seen in Chrome 156 on 2026-11-01).
 */
export const siteConfig = {
  /** Canonical origin. Used for absolute URLs and the sitemap. */
  site: 'https://treklink-team.github.io',

  /** The runtime list of where the operations system runs (D-088). */
  systemEndpointsUrl:
    'https://raw.githubusercontent.com/TrekLink-Team/treklink-web/main/deploy/system-endpoints.json',

  /** Abort threshold for reading that list. */
  systemEndpointsTimeoutMs: 3000,

  /** Fallback candidate: where the link goes, and the no-JavaScript href. */
  operationsUrl: 'http://localhost:5173/',

  /** Fallback candidate: what the availability check requests. */
  healthEndpoint: 'http://localhost:3000/api/health',

  /** Fallback candidate: abort threshold for its check. */
  healthTimeoutMs: 10000,

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
