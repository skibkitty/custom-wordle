import { useState } from "react";

const LENGTHS = Array.from({ length: 8 }, (_, i) => i + 3);

export default function Setup({ onStart }) {
  const [length, setLength] = useState(5);

  return (
    <section className="setup card">
      <div className="brand-mark">W</div>
      <p className="eyebrow">A flexible Wordle-style game</p>
      <h1>WordFlex</h1>
      <p className="subtitle">
        Pick a word length, then solve the hidden word in six guesses.
      </p>

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

      <button className="primary-button start-button" onClick={() => onStart(length)}>
        Start {length}-letter game
      </button>

      <div className="rules">
        <div><span className="rule-dot green" /> Correct letter, correct spot</div>
        <div><span className="rule-dot yellow" /> Correct letter, wrong spot</div>
        <div><span className="rule-dot gray" /> Letter is not in the word</div>
      </div>
    </section>
  );
}