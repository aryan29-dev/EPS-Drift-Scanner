# EPS Drift Scanner

Earnings analytics tool that compares reported EPS with consensus analyst estimates across quarters, highlighting beats and misses while identifying surprises that are unusual relative to each company's own historical pattern.

**Live Demo:** [eps-drift-scanner.vercel.app](https://eps-drift-scanner.vercel.app)

![EPS Drift Scanner](demo.png)

## What It Does

- **EPS comparison:** Retrieves reported EPS and consensus analyst estimates for supported U.S.-listed equities.

- **Drift analysis:** Calculates the percentage difference between reported and estimated EPS for each quarter.

- **Beat and miss classification:** Categorizes each result as Strong Beat, Beat, In Line, Miss, or Strong Miss.

- **Trend analysis:** Classifies a company's EPS drift pattern as accelerating, decelerating, or stable.

- **Anomaly detection:** Uses scikit-learn to measure how unusual the latest earnings surprise is relative to the company's own historical drift pattern.

- **Configurable alerts:** Flags results when EPS drift exceeds a user-defined threshold.

- **Historical drill-down:** Displays earnings history, reported versus estimated EPS, and quarter-by-quarter drift charts.

## Drift Classification

Drift represents the percentage difference between reported EPS and the consensus analyst estimate.

| Drift | Classification |
| --- | --- |
| ≥ +10% | Strong Beat |
| +2% to +10% | Beat |
| −2% to +2% | In Line |
| −10% to −2% | Miss |
| ≤ −10% | Strong Miss |

The ±2% range treats relatively small differences as in-line results rather than meaningful beats or misses.

The anomaly score is calculated separately from these fixed classifications. A 6% earnings beat may be typical for one company but unusual for another, so the model evaluates each surprise relative to that company's own historical drift pattern.

## Coverage

The scanner currently supports U.S.-listed equities with available earnings-history data.

Canadian issuers were also tested, including cross-listed companies such as RY and TD on the NYSE. However, the current data provider restricts the required non-U.S. earnings history under its paid tier. These tickers can return company profile information without sufficient EPS history and are therefore excluded from the scanner.

## Tech Stack

| Area | Technology |
| --- | --- |
| Backend API | FastAPI |
| Data Source | Financial Modeling Prep API |
| Data Processing | pandas |
| Anomaly Detection | scikit-learn |
| Frontend | React, Vite |
| Charts | Recharts |
| Styling | CSS Modules |
| Backend Deployment | Render |
| Frontend Deployment | Vercel |

## Project Structure

```text
EPS-Drift-Scanner/
├── backend/
│   ├── main.py                  # FastAPI entry point
│   └── app/
│       ├── routers/             # API route handlers
│       ├── services/            # Data fetching, drift calculations, and ML scoring
│       ├── models/              # Pydantic schemas
│       └── utils/               # Logging utilities
└── frontend/
    └── src/
        ├── components/          # Header, controls, ticker cards, and detail panel
        ├── hooks/               # Scanner state and request logic
        ├── utils/               # API calls and formatting utilities
        └── styles/              # Global styles and theme
```

## Running Locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `backend/.env` file with your Financial Modeling Prep API key:

```text
FMP_KEY=your_key_here
```

Start the backend:

```bash
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), add one or more supported tickers, and run the scanner.

## Deployment

The FastAPI backend is deployed on Render, while the React frontend is deployed on Vercel.

For local development, the frontend connects to `http://localhost:8000/api`. In production, the API endpoint is configured through `VITE_API_URL`, while the backend reads the Financial Modeling Prep API key from the `FMP_KEY` environment variable.

The live backend runs on a free Render instance, so the first request after a period of inactivity may take approximately 30–60 seconds while the service starts.