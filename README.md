# Bloomwilds 🌿

A playful learning adventure for kids — built as a Progressive Web App.
Bilingual from day 1: **Svenska (default)** + **English**.

## What it is

The Bloomwilds is a once-magical world that has gone gray and quiet. Together
with a small customizable **Spark** companion, the kid wakes the world back
up by exploring five regions and completing short, hands-on challenges. Each
region progressively blooms with color, music, and creatures as the kid
makes progress.

This MVP targets the **5–7 year old** age group; other ages appear as
"Coming soon" on the picker. The architecture lets new age groups,
regions, and challenges be added by dropping a TS module into `src/content`
and registering it — no engine changes required.

## Vision (in brief)

- **4 age groups** (3–4, 5–7, 8–9, 10–12), each with its own mood and 4–5
  categories. Discovery and unlockable artifacts drive the loop.
- **Accessibility is core, not a toggle.** Every challenge is solvable
  with keyboard only, with captions, with reduced motion, with a single
  switch, with high contrast, in dyslexic-friendly typography, with
  simplified language, or read aloud.
- **Phase 2 (designed, not built)**: teachers/parents paste a real
  homework task → the app generates a custom mini-quest for it via the
  Claude API. The `ChallengeSpec` JSON shape and `registry.register()`
  seam are already in place.

## Quickstart

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production bundle
npm run preview      # serve the build
npm test             # vitest unit tests
npm run lint
npm run format
```

## Tech

- **React 18** + **TypeScript** + **Vite** + **Tailwind CSS**
- **Framer Motion** for motion (with calm/reduced/off variants)
- **Zustand** for state
- **react-i18next** + **i18next-browser-languagedetector** for sv/en
- **idb** (IndexedDB) for local profiles & progress
- **vite-plugin-pwa** — installable to home screens, offline-capable
- **Web Speech API** as a TTS fallback when pre-recorded narration is missing
- **Vitest** + **React Testing Library** for unit; **Playwright** for e2e

## How content is added

Everything kid-facing lives under `src/content/` as plain TypeScript modules
that reference i18n keys. To add a new challenge:

1. Create `src/content/challenges/<region>/<id>.ts` exporting a `ChallengeDef`
   with `spec.sv` and `spec.en` (or a custom `component`).
2. Register it in `src/content/challenges/index.ts`.
3. Add narration keys to `src/i18n/{sv,en}/narration.json`.
4. Add a title to `src/i18n/{sv,en}/challenges.json`.

Adding a region or sticker follows the same pattern in `regions.ts` /
`stickers.ts`.

## Accessibility

A grown-up sets up the kid's "How I Play" (Så här spelar jag) profile on
first launch. Settings persist with the kid profile and flow into the
runtime via CSS variables on `<html>`. The supported toggles:

- Big text · Dyslexic font · High contrast
- Motion: full / reduced / off (motion + OS reduced-motion respected)
- Calm mode (no confetti, fewer decorations)
- Captions for all narrated text
- Read-to-me (per-language narrator)
- Simple language (shorter sentences)
- Dwell-to-tap (hold pointer to activate)
- One-switch play

Color is never the only signal. Every clickable is at least 64×64 px.

## Project structure

```
src/
├── i18n/                 # sv/, en/ — all kid-facing strings
├── content/              # PURE DATA — regions, challenges, stickers
│   └── challenges/<region>/<id>.ts
├── engine/               # framework: no content
│   ├── overworld/        # the bloomwilds map
│   ├── region/           # one region scene
│   └── challenge/        # ChallengeHost, Shell, types, registry
├── components/
│   ├── primitives/       # MatchGame, PickGame, SortGame, OrderGame
│   └── ui/               # Button, TapTarget, CaptionBar, ...
├── stores/               # Zustand: profile, progress, a11y, audio
├── systems/              # persistence, audio, narration, theming
├── pages/                # routes (Boot, Profiles, Home, Settings...)
└── types.ts              # shared TypeScript types
```

## Phase 2 hook (AI homework → mini-quest)

`src/engine/challenge/registry.ts` exposes `register(def)` and
`unregister(id)`. A future `ChallengeFactory(prompt, lang)` produces a
`ChallengeSpec` (the same JSON shape the MVP primitives already consume)
and registers a dynamic `ChallengeDef`. No engine changes needed — the
runtime already handles all five `kind`s (`match` / `pick` / `sort` /
`order`, with `trace` planned).

## Roadmap

- **M1** — App shell: i18n, profiles, accessibility, narrator, routing ✅
- **M2** — Overworld + Letterglade end-to-end (3 challenges) ✅
- **M3** — Four more regions × 3 challenges (15 total), sticker book,
  Spark closet ✅
- **M4** — Polish: Playwright happy-path, age-picker mood previews,
  pre-recorded narration, install prompt ⏳ (in progress)
- **Beyond MVP** — additional age groups, AI homework feature, cloud
  sync for teacher dashboards
