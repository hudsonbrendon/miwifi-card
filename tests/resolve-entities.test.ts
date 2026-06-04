import { describe, it, expect } from "vitest";
import { resolveEntities } from "../src/helpers/resolve-entities";

describe("resolveEntities", () => {
  it("builds entity_ids from a device prefix using domain+suffix", () => {
    const r = resolveEntities({ type: "custom:miwifi-card", entity: "redmi_ax6000" });
    expect(r.download_speed).toBe("sensor.redmi_ax6000_download_speed");
    expect(r.wan_link).toBe("binary_sensor.redmi_ax6000_wan_link");
    expect(r.led).toBe("binary_sensor.redmi_ax6000_status_led");
    expect(r.wifi_24g).toBe("switch.redmi_ax6000_2_4_ghz_wi_fi");
    expect(r.wifi_5g).toBe("switch.redmi_ax6000_5_ghz_wi_fi");
    expect(r.reboot).toBe("button.redmi_ax6000_reboot");
    expect(r.speed_test).toBe("button.redmi_ax6000_run_speed_test");
  });

  it("lets entities overrides win over the prefix", () => {
    const r = resolveEntities({
      type: "custom:miwifi-card",
      entity: "redmi_ax6000",
      entities: { download_speed: "sensor.custom_down" },
    });
    expect(r.download_speed).toBe("sensor.custom_down");
    expect(r.upload_speed).toBe("sensor.redmi_ax6000_upload_speed");
  });

  it("returns empty strings when neither prefix nor override is set", () => {
    const r = resolveEntities({ type: "custom:miwifi-card" });
    expect(r.download_speed).toBe("");
    expect(r.wan_link).toBe("");
  });
});

// Registry-based resolution: language-independent, matches platform + translation_key.
// Modelled on a real pt-BR Home Assistant where entity_ids are Portuguese slugs.
function ptBrRegistry(prefix = "miwifi") {
  const e = (entity_id: string, translation_key: string) => ({
    [entity_id]: { entity_id, platform: "ha_miwifi", translation_key },
  });
  return {
    ...e(`sensor.${prefix}_velocidade_de_download`, "download_speed"),
    ...e(`sensor.${prefix}_velocidade_de_upload`, "upload_speed"),
    ...e(`sensor.${prefix}_dispositivos_conectados`, "client_count"),
    ...e(`sensor.${prefix}_clientes_24_ghz`, "clients_24g"),
    ...e(`sensor.${prefix}_clientes_5_ghz`, "clients_5g"),
    ...e(`sensor.${prefix}_nos_mesh`, "mesh_node_count"),
    ...e(`sensor.${prefix}_ip_wan`, "wan_ip"),
    ...e(`sensor.${prefix}_tipo_de_wan`, "wan_type"),
    ...e(`sensor.${prefix}_wan_conectado_desde`, "wan_uptime"),
    ...e(`sensor.${prefix}_versao_do_firmware`, "firmware_version"),
    ...e(`binary_sensor.${prefix}_link_wan`, "wan_link"),
    ...e(`binary_sensor.${prefix}_led_de_status`, "led"),
    ...e(`switch.${prefix}_wi_fi_24_ghz`, "wifi_24g"),
    ...e(`switch.${prefix}_wi_fi_5_ghz`, "wifi_5g"),
    ...e(`button.${prefix}_reiniciar`, "reboot"),
    ...e(`button.${prefix}_executar_teste_de_velocidade`, "speed_test"),
  };
}

describe("resolveEntities with the entity registry (any HA language)", () => {
  it("resolves pt-BR entity_ids by platform + translation_key", () => {
    const r = resolveEntities({ type: "custom:miwifi-card", entity: "miwifi" }, ptBrRegistry());
    expect(r.download_speed).toBe("sensor.miwifi_velocidade_de_download");
    expect(r.upload_speed).toBe("sensor.miwifi_velocidade_de_upload");
    expect(r.connected_devices).toBe("sensor.miwifi_dispositivos_conectados");
    expect(r.clients_5g).toBe("sensor.miwifi_clientes_5_ghz");
    expect(r.mesh_nodes).toBe("sensor.miwifi_nos_mesh");
    expect(r.wan_link).toBe("binary_sensor.miwifi_link_wan");
    expect(r.led).toBe("binary_sensor.miwifi_led_de_status");
    expect(r.wifi_24g).toBe("switch.miwifi_wi_fi_24_ghz");
    expect(r.wifi_5g).toBe("switch.miwifi_wi_fi_5_ghz");
    expect(r.reboot).toBe("button.miwifi_reiniciar");
    expect(r.speed_test).toBe("button.miwifi_executar_teste_de_velocidade");
  });

  it("falls back to the English slug when the registry lacks a key", () => {
    const reg = ptBrRegistry();
    delete (reg as Record<string, unknown>)["sensor.miwifi_versao_do_firmware"];
    const r = resolveEntities({ type: "custom:miwifi-card", entity: "miwifi" }, reg);
    expect(r.firmware).toBe("sensor.miwifi_firmware_version"); // english fallback
    expect(r.download_speed).toBe("sensor.miwifi_velocidade_de_download"); // still resolved
  });

  it("lets explicit overrides win over the registry", () => {
    const r = resolveEntities(
      {
        type: "custom:miwifi-card",
        entity: "miwifi",
        entities: { wan_link: "binary_sensor.custom_link" },
      },
      ptBrRegistry()
    );
    expect(r.wan_link).toBe("binary_sensor.custom_link");
    expect(r.download_speed).toBe("sensor.miwifi_velocidade_de_download");
  });

  it("scopes resolution to the requested device prefix", () => {
    const registry = { ...ptBrRegistry("miwifi"), ...ptBrRegistry("xiaomi_c54c_3ab3") };
    const a = resolveEntities({ type: "custom:miwifi-card", entity: "miwifi" }, registry);
    const b = resolveEntities({ type: "custom:miwifi-card", entity: "xiaomi_c54c_3ab3" }, registry);
    expect(a.download_speed).toBe("sensor.miwifi_velocidade_de_download");
    expect(b.download_speed).toBe("sensor.xiaomi_c54c_3ab3_velocidade_de_download");
  });

  it("ignores entities from other integrations sharing a translation_key", () => {
    const registry = {
      ...ptBrRegistry("miwifi"),
      "sensor.miwifi_velocidade_de_download_fake": {
        entity_id: "sensor.miwifi_velocidade_de_download_fake",
        platform: "some_other_integration",
        translation_key: "download_speed",
      },
    };
    const r = resolveEntities({ type: "custom:miwifi-card", entity: "miwifi" }, registry);
    expect(r.download_speed).toBe("sensor.miwifi_velocidade_de_download");
  });
});
