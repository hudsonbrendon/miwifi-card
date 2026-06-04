import type { HassObject, HassState } from "../../src/types";

export function mockEntity(
  entity_id: string,
  state: string,
  attributes: Record<string, unknown> = {}
): HassState {
  return { entity_id, state, attributes };
}

export interface MockHassOpts {
  prefix?: string;
  download_speed?: string;
  upload_speed?: string;
  connected_devices?: string;
  clients_24g?: string;
  clients_5g?: string;
  mesh_nodes?: string;
  wan_ip?: string;
  wan_type?: string;
  wan_uptime?: string;
  firmware?: string;
  wan_link?: string;
  led?: string;
  wifi_24g?: string;
  wifi_5g?: string;
  language?: string;
  unavailable?: string[];
}

export interface MockHass extends HassObject {
  _calls: Array<{
    domain: string;
    service: string;
    service_data?: Record<string, unknown>;
    target?: Record<string, unknown>;
  }>;
}

export function mockHass(opts: MockHassOpts = {}): MockHass {
  const p = opts.prefix ?? "mw";
  const states: Record<string, HassState> = {
    [`sensor.${p}_download_speed`]: mockEntity(`sensor.${p}_download_speed`, opts.download_speed ?? "1572864"),
    [`sensor.${p}_upload_speed`]: mockEntity(`sensor.${p}_upload_speed`, opts.upload_speed ?? "524288"),
    [`sensor.${p}_connected_devices`]: mockEntity(`sensor.${p}_connected_devices`, opts.connected_devices ?? "7"),
    [`sensor.${p}_2_4_ghz_clients`]: mockEntity(`sensor.${p}_2_4_ghz_clients`, opts.clients_24g ?? "3"),
    [`sensor.${p}_5_ghz_clients`]: mockEntity(`sensor.${p}_5_ghz_clients`, opts.clients_5g ?? "4"),
    [`sensor.${p}_mesh_nodes`]: mockEntity(`sensor.${p}_mesh_nodes`, opts.mesh_nodes ?? "1"),
    [`sensor.${p}_wan_ip`]: mockEntity(`sensor.${p}_wan_ip`, opts.wan_ip ?? "203.0.113.5"),
    [`sensor.${p}_wan_type`]: mockEntity(`sensor.${p}_wan_type`, opts.wan_type ?? "pppoe"),
    [`sensor.${p}_wan_connected_since`]: mockEntity(`sensor.${p}_wan_connected_since`, opts.wan_uptime ?? "2026-06-01T10:00:00+00:00"),
    [`sensor.${p}_firmware_version`]: mockEntity(`sensor.${p}_firmware_version`, opts.firmware ?? "1.0.84"),
    [`binary_sensor.${p}_wan_link`]: mockEntity(`binary_sensor.${p}_wan_link`, opts.wan_link ?? "on"),
    [`binary_sensor.${p}_status_led`]: mockEntity(`binary_sensor.${p}_status_led`, opts.led ?? "on"),
    [`switch.${p}_2_4_ghz_wi_fi`]: mockEntity(`switch.${p}_2_4_ghz_wi_fi`, opts.wifi_24g ?? "on"),
    [`switch.${p}_5_ghz_wi_fi`]: mockEntity(`switch.${p}_5_ghz_wi_fi`, opts.wifi_5g ?? "on"),
    [`button.${p}_reboot`]: mockEntity(`button.${p}_reboot`, "unknown"),
    [`button.${p}_run_speed_test`]: mockEntity(`button.${p}_run_speed_test`, "unknown"),
  };
  (opts.unavailable ?? []).forEach((eid) => {
    if (states[eid]) states[eid].state = "unavailable";
  });
  const calls: MockHass["_calls"] = [];
  return {
    states,
    locale: { language: opts.language ?? "en" },
    _calls: calls,
    callService(domain, service, service_data, target) {
      calls.push({ domain, service, service_data, target });
      return Promise.resolve();
    },
  };
}
