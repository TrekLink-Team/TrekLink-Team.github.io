import { reducedMotion } from '../lib/motion';

/**
 * Reveal fallback for browsers without scroll-driven animations.
 *
 * Where `animation-timeline: view()` exists, CSS does everything and this
 * returns at once. Elsewhere it marks <html> so the stylesheet may hide
 * [data-reveal] elements, then shows each one as it enters the viewport.
 * Reduced motion: nothing is marked, nothing is hidden.
 *
 * It also starts and stops the looping decorations ([data-loop]) so they only
 * run while on screen: each gets [data-running] while it intersects, and
 * <html> gets [data-loops] so a stylesheet may pause the rest. Nothing is
 * paused unless this is running, so without JavaScript the loops still play.
 */
export function mountReveal(): void {
  const reduce = reducedMotion();

  const loops = document.querySelectorAll<HTMLElement>('[data-loop]');
  if (loops.length && 'IntersectionObserver' in window && !reduce) {
    const loopIo = new IntersectionObserver((entries) => {
      for (const e of entries) e.target.toggleAttribute('data-running', e.isIntersecting);
    });
    loops.forEach((el) => loopIo.observe(el));
    document.documentElement.setAttribute('data-loops', '');
  }

  if (reduce) return;
  if (CSS.supports('animation-timeline: view()')) return;
  if (!('IntersectionObserver' in window)) return;

  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!items.length) return;
  document.documentElement.setAttribute('data-reveal-js', '');

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        // Already scrolled past (a deep link or a restored position): show it.
        const passed = e.boundingClientRect.bottom < 0;
        if (!e.isIntersecting && !passed) continue;
        e.target.setAttribute('data-shown', '');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  items.forEach((el) => io.observe(el));
}
