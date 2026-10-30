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
| [RepoSentry](https://github.com/pralav-25/RepoSentry) | Desktop dependency scanner with OSV advisory lookups, severity filters, SQLite scan history, and CSV export |
| [Pairglass](https://github.com/pralav-25/pairglass) · [Synthetic sample report](https://pralav-25.github.io/pairglass/) | Paired model evaluation, subgroup regressions, changed-case inspection, offline HTML reports, and CI checks |
| [ShiftWatch](https://github.com/pralav-25/shiftwatch) · [Live demo](https://pralav-25.github.io/shiftwatch/) | Reproducible ML evaluation, statistical data drift checks, a CSV CLI, and an interactive React dashboard |
| [StructIQ](https://github.com/pralav-25/StructIQ) | FastAPI maintenance workflows, private workspaces, asset maps, incident/photo reporting, public status links, and audit history |
| [Websites4U](https://github.com/pralav-25/w4u) | Responsive product experience and accessible lead flow |
| [FlowLock](https://github.com/pralav-25/FlowLock) | Interactive API-security concept |
| [Editing Portfolio](https://github.com/pralav-25/Editing_Portfolio) | React, TypeScript, and visual storytelling |
| [Dataset Gate](https://github.com/pralav-25/dataset-gate) | Versioned CSV contracts, validation history, CLI/API workflows, and GitHub Actions |
| [Interleave](https://github.com/pralav-25/interleave) · [Live demo](https://interleave-pralav.vercel.app) | Step-by-step concurrency experiments, state inspection, and replay schedules |
| [CHROMA](https://github.com/pralav-25/chroma) · [Live demo](https://chroma-tawny.vercel.app/) | WebGL shader studio, editable palettes, local collections, and PNG export |
| [Python Algorithm Lab](https://github.com/pralav-25/python-algorithm-lab) | Documented algorithm implementations, runnable examples, and independent tests |

ShiftWatch's featured chart is copied from its [reproducible experiment results](https://github.com/pralav-25/shiftwatch/blob/main/docs/experiment-results.png) (MIT license). The displayed shifts are synthetic stress tests on 54 held-out UCI Wine rows; results are not production-impact claims.

Dataset Gate and Interleave previews use their repositories' report and workbench screenshots. The CHROMA preview is captured from its live studio. Python Algorithm Lab uses an illustration of the binary-search example from its README.

The Pairglass preview is its published synthetic example report. RepoSentry and
StructIQ use labelled workflow illustrations based on their implemented features.
The October 2026 update also highlights [filelock PR #872](https://github.com/tox-dev/filelock/pull/872),
merged on 28 October 2026.

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

Next.js, React, TypeScript, Tailwind CSS, Framer Motion, and Lucide icons.
The site is statically generated, validated through GitHub Actions, and deployed through Vercel.

The project navigator in `components/ui/scroll-morph-hero.tsx` uses the same project
data as the detail cards. Its full-width section uses one circle-to-arc transition
with normal page scrolling. Each preview links to static project details below.
Phones and reduced-motion preferences receive a compact static navigator.

## Contact

[Email](mailto:singhpralav07@gmail.com) · [GitHub](https://github.com/pralav-25) · [LinkedIn](https://www.linkedin.com/in/pralavsingh)

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

The editing reveal uses one continuous video behind an SVG text cutout. Scrolling
enlarges the lettering into a solid glyph stroke until the footage fills the
stage. The same video keeps playing throughout; reduced-motion preferences receive
a static full-frame presentation with the playback control.
The background showcase plays the complete user-supplied `Andrewww.mp4`, served
unchanged as `public/andrewww-original.mp4` on desktop and mobile. Its original
1920×978 resolution, 60 fps video, audio, and bitrate are preserved. The player
uses `object-fit: contain` to retain the entire frame, with sound available on
request. No smaller mobile encode or showcase trim is used.

Original SHA-256: `efd000b41f6acdce6b5395957e0627ebf277a43ff08d6937926c0acf2faf2fe7`.
