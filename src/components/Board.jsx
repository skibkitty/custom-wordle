const MAX_GUESSES = 6;

export default function Board({ guesses, currentGuess, wordLength, invalid }) {
  return (
    <div className="board" aria-label="Game board">
      {Array.from({ length: MAX_GUESSES }, (_, row) => {
        const submitted = guesses[row];
        const active = row === guesses.length;

        return (
          <div className={`row ${active && invalid ? "shake" : ""}`} key={row} style={{ "--word-length": wordLength }}>
            {Array.from({ length: wordLength }, (_, col) => {
              const tile = submitted?.[col];
              const letter = tile?.letter ?? (active ? currentGuess[col] ?? "" : "");

              return (
                <div
                  className={`tile ${tile?.color ?? ""} ${submitted ? "revealed" : ""}`}
                  style={{ animationDelay: submitted ? `${col * 90}ms` : "0ms" }}
                  key={col}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}