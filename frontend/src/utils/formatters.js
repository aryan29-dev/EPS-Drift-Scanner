/* Shared colour, label, and number formatting for EPS drift values. */

export const driftColor = (pct) => {
  if (pct == null) return "var(--text-muted)";
  if (pct >= 10) return "var(--green)";
  if (pct >= 2) return "var(--green)";
  if (pct >= -2) return "var(--text-dim)";
  if (pct >= -10) return "var(--amber)";
  return "var(--red)";
};

export const driftLabel = (pct) => {
  if (pct == null) return "N/A";
  if (pct >= 10) return "Strong beat";
  if (pct >= 2) return "Beat";
  if (pct >= -2) return "In line";
  if (pct >= -10) return "Miss";
  return "Strong miss";
};

export const trendColor = {
  accelerating: "var(--green)",
  decelerating: "var(--red)",
  stable: "var(--text-dim)",
};

export const trendTint = {
  accelerating: "rgba(46, 160, 67, 0.12)",
  decelerating: "rgba(229, 83, 75, 0.12)",
  stable: "rgba(157, 170, 184, 0.12)",
};

export const trendBorder = {
  accelerating: "rgba(46, 160, 67, 0.35)",
  decelerating: "rgba(229, 83, 75, 0.35)",
  stable: "rgba(157, 170, 184, 0.3)",
};

export const trendIcon = {
  accelerating: "▲",
  decelerating: "▼",
  stable: "─",
};

export const fmtDrift = (n) =>
  n == null ? "—" : `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;
