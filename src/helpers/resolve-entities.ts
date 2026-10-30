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

// Device slug shared by every ha_miwifi entity on the same device as
// `entityId` — i.e. the `entity:` prefix the card expects. Language-independent:
// it is the longest common object_id prefix, not an English suffix strip.
export function suggestPrefix(
  registry: Record<string, EntityRegistryEntry>,
  entityId: string
): string | undefined {
  const anchor = registry[entityId];
  if (!anchor || anchor.platform !== MIWIFI_PLATFORM) return undefined;
  const objectIds = Object.values(registry)
    .filter((e) => e.platform === MIWIFI_PLATFORM && (!anchor.device_id || e.device_id === anchor.device_id))
    .map((e) => e.entity_id.split(".")[1] ?? "");
  let common = objectIds[0] ?? "";
  for (const id of objectIds) {
    while (common && !id.startsWith(common)) common = common.slice(0, -1);
  }
  const prefix = common.replace(/_+$/, "");
  return prefix || undefined;
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
