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

describe("hero", () => {
  it("marks hero online when wan_link is on", async () => {
    const c = await mount({ entity: "mw" }, { wan_link: "on" });
    expect(c.shadowRoot?.querySelector(".hero")?.classList.contains("online")).toBe(true);
    c.remove();
  });

  it("marks hero offline when wan_link is off", async () => {
    const c = await mount({ entity: "mw" }, { wan_link: "off" });
    const hero = c.shadowRoot?.querySelector(".hero");
    expect(hero?.classList.contains("offline")).toBe(true);
    expect(hero?.classList.contains("online")).toBe(false);
    c.remove();
  });

  it("marks hero unavailable when wan_link is unavailable", async () => {
    const c = await mount({ entity: "mw" }, { unavailable: ["binary_sensor.mw_wan_link"] });
    expect(c.shadowRoot?.querySelector(".hero")?.classList.contains("unavailable")).toBe(true);
    c.remove();
  });

  it("adds busy class when there is measurable traffic", async () => {
    const c = await mount({ entity: "mw" }, { wan_link: "on", download_speed: "2000000" });
    expect(c.shadowRoot?.querySelector(".hero")?.classList.contains("busy")).toBe(true);
    c.remove();
  });

  it("is not busy when traffic is near zero", async () => {
    const c = await mount({ entity: "mw" }, { wan_link: "on", download_speed: "0", upload_speed: "0" });
    expect(c.shadowRoot?.querySelector(".hero")?.classList.contains("busy")).toBe(false);
    c.remove();
  });
});
