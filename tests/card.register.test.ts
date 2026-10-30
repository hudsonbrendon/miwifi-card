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

describe("customCards metadata", () => {
  interface Entry {
    type: string;
    documentationURL?: string;
    getEntitySuggestion?: (hass: unknown, id: string) => unknown;
  }
  const entry = (window as Window & { customCards?: Entry[] }).customCards!.find((c) => c.type === CARD_NAME)!;
  const hass = {
    states: {},
    locale: { language: "en" },
    callService: () => Promise.resolve(),
    entities: {
      "binary_sensor.redmi_ax6000_wan_link": { entity_id: "binary_sensor.redmi_ax6000_wan_link", platform: "ha_miwifi", translation_key: "wan_link", device_id: "d1" },
      "sensor.redmi_ax6000_download_speed": { entity_id: "sensor.redmi_ax6000_download_speed", platform: "ha_miwifi", translation_key: "download_speed", device_id: "d1" },
      "sensor.other": { entity_id: "sensor.other", platform: "mqtt" },
    },
  };

  it("has a documentation URL", () => {
    expect(entry.documentationURL).toMatch(/github\.com\/hudsonbrendon\/miwifi-card/);
  });

  it("suggests the card for the ha_miwifi WAN link entity only", () => {
    expect(entry.getEntitySuggestion!(hass, "binary_sensor.redmi_ax6000_wan_link")).toEqual({
      config: { type: `custom:${CARD_NAME}`, entity: "redmi_ax6000" },
    });
    expect(entry.getEntitySuggestion!(hass, "sensor.redmi_ax6000_download_speed")).toBeNull();
    expect(entry.getEntitySuggestion!(hass, "sensor.other")).toBeNull();
  });
});
