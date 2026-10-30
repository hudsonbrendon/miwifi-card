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

describe("sizing and editor", () => {
  it("getGridOptions shrinks in compact mode", () => {
    const c = el() as CardEl & { getGridOptions(): { rows: number; columns: number } };
    c.setConfig({ type: `custom:${CARD_NAME}`, entity: "mw" });
    expect(c.getGridOptions()).toMatchObject({ rows: 5, columns: 6 });
    c.setConfig({ type: `custom:${CARD_NAME}`, entity: "mw", compact: true });
    expect(c.getGridOptions().rows).toBe(3);
  });

  it("getConfigForm exposes an ha-form schema with labels", () => {
    const Card = customElements.get(CARD_NAME) as unknown as {
      getConfigForm(): { schema: Array<{ name: string }>; computeLabel(s: { name: string }): string };
      getConfigElement?: unknown;
    };
    const form = Card.getConfigForm();
    expect(form.schema.map((s) => s.name)).toContain("entity");
    expect(form.computeLabel({ name: "name" })).toBe("Name");
    expect(Card.getConfigElement).toBeUndefined();
  });
});
