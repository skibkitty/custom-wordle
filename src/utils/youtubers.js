import roster from "../data/youtubers.json";
import { getRandomDecoy, isValidWord } from "./dictionary";

export const youtubers = roster;

export function getRandomYoutuber() {
  return youtubers[Math.floor(Math.random() * youtubers.length)];
}

export function decideTrick() {
  return Math.random() < 0.5;
}

export function pickDecoy(excluded) {
  return getRandomDecoy(excluded, excluded.length);
}

export function createRound(youtuber, trick) {
  return {
    youtuber,
    trick,
    solution: trick ? pickDecoy(youtuber.word) : youtuber.word
  };
}

export { isValidWord };
