import styles from "./Header.module.css";

export default function Header({ alertCount, lastScanned, tickerCount }) {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <div className={styles.logo}>
                    <span className={styles.logoAccent}>EPS</span> DRIFT SCANNER
                </div>
                <div className={styles.tagline}>yfinance · pandas · sklearn · fastapi</div>
            </div>
            <div className={styles.right}>
                {lastScanned && (
                    <div className={styles.meta}>
                        <span className={styles.metaLabel}>LAST SCAN</span>
                        <span className={styles.metaVal}>{lastScanned}</span>
                    </div>
                )}
                {tickerCount > 0 && (
                    <div className={styles.meta}>
                        <span className={styles.metaLabel}>TICKERS</span>
                        <span className={styles.metaVal}>{tickerCount}</span>
                    </div>
                )}
                {alertCount > 0 && (
                    <div className={styles.alertBadge}>⚠ {alertCount} ALERT{alertCount > 1 ? "S" : ""}</div>
                )}
                <div className={styles.liveDot}>
                    <span className={styles.dot} /> LIVE
                </div>
            </div>
        </header>
    );
}