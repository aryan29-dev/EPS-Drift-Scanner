import { useState } from "react";
import "./styles/globals.css";
import Header from "./components/Header";
import ControlBar from "./components/ControlBar";
import TickerCard from "./components/TickerCard";
import DetailPanel from "./components/DetailPanel";
import VaultDoor from "./components/VaultDoor";
import { useScan } from "./hooks/useScan";

export default function App() {
    const [tickers, setTickers] = useState(["AAPL", "MSFT", "NVDA"]);
    const [threshold, setThreshold] = useState(5);
    const [sortBy, setSortBy] = useState("drift");
    const [selected, setSelected] = useState(null);
    const [vaultDone, setVaultDone] = useState(false);

    const { results, loading, error, lastScanned, alertCount, scan } = useScan();

    const sorted = [...results].sort((a, b) => {
        if (sortBy === "drift") return (Math.abs(b.summary_stats?.avg_drift_pct) || 0) - (Math.abs(a.summary_stats?.avg_drift_pct) || 0);
        if (sortBy === "ml") return b.ml_drift_score - a.ml_drift_score;
        if (sortBy === "beat") return (b.summary_stats?.beat_rate_pct || 0) - (a.summary_stats?.beat_rate_pct || 0);
        return a.ticker.localeCompare(b.ticker);
    });

    const selectedData = results.find(r => r.ticker === selected);

    return (
        <>
            {!vaultDone && <VaultDoor onComplete={() => setVaultDone(true)} />}

            {/* Fade in + slide up after vault opens */}
            <div style={{
                opacity: vaultDone ? 1 : 0,
                transform: vaultDone ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
            }}>
                <Header alertCount={alertCount} lastScanned={lastScanned} tickerCount={results.length} />
                <ControlBar tickers={tickers} setTickers={setTickers} threshold={threshold}
                    setThreshold={setThreshold} sortBy={sortBy} setSortBy={setSortBy}
                    onScan={scan} loading={loading} />
                    
                    <main style={{ padding: "16px", maxWidth: selected ? "calc(100% - 476px)" : "100%", transition: "max-width 0.25s ease" }}>
                    {error && (
                        <div style={{ background: "#ff335510", border: "1px solid #ff335530", borderRadius: 8, padding: "14px 18px", marginBottom: 20, fontSize: 12, color: "var(--red)" }}>
                            ⚠ {error} — make sure <code style={{ color: "var(--cyan)" }}>uvicorn main:app --reload</code> is running on port 8000.
                        </div>
                    )}

                    {loading && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                            {tickers.map(t => (
                                <div key={t} style={{ background: "var(--panel)", border: "1px solid var(--border2)", borderRadius: 10, padding: 20, height: 230 }}>
                                    <div style={{ width: 70, height: 22, background: "var(--bg3)", borderRadius: 4, marginBottom: 10, opacity: 0.6 }} />
                                    <div style={{ width: "60%", height: 10, background: "var(--bg3)", borderRadius: 3, marginBottom: 16, opacity: 0.4 }} />
                                    <div style={{ display: "flex", gap: 8 }}>
                                        {[1, 2, 3].map(n => <div key={n} style={{ flex: 1, height: 50, background: "var(--bg3)", borderRadius: 6, opacity: 0.3 }} />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && sorted.length > 0 && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                            {sorted.map(d => (
                                <TickerCard key={d.ticker} data={d}
                                    isSelected={selected === d.ticker}
                                    onSelect={t => setSelected(s => s === t ? null : t)} />
                            ))}
                        </div>
                    )}

                    {!loading && results.length === 0 && !error && (
                        <div style={{ textAlign: "center", padding: "100px 0" }}>
                            <div style={{ fontFamily: "var(--font-head)", fontSize: 40, letterSpacing: 6, color: "var(--text-muted)", marginBottom: 12 }}>READY TO SCAN</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: 2 }}>ADD TICKERS AND HIT SCAN TO FETCH LIVE EPS DATA</div>
                        </div>
                    )}
                </main>

                {selectedData && <DetailPanel data={selectedData} onClose={() => setSelected(null)} />}
            </div>
        </>
    );
}