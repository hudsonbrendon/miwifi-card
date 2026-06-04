import type { EntityKey } from "./const";

export interface StatConfig {
  entity: string;
  unit?: string;
  multiply?: number;
  precision?: number;
  suffix?: string;
  rate?: boolean; // format raw bytes/s value via format-rate
  subtitle: string; // "stat.*" localize key, or literal text
}

export interface ActionConfig {
  service: string;
  service_data?: Record<string, unknown>;
  target?: Record<string, unknown>;
  icon?: string;
  name_key?: string;
  name?: string;
  kind?: "reboot" | "speedtest" | "wifi24" | "wifi5"; // drives styling/confirm
}

export interface MiWiFiCardConfig {
  type: string;
  entity?: string;
  entities?: Partial<Record<EntityKey, string>>;
  name?: string;
  image?: string;
  compact?: boolean;
  language?: string;
  stats?: StatConfig[];
  actions?: ActionConfig[];
}

export type ResolvedEntities = Record<EntityKey, string>;

export type StateColor = "muted" | "default" | "online" | "error";

export interface StateLine {
  text: string;
  color: StateColor;
}

export interface HassState {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

// Subset of the HA frontend entity-registry display entry (`hass.entities`).
// `platform` and `translation_key` are language-independent, unlike entity_id.
export interface EntityRegistryEntry {
  entity_id: string;
  platform?: string;
  translation_key?: string;
  device_id?: string;
}

export interface HassObject {
  states: Record<string, HassState>;
  entities?: Record<string, EntityRegistryEntry>;
  locale: { language: string };
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>
  ) => Promise<unknown>;
}
