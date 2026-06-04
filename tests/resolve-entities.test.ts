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
