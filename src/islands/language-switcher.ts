/**
 * Locale persistence and the mobile navigation disclosure.
 *
 * The switcher is an anchor and works without this (REQ-EVT-05). All this adds
 * is remembering the choice, and it deliberately does not redirect a visitor
 * who typed a URL: a stored preference that overrides an explicit request is
 * the behaviour that traps people on the wrong language.
 */
const STORAGE_KEY = 'treklink.locale';

export function mountLanguageSwitcher(): void {
  const link = document.querySelector<HTMLAnchorElement>('[data-lang-switch]');
  if (!link) return;

  link.addEventListener('click', () => {
    const target = link.dataset.langSwitch;
    if (!target) return;
    try {
      localStorage.setItem(STORAGE_KEY, target);
    } catch {
      // Private mode or a blocked storage partition. The navigation still
      // happens; only the memory of it is lost, which is not worth an error.
    }
  });
}

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

  // A panel left open while the layout returns to the desktop navigation
  // would hang below the header with no way to close it.
  const wide = window.matchMedia('(min-width: 900px)');
  wide.addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}
