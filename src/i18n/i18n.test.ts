import { describe, expect, it } from 'vitest';
import en from './en.json';
import vi from './vi.json';
import { coverage, localePath, t, type TranslationKey } from './index';

describe('t', () => {
  it('returns the Vietnamese string when it exists', () => {
    expect(t('vi', 'system.link')).toBe(vi['system.link']);
    expect(t('vi', 'system.link')).not.toBe(en['system.link']);
  });

  // REQ-STA-04. The fallback stays as a safety net for a future key.
  it('falls back to English for a key Vietnamese does not carry', () => {
    const catalogue = vi as Record<string, string>;
    const key = 'hero.sub' as TranslationKey;
    const saved = catalogue[key];
    delete catalogue[key];
    try {
      expect(t('vi', key)).toBe(en[key]);
    } finally {
      catalogue[key] = saved!;
    }
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

  it('translates every English key into Vietnamese', () => {
    const { translated, total } = coverage('vi');
    const missing = Object.keys(en).filter((k) => !(k in vi));
    expect(missing).toEqual([]);
    expect(translated).toBe(total);
  });

  it('never ships a Vietnamese value identical to English prose', () => {
    // Proper nouns, units and board names may legitimately match.
    const allowed = /^(v\d|\d+|433 MHz|GPL-3.0|SOS|English|Tiếng Việt|LilyGO.*|Node v\d)$/;
    const same = Object.keys(en).filter((k) => {
      const e = (en as Record<string, string>)[k]!;
      const v = (vi as Record<string, string>)[k];
      return v === e && !allowed.test(e);
    });
    expect(same).toEqual([]);
  });

  it('uses no em or en dash in any user-facing string', () => {
    const all = [...Object.values(en), ...Object.values(vi)].join('\n');
    expect(all).not.toMatch(/[\u2013\u2014]/);
  });
});

describe('localePath', () => {
  it('maps the default locale to the root and others to a prefix', () => {
    expect(localePath('en')).toBe('/');
    expect(localePath('vi')).toBe('/vi/');
  });
});
