import { describe, it, expect } from "vitest";
import { cardStyles } from "../src/styles";

describe("cardStyles", () => {
  const text = cardStyles.cssText;

  it("defines the three animation keyframes", () => {
    expect(text).toContain("@keyframes mw-wave");
    expect(text).toContain("@keyframes mw-led");
    expect(text).toContain("@keyframes mw-data-down");
    expect(text).toContain("@keyframes mw-data-up");
  });

  it("only animates waves/leds/dots when the hero is online", () => {
    expect(text).toContain(".hero.online .mw-wave");
    expect(text).toContain(".hero.online .mw-led");
    expect(text).toContain(".hero.online .mw-dot");
  });

  it("disables animation under reduced motion", () => {
    expect(text).toContain("prefers-reduced-motion");
  });
});
