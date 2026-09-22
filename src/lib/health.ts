/**
 * The operations system availability check (REQ-EVT-02 through REQ-EVT-04,
 * REQ-ERR-01, REQ-ERR-02).
 *
 * Kept free of the DOM so it can be tested directly. The island in
 * src/islands/system-link.ts owns the wiring; this owns the decision.
 */

export type Availability = 'idle' | 'checking' | 'up' | 'down';

export interface CheckOptions {
  /** URL to request. */
  endpoint: string;
  /** Abort threshold in milliseconds. */
  timeoutMs: number;
  /** Injected for tests. Defaults to the global. */
  fetchImpl?: typeof fetch;
}

/**
 * Resolve whether the operations system is reachable.
 *
 * Returns `false` rather than throwing, on every failure mode: a non-success
 * status, a rejected request, a DNS failure, a CORS rejection, or the timeout.
 * The caller therefore has no error path that could leak a status code, an
 * endpoint or a stack trace into the page (REQ-ERR-01).
 *
 * The request is deliberately made only on activation, never on page load.
 * Checking on load would make every visitor pay for a request most of them
 * never need, and would put a backend outage on the critical path of a page
 * whose entire purpose is to not depend on the backend.
 */
export async function checkAvailability(options: CheckOptions): Promise<boolean> {
  const { endpoint, timeoutMs } = options;
  const doFetch = options.fetchImpl ?? globalThis.fetch;

  if (typeof doFetch !== 'function') return false;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await doFetch(endpoint, {
      method: 'GET',
      signal: controller.signal,
      // The health endpoint lives on another origin and the answer is only
      // ever "did this resolve". Credentials would turn a public probe into
      // an authenticated one for no gain.
      credentials: 'omit',
      cache: 'no-store',
      redirect: 'follow',
    });
    return response.ok;
  } catch {
    // Abort, network rejection and CORS rejection are all one outcome here.
    return false;
  } finally {
    clearTimeout(timer);
  }
}
