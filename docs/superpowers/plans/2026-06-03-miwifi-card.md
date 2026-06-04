# MiWiFi Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `miwifi-card`, a custom Lovelace card for the `ha_miwifi` Home Assistant integration, mirroring the visual language and animation feel of [vacuum-card](https://github.com/denysdovhan/vacuum-card) (hero image with motion, status line, stats grid, toolbar of actions).

**Architecture:** A LitElement web component in TypeScript, built with Rollup to a single IIFE bundle, tested with Vitest + jsdom, distributed via HACS. It follows the exact structure of the user's existing `nintendo-switch-card` repo: a single device `entity:` prefix auto-resolves all router entities, with an optional `entities:` override map. The vacuum "bobbing while cleaning" animation is translated to a **combined router-active animation**: pulsing Wi-Fi signal waves + a blinking status LED + up/down data-flow particles, all gated on the router being online (`binary_sensor.<dev>_wan_link == "on"`) and disabled under `prefers-reduced-motion`.

**Tech Stack:** TypeScript, Lit 3, Rollup, Vitest, jsdom, HACS. No runtime deps beyond `lit`.

---

## Background: the `ha_miwifi` integration (already exists at `../ha-miwifi`)

Entities use `_attr_has_entity_name = True`, so every `entity_id` is `<domain>.<device_slug>_<slug(friendly_name)>`. The card's `entity:` config value **is** `<device_slug>` (e.g. `redmi_router_ax6000`). The slugified suffixes the card resolves against:

| Card key | Domain | entity_id suffix | Source friendly name |
|---|---|---|---|
| `download_speed` | sensor | `download_speed` | Download speed *(bytes/s)* |
| `upload_speed` | sensor | `upload_speed` | Upload speed *(bytes/s)* |
| `connected_devices` | sensor | `connected_devices` | Connected devices |
| `clients_24g` | sensor | `2_4_ghz_clients` | 2.4 GHz clients |
| `clients_5g` | sensor | `5_ghz_clients` | 5 GHz clients |
| `mesh_nodes` | sensor | `mesh_nodes` | Mesh nodes |
| `wan_ip` | sensor | `wan_ip` | WAN IP |
| `wan_type` | sensor | `wan_type` | WAN type |
| `wan_uptime` | sensor | `wan_connected_since` | WAN connected since *(timestamp)* |
| `firmware` | sensor | `firmware_version` | Firmware version |
| `wan_link` | binary_sensor | `wan_link` | WAN link |
| `led` | binary_sensor | `status_led` | Status LED |
| `wifi_24g` | switch | `2_4_ghz_wi_fi` | 2.4 GHz Wi-Fi |
| `wifi_5g` | switch | `5_ghz_wi_fi` | 5 GHz Wi-Fi |
| `reboot` | button | `reboot` | Reboot |
| `speed_test` | button | `run_speed_test` | Run speed test |

**Scope decisions (confirmed with user):**
- **Animation:** combined — Wi-Fi waves + LED blink + data-flow particles.
- **Config:** device-prefix auto-resolve (like `nintendo-switch-card`), `entities:` override optional.
- **Toolbar:** Reboot, Run speed test, toggle 2.4 GHz Wi-Fi, toggle 5 GHz Wi-Fi.
- **LED:** ⚠️ The integration's `Status LED` is a **read-only** `binary_sensor` — the underlying `set_led` endpoint is explicitly blocked in `python-xiaomi-miwifi` (no `async_set_led`). A toolbar *toggle* is therefore impossible. The card instead shows LED state as a **read-only indicator** in the header and drives the hero LED-blink animation from it. This is a deliberate deviation from the "toggle LED" request because the capability does not exist.

---

## File Structure

New repo at `/Users/hudsonbrendon/Github/miwifi-card/`:

```
miwifi-card/
├── package.json                     # build/test scripts, lit dep
├── tsconfig.json                    # strict TS, experimentalDecorators
├── rollup.config.mjs                # IIFE bundle → dist/miwifi-card.js
├── vitest.config.ts                 # jsdom env
├── hacs.json                        # HACS plugin manifest
├── .gitignore
├── README.md
├── src/
│   ├── const.ts                     # CARD_NAME, CARD_VERSION, ENTITY_SUFFIXES (key→{domain,suffix})
│   ├── types.ts                     # config + hass interfaces
│   ├── styles.ts                    # css incl. @keyframes (waves, led, data)
│   ├── miwifi-card.ts               # the component (setConfig, render*, actions)
│   ├── editor.ts                    # YAML-only stub editor
│   ├── assets/
│   │   └── router-svg.ts            # animated router SVG (waves/led/data hooks)
│   ├── helpers/
│   │   ├── resolve-entities.ts      # prefix/override → ResolvedEntities
│   │   ├── format-rate.ts           # bytes/s → adaptive "1.2 MB/s"
│   │   ├── format-stat.ts           # generic value formatter (copied from nintendo-switch-card)
│   │   └── compute-state-line.ts    # online/offline/unavailable status line
│   └── localize/
│       ├── index.ts                 # localize(key, lang) with en fallback
│       └── languages/
│           ├── en.json
│           └── pt-BR.json
└── tests/
    ├── fixtures/hass.ts             # mockHass + mockEntity
    ├── card.register.test.ts
    ├── card.config.test.ts
    ├── resolve-entities.test.ts
    ├── format-rate.test.ts
    ├── compute-state-line.test.ts
    ├── card.header.test.ts
    ├── card.hero.test.ts
    ├── card.stats.test.ts
    └── card.actions.test.ts
```

**Reference (read-only, do not modify):** `/Users/hudsonbrendon/Github/nintendo-switch-card/` is the canonical pattern. When a step says "copy from nintendo-switch-card", the file is byte-identical unless the step shows changes.

---

## Task 1: Repo scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `rollup.config.mjs`, `vitest.config.ts`, `hacs.json`, `.gitignore`

- [ ] **Step 1: Create the project directory and the plan's home**

Run:
```bash
mkdir -p /Users/hudsonbrendon/Github/miwifi-card/src/{assets,helpers,localize/languages} \
         /Users/hudsonbrendon/Github/miwifi-card/tests/fixtures
cd /Users/hudsonbrendon/Github/miwifi-card
```
(The plan file already lives at `docs/superpowers/plans/2026-06-03-miwifi-card.md`.)

- [ ] **Step 2: Write `package.json`**

```json
{
  "name": "miwifi-card",
  "version": "0.1.0",
  "description": "Lovelace card for Xiaomi/MiWiFi routers (via the ha_miwifi integration)",
  "type": "module",
  "main": "dist/miwifi-card.js",
  "scripts": {
    "build": "rollup -c rollup.config.mjs",
    "watch": "rollup -c rollup.config.mjs -w",
    "lint": "eslint 'src/**/*.ts' 'tests/**/*.ts'",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "keywords": ["home-assistant", "lovelace", "miwifi", "xiaomi", "router", "hacs"],
  "license": "MIT",
  "dependencies": {
    "lit": "^3.1.0"
  },
  "devDependencies": {
    "@rollup/plugin-commonjs": "^25.0.7",
    "@rollup/plugin-json": "^6.1.0",
    "@rollup/plugin-node-resolve": "^15.2.3",
    "@rollup/plugin-terser": "^0.4.4",
    "@rollup/plugin-typescript": "^11.1.6",
    "@types/node": "^20.11.0",
    "@typescript-eslint/eslint-plugin": "^8.59.1",
    "@typescript-eslint/parser": "^8.59.1",
    "@vitest/ui": "^1.2.0",
    "eslint": "^8.56.0",
    "jsdom": "^24.0.0",
    "rollup": "^4.9.0",
    "tslib": "^2.6.2",
    "typescript": "^5.3.3",
    "vitest": "^1.2.0"
  }
}
```

- [ ] **Step 3: Write `tsconfig.json`** (identical to nintendo-switch-card)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "dist",
    "rootDir": ".",
    "declaration": false,
    "sourceMap": true
  },
  "include": ["src/**/*.ts", "tests/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 4: Write `rollup.config.mjs`**

```js
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/miwifi-card.ts",
  output: {
    file: "dist/miwifi-card.js",
    format: "iife",
    name: "MiWiFiCard",
    sourcemap: true,
  },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    json(),
    typescript({ tsconfig: "./tsconfig.json", declaration: false }),
    terser({ format: { comments: false } }),
  ],
};
```

- [ ] **Step 5: Write `vitest.config.ts`** (identical to nintendo-switch-card)

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: false,
    include: ["tests/**/*.test.ts"],
    setupFiles: [],
  },
  resolve: {
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
  },
});
```

- [ ] **Step 6: Write `hacs.json`**

```json
{
  "name": "MiWiFi Card",
  "render_readme": true,
  "filename": "miwifi-card.js",
  "homeassistant": "2024.1.0"
}
```

- [ ] **Step 7: Write `.gitignore`**

```
node_modules/
dist/
*.log
.DS_Store
```

- [ ] **Step 8: Install dependencies**

Run: `cd /Users/hudsonbrendon/Github/miwifi-card && npm install`
Expected: `node_modules/` populated, no errors. (If the registry is unreachable, stop and report — every later step needs `vitest`.)

- [ ] **Step 9: Init git and commit**

```bash
cd /Users/hudsonbrendon/Github/miwifi-card
git init
git add .gitignore package.json package-lock.json tsconfig.json rollup.config.mjs vitest.config.ts hacs.json docs/
git commit -m "chore: scaffold miwifi-card project"
```

---

## Task 2: Constants and entity suffix map

**Files:**
- Create: `src/const.ts`
- Test: `tests/card.register.test.ts` (added in Task 9; const has no logic to unit-test alone)

- [ ] **Step 1: Write `src/const.ts`**

```ts
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
```

- [ ] **Step 2: Typecheck**

Run: `cd /Users/hudsonbrendon/Github/miwifi-card && npx tsc --noEmit`
Expected: PASS, no output.

- [ ] **Step 3: Commit**

```bash
git add src/const.ts
git commit -m "feat: add card constants and entity suffix map"
```

---

## Task 3: Types

**Files:**
- Create: `src/types.ts`

- [ ] **Step 1: Write `src/types.ts`**

```ts
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

export interface HassObject {
  states: Record<string, HassState>;
  locale: { language: string };
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>
  ) => Promise<unknown>;
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat: add config and hass type definitions"
```

---

## Task 4: Localization

**Files:**
- Create: `src/localize/index.ts`, `src/localize/languages/en.json`, `src/localize/languages/pt-BR.json`

- [ ] **Step 1: Write `src/localize/index.ts`** (identical to nintendo-switch-card)

```ts
import en from "./languages/en.json";
import ptBR from "./languages/pt-BR.json";

const TRANSLATIONS: Record<string, unknown> = {
  en,
  "pt-BR": ptBR,
};

function lookup(dict: unknown, path: string[]): string | undefined {
  let cur: unknown = dict;
  for (const key of path) {
    if (cur && typeof cur === "object" && key in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return typeof cur === "string" ? cur : undefined;
}

export function localize(key: string, lang: string = "en"): string {
  const path = key.split(".");
  const dict = TRANSLATIONS[lang];
  const found = dict ? lookup(dict, path) : undefined;
  if (found !== undefined) return found;
  const enFound = lookup(TRANSLATIONS.en, path);
  if (enFound !== undefined) return enFound;
  return key;
}
```

- [ ] **Step 2: Write `src/localize/languages/en.json`**

```json
{
  "state": {
    "online": "Online",
    "offline": "Offline",
    "unavailable": "Unavailable"
  },
  "stat": {
    "download": "Download",
    "upload": "Upload",
    "devices": "Devices",
    "clients_5g": "5 GHz",
    "clients_24g": "2.4 GHz",
    "mesh": "Mesh nodes"
  },
  "action": {
    "reboot": "Reboot",
    "reboot_confirm": "Reboot the router now? Connectivity will drop for ~1 minute.",
    "speedtest": "Run speed test",
    "wifi_24g": "2.4 GHz Wi-Fi",
    "wifi_5g": "5 GHz Wi-Fi"
  },
  "led": {
    "on": "Status LED on",
    "off": "Status LED off"
  },
  "error": {
    "no_entity": "Missing required entity configuration",
    "invalid_config": "Invalid configuration"
  }
}
```

- [ ] **Step 3: Write `src/localize/languages/pt-BR.json`**

```json
{
  "state": {
    "online": "Online",
    "offline": "Offline",
    "unavailable": "Indisponível"
  },
  "stat": {
    "download": "Download",
    "upload": "Upload",
    "devices": "Dispositivos",
    "clients_5g": "5 GHz",
    "clients_24g": "2.4 GHz",
    "mesh": "Nós mesh"
  },
  "action": {
    "reboot": "Reiniciar",
    "reboot_confirm": "Reiniciar o roteador agora? A conexão cai por ~1 minuto.",
    "speedtest": "Teste de velocidade",
    "wifi_24g": "Wi-Fi 2.4 GHz",
    "wifi_5g": "Wi-Fi 5 GHz"
  },
  "led": {
    "on": "LED de status ligado",
    "off": "LED de status desligado"
  },
  "error": {
    "no_entity": "Configuração de entidade obrigatória ausente",
    "invalid_config": "Configuração inválida"
  }
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS (`resolveJsonModule` is on).

- [ ] **Step 5: Commit**

```bash
git add src/localize/
git commit -m "feat: add localization (en, pt-BR)"
```

---

## Task 5: resolve-entities helper

**Files:**
- Create: `src/helpers/resolve-entities.ts`
- Test: `tests/resolve-entities.test.ts`

- [ ] **Step 1: Write the failing test `tests/resolve-entities.test.ts`**

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/resolve-entities.test.ts`
Expected: FAIL — cannot resolve `../src/helpers/resolve-entities`.

- [ ] **Step 3: Write `src/helpers/resolve-entities.ts`**

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/resolve-entities.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/helpers/resolve-entities.ts tests/resolve-entities.test.ts
git commit -m "feat: resolve router entities from device prefix"
```

---

## Task 6: format-rate and format-stat helpers

**Files:**
- Create: `src/helpers/format-rate.ts`, `src/helpers/format-stat.ts`
- Test: `tests/format-rate.test.ts`

- [ ] **Step 1: Write the failing test `tests/format-rate.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { formatRate } from "../src/helpers/format-rate";

describe("formatRate (bytes/s → adaptive unit)", () => {
  it("formats zero as 0 B/s", () => {
    expect(formatRate("0")).toBe("0 B/s");
  });
  it("formats bytes/s under 1 KB", () => {
    expect(formatRate("512")).toBe("512 B/s");
  });
  it("formats KB/s with one decimal", () => {
    expect(formatRate("1536")).toBe("1.5 KB/s");
  });
  it("formats MB/s with one decimal", () => {
    expect(formatRate("1572864")).toBe("1.5 MB/s");
  });
  it("returns — for unavailable / non-numeric", () => {
    expect(formatRate("unavailable")).toBe("—");
    expect(formatRate(undefined)).toBe("—");
    expect(formatRate("abc")).toBe("—");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/format-rate.test.ts`
Expected: FAIL — cannot resolve `../src/helpers/format-rate`.

- [ ] **Step 3: Write `src/helpers/format-rate.ts`**

```ts
const UNAVAILABLE = new Set(["unavailable", "unknown", "none", ""]);

// Converts a raw bytes-per-second value to an adaptive human string.
export function formatRate(value: string | undefined): string {
  if (value === undefined || UNAVAILABLE.has(value)) return "—";
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return "—";
  if (n < 1024) return `${Math.round(n)} B/s`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB/s`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB/s`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/format-rate.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Write `src/helpers/format-stat.ts`** (copied verbatim from nintendo-switch-card — used for non-rate stats)

```ts
export interface FormatStatOpts {
  unit?: string;
  multiply?: number;
  precision?: number;
  suffix?: string;
}

const UNAVAILABLE = new Set(["unavailable", "unknown", "none", ""]);

export function formatStat(value: string | undefined, opts: FormatStatOpts): string {
  if (value === undefined || UNAVAILABLE.has(value)) return "—";

  const wantsNumeric = opts.multiply !== undefined || opts.precision !== undefined;

  if (wantsNumeric) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "—";
    const multiplied = opts.multiply !== undefined ? n * opts.multiply : n;
    const formatted =
      opts.precision !== undefined ? multiplied.toFixed(opts.precision) : String(multiplied);
    return appendUnit(formatted, opts);
  }

  return appendUnit(value, opts);
}

function appendUnit(value: string, opts: FormatStatOpts): string {
  if (opts.suffix) return `${value}${opts.suffix}`;
  if (opts.unit) return `${value} ${opts.unit}`;
  return value;
}
```

- [ ] **Step 6: Commit**

```bash
git add src/helpers/format-rate.ts src/helpers/format-stat.ts tests/format-rate.test.ts
git commit -m "feat: add rate and stat formatters"
```

---

## Task 7: compute-state-line helper

**Files:**
- Create: `src/helpers/compute-state-line.ts`
- Test: `tests/compute-state-line.test.ts`

- [ ] **Step 1: Write the failing test `tests/compute-state-line.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { computeStateLine } from "../src/helpers/compute-state-line";

describe("computeStateLine", () => {
  it("reports unavailable as error", () => {
    const r = computeStateLine({ wanLink: "off", wanType: "", anyUnavailable: true, lang: "en" });
    expect(r.color).toBe("error");
    expect(r.text).toContain("Unavailable");
  });

  it("reports online with wan type", () => {
    const r = computeStateLine({ wanLink: "on", wanType: "pppoe", anyUnavailable: false, lang: "en" });
    expect(r.color).toBe("online");
    expect(r.text).toContain("Online");
    expect(r.text).toContain("pppoe");
  });

  it("reports online without wan type when blank/unknown", () => {
    const r = computeStateLine({ wanLink: "on", wanType: "unknown", anyUnavailable: false, lang: "en" });
    expect(r.color).toBe("online");
    expect(r.text).toBe("● Online");
  });

  it("reports offline as muted", () => {
    const r = computeStateLine({ wanLink: "off", wanType: "pppoe", anyUnavailable: false, lang: "en" });
    expect(r.color).toBe("muted");
    expect(r.text).toContain("Offline");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/compute-state-line.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/helpers/compute-state-line.ts`**

```ts
import { localize } from "../localize";
import type { StateLine } from "../types";

export interface StateLineInput {
  wanLink: string;
  wanType: string;
  anyUnavailable: boolean;
  lang: string;
}

const UNKNOWN = new Set(["", "unknown", "unavailable", "none"]);

export function computeStateLine(input: StateLineInput): StateLine {
  if (input.anyUnavailable) {
    return { text: localize("state.unavailable", input.lang), color: "error" };
  }
  if (input.wanLink === "on") {
    const online = localize("state.online", input.lang);
    if (UNKNOWN.has(input.wanType)) {
      return { text: `● ${online}`, color: "online" };
    }
    return { text: `● ${online} · ${input.wanType}`, color: "online" };
  }
  return { text: `○ ${localize("state.offline", input.lang)}`, color: "muted" };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/compute-state-line.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/helpers/compute-state-line.ts tests/compute-state-line.test.ts
git commit -m "feat: compute online/offline status line"
```

---

## Task 8: Animated router SVG asset

**Files:**
- Create: `src/assets/router-svg.ts`

The SVG renders a router with two antennas, a status-LED dot, three stacked Wi-Fi arcs, and four data-flow dots. Every animated element carries a class that `styles.ts` (Task 9) animates. Animations only run when the host puts the hero in `.online` (handled by CSS descendant selectors), so the SVG itself is static markup.

- [ ] **Step 1: Write `src/assets/router-svg.ts`**

```ts
import { svg } from "lit";

// Static markup; animation is driven entirely by CSS in styles.ts via the
// `.hero.online` ancestor. Classes: .mw-wave (3), .mw-led, .mw-dot-up (2),
// .mw-dot-down (2).
export const svgRouter = svg`
<svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="mwBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3a3f47"/>
      <stop offset="100%" stop-color="#23272e"/>
    </linearGradient>
    <linearGradient id="mwWave" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ff8a3d"/>
      <stop offset="100%" stop-color="#ff5722"/>
    </linearGradient>
  </defs>

  <!-- antennas -->
  <rect x="150" y="40" width="10" height="80" rx="5" fill="#2b2f36" transform="rotate(-18 155 80)"/>
  <rect x="440" y="40" width="10" height="80" rx="5" fill="#2b2f36" transform="rotate(18 445 80)"/>

  <!-- Wi-Fi waves (emanate from the top center) -->
  <g fill="none" stroke="url(#mwWave)" stroke-width="6" stroke-linecap="round">
    <path class="mw-wave mw-wave-1" d="M255 96 a48 48 0 0 1 90 0"/>
    <path class="mw-wave mw-wave-2" d="M232 104 a74 74 0 0 1 136 0"/>
    <path class="mw-wave mw-wave-3" d="M210 112 a100 100 0 0 1 180 0"/>
  </g>

  <!-- router body -->
  <rect x="180" y="120" width="240" height="84" rx="14" fill="url(#mwBody)"/>
  <rect x="180" y="120" width="240" height="84" rx="14" fill="none" stroke="#11141a" stroke-width="2"/>

  <!-- status LED -->
  <circle class="mw-led" cx="300" cy="162" r="9" fill="#ff5722"/>

  <!-- port lights -->
  <rect x="356" y="156" width="14" height="12" rx="2" fill="#454b54"/>
  <rect x="376" y="156" width="14" height="12" rx="2" fill="#454b54"/>

  <!-- data-flow dots (down = into router, up = out) -->
  <g>
    <circle class="mw-dot mw-dot-down mw-dot-down-1" cx="232" cy="150" r="4" fill="#4fc3f7"/>
    <circle class="mw-dot mw-dot-down mw-dot-down-2" cx="252" cy="150" r="4" fill="#4fc3f7"/>
    <circle class="mw-dot mw-dot-up mw-dot-up-1" cx="348" cy="174" r="4" fill="#81c784"/>
    <circle class="mw-dot mw-dot-up mw-dot-up-2" cx="368" cy="174" r="4" fill="#81c784"/>
  </g>
</svg>`;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/assets/router-svg.ts
git commit -m "feat: add animated router SVG asset"
```

---

## Task 9: Styles with combined animation

**Files:**
- Create: `src/styles.ts`
- Test: `tests/styles.test.ts`

- [ ] **Step 1: Write the failing test `tests/styles.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { cardStyles } from "../src/styles";

describe("cardStyles", () => {
  const text = cardStyles.cssText;

  it("defines the three animation keyframes", () => {
    expect(text).toContain("@keyframes mw-wave");
    expect(text).toContain("@keyframes mw-led");
    expect(text).toContain("@keyframes mw-data-down");
    expect(text).toContain("@keyframes mw-data-up");
  });

  it("only animates waves/leds/dots when the hero is online", () => {
    expect(text).toContain(".hero.online .mw-wave");
    expect(text).toContain(".hero.online .mw-led");
    expect(text).toContain(".hero.online .mw-dot");
  });

  it("disables animation under reduced motion", () => {
    expect(text).toContain("prefers-reduced-motion");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/styles.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/styles.ts`**

```ts
import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
  }
  ha-card {
    overflow: hidden;
    font-family: var(--primary-font-family, -apple-system, system-ui, sans-serif);
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px 0;
    font-size: 14px;
    color: var(--secondary-text-color, #666);
  }
  .header-left {
    display: flex;
    gap: 14px;
    align-items: center;
  }
  .header-item {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  .header-item ha-icon {
    --mdc-icon-size: 18px;
    opacity: 0.75;
  }
  .header-item.led-on {
    color: #ff7043;
  }
  .menu {
    color: var(--secondary-text-color, #999);
    cursor: pointer;
    padding: 0 6px;
  }
  .hero {
    padding: 18px 12px 8px;
    display: flex;
    justify-content: center;
  }
  .hero svg, .hero img {
    width: 100%;
    max-width: 460px;
    height: auto;
  }
  .hero.offline { opacity: 0.55; filter: grayscale(0.4); }
  .hero.unavailable { opacity: 0.4; }

  /* animated SVG parts are idle by default */
  .mw-wave { opacity: 0; }
  .mw-dot { opacity: 0; }

  /* --- run only when online --- */
  .hero.online .mw-wave { animation: mw-wave 2.4s ease-out infinite; }
  .hero.online .mw-wave-2 { animation-delay: 0.35s; }
  .hero.online .mw-wave-3 { animation-delay: 0.7s; }
  .hero.online .mw-led { animation: mw-led 1.6s ease-in-out infinite; }
  .hero.online .mw-dot-down { animation: mw-data-down 1.5s linear infinite; }
  .hero.online .mw-dot-down-2 { animation-delay: 0.75s; }
  .hero.online .mw-dot-up { animation: mw-data-up 1.5s linear infinite; }
  .hero.online .mw-dot-up-2 { animation-delay: 0.75s; }

  /* faster data flow when there is measurable traffic */
  .hero.online.busy .mw-dot-down,
  .hero.online.busy .mw-dot-up { animation-duration: 0.7s; }

  .name {
    text-align: center;
    font-weight: 600;
    font-size: 20px;
    margin: 4px 0 2px;
    color: var(--primary-text-color, #2c2c2c);
  }
  .state {
    text-align: center;
    font-size: 14px;
    margin-bottom: 14px;
    color: var(--secondary-text-color, #666);
  }
  .state.online { color: #2e9e5b; font-weight: 500; }
  .state.error { color: #d32f2f; font-weight: 500; }
  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid var(--divider-color, #eee);
  }
  .stat {
    padding: 12px 6px;
    text-align: center;
    border-right: 1px solid var(--divider-color, #eee);
    transition: transform 150ms ease;
  }
  .stat:last-child { border-right: 0; }
  .stat:hover { transform: translateY(-1px); }
  .stat-value {
    font-size: 18px;
    font-weight: 500;
    color: var(--primary-text-color, #2c2c2c);
  }
  .stat-label {
    font-size: 12px;
    color: var(--secondary-text-color, #888);
    margin-top: 2px;
  }
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    border-top: 1px solid var(--divider-color, #eee);
  }
  .tool-group { display: flex; gap: 14px; }
  .tool {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color, #666);
    cursor: pointer;
    border-radius: 6px;
    background: none;
    border: none;
    padding: 0;
    transition: transform 80ms ease;
  }
  .tool.active-radio { color: #2e9e5b; }
  .tool:hover { background: var(--secondary-background-color, #f0f0f0); color: var(--primary-text-color, #222); }
  .tool:active { transform: scale(0.92); }
  .tool:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); }
  .compact .stats, .compact .toolbar { display: none; }

  @keyframes mw-wave {
    0% { opacity: 0; }
    25% { opacity: 1; }
    100% { opacity: 0; }
  }
  @keyframes mw-led {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.25; }
  }
  @keyframes mw-data-down {
    0% { opacity: 0; transform: translateY(-14px); }
    20% { opacity: 1; }
    100% { opacity: 0; transform: translateY(0); }
  }
  @keyframes mw-data-up {
    0% { opacity: 0; transform: translateY(14px); }
    20% { opacity: 1; }
    100% { opacity: 0; transform: translateY(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .hero.online .mw-wave,
    .hero.online .mw-led,
    .hero.online .mw-dot { animation: none; }
    .hero.online .mw-wave { opacity: 0.6; }
    .hero.online .mw-led { opacity: 1; }
    .stat, .tool { transition: none; }
  }
`;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/styles.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/styles.ts tests/styles.test.ts
git commit -m "feat: add styles with combined router-active animation"
```

---

## Task 10: Editor stub

**Files:**
- Create: `src/editor.ts`

- [ ] **Step 1: Write `src/editor.ts`**

```ts
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { EDITOR_NAME } from "./const";

@customElement(EDITOR_NAME)
export class MiWiFiCardEditor extends LitElement {
  render() {
    return html`<div style="padding:16px;color:#666">
      Visual editor not implemented yet — please use YAML mode.
    </div>`;
  }
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/editor.ts
git commit -m "feat: add YAML-only editor stub"
```

---

## Task 11: Test fixtures

**Files:**
- Create: `tests/fixtures/hass.ts`

- [ ] **Step 1: Write `tests/fixtures/hass.ts`**

```ts
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add tests/fixtures/hass.ts
git commit -m "test: add hass mock fixture"
```

---

## Task 12: Card shell — registration, setConfig, render skeleton

**Files:**
- Create: `src/miwifi-card.ts`
- Test: `tests/card.register.test.ts`, `tests/card.config.test.ts`

- [ ] **Step 1: Write the failing tests `tests/card.register.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import "../src/miwifi-card";
import { CARD_NAME } from "../src/const";

describe("registration", () => {
  it("defines the custom element", () => {
    expect(customElements.get(CARD_NAME)).toBeTruthy();
  });

  it("registers the card in window.customCards", () => {
    interface W extends Window {
      customCards?: Array<{ type: string }>;
    }
    const w = window as W;
    expect(w.customCards?.some((c) => c.type === CARD_NAME)).toBe(true);
  });
});
```

- [ ] **Step 2: Write the failing tests `tests/card.config.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import "../src/miwifi-card";
import { CARD_NAME } from "../src/const";
import type { MiWiFiCardConfig } from "../src/types";

interface CardEl extends HTMLElement {
  setConfig(c: MiWiFiCardConfig): void;
}

function el(): CardEl {
  return document.createElement(CARD_NAME) as CardEl;
}

describe("setConfig", () => {
  it("accepts a device prefix", () => {
    const c = el();
    expect(() => c.setConfig({ type: `custom:${CARD_NAME}`, entity: "mw" })).not.toThrow();
  });

  it("accepts an entities map with at least wan_link + download_speed", () => {
    const c = el();
    expect(() =>
      c.setConfig({
        type: `custom:${CARD_NAME}`,
        entities: { wan_link: "binary_sensor.x_wan_link", download_speed: "sensor.x_dl" },
      })
    ).not.toThrow();
  });

  it("throws when neither prefix nor minimal entities provided", () => {
    const c = el();
    expect(() => c.setConfig({ type: `custom:${CARD_NAME}` })).toThrow(/missing required entity/i);
  });

  it("throws when stats has more than 4 items", () => {
    const c = el();
    expect(() =>
      c.setConfig({
        type: `custom:${CARD_NAME}`,
        entity: "mw",
        stats: Array(5).fill({ entity: "sensor.x", subtitle: "x" }),
      })
    ).toThrow(/at most 4/i);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run tests/card.register.test.ts tests/card.config.test.ts`
Expected: FAIL — cannot resolve `../src/miwifi-card`.

- [ ] **Step 4: Write `src/miwifi-card.ts` (shell only — header/hero/stats/toolbar render methods are added in later tasks; render currently calls placeholders that return `nothing` so the file compiles and registers)**

```ts
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { CARD_NAME, CARD_VERSION } from "./const";
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
  private _renderHeader(_ents: ResolvedEntities): TemplateResult | typeof nothing {
    return nothing;
  }
  private _renderHero(_ents: ResolvedEntities): TemplateResult {
    return html`<div class="hero">${svgRouter}</div>`;
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
  private _renderStats(_ents: ResolvedEntities): TemplateResult | typeof nothing {
    return nothing;
  }
  private _renderToolbar(_ents: ResolvedEntities): TemplateResult | typeof nothing {
    return nothing;
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const ents = resolveEntities(this._config);
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
```

> Note: `formatRate`, `formatStat`, `localize`, `ActionConfig`, `StatConfig` are imported now but used in Tasks 13–14. TypeScript with `noUnusedLocals` is **off** (not set in tsconfig), so unused imports are allowed; they prevent churn. If lint flags them, leave them — the next two tasks consume them.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/card.register.test.ts tests/card.config.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 6: Commit**

```bash
git add src/miwifi-card.ts tests/card.register.test.ts tests/card.config.test.ts
git commit -m "feat: card shell with registration, setConfig, render skeleton"
```

---

## Task 13: Header (live speeds, devices, LED indicator)

**Files:**
- Modify: `src/miwifi-card.ts` (replace `_renderHeader`)
- Test: `tests/card.header.test.ts`

- [ ] **Step 1: Write the failing test `tests/card.header.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import "../src/miwifi-card";
import { CARD_NAME } from "../src/const";
import { mockHass, type MockHassOpts } from "./fixtures/hass";
import type { MiWiFiCardConfig } from "../src/types";

interface CardEl extends HTMLElement {
  setConfig(c: MiWiFiCardConfig): void;
  hass: ReturnType<typeof mockHass>;
  updateComplete: Promise<boolean>;
}

async function mount(config: Partial<MiWiFiCardConfig>, hassOpts: MockHassOpts = {}): Promise<CardEl> {
  const c = document.createElement(CARD_NAME) as CardEl;
  c.setConfig({ type: `custom:${CARD_NAME}`, ...config } as MiWiFiCardConfig);
  c.hass = mockHass({ prefix: "mw", ...hassOpts });
  document.body.appendChild(c);
  await c.updateComplete;
  return c;
}

describe("header", () => {
  it("shows formatted download and upload rates", async () => {
    const c = await mount({ entity: "mw" });
    const text = c.shadowRoot?.querySelector(".header")?.textContent ?? "";
    expect(text).toContain("1.5 MB/s"); // download 1572864 B/s
    expect(text).toContain("512.0 KB/s"); // upload 524288 B/s
    c.remove();
  });

  it("shows the connected devices count", async () => {
    const c = await mount({ entity: "mw" }, { connected_devices: "9" });
    const devices = c.shadowRoot?.querySelector(".header-item.devices")?.textContent ?? "";
    expect(devices).toContain("9");
    c.remove();
  });

  it("adds led-on class when the status LED is on", async () => {
    const c = await mount({ entity: "mw" }, { led: "on" });
    expect(c.shadowRoot?.querySelector(".header-item.led")?.classList.contains("led-on")).toBe(true);
    c.remove();
  });

  it("does not add led-on class when the status LED is off", async () => {
    const c = await mount({ entity: "mw" }, { led: "off" });
    expect(c.shadowRoot?.querySelector(".header-item.led")?.classList.contains("led-on")).toBe(false);
    c.remove();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/card.header.test.ts`
Expected: FAIL — `.header` is empty (placeholder returns `nothing`).

- [ ] **Step 3: Replace `_renderHeader` in `src/miwifi-card.ts`**

Replace the placeholder method:
```ts
  private _renderHeader(_ents: ResolvedEntities): TemplateResult | typeof nothing {
    return nothing;
  }
```
with:
```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/card.header.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/miwifi-card.ts tests/card.header.test.ts
git commit -m "feat: header with live rates, device count, LED indicator"
```

---

## Task 14: Hero animation gating

**Files:**
- Modify: `src/miwifi-card.ts` (replace `_renderHero`)
- Test: `tests/card.hero.test.ts`

- [ ] **Step 1: Write the failing test `tests/card.hero.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import "../src/miwifi-card";
import { CARD_NAME } from "../src/const";
import { mockHass, type MockHassOpts } from "./fixtures/hass";
import type { MiWiFiCardConfig } from "../src/types";

interface CardEl extends HTMLElement {
  setConfig(c: MiWiFiCardConfig): void;
  hass: ReturnType<typeof mockHass>;
  updateComplete: Promise<boolean>;
}

async function mount(config: Partial<MiWiFiCardConfig>, hassOpts: MockHassOpts = {}): Promise<CardEl> {
  const c = document.createElement(CARD_NAME) as CardEl;
  c.setConfig({ type: `custom:${CARD_NAME}`, ...config } as MiWiFiCardConfig);
  c.hass = mockHass({ prefix: "mw", ...hassOpts });
  document.body.appendChild(c);
  await c.updateComplete;
  return c;
}

describe("hero", () => {
  it("marks hero online when wan_link is on", async () => {
    const c = await mount({ entity: "mw" }, { wan_link: "on" });
    expect(c.shadowRoot?.querySelector(".hero")?.classList.contains("online")).toBe(true);
    c.remove();
  });

  it("marks hero offline when wan_link is off", async () => {
    const c = await mount({ entity: "mw" }, { wan_link: "off" });
    const hero = c.shadowRoot?.querySelector(".hero");
    expect(hero?.classList.contains("offline")).toBe(true);
    expect(hero?.classList.contains("online")).toBe(false);
    c.remove();
  });

  it("marks hero unavailable when wan_link is unavailable", async () => {
    const c = await mount({ entity: "mw" }, { unavailable: ["binary_sensor.mw_wan_link"] });
    expect(c.shadowRoot?.querySelector(".hero")?.classList.contains("unavailable")).toBe(true);
    c.remove();
  });

  it("adds busy class when there is measurable traffic", async () => {
    const c = await mount({ entity: "mw" }, { wan_link: "on", download_speed: "2000000" });
    expect(c.shadowRoot?.querySelector(".hero")?.classList.contains("busy")).toBe(true);
    c.remove();
  });

  it("is not busy when traffic is near zero", async () => {
    const c = await mount({ entity: "mw" }, { wan_link: "on", download_speed: "0", upload_speed: "0" });
    expect(c.shadowRoot?.querySelector(".hero")?.classList.contains("busy")).toBe(false);
    c.remove();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/card.hero.test.ts`
Expected: FAIL — hero has no `online`/`offline`/`busy` classes (placeholder renders a bare `.hero`).

- [ ] **Step 3: Replace `_renderHero` in `src/miwifi-card.ts`**

Replace:
```ts
  private _renderHero(_ents: ResolvedEntities): TemplateResult {
    return html`<div class="hero">${svgRouter}</div>`;
  }
```
with:
```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/card.hero.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/miwifi-card.ts tests/card.hero.test.ts
git commit -m "feat: gate hero animation on online/offline/busy state"
```

---

## Task 15: Stats grid

**Files:**
- Modify: `src/miwifi-card.ts` (replace `_renderStats`, add `_defaultStats`)
- Test: `tests/card.stats.test.ts`

- [ ] **Step 1: Write the failing test `tests/card.stats.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import "../src/miwifi-card";
import { CARD_NAME } from "../src/const";
import { mockHass, type MockHassOpts } from "./fixtures/hass";
import type { MiWiFiCardConfig } from "../src/types";

interface CardEl extends HTMLElement {
  setConfig(c: MiWiFiCardConfig): void;
  hass: ReturnType<typeof mockHass>;
  updateComplete: Promise<boolean>;
}

async function mount(config: Partial<MiWiFiCardConfig>, hassOpts: MockHassOpts = {}): Promise<CardEl> {
  const c = document.createElement(CARD_NAME) as CardEl;
  c.setConfig({ type: `custom:${CARD_NAME}`, ...config } as MiWiFiCardConfig);
  c.hass = mockHass({ prefix: "mw", ...hassOpts });
  document.body.appendChild(c);
  await c.updateComplete;
  return c;
}

describe("stats", () => {
  it("renders four default stats", async () => {
    const c = await mount({ entity: "mw" });
    const stats = c.shadowRoot?.querySelectorAll(".stat");
    expect(stats?.length).toBe(4);
    c.remove();
  });

  it("formats the download stat as a rate", async () => {
    const c = await mount({ entity: "mw" }, { download_speed: "1572864" });
    const first = c.shadowRoot?.querySelector(".stat .stat-value")?.textContent ?? "";
    expect(first).toContain("1.5 MB/s");
    c.remove();
  });

  it("shows the connected devices count as a plain integer", async () => {
    const c = await mount({ entity: "mw" }, { connected_devices: "12" });
    const text = c.shadowRoot?.querySelector(".stats")?.textContent ?? "";
    expect(text).toContain("12");
    c.remove();
  });

  it("honors a custom stats config", async () => {
    const c = await mount({
      entity: "mw",
      stats: [{ entity: "sensor.mw_firmware_version", subtitle: "Firmware" }],
    });
    const stats = c.shadowRoot?.querySelectorAll(".stat");
    expect(stats?.length).toBe(1);
    expect(c.shadowRoot?.querySelector(".stat-value")?.textContent).toContain("1.0.84");
    expect(c.shadowRoot?.querySelector(".stat-label")?.textContent).toContain("Firmware");
    c.remove();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/card.stats.test.ts`
Expected: FAIL — no `.stat` elements (placeholder returns `nothing`).

- [ ] **Step 3: Replace `_renderStats` in `src/miwifi-card.ts`**

Replace:
```ts
  private _renderStats(_ents: ResolvedEntities): TemplateResult | typeof nothing {
    return nothing;
  }
```
with:
```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/card.stats.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/miwifi-card.ts tests/card.stats.test.ts
git commit -m "feat: stats grid with rate formatting and overrides"
```

---

## Task 16: Toolbar actions (reboot, speedtest, Wi-Fi toggles)

**Files:**
- Modify: `src/miwifi-card.ts` (replace `_renderToolbar`, add `_defaultActions`, `_handleAction`)
- Test: `tests/card.actions.test.ts`

- [ ] **Step 1: Write the failing test `tests/card.actions.test.ts`**

```ts
import { describe, it, expect, vi } from "vitest";
import "../src/miwifi-card";
import { CARD_NAME } from "../src/const";
import { mockHass, type MockHassOpts } from "./fixtures/hass";
import type { MiWiFiCardConfig } from "../src/types";

interface CardEl extends HTMLElement {
  setConfig(c: MiWiFiCardConfig): void;
  hass: ReturnType<typeof mockHass>;
  updateComplete: Promise<boolean>;
}

async function mount(config: Partial<MiWiFiCardConfig>, hassOpts: MockHassOpts = {}): Promise<CardEl> {
  const c = document.createElement(CARD_NAME) as CardEl;
  c.setConfig({ type: `custom:${CARD_NAME}`, ...config } as MiWiFiCardConfig);
  c.hass = mockHass({ prefix: "mw", ...hassOpts });
  document.body.appendChild(c);
  await c.updateComplete;
  return c;
}

describe("toolbar actions", () => {
  it("renders reboot, speedtest, and two wifi toggles by default", async () => {
    const c = await mount({ entity: "mw" });
    expect(c.shadowRoot?.querySelector(".tool.reboot")).not.toBeNull();
    expect(c.shadowRoot?.querySelector(".tool.speedtest")).not.toBeNull();
    expect(c.shadowRoot?.querySelector(".tool.wifi24")).not.toBeNull();
    expect(c.shadowRoot?.querySelector(".tool.wifi5")).not.toBeNull();
    c.remove();
  });

  it("speedtest presses button.mw_run_speed_test", async () => {
    const c = await mount({ entity: "mw" });
    (c.shadowRoot?.querySelector(".tool.speedtest") as HTMLButtonElement).click();
    await c.updateComplete;
    expect(c.hass._calls[0]).toEqual({
      domain: "button",
      service: "press",
      service_data: { entity_id: "button.mw_run_speed_test" },
      target: undefined,
    });
    c.remove();
  });

  it("reboot asks for confirmation and presses button.mw_reboot when confirmed", async () => {
    const c = await mount({ entity: "mw" });
    const orig = window.confirm;
    window.confirm = vi.fn(() => true);
    (c.shadowRoot?.querySelector(".tool.reboot") as HTMLButtonElement).click();
    await c.updateComplete;
    window.confirm = orig;
    expect(c.hass._calls[0]).toEqual({
      domain: "button",
      service: "press",
      service_data: { entity_id: "button.mw_reboot" },
      target: undefined,
    });
    c.remove();
  });

  it("reboot does nothing when confirmation is declined", async () => {
    const c = await mount({ entity: "mw" });
    const orig = window.confirm;
    window.confirm = vi.fn(() => false);
    (c.shadowRoot?.querySelector(".tool.reboot") as HTMLButtonElement).click();
    await c.updateComplete;
    window.confirm = orig;
    expect(c.hass._calls).toHaveLength(0);
    c.remove();
  });

  it("wifi toggle calls switch.toggle on switch.mw_2_4_ghz_wi_fi", async () => {
    const c = await mount({ entity: "mw" });
    (c.shadowRoot?.querySelector(".tool.wifi24") as HTMLButtonElement).click();
    await c.updateComplete;
    expect(c.hass._calls[0]).toEqual({
      domain: "switch",
      service: "toggle",
      service_data: { entity_id: "switch.mw_2_4_ghz_wi_fi" },
      target: undefined,
    });
    c.remove();
  });

  it("marks a wifi toggle active when its switch is on", async () => {
    const c = await mount({ entity: "mw" }, { wifi_5g: "on", wifi_24g: "off" });
    expect(c.shadowRoot?.querySelector(".tool.wifi5")?.classList.contains("active-radio")).toBe(true);
    expect(c.shadowRoot?.querySelector(".tool.wifi24")?.classList.contains("active-radio")).toBe(false);
    c.remove();
  });

  it("custom actions override the defaults", async () => {
    const c = await mount({
      entity: "mw",
      actions: [{ service: "scene.turn_on", service_data: { entity_id: "scene.x" }, icon: "mdi:home", name: "Scene" }],
    });
    const tools = c.shadowRoot?.querySelectorAll(".tool-group:first-child .tool");
    expect(tools?.length).toBe(1);
    (tools![0] as HTMLButtonElement).click();
    await c.updateComplete;
    expect(c.hass._calls[0].domain).toBe("scene");
    expect(c.hass._calls[0].service).toBe("turn_on");
    c.remove();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/card.actions.test.ts`
Expected: FAIL — no `.tool` elements (placeholder returns `nothing`).

- [ ] **Step 3: Replace `_renderToolbar` in `src/miwifi-card.ts` and add helpers**

Replace:
```ts
  private _renderToolbar(_ents: ResolvedEntities): TemplateResult | typeof nothing {
    return nothing;
  }
```
with:
```ts
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
```

> Note: the custom-actions test counts buttons under `.tool-group:first-child` only, so the Wi-Fi toggles (second group) always render regardless of `actions:` override. This matches vacuum-card, where shortcuts and toolbar coexist.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/card.actions.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Run the full suite + typecheck**

Run: `npx vitest run && npx tsc --noEmit`
Expected: all test files PASS, no type errors.

- [ ] **Step 6: Commit**

```bash
git add src/miwifi-card.ts tests/card.actions.test.ts
git commit -m "feat: toolbar with reboot (confirmed), speedtest, wifi toggles"
```

---

## Task 17: Build, README, final verification

**Files:**
- Create: `README.md`
- Build: `dist/miwifi-card.js`

- [ ] **Step 1: Produce the production bundle**

Run: `cd /Users/hudsonbrendon/Github/miwifi-card && npm run build`
Expected: `dist/miwifi-card.js` and `dist/miwifi-card.js.map` written, no errors.

- [ ] **Step 2: Write `README.md`**

````markdown
# MiWiFi Card

A Lovelace card for Xiaomi / MiWiFi routers exposed through the
[`ha_miwifi`](https://github.com/hudsonbrendon/ha-miwifi) integration.
Design and animation inspired by
[vacuum-card](https://github.com/denysdovhan/vacuum-card): an animated router
hero (pulsing Wi-Fi waves, blinking status LED, up/down data-flow particles),
a live status line, a stats grid, and a toolbar of actions.

![example](assets/example.png)

## Installation (HACS)

1. HACS → Frontend → ⋮ → Custom repositories.
2. Add `https://github.com/hudsonbrendon/miwifi-card`, category **Lovelace**.
3. Install "MiWiFi Card" and reload resources.

## Usage

The simplest config points at your router's **device prefix** — the slug
Home Assistant gives the device (e.g. a device named *Redmi AX6000* →
`redmi_ax6000`). The card auto-resolves every entity from it.

```yaml
type: custom:miwifi-card
entity: redmi_ax6000
name: Living Room Router
```

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `entity` | string | — | Device prefix; auto-resolves all entities. Required unless `entities` is given. |
| `entities` | map | — | Per-key overrides (e.g. `download_speed: sensor.x`). Keys: see below. |
| `name` | string | `MiWiFi Router` | Card title. |
| `image` | string | built-in SVG | Custom hero image URL/path (disables the animated SVG). |
| `compact` | bool | `false` | Hide stats + toolbar. |
| `language` | string | HA locale | `en` or `pt-BR`. |
| `stats` | list | download/upload/devices/5 GHz | Up to 4 `{entity, subtitle, rate?, unit?, multiply?, precision?, suffix?}`. |
| `actions` | list | reboot + speedtest | Override the left toolbar group. |

Override keys for `entities`: `download_speed`, `upload_speed`,
`connected_devices`, `clients_24g`, `clients_5g`, `mesh_nodes`, `wan_ip`,
`wan_type`, `wan_uptime`, `firmware`, `wan_link`, `led`, `wifi_24g`,
`wifi_5g`, `reboot`, `speed_test`.

### Notes

- The **status LED** is shown read-only — the MiWiFi API does not allow
  toggling it, so the card reflects state and drives the LED animation but
  offers no on/off control.
- The hero animates only while the router is **online**
  (`binary_sensor.<dev>_wan_link == on`); it dims when offline and respects
  `prefers-reduced-motion`.

## Development

```bash
npm install
npm test        # vitest
npm run build   # → dist/miwifi-card.js
```
````

- [ ] **Step 3: Create an assets directory placeholder for the README image**

Run: `mkdir -p /Users/hudsonbrendon/Github/miwifi-card/assets`
(Add a real `assets/example.png` screenshot later; the README link can 404 until then.)

- [ ] **Step 4: Final full verification**

Run: `cd /Users/hudsonbrendon/Github/miwifi-card && npm run build && npx tsc --noEmit && npx vitest run`
Expected: build succeeds, no type errors, **all test files pass** (register, config, resolve-entities, format-rate, compute-state-line, styles, header, hero, stats, actions).

- [ ] **Step 5: Commit**

```bash
git add README.md dist/ assets/
git commit -m "docs: add README and production build"
```

---

## Self-Review (completed during planning)

**Spec coverage** — vacuum-card sections mapped: header (Task 13), animated hero (Tasks 8/9/14), status line (Tasks 7/12), stats grid (Task 15), toolbar of actions (Task 16). Combined animation (waves+LED+data) delivered in SVG (8) + CSS (9) + gating (14). Device-prefix config (5/12). Toolbar reboot/speedtest/wifi (16). LED read-only deviation documented and surfaced.

**Placeholder scan** — no TBD/TODO; every code step contains complete code; every test step contains assertions.

**Type consistency** — `ENTITY_SUFFIXES` is `key→{domain,suffix}` and `resolveEntities` reads `spec.domain`/`spec.suffix` (Tasks 2, 5). `MiWiFiCardConfig`/`ResolvedEntities`/`StatConfig`/`ActionConfig` defined in Task 3 and consumed unchanged in 12–16. `formatRate` signature `(string|undefined)→string` consistent across 6, 13, 15. Render method names (`_renderHeader/_renderHero/_renderName/_renderStateLine/_renderStats/_renderToolbar`) declared as placeholders in Task 12 and each replaced exactly once in 13–16. Mock entity_ids in `tests/fixtures/hass.ts` (Task 11) match the slug suffixes in `ENTITY_SUFFIXES` (Task 2).

**Known follow-ups (out of scope, not blockers):** real `assets/example.png` screenshot; optional visual editor; CI workflows (`.github/workflows/`) and `LICENSE` can be copied from `nintendo-switch-card` if desired before first publish.
```
