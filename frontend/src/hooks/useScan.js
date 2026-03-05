import { useState, useCallback } from "react";
import { scanTickers } from "../utils/api";

export function useScan() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastScanned, setLastScanned] = useState(null);

    const scan = useCallback(async (tickers, threshold) => {
        if (!tickers.length) return;
        setLoading(true); setError(null); setResults([]);
        try {
            const data = await scanTickers(tickers, threshold);
            setResults(data);
            setLastScanned(new Date().toLocaleTimeString());
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const alertCount = results.filter(
        r => r.alert && !r.alert.startsWith("Error")
    ).length;

    return { results, loading, error, lastScanned, alertCount, scan };
}