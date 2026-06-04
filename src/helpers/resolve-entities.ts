import { ENTITY_SUFFIXES, type EntityKey } from "../const";
import type { MiWiFiCardConfig, ResolvedEntities } from "../types";

export function resolveEntities(config: MiWiFiCardConfig): ResolvedEntities {
  const overrides = config.entities ?? {};
  const prefix = config.entity;
  const result = {} as ResolvedEntities;
  (Object.keys(ENTITY_SUFFIXES) as EntityKey[]).forEach((key) => {
    const override = overrides[key];
    if (override) {
      result[key] = override;
    } else if (prefix) {
      const spec = ENTITY_SUFFIXES[key];
      result[key] = `${spec.domain}.${prefix}_${spec.suffix}`;
    } else {
      result[key] = "";
    }
  });
  return result;
}
