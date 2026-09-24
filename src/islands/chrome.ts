import { reducedMotion } from '../lib/motion';

/**
 * Page chrome shared by every route: the theme toggle, the scroll progress
 * bar fallback, the back-to-top button and UTM pass-through.
 */
const THEME_KEY = 'treklink.theme';

export function mountThemeToggle(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
  if (!buttons.length) return;
  const root = document.documentElement;

  const paint = () => {
    const light = root.dataset.theme === 'light';
    buttons.forEach((b) => {
      b.setAttribute('aria-pressed', String(light));
      b.setAttribute('aria-label', (light ? b.dataset.toDark : b.dataset.toLight) ?? '');
      b.title = b.getAttribute('aria-label') ?? '';
    });
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', light ? '#efece2' : '#0f140c');
  };

  buttons.forEach((b) => {
    b.hidden = false;
    b.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        // Storage blocked: the switch still applies for this page view.
      }
      paint();
    });
  });
  paint();
}

/** Where scroll-driven animations exist, CSS draws the bar; else this does. */
export function mountScrollProgress(): void {
  const bar = document.querySelector<HTMLElement>('[data-scroll-progress]');
  if (!bar || CSS.supports('animation-timeline: scroll()')) return;
  let queued = false;
  const update = () => {
    queued = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

/** Shows the floating back-to-top link once the visitor is a screen down. */
export function mountBackToTop(): void {
  const link = document.querySelector<HTMLAnchorElement>('[data-to-top]');
  if (!link) return;
  let queued = false;
  const update = () => {
    queued = false;
    link.toggleAttribute('data-show', window.scrollY > window.innerHeight * 0.9);
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  link.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
    document.querySelector<HTMLElement>('#main')?.focus({ preventScroll: true });
  });
  update();
}

/**
 * A visitor who arrived with their own UTM parameters keeps them on the way
 * into the operations system, so attribution survives the hop. Links marked
 * [data-utm-pass] get any incoming utm_* values in place of the defaults.
 */
export function mountUtmPassThrough(): void {
  const incoming = new URLSearchParams(window.location.search);
  const keys = [...incoming.keys()].filter((k) => k.startsWith('utm_'));
  if (!keys.length) return;
  document.querySelectorAll<HTMLAnchorElement>('a[data-utm-pass]').forEach((a) => {
    const url = new URL(a.href);
    keys.forEach((k) => url.searchParams.set(k, incoming.get(k) ?? ''));
    a.href = url.toString();
  });
}
