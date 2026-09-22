/**
 * Every environment-dependent value on the site (REQ-UBI-05, D-015).
 *
 * No component may hold any of these as a literal. The operations system is not
 * deployed yet, so its URL and health endpoint are placeholders; open question
 * Q1 in specs/landing/requirements.md tracks that. The placeholders are safe:
 * the health check treats an unreachable endpoint as unavailable and the page
 * shows the toast, which is the behaviour REQ-EVT-04 asks for anyway.
 */
export const siteConfig = {
  /** Canonical origin. Used for absolute URLs and the sitemap. */
  site: 'https://treklink-team.github.io',

  /** Where the header link sends a visitor once the health check passes. */
  operationsUrl: 'https://operations.treklink.invalid/',

  /** What the availability check requests. Must return a success status. */
  healthEndpoint: 'https://operations.treklink.invalid/health',

  /** Abort threshold for that check. Long enough for a cold backend. */
  healthTimeoutMs: 3000,

  /**
   * Cloudflare Web Analytics site token. Cookieless, so no consent banner is
   * required (REQ-UBI-08). Empty means the beacon is not rendered at all,
   * which is the correct state until the leader supplies the token.
   */
  analyticsToken: 'f0000e54d43d415eb25c617b46a36b01',
} as const;

export type SiteConfig = typeof siteConfig;
