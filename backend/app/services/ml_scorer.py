import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from typing import List
from app.utils.logger import setup_logger

logger = setup_logger(__name__)

def compute_ml_drift_score(drift_values: List[float]) -> float:
    if len(drift_values) < 3:
        return 0.0
    try:
        arr = np.array(drift_values, dtype=float)
        X = np.arange(len(arr)).reshape(-1, 1)
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        model = LinearRegression()
        model.fit(X_scaled, arr)
        predicted = model.predict(X_scaled)
        residuals = arr - predicted
        std = np.std(residuals)
        if std < 1e-6: return 0.0
        score = abs(residuals[-1]) / std
        return round(min(float(score), 10.0), 2)
    except Exception as e:
        logger.warning(f"ML score failed: {e}")
        return 0.0

def score_label(score: float) -> str:
    if score > 6: return "HIGH ANOMALY"
    if score > 3: return "MODERATE"
    return "NORMAL"