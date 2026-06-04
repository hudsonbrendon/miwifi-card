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
