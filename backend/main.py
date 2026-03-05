from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import scanner, tickers
from app.utils.logger import setup_logger

logger = setup_logger(__name__)

app = FastAPI(
    title="EPS Drift Scanner API",
    description="Real-time EPS Drift Analysis",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scanner.router, prefix="/api/scanner", tags=["Scanner"])
app.include_router(tickers.router, prefix="/api/tickers", tags=["Tickers"])

@app.get("/")
def root():
    logger.info("Health check hit")
    return {"status": "ok", "message": "EPS Drift Scanner API running"}