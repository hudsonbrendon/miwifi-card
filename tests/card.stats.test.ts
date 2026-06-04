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

describe("stats", () => {
  it("renders four default stats", async () => {
    const c = await mount({ entity: "mw" });
    const stats = c.shadowRoot?.querySelectorAll(".stat");
    expect(stats?.length).toBe(4);
    c.remove();
  });

  it("formats the download stat as a rate", async () => {
    const c = await mount({ entity: "mw" }, { download_speed: "1572864" });
    const first = c.shadowRoot?.querySelector(".stat .stat-value")?.textContent ?? "";
    expect(first).toContain("1.5 MB/s");
    c.remove();
  });

  it("shows the connected devices count as a plain integer", async () => {
    const c = await mount({ entity: "mw" }, { connected_devices: "12" });
    const text = c.shadowRoot?.querySelector(".stats")?.textContent ?? "";
    expect(text).toContain("12");
    c.remove();
  });

  it("honors a custom stats config", async () => {
    const c = await mount({
      entity: "mw",
      stats: [{ entity: "sensor.mw_firmware_version", subtitle: "Firmware" }],
    });
    const stats = c.shadowRoot?.querySelectorAll(".stat");
    expect(stats?.length).toBe(1);
    expect(c.shadowRoot?.querySelector(".stat-value")?.textContent).toContain("1.0.84");
    expect(c.shadowRoot?.querySelector(".stat-label")?.textContent).toContain("Firmware");
    c.remove();
  });
});
