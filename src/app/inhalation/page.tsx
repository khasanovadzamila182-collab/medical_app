"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

const PRESETS = [300, 600, 900, 1200];
const PRESET_LABELS = ["5 мин", "10 мин", "15 мин", "20 мин"];

export default function InhalationPage() {
    const [total, setTotal] = useState(600);
    const [remaining, setRemaining] = useState(600);
    const [running, setRunning] = useState(false);
    const ref = useRef<ReturnType<typeof setInterval> | null>(null);

    const tick = useCallback(() => {
        setRemaining(r => {
            if (r <= 1) { setRunning(false); return 0; }
            return r - 1;
        });
    }, []);

    useEffect(() => {
        if (running) { ref.current = setInterval(tick, 1000); }
        else if (ref.current) { clearInterval(ref.current); }
        return () => { if (ref.current) clearInterval(ref.current); };
    }, [running, tick]);

    const toggle = () => setRunning(r => !r);
    const reset = () => { setRunning(false); setRemaining(total); };
    const setPreset = (s: number) => { setRunning(false); setTotal(s); setRemaining(s); };
    const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
    const ss = String(remaining % 60).padStart(2, "0");
    const pct = total > 0 ? ((total - remaining) / total) * 100 : 0;

    return (
        <>
            <div className="sticky-header">
                <div className="header-row">
                    <Link href="/" className="back-btn"><span className="material-symbols-outlined">arrow_back</span></Link>
                    <h1>Таймер ингаляций</h1><span />
                </div>
            </div>
            <div className="page-body">
                <div className="card" style={{ textAlign: "center", padding: "24px" }}>
                    <p className="timer-display">{mm}:{ss}</p>
                    <p className="timer-label" style={{ marginTop: "4px" }}>минуты : секунды</p>
                    <div className="progress-bar" style={{ marginTop: "16px" }}><div className="fill" style={{ width: `${pct}%` }} /></div>
                </div>
                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    {PRESETS.map((s, i) => (
                        <button key={s} className={`chip${total === s ? " active" : ""}`} onClick={() => setPreset(s)}>{PRESET_LABELS[i]}</button>
                    ))}
                </div>
                <div className="form-group">
                    <label className="form-label">Раствор</label>
                    <select className="form-input form-select">
                        <option>Физраствор (NaCl 0.9%)</option><option>Пульмикорт</option><option>Беродуал</option><option>Лазолван</option>
                    </select>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={toggle}>{running ? "Пауза" : remaining === 0 ? "Готово ✓" : "Старт"}</button>
                    <button className="btn-outline" style={{ width: "auto", padding: "12px 20px" }} onClick={reset}>
                        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>restart_alt</span>
                    </button>
                </div>
                <div className="info-box info-box-teal"><strong className="teal">Совет:</strong> Ингаляции небулайзером наиболее эффективны при спокойном дыхании. Отвлеките ребёнка мультфильмом.</div>
            </div>
        </>
    );
}
