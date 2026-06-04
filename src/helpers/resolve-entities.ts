import { ENTITY_SUFFIXES, MIWIFI_PLATFORM, type EntityKey } from "../const";
import type { EntityRegistryEntry, MiWiFiCardConfig, ResolvedEntities } from "../types";

// Find an entity by integration platform + translation_key (language-independent),
// scoped to the chosen device via the entity_id prefix.
function findInRegistry(
  registry: Record<string, EntityRegistryEntry>,
  prefix: string,
  domain: string,
  translationKey: string
): string | undefined {
  const scope = `${domain}.${prefix}_`;
  for (const entry of Object.values(registry)) {
    if (
      entry &&
      entry.platform === MIWIFI_PLATFORM &&
      entry.translation_key === translationKey &&
      typeof entry.entity_id === "string" &&
      entry.entity_id.startsWith(scope)
    ) {
      return entry.entity_id;
    }
  }
  return undefined;
}

export function resolveEntities(
  config: MiWiFiCardConfig,
  registry?: Record<string, EntityRegistryEntry>
): ResolvedEntities {
  const overrides = config.entities ?? {};
  const prefix = config.entity;
  const result = {} as ResolvedEntities;

  (Object.keys(ENTITY_SUFFIXES) as EntityKey[]).forEach((key) => {
    const override = overrides[key];
    if (override) {
      result[key] = override;
      return;
    }
    if (!prefix) {
      result[key] = "";
      return;
    }
    const spec = ENTITY_SUFFIXES[key];
    // Primary: resolve via the entity registry (works in any HA language).
    const fromRegistry = registry
      ? findInRegistry(registry, prefix, spec.domain, spec.translation_key)
      : undefined;
    // Fallback: English-name slug guess (registry unavailable).
    result[key] = fromRegistry ?? `${spec.domain}.${prefix}_${spec.suffix}`;
  });

  return result;
}
