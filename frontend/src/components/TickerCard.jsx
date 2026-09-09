import { BarChart, Bar, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { driftColor, fmtDrift, trendColor, trendTint, trendBorder, trendIcon } from "../utils/formatters";
import styles from "./TickerCard.module.css";

const TOOLTIP_STYLE = {
    background: "var(--panel-alt)",
    border: "1px solid var(--border2)",
    borderRadius: 6,
    fontSize: 12,
};

const TOOLTIP_LABEL = { color: "var(--text)", fontWeight: 500, marginBottom: 4 };
const TOOLTIP_ITEM = { color: "var(--text-dim)" };

function MLBar({ score }) {
    const pct = Math.min((score / 10) * 100, 100);
    const color = score > 6 ? "var(--red)" : score > 3 ? "var(--amber)" : "var(--green)";
    return (
        <div className={styles.mlWrap}>
            <span className={styles.mlLabel}>ML Anomaly</span>
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
    const hasError = data.alert?.startsWith("Error");
    const hasAlert = data.alert && !hasError;
    const trendLabel = data.drift_trend.charAt(0).toUpperCase() + data.drift_trend.slice(1);

    return (
        <div
            className={`${styles.card} ${isSelected ? styles.selected : ""} ${hasAlert ? styles.alerted : ""}`}
            onClick={() => onSelect(data.ticker)}
        >
            <div className={styles.topRow}>
                <div>
                    <div className={styles.ticker}>{data.ticker}</div>
                    <div className={styles.name}>{data.company_name} · {data.sector}</div>
                </div>
                <div className={styles.topRight}>
                    <div className={styles.price}>
                        {data.current_price ? `$${data.current_price.toFixed(2)}` : "—"}
                    </div>
                    {latest?.drift_pct != null && (
                        <div className={styles.latestDrift} style={{ color: driftColor(latest.drift_pct) }}>
                            {fmtDrift(latest.drift_pct)}
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.badges}>
                {!hasError && (
                    <span
                        className={styles.badge}
                        style={{
                            color: trendColor[data.drift_trend],
                            borderColor: trendBorder[data.drift_trend],
                            background: trendTint[data.drift_trend],
                        }}
                    >
                        {trendIcon[data.drift_trend]} {trendLabel}
                    </span>
                )}
                {hasAlert && (
                    <span
                        className={styles.badge}
                        style={{
                            color: "var(--red)",
                            borderColor: "rgba(245, 114, 106, 0.35)",
                            background: "rgba(245, 114, 106, 0.12)",
                        }}
                    >
                        Alert
                    </span>
                )}
            </div>

            <div className={styles.stats}>
                {[
                    { label: "Avg Drift", val: fmtDrift(data.summary_stats?.avg_drift_pct), color: driftColor(data.summary_stats?.avg_drift_pct) },
                    { label: "Beat Rate", val: data.summary_stats?.beat_rate_pct != null ? `${data.summary_stats.beat_rate_pct}%` : "—", color: "var(--text)" },
                    { label: "Quarters", val: data.summary_stats?.quarters_tracked || "—", color: "var(--text-dim)" },
                ].map(s => (
                    <div key={s.label} className={styles.statBox}>
                        <div className={styles.statLabel}>{s.label}</div>
                        <div className={styles.statVal} style={{ color: s.color }}>{s.val}</div>
                    </div>
                ))}
            </div>

            <MLBar score={data.ml_drift_score} />

            {chartData.length > 1 && (
                <div className={styles.chart}>
                    <ResponsiveContainer width="100%" height={64}>
                        <BarChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                            <XAxis dataKey="date" hide />
                            <Tooltip
                                cursor={{ fill: "rgba(255, 255, 255, 0.04)" }}
                                contentStyle={TOOLTIP_STYLE}
                                labelStyle={TOOLTIP_LABEL}
                                itemStyle={TOOLTIP_ITEM}
                                formatter={v => [fmtDrift(v), "Drift"]}
                            />
                            <ReferenceLine y={0} stroke="var(--border2)" />
                            <Bar dataKey="drift" radius={[2, 2, 0, 0]}>
                                {chartData.map((e, i) => <Cell key={i} fill={driftColor(e.drift)} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {hasAlert && <div className={styles.alertMsg}>{data.alert}</div>}
            {hasError && <div className={styles.errorMsg}>{data.alert}</div>}
        </div>
    );
}
