import { checkAvailability } from '../lib/health';
import { siteConfig } from '../../site.config';

/**
 * The header link into the operations system (REQ-EVT-02 to REQ-EVT-04).
 *
 * The anchor already works before this runs: it points at the operations URL
 * and a visitor without JavaScript simply navigates there. This upgrades it to
 * check first, so that an unreachable backend produces a toast on a page that
 * still works rather than a browser error page that looks like TrekLink is
 * down (REQ-ERR-05).
 */

interface ToastStrings {
  title: string;
  body: string;
  dismiss: string;
}

function buildToast(strings: ToastStrings): HTMLElement {
  const existing = document.querySelector<HTMLElement>('[data-toast]');
  if (existing) return existing;

  const toast = document.createElement('div');
  toast.dataset.toast = '';
  toast.className = 'toast glass';
  // Alert, not status: this is the answer to something the visitor just did,
  // so it should interrupt rather than wait for a pause in speech.
  toast.setAttribute('role', 'alert');
  toast.hidden = true;
  // Static literal, no interpolation. Every translated string below is set
  // through textContent, so no catalogue entry can inject markup here.
  toast.innerHTML = `
    <div class="toast-body">
      <strong class="toast-title"></strong>
      <span class="toast-text"></span>
    </div>
    <button type="button" class="toast-dismiss"></button>
  `;

  toast.querySelector('.toast-title')!.textContent = strings.title;
  toast.querySelector('.toast-text')!.textContent = strings.body;

  const dismiss = toast.querySelector<HTMLButtonElement>('.toast-dismiss')!;
  dismiss.textContent = '×';
  dismiss.setAttribute('aria-label', strings.dismiss);
  dismiss.addEventListener('click', () => {
    toast.hidden = true;
  });

  document.body.append(toast);
  return toast;
}

export function mountSystemLink(): void {
  const link = document.querySelector<HTMLAnchorElement>('[data-system-link]');
  if (!link) return;

  const textNode = link.querySelector<HTMLElement>('[data-system-link-text]');
  const idleLabel = link.dataset.label ?? link.textContent?.trim() ?? '';
  const checkingLabel = link.dataset.checking ?? idleLabel;

  const strings: ToastStrings = {
    title: link.dataset.toastTitle ?? '',
    body: link.dataset.toastBody ?? '',
    dismiss: link.dataset.toastDismiss ?? 'Dismiss',
  };

  let inFlight = false;

  link.addEventListener('click', async (event) => {
    // A modified click is the visitor asking for a new tab or a download.
    // Intercepting it would be rude and would also skip the check for them,
    // which is fine: the browser reports a failure itself in that case.
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    if (inFlight) return;
    inFlight = true;

    link.dataset.state = 'checking';
    link.setAttribute('aria-busy', 'true');
    if (textNode) textNode.textContent = checkingLabel;

    const up = await checkAvailability({
      endpoint: siteConfig.healthEndpoint,
      timeoutMs: siteConfig.healthTimeoutMs,
    });

    inFlight = false;
    delete link.dataset.state;
    link.removeAttribute('aria-busy');
    if (textNode) textNode.textContent = idleLabel;

    if (up) {
      window.location.href = link.href;
      return;
    }

    // REQ-EVT-04: stay on the page, say so, block nothing.
    const toast = buildToast(strings);
    toast.hidden = false;
    toast.querySelector<HTMLButtonElement>('.toast-dismiss')?.focus();
  });
}
