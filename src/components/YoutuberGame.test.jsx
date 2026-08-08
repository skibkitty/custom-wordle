import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import YoutuberGame from "./YoutuberGame";

describe("YoutuberGame", () => {
  it("renders the game header", async () => {
    render(<YoutuberGame onExit={() => {}} />);
    await screen.findByRole("img");
    expect(screen.getByText("Guess the YouTuber")).toBeTruthy();
  });

  it("shows a creator photo once the round loads", async () => {
    render(<YoutuberGame onExit={() => {}} />);
    const img = await screen.findByRole("img");
    expect(img).toBeTruthy();
    expect(img.getAttribute("alt")).toBeTruthy();
  });

  it("shows the hint text", async () => {
    render(<YoutuberGame onExit={() => {}} />);
    expect(await screen.findByText(/may or may not be their name/)).toBeTruthy();
  });
});
