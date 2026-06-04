import { describe, it, expect } from "vitest";
import "../src/miwifi-card";
import { CARD_NAME } from "../src/const";

describe("registration", () => {
  it("defines the custom element", () => {
    expect(customElements.get(CARD_NAME)).toBeTruthy();
  });

  it("registers the card in window.customCards", () => {
    interface W extends Window {
      customCards?: Array<{ type: string }>;
    }
    const w = window as W;
    expect(w.customCards?.some((c) => c.type === CARD_NAME)).toBe(true);
  });
});
