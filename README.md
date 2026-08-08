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
