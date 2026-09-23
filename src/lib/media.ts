/**
 * Every image slot on the page, in one place (REQ-OPT-02, AC-08).
 *
 * A slot points either at a real photograph under `public/images/products/` or
 * at a typographic placeholder of the identical aspect ratio. Filling a slot is
 * one line here, and the layout does not move, because the placeholder was
 * generated at the ratio the layout reserves.
 *
 * Photographs arrive already processed from the leader. Drop the file into
 * `public/images/products/` and change the slot below from `pending` to
 * `photo` with the file's real intrinsic size. Nothing else moves.
 */

export interface MediaSlot {
  /** Path under public/. */
  src: string;
  /** Intrinsic size, so the browser reserves the box before the file loads. */
  width: number;
  height: number;
  /** True while this is still a stand-in rather than a photograph. */
  placeholder: boolean;
}

const photo = (src: string, width: number, height: number): MediaSlot => ({
  src,
  width,
  height,
  placeholder: false,
});

const pending = (src: string, width: number, height: number): MediaSlot => ({
  src,
  width,
  height,
  placeholder: true,
});

export const media = {
  /** The hero plate, 16:9. */
  hero: photo('/images/products/node-hero.webp', 1600, 900),

  /** The node cards, 4:3. */
  'node-v2': photo('/images/products/node-v2.webp', 1000, 750),
  'node-v3': photo('/images/products/node-v3.webp', 1000, 750),
  'node-v4': photo('/images/products/node-v4.webp', 1000, 750),
} as const satisfies Record<string, MediaSlot>;

export type MediaKey = keyof typeof media;
