import { LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Legend } from "recharts";
import { driftColor, fmtDrift, trendColor, trendIcon } from "../utils/formatters";
import styles from "./DetailPanel.module.css";

export default function DetailPanel({ data, onClose }) {
    const chartData = data.eps_records.map(r => ({
        date: r.date?.slice(0, 7), actual: r.actual, estimate: r.estimate, drift: r.drift_pct,
    }));

    return (
        <div className={styles.panel}>
            <div className={styles.panelHeader}>
                <div>
                    <div className={styles.panelTicker}>{data.ticker}</div>
                    <div className={styles.panelName}>{data.company_name} · {data.sector}</div>
                </div>
                <button className={styles.closeBtn} onClick={onClose}>✕ CLOSE</button>
            </div>

            <div className={styles.kpiRow}>
                {[
                    { label: "PRICE", val: data.current_price ? `$${data.current_price.toFixed(2)}` : "—", color: "var(--text)" },
                    { label: "AVG DRIFT", val: fmtDrift(data.summary_stats?.avg_drift_pct), color: driftColor(data.summary_stats?.avg_drift_pct) },
                    { label: "BEAT RATE", val: data.summary_stats?.beat_rate_pct != null ? `${data.summary_stats.beat_rate_pct}%` : "—", color: "var(--cyan)" },
                    { label: "ML SCORE", val: data.ml_drift_score.toFixed(1), color: data.ml_drift_score > 6 ? "var(--red)" : data.ml_drift_score > 3 ? "var(--amber)" : "var(--green)" },
                ].map(k => (
                    <div key={k.label} className={styles.kpi}>
                        <div className={styles.kpiLabel}>{k.label}</div>
                        <div className={styles.kpiVal} style={{ color: k.color }}>{k.val}</div>
                    </div>
                ))}
            </div>

            <div className={styles.trendBadge} style={{ color: trendColor[data.drift_trend], borderColor: trendColor[data.drift_trend] + "44" }}>
                {trendIcon[data.drift_trend]} DRIFT TREND: {data.drift_trend.toUpperCase()}
            </div>

            <div className={styles.chartBlock}>
                <div className={styles.chartTitle}>ACTUAL vs ESTIMATE (EPS $)</div>
                <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={chartData} margin={{ left: -10, right: 10 }}>
                        <XAxis dataKey="date" tick={{ fontSize: 9, fill: "var(--text-muted)" }} />
                        <YAxis tick={{ fontSize: 9, fill: "var(--text-muted)" }} />
                        <Tooltip contentStyle={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 10 }} />
                        <Legend wrapperStyle={{ fontSize: 9 }} />
                        <Line type="monotone" dataKey="actual" stroke="var(--blue)" strokeWidth={2} dot={{ r: 3 }} name="Actual" />
                        <Line type="monotone" dataKey="estimate" stroke="var(--text-muted)" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Estimate" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.chartBlock}>
                <div className={styles.chartTitle}>DRIFT % PER QUARTER</div>
                <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={chartData} margin={{ left: -10, right: 10 }}>
                        <XAxis dataKey="date" tick={{ fontSize: 9, fill: "var(--text-muted)" }} />
                        <YAxis tick={{ fontSize: 9, fill: "var(--text-muted)" }} />
                        <Tooltip contentStyle={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 10 }} formatter={v => [fmtDrift(v), "Drift"]} />
                        <ReferenceLine y={0} stroke="var(--border)" />
                        <Bar dataKey="drift" radius={[3, 3, 0, 0]}>
                            {chartData.map((e, i) => <Cell key={i} fill={driftColor(e.drift)} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.tableBlock}>
                <div className={styles.chartTitle}>EARNINGS HISTORY</div>
                <div className={styles.tableHeader}><span>DATE</span><span>ACTUAL</span><span>EST</span><span>DRIFT</span><span>RESULT</span></div>
                {[...data.eps_records].reverse().map((r, i) => (
                    <div key={i} className={styles.tableRow}>
                        <span style={{ color: "var(--text-dim)" }}>{r.date}</span>
                        <span>{r.actual ?? "—"}</span>
                        <span style={{ color: "var(--text-muted)" }}>{r.estimate ?? "—"}</span>
                        <span style={{ color: driftColor(r.drift_pct) }}>{fmtDrift(r.drift_pct)}</span>
                        <span style={{ color: driftColor(r.drift_pct), fontSize: 9, letterSpacing: 1 }}>{r.surprise}</span>
                    </div>
                ))}
            </div>

            <div className={styles.mlBox}>
                <div className={styles.mlTitle}>HOW ML SCORE WORKS</div>
                <div className={styles.mlDesc}>
                    sklearn <code>LinearRegression</code> fits a trend to historical drift values. The latest residual is normalised by std-dev. Score &gt;6 = anomalous vs own history.
                </div>
            </div>
        </div>
    );
}