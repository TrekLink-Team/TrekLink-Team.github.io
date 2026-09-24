# Session: PR #10 end-to-end review and fixes

**Date**: 2026-09-24
**Repos touched**: `TrekLink-Team.github.io`
**Owner**: KhoaDD

---

## Goal

Review the landing redesign (PR #10) end to end, then fix what the review found.

## What shipped

- Scroll-driven animations restored in the production build (`cssMinify: 'esbuild'`), with a CI
  and deploy guard on the built CSS.
- Deploy verification repointed from the deleted `node-hero.webp` to `node-lineup.webp`, and the
  four legal routes asserted in `dist` and live.
- `source-photos/` untracked again, and the branch rebased onto `dev` without the commit that
  tracked it.
- Product images declared and disclosed as renders; Meshtastic notice completed; legal pages
  rewritten against Law 91/2025/QH15 and Decree 356/2025/ND-CP with a private contact address.
- Island cleanup: snap release waits for the scroll to settle, off-view card fading moved into
  the deal keyframes, mesh map pauses offscreen, mobile menu split out with the 1100px breakpoint,
  one motion-preference helper.
- A pull-request CI workflow running check, test, build and the guards.

## Decisions taken here

**Contact**: `treklink.team@gmail.com` for privacy and legal requests. Public GitHub issues stay
only for general site questions, because an issue publishes the requester's own data.

**Language precedence**: the Vietnamese version of each legal page prevails.

**Radio band**: the Terms keep "MY_433, 433.0 to 435.0 MHz" at the leader's instruction.

**Base branch**: PR #10 moved from `main` to `dev`, per AGENTS.md §3, by rebasing and
force-pushing the branch.

## Findings worth not re-deriving

**Lightning CSS folds `animation-timeline` into the `animation` shorthand, and Chromium drops the
whole declaration.** `astro dev` does not minify, so the site looks right locally and is broken in
production. The fallbacks in `chrome.ts` and `reveal.ts` feature-detect the longhand and so never
step in. The guard greps `dist/_astro/*.css` for `view(`/`scroll(` inside `animation:`.

**The node, line-up and board images are ChatGPT renders.** Their working originals carry OpenAI
C2PA manifests. `source-photos/logo-meshtastic-dark.png` is an AI-regenerated copy of Meshtastic's
logo and must never be published.

**The Meshtastic image is the "M-Powered" community logo**, which needs no trademark grant. The
conditions that do apply are in Meshtastic's Licensing and Trademark guidelines: ® on first use,
registered-trademark attribution, "not affiliated with or endorsed by the Meshtastic project",
the logo hyperlinked to meshtastic.org, and a copy of the use sent to `trademark@meshtastic.org`
within seven days (Q5).

**`source-photos/` EXIF is clean on location.** GPS IFDs exist but hold 0/0 rationals; no
serials. The v2 board shots do show a legible ESP32-S3 module DataMatrix.

**`dev` and `main` hold the same content under different histories** (each landing PR was landed
twice). Only the hero rename `a1e1ef9` differed, and this branch supersedes it.

**Most legal and Meshtastic sites are blocked by the cloud session's egress policy.** The
Meshtastic policy was read from its source in `meshtastic/meshtastic` on GitHub.

## Not done

- Legal review by counsel (Q4) and the Meshtastic notification email (Q5).
- The PR body's `Model used:` line still names one model while the commit trailers name two.
- axe and overflow checks from the PR body were not re-run.
