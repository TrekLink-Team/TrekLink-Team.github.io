/**
 * The node carousel (REQ-EVT-07, REQ-STA-02).
 *
 * The track is a scroll-snapped list that already works by touch, trackpad and
 * keyboard before this runs. This adds the previous and next controls, the
 * dots, arrow-key handling and the live-region announcement. Nothing here is
 * load-bearing for reading the content, which is why the controls are markup
 * that starts hidden and is revealed only once they do something.
 *
 * There is no auto-advance in any motion mode. REQ-STA-02 requires disabling
 * it under reduced motion, and a carousel that moves on its own is a thing
 * visitors fight even when they have not asked it to stop, so it simply does
 * not exist here.
 */
export function mountCarousel(): void {
  const root = document.querySelector<HTMLElement>('[data-carousel]');
  if (!root) return;

  const track = root.querySelector<HTMLElement>('[data-carousel-track]');
  const controls = root.querySelector<HTMLElement>('[data-carousel-controls]');
  const prev = root.querySelector<HTMLButtonElement>('[data-carousel-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-carousel-next]');
  const dots = root.querySelector<HTMLElement>('[data-carousel-dots]');
  const status = root.querySelector<HTMLElement>('[data-carousel-status]');
  const items = Array.from(
    root.querySelectorAll<HTMLElement>('[data-carousel-item]'),
  );

  if (!track || !controls || !prev || !next || items.length < 2) return;

  let index = 0;

  for (let i = 0; i < items.length; i += 1) {
    dots?.append(document.createElement('i'));
  }
  const dotNodes = dots ? Array.from(dots.querySelectorAll('i')) : [];

  /** True when every card is visible at once, so paging would be a no-op. */
  const isPaged = () => track.scrollWidth - track.clientWidth > 4;

  function render(): void {
    prev!.disabled = index === 0;
    next!.disabled = index === items.length - 1;
    dotNodes.forEach((d, i) => {
      if (i === index) d.setAttribute('data-active', '');
      else d.removeAttribute('data-active');
    });
  }

  function announce(): void {
    if (!status) return;
    const label = items[index]?.getAttribute('aria-label');
    // Rewriting identical text does not re-announce in every screen reader,
    // so the label always carries the position and therefore always differs.
    status.textContent = label ?? '';
  }

  function goTo(nextIndex: number, announceIt = true): void {
    index = Math.max(0, Math.min(items.length - 1, nextIndex));
    const target = items[index];
    if (target) {
      track!.scrollTo({
        left: target.offsetLeft - track!.offsetLeft,
        behavior: 'smooth',
      });
    }
    render();
    if (announceIt) announce();
  }

  prev.addEventListener('click', () => goTo(index - 1));
  next.addEventListener('click', () => goTo(index + 1));

  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      goTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      goTo(items.length - 1);
    }
  });

  // Keep the control state honest when the visitor scrolls or swipes the
  // track directly rather than using the buttons.
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const i = items.indexOf(visible.target as HTMLElement);
      if (i >= 0 && i !== index) {
        index = i;
        render();
      }
    },
    { root: track, threshold: 0.6 },
  );
  items.forEach((item) => observer.observe(item));

  function syncControlVisibility(): void {
    controls!.hidden = !isPaged();
  }

  syncControlVisibility();
  render();
  window.addEventListener('resize', syncControlVisibility, { passive: true });
}
