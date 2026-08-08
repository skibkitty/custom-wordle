# WordFlex

A polished Wordle-style React/Vite game with configurable word length.

## Features

- 3–10 letter games
- Physical keyboard and on-screen keyboard
- Dictionary validation via `an-array-of-english-words`
- Green/yellow/gray Wordle-style scoring
- Duplicate-letter-aware scoring
- Flip and invalid-word animations
- Win/loss screen
- Local statistics and streak tracking
- Responsive/mobile-friendly UI
- New game and restart controls
- **Guess the YouTuber mode** — a YouTuber photo is shown; the answer is that
  creator's name 50% of the time, or a decoy dictionary word 50% of the time.

## Guess the YouTuber

Pick this mode on the setup screen. You'll see a YouTuber's photo and a hint:
the hidden word may or may not be that person's name. The word length is set
automatically from the chosen creator's name.

- The answer is the YouTuber's name, or a random decoy word of the same length
  (each 50/50, decided per round).
- On win or loss, the banner reveals the answer and whether the photo was the
  real clue or a trick.
- Stats are tracked separately from classic mode.

### Editing the roster

The available YouTubers live in `src/data/youtubers.json`. Add or remove
entries there to change the roster. Each entry needs:

```json
{
  "name": "MrBeast",
  "word": "BEAST",
  "image": "/images/youtubers/mrbeast.jpg",
  "channel": "@MrBeast"
}
```

Requirements: `word` must be a valid English word (it's the possible answer),
3–10 letters, unique, and `image` must point to a file in
`public/images/youtubers/`. Run `npm test` after editing — the data-integrity
test checks all of this for you.

## Agent handoff

Agents: read `AGENTS.md` first. It documents the architecture, conventions,
branch policy, and a live status checklist for in-progress work.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints in the terminal.

## Production build

```bash
npm run build
npm run preview
```

## Notes

The dictionary package supplies valid English words. The game filters candidate answers by the selected length. Because the package is a broad English dictionary, some generated answers may be uncommon words. For a more curated game later, add a separate answer list while keeping the package as the allowed-guess dictionary.
