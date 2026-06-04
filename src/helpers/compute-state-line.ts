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
