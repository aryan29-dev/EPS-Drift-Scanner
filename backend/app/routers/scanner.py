from fastapi import APIRouter
from typing import List
from app.models.schemas import ScanRequest, TickerResult, SummaryStats
from app.services.data_fetcher import fetch_ticker_info, fetch_earnings_history
from app.services.drift_calculator import (
    build_eps_records, compute_summary_stats, detect_drift_trend, build_alert
)
from app.services.ml_scorer import compute_ml_drift_score
from app.utils.logger import setup_logger

router = APIRouter()
logger = setup_logger(__name__)

@router.post("/scan", response_model=List[TickerResult])
def scan_tickers(req: ScanRequest):
    results = []
    for symbol in req.tickers:
        symbol = symbol.upper().strip()
        try:
            info        = fetch_ticker_info(symbol)
            earnings_df = fetch_earnings_history(symbol)
            eps_records, drift_values = build_eps_records(earnings_df)
            summary     = compute_summary_stats(drift_values)
            drift_trend = detect_drift_trend(drift_values)
            ml_score    = compute_ml_drift_score(drift_values)
            alert       = build_alert(symbol, drift_values, req.alert_threshold)
            results.append(TickerResult(
                ticker=symbol, company_name=info["company_name"],
                sector=info["sector"], current_price=info["current_price"],
                eps_records=eps_records, drift_trend=drift_trend,
                ml_drift_score=ml_score, alert=alert, summary_stats=summary,
            ))
        except Exception as e:
            logger.error(f"Failed {symbol}: {e}")
            results.append(TickerResult(
                ticker=symbol, company_name=symbol, sector="Error",
                current_price=None, eps_records=[], drift_trend="stable",
                ml_drift_score=0.0, alert=f"Error: {e}",
                summary_stats=SummaryStats(avg_drift_pct=None, max_beat_pct=None,
                    max_miss_pct=None, beat_rate_pct=None, quarters_tracked=0),
            ))
    return results