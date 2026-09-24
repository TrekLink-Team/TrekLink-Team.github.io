/**
 * The visitor's motion preference, read at the moment it matters.
 *
 * Every island asks through this one function rather than snapshotting the
 * media query at mount, so a preference changed mid-visit is honoured by the
 * next decision any island makes.
 */
const QUERY = '(prefers-reduced-motion: reduce)';

export function reducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(QUERY).matches;
}
