/**
 * Section indicator (REQ-EVT-06).
 *
 * Sets an active state on the navigation and does nothing else. It never
 * scrolls the page and never rewrites the URL: both are things a visitor did
 * not ask for, and a scrollspy that hijacks the scroll position is the reason
 * people distrust them.
 */
export function mountScrollspy(): void {
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('[data-spy-link]'),
  );
  if (links.length === 0) return;

  const ids = [...new Set(links.map((l) => l.dataset.spyLink!).filter(Boolean))];
  const sections = ids
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);
  if (sections.length === 0) return;

  const ratios = new Map<string, number>();

  function paint(): void {
    let bestId = '';
    let bestRatio = 0;
    for (const [id, ratio] of ratios) {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestId = id;
      }
    }
    for (const link of links) {
      const on = bestRatio > 0 && link.dataset.spyLink === bestId;
      if (on) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      }
      paint();
    },
    {
      // The sticky header covers the top of the viewport, so a section is
      // only "in view" once it clears it.
      rootMargin: '-25% 0px -55% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    },
  );

  sections.forEach((section) => observer.observe(section));
}
