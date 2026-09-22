# TrekLink landing site

The public marketing site for **TrekLink**, a LoRa-mesh trekking safety and operations platform
(FPT capstone FA26SE159).

Served at **https://treklink-team.github.io/**.

The repository name is fixed by GitHub: a Pages user or organisation site must live in a repository
named exactly `<owner>.github.io`. That is what buys the root URL with no path prefix.

## Status

Specification complete, implementation not started. Read
[`specs/landing/`](specs/landing/) before writing any code:

| File | Contents |
|---|---|
| [`requirements.md`](specs/landing/requirements.md) | EARS criteria, non-functional targets, acceptance criteria |
| [`design.md`](specs/landing/design.md) | Astro, route map, islands, locale system, visual tokens, deployment |
| [`tasks.md`](specs/landing/tasks.md) | Eight phases, each task referencing its requirements |

## What this site is not

It carries no operations functionality: no login, no booking, no payment, no device data. GitHub
Pages prohibits sensitive transactions involving passwords or payment information, so the
operations system is hosted elsewhere and only linked to from the header.

The site must render completely with every other TrekLink service switched off. When the operations
system is unreachable, the header link produces a toast rather than a broken page. That
independence is the requirement, not a side effect.

## Conventions

[`AGENTS.md`](AGENTS.md) is canonical and byte-identical across `capstone/`, `treklink-docs/`,
`treklink-web/`, `treklink-firmware/` and this repository. The engineering conventions themselves
live in `treklink-docs/_docs/01-conventions/`. Do not vendor a copy here.
