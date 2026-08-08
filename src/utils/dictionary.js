import words from "an-array-of-english-words";

const dictionary = words
  .map((word) => word.toUpperCase())
  .filter((word) => /^[A-Z]+$/.test(word));

const dictionarySet = new Set(dictionary);

const wordsByLength = new Map();

for (const word of dictionary) {
  if (!wordsByLength.has(word.length)) wordsByLength.set(word.length, []);
  wordsByLength.get(word.length).push(word);
}

export function isValidWord(word) {
  return dictionarySet.has(word.toUpperCase());
}

export function getWordsByLength(length) {
  return wordsByLength.get(Number(length)) ?? [];
}

export function getRandomAnswer(length) {
  const candidates = getWordsByLength(length);

  if (!candidates.length) {
    throw new Error(`No dictionary words found with ${length} letters.`);
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function scoreGuess(guess, solution) {
  const result = Array.from({ length: solution.length });
  const remaining = solution.split("");

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === solution[i]) {
      result[i] = { letter: guess[i], color: "green" };
      remaining[i] = null;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i]) continue;

    const match = remaining.indexOf(guess[i]);

    if (match !== -1) {
      result[i] = { letter: guess[i], color: "yellow" };
      remaining[match] = null;
    } else {
      result[i] = { letter: guess[i], color: "gray" };
    }
  }

  return result;
}