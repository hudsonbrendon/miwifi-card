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
