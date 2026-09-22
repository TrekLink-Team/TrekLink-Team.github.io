# Implementation Tasks: landing

Implements [`design.md`](design.md). Requirement references are to
[`requirements.md`](requirements.md).

**Deadline: 1 October 2026.** Phases 1 to 4 produce a deployable site. Phases 5 to 7 raise it to
the acceptance criteria. If time runs short, phase 6 content polish is what gets cut, never
phase 4 or the accessibility work in phase 7.

---

## Phase 0: Repository and hosting

- [x] 0.1 Create the GitHub repository `TrekLink-Team/TrekLink-Team.github.io`, public, and add it
      as the `origin` remote of the existing local repository
  - The name is fixed by GitHub: a user or organisation site must match `<owner>.github.io`
  - _Requirements: REQ-UBI-01_
- [x] 0.2 Create `main` and `dev`, apply the branch model and protection from convention 07
  - _Requirements: none, process_
- [x] 0.3 Set Pages source to **GitHub Actions** in repository settings, not a branch
  - _Requirements: REQ-UBI-03_
- [x] 0.4 Copy `.github/` from `treklink-docs` for the PR and issue templates, and add the repo to
      the canonical `AGENTS.md` §1 layout table in all four existing copies plus this one
  - _Requirements: none, process_

## Phase 1: Scaffold and configuration

- [x] 1.1 Initialise Astro with TypeScript strict, set `site` to `https://treklink-team.github.io`
      and leave `base` unset, because a user site serves from the root
  - _Requirements: REQ-UBI-03_
- [x] 1.2 Add Tailwind, and `src/styles/tokens.css` holding every token from design §5.1
  - No colour literal in a component
  - _Requirements: REQ-UBI-05_
- [x] 1.3 Write `site.config.ts` with `operationsUrl`, `healthEndpoint`, `healthTimeoutMs`,
      `analyticsId` and `site`, placeholders where the value is not yet known
  - _Requirements: REQ-UBI-05_
- [x] 1.4 Write `src/layouts/Base.astro`: head, skip-to-content link, locale wiring, font preload
  - _Requirements: REQ-UBI-06_
- [x] 1.5 Self-host the display and body faces in `public/fonts/`, preloaded
  - _Requirements: performance target in requirements §3_

## Phase 2: Locale system

- [x] 2.1 Write `src/i18n/index.ts` exporting `t(locale, key)` with English fallback
  - Never returns a raw key
  - _Requirements: REQ-UBI-04, REQ-STA-04_
- [x] 2.2 Create `en.json` as the reference catalogue, and `vi.json` seeded with the keys it has
  - _Requirements: REQ-UBI-04_
- [x] 2.3 Unit test: a missing Vietnamese key returns the English string; an unknown key returns
      neither `undefined` nor the key itself
  - _Requirements: REQ-STA-04_
- [x] 2.4 Build the `LanguageSwitcher` island: an anchor first, persisting the choice
  - _Requirements: REQ-EVT-05_

## Phase 3: Static sections

- [x] 3.1 `Header`, sticky, with section navigation, the switcher slot and the system link slot.
      Below the mobile breakpoint it becomes a disclosure control
  - _Requirements: REQ-STA-03, question 11_
- [x] 3.2 `Hero`, the product advert. One photograph, headline, subheadline. No system call to
      action in the hero; it lives in the header
  - _Requirements: REQ-EVT-01_
- [x] 3.3 `Problem`, written for a general reader
  - _Requirements: none, content_
- [x] 3.4 `NodeLines`, the card grid that feeds the carousel
  - _Requirements: none, content_
- [x] 3.5 `ResearchDevelopment`, general and professional. No research question identifiers, no
      metric that has not been measured
  - _Requirements: REQ-UBI-07, question 12_
- [x] 3.6 `Footer`
  - _Requirements: REQ-UBI-07_
- [x] 3.7 Generate typographic placeholders into `public/images/placeholders/` at the exact aspect
      ratios the layout uses, and document the target path for each real photograph
  - _Requirements: REQ-OPT-02, AC-08_

## Phase 4: The islands

- [x] 4.1 `SystemLink`: check on activation, never on page load. `AbortController` on the
      configured timeout. Any rejection or non-success status means unavailable
  - Surfaces no status code, no endpoint, no stack trace
  - _Requirements: REQ-EVT-02, REQ-EVT-03, REQ-EVT-04, REQ-STA-01, REQ-ERR-01, REQ-ERR-02_
- [x] 4.2 The unavailability toast: non-blocking, dismissible, announced to assistive technology
  - _Requirements: REQ-EVT-04, REQ-UBI-06_
- [x] 4.3 Unit test the check against three cases: non-200, network rejection, timeout
  - _Requirements: REQ-ERR-01, REQ-ERR-02_
- [x] 4.4 `Carousel`, keyboard operable, honouring `prefers-reduced-motion`, with a live region
  - _Requirements: REQ-EVT-07, REQ-STA-02_
- [x] 4.5 `Scrollspy` on `IntersectionObserver`, setting active state only, never scrolling
  - _Requirements: REQ-EVT-06_
- [x] 4.6 Verify the whole page renders and navigates with JavaScript disabled
  - _Requirements: REQ-ERR-05_

## Phase 5: Deployment and analytics

- [x] 5.1 `.github/workflows/deploy.yml`: build, `upload-pages-artifact`, `deploy-pages`, with
      `pages: write` and `id-token: write`
  - _Requirements: REQ-UBI-01_
- [ ] 5.2 First deploy, then assert every route in the route map returns 200
  - `curl -o /dev/null -w '%{http_code}'`
  - _Requirements: REQ-UBI-03, AC-01_
- [x] 5.3 Add the Cloudflare Web Analytics beacon, guarded so that a blocked script changes nothing
  - The token comes from the leader's Cloudflare account and lives in `site.config.ts`, never
    inline in a component
  - _Requirements: REQ-UBI-08, REQ-ERR-04_
- [x] 5.4 Add a genuine `404.astro`. It is a not-found page, not a routing workaround
  - _Requirements: REQ-UBI-03_

## Phase 6: Content and Vietnamese

- [x] 6.1 Replace placeholder copy with the leader's final wording, English
  - _Requirements: Q3, resolved 2026-09-23. The leader approved the drafted hero and problem copy as final._
- [ ] 6.2 Populate `vi.json` as far as translation allows, relying on visible fallback for the rest
  - _Requirements: REQ-STA-04_
- [ ] 6.3 Swap in real product photographs as they arrive, by file drop only
  - _Requirements: REQ-OPT-02, AC-08_

## Phase 7: Verification and Review 1 readiness

- [ ] 7.1 axe in CI, zero AA violations
  - _Requirements: REQ-UBI-06, AC-06_
- [ ] 7.2 Lighthouse CI against the requirements §3 targets
  - _Requirements: AC-07_
- [ ] 7.3 Manual keyboard-only pass: skip link, navigation, switcher, carousel, system link
  - _Requirements: REQ-UBI-06, AC-05_
- [ ] 7.4 Availability rehearsal with the operations system deliberately unreachable, confirming
      the page renders fully and the toast appears
  - This is the behaviour promised to the supervisor and it is invisible until the backend is down
  - _Requirements: REQ-EVT-04, AC-02_
- [ ] 7.5 Availability rehearsal with the operations system reachable
  - _Requirements: REQ-EVT-03, AC-03_
- [ ] 7.6 Audit that `api-design/` is not needed here, and that this spec matches what was built
  - _Requirements: convention 02 Phase 6.3_
