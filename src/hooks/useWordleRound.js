import { useCallback, useEffect, useState } from "react";
import { scoreGuess } from "../utils/dictionary";

const MAX_GUESSES = 6;

export function useWordleRound({ getSolution, isValid, onFinish }) {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [message, setMessage] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [keyboard, setKeyboard] = useState({});

  const newRound = useCallback(async () => {
    setSolution("");
    setGuesses([]);
    setCurrentGuess("");
    setMessage("Loading word…");
    setInvalid(false);
    setGameOver(false);
    setWon(false);
    setKeyboard({});

    const answer = await getSolution();
    setSolution(answer);
    setMessage("");
  }, [getSolution]);

  useEffect(() => {
    newRound();
  }, [newRound]);

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

  const finish = useCallback(
    (didWin, finalGuesses) => {
      setWon(didWin);
      setGameOver(true);
      onFinish({ won: didWin, guesses: finalGuesses, solution });
    },
    [onFinish, solution]
  );

  const submitGuess = useCallback(() => {
    if (gameOver || !solution) return;

    const guess = currentGuess.toUpperCase();

    if (guess.length !== solution.length) {
      setMessage(`Your guess needs ${solution.length} letters.`);
      setInvalid(true);
      window.setTimeout(() => setInvalid(false), 500);
      return;
    }

    if (!isValid(guess)) {
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
  }, [currentGuess, finish, gameOver, guesses, isValid, solution]);

  const handleKey = useCallback(
    (key) => {
      if (gameOver) return;

      if (key === "ENTER") {
        submitGuess();
        return;
      }

      if (key === "BACKSPACE") {
        setCurrentGuess((value) => value.slice(0, -1));
        return;
      }

      if (/^[A-Z]$/.test(key) && currentGuess.length < solution.length) {
        setCurrentGuess((value) => value + key);
      }
    },
    [currentGuess.length, gameOver, solution.length, submitGuess]
  );

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleKey("ENTER");
      } else if (event.key === "Backspace") {
        event.preventDefault();
        handleKey("BACKSPACE");
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        handleKey(event.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKey]);

  return {
    solution,
    guesses,
    currentGuess,
    message,
    invalid,
    gameOver,
    won,
    keyboard,
    newRound,
    handleKey
  };
}
