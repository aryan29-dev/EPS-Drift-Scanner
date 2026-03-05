export const driftColor = (pct) => {
  if (pct == null)  return "var(--text-muted)";
  if (pct >= 10)    return "var(--green)";
  if (pct >= 2)     return "#44ddaa";
  if (pct >= -2)    return "var(--text-dim)";
  if (pct >= -10)   return "var(--amber)";
  return "var(--red)";
};

export const driftLabel = (pct) => {
  if (pct == null)  return "N/A";
  if (pct >= 10)    return "STRONG BEAT";
  if (pct >= 2)     return "BEAT";
  if (pct >= -2)    return "IN LINE";
  if (pct >= -10)   return "MISS";
  return "STRONG MISS";
};

export const trendColor = {
  accelerating: "var(--green)",
  decelerating: "var(--red)",
  stable:       "var(--text-dim)",
};

export const trendIcon = {
  accelerating: "▲",
  decelerating: "▼",
  stable:       "─",
};

export const fmtDrift = (n) =>
  n == null ? "—" : `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;