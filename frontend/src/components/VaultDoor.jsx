import { useState, useEffect, useRef } from "react";

export default function VaultDoor({ onComplete }) {
    const [phase, setPhase] = useState("boot");
    const [scanY, setScanY] = useState(-5);
    const [digits, setDigits] = useState("------");
    const [unlocked, setUnlocked] = useState(false);
    const [open, setOpen] = useState(false);
    const [bootLines, setBootLines] = useState([]);
    const [showHUD, setShowHUD] = useState(false);
    const scanRef = useRef(null);
    const intervalRef = useRef(null);

    const BOOT_SEQUENCE = [
        "INITIALIZING EPS DRIFT SCANNER v4.2.1",
        "LOADING MARKET DATA MODULES...",
        "CONNECTING TO FINANCIAL FEEDS...",
        "AUTHENTICATING USER CREDENTIALS...",
        "VAULT SECURITY PROTOCOL ENGAGED",
    ];

    useEffect(() => {
        // Boot text lines appear one by one
        BOOT_SEQUENCE.forEach((line, i) => {
            setTimeout(() => {
                setBootLines(prev => [...prev, line]);
            }, i * 200);
        });

        // Show main HUD after boot
        setTimeout(() => {
            setShowHUD(true);
            setPhase("scanning");
        }, 1400);

        // Start digit cracking
        setTimeout(() => {
            let count = 0;
            intervalRef.current = setInterval(() => {
                const rand = Math.floor(Math.random() * 999999).toString().padStart(6, "0");
                setDigits(rand);
                count++;
                if (count > 18) {
                    clearInterval(intervalRef.current);
                    setDigits("GRANTED");
                    setUnlocked(true);
                    setPhase("unlocked");
                }
            }, 70);
        }, 1800);

        // Open doors
        setTimeout(() => {
            setOpen(true);
            setPhase("open");
            if (scanRef.current) clearInterval(scanRef.current);
        }, 3000);

        // Done
        setTimeout(() => onComplete(), 4400);

        return () => {
            clearInterval(intervalRef.current);
            clearInterval(scanRef.current);
        };
    }, []);

    // Scan beam animation
    useEffect(() => {
        if (phase !== "scanning" && phase !== "unlocked") return;
        let y = 0;
        scanRef.current = setInterval(() => {
            y = (y + 1.5) % 110;
            setScanY(y);
        }, 14);
        return () => clearInterval(scanRef.current);
    }, [phase]);

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "#020b18",
            fontFamily: "'Orbitron', monospace",
            overflow: "hidden",
        }}>
            {/* ── Ambient radial glow behind doors ── */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(ellipse 60% 50% at 50% 50%, #00aaff0a 0%, transparent 70%)",
            }} />

            {/* ── CRT scanline texture ── */}
            <div style={{
                position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none",
                background: "repeating-linear-gradient(0deg, transparent, transparent 2px, #00000022 2px, #00000022 4px)",
            }} />

            {/* ── Sweep beam ── */}
            {(phase === "scanning" || phase === "unlocked") && (
                <div style={{
                    position: "absolute", left: 0, right: 0,
                    top: `${scanY}%`, height: 3, zIndex: 20, pointerEvents: "none",
                    background: "linear-gradient(90deg, transparent 0%, #00e5ff 20%, #ffffff 50%, #00e5ff 80%, transparent 100%)",
                    boxShadow: "0 0 20px 6px #00aaff66, 0 0 40px 2px #00aaff22",
                    opacity: 0.85,
                }} />
            )}

            {/* ── Boot terminal — bottom left ── */}
            <div style={{
                position: "absolute", bottom: 32, left: 40,
                zIndex: 30, pointerEvents: "none",
                opacity: open ? 0 : 1,
                transition: "opacity 0.3s",
            }}>
                {bootLines.map((line, i) => (
                    <div key={i} style={{
                        fontSize: 9, letterSpacing: 2,
                        color: i === bootLines.length - 1 ? "#00aaff" : "#1a4060",
                        marginBottom: 4,
                        animation: "fadeInUp 0.3s ease forwards",
                    }}>
                        <span style={{ color: "#0d3560", marginRight: 8 }}>›</span>{line}
                    </div>
                ))}
            </div>

            {/* ── Corner HUD brackets ── */}
            {[
                { top: 16, left: 16 },
                { top: 16, right: 16 },
                { bottom: 16, left: 16 },
                { bottom: 16, right: 16 },
            ].map((pos, i) => (
                <div key={i} style={{
                    position: "absolute", ...pos,
                    width: 28, height: 28, zIndex: 30, pointerEvents: "none",
                    borderTop: (i < 2) ? "2px solid #00aaff55" : "none",
                    borderBottom: (i >= 2) ? "2px solid #00aaff55" : "none",
                    borderLeft: (i % 2 === 0) ? "2px solid #00aaff55" : "none",
                    borderRight: (i % 2 === 1) ? "2px solid #00aaff55" : "none",
                    opacity: open ? 0 : 1,
                    transition: "opacity 0.3s",
                }} />
            ))}

            {/* ── Center HUD ── */}
            <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 40, display: "flex", flexDirection: "column",
                alignItems: "center", gap: 20,
                opacity: showHUD && !open ? 1 : 0,
                transition: "opacity 0.5s ease",
                pointerEvents: "none",
            }}>
                {/* Outer ring */}
                <div style={{ position: "relative", width: 120, height: 120 }}>
                    {/* Outer decorative ring */}
                    <div style={{
                        position: "absolute", inset: 0, borderRadius: "50%",
                        border: `1px solid ${unlocked ? "#00ff8833" : "#00aaff22"}`,
                        transition: "border-color 0.5s",
                    }} />
                    {/* Rotating dashed ring */}
                    <div style={{
                        position: "absolute", inset: 6, borderRadius: "50%",
                        border: "1px dashed #00aaff33",
                        animation: unlocked ? "none" : "rotateSlow 8s linear infinite",
                    }} />

                    {/* Main vault wheel */}
                    <div style={{
                        position: "absolute", inset: 16, borderRadius: "50%",
                        border: `2px solid ${unlocked ? "#00ff88" : "#00aaff"}`,
                        boxShadow: unlocked
                            ? "0 0 30px #00ff8866, inset 0 0 30px #00ff8811"
                            : "0 0 20px #00aaff55, inset 0 0 20px #00aaff11",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        animation: unlocked ? "none" : "vaultSpin 2s linear infinite",
                        transition: "border-color 0.5s, box-shadow 0.5s",
                        background: "radial-gradient(circle, #040f1f, #020b18)",
                    }}>
                        {/* Spokes */}
                        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
                            <div key={deg} style={{
                                position: "absolute",
                                width: 2, height: "38%",
                                background: unlocked ? "#00ff8866" : "#00aaff44",
                                transformOrigin: "bottom center",
                                bottom: "50%", left: "calc(50% - 1px)",
                                transform: `rotate(${deg}deg)`,
                                transition: "background 0.5s",
                            }} />
                        ))}
                        {/* Hub */}
                        <div style={{
                            width: 20, height: 20, borderRadius: "50%", zIndex: 2,
                            background: unlocked ? "#00ff88" : "#040f1f",
                            border: `2px solid ${unlocked ? "#00ff88" : "#00aaff"}`,
                            boxShadow: unlocked ? "0 0 20px #00ff88" : "0 0 8px #00aaff",
                            transition: "all 0.5s ease",
                        }} />
                    </div>

                    {/* Tick marks around outer ring */}
                    {[...Array(24)].map((_, i) => (
                        <div key={i} style={{
                            position: "absolute",
                            width: i % 6 === 0 ? 6 : 3,
                            height: 1,
                            background: unlocked ? "#00ff8855" : "#00aaff44",
                            top: "50%", left: "50%",
                            transformOrigin: "left center",
                            transform: `rotate(${i * 15}deg) translateX(56px)`,
                            transition: "background 0.5s",
                        }} />
                    ))}
                </div>

                {/* Digit cracker display */}
                <div style={{
                    background: "linear-gradient(180deg, #030d1a, #020b18)",
                    border: `1px solid ${unlocked ? "#00ff88" : "#0d3560"}`,
                    borderRadius: 2, padding: "10px 28px",
                    fontSize: 18, letterSpacing: 10,
                    color: unlocked ? "#00ff88" : "#00aaff",
                    boxShadow: unlocked
                        ? "0 0 30px #00ff8844, inset 0 0 20px #00ff8808"
                        : "0 0 14px #00aaff22, inset 0 0 14px #00aaff06",
                    transition: "all 0.4s ease",
                    minWidth: 200, textAlign: "center",
                    position: "relative",
                }}>
                    {/* Corner accents on display */}
                    {[{top:0,left:0},{top:0,right:0},{bottom:0,left:0},{bottom:0,right:0}].map((p,i) => (
                        <div key={i} style={{
                            position:"absolute", ...p,
                            width:6, height:6,
                            borderTop: i<2 ? `1px solid ${unlocked?"#00ff88":"#00aaff"}` : "none",
                            borderBottom: i>=2 ? `1px solid ${unlocked?"#00ff88":"#00aaff"}` : "none",
                            borderLeft: i%2===0 ? `1px solid ${unlocked?"#00ff88":"#00aaff"}` : "none",
                            borderRight: i%2===1 ? `1px solid ${unlocked?"#00ff88":"#00aaff"}` : "none",
                        }} />
                    ))}
                    {digits}
                </div>

                {/* Status text */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    fontSize: 8, letterSpacing: 5,
                    color: unlocked ? "#00ff88" : "#2a6080",
                    transition: "color 0.4s",
                }}>
                    <div style={{
                        width: 5, height: 5, borderRadius: "50%",
                        background: unlocked ? "#00ff88" : "#00aaff",
                        boxShadow: unlocked ? "0 0 8px #00ff88" : "0 0 8px #00aaff",
                        animation: unlocked ? "none" : "blink 1s infinite",
                    }} />
                    {unlocked ? "ACCESS GRANTED" : "AUTHENTICATING..."}
                </div>
            </div>

            {/* ── LEFT DOOR ── */}
            <div style={{
                position: "absolute", top: 0, left: 0,
                width: "50%", height: "100%",
                transform: open ? "translateX(-100%)" : "translateX(0)",
                transition: open ? "transform 1.4s cubic-bezier(0.86, 0, 0.07, 1)" : "none",
                zIndex: 10,
            }}>
                <DoorPanel side="left" unlocked={unlocked} />
            </div>

            {/* ── RIGHT DOOR ── */}
            <div style={{
                position: "absolute", top: 0, right: 0,
                width: "50%", height: "100%",
                transform: open ? "translateX(100%)" : "translateX(0)",
                transition: open ? "transform 1.4s cubic-bezier(0.86, 0, 0.07, 1)" : "none",
                zIndex: 10,
            }}>
                <DoorPanel side="right" unlocked={unlocked} />
            </div>

            <style>{`
                @keyframes vaultSpin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
                @keyframes rotateSlow { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
                @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
                @keyframes fadeInUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
                @keyframes pulseGlow { 0%,100%{opacity:0.4} 50%{opacity:1} }
            `}</style>
        </div>
    );
}

function DoorPanel({ side, unlocked }) {
    const isLeft = side === "left";

    return (
        <div style={{
            position: "absolute", inset: 0, overflow: "hidden",
            background: `linear-gradient(${isLeft ? "100deg" : "80deg"}, #020b18 0%, #040f1f 40%, #071628 100%)`,
            borderRight: isLeft ? `3px solid ${unlocked ? "#00ff8877" : "#00aaff55"}` : "none",
            borderLeft: !isLeft ? `3px solid ${unlocked ? "#00ff8877" : "#00aaff55"}` : "none",
            boxShadow: isLeft
                ? `inset -40px 0 120px #00aaff06, ${unlocked ? "-4px 0 30px #00ff8822" : "-4px 0 20px #00aaff22"}`
                : `inset 40px 0 120px #00aaff06, ${unlocked ? "4px 0 30px #00ff8822" : "4px 0 20px #00aaff22"}`,
            transition: "border-color 0.5s, box-shadow 0.5s",
        }}>
            {/* Fine grid texture */}
            <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `
                    linear-gradient(#00aaff06 1px, transparent 1px),
                    linear-gradient(90deg, #00aaff06 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
            }} />

            {/* Diagonal stripes accent */}
            <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `repeating-linear-gradient(
                    ${isLeft ? "135deg" : "45deg"},
                    transparent,
                    transparent 60px,
                    #00aaff03 60px,
                    #00aaff03 61px
                )`,
            }} />

            {/* Horizontal panel seams */}
            {[0.15, 0.28, 0.42, 0.58, 0.72, 0.85].map((frac, i) => (
                <div key={i} style={{
                    position: "absolute",
                    top: `${frac * 100}%`, left: 0, right: 0,
                    height: 1,
                    background: `linear-gradient(${isLeft ? "90deg" : "270deg"}, transparent 0%, #0d2a4a 30%, #0d3560 50%, #0d2a4a 70%, transparent 100%)`,
                    opacity: 0.7,
                }} />
            ))}

            {/* Vertical depth line */}
            <div style={{
                position: "absolute",
                [isLeft ? "right" : "left"]: "18%",
                top: 0, bottom: 0, width: 1,
                background: "linear-gradient(180deg, transparent 0%, #00aaff11 20%, #00aaff33 50%, #00aaff11 80%, transparent 100%)",
            }} />
            <div style={{
                position: "absolute",
                [isLeft ? "right" : "left"]: "38%",
                top: 0, bottom: 0, width: 1,
                background: "linear-gradient(180deg, transparent 0%, #00aaff08 50%, transparent 100%)",
            }} />

            {/* Seam edge glow */}
            <div style={{
                position: "absolute",
                [isLeft ? "right" : "left"]: 0,
                top: 0, bottom: 0, width: 80,
                background: `linear-gradient(${isLeft ? "270deg" : "90deg"}, transparent, #00aaff04)`,
            }} />

            {/* Bolt strip along seam */}
            <div style={{
                position: "absolute",
                [isLeft ? "right" : "left"]: 0,
                top: 0, bottom: 0, width: 48,
                background: `linear-gradient(180deg, #020d1a, #030f1e, #020d1a)`,
                borderLeft: isLeft ? "none" : "1px solid #0d2a4a88",
                borderRight: isLeft ? "1px solid #0d2a4a88" : "none",
            }}>
                {/* Bolts */}
                {[...Array(11)].map((_, i) => (
                    <div key={i} style={{
                        position: "absolute",
                        top: `${(i / 10) * 90 + 5}%`,
                        left: "50%", transform: "translateX(-50%)",
                        width: 18, height: 18,
                    }}>
                        {/* Bolt hex shape */}
                        <div style={{
                            width: 18, height: 18, borderRadius: "50%",
                            background: `radial-gradient(circle at 38% 35%, #0d2a4a, #020b18)`,
                            border: `1px solid ${unlocked ? "#00ff8844" : "#0d3060"}`,
                            boxShadow: unlocked ? "0 0 8px #00ff8822" : "inset 0 1px 3px #00000099",
                            transition: `all 0.3s ease ${i * 0.03}s`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <div style={{
                                width: 6, height: 6, borderRadius: "50%",
                                background: unlocked ? "#00ff8866" : "#071628",
                                border: `1px solid ${unlocked ? "#00ff88" : "#0d2a4a"}`,
                                transition: `all 0.3s ease ${i * 0.03}s`,
                            }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Lock bars — retract into bolt strip when unlocked */}
            {[20, 38, 55, 72, 85].map((pct, i) => (
                <div key={i} style={{
                    position: "absolute",
                    top: `${pct}%`,
                    [isLeft ? "right" : "left"]: unlocked ? -80 : 44,
                    width: 64, height: 10,
                    background: `linear-gradient(${isLeft ? "90deg" : "270deg"}, #0d3a6a, #0a2540, #071628)`,
                    border: `1px solid #0d3a6a`,
                    borderRadius: isLeft ? "3px 0 0 3px" : "0 3px 3px 0",
                    transform: "translateY(-50%)",
                    transition: `${isLeft ? "right" : "left"} 0.3s cubic-bezier(0.4,0,0.2,1) ${i * 0.06}s`,
                    boxShadow: `0 0 10px #00aaff33, inset 0 1px 0 #00aaff22`,
                    zIndex: 3,
                }}>
                    {/* Bar detail line */}
                    <div style={{
                        position: "absolute", top: "50%", left: 8, right: 8,
                        height: 1, background: "#00aaff22",
                        transform: "translateY(-50%)",
                    }} />
                </div>
            ))}

            {/* Corner bracket decorations */}
            {[
                { top: 12, [isLeft ? "left" : "right"]: 12 },
                { bottom: 12, [isLeft ? "left" : "right"]: 12 },
            ].map((pos, i) => (
                <div key={i} style={{
                    position: "absolute", ...pos,
                    width: 22, height: 22,
                    borderTop: i === 0 ? "2px solid #00aaff44" : "none",
                    borderBottom: i === 1 ? "2px solid #00aaff44" : "none",
                    borderLeft: isLeft ? "2px solid #00aaff44" : "none",
                    borderRight: !isLeft ? "2px solid #00aaff44" : "none",
                }} />
            ))}

            {/* EPS / DRIFT watermark */}
            <div style={{
                position: "absolute", top: "50%",
                [isLeft ? "left" : "right"]: "22%",
                transform: "translateY(-50%)",
                fontSize: 10, letterSpacing: 8,
                color: "#0d2a4a",
                userSelect: "none",
                writingMode: "vertical-rl",
                textOrientation: "mixed",
            }}>
                {isLeft ? "EPS DRIFT" : "SCANNER"}
            </div>
        </div>
    );
}