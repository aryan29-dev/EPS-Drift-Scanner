import pandas as pd
from typing import Optional, List
from app.models.schemas import EPSRecord, SummaryStats
from app.utils.logger import setup_logger

logger = setup_logger(__name__)

def compute_drift_pct(actual: float, estimate: float) -> Optional[float]:
    try:
        if pd.notna(estimate) and estimate != 0:
            return round(((actual - estimate) / abs(estimate)) * 100, 2)
    except Exception:
        pass
    return None

def classify_surprise(drift_pct: Optional[float]) -> str:
    if drift_pct is None: return "N/A"
    if drift_pct >= 10:   return "STRONG BEAT"
    if drift_pct >= 2:    return "BEAT"
    if drift_pct >= -2:   return "IN LINE"
    if drift_pct >= -10:  return "MISS"
    return "STRONG MISS"

def build_eps_records(df: pd.DataFrame) -> tuple[List[EPSRecord], List[float]]:
    records, drift_values = [], []
    for _, row in df.iterrows():
        actual   = row.get("actual")
        estimate = row.get("estimate")
        drift_pct = compute_drift_pct(actual, estimate) if pd.notna(actual) and pd.notna(estimate) else None
        if drift_pct is not None:
            drift_values.append(drift_pct)
        records.append(EPSRecord(
            date=str(row["date"]),
            actual=round(float(actual), 4) if pd.notna(actual) else None,
            estimate=round(float(estimate), 4) if pd.notna(estimate) else None,
            drift_pct=drift_pct,
            surprise=classify_surprise(drift_pct),
        ))
    return records, drift_values

def compute_summary_stats(drift_values: List[float]) -> SummaryStats:
    if not drift_values:
        return SummaryStats(avg_drift_pct=None, max_beat_pct=None,
                            max_miss_pct=None, beat_rate_pct=None, quarters_tracked=0)
    s = pd.Series(drift_values)
    return SummaryStats(
        avg_drift_pct=round(float(s.mean()), 2),
        max_beat_pct=round(float(s.max()), 2),
        max_miss_pct=round(float(s.min()), 2),
        beat_rate_pct=round(float((s > 0).mean() * 100), 1),
        quarters_tracked=len(drift_values),
    )

def detect_drift_trend(drift_values: List[float]) -> str:
    if len(drift_values) < 3: return "stable"
    recent = drift_values[-3:]
    if recent[-1] > recent[0] + 2: return "accelerating"
    if recent[-1] < recent[0] - 2: return "decelerating"
    return "stable"

def build_alert(ticker: str, drift_values: List[float], threshold: float) -> Optional[str]:
    if not drift_values: return None
    latest = drift_values[-1]
    if abs(latest) >= threshold:
        direction = "BEAT" if latest > 0 else "MISS"
        return f"Latest EPS {direction} of {latest:+.1f}% exceeds {threshold}% threshold"
    return None