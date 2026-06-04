import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { CARD_NAME, CARD_VERSION, EDITOR_NAME } from "./const";
import { cardStyles } from "./styles";
import "./editor";
import { svgRouter } from "./assets/router-svg";
import { resolveEntities } from "./helpers/resolve-entities";
import { computeStateLine } from "./helpers/compute-state-line";
import { formatRate } from "./helpers/format-rate";
import { formatStat } from "./helpers/format-stat";
import { localize } from "./localize";
import type {
  ActionConfig,
  HassObject,
  MiWiFiCardConfig,
  ResolvedEntities,
  StatConfig,
} from "./types";

console.info(
  `%c MIWIFI-CARD %c v${CARD_VERSION} `,
  "color: white; background: #ff5722; font-weight: 700;",
  "color: white; background: #23272e; font-weight: 700;"
);

interface CustomCardWindow extends Window {
  customCards?: Array<{ type: string; name: string; description: string; preview: boolean }>;
}
const w = window as CustomCardWindow;
w.customCards = w.customCards || [];
w.customCards.push({
  type: CARD_NAME,
  name: "MiWiFi Card",
  description: "Card for Xiaomi/MiWiFi routers via the ha_miwifi integration",
  preview: false,
});

@customElement(CARD_NAME)
export class MiWiFiCard extends LitElement {
  static styles = cardStyles;

  @property({ attribute: false }) hass?: HassObject;
  @state() private _config?: MiWiFiCardConfig;

  static getConfigElement(): HTMLElement {
    return document.createElement(EDITOR_NAME);
  }

  static getStubConfig(): { type: string; entity: string } {
    return { type: `custom:${CARD_NAME}`, entity: "redmi_ax6000" };
  }

  setConfig(config: MiWiFiCardConfig): void {
    if (!config) throw new Error("invalid_config: config is empty");
    const hasPrefix = typeof config.entity === "string" && config.entity.length > 0;
    const ents = config.entities ?? {};
    const hasMinEntities = !!ents.wan_link && !!ents.download_speed;
    if (!hasPrefix && !hasMinEntities) {
      throw new Error(
        "missing required entity: provide `entity:` prefix or `entities.wan_link` + `entities.download_speed`"
      );
    }
    if (config.stats && config.stats.length > 4) {
      throw new Error("invalid_config: stats can have at most 4 items");
    }
    this._config = config;
  }

  getCardSize(): number {
    return 5;
  }

  private _stateOf(entityId: string): string {
    if (!entityId || !this.hass) return "unavailable";
    return this.hass.states[entityId]?.state ?? "unavailable";
  }

  private _resolveLang(): string {
    return this._config?.language ?? this.hass?.locale?.language ?? "en";
  }

  private _isOnline(ents: ResolvedEntities): boolean {
    return this._stateOf(ents.wan_link) === "on";
  }

  private _isAnyEssentialUnavailable(ents: ResolvedEntities): boolean {
    return this._stateOf(ents.wan_link) === "unavailable";
  }

  // --- render sub-methods (filled in by later tasks) ---
  private _renderHeader(ents: ResolvedEntities): TemplateResult {
    const down = formatRate(this._stateOf(ents.download_speed));
    const up = formatRate(this._stateOf(ents.upload_speed));
    const devices = this._stateOf(ents.connected_devices);
    const ledOn = this._stateOf(ents.led) === "on";
    const devicesText = ["unavailable", "unknown"].includes(devices) ? "—" : devices;
    return html`
      <div class="header">
        <div class="header-left">
          <div class="header-item down">
            <ha-icon icon="mdi:download"></ha-icon>
            <span>${down}</span>
          </div>
          <div class="header-item up">
            <ha-icon icon="mdi:upload"></ha-icon>
            <span>${up}</span>
          </div>
          <div class="header-item devices">
            <ha-icon icon="mdi:devices"></ha-icon>
            <span>${devicesText}</span>
          </div>
          <div
            class="header-item led ${ledOn ? "led-on" : ""}"
            title=${localize(ledOn ? "led.on" : "led.off", this._resolveLang())}
          >
            <ha-icon icon="${ledOn ? "mdi:led-on" : "mdi:led-off"}"></ha-icon>
          </div>
        </div>
        <div class="menu">⋮</div>
      </div>
    `;
  }
  private _busyThreshold = 64 * 1024; // 64 KB/s on either direction = "busy"

  private _isBusy(ents: ResolvedEntities): boolean {
    const d = Number(this._stateOf(ents.download_speed));
    const u = Number(this._stateOf(ents.upload_speed));
    const down = Number.isFinite(d) ? d : 0;
    const up = Number.isFinite(u) ? u : 0;
    return down > this._busyThreshold || up > this._busyThreshold;
  }

  private _renderHero(ents: ResolvedEntities): TemplateResult {
    const image = this._config!.image;
    const unavailable = this._isAnyEssentialUnavailable(ents);
    const online = !unavailable && this._isOnline(ents);
    const cls = unavailable ? "unavailable" : online ? "online" : "offline";
    const busy = online && this._isBusy(ents) ? "busy" : "";
    return html`
      <div class="hero ${cls} ${busy}">
        ${image
          ? html`<img src=${image} alt="MiWiFi Router" />`
          : svgRouter}
      </div>
    `;
  }
  private _renderName(): TemplateResult {
    const name = this._config?.name ?? "MiWiFi Router";
    return html`<div class="name">${name}</div>`;
  }
  private _renderStateLine(ents: ResolvedEntities, anyUnavailable: boolean): TemplateResult {
    const line = computeStateLine({
      wanLink: this._stateOf(ents.wan_link),
      wanType: this._stateOf(ents.wan_type),
      anyUnavailable,
      lang: this._resolveLang(),
    });
    return html`<div class="state ${line.color}" aria-live="polite">${line.text}</div>`;
  }
  private _defaultStats(ents: ResolvedEntities): StatConfig[] {
    return [
      { entity: ents.download_speed, rate: true, subtitle: "stat.download" },
      { entity: ents.upload_speed, rate: true, subtitle: "stat.upload" },
      { entity: ents.connected_devices, subtitle: "stat.devices" },
      { entity: ents.clients_5g, subtitle: "stat.clients_5g" },
    ];
  }

  private _renderStats(ents: ResolvedEntities): TemplateResult {
    const stats = this._config!.stats ?? this._defaultStats(ents);
    const lang = this._resolveLang();
    return html`
      <div class="stats">
        ${stats.map((s) => {
          const raw = this._stateOf(s.entity);
          const formatted = s.rate
            ? formatRate(raw)
            : formatStat(raw, {
                unit: s.unit,
                multiply: s.multiply,
                precision: s.precision,
                suffix: s.suffix,
              });
          const label = s.subtitle.startsWith("stat.") ? localize(s.subtitle, lang) : s.subtitle;
          return html`
            <div class="stat">
              <div class="stat-value">${formatted}</div>
              <div class="stat-label">${label}</div>
            </div>
          `;
        })}
      </div>
    `;
  }
  private _defaultActions(ents: ResolvedEntities): ActionConfig[] {
    return [
      {
        service: "button.press",
        service_data: { entity_id: ents.reboot },
        icon: "mdi:restart",
        name_key: "action.reboot",
        kind: "reboot",
      },
      {
        service: "button.press",
        service_data: { entity_id: ents.speed_test },
        icon: "mdi:speedometer",
        name_key: "action.speedtest",
        kind: "speedtest",
      },
    ];
  }

  private _handleAction(action: ActionConfig): void {
    if (!this.hass) return;
    if (action.kind === "reboot") {
      const ok = window.confirm(localize("action.reboot_confirm", this._resolveLang()));
      if (!ok) return;
    }
    const [domain, service] = action.service.split(".");
    if (!domain || !service) return;
    this.hass.callService(domain, service, action.service_data, action.target);
  }

  private _toggleRadio(entityId: string): void {
    if (!this.hass || !entityId) return;
    this.hass.callService("switch", "toggle", { entity_id: entityId });
  }

  private _kindClass(action: ActionConfig): string {
    if (action.kind === "reboot") return "reboot";
    if (action.kind === "speedtest") return "speedtest";
    return "";
  }

  private _renderToolbar(ents: ResolvedEntities): TemplateResult {
    const lang = this._resolveLang();
    const actions = this._config?.actions ?? this._defaultActions(ents);
    const wifi24On = this._stateOf(ents.wifi_24g) === "on";
    const wifi5On = this._stateOf(ents.wifi_5g) === "on";

    return html`
      <div class="toolbar">
        <div class="tool-group">
          ${actions.map((a) => {
            const label = a.name_key ? localize(a.name_key, lang) : (a.name ?? a.service);
            return html`
              <button
                class="tool ${this._kindClass(a)}"
                aria-label=${label}
                title=${label}
                @click=${() => this._handleAction(a)}
              >
                <ha-icon icon=${a.icon ?? "mdi:flash"}></ha-icon>
              </button>
            `;
          })}
        </div>
        <div class="tool-group">
          <button
            class="tool wifi24 ${wifi24On ? "active-radio" : ""}"
            aria-label=${localize("action.wifi_24g", lang)}
            title="${localize("action.wifi_24g", lang)}"
            @click=${() => this._toggleRadio(ents.wifi_24g)}
          >
            <ha-icon icon="${wifi24On ? "mdi:wifi" : "mdi:wifi-off"}"></ha-icon>
          </button>
          <button
            class="tool wifi5 ${wifi5On ? "active-radio" : ""}"
            aria-label=${localize("action.wifi_5g", lang)}
            title="${localize("action.wifi_5g", lang)}"
            @click=${() => this._toggleRadio(ents.wifi_5g)}
          >
            <ha-icon icon="${wifi5On ? "mdi:wifi" : "mdi:wifi-off"}"></ha-icon>
          </button>
        </div>
      </div>
    `;
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const ents = resolveEntities(this._config, this.hass.entities);
    const unavailable = this._isAnyEssentialUnavailable(ents);
    const compact = this._config.compact ? "compact" : "";
    return html`
      <ha-card class=${compact} role="article" aria-label=${this._config.name ?? "MiWiFi Router"}>
        ${this._renderHeader(ents)}
        ${this._renderHero(ents)}
        ${this._renderName()}
        ${this._renderStateLine(ents, unavailable)}
        ${this._renderStats(ents)}
        ${this._renderToolbar(ents)}
      </ha-card>
    `;
  }
}
