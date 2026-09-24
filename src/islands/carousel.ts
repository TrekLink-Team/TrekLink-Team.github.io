/**
 * The node carousel (REQ-EVT-07, REQ-STA-02).
 *
 * The track is a scroll-snapped flex list that already works by touch,
 * trackpad and keyboard before this runs. This adds previous and next, a
 * numbered pager, arrow keys and a live-region announcement.
 *
 * The active card is derived from the scroll position, never tracked
 * separately, so a swipe, a button press and a keypress can never disagree.
 * The previous version kept its own index and measured offsets against the
 * section rather than the track, which is what broke it on phones.
 *
 * There is no auto-advance in any motion mode.
 */
export function mountCarousel(): void {
  const root = document.querySelector<HTMLElement>('[data-carousel]');
  if (!root) return;

  const track = root.querySelector<HTMLElement>('[data-carousel-track]');
  const controls = Array.from(root.querySelectorAll<HTMLElement>('[data-carousel-controls]'));
  const prev = root.querySelector<HTMLButtonElement>('[data-carousel-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-carousel-next]');
  const status = root.querySelector<HTMLElement>('[data-carousel-status]');
  const pips = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-carousel-goto]'),
  );
  const items = Array.from(
    root.querySelectorAll<HTMLElement>('[data-carousel-item]'),
  );
  if (!track || !controls.length || !prev || !next || items.length < 2) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = -1;
  let frame = 0;
  let snapReleaseTimer = 0;

  /** True when the cards overflow the track, so paging does something. */
  const isPaged = () => track.scrollWidth - track.clientWidth > 4;

  /** Where the track sits when this card is snapped to the centre. */
  const snapOf = (item: HTMLElement) =>
    item.offsetLeft + item.offsetWidth / 2 - track.clientWidth / 2;

  /** The card whose snap point is nearest the current scroll position. */
  function nearest(): number {
    const left = track!.scrollLeft;
    // At the far end the last card may be unable to reach its own snap point.
    if (left >= track!.scrollWidth - track!.clientWidth - 2) return items.length - 1;
    let best = 0;
    let bestDistance = Infinity;
    items.forEach((item, i) => {
      const distance = Math.abs(snapOf(item) - left);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });
    return best;
  }

  function paint(i: number, announceIt: boolean): void {
    const max = track!.scrollWidth - track!.clientWidth;
    prev!.disabled = track!.scrollLeft <= 2;
    next!.disabled = track!.scrollLeft >= max - 2;
    if (i === index) return;
    index = i;
    items.forEach((item, n) => item.toggleAttribute('data-active', n === i));
    pips.forEach((pip, n) =>
      pip.setAttribute('aria-current', n === i ? 'true' : 'false'),
    );
    if (announceIt && status) {
      // The label carries the position, so consecutive announcements always
      // differ and every screen reader re-reads them.
      status.textContent = items[i]?.getAttribute('aria-label') ?? '';
    }
  }

  /**
   * scroll-snap-type: mandatory can truncate a JS scrollTo({behavior:
   * 'smooth'}) partway, the snap machinery intervenes mid-animation and the
   * track settles short of the requested offset. Suspending snap for the
   * duration of a programmatic scroll and restoring it once the track
   * settles avoids that fight while leaving snap-on-release intact for a
   * real touch swipe.
   */
  function scrollTrackTo(left: number): void {
    track!.style.scrollSnapType = 'none';
    clearTimeout(snapReleaseTimer);
    const release = () => {
      clearTimeout(snapReleaseTimer);
      track!.removeEventListener('scrollend', release);
      track!.style.scrollSnapType = '';
    };
    track!.addEventListener('scrollend', release, { once: true });
    snapReleaseTimer = window.setTimeout(release, 500);
    track!.scrollTo({ left, behavior: reduced.matches ? 'auto' : 'smooth' });
  }

  function goTo(i: number): void {
    const target = items[Math.max(0, Math.min(items.length - 1, i))];
    if (!target) return;
    scrollTrackTo(snapOf(target));
  }

  /**
   * Step one card in a direction, measured from where the track actually is.
   * Near the far end several cards can share the maximum scroll position, so
   * stepping by index alone could land on a position the track is already at.
   */
  function step(dir: 1 | -1): void {
    const left = track!.scrollLeft;
    const max = track!.scrollWidth - track!.clientWidth;
    const snaps = items.map((item) => Math.min(max, Math.max(0, snapOf(item))));
    const target =
      dir > 0
        ? snaps.findIndex((x) => x > left + 2)
        : snaps.map((x, i) => (x < left - 2 ? i : -1)).filter((i) => i >= 0).pop() ?? -1;
    if (target >= 0) goTo(target);
  }

  /**
   * A card with zero overlap with the track's visible span is hidden
   * entirely, not just clipped by overflow. A card that is still laid out
   * and painted just past the edge still contributes its own glass fill to
   * what the visible card's backdrop-filter samples underneath it, which
   * washed the blur out on every card but the one truly alone in view.
   */
  function syncOffscreen(): void {
    if (!isPaged()) {
      items.forEach((item) => item.removeAttribute('data-offscreen'));
      return;
    }
    const left = track!.scrollLeft;
    const right = left + track!.clientWidth;
    items.forEach((item) => {
      const hidden = item.offsetLeft + item.offsetWidth <= left || item.offsetLeft >= right;
      item.toggleAttribute('data-offscreen', hidden);
    });
  }

  function onScroll(): void {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      paint(nearest(), true);
      syncOffscreen();
    });
  }

  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  pips.forEach((pip, i) => pip.addEventListener('click', () => goTo(i)));
  track.addEventListener('scroll', onScroll, { passive: true });

  track.addEventListener('keydown', (event) => {
    if (!isPaged()) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      step(event.key === 'ArrowRight' ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      goTo(event.key === 'Home' ? 0 : items.length - 1);
    }
  });

  function sync(): void {
    const paged = isPaged();
    controls.forEach((c) => (c.hidden = !paged));
    root!.toggleAttribute('data-paged', paged);
    index = -1;
    paint(paged ? nearest() : 0, false);
    syncOffscreen();
  }

  sync();
  let resizeFrame = 0;
  window.addEventListener(
    'resize',
    () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(sync);
    },
    { passive: true },
  );
}
