import { LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Legend } from "recharts";
import { driftColor, fmtDrift, trendColor, trendBorder, trendIcon } from "../utils/formatters";
import styles from "./DetailPanel.module.css";

const AXIS_TICK = { fontSize: 11, fill: "var(--text-muted)" };

const TOOLTIP_STYLE = {
    background: "var(--panel-alt)",
    border: "1px solid var(--border2)",
    borderRadius: 6,
    fontSize: 12,
};

const TOOLTIP_LABEL = { color: "var(--text)", fontWeight: 500, marginBottom: 4 };
const TOOLTIP_ITEM = { color: "var(--text-dim)" };

export default function DetailPanel({ data, onClose }) {
    const chartData = data.eps_records.map(r => ({
        date: r.date?.slice(0, 7),
        actual: r.actual,
        estimate: r.estimate,
        drift: r.drift_pct,
    }));

    const trendLabel = data.drift_trend.charAt(0).toUpperCase() + data.drift_trend.slice(1);

    return (
        <div className={styles.panel}>
            <div className={styles.panelHeader}>
                <div>
                    <div className={styles.panelTicker}>{data.ticker}</div>
                    <div className={styles.panelName}>{data.company_name} · {data.sector}</div>
                </div>
                <button className={styles.closeBtn} onClick={onClose}>Close</button>
            </div>

            <div className={styles.kpiRow}>
                {[
                    { label: "Price", val: data.current_price ? `$${data.current_price.toFixed(2)}` : "—", color: "var(--text)" },
                    { label: "Avg Drift", val: fmtDrift(data.summary_stats?.avg_drift_pct), color: driftColor(data.summary_stats?.avg_drift_pct) },
                    { label: "Beat Rate", val: data.summary_stats?.beat_rate_pct != null ? `${data.summary_stats.beat_rate_pct}%` : "—", color: "var(--text)" },
                    { label: "ML Score", val: data.ml_drift_score.toFixed(1), color: data.ml_drift_score > 6 ? "var(--red)" : data.ml_drift_score > 3 ? "var(--amber)" : "var(--green)" },
                ].map(k => (
                    <div key={k.label} className={styles.kpi}>
                        <div className={styles.kpiLabel}>{k.label}</div>
                        <div className={styles.kpiVal} style={{ color: k.color }}>{k.val}</div>
                    </div>
                ))}
            </div>

            <div
                className={styles.trendBadge}
                style={{ color: trendColor[data.drift_trend], borderColor: trendBorder[data.drift_trend] }}
            >
                {trendIcon[data.drift_trend]} Drift trend: {trendLabel}
            </div>

            <div className={styles.chartBlock}>
                <div className={styles.chartTitle}>Actual vs Estimate (EPS $)</div>
                <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={chartData} margin={{ left: -10, right: 10 }}>
                        <XAxis dataKey="date" tick={AXIS_TICK} />
                        <YAxis tick={AXIS_TICK} />
                        <Tooltip
                            contentStyle={TOOLTIP_STYLE}
                            labelStyle={TOOLTIP_LABEL}
                            itemStyle={TOOLTIP_ITEM}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-dim)" }} />
                        <Line type="monotone" dataKey="actual" stroke="var(--accent)" strokeWidth={2} dot={{ r: 3 }} name="Actual" />
                        <Line type="monotone" dataKey="estimate" stroke="var(--text-muted)" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Estimate" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.chartBlock}>
                <div className={styles.chartTitle}>Drift % per Quarter</div>
                <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={chartData} margin={{ left: -10, right: 10 }}>
                        <XAxis dataKey="date" tick={AXIS_TICK} />
                        <YAxis tick={AXIS_TICK} />
                        <Tooltip
                            cursor={{ fill: "rgba(255, 255, 255, 0.04)" }}
                            contentStyle={TOOLTIP_STYLE}
                            labelStyle={TOOLTIP_LABEL}
                            itemStyle={TOOLTIP_ITEM}
                            formatter={v => [fmtDrift(v), "Drift"]}
                        />
                        <ReferenceLine y={0} stroke="var(--border2)" />
                        <Bar dataKey="drift" radius={[3, 3, 0, 0]}>
                            {chartData.map((e, i) => <Cell key={i} fill={driftColor(e.drift)} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.tableBlock}>
                <div className={styles.chartTitle}>Earnings History</div>
                <div className={styles.tableHeader}>
                    <span>Date</span><span>Actual</span><span>Est</span><span>Drift</span><span>Result</span>
                </div>
                {[...data.eps_records].reverse().map((r, i) => (
                    <div key={i} className={styles.tableRow}>
                        <span style={{ color: "var(--text-dim)" }}>{r.date}</span>
                        <span>{r.actual ?? "—"}</span>
                        <span style={{ color: "var(--text-muted)" }}>{r.estimate ?? "—"}</span>
                        <span style={{ color: driftColor(r.drift_pct) }}>{fmtDrift(r.drift_pct)}</span>
                        <span className={styles.result} style={{ color: driftColor(r.drift_pct) }}>{r.surprise}</span>
                    </div>
                ))}
            </div>

            <div className={styles.mlBox}>
                <div className={styles.mlTitle}>How the ML score works</div>
                <div className={styles.mlDesc}>
                    Flags when a company's latest EPS drift is unusually large compared to its own historical pattern, rather than against a fixed threshold.
                </div>
            </div>
        </div>
    );
}
