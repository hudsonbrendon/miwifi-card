import { describe, it, expect } from "vitest";
import "../src/miwifi-card";
import { CARD_NAME } from "../src/const";
import type { MiWiFiCardConfig } from "../src/types";

interface CardEl extends HTMLElement {
  setConfig(c: MiWiFiCardConfig): void;
}

function el(): CardEl {
  return document.createElement(CARD_NAME) as CardEl;
}

describe("setConfig", () => {
  it("accepts a device prefix", () => {
    const c = el();
    expect(() => c.setConfig({ type: `custom:${CARD_NAME}`, entity: "mw" })).not.toThrow();
  });

  it("accepts an entities map with at least wan_link + download_speed", () => {
    const c = el();
    expect(() =>
      c.setConfig({
        type: `custom:${CARD_NAME}`,
        entities: { wan_link: "binary_sensor.x_wan_link", download_speed: "sensor.x_dl" },
      })
    ).not.toThrow();
  });

  it("throws when neither prefix nor minimal entities provided", () => {
    const c = el();
    expect(() => c.setConfig({ type: `custom:${CARD_NAME}` })).toThrow(/missing required entity/i);
  });

  it("throws when stats has more than 4 items", () => {
    const c = el();
    expect(() =>
      c.setConfig({
        type: `custom:${CARD_NAME}`,
        entity: "mw",
        stats: Array(5).fill({ entity: "sensor.x", subtitle: "x" }),
      })
    ).toThrow(/at most 4/i);
  });
});
