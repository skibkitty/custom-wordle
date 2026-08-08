# AGENTS.md

Handoff documentation for AI agents working on this repo. If you are an agent
picking this project up, read this file first — especially the **Current Work**
section, which records exactly where the last agent stopped.

## Project overview

WordFlex is a polished Wordle-style game built with React 19 + Vite (plain JS,
no TypeScript). It has two game modes:

- **Classic** — pick a word length (3–10), solve a hidden dictionary word in six
  guesses.
- **Guess the YouTuber** — a YouTuber photo is shown. The hidden answer is the
  YouTuber's name 50% of the time, or a random decoy dictionary word of the same
  length 50% of the time. The photo is a red herring in the trick rounds.

Word validation and scoring come from the `an-array-of-english-words` package.
Stats are stored in `localStorage` (separate keys per mode).

## Commands

```bash
npm install    # install dependencies
npm run dev    # start Vite dev server
npm test       # run Vitest unit tests (adds dev deps)
npm run build  # production build
npm run preview  # preview production build
```

## Architecture

- `src/App.jsx` — top-level: holds mode + word length, renders Setup or a Game.
- `src/components/` — presentational components:
  - `Setup.jsx` — mode toggle + word-length picker.
  - `Game.jsx` — classic mode game screen.
  - `YoutuberGame.jsx` — YouTuber photo mode game screen.
  - `PhotoCard.jsx` — renders the YouTuber photo + hint caption.
  - `Board.jsx`, `Keyboard.jsx`, `StatsModal.jsx` — shared by both modes.
- `src/hooks/useWordleRound.js` — shared round state + guess/keyboard logic used
  by both game screens.
- `src/utils/dictionary.js` — dictionary loading, `isValidWord`, word list by
  length, `getRandomAnswer`, `scoreGuess`, `getRandomDecoy`.
- `src/utils/youtubers.js` — YouTuber roster logic (`getRandomYoutuber`,
  `pickDecoy`, `createRound`). Pure functions — no React here.
- `src/data/youtubers.json` — **the roster**. The only file you edit to change
  the available YouTubers. See "Editing the roster" below.
- `public/images/youtubers/` — locally bundled avatar images (offline-safe).
- `src/styles.css` — all styling (dark indigo theme).

Rule of thumb: game logic lives in pure utils/hooks; components stay thin and
presentational.

## Conventions

- Plain JavaScript + React. No TypeScript.
- **Do not add code comments unless explicitly asked.**
- Components live in `src/components/`, named `PascalCase.jsx`.
- Use the existing CSS class naming and the dark indigo theme (`#080b12` bg,
  indigo `#6366f1` accents, slate grays) in `src/styles.css`.
- Keep stats in `localStorage`; classic mode uses `wordflex-stats`,
  YouTuber mode uses `wordflex-youtuber-stats`.
- Preserve the Enter/Backspace button-focus fix in the keydown listener
  (`event.preventDefault()` before `handleKey`).

## Editing the roster (YouTubers)

`src/data/youtubers.json` is an array of objects:

```json
{
  "name": "MrBeast",
  "word": "BEAST",
  "image": "/images/youtubers/mrbeast.jpg",
  "channel": "@MrBeast"
}
```

Rules (enforced by `src/utils/youtubers.test.js` data-integrity test):

- `word` must exist in the game dictionary (`isValidWord`) and be 3–10 letters.
  These are the answer words, so they must be real words.
- `name` and `word` must be unique across the roster.
- `image` must reference an existing file in `public/images/youtubers/`.

To add a creator: drop an image in `public/images/youtubers/`, add one JSON
entry, run `npm test` to confirm it passes.

## Branch policy

- Feature branches only. **Never commit to or push `main` directly.**
- Record the active branch under "Current Work".

## Current Work — Status Checklist

Feature: **Guess the YouTuber mode** — branch `feature/youtuber-photo-mode`.

- [x] Create feature branch off main
- [x] Write AGENTS.md + README updates (baseline docs)
- [x] Create `src/data/youtubers.json` roster (placeholder entries — owner will
      replace with real creators and their images later)
- [x] Generate placeholder SVG avatars into `public/images/youtubers/`
- [x] Add `getRandomDecoy` to `src/utils/dictionary.js`
- [x] Create `src/utils/youtubers.js` pickers + 50/50 logic
- [x] Extract `src/hooks/useWordleRound.js` shared hook
- [x] Extract `StatsModal`, refactor `Game.jsx` onto the hook
- [x] Create `YoutuberGame.jsx` + `PhotoCard.jsx`
- [x] Wire `Setup.jsx` mode toggle + `App.jsx` + styles
- [x] Add Vitest tests (decoy, 50/50, data integrity, smoke)
- [x] Verify: `npm test` (14 passing), `npm run build`, preview smoke check
- [ ] Owner: manual QA in browser (`npm run dev`) + swap placeholder roster for
      real creators (see README "Editing the roster")

**Done so far:** feature fully implemented and verified — `npm test` passes
(14 tests), production build succeeds, and the preview server serves the app
and avatars correctly. Classic mode was refactored onto the shared
`useWordleRound` hook with no behavior change. The roster contains 12
placeholder creators (fictional channel names built around valid dictionary
words, e.g. "Nova Quest" → NOVA) with generated SVG avatars.

**Next action:** none required — the owner will manually QA in the browser and
replace the placeholder roster with real YouTubers and their images.

**How to update this file:** after each milestone, tick the boxes above, refresh
"Done so far", and set "Next action". A new agent starts from "Next action".
