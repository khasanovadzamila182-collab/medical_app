"use client";
import { calcParacetamol, calcIbuprofen } from "@/lib/dosage";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { t } from "@/lib/i18n";

type Step =
    | "active_check" | "active_yes"
    | "temp_input" | "low_cold_check" | "low_warm" | "high_cold_check" | "high_warm"
    | "cold_extremities"
    | "calculate_dose"
    | "timer" | "timer_result" | "temp_down" | "give_paracetamol";

/* ── Dosage tables ── */
const ibuprofenTable = [
    ["5–7,6 кг", "2,5 мл"], ["7,7–9 кг", "3 мл"], ["10–12 кг", "5 мл"],
    ["13–15 кг", "6 мл"], ["16–20 кг", "7,5 мл"], ["21–29 кг", "10 мл"], ["30–40 кг", "15 мл"],
];
const paracetamolTable = [
    ["5–6 кг", "3 мл"], ["7–8 кг", "4 мл"], ["9–10 кг", "5 мл"], ["11–13 кг", "7 мл"],
    ["14–16 кг", "9 мл"], ["17–20 кг", "11 мл"], ["21–25 кг", "13 мл"],
    ["26–29 кг", "15 мл"], ["30–40 кг", "20 мл"],
];

function DoseTable({ title, conc, rows, childWeight, medType, lang = "ru" }: { title: string; conc: string; rows: string[][]; childWeight: number | null; medType: "paracetamol" | "ibuprofen" | null; lang?: "ru" | "uz" | "en" }) {
    const res = medType === "paracetamol" ? calcParacetamol(childWeight || 15) : calcIbuprofen(childWeight || 15);
    return (
        <div className="card">
            {childWeight && medType && (
                <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontWeight: 600, fontSize: "15px", marginBottom: "8px" }}>{t("Назначение", lang)}</p>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                        {t("Дозировка", lang)} {medType === "paracetamol" ? "Paracetamol" : "Ibuprofen"} — {t("dose_for_weight", lang)} {childWeight} {t("dose_ml", lang) === "ml" ? "kg" : "кг"}:
                    </p>
                    <div style={{ padding: "12px", background: "var(--primary-light)", borderRadius: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <span className="material-symbols-outlined" style={{ color: "var(--primary)", fontSize: "28px" }}>vaccines</span>
                        <div>
                            <p style={{ fontWeight: 700, fontSize: "18px", color: "var(--primary)" }}>{res.doseMl} {t("dose_ml", lang)}</p>
                            <p style={{ fontSize: "12px", color: "var(--primary)", opacity: 0.8 }}>{res.frequency}</p>
                        </div>
                    </div>
                </div>
            )}
            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "2px", color: "var(--primary)" }}>{title}</p>
            <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "8px" }}>{conc}</p>
            <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th style={{ textAlign: "left", padding: "5px 0" }}>{t("Вес", lang)}</th>
                    <th style={{ textAlign: "right", padding: "5px 0" }}>{t("Доза", lang)}</th>
                </tr></thead>
                <tbody>{rows.map(([w, d]) => (
                    <tr key={w} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "5px 0" }}>{w}</td>
                        <td style={{ textAlign: "right", padding: "5px 0", fontWeight: 600 }}>{d}</td>
                    </tr>
                ))}</tbody>
            </table>
        </div>
    );
}

function CoolingAdvice({ lang = "ru" }: { lang?: "ru" | "uz" | "en" }) {
    return (
        <div className="card">
            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{t("Рекомендации", lang)}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                <p>{t("cool_room", lang)}</p>
                <p>{t("cool_undress", lang)}</p>
                <p>{t("cool_wipe", lang)}</p>
                <p>{t("cool_drink", lang)}</p>
            </div>
        </div>
    );
}

export default function TempPage() {
    const { childWeight, needsWeight, logEvent, langPref } = useApp();
    const L = langPref;
    const router = useRouter();
    const [step, setStep] = useState<Step>("active_check");
    const [temp, setTemp] = useState("");
    const [seconds, setSeconds] = useState(40 * 60);
    const [timerRunning, setTimerRunning] = useState(false);
    const [medType, setMedType] = useState<"paracetamol" | "ibuprofen" | null>(null);

    const stepNum: Record<Step, number> = {
        active_check: 1, active_yes: 1,
        temp_input: 2, low_cold_check: 2, low_warm: 2, high_cold_check: 2, high_warm: 2,
        cold_extremities: 3,
        calculate_dose: 3,
        timer: 4, timer_result: 4, temp_down: 4, give_paracetamol: 4,
    };
    const total = 4;
    const cur = stepNum[step];
    const pct = Math.round((cur / total) * 100);

    // Timer logic
    useEffect(() => {
        if (!timerRunning || seconds <= 0) return;
        const id = setInterval(() => setSeconds(s => { if (s <= 1) { setTimerRunning(false); return 0; } return s - 1; }), 1000);
        return () => clearInterval(id);
    }, [timerRunning, seconds]);

    const startTimer = useCallback(() => { setSeconds(40 * 60); setTimerRunning(true); setStep("timer"); }, []);
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");

    const parsedTemp = parseFloat(temp.replace(",", "."));
    const tempValid = !isNaN(parsedTemp) && parsedTemp >= 35 && parsedTemp <= 42;

    const proceedToDose = (type: "paracetamol" | "ibuprofen") => {
        if (needsWeight()) {
            router.push("/profile?return=/temp");
            return;
        }
        setMedType(type);
        setStep("calculate_dose");
    };

    const handleFinish = () => {
        logEvent("Температура", "end");
        router.push("/");
    };

    return (
        <>
            <div className="sticky-header">
                <div className="progress-wrap" style={{ padding: "8px 16px 0" }}>
                    <span className="label">{t("Шаг", L)} {cur} {t("из", L)} {total}</span><span className="pct">{pct}%</span>
                </div>
                <div className="progress-bar" style={{ margin: "0 16px 8px" }}><div className="fill" style={{ width: `${pct}%` }} /></div>
                <div className="header-row">
                    <Link href="/diagnostics" className="back-btn"><span className="material-symbols-outlined">arrow_back</span></Link>
                    <h1>{t("Температура", L)}</h1><span />
                </div>
            </div>

            <div className="page-body">
                {/* ═══ STEP 1: ACTIVE CHECK ═══ */}
                {step === "active_check" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>sentiment_satisfied</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{t("Шаг 1: Первичная проверка", L)}</p>
                            <p className="section-sub" style={{ marginTop: "4px" }}>{t("Оцените общее состояние ребёнка", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{t("Ребёнок активный, относительно бодрый?", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("active_yes")}>{t("😊 Да, активный", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => setStep("temp_input")}>{t("😟 Нет, вялый", L)}</button>
                        </div>
                    </>
                )}

                {/* ═══ ACTIVE YES ═══ */}
                {step === "active_yes" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#22c55e" }}>check_circle</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{t("Ребёнок активный", L)}</p>
                        </div>
                        <CoolingAdvice lang={L} />
                        <button className="btn-primary" style={{ textAlign: "center" }} onClick={handleFinish}>{t("Готово", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("active_check")}>{t("Назад", L)}</button>
                    </>
                )}

                {/* ═══ STEP 2: TEMP INPUT ═══ */}
                {step === "temp_input" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--accent)" }}>thermostat</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{t("Шаг 2: Температура", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center", marginBottom: "12px" }}>{t("Какая сейчас температура?", L)}</p>
                            <input
                                type="number" inputMode="decimal" step="0.1" min="35" max="42"
                                placeholder="Например: 38.5"
                                value={temp} onChange={e => setTemp(e.target.value)}
                                style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "18px", textAlign: "center" }}
                            />
                        </div>
                        {tempValid && (
                            <button className="btn-primary" onClick={() => {
                                if (parsedTemp <= 38.5) setStep("low_cold_check");
                                else setStep("high_cold_check");
                            }}>
                                {t("Далее", L)}
                            </button>
                        )}
                        <button className="btn-outline" onClick={() => setStep("active_check")}>{t("Назад", L)}</button>
                    </>
                )}

                {/* ═══ LOW TEMP: COLD CHECK ═══ */}
                {step === "low_cold_check" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>thermostat</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{t("Температура ≤ 38,5°C", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{t("Конечности холодные?", L)}</p>
                            <p className="section-sub" style={{ textAlign: "center", marginTop: "4px" }}>{t("Руки и ноги холодные на ощупь?", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "#8b5cf6" }} onClick={() => proceedToDose("ibuprofen")}>{t("🥶 Да, холодные", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("low_warm")}>{t("👍 Нет, тёплые", L)}</button>
                        </div>
                        <button className="btn-outline" onClick={() => setStep("temp_input")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "low_warm" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#22c55e" }}>check_circle</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{t("Конечности тёплые", L)}</p>
                        </div>
                        <CoolingAdvice lang={L} />
                        <button className="btn-primary" style={{ textAlign: "center" }} onClick={handleFinish}>{t("Готово", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("active_check")}>{t("🔄 Начать сначала", L)}</button>
                    </>
                )}

                {/* ═══ HIGH TEMP: COLD CHECK ═══ */}
                {step === "high_cold_check" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#ef4444" }}>local_fire_department</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{t("Температура > 38,5°C", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{t("Конечности холодные?", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "#8b5cf6" }} onClick={() => proceedToDose("ibuprofen")}>{t("🥶 Да, холодные", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => proceedToDose("ibuprofen")}>{t("👍 Нет, тёплые", L)}</button>
                        </div>
                        <button className="btn-outline" onClick={() => setStep("temp_input")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "high_warm" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--accent)" }}>medication</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>Высокая температура, тёплые конечности</p>
                        </div>
                        <div className="card">
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <p>👶 Раздеть ребёнка <strong>догола</strong></p>
                                <p>🌡️ Температура в помещении <strong>22°C</strong></p>
                                <p>💧 Питьё каждые <strong>15 мин</strong></p>
                                <p>💊 Дать <strong>ИБУПРОФЕН</strong> по весу (см. таблицу ниже)</p>
                            </div>
                        </div>
                        <DoseTable title="Ibuprofen" conc="100 mg / 5 ml" rows={ibuprofenTable} childWeight={childWeight} medType={medType} lang={L} />
                        <button className="btn-primary" onClick={startTimer}>{t("⏱️ Запустить таймер (40 мин) →", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("active_check")}>{t("🔄 Начать сначала", L)}</button>
                    </>
                )}

                {/* ═══ STEP 3: COLD EXTREMITIES ═══ */}
                {step === "cold_extremities" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#8b5cf6" }}>ac_unit</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{t("Холодные конечности", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{t("План действий", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <p>{t("cold_dress", L)}</p>
                                <p>{t("cool_room", L)}</p>
                                <p>{t("cool_drink", L)}</p>
                                <p>{t("cold_rehydrate", L)}</p>
                                <p>{t("cold_ibuprofen", L)}</p>
                            </div>
                        </div>
                        <DoseTable title="Ibuprofen" conc="100 mg / 5 ml" rows={ibuprofenTable} childWeight={childWeight} medType={medType} lang={L} />
                        <button className="btn-primary" onClick={startTimer}>{t("⏱️ Запустить таймер (40 мин) →", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("active_check")}>{t("🔄 Начать сначала", L)}</button>
                    </>
                )}

                {/* ═══ STEP 3.5: CALCULATE DOSE ═══ */}
                {step === "calculate_dose" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--accent)" }}>medication</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{t("Дозировка", L)}</p>
                        </div>
                        <DoseTable title={medType === "ibuprofen" ? "Ibuprofen" : "Paracetamol"} conc={medType === "ibuprofen" ? "100 mg / 5 ml" : "120 mg / 5 ml"} rows={medType === "ibuprofen" ? ibuprofenTable : paracetamolTable} childWeight={childWeight} medType={medType} lang={L} />
                        <button className="btn-primary" onClick={startTimer}>{t("⏱️ Запустить таймер (40 мин) →", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("temp_input")}>{t("Назад", L)}</button>
                    </>
                )}

                {/* ═══ STEP 4: 40 MIN TIMER ═══ */}
                {step === "timer" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--accent)" }}>timer</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{t("Шаг 4: Ожидание", L)}</p>
                            <p className="section-sub">{t("Подождите 40 минут и оцените результат", L)}</p>
                        </div>
                        <div className="card" style={{ textAlign: "center" }}>
                            <p style={{ fontSize: "56px", fontWeight: 700, fontFamily: "monospace", color: seconds <= 60 ? "#ef4444" : "var(--primary)" }}>
                                {mm}:{ss}
                            </p>
                            <div className="progress-bar" style={{ marginTop: "12px" }}>
                                <div className="fill" style={{ width: `${((40 * 60 - seconds) / (40 * 60)) * 100}%` }} />
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1 }} onClick={() => setTimerRunning(r => !r)}>
                                {timerRunning ? t("⏸ Пауза", L) : t("▶️ Продолжить", L)}
                            </button>
                            <button className="btn-outline" style={{ flex: 1 }} onClick={() => { setTimerRunning(false); setStep("timer_result"); }}>
                                {t("Перейти к оценке →", L)}
                            </button>
                        </div>
                    </>
                )}

                {/* ═══ TIMER RESULT ═══ */}
                {step === "timer_result" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--accent)" }}>fact_check</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{t("Оценка через 40 мин", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{t("Температура спала?", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "#22c55e" }} onClick={() => setStep("temp_down")}>{t("📉 Да, спала", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => setStep("give_paracetamol")}>{t("📈 Нет", L)}</button>
                        </div>
                    </>
                )}

                {/* ═══ TEMP DOWN ═══ */}
                {step === "temp_down" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#22c55e" }}>sentiment_satisfied</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{t("Температура снизилась! 🎉", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                                {t("drink_continue", L)}
                            </p>
                        </div>
                        <button className="btn-primary" style={{ textAlign: "center" }} onClick={handleFinish}>{t("Готово", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("active_check")}>{t("🔄 Начать сначала", L)}</button>
                    </>
                )}

                {/* ═══ GIVE PARACETAMOL ═══ */}
                {step === "give_paracetamol" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#ef4444" }}>medication</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{t("Температура не снизилась", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                                {t("give_paracetamol_text", L)}
                            </p>
                        </div>
                        <DoseTable title="Paracetamol" conc="120 mg / 5 ml" rows={paracetamolTable} childWeight={childWeight} medType="paracetamol" lang={L} />
                        <div className="info-box info-box-orange">
                            <strong className="orange">{t("Важно:", L)}</strong> {t("important_consult", L)}
                        </div>
                        <Link href="/diagnostics" className="btn-primary" style={{ textAlign: "center" }}>{t("Готово", L)}</Link>
                        <button className="btn-outline" onClick={() => setStep("active_check")}>{t("🔄 Начать сначала", L)}</button>
                    </>
                )}
            </div>
        </>
    );
}
