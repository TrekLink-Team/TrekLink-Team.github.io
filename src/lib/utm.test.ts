import { describe, expect, it } from 'vitest';
import { withUtm } from './utm';

describe('withUtm', () => {
  it('adds the four parameters and keeps existing ones', () => {
    const out = new URL(
      withUtm('https://example.org/a?x=1', { campaign: 'home', content: 'footer-repo' }),
    );
    expect(out.searchParams.get('x')).toBe('1');
    expect(out.searchParams.get('utm_source')).toBe('treklink-landing');
    expect(out.searchParams.get('utm_medium')).toBe('website');
    expect(out.searchParams.get('utm_campaign')).toBe('home');
    expect(out.searchParams.get('utm_content')).toBe('footer-repo');
  });
});
