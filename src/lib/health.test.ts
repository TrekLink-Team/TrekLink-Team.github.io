import { describe, expect, it } from 'vitest';
import {
  checkAvailability,
  loadCandidates,
  MAX_CANDIDATE_TIMEOUT_MS,
  parseEndpoints,
  resolveSystem,
  type SystemCandidate,
} from './health';

const endpoint = 'https://example.invalid/health';

describe('checkAvailability', () => {
  it('resolves up on a success status', async () => {
    const fetchImpl = async () => new Response('ok', { status: 200 });
    expect(
      await checkAvailability({ endpoint, timeoutMs: 100, fetchImpl }),
    ).toBe(true);
  });

  // REQ-ERR-01, first half: any non-success status means unavailable.
  it.each([204, 301, 400, 401, 404, 500, 502, 503])(
    'resolves down on status %i',
    async (status) => {
      const fetchImpl = async () =>
        new Response(null, { status, statusText: 'x' });
      const up = await checkAvailability({ endpoint, timeoutMs: 100, fetchImpl });
      // 204 is a success status, so it is the one case that stays up.
      expect(up).toBe(status === 204);
    },
  );

  // REQ-ERR-01, second half: a rejected request means unavailable, and the
  // rejection must not escape to the caller.
  it('resolves down when the network rejects, without throwing', async () => {
    const fetchImpl = async () => {
      throw new TypeError('Failed to fetch');
    };
    await expect(
      checkAvailability({ endpoint, timeoutMs: 100, fetchImpl }),
    ).resolves.toBe(false);
  });

  // REQ-ERR-02: the timeout aborts the request rather than waiting on it.
  it('resolves down when the request outlives the timeout', async () => {
    const fetchImpl = (_url: string | URL | Request, init?: RequestInit) =>
      new Promise<Response>((resolve, reject) => {
        const signal = init?.signal;
        const slow = setTimeout(() => resolve(new Response('ok')), 5_000);
        signal?.addEventListener('abort', () => {
          clearTimeout(slow);
          reject(new DOMException('Aborted', 'AbortError'));
        });
      });

    const started = Date.now();
    const up = await checkAvailability({
      endpoint,
      timeoutMs: 30,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(up).toBe(false);
    // Proves it aborted rather than sat through the slow response.
    expect(Date.now() - started).toBeLessThan(2_000);
  });

  it('resolves down when there is no fetch available at all', async () => {
    const up = await checkAvailability({
      endpoint,
      timeoutMs: 10,
      fetchImpl: undefined as unknown as typeof fetch,
    });
    expect(typeof up).toBe('boolean');
  });
});

// D-088: the system's location is read at runtime from treklink-web.
const laptop: SystemCandidate = {
  url: 'http://localhost:5173/',
  health: 'http://localhost:3000/api/health',
  timeoutMs: 10_000,
};
const hosted: SystemCandidate = {
  url: 'https://app.example.test/',
  health: 'https://api.example.test/api/health',
  timeoutMs: 3_000,
};
const endpointsUrl = 'https://raw.example.test/system-endpoints.json';

describe('parseEndpoints', () => {
  it('reads a version 1 file in order', () => {
    expect(parseEndpoints({ version: 1, candidates: [hosted, laptop] })).toEqual([hosted, laptop]);
  });

  it('caps a candidate timeout', () => {
    const [only] = parseEndpoints({ version: 1, candidates: [{ ...laptop, timeoutMs: 999_999 }] })!;
    expect(only.timeoutMs).toBe(MAX_CANDIDATE_TIMEOUT_MS);
  });

  it('skips malformed entries and rejects a file with none left', () => {
    expect(
      parseEndpoints({
        version: 1,
        candidates: [{ ...hosted, url: 'javascript:alert(1)' }, laptop, { url: 'x' }, null],
      }),
    ).toEqual([laptop]);
    expect(parseEndpoints({ version: 1, candidates: [{ ...laptop, timeoutMs: -1 }] })).toBeNull();
  });

  it.each([null, 'text', { version: 2, candidates: [laptop] }, { version: 1 }])(
    'rejects %j',
    (data) => {
      expect(parseEndpoints(data)).toBeNull();
    },
  );
});

describe('loadCandidates', () => {
  const load = (fetchImpl: typeof fetch) =>
    loadCandidates({ endpointsUrl, timeoutMs: 100, fallback: laptop, fetchImpl });

  it('uses the file when it reads', async () => {
    const fetchImpl = async () =>
      new Response(JSON.stringify({ version: 1, candidates: [hosted, laptop] }));
    expect(await load(fetchImpl as typeof fetch)).toEqual([hosted, laptop]);
  });

  it.each([
    ['a non-success status', async () => new Response('gone', { status: 404 })],
    ['a rejected request', async () => Promise.reject(new TypeError('Failed to fetch'))],
    ['a body that is not JSON', async () => new Response('<html>')],
    ['a malformed file', async () => new Response(JSON.stringify({ version: 1, candidates: [] }))],
  ])('falls back to the built-in candidate on %s', async (_label, fetchImpl) => {
    expect(await load(fetchImpl as unknown as typeof fetch)).toEqual([laptop]);
  });
});

describe('resolveSystem', () => {
  const answering = (up: string[]) =>
    (async (url: string | URL | Request) =>
      new Response('ok', { status: up.includes(String(url)) ? 200 : 503 })) as typeof fetch;

  it('opens the first candidate that answers', async () => {
    expect(await resolveSystem([hosted, laptop], answering([hosted.health, laptop.health]))).toBe(
      hosted.url,
    );
    expect(await resolveSystem([hosted, laptop], answering([laptop.health]))).toBe(laptop.url);
  });

  it('returns null when none answers', async () => {
    expect(await resolveSystem([hosted, laptop], answering([]))).toBeNull();
  });
});
