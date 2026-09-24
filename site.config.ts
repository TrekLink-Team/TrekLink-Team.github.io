/**
 * Every environment-dependent value on the site (REQ-UBI-05, D-015).
 *
 * No component may hold any of these as a literal. The operations system is not
 * deployed yet, so its URL and health endpoint are placeholders; open question
 * Q1 in specs/landing/requirements.md tracks that. The placeholders are safe:
 * the health check treats an unreachable endpoint as unavailable and the page
 * shows the toast, which is the behaviour REQ-EVT-04 asks for anyway. The
 * deploy workflow warns on every publish while a `.invalid` host remains.
 *
 * When the real endpoint lands, it must answer a cross-origin GET from this
 * site's origin with `Access-Control-Allow-Origin`. Without that header the
 * browser hides the response, the check reads it as a failure, and the toast
 * shows forever while the system is actually up.
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
