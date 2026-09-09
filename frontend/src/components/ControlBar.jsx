import { useState } from "react";
import styles from "./ControlBar.module.css";

const POPULAR = ["AAPL", "MSFT", "NVDA", "TSLA", "AMZN", "META", "GOOGL", "JPM", "AMD", "NFLX"];

const SORT_OPTIONS = [
    { val: "drift", label: "Avg Drift" },
    { val: "ml", label: "ML Score" },
    { val: "beat", label: "Beat Rate" },
    { val: "ticker", label: "Ticker A–Z" },
];

export default function ControlBar({ tickers, setTickers, threshold, setThreshold, sortBy, setSortBy, onScan, loading }) {
    const [input, setInput] = useState("");

    const add = (t) => {
        const up = t.trim().toUpperCase();
        if (up && !tickers.includes(up)) setTickers(p => [...p, up]);
        setInput("");
    };

    const remove = (t) => setTickers(p => p.filter(x => x !== t));

    const quickAdd = POPULAR.filter(p => !tickers.includes(p));

    return (
        <div className={styles.wrap}>
            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label}>Add Ticker</label>
                    <div className={styles.inputRow}>
                        <input
                            className={styles.input}
                            value={input}
                            onChange={e => setInput(e.target.value.toUpperCase())}
                            onKeyDown={e => e.key === "Enter" && add(input)}
                            placeholder="e.g. AAPL"
                            maxLength={6}
                        />
                        <button className={styles.addBtn} onClick={() => add(input)}>Add</button>
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Alert Threshold (%)</label>
                    <input
                        className={styles.input}
                        type="number"
                        min={1}
                        max={50}
                        value={threshold}
                        onChange={e => setThreshold(Number(e.target.value))}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Sort By</label>
                    <div className={styles.customSelect}>
                        {SORT_OPTIONS.map(opt => (
                            <div
                                key={opt.val}
                                className={`${styles.customOption} ${sortBy === opt.val ? styles.activeOption : ""}`}
                                onClick={() => setSortBy(opt.val)}
                            >
                                {opt.label}
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className={`${styles.scanBtn} ${loading ? styles.scanning : ""}`}
                    onClick={() => onScan(tickers, threshold)}
                    disabled={loading || !tickers.length}
                >
                    {loading ? <><span className={styles.spinner} /> Scanning</> : "Scan"}
                </button>
            </div>

            <div className={styles.chipRow}>
                <span className={styles.chipLabel}>Active</span>
                {tickers.map(t => (
                    <div key={t} className={styles.chip}>
                        {t}
                        <span className={styles.chipX} onClick={() => remove(t)}>✕</span>
                    </div>
                ))}

                <span className={styles.divider} />

                <span className={styles.chipLabel}>Quick Add</span>
                {quickAdd.map(p => (
                    <div key={p} className={styles.ghostChip} onClick={() => add(p)}>{p}</div>
                ))}
            </div>
        </div>
    );
}
