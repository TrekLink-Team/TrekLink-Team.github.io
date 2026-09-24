/**
 * Locale persistence.
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
