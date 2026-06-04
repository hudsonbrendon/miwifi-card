import { describe, it, expect } from "vitest";
import "../src/miwifi-card";
import { CARD_NAME } from "../src/const";
import type { EntityRegistryEntry, HassObject, MiWiFiCardConfig } from "../src/types";

interface CardEl extends HTMLElement {
  setConfig(c: MiWiFiCardConfig): void;
  hass: HassObject & { _calls: Array<Record<string, unknown>> };
  updateComplete: Promise<boolean>;
}

// A pt-BR Home Assistant: entity_ids are Portuguese, but platform +
// translation_key let the card resolve them with just `entity: miwifi`.
function ptBrHass(prefix = "miwifi") {
  const reg: Array<[string, string, string]> = [
    [`sensor.${prefix}_velocidade_de_download`, "download_speed", "1572864"],
    [`sensor.${prefix}_velocidade_de_upload`, "upload_speed", "524288"],
    [`sensor.${prefix}_dispositivos_conectados`, "client_count", "9"],
    [`sensor.${prefix}_clientes_5_ghz`, "clients_5g", "4"],
    [`binary_sensor.${prefix}_link_wan`, "wan_link", "on"],
    [`binary_sensor.${prefix}_led_de_status`, "led", "on"],
    [`sensor.${prefix}_tipo_de_wan`, "wan_type", "pppoe"],
    [`switch.${prefix}_wi_fi_24_ghz`, "wifi_24g", "on"],
    [`switch.${prefix}_wi_fi_5_ghz`, "wifi_5g", "on"],
    [`button.${prefix}_reiniciar`, "reboot", "unknown"],
    [`button.${prefix}_executar_teste_de_velocidade`, "speed_test", "unknown"],
  ];
  const states: HassObject["states"] = {};
  const entities: Record<string, EntityRegistryEntry> = {};
  for (const [entity_id, translation_key, state] of reg) {
    states[entity_id] = { entity_id, state, attributes: {} };
    entities[entity_id] = { entity_id, platform: "ha_miwifi", translation_key };
  }
  const calls: Array<Record<string, unknown>> = [];
  return {
    states,
    entities,
    locale: { language: "pt-BR" },
    _calls: calls,
    callService(domain: string, service: string, service_data?: Record<string, unknown>, target?: Record<string, unknown>) {
      calls.push({ domain, service, service_data, target });
      return Promise.resolve();
    },
  } as CardEl["hass"];
}

async function mount(): Promise<CardEl> {
  const c = document.createElement(CARD_NAME) as CardEl;
  c.setConfig({ type: `custom:${CARD_NAME}`, entity: "miwifi", name: "MiWiFi" });
  c.hass = ptBrHass();
  document.body.appendChild(c);
  await c.updateComplete;
  return c;
}

describe("registry-driven resolution end to end (pt-BR instance)", () => {
  it("renders live rates resolved from Portuguese entity_ids", async () => {
    const c = await mount();
    const header = c.shadowRoot?.querySelector(".header")?.textContent ?? "";
    expect(header).toContain("1.5 MB/s");
    expect(header).toContain("512.0 KB/s");
    c.remove();
  });

  it("marks the hero online from binary_sensor.miwifi_link_wan", async () => {
    const c = await mount();
    expect(c.shadowRoot?.querySelector(".hero")?.classList.contains("online")).toBe(true);
    c.remove();
  });

  it("reboot dispatches button.press to the pt-BR reboot button", async () => {
    const c = await mount();
    const origConfirm = window.confirm;
    window.confirm = () => true;
    (c.shadowRoot?.querySelector(".tool.reboot") as HTMLButtonElement).click();
    await c.updateComplete;
    window.confirm = origConfirm;
    expect(c.hass._calls[0]).toEqual({
      domain: "button",
      service: "press",
      service_data: { entity_id: "button.miwifi_reiniciar" },
      target: undefined,
    });
    c.remove();
  });

  it("2.4 GHz toggle targets the pt-BR switch entity_id", async () => {
    const c = await mount();
    (c.shadowRoot?.querySelector(".tool.wifi24") as HTMLButtonElement).click();
    await c.updateComplete;
    expect(c.hass._calls[0]).toEqual({
      domain: "switch",
      service: "toggle",
      service_data: { entity_id: "switch.miwifi_wi_fi_24_ghz" },
      target: undefined,
    });
    c.remove();
  });
});
