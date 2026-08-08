import { useCallback, useState } from "react";
import Board from "./Board";
import Keyboard from "./Keyboard";
import PhotoCard from "./PhotoCard";
import StatsModal from "./StatsModal";
import { useWordleRound } from "../hooks/useWordleRound";
import { isValidWord } from "../utils/dictionary";
import { getRandomYoutuber, decideTrick, createRound } from "../utils/youtubers";

const STATS_KEY = "wordflex-youtuber-stats";

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

export default function YoutuberGame({ onExit }) {
  const [stats, setStats] = useState(readStats);
  const [showStats, setShowStats] = useState(false);
  const [roundInfo, setRoundInfo] = useState({ youtuber: null, trick: false });

  const getSolution = useCallback(async () => {
    const youtuber = getRandomYoutuber();
    const trick = decideTrick();
    const { solution } = createRound(youtuber, trick);
    setRoundInfo({ youtuber, trick });
    return solution;
  }, []);

  const handleFinish = useCallback(({ won, guesses }) => {
    const next = { ...stats };
    next.played += 1;

    if (won) {
      next.wins += 1;
      next.streak += 1;
      next.maxStreak = Math.max(next.maxStreak, next.streak);
      next.distribution[guesses.length - 1] += 1;
    } else {
      next.streak = 0;
    }

    setStats(next);
    saveStats(next);
    setShowStats(won);
  }, [stats]);

  const round = useWordleRound({
    getSolution,
    isValid: isValidWord,
    onFinish: handleFinish
  });

  const { youtuber, trick } = roundInfo;
  const wordLength = youtuber?.word.length ?? 5;

  const startNewRound = () => {
    setShowStats(false);
    round.newRound();
  };

  return (
    <section className="game">
      <header className="game-header">
        <button className="icon-button" onClick={onExit} aria-label="Back to setup">←</button>
        <div>
          <p className="eyebrow">WORD FLEX</p>
          <h1>Guess the YouTuber</h1>
        </div>
        <button className="icon-button" onClick={() => setShowStats(true)} aria-label="Statistics">▥</button>
      </header>

      <div className="status" aria-live="polite">
        {round.message || "\u00A0"}
      </div>

      {youtuber && <PhotoCard youtuber={youtuber} />}

      {youtuber && (
        <Board
          guesses={round.guesses}
          currentGuess={round.currentGuess}
          wordLength={wordLength}
          invalid={round.invalid}
        />
      )}

      {round.gameOver && (
        <div className={`result-banner ${round.won ? "success" : "failure"}`}>
          <strong>{round.won ? "You got it!" : "Better luck next time."}</strong>
          <span>
            {trick
              ? <>Tricked you — the answer was <b>{round.solution}</b>, not {youtuber.name}.</>
              : <>The answer was <b>{round.solution}</b> — it was {youtuber.name}!</>}
          </span>
        </div>
      )}

      <Keyboard letterStates={round.keyboard} onKeyPress={round.handleKey} />

      <div className="game-actions">
        <button className="secondary-button" onClick={startNewRound}>New round</button>
        <button className="secondary-button" onClick={() => setShowStats(true)}>Stats</button>
      </div>

      {showStats && (
        <StatsModal stats={stats} onClose={() => setShowStats(false)} />
      )}
    </section>
  );
}
