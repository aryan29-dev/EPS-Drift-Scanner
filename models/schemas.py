from pydantic import BaseModel, Field
from typing import List, Optional

class ScanRequest(BaseModel):
    tickers: List[str] = Field(..., min_items=1, max_items=20)
    alert_threshold: float = Field(default=5.0, ge=1.0, le=50.0)

class EPSRecord(BaseModel):
    date: str
    actual: Optional[float]
    estimate: Optional[float]
    drift_pct: Optional[float]
    surprise: Optional[str]

class SummaryStats(BaseModel):
    avg_drift_pct: Optional[float]
    max_beat_pct: Optional[float]
    max_miss_pct: Optional[float]
    beat_rate_pct: Optional[float]
    quarters_tracked: int

class TickerResult(BaseModel):
    ticker: str
    company_name: str
    sector: str
    current_price: Optional[float]
    eps_records: List[EPSRecord]
    drift_trend: str
    ml_drift_score: float
    alert: Optional[str]
    summary_stats: SummaryStats