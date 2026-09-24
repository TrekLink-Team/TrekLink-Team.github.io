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
  /** The v2, v3 and v4 nodes standing side by side, the hero group shot. */
  'lineup': photo('/images/products/node-lineup.webp', 1116, 932),

  /** v1, the perfboard prototype. */
  'node-v1': photo('/images/products/node-v1.webp', 993, 1055),

  /** v2, custom PCB in its enclosure. */
  'node-v2': photo('/images/products/node-v2-angle.webp', 1100, 772),

  /** v3, LilyGO T-Beam in the ribbed case. */
  'node-v3': photo('/images/products/node-v3.webp', 1100, 802),

  /** v4, T-Beam Supreme in the ribbed case. */
  'node-v4': photo('/images/products/node-v4.webp', 1100, 802),

  /** The v2 board, assembled. */
  'pcb-v2': photo('/images/products/pcb-v2-angle.webp', 820, 719),
} as const satisfies Record<string, MediaSlot>;

export type MediaKey = keyof typeof media;
