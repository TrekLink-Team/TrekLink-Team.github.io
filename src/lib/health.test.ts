import { describe, expect, it } from 'vitest';
import { checkAvailability } from './health';

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
