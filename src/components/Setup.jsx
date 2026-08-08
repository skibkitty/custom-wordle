import { useState } from "react";

const LENGTHS = Array.from({ length: 8 }, (_, i) => i + 3);

const MODES = [
  { id: "classic", label: "Classic", description: "Solve a hidden dictionary word." },
  { id: "youtuber", label: "Guess the YouTuber", description: "The answer may or may not be this creator's name." }
];

export default function Setup({ onStart }) {
  const [mode, setMode] = useState("classic");
  const [length, setLength] = useState(5);

  const start = () => {
    onStart({ mode, wordLength: length });
  };

  return (
    <section className="setup card">
      <div className="brand-mark">W</div>
      <p className="eyebrow">A flexible Wordle-style game</p>
      <h1>WordFlex</h1>
      <p className="subtitle">
        {mode === "youtuber"
          ? "See a famous creator's photo. The hidden word is their name half the time — and a decoy word the other half. Solve it in six guesses."
          : "Pick a word length, then solve the hidden word in six guesses."}
      </p>

      <div className="mode-picker" role="group" aria-label="Game mode">
        {MODES.map((item) => (
          <button
            key={item.id}
            className={`mode-button ${mode === item.id ? "selected" : ""}`}
            onClick={() => setMode(item.id)}
            aria-pressed={mode === item.id}
          >
            <span className="mode-label">{item.label}</span>
            <span className="mode-description">{item.description}</span>
          </button>
        ))}
      </div>

      {mode === "classic" && (
        <div className="length-picker" aria-label="Word length">
          {LENGTHS.map((value) => (
            <button
              key={value}
              className={`length-button ${length === value ? "selected" : ""}`}
              onClick={() => setLength(value)}
              aria-pressed={length === value}
            >
              {value}
            </button>
          ))}
        </div>
      )}

      <button className="primary-button start-button" onClick={start}>
        {mode === "youtuber" ? "Start YouTuber game" : `Start ${length}-letter game`}
      </button>

      <div className="rules">
        <div><span className="rule-dot green" /> Correct letter, correct spot</div>
        <div><span className="rule-dot yellow" /> Correct letter, wrong spot</div>
        <div><span className="rule-dot gray" /> Letter is not in the word</div>
      </div>
    </section>
  );
}
