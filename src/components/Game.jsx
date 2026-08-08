import { useCallback, useEffect, useMemo, useState } from "react";
import Board from "./Board";
import Keyboard from "./Keyboard";
import {
  getRandomAnswer,
  isValidWord,
  scoreGuess,
  getWordsByLength
} from "../utils/dictionary";

const MAX_GUESSES = 6;
const STATS_KEY = "wordflex-stats";

const emptyStats = {
  played: 0,
  wins: 0,
  streak: 0,
  maxStreak: 0,
  distribution: [0, 0, 0, 0, 0, 0]
};

function readStats() {
  try {
    return { ...emptyStats, ...JSON.parse(localStorage.getItem(STATS_KEY)) };
  } catch {
    return emptyStats;
  }
}

function saveStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export default function Game({ wordLength, onExit }) {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [message, setMessage] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [keyboard, setKeyboard] = useState({});
  const [stats, setStats] = useState(readStats);
  const [showStats, setShowStats] = useState(false);

  const newRound = useCallback(async () => {
    setSolution("");
    setGuesses([]);
    setCurrentGuess("");
    setMessage("Loading word…");
    setInvalid(false);
    setGameOver(false);
    setWon(false);
    setKeyboard({});
    setShowStats(false);

    const answer = await getRandomAnswer(wordLength);
    setSolution(answer);
    setMessage("");
  }, [wordLength]);

  useEffect(() => {
    newRound();
  }, [newRound]);

  const usedLetters = useMemo(() => keyboard, [keyboard]);

  const updateKeyboard = (scored) => {
    setKeyboard((previous) => {
      const next = { ...previous };
      const rank = { gray: 1, yellow: 2, green: 3 };

      for (const tile of scored) {
        if (!next[tile.letter] || rank[tile.color] > rank[next[tile.letter]]) {
          next[tile.letter] = tile.color;
        }
      }
      return next;
    });
  };

  const finish = (didWin, finalGuesses) => {
    const next = { ...stats };
    next.played += 1;

    if (didWin) {
      next.wins += 1;
      next.streak += 1;
      next.maxStreak = Math.max(next.maxStreak, next.streak);
      next.distribution[finalGuesses.length - 1] += 1;
    } else {
      next.streak = 0;
    }

    setStats(next);
    saveStats(next);
    setWon(didWin);
    setGameOver(true);
    setShowStats(true);
  };

  const submitGuess = useCallback(() => {
    if (gameOver || !solution) return;

    const guess = currentGuess.toUpperCase();

    if (guess.length !== wordLength) {
      setMessage(`Your guess needs ${wordLength} letters.`);
      setInvalid(true);
      window.setTimeout(() => setInvalid(false), 500);
      return;
    }

    if (!isValidWord(guess)) {
      setMessage("Not in the word list.");
      setInvalid(true);
      window.setTimeout(() => setInvalid(false), 500);
      return;
    }

    const scored = scoreGuess(guess, solution);
    const nextGuesses = [...guesses, scored];

    updateKeyboard(scored);
    setGuesses(nextGuesses);
    setCurrentGuess("");
    setMessage("");

    if (guess === solution) {
      window.setTimeout(() => finish(true, nextGuesses), 850);
    } else if (nextGuesses.length === MAX_GUESSES) {
      window.setTimeout(() => finish(false, nextGuesses), 850);
    }
  }, [currentGuess, finish, gameOver, guesses, solution, wordLength]);

  const handleKey = useCallback((key) => {
    if (gameOver) return;

    if (key === "ENTER") {
      submitGuess();
      return;
    }

    if (key === "BACKSPACE") {
      setCurrentGuess((value) => value.slice(0, -1));
      return;
    }

    if (/^[A-Z]$/.test(key) && currentGuess.length < wordLength) {
      setCurrentGuess((value) => value + key);
    }
  }, [currentGuess.length, gameOver, submitGuess, wordLength]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Enter") handleKey("ENTER");
      else if (event.key === "Backspace") handleKey("BACKSPACE");
      else if (/^[a-zA-Z]$/.test(event.key)) handleKey(event.key.toUpperCase());
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKey]);

  return (
    <section className="game">
      <header className="game-header">
        <button className="icon-button" onClick={onExit} aria-label="Back to setup">←</button>
        <div>
          <p className="eyebrow">WORD FLEX</p>
          <h1>{wordLength}-letter game</h1>
        </div>
        <button className="icon-button" onClick={() => setShowStats(true)} aria-label="Statistics">▥</button>
      </header>

      <div className="status" aria-live="polite">
        {message || "\u00A0"}
      </div>

      <Board
        guesses={guesses}
        currentGuess={currentGuess}
        wordLength={wordLength}
        invalid={invalid}
      />

      {gameOver && (
        <div className={`result-banner ${won ? "success" : "failure"}`}>
          <strong>{won ? "You got it!" : "Better luck next time."}</strong>
          <span>The word was <b>{solution}</b></span>
        </div>
      )}

      <Keyboard letterStates={usedLetters} onKeyPress={handleKey} />

      <div className="game-actions">
        <button className="secondary-button" onClick={newRound}>New word</button>
        <button className="secondary-button" onClick={() => setShowStats(true)}>Stats</button>
      </div>

      {showStats && (
        <StatsModal stats={stats} onClose={() => setShowStats(false)} />
      )}
    </section>
  );
}

function StatsModal({ stats, onClose }) {
  const best = Math.max(...stats.distribution, 1);

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="stats-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <p className="eyebrow">YOUR PROGRESS</p>
        <h2>Statistics</h2>

        <div className="stat-grid">
          <div><strong>{stats.played}</strong><span>Played</span></div>
          <div><strong>{stats.played ? Math.round((stats.wins / stats.played) * 100) : 0}%</strong><span>Win rate</span></div>
          <div><strong>{stats.streak}</strong><span>Streak</span></div>
          <div><strong>{stats.maxStreak}</strong><span>Best streak</span></div>
        </div>

        <h3>Guess distribution</h3>
        <div className="distribution">
          {stats.distribution.map((count, index) => (
            <div className="distribution-row" key={index}>
              <span>{index + 1}</span>
              <div className="bar-track">
                <div className="bar" style={{ width: `${Math.max((count / best) * 100, count ? 8 : 0)}%` }}>
                  {count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}