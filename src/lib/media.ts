/**
 * Every image slot on the page, in one place (REQ-OPT-02, AC-08).
 *
 * A slot points either at a real photograph under `public/images/products/` or
 * at a typographic placeholder of the identical aspect ratio. Filling a slot is
 * one line here, and the layout does not move, because the placeholder was
 * generated at the ratio the layout reserves.
 *
 * The photographs are produced by `scripts/process-photos.sh` from the raw
 * shots in `source-photos/`. Re-run it after dropping a new raw file in.
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
  /** The hero plate, 16:9. All six units, three of each enclosure form. */
  hero: photo('/images/products/node-hero.webp', 1600, 900),

  /** The node cards, 4:3. */
  'node-v2': photo('/images/products/node-v2.webp', 1200, 900),

  /*
   * v3 is still a stand-in. The only raw shot that contains it is
   * `v3-vs-v4.jpg`, which holds two units of the same ribbed enclosure form
   * and nothing in it identifies which is which. Rather than crop one at
   * random and label it, the slot stays a placeholder until the leader says
   * which side is v3. Labelling the wrong board in front of a review panel is
   * a worse outcome than an obvious placeholder.
   */
  'node-v3': pending('/images/placeholders/node-v3.svg', 800, 600),

  'node-v4': photo('/images/products/node-v4.webp', 1200, 900),
} as const satisfies Record<string, MediaSlot>;

export type MediaKey = keyof typeof media;
