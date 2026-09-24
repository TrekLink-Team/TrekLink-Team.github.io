/**
 * The navigation disclosure used on phone and tablet.
 *
 * `Header.astro` swaps the disclosure for the inline navigation at
 * NAV_INLINE_MIN. The two must agree: if this closed the panel at a smaller
 * width, a panel opened between the two would be left behind the switch with
 * aria-expanded="true" on a hidden toggle, and the scroll-direction header,
 * which stays pinned while anything in it is expanded, would never hide again.
 */

/** Keep in step with the `max-width: 1099px` / `min-width: 1100px` rules in Header.astro. */
export const NAV_INLINE_MIN = 1100;

export function mountMobileNav(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = document.getElementById('mobile-nav');
  if (!toggle || !panel) return;

  const label = toggle.querySelector('.sr-only');

  function setOpen(open: boolean): void {
    toggle!.setAttribute('aria-expanded', String(open));
    panel!.hidden = !open;
    if (label) {
      label.textContent = open
        ? (toggle!.dataset.close ?? '')
        : (toggle!.dataset.open ?? '');
    }
  }

  setOpen(false);

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  panel.querySelectorAll('[data-mobile-link]').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  // A panel left open while the layout returns to the inline navigation
  // would hang below the header with no way to close it.
  const wide = window.matchMedia(`(min-width: ${NAV_INLINE_MIN}px)`);
  wide.addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}
