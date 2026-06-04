export const CARD_NAME = "miwifi-card";
export const EDITOR_NAME = `${CARD_NAME}-editor`;
export const CARD_VERSION = "0.1.0";

export type EntityDomain = "sensor" | "binary_sensor" | "switch" | "button";

export interface EntitySpec {
  domain: EntityDomain;
  suffix: string;
}

// key → how to build `<domain>.<prefix>_<suffix>`.
// Suffixes are the slugified friendly names produced by ha_miwifi
// (has_entity_name=True), NOT the integration's internal keys.
export const ENTITY_SUFFIXES = {
  download_speed: { domain: "sensor", suffix: "download_speed" },
  upload_speed: { domain: "sensor", suffix: "upload_speed" },
  connected_devices: { domain: "sensor", suffix: "connected_devices" },
  clients_24g: { domain: "sensor", suffix: "2_4_ghz_clients" },
  clients_5g: { domain: "sensor", suffix: "5_ghz_clients" },
  mesh_nodes: { domain: "sensor", suffix: "mesh_nodes" },
  wan_ip: { domain: "sensor", suffix: "wan_ip" },
  wan_type: { domain: "sensor", suffix: "wan_type" },
  wan_uptime: { domain: "sensor", suffix: "wan_connected_since" },
  firmware: { domain: "sensor", suffix: "firmware_version" },
  wan_link: { domain: "binary_sensor", suffix: "wan_link" },
  led: { domain: "binary_sensor", suffix: "status_led" },
  wifi_24g: { domain: "switch", suffix: "2_4_ghz_wi_fi" },
  wifi_5g: { domain: "switch", suffix: "5_ghz_wi_fi" },
  reboot: { domain: "button", suffix: "reboot" },
  speed_test: { domain: "button", suffix: "run_speed_test" },
} as const satisfies Record<string, EntitySpec>;

export type EntityKey = keyof typeof ENTITY_SUFFIXES;
