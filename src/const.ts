export const CARD_NAME = "miwifi-card";
export const EDITOR_NAME = `${CARD_NAME}-editor`;
export const CARD_VERSION = "0.2.0";

export const MIWIFI_PLATFORM = "ha_miwifi";

export type EntityDomain = "sensor" | "binary_sensor" | "switch" | "button";

export interface EntitySpec {
  domain: EntityDomain;
  // Stable, language-independent identifier from the ha_miwifi integration.
  // Matched against `hass.entities[id].translation_key` for resolution.
  translation_key: string;
  // Fallback only: slugified English friendly name, used when the entity
  // registry is unavailable (e.g. in unit tests or very old HA frontends).
  suffix: string;
}

// key → how to find the entity. Primary resolution is by integration platform
// (`ha_miwifi`) + `translation_key`, which is identical across HA UI languages.
// `suffix` is the English-name fallback when the registry can't be read.
export const ENTITY_SUFFIXES = {
  download_speed: { domain: "sensor", translation_key: "download_speed", suffix: "download_speed" },
  upload_speed: { domain: "sensor", translation_key: "upload_speed", suffix: "upload_speed" },
  connected_devices: { domain: "sensor", translation_key: "client_count", suffix: "connected_devices" },
  clients_24g: { domain: "sensor", translation_key: "clients_24g", suffix: "2_4_ghz_clients" },
  clients_5g: { domain: "sensor", translation_key: "clients_5g", suffix: "5_ghz_clients" },
  mesh_nodes: { domain: "sensor", translation_key: "mesh_node_count", suffix: "mesh_nodes" },
  wan_ip: { domain: "sensor", translation_key: "wan_ip", suffix: "wan_ip" },
  wan_type: { domain: "sensor", translation_key: "wan_type", suffix: "wan_type" },
  wan_uptime: { domain: "sensor", translation_key: "wan_uptime", suffix: "wan_connected_since" },
  firmware: { domain: "sensor", translation_key: "firmware_version", suffix: "firmware_version" },
  wan_link: { domain: "binary_sensor", translation_key: "wan_link", suffix: "wan_link" },
  led: { domain: "binary_sensor", translation_key: "led", suffix: "status_led" },
  wifi_24g: { domain: "switch", translation_key: "wifi_24g", suffix: "2_4_ghz_wi_fi" },
  wifi_5g: { domain: "switch", translation_key: "wifi_5g", suffix: "5_ghz_wi_fi" },
  reboot: { domain: "button", translation_key: "reboot", suffix: "reboot" },
  speed_test: { domain: "button", translation_key: "speed_test", suffix: "run_speed_test" },
} as const satisfies Record<string, EntitySpec>;

export type EntityKey = keyof typeof ENTITY_SUFFIXES;
