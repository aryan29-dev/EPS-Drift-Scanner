import yfinance as yf
import pandas as pd
from app.utils.logger import setup_logger

logger = setup_logger(__name__)

yf.set_tz_cache_location("/tmp")

def fetch_ticker_info(symbol: str) -> dict:
    try:
        t = yf.Ticker(symbol)
        t._session = None
        info = t.info

        if not info or len(info) < 5 or ("regularMarketPrice" not in info and "currentPrice" not in info):
            raise ValueError(f"{symbol} is not a valid or listed ticker")

        return {
            "company_name": info.get("longName") or info.get("shortName") or symbol,
            "sector": info.get("sector") or "Unknown",
            "current_price": info.get("currentPrice") or info.get("regularMarketPrice"),
        }
    except Exception as e:
        logger.warning(f"Invalid ticker {symbol}: {e}")
        raise ValueError(f"'{symbol}' not found — check the ticker symbol")


def fetch_earnings_history(symbol: str, max_quarters: int = 12) -> pd.DataFrame:
    try:
        t = yf.Ticker(symbol)
        df = t.earnings_dates
        if df is None or df.empty:
            return pd.DataFrame(columns=["date", "actual", "estimate"])

        df = df[df["Reported EPS"].notna()].head(max_quarters).sort_index()
        return pd.DataFrame({
            "date": df.index.date.astype(str),
            "actual": pd.to_numeric(df["Reported EPS"], errors="coerce"),
            "estimate": pd.to_numeric(df.get("EPS Estimate"), errors="coerce"),
        })
    except Exception as e:
        logger.error(f"fetch_earnings_history failed for {symbol}: {e}")
        return pd.DataFrame(columns=["date", "actual", "estimate"])