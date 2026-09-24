# Technical Design: landing

Implements [`requirements.md`](requirements.md).

---

## 1. Overview

A statically pre-rendered marketing site, built with Astro, deployed to GitHub Pages from a GitHub
Actions workflow. Every route is a real HTML file. The only runtime behaviour is a health check, a
carousel, a scrollspy and a language switch, each delivered as an isolated island so that the page
renders and reads with JavaScript disabled.

### 1.1 Why Astro rather than Vite

Question 19 allowed either. The deciding fact came from research after that answer: a
client-side-routed application on GitHub Pages returns **HTTP 404 for every deep link** unless it
uses the `404.html` redirect trick, and that trick still returns a 404 status for a valid page. It
harms indexing and makes some browsers flash an error banner.

Astro emits one real HTML document per route, so every canonical URL is a true 200 (REQ-UBI-03).
It also ships zero JavaScript by default and hydrates only the islands that need it, which is what
makes the §3 performance targets reachable with photography-heavy content. Astro uses Vite
underneath, so the toolchain is not foreign to the team.

The cost, stated plainly: the landing site does not share a build config with `treklink-web/frontend`.
Question 76 accepted that, because a landing page does not have to match the application's stack.

### 1.2 Why a separate repository

A GitHub Pages **user site** must live in a repository named exactly `<owner>.github.io`, which is
why this folder is named `TrekLink-Team.github.io`. GitHub fixes the name; it was not chosen. In
exchange the site serves from `https://treklink-team.github.io/` with no path prefix, the shortest
free URL available (question 74).

The separation is also a terms-of-service matter. GitHub Pages prohibits sensitive transactions
involving passwords or payment. The operations system has both, so it is hosted elsewhere and only
linked to from here. Keeping the public site out of `treklink-web` keeps that boundary obvious.

---

## 2. Architecture

```mermaid
flowchart TD
    A["Astro build"] --> B["dist/ : one HTML per route"]
    B --> C["GitHub Actions: actions/deploy-pages"]
    C --> D["https://treklink-team.github.io/"]
    D --> E["Visitor"]
    E -->|"activates header link"| F["Health check island"]
    F -->|"200 within timeout"| G["Navigate to operations system"]
    F -->|"error, non-200, or timeout"| H["Toast: service currently unavailable"]
    H --> E
```

***Figure 1***: Build, deploy and the only runtime decision on the page. The visitor never waits on
the health check to read the site. Placement: inline, 182.0 x 120.0 mm, labels at 9.0 pt.

### 2.1 Route map

| Route | File | Locale |
|---|---|---|
| `/` | `src/pages/index.astro` | English, default |
| `/vi/` | `src/pages/vi/index.astro` | Vietnamese |
| `/404` | `src/pages/404.astro` | A genuine not-found page, not a routing workaround |

One page per locale. The content is a single scrolling document with anchored sections, which is
what the scrollspy in REQ-EVT-06 indexes. More routes are added only if the content outgrows one
page.

### 2.2 Directory layout

```text
specs/landing/           requirements.md, design.md, tasks.md
src/
  components/            Header, Hero, Problem, NodeLines, ResearchDevelopment, Footer
                         LandingPage composes them once, so the locale routes cannot drift
  islands/               SystemLink, Carousel, Scrollspy, LanguageSwitcher
  layouts/               Base.astro: head, skip link, locale wiring
  pages/                 index.astro, vi/index.astro, 404.astro
  i18n/                  en.json, vi.json, index.ts
  styles/                tokens.css, global.css
site.config.ts           operations URL, health endpoint, timeout, analytics id
public/
  images/products/       product photographs, dropped in by the leader
  images/placeholders/   typographic stand-ins of identical aspect ratio
.github/workflows/       deploy.yml
```

---

## 3. Components and Interfaces

### 3.1 Static components, zero JavaScript

| Component | Responsibility |
|---|---|
| `Header` | Wordmark, section navigation, language switcher slot, system link slot. Sticky. |
| `Hero` | The product advert. One product photograph, headline, subheadline. No call to action into the system here; question 11 puts that link in the header. |
| `Problem` | What no signal on a trek route costs. Written for a general reader. |
| `NodeLines` | The node versions, as a card grid feeding the carousel island. Named for what it holds: the answer to the hardware question was one node in three versions, v2, v3 and v4, so there is no plural product line to show. v1 is excluded by D-005. |
| `ResearchDevelopment` | The R&D section from question 12. General and professional, no research question identifiers, no metrics that are not yet measured. |
| `Footer` | Contact, repository link, copyright. |

### 3.2 Islands

Each hydrates independently. A failure in one does not affect the others.

**`SystemLink`**, the only island whose absence changes behaviour rather than polish.

```ts
type Availability = 'idle' | 'checking' | 'up' | 'down';

// On activation, never on page load. Checking on load would make every visitor
// pay for a request that most of them never need, and would put a backend
// outage on the critical path of a page that must not depend on it.
async function check(signal: AbortSignal): Promise<boolean>;
```

It uses `AbortController` with the configured timeout (REQ-ERR-02), treats any rejection or
non-success status as unavailable (REQ-ERR-01), and surfaces neither status code nor endpoint.
Without JavaScript it degrades to a plain anchor, which is the correct fallback: the visitor
reaches the system directly and the browser reports any failure itself.

**`Carousel`** honours `prefers-reduced-motion` (REQ-STA-02), exposes previous and next controls to
the keyboard, and announces item changes through a live region (REQ-EVT-07).

**`Scrollspy`** uses `IntersectionObserver` and only sets an active state. It never moves the page.

**`LanguageSwitcher`** navigates to the mirrored route and persists the choice in `localStorage`
(REQ-EVT-05). It is an anchor first, so it works without JavaScript.

### 3.3 Configuration

`site.config.ts` is the single source for every environment-dependent value (REQ-UBI-05):

| Key | Purpose | Initial value |
|---|---|---|
| `operationsUrl` | Where the header link goes | placeholder until the backend is deployed, open question Q1 |
| `healthEndpoint` | What the availability check requests | placeholder, Q1 |
| `healthTimeoutMs` | Abort threshold | `3000` |
| `contactEmail` | Private address for privacy and legal requests, named in both legal pages | `treklink.team@gmail.com`, Q4 |
| `analyticsToken` | Cloudflare Web Analytics site token | empty string until the leader supplies it. Empty means the beacon is not rendered at all, phase 5 |
| `site` | Canonical origin, used for absolute URLs | `https://treklink-team.github.io` |

---

## 4. Locale System

Question 9 requires a real locale system, not translated duplicates.

- `src/i18n/en.json` and `vi.json` are flat key-to-string catalogues. English is the reference.
- `src/i18n/index.ts` exports `t(locale, key)`, which falls back to the English entry when the
  Vietnamese one is missing (REQ-STA-04). It never returns a raw key to the page.
- A page renders by locale; no string is inline in a component (REQ-UBI-04).
- English ships complete. Vietnamese ships as a route with partial coverage and visible fallback,
  which is the honest state rather than a half-translated page pretending to be finished.

---

## 5. Visual Design

From question 15. The brief is pastel dark military green, forestry and lumber typography in a US
lumberjack register, bold and impactful, with neomorphism and glassmorphism. Structure follows
Garmin: product photography carries the hierarchy, not iconography.

### 5.1 Tokens

Defined once in `src/styles/tokens.css` as CSS custom properties. No colour literal appears in a
component.

**Resolved on 2026-09-22 to the Timberline direction.** Three directions were built in real CSS
and reviewed side by side: one close to the Codespot reference, one close to the Visuo reference,
and this one, written against question 15 rather than against a template. The leader chose this
one, and instructed that the reference sites be treated as samples rather than as layouts to copy.

| Token | Value | Role |
|---|---|---|
| `--surface-base` | `#12170f` | The page ground, desaturated dark olive |
| `--surface-sunken` | `#0d110b` | Footer and inset wells |
| `--surface-raised` | `#1a2015` | Neomorphic panels, one step toward the light |
| `--surface-ridge` | `#222a1c` | Hairlines and dividers that need to read |
| `--glass-fill-top`, `--glass-fill-bottom`, `--glass-edge`, `--glass-edge-lit`, `--glass-blur` | | Glass panel gradient, its border, its lit top edge and the backdrop filter strength |
| `--ink` | `#dce3d4` | Body text, 13.4:1 on `--surface-base` |
| `--ink-muted` | `#a4b098` | Secondary text, 7.6:1 |
| `--ink-faint` | `#7c8a70` | Labels, 4.6:1, the AA floor for body text |
| `--brass` | `#c08a3e` | The single warm accent, 6.4:1. Primary controls and the system link |
| `--brass-deep`, `--brass-lit` | | The pressed face of a brass control, and brass text on a brass fill |
| `--moss` | `#8faf74` | The secondary accent, 8.2:1 |
| `--warn` | `#d9a441` | The unavailability toast |
| `--radius-sm`, `--radius`, `--radius-lg` | `3px`, `5px`, `9px` | Hard geometry. A pill radius reads as a consumer app, which is the wrong register |
| `--shadow-neo`, `--shadow-glass`, `--shadow-press` | | The three elevations: pressed plate, floating glass, depressible control |
| `--font-display`, `--font-body` | Oswald, Manrope | §5.2 |
| `--step--1` to `--step-4` | | Fluid type scale |

Every contrast figure above was computed against `--surface-base`, not against black, and not
assumed.

### 5.2 Type

**Oswald Variable** for display and **Manrope Variable** for body, both SIL Open Font License,
both self-hosted in `public/fonts/` from their npm sources with the licence text alongside. Latin
and Vietnamese subsets only, bound by `unicode-range`, so the `/vi/` route renders its diacritics
correctly and an English visitor never downloads the Vietnamese face. The two latin faces are
preloaded. No third-party font request appears on the critical path.

### 5.3 Components

Glass and neomorphic surfaces are two utility classes in `src/styles/global.css`, `.glass` and
`.plate`, written against §5.1. The design originally proposed copying them from an existing
shadcn-compatible glass registry. That was dropped once the tokens existed: the whole surface
treatment is a gradient, a border, a backdrop filter and a shadow, which is smaller than the work
of re-theming someone else's component and leaves nothing to audit on installation.

Nothing available ships dark military green with wood. That layer is ours. A tiled wood grain sits
behind the glass panels, because a backdrop filter needs high-frequency detail underneath to read
as glass at all.

Element naming in this spec follows [namethatui.com](https://namethatui.com/) so that the spec and
the implementation use the same words. It is a naming dictionary, not a component source.

The `Hero` stat row is a two-column bento, not three equal columns: the first stat spans the full
row at full size with a small brass index tab (`01`, `02`, `03`), the other two share the second
row at a reduced value size. The same two-column shape holds at every viewport, so the small-screen
layout is the desktop layout, not a separate override. The capability chip list keeps its centred,
wrapping treatment at tablet and up; below 768px it becomes a single horizontal scroll strip with a
faded edge instead of wrapping into a multi-line block. Both were chosen from a temporary
side-by-side comparison page (deleted once decided) against the leader's own weak-point review;
the hero glow, the chip treatment above 768px, and the wood grain and contour opacities were
reviewed the same way and kept as shipped.

### 5.4 Imagery

`public/images/products/` holds the product images, supplied by the leader. Until each arrives,
`public/images/placeholders/` holds a typographic stand-in at the identical aspect ratio, so that
layout is final before the image exists (REQ-OPT-02, question 79). Swapping one in is a file
drop plus one line in `src/lib/media.ts`, never a layout change (AC-08).

Every slot in `src/lib/media.ts` declares its kind: `photo`, `render` or `placeholder`. The node,
line-up and board images shipped in PR #10 are AI-regenerated renders of the prototypes (their
working originals carry OpenAI C2PA manifests), so they are `render`, their alt text begins
"Render:", the nodes section carries a visible note, and the Terms say so. A render is never
presented as a photograph.

Third-party marks live in `brandMedia`, apart from product imagery, because their owners' terms
govern them. The Meshtastic "M-Powered" logo is shown unaltered, hyperlinked to meshtastic.org,
with the registered-trademark attribution and non-affiliation notice as its caption.

Source originals stay out of the repository (see `.gitignore`).

---

## 6. Deployment

`.github/workflows/deploy.yml`, triggered on push to `main` and by manual dispatch.

1. Checkout, install, `astro build`.
2. `actions/upload-pages-artifact` on `dist/`.
3. `actions/deploy-pages` with `pages: write` and `id-token: write`.

Pages source is set to **GitHub Actions**, not a branch. No `.nojekyll` gymnastics, no `gh-pages`
branch.

GitHub Pages limits, none of which this site approaches: 1 GB repository, 1 GB published site,
100 GB bandwidth per month, a soft 10 builds per hour, and a 10 minute deployment timeout.

---

## 7. Testing Strategy

| Layer | What | Tool |
|---|---|---|
| Build | Every route in the route map emits an HTML file | assertion over `dist/` in CI |
| HTTP | Every canonical URL returns 200 after deploy | `curl -o /dev/null -w '%{http_code}'` |
| Unit | `t()` returns the English string for a missing Vietnamese key, and never a raw key | vitest |
| Unit | The health check resolves `down` on non-200, on rejection, and on timeout | vitest with a mocked `fetch` |
| Accessibility | No AA violations | axe in CI |
| Performance | Lighthouse meets the §3 targets | Lighthouse CI |
| Manual | Keyboard-only pass over skip link, navigation, switcher, carousel, system link | before Review 1 |
| Manual | Full render with JavaScript disabled | before Review 1 |

The health-check tests matter more than their size suggests: REQ-EVT-04 is the behaviour the
supervisor was promised, and it is the one that is invisible until the backend is down.
