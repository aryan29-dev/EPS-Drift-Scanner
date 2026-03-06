import requests
import pandas as pd
from app.utils.logger import setup_logger

logger = setup_logger(__name__)

AV_KEY = "CK46SM2DEPI9PM7H"
BASE = "https://www.alphavantage.co/query"


def fetch_ticker_info(symbol: str) -> dict:
    try:
        r = requests.get(BASE, params={
            "function": "OVERVIEW",
            "symbol": symbol,
            "apikey": AV_KEY
        }, timeout=10)
        data = r.json()

        if not data or "Symbol" not in data:
            raise ValueError(f"{symbol} is not a valid or listed ticker")

        price_r = requests.get(BASE, params={
            "function": "GLOBAL_QUOTE",
            "symbol": symbol,
            "apikey": AV_KEY
        }, timeout=10)
        price_data = price_r.json().get("Global Quote", {})

        return {
            "company_name": data.get("Name") or symbol,
            "sector": data.get("Sector") or "Unknown",
            "current_price": float(price_data.get("05. price", 0) or 0),
        }
    except Exception as e:
        logger.warning(f"Invalid ticker {symbol}: {e}")
        raise ValueError(f"'{symbol}' not found — check the ticker symbol")


def fetch_earnings_history(symbol: str, max_quarters: int = 12) -> pd.DataFrame:
    try:
        r = requests.get(BASE, params={
            "function": "EARNINGS",
            "symbol": symbol,
            "apikey": AV_KEY
        }, timeout=10)
        data = r.json()

        quarters = data.get("quarterlyEarnings", [])
        if not quarters:
            return pd.DataFrame(columns=["date", "actual", "estimate"])

        rows = []
        for q in quarters[:max_quarters]:
            actual = q.get("reportedEPS")
            estimate = q.get("estimatedEPS")
            date = q.get("fiscalDateEnding")
            if actual and actual != "None" and date:
                rows.append({
                    "date": date,
                    "actual": float(actual),
                    "estimate": float(estimate) if estimate and estimate != "None" else None,
                })

        df = pd.DataFrame(rows)
        if df.empty:
            return pd.DataFrame(columns=["date", "actual", "estimate"])

        return df.sort_values("date").reset_index(drop=True)

    except Exception as e:
        logger.error(f"fetch_earnings_history failed for {symbol}: {e}")
        return pd.DataFrame(columns=["date", "actual", "estimate"])