import { useState } from "react";
import "./styles/globals.css";
import styles from "./App.module.css";
import Header from "./components/Header";
import ControlBar from "./components/ControlBar";
import TickerCard from "./components/TickerCard";
import DetailPanel from "./components/DetailPanel";
import { useScan } from "./hooks/useScan";

export default function App() {
    const [tickers, setTickers] = useState(["AAPL", "MSFT", "NVDA"]);
    const [threshold, setThreshold] = useState(5);
    const [sortBy, setSortBy] = useState("drift");
    const [selected, setSelected] = useState(null);

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
            <Header alertCount={alertCount} lastScanned={lastScanned} tickerCount={results.length} />

            <ControlBar
                tickers={tickers}
                setTickers={setTickers}
                threshold={threshold}
                setThreshold={setThreshold}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onScan={scan}
                loading={loading}
            />

            <main className={`${styles.main} ${selectedData ? styles.narrowed : ""}`}>
                {error && (
                    <div className={styles.error}>
                        {error} — check that <code>uvicorn main:app --reload</code> is running on port 8000.
                    </div>
                )}

                {loading && (
                    <div className={styles.grid}>
                        {tickers.map(t => (
                            <div key={t} className={styles.skeleton}>
                                <div className={styles.skelTicker} />
                                <div className={styles.skelName} />
                                <div className={styles.skelStats}>
                                    {[1, 2, 3].map(n => <div key={n} className={styles.skelBox} />)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && sorted.length > 0 && (
                    <div className={styles.grid}>
                        {sorted.map(d => (
                            <TickerCard
                                key={d.ticker}
                                data={d}
                                isSelected={selected === d.ticker}
                                onSelect={t => setSelected(s => s === t ? null : t)}
                            />
                        ))}
                    </div>
                )}

                {!loading && results.length === 0 && !error && (
                    <div className={styles.empty}>
                        <p className={styles.emptyTitle}>No results yet</p>
                        <p className={styles.emptyHint}>Add tickers above and run a scan to pull EPS data.</p>
                    </div>
                )}
            </main>

            {selectedData && <DetailPanel data={selectedData} onClose={() => setSelected(null)} />}
        </>
    );
}
