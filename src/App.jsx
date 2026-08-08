import { useState } from "react";
import Setup from "./components/Setup";
import Game from "./components/Game";

export default function App() {
  const [wordLength, setWordLength] = useState(null);

  return (
    <main className="app-shell">
      {wordLength === null ? (
        <Setup onStart={setWordLength} />
      ) : (
        <Game wordLength={wordLength} onExit={() => setWordLength(null)} />
      )}
    </main>
  );
}