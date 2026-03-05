import { useState } from "react";
import styles from "./ControlBar.module.css";

const POPULAR = ["AAPL", "MSFT", "NVDA", "TSLA", "AMZN", "META", "GOOGL", "JPM", "AMD", "NFLX"];

export default function ControlBar({ tickers, setTickers, threshold, setThreshold, sortBy, setSortBy, onScan, loading }) {
    const [input, setInput] = useState("");

    const add = (t) => {
        const up = t.trim().toUpperCase();
        if (up && !tickers.includes(up)) setTickers(p => [...p, up]);
        setInput("");
    };

    return (
        <div className={styles.wrap}>
            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label}>ADD TICKER</label>
                    <div className={styles.inputRow}>
                        <input className={styles.input} value={input}
                            onChange={e => setInput(e.target.value.toUpperCase())}
                            onKeyDown={e => e.key === "Enter" && add(input)}
                            placeholder="e.g. AAPL" maxLength={6} />
                        <button className={styles.addBtn} onClick={() => add(input)}>+ ADD</button>
                    </div>
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>ALERT THRESHOLD (%)</label>
                    <input className={styles.input} type="number" min={1} max={50}
                        value={threshold} onChange={e => setThreshold(Number(e.target.value))} />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>SORT BY</label>
                    <select className={styles.select} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="drift">AVG DRIFT</option>
                        <option value="ml">ML SCORE</option>
                        <option value="beat">BEAT RATE</option>
                        <option value="ticker">TICKER A–Z</option>
                    </select>
                </div>
                <button className={`${styles.scanBtn} ${loading ? styles.scanning : ""}`}
                    onClick={() => onScan(tickers, threshold)} disabled={loading || !tickers.length}>
                    {loading ? <><span className={styles.spinner} /> SCANNING</> : "▶ SCAN"}
                </button>
            </div>
            <div className={styles.chipRow}>
                <span className={styles.chipLabel}>ACTIVE:</span>
                {tickers.map(t => (
                    <div key={t} className={styles.chip}>
                        {t} <span className={styles.chipX} onClick={() => setTickers(p => p.filter(x => x !== t))}>✕</span>
                    </div>
                ))}
                <span className={styles.divider} />
                <span className={styles.chipLabel}>QUICK ADD:</span>
                {POPULAR.filter(p => !tickers.includes(p)).map(p => (
                    <div key={p} className={styles.ghostChip} onClick={() => add(p)}>+{p}</div>
                ))}
            </div>
        </div>
    );
}