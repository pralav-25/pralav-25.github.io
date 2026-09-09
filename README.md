# Pralav Singh — Portfolio

[![Checks](https://github.com/pralav-25/pralav-25.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/pralav-25/pralav-25.github.io/actions/workflows/ci.yml)

A recruiter-focused portfolio presenting selected software projects, technical
capabilities, and creative work with direct links to source code and live demos.

**Live site:** [pralav-singh-portfolio.vercel.app](https://pralav-singh-portfolio.vercel.app)

## What this project demonstrates

- Responsive, semantic interface design
- Accessible navigation, focus states, contrast, and reduced-motion support
- Evidence-led project presentation with verified public links
- Static generation for a fast, dependable Vercel deployment
- Complete social, search, and sharing metadata

## Featured projects

| Project | Focus |
| --- | --- |
| [ShiftWatch](https://github.com/pralav-25/shiftwatch) · [Live demo](https://pralav-25.github.io/shiftwatch/) | Reproducible ML evaluation, statistical data drift checks, a CSV CLI, and an interactive React dashboard |
| [StructIQ](https://github.com/pralav-25/StructIQ) | FastAPI, SQLite, infrastructure health scoring, and tests |
| [Websites4U](https://github.com/pralav-25/w4u) | Responsive product experience and accessible lead flow |
| [FlowLock](https://github.com/pralav-25/FlowLock) | Interactive API-security concept |
| [Editing Portfolio](https://github.com/pralav-25/Editing_Portfolio) | React, TypeScript, and visual storytelling |

ShiftWatch's featured chart is copied from its [reproducible experiment results](https://github.com/pralav-25/shiftwatch/blob/main/docs/experiment-results.png) (MIT license). The displayed shifts are synthetic stress tests on 54 held-out UCI Wine rows; results are not production-impact claims.

## Local development

Requires Node.js 22+ and pnpm.

```bash
pnpm install
pnpm dev
```

Create the production build with:

```bash
pnpm build
```

## Update featured work

Project cards are defined in the `projects` array in [app/page.tsx](app/page.tsx).
Update the description, skills, source URL, and optional live URL together. Place
preview images in [public/](public/) and reference them with a leading `/`.

Keep the **Featured projects** table above aligned with the visible cards. The
floating hero cards are separate links in `app/page.tsx`; check those too when
renaming a project or changing its destination. Verify each source and demo link
in the browser before publishing an update.

## Stack

Next.js, React, TypeScript, Tailwind CSS, and Lucide icons.
The site is statically generated, validated through GitHub Actions, and deployed through Vercel.

## Contact

[Email](mailto:singhpralav07@gmail.com) · [GitHub](https://github.com/pralav-25)

## License

Released under the [MIT License](LICENSE).

## Media accessibility

Selecting a gallery sample moves keyboard focus to its Close control. Closing
returns focus to Play; Escape also closes a player when focus is on the page.
Each sample includes a direct platform link in case third-party embeds fail.
Players remain click-to-load and only one runs at a time.

Run `pnpm typecheck`, `pnpm lint`, and `pnpm build` before submitting changes.

The background reel has a visible play/pause control, pauses in hidden tabs, and
starts paused for reduced-motion preferences. Selecting play is an explicit
opt-in; embedded work samples keep their separate play controls.
