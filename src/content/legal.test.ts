import { describe, expect, it } from 'vitest';
import { privacy, terms } from './legal';

describe('legal pages', () => {
  for (const [name, doc] of [['privacy', privacy], ['terms', terms]] as const) {
    it(`${name}: both locales carry the same sections`, () => {
      expect(doc.vi.sections.map((s) => s.id)).toEqual(doc.en.sections.map((s) => s.id));
      expect(doc.vi.updated).toBe(doc.en.updated);
    });
    it(`${name}: no em or en dash`, () => {
      expect(JSON.stringify(doc)).not.toMatch(/[–—]/);
    });
  }
});
