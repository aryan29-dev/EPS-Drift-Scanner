const BASE = "https://eps-drift-scanner.onrender.com/api";

export async function scanTickers(tickers, alertThreshold = 5) {
  const res = await fetch(`${BASE}/scanner/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tickers, alert_threshold: alertThreshold }),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function getPopularTickers() {
  const res = await fetch(`${BASE}/tickers/popular`);
  if (!res.ok) throw new Error("Could not load popular tickers");
  return res.json();
}

export async function getTickersBySector() {
  const res = await fetch(`${BASE}/tickers/by-sector`);
  if (!res.ok) throw new Error("Could not load sectors");
  return res.json();
}