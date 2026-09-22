import en from './en.json';
import vi from './vi.json';

export const LOCALES = ['en', 'vi'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** English is the reference catalogue. Every key that exists, exists here. */
export type TranslationKey = keyof typeof en;

/**
 * Indexed by string rather than by TranslationKey so that a catalogue may
 * carry a leading `_comment` entry. Call sites stay checked, because `t` only
 * accepts a key that exists in the English reference.
 */
const catalogues: Record<Locale, Record<string, string | undefined>> = {
  en,
  vi,
};

/**
 * Resolve a key for a locale (REQ-UBI-04).
 *
 * Falls back to the English string when the Vietnamese entry is missing
 * (REQ-STA-04). Vietnamese ships with partial coverage on purpose: a visible
 * English fallback is the honest state, where a half-translated page pretending
 * to be finished is not.
 *
 * It never returns a raw key and never returns undefined. A key absent from
 * English too is a programming error rather than a translation gap, so it
 * returns an empty string and warns in development, which keeps a typo from
 * printing `hero.headlin` into the page in front of a review panel.
 */
export function t(locale: Locale, key: TranslationKey): string {
  const localised = catalogues[locale]?.[key];
  if (typeof localised === 'string' && localised.length > 0) return localised;

  const fallback = catalogues[DEFAULT_LOCALE][key];
  if (typeof fallback === 'string' && fallback.length > 0) return fallback;

  if (import.meta.env?.DEV) {
    console.warn(`[i18n] key missing from the English catalogue: ${String(key)}`);
  }
  return '';
}

/** Bind `t` to one locale, so a component asks for a key and nothing else. */
export function useTranslations(locale: Locale) {
  return (key: TranslationKey) => t(locale, key);
}

/** The path of the same page in another locale (REQ-EVT-05). */
export function localePath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/' : `/${locale}/`;
}

/** How many English keys the given locale actually covers. Used by the tests. */
export function coverage(locale: Locale): { translated: number; total: number } {
  const keys = Object.keys(en) as TranslationKey[];
  const translated = keys.filter((k) => {
    const v = catalogues[locale]?.[k];
    return typeof v === 'string' && v.length > 0;
  }).length;
  return { translated, total: keys.length };
}
