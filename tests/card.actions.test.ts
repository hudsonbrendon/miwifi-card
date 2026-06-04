import { describe, it, expect, vi } from "vitest";
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

describe("toolbar actions", () => {
  it("renders reboot, speedtest, and two wifi toggles by default", async () => {
    const c = await mount({ entity: "mw" });
    expect(c.shadowRoot?.querySelector(".tool.reboot")).not.toBeNull();
    expect(c.shadowRoot?.querySelector(".tool.speedtest")).not.toBeNull();
    expect(c.shadowRoot?.querySelector(".tool.wifi24")).not.toBeNull();
    expect(c.shadowRoot?.querySelector(".tool.wifi5")).not.toBeNull();
    c.remove();
  });

  it("speedtest presses button.mw_run_speed_test", async () => {
    const c = await mount({ entity: "mw" });
    (c.shadowRoot?.querySelector(".tool.speedtest") as HTMLButtonElement).click();
    await c.updateComplete;
    expect(c.hass._calls[0]).toEqual({
      domain: "button",
      service: "press",
      service_data: { entity_id: "button.mw_run_speed_test" },
      target: undefined,
    });
    c.remove();
  });

  it("reboot asks for confirmation and presses button.mw_reboot when confirmed", async () => {
    const c = await mount({ entity: "mw" });
    const orig = window.confirm;
    window.confirm = vi.fn(() => true);
    (c.shadowRoot?.querySelector(".tool.reboot") as HTMLButtonElement).click();
    await c.updateComplete;
    window.confirm = orig;
    expect(c.hass._calls[0]).toEqual({
      domain: "button",
      service: "press",
      service_data: { entity_id: "button.mw_reboot" },
      target: undefined,
    });
    c.remove();
  });

  it("reboot does nothing when confirmation is declined", async () => {
    const c = await mount({ entity: "mw" });
    const orig = window.confirm;
    window.confirm = vi.fn(() => false);
    (c.shadowRoot?.querySelector(".tool.reboot") as HTMLButtonElement).click();
    await c.updateComplete;
    window.confirm = orig;
    expect(c.hass._calls).toHaveLength(0);
    c.remove();
  });

  it("wifi toggle calls switch.toggle on switch.mw_2_4_ghz_wi_fi", async () => {
    const c = await mount({ entity: "mw" });
    (c.shadowRoot?.querySelector(".tool.wifi24") as HTMLButtonElement).click();
    await c.updateComplete;
    expect(c.hass._calls[0]).toEqual({
      domain: "switch",
      service: "toggle",
      service_data: { entity_id: "switch.mw_2_4_ghz_wi_fi" },
      target: undefined,
    });
    c.remove();
  });

  it("marks a wifi toggle active when its switch is on", async () => {
    const c = await mount({ entity: "mw" }, { wifi_5g: "on", wifi_24g: "off" });
    expect(c.shadowRoot?.querySelector(".tool.wifi5")?.classList.contains("active-radio")).toBe(true);
    expect(c.shadowRoot?.querySelector(".tool.wifi24")?.classList.contains("active-radio")).toBe(false);
    c.remove();
  });

  it("custom actions override the defaults", async () => {
    const c = await mount({
      entity: "mw",
      actions: [{ service: "scene.turn_on", service_data: { entity_id: "scene.x" }, icon: "mdi:home", name: "Scene" }],
    });
    const tools = c.shadowRoot?.querySelectorAll(".tool-group:first-child .tool");
    expect(tools?.length).toBe(1);
    (tools![0] as HTMLButtonElement).click();
    await c.updateComplete;
    expect(c.hass._calls[0].domain).toBe("scene");
    expect(c.hass._calls[0].service).toBe("turn_on");
    c.remove();
  });
});
