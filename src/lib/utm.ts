/**
 * UTM tagging for every link that leaves this site.
 *
 * `source` and `medium` are fixed for the landing page; `campaign` names the
 * page and `content` names the link, so analytics on the far side can tell
 * the header button from the footer link. Build-time only: the markup ships
 * already tagged, so it works without JavaScript.
 */
export interface UtmParts {
  campaign: string;
  content: string;
}

export const UTM_SOURCE = 'treklink-landing';
export const UTM_MEDIUM = 'website';

export function withUtm(href: string, { campaign, content }: UtmParts): string {
  const url = new URL(href);
  url.searchParams.set('utm_source', UTM_SOURCE);
  url.searchParams.set('utm_medium', UTM_MEDIUM);
  url.searchParams.set('utm_campaign', campaign);
  url.searchParams.set('utm_content', content);
  return url.toString();
}
