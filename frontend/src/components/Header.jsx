import styles from "./Header.module.css";

export default function Header({ alertCount, lastScanned, tickerCount }) {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <div className={styles.top}>
                    <div className={styles.logo}>
                        <span className={styles.logoAccent}>EPS</span> Drift Scanner
                    </div>
                </div>
                <div className={styles.tagline}>
                    Tracks EPS beats and misses across quarters, flagging surprises that are unusual for each company.
                </div>
            </div>

            <div className={styles.right}>
                {lastScanned && (
                    <div className={styles.meta}>
                        <span className={styles.metaLabel}>Last Scan</span>
                        <span className={styles.metaVal}>{lastScanned}</span>
                    </div>
                )}

                {tickerCount > 0 && (
                    <div className={styles.meta}>
                        <span className={styles.metaLabel}>Tickers</span>
                        <span className={styles.metaVal}>{tickerCount}</span>
                    </div>
                )}

                {alertCount > 0 && (
                    <div className={styles.alertBadge}>
                        {alertCount} Alert{alertCount > 1 ? "s" : ""}
                    </div>
                )}

                <div className={styles.liveDot}>
                    <span className={styles.dot} /> Live
                </div>
            </div>
        </header>
    );
}
