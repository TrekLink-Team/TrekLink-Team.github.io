import { describe, expect, it } from 'vitest';
import en from './en.json';
import vi from './vi.json';
import { coverage, localePath, t, type TranslationKey } from './index';

describe('t', () => {
  it('returns the Vietnamese string when it exists', () => {
    expect(t('vi', 'system.link')).toBe(vi['system.link']);
    expect(t('vi', 'system.link')).not.toBe(en['system.link']);
  });

  // REQ-STA-04. The fallback is the whole reason Vietnamese may ship partial.
  it('falls back to English for a key Vietnamese does not carry', () => {
    const missing = 'research.a.body' as TranslationKey;
    expect(vi).not.toHaveProperty(missing);
    expect(t('vi', missing)).toBe(en[missing]);
  });

  it('never returns a raw key or undefined for an unknown key', () => {
    const bogus = 'hero.headlin' as TranslationKey;
    const out = t('vi', bogus);
    expect(out).not.toBe(bogus);
    expect(out).not.toBeUndefined();
    expect(out).toBe('');
  });

  it('renders every English key as a non-empty string', () => {
    const empty = (Object.keys(en) as TranslationKey[]).filter(
      (k) => t('en', k).length === 0,
    );
    expect(empty).toEqual([]);
  });

  it('renders every English key in Vietnamese too, by value or by fallback', () => {
    const empty = (Object.keys(en) as TranslationKey[]).filter(
      (k) => t('vi', k).length === 0,
    );
    expect(empty).toEqual([]);
  });
});

describe('catalogue hygiene', () => {
  it('has no Vietnamese key that English does not define', () => {
    const extra = Object.keys(vi).filter(
      (k) => !k.startsWith('_') && !(k in en),
    );
    expect(extra).toEqual([]);
  });

  it('reports partial Vietnamese coverage rather than pretending', () => {
    const { translated, total } = coverage('vi');
    expect(total).toBeGreaterThan(0);
    expect(translated).toBeGreaterThan(0);
    expect(translated).toBeLessThanOrEqual(total);
  });
});

describe('localePath', () => {
  it('maps the default locale to the root and others to a prefix', () => {
    expect(localePath('en')).toBe('/');
    expect(localePath('vi')).toBe('/vi/');
  });
});
