from fastapi import APIRouter

router = APIRouter()

POPULAR_TICKERS = [
    "AAPL","MSFT","NVDA","TSLA","AMZN",
    "META","GOOGL","JPM","AMD","NFLX",
    "ORCL","INTC","CRM","UBER","SNOW",
]

SECTORS = {
    "Tech":    ["AAPL","MSFT","NVDA","AMD","INTC","ORCL","CRM","SNOW"],
    "Auto":    ["TSLA"],
    "Retail":  ["AMZN"],
    "Social":  ["META","SNAP"],
    "Finance": ["JPM","GS","BAC"],
    "Media":   ["NFLX","DIS"],
    "Mobility":["UBER","LYFT"],
}

@router.get("/popular")
def get_popular():
    return {"tickers": POPULAR_TICKERS}

@router.get("/by-sector")
def get_by_sector():
    return {"sectors": SECTORS}