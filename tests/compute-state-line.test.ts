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
