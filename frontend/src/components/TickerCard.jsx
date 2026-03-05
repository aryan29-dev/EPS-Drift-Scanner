import { BarChart, Bar, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { driftColor, fmtDrift, trendColor, trendIcon } from "../utils/formatters";
import styles from "./TickerCard.module.css";

function MLBar({ score }) {
    const pct = Math.min((score / 10) * 100, 100);
    const color = score > 6 ? "var(--red)" : score > 3 ? "var(--amber)" : "var(--green)";
    return (
        <div className={styles.mlWrap}>
            <span className={styles.mlLabel}>ML ANOMALY</span>
            <div className={styles.mlTrack}>
                <div className={styles.mlFill} style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className={styles.mlScore} style={{ color }}>{score.toFixed(1)}</span>
        </div>
    );
}

export default function TickerCard({ data, isSelected, onSelect }) {
    const chartData = data.eps_records.map(r => ({ date: r.date?.slice(0, 7), drift: r.drift_pct }));
    const latest = data.eps_records[data.eps_records.length - 1];

    return (
        <div className={`${styles.card} ${isSelected ? styles.selected : ""} ${data.alert && !data.alert.startsWith("Error") ? styles.alerted : ""}`}
            onClick={() => onSelect(data.ticker)}>
            <div className={styles.topRow}>
                <div>
                    <div className={styles.ticker}>{data.ticker}</div>
                    <div className={styles.name}>{data.company_name} · {data.sector}</div>
                </div>
                <div className={styles.topRight}>
                    <div className={styles.price}>{data.current_price ? `$${data.current_price.toFixed(2)}` : "—"}</div>
                    {latest?.drift_pct != null && (
                        <div style={{ color: driftColor(latest.drift_pct), fontSize: 13, marginTop: 2 }}>
                            {fmtDrift(latest.drift_pct)}
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.badges}>
                {!data.alert?.startsWith("Error") && (
                    <span className={styles.badge} style={{ color: trendColor[data.drift_trend], borderColor: trendColor[data.drift_trend] + "44", background: trendColor[data.drift_trend] + "11" }}>
                        {trendIcon[data.drift_trend]} {data.drift_trend.toUpperCase()}
                    </span>
                )}
                {data.alert && !data.alert.startsWith("Error") && (
                    <span className={styles.badge} style={{ color: "var(--red)", borderColor: "#ff335544", background: "#ff335511" }}>⚠ ALERT</span>
                )}
            </div>
            <div className={styles.stats}>
                {[
                    { label: "AVG DRIFT", val: fmtDrift(data.summary_stats?.avg_drift_pct), color: driftColor(data.summary_stats?.avg_drift_pct) },
                    { label: "BEAT RATE", val: data.summary_stats?.beat_rate_pct != null ? `${data.summary_stats.beat_rate_pct}%` : "—", color: "var(--cyan)" },
                    { label: "QUARTERS", val: data.summary_stats?.quarters_tracked || "—", color: "var(--text-dim)" },
                ].map(s => (
                    <div key={s.label} className={styles.statBox}>
                        <div className={styles.statLabel}>{s.label}</div>
                        <div className={styles.statVal} style={{ color: s.color }}>{s.val}</div>
                    </div>
                ))}
            </div>
            <MLBar score={data.ml_drift_score} />
            {chartData.length > 1 && (
                <ResponsiveContainer width="100%" height={64}>
                    <BarChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                        <XAxis dataKey="date" hide />
                        <Tooltip contentStyle={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 5, fontSize: 10 }} formatter={v => [fmtDrift(v), "Drift"]} />
                        <ReferenceLine y={0} stroke="var(--border)" />
                        <Bar dataKey="drift" radius={[2, 2, 0, 0]}>
                            {chartData.map((e, i) => <Cell key={i} fill={driftColor(e.drift)} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
            {data.alert && !data.alert.startsWith("Error") && <div className={styles.alertMsg}>{data.alert}</div>}
            {data.alert?.startsWith("Error") && <div className={styles.errorMsg}>{data.alert}</div>}
        </div>
    );
}