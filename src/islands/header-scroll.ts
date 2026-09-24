/**
 * Scroll-direction header.
 *
 * Hides the sticky header while the visitor scrolls down and brings it back
 * the moment they scroll up. Two things keep it from jittering: a small
 * direction threshold, so trackpad noise and momentum wobble never flip it,
 * and a single rAF-batched read per frame. It never hides near the top of
 * the page, while the mobile menu is open, or while focus is inside it, so a
 * keyboard visitor can always see where they are.
 */
export function mountHeaderScroll(): void {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return;

  const THRESHOLD = 10;
  const TOP_ZONE = 120;
  let anchor = window.scrollY;
  let hidden = false;
  let queued = false;

  const set = (next: boolean) => {
    if (next === hidden) return;
    hidden = next;
    header.toggleAttribute('data-hidden', next);
  };

  const pinned = () =>
    header.contains(document.activeElement) ||
    header.querySelector('[aria-expanded="true"]') !== null;

  function update(): void {
    queued = false;
    const y = window.scrollY;
    if (y < TOP_ZONE || pinned()) {
      set(false);
      anchor = y;
      return;
    }
    const delta = y - anchor;
    if (Math.abs(delta) < THRESHOLD) return;
    set(delta > 0);
    anchor = y;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
  header.addEventListener('focusin', () => set(false));
}
