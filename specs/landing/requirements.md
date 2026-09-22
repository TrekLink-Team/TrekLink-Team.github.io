# Requirements Specification: landing

**Module**: `landing` (the public TrekLink marketing site)
**Owner**: KhoaDD
**Deadline**: **1 October 2026**, before Review 1
**Status**: draft, awaiting review
**Answers this spec is built on**: [`treklink-docs/_docs/00-project-context/07-clarification-answers.md`](../../../treklink-docs/_docs/00-project-context/07-clarification-answers.md) §1, questions 3 to 24 and 74 to 79, all Confirmed.

---

## 1. Domain Context & Scope

**Purpose.** Show the TrekLink product to a public audience and hand a visitor into the operations
system. It is a showcase, requested by the supervisor, and it is the first artifact the Review 1
panel will see running.

**In-Scope**

- A public, statically hosted marketing site at `https://treklink-team.github.io/`
- Product-first content: hero, problem, node versions, research and development, footer
- A header link into the operations system, with a live availability check
- English and Vietnamese through a real locale system, English shipped first
- Cookieless analytics
- WCAG 2.1 AA conformance

**Out-of-Scope**

- Any operations functionality. No login form, no booking, no payment, no device data.
  GitHub Pages' terms prohibit *sensitive transactions involving passwords or credit card
  information*, so the operations frontend is hosted elsewhere and is only linked to.
- A live map. Question 17.
- Team names, team photographs, university branding. Questions 13 and 14.
- A backend of any kind. The site is static files.
- A custom domain. Question 5 defers it, without foreclosing it.

**Depends on**: nothing in `treklink-web`. The site must build, deploy and render with every other
TrekLink service switched off. That independence is the point, not a side effect.

---

## 2. EARS Functional Criteria

### Ubiquitous, always active

- **REQ-UBI-01**: The system SHALL be served as static files only, with no server-side code and no
  database.
- **REQ-UBI-02**: The system SHALL render every section of every page without issuing a request to
  any TrekLink backend, gateway or broker.
- **REQ-UBI-03**: The system SHALL emit one real HTML document per route at build time, so that
  every canonical URL returns HTTP 200. The `404.html` redirect pattern SHALL NOT be used, because
  it returns HTTP 404 for a valid page and damages indexing.
- **REQ-UBI-04**: The system SHALL hold every user-visible string in a locale catalogue, never
  inline in a component.
- **REQ-UBI-05**: The system SHALL hold every environment-dependent value, including the operations
  system URL, the health-check endpoint and its timeout, in configuration rather than as a literal
  (**D-015**).
- **REQ-UBI-06**: The system SHALL meet WCAG 2.1 AA: contrast, visible focus, keyboard reachability
  of every interactive element, alternative text on every image, and a skip-to-content link.
- **REQ-UBI-07**: The system SHALL contain no personally identifying information about the team and
  no university mark.
- **REQ-UBI-08**: The system SHALL use cookieless analytics, so that no consent banner is required.

### Event-driven

- **REQ-EVT-01**: WHEN a visitor loads any page, the system SHALL render the full page content
  regardless of the operations system's availability.
- **REQ-EVT-02**: WHEN a visitor activates the header link into the operations system, the system
  SHALL check the configured health endpoint before navigating.
- **REQ-EVT-03**: WHEN that check succeeds, the system SHALL navigate the visitor to the operations
  system.
- **REQ-EVT-04**: WHEN that check fails or exceeds its timeout, the system SHALL remain on the
  landing page and display a non-blocking toast stating that the service is currently unavailable.
- **REQ-EVT-05**: WHEN a visitor selects a language, the system SHALL navigate to the same page in
  that locale and SHALL persist the choice for subsequent visits.
- **REQ-EVT-06**: WHEN a visitor scrolls, the system SHALL update the scrollspy to indicate the
  section currently in view.
- **REQ-EVT-07**: WHEN a visitor operates the product carousel by pointer, keyboard or swipe, the
  system SHALL advance or retreat one item and SHALL announce the change to assistive technology.

### State-driven

- **REQ-STA-01**: WHILE the health check is in flight, the system SHALL show a pending state on the
  header link and SHALL NOT block scrolling, navigation or any other interaction.
- **REQ-STA-02**: WHILE a visitor has reduced motion enabled, the system SHALL disable carousel
  auto-advance and all decorative transitions.
- **REQ-STA-03**: WHILE the viewport is narrower than the mobile breakpoint, the system SHALL
  present the navigation as a disclosure control rather than an inline list.
- **REQ-STA-04**: WHILE a Vietnamese catalogue entry is missing, the system SHALL fall back to the
  English string rather than rendering an empty element or a raw key.

### Unwanted behaviour and error cases

- **REQ-ERR-01**: IF the health check returns any non-success status, or the network rejects it,
  THEN the system SHALL treat the service as unavailable and SHALL NOT surface a stack trace, a
  status code or an endpoint URL to the visitor.
- **REQ-ERR-02**: IF the health check has not resolved within its configured timeout, THEN the
  system SHALL abort the request and treat the service as unavailable.
- **REQ-ERR-03**: IF an image fails to load, THEN the system SHALL preserve the layout and render
  its alternative text, never a broken-image icon in a collapsed box.
- **REQ-ERR-04**: IF the analytics script fails to load or is blocked, THEN the system SHALL
  continue to function with no visible difference.
- **REQ-ERR-05**: IF JavaScript is unavailable, THEN the system SHALL still render all content and
  all navigation. Only the health check, the carousel auto-advance and the scrollspy may degrade.

### Optional features

- **REQ-OPT-01**: WHERE a custom domain is later configured, the system SHALL serve from it without
  a content change, using a `CNAME` file and a configured site URL.
- **REQ-OPT-02**: WHERE product photographs have not yet been supplied, the system SHALL render a
  typographic placeholder of the correct aspect ratio, so that layout is final before the photograph
  arrives (question 79).

---

## 3. Non-Functional Requirements

| Concern | Target | Why |
|---|---|---|
| Availability | The site stays up when every TrekLink service is down | Question 3. It is the claim the supervisor will test. |
| Largest Contentful Paint | under 2.5 s on a mid-range mobile over 4G | Review panel will open it on a phone |
| Lighthouse | 90 or above on Performance, Accessibility, Best Practices, SEO | A measurable number for the report |
| Total page weight | under 1.5 MB on first load, images included | Static hosting, mobile audience |
| Health-check timeout | 3 s, configurable | Long enough for a cold backend, short enough that nobody waits |
| Published site size | under 1 GB | GitHub Pages hard limit |
| Browser support | Last two versions of Chrome, Firefox, Safari, Edge, plus mobile Safari and Chrome | |

---

## 4. Acceptance Criteria

- **AC-01**: The site is reachable at `https://treklink-team.github.io/` and every navigation link
  returns HTTP 200, verified with `curl -o /dev/null -w '%{http_code}'`.
- **AC-02**: With the operations system unreachable, the page renders completely and the header
  link produces the unavailability toast.
- **AC-03**: With the operations system reachable, the header link navigates to it.
- **AC-04**: Every section renders in English. The Vietnamese route exists and falls back to
  English for any entry not yet translated.
- **AC-05**: Keyboard alone reaches the skip link, the navigation, the language switcher, the
  carousel controls and the system link, in a visible focus order.
- **AC-06**: Automated accessibility checks report no violations at AA.
- **AC-07**: Lighthouse meets the §3 targets.
- **AC-08**: Replacing a placeholder with a real photograph requires only dropping a file into
  `public/` at the documented path, with no code change.

---

## 5. Open Questions

| # | Question | Blocks |
|---|---|---|
| Q1 | The exact operations system URL and its health endpoint path. Unknown until the backend is deployed. | Nothing. Configuration carries a placeholder until then, per REQ-UBI-05. |
| ~~Q2~~ | ~~Which analytics provider.~~ **Resolved 2026-09-22: Cloudflare Web Analytics.** Free, cookieless, one beacon script, and no proxying of the site through Cloudflare is required. GoatCounter was the alternative and was rejected on licensing: its free tier is for non-commercial use, and a graded university project sits ambiguously against that clause. Plausible is paid, and self-hosting Umami would mean running a backend, which contradicts REQ-UBI-01. The leader supplies the account and the site token. | Nothing. |
| Q3 | Final copy for the hero and the problem section, in the leader's own words. | Content, not structure. Placeholder copy ships first. |
