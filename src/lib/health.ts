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

/** One place the operations system may run (treklink-web deploy/README.md). */
export interface SystemCandidate {
  /** Where the visitor is sent. */
  url: string;
  /** What the availability check requests. */
  health: string;
  /** Abort threshold for that check. */
  timeoutMs: number;
}

/** The longest any one candidate may hold the visitor on "Checking". */
export const MAX_CANDIDATE_TIMEOUT_MS = 30_000;

const isHttpUrl = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;
  try {
    const { protocol } = new URL(value);
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
};

/**
 * Read the endpoints file. Returns `null` for anything that is not version 1
 * with at least one well-formed candidate, so a broken file can never send a
 * visitor somewhere odd; a malformed entry is skipped, not trusted.
 */
export function parseEndpoints(data: unknown): SystemCandidate[] | null {
  if (typeof data !== 'object' || data === null) return null;
  const { version, candidates } = data as { version?: unknown; candidates?: unknown };
  if (version !== 1 || !Array.isArray(candidates)) return null;

  const valid = candidates.flatMap((entry: unknown): SystemCandidate[] => {
    if (typeof entry !== 'object' || entry === null) return [];
    const { url, health, timeoutMs } = entry as Record<string, unknown>;
    if (!isHttpUrl(url) || !isHttpUrl(health)) return [];
    if (typeof timeoutMs !== 'number' || !(timeoutMs > 0)) return [];
    return [{ url, health, timeoutMs: Math.min(timeoutMs, MAX_CANDIDATE_TIMEOUT_MS) }];
  });
  return valid.length > 0 ? valid : null;
}

export interface LoadOptions {
  endpointsUrl: string;
  timeoutMs: number;
  fallback: SystemCandidate;
  fetchImpl?: typeof fetch;
}

/**
 * The candidates to probe: the endpoints file when it can be read and parsed
 * in time, otherwise the built-in fallback alone.
 */
export async function loadCandidates(options: LoadOptions): Promise<SystemCandidate[]> {
  const doFetch = options.fetchImpl ?? globalThis.fetch;
  if (typeof doFetch !== 'function') return [options.fallback];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs);
  try {
    const response = await doFetch(options.endpointsUrl, {
      method: 'GET',
      signal: controller.signal,
      credentials: 'omit',
      cache: 'no-store',
      redirect: 'follow',
    });
    if (!response.ok) return [options.fallback];
    return parseEndpoints(await response.json()) ?? [options.fallback];
  } catch {
    return [options.fallback];
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Probe the candidates in order and return the first one's URL that answers,
 * or `null` when none does (REQ-EVT-03, REQ-EVT-04).
 */
export async function resolveSystem(
  candidates: readonly SystemCandidate[],
  fetchImpl?: typeof fetch,
): Promise<string | null> {
  for (const candidate of candidates) {
    const up = await checkAvailability({
      endpoint: candidate.health,
      timeoutMs: candidate.timeoutMs,
      fetchImpl,
    });
    if (up) return candidate.url;
  }
  return null;
}
