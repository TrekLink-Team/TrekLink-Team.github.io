/**
 * Every image slot on the page, in one place (REQ-OPT-02, AC-08).
 *
 * A slot points at a file under `public/images/` and says what that file is.
 * The distinction is not cosmetic: a render must never be presented as a
 * photograph, so the kind travels with the slot and the page discloses it.
 *
 * - `photo`: an unaltered or conventionally retouched photograph.
 * - `render`: an image generated or regenerated from photographs of the
 *   prototypes. The node images below are AI-regenerated product renders
 *   (their working originals carry OpenAI C2PA manifests), so the nodes
 *   section says so beside them.
 * - `placeholder`: a typographic stand-in at the ratio the layout reserves.
 *
 * Filling a slot is one line here, and the layout does not move, because the
 * intrinsic size is declared up front.
 */

export type MediaKind = 'photo' | 'render' | 'placeholder';

export interface MediaSlot {
  /** Path under public/. */
  src: string;
  /** Intrinsic size, so the browser reserves the box before the file loads. */
  width: number;
  height: number;
  kind: MediaKind;
}

const slot =
  (kind: MediaKind) =>
  (src: string, width: number, height: number): MediaSlot => ({ src, width, height, kind });

const render = slot('render');

/** The node iterations, keyed by the id the nodes section iterates over. */
export const NODE_IDS = ['v1', 'v2', 'v3', 'v4'] as const;
export type NodeId = (typeof NODE_IDS)[number];

export const nodeMedia: Record<NodeId, MediaSlot> = {
  /** v1, the perfboard prototype. */
  v1: render('/images/products/node-v1.webp', 993, 1055),
  /** v2, custom PCB in its enclosure. */
  v2: render('/images/products/node-v2-angle.webp', 1100, 772),
  /** v3, LilyGO T-Beam in the ribbed case. */
  v3: render('/images/products/node-v3.webp', 1100, 802),
  /** v4, T-Beam Supreme in the ribbed case. */
  v4: render('/images/products/node-v4.webp', 1100, 802),
};

export const media = {
  /** The v2, v3 and v4 nodes standing side by side, the hero group shot. */
  lineup: render('/images/products/node-lineup.webp', 1116, 932),

  /** The v2 board, assembled. */
  'pcb-v2': render('/images/products/pcb-v2-angle.webp', 820, 719),
} as const satisfies Record<string, MediaSlot>;

export type MediaKey = keyof typeof media;

/**
 * Third-party marks, kept apart from the product imagery because different
 * rules govern them: each is used under its owner's terms, unaltered.
 */
export const brandMedia = {
  /**
   * Meshtastic's "M-Powered" community logo. Used under the Meshtastic
   * trademark guidelines: unaltered, hyperlinked to meshtastic.org, with the
   * registered-trademark attribution and non-affiliation notice beside it.
   */
  meshtasticPowered: {
    src: '/images/brand/meshtastic-powered.webp',
    width: 720,
    height: 480,
  },
} as const;
