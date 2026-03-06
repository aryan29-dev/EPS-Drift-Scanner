import requests
import pandas as pd
from app.utils.logger import setup_logger

logger = setup_logger(__name__)

FMP_KEY = "tLiZze5dweH3ufM0xXfWGZBZe79MD1MP"
BASE = "https://financialmodelingprep.com/stable"


def fetch_ticker_info(symbol: str) -> dict:
    try:
        r = requests.get(f"{BASE}/profile", params={"symbol": symbol, "apikey": FMP_KEY}, timeout=10)
        data = r.json()

        if not data or not isinstance(data, list) or len(data) == 0:
            raise ValueError(f"{symbol} is not a valid or listed ticker")

        profile = data[0]
        return {
            "company_name": profile.get("companyName") or symbol,
            "sector": profile.get("sector") or "Unknown",
            "current_price": float(profile.get("price") or 0),
        }
    except Exception as e:
        logger.warning(f"Invalid ticker {symbol}: {e}")
        raise ValueError(f"'{symbol}' not found — check the ticker symbol")


def fetch_earnings_history(symbol: str, max_quarters: int = 12) -> pd.DataFrame:
    try:
        r = requests.get(f"{BASE}/earnings", params={"symbol": symbol, "apikey": FMP_KEY}, timeout=10)
        data = r.json()

        if not data or not isinstance(data, list):
            return pd.DataFrame(columns=["date", "actual", "estimate"])

        rows = []
        for q in data[:max_quarters]:
            actual = q.get("epsActual")
            estimate = q.get("epsEstimated")
            date = q.get("date")
            if actual is not None and date:
                rows.append({
                    "date": date,
                    "actual": float(actual),
                    "estimate": float(estimate) if estimate is not None else None,
                })

        df = pd.DataFrame(rows)
        if df.empty:
            return pd.DataFrame(columns=["date", "actual", "estimate"])

        return df.sort_values("date").reset_index(drop=True)

    except Exception as e:
        logger.error(f"fetch_earnings_history failed for {symbol}: {e}")
        return pd.DataFrame(columns=["date", "actual", "estimate"])