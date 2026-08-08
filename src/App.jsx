import { useState } from "react";
import Setup from "./components/Setup";
import Game from "./components/Game";
import YoutuberGame from "./components/YoutuberGame";

export default function App() {
  const [config, setConfig] = useState(null);

  return (
    <main className="app-shell">
      {config === null ? (
        <Setup onStart={setConfig} />
      ) : config.mode === "youtuber" ? (
        <YoutuberGame onExit={() => setConfig(null)} />
      ) : (
        <Game wordLength={config.wordLength} onExit={() => setConfig(null)} />
      )}
    </main>
  );
}
