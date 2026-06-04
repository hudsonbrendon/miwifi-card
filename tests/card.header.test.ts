import { describe, it, expect } from "vitest";
import "../src/miwifi-card";
import { CARD_NAME } from "../src/const";
import { mockHass, type MockHassOpts } from "./fixtures/hass";
import type { MiWiFiCardConfig } from "../src/types";

interface CardEl extends HTMLElement {
  setConfig(c: MiWiFiCardConfig): void;
  hass: ReturnType<typeof mockHass>;
  updateComplete: Promise<boolean>;
}

async function mount(config: Partial<MiWiFiCardConfig>, hassOpts: MockHassOpts = {}): Promise<CardEl> {
  const c = document.createElement(CARD_NAME) as CardEl;
  c.setConfig({ type: `custom:${CARD_NAME}`, ...config } as MiWiFiCardConfig);
  c.hass = mockHass({ prefix: "mw", ...hassOpts });
  document.body.appendChild(c);
  await c.updateComplete;
  return c;
}

describe("header", () => {
  it("shows formatted download and upload rates", async () => {
    const c = await mount({ entity: "mw" });
    const text = c.shadowRoot?.querySelector(".header")?.textContent ?? "";
    expect(text).toContain("1.5 MB/s"); // download 1572864 B/s
    expect(text).toContain("512.0 KB/s"); // upload 524288 B/s
    c.remove();
  });

  it("shows the connected devices count", async () => {
    const c = await mount({ entity: "mw" }, { connected_devices: "9" });
    const devices = c.shadowRoot?.querySelector(".header-item.devices")?.textContent ?? "";
    expect(devices).toContain("9");
    c.remove();
  });

  it("adds led-on class when the status LED is on", async () => {
    const c = await mount({ entity: "mw" }, { led: "on" });
    expect(c.shadowRoot?.querySelector(".header-item.led")?.classList.contains("led-on")).toBe(true);
    c.remove();
  });

  it("does not add led-on class when the status LED is off", async () => {
    const c = await mount({ entity: "mw" }, { led: "off" });
    expect(c.shadowRoot?.querySelector(".header-item.led")?.classList.contains("led-on")).toBe(false);
    c.remove();
  });
});
