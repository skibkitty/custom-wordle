import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import { youtubers, getRandomYoutuber, decideTrick, pickDecoy, createRound } from "./youtubers";
import { isValidWord } from "./dictionary";

const publicRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../public");

describe("roster data integrity", () => {
  it("has a non-empty roster", () => {
    expect(youtubers.length).toBeGreaterThan(0);
  });

  it("every entry is complete and shaped correctly", () => {
    for (const entry of youtubers) {
      expect(typeof entry.name).toBe("string");
      expect(typeof entry.word).toBe("string");
      expect(typeof entry.image).toBe("string");
      expect(typeof entry.channel).toBe("string");
      expect(entry.name.length).toBeGreaterThan(0);
    }
  });

  it("every word is a valid dictionary word of 3–10 letters", () => {
    for (const entry of youtubers) {
      expect(isValidWord(entry.word), `${entry.word} should be a valid word`).toBe(true);
      expect(entry.word.length).toBeGreaterThanOrEqual(3);
      expect(entry.word.length).toBeLessThanOrEqual(10);
    }
  });

  it("names and words are unique", () => {
    expect(new Set(youtubers.map((e) => e.name)).size).toBe(youtubers.length);
    expect(new Set(youtubers.map((e) => e.word)).size).toBe(youtubers.length);
  });

  it("every image file exists in public/images/youtubers", () => {
    for (const entry of youtubers) {
      const imagePath = path.join(publicRoot, entry.image);
      expect(existsSync(imagePath), `${entry.image} should exist on disk`).toBe(true);
    }
  });
});

describe("pickDecoy", () => {
  it("returns a dictionary word of the same length as the excluded word", () => {
    for (const entry of youtubers) {
      const decoy = pickDecoy(entry.word);
      expect(decoy).toHaveLength(entry.word.length);
      expect(isValidWord(decoy)).toBe(true);
    }
  });

  it("never returns the excluded word", () => {
    for (const entry of youtubers) {
      for (let i = 0; i < 50; i++) {
        expect(pickDecoy(entry.word)).not.toBe(entry.word);
      }
    }
  });
});

describe("createRound", () => {
  it("uses the creator's word when the round is not a trick", () => {
    const entry = youtubers[0];
    const round = createRound(entry, false);
    expect(round.youtuber).toBe(entry);
    expect(round.trick).toBe(false);
    expect(round.solution).toBe(entry.word);
  });

  it("uses a different dictionary word of the same length when tricked", () => {
    const entry = youtubers[0];
    const round = createRound(entry, true);
    expect(round.trick).toBe(true);
    expect(round.solution).not.toBe(entry.word);
    expect(isValidWord(round.solution)).toBe(true);
    expect(round.solution).toHaveLength(entry.word.length);
  });
});

describe("getRandomYoutuber", () => {
  it("always returns a member of the roster", () => {
    for (let i = 0; i < 100; i++) {
      expect(youtubers).toContain(getRandomYoutuber());
    }
  });
});

describe("decideTrick", () => {
  it("is a boolean", () => {
    for (let i = 0; i < 100; i++) {
      expect(typeof decideTrick()).toBe("boolean");
    }
  });
});
