import { describe, expect, it } from 'vitest';
import { privacy, terms } from './legal';
import { siteConfig } from '../../site.config';

describe('legal pages', () => {
  for (const [name, doc] of [['privacy', privacy], ['terms', terms]] as const) {
    it(`${name}: both locales carry the same sections`, () => {
      expect(doc.vi.sections.map((s) => s.id)).toEqual(doc.en.sections.map((s) => s.id));
      expect(doc.vi.updated).toBe(doc.en.updated);
    });

    it(`${name}: each section has the same shape in both locales`, () => {
      doc.en.sections.forEach((en, i) => {
        const vi = doc.vi.sections[i]!;
        expect([vi.id, vi.body.length], en.id).toEqual([en.id, en.body.length]);
        expect([vi.id, vi.list?.length ?? 0], en.id).toEqual([en.id, en.list?.length ?? 0]);
        expect(vi.links?.map((l) => l.href) ?? [], en.id).toEqual(en.links?.map((l) => l.href) ?? []);
      });
    });

    it(`${name}: no Vietnamese paragraph is left in English`, () => {
      doc.en.sections.forEach((en, i) => {
        const vi = doc.vi.sections[i]!;
        en.body.forEach((p, j) => expect(vi.body[j], en.id).not.toBe(p));
      });
    });

    it(`${name}: addresses live in links, never inside prose`, () => {
      for (const locale of [doc.en, doc.vi]) {
        const prose = [locale.intro, ...locale.sections.flatMap((s) => [...s.body, ...(s.list ?? [])])];
        prose.forEach((p) => expect(p).not.toMatch(/https?:\/\/|mailto:|@[a-z0-9-]+\./i));
      }
    });

    it(`${name}: offers the private contact address`, () => {
      const hrefs = doc.en.sections.flatMap((s) => s.links ?? []).map((l) => l.href);
      expect(hrefs).toContain(`mailto:${siteConfig.contactEmail}`);
    });

    it(`${name}: says which language prevails`, () => {
      expect(doc.en.sections.map((s) => s.id)).toContain('language');
    });

    it(`${name}: no em or en dash`, () => {
      expect(JSON.stringify(doc)).not.toMatch(/[–—]/);
    });
  }
});
