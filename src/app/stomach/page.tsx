"use client";
import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { t, Lang } from "@/lib/i18n";
import sx from "./i18n-stomach";

const T = (k: string, L: Lang) => sx[k]?.[L] || t(k, L);

type Step =
    | "red_flags" | "emergency"
    | "has_vomiting" | "vomit_frequency"
    | "vomit_freq_orvi" | "vomit_freq_doctor"
    | "vomit_rare_diarrhea" | "constipation_check"
    | "constipation_treatment" | "constipation_observe"
    | "treatment_age"
    | "treat_3_6" | "treat_6_12" | "treat_2_5" | "treat_5_12"
    | "additional_meds" | "nutrition";

function DoctorCard({ text, sub }: { text: string; sub?: string }) {
    return (
        <div className="card" style={{ background: "#dc2626", color: "white", border: "none", textAlign: "center", padding: "24px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", opacity: 0.9 }}>local_hospital</span>
            <p style={{ fontSize: "22px", fontWeight: 700, marginTop: "8px" }}>{text}</p>
            {sub && <p style={{ fontSize: "14px", opacity: 0.9, marginTop: "8px" }}>{sub}</p>}
        </div>
    );
}

export default function StomachPage() {
    const { childWeight, needsWeight, logEvent, langPref } = useApp();
    const L = langPref;
    const router = useRouter();
    const [step, setStep] = useState<Step>("red_flags");

    const progressMap: Record<Step, number> = {
        red_flags: 1, emergency: 1,
        has_vomiting: 2, vomit_frequency: 2, vomit_freq_orvi: 2, vomit_freq_doctor: 2,
        vomit_rare_diarrhea: 2, constipation_check: 3, constipation_treatment: 3, constipation_observe: 3,
        treatment_age: 4, treat_3_6: 4, treat_6_12: 4, treat_2_5: 4, treat_5_12: 4,
        additional_meds: 5, nutrition: 6,
    };
    const total = 6;
    const cur = progressMap[step];
    const pct = Math.round((cur / total) * 100);

    const handleStartEvent = (nextStep: Step) => {
        logEvent("ЖКТ / Живот", "start", nextStep);
        setStep(nextStep);
    };

    const handleFinish = () => {
        logEvent("ЖКТ / Живот", "end");
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
                    <h1>{T("ЖКТ / Живот", L)}</h1><span />
                </div>
            </div>

            <div className="page-body">

                {/* ═══ 1. RED FLAGS ═══ */}
                {step === "red_flags" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#ef4444" }}>warning</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Шаг 1: Красные флаги", L)}</p>
                            <p className="section-sub">{T("Проверьте наличие опасных симптомов", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "#ef4444" }}>{T("Есть хотя бы один из признаков?", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <p>{T("rf1", L)}</p>
                                <p>{T("rf2", L)}</p>
                                <p>{T("rf3", L)}</p>
                                <p>{T("rf4", L)}</p>
                                <p>{T("rf5", L)}</p>
                                <p>{T("rf6", L)}</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => handleStartEvent("emergency")}>{T("🚨 Да, есть!", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => handleStartEvent("has_vomiting")}>{T("✅ Нет", L)}</button>
                        </div>
                    </>
                )}

                {step === "emergency" && (
                    <>
                        <DoctorCard text={T("ВЫЗОВИТЕ СКОРУЮ!", L)} sub={T("Или немедленно к врачу", L)} />
                        <div className="card" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
                            <p style={{ fontWeight: 600, fontSize: "14px", color: "#ef4444", marginBottom: "4px" }}>{T("⚠️ ВАЖНО", L)}</p>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{T("emerg_no_pain", L)}</p>
                        </div>
                        <Link href="/diagnostics" className="btn-primary" style={{ textAlign: "center" }}>{T("Понятно", L)}</Link>
                        <button className="btn-outline" onClick={() => setStep("red_flags")}>{t("Назад", L)}</button>
                    </>
                )}

                {/* ═══ 2. VOMITING CHECK ═══ */}
                {step === "has_vomiting" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--accent)" }}>sick</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Шаг 2: Рвота", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("Есть рвота?", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => setStep("vomit_frequency")}>{T("🤢 Да", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("constipation_check")}>{T("✅ Нет", L)}</button>
                        </div>
                        <button className="btn-outline" onClick={() => setStep("red_flags")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "vomit_frequency" && (
                    <>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("Как часто рвота?", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => setStep("vomit_freq_orvi")}>
                                {T("🔴 Частая", L)}<br /><span style={{ fontSize: "11px", opacity: 0.8 }}>{T("vomit_freq_sub", L)}</span>
                            </button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => setStep("vomit_rare_diarrhea")}>
                                {T("🟡 Редкая", L)}<br /><span style={{ fontSize: "11px", opacity: 0.8 }}>{T("vomit_rare_sub", L)}</span>
                            </button>
                        </div>
                        <button className="btn-outline" onClick={() => setStep("has_vomiting")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "vomit_freq_orvi" && (
                    <>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("Есть признаки ОРВИ?", L)}</p>
                            <p className="section-sub" style={{ textAlign: "center", marginTop: "4px" }}>{T("orvi_sub", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "#8b5cf6" }} onClick={() => handleStartEvent("treatment_age")}>{T("💊 Перейти к лечению", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => handleStartEvent("vomit_freq_doctor")}>{T("❌ Нет", L)}</button>
                        </div>
                        <button className="btn-outline" onClick={() => setStep("vomit_frequency")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "vomit_freq_doctor" && (
                    <>
                        <DoctorCard text={T("Срочно к врачу!", L)} sub={T("Исключить острую инфекцию", L)} />
                        <button className="btn-primary" onClick={handleFinish} style={{ textAlign: "center" }}>{T("Понятно", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("red_flags")}>{t("🔄 Начать сначала", L)}</button>
                    </>
                )}

                {step === "vomit_rare_diarrhea" && (
                    <>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("Есть диарея (понос)?", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => handleStartEvent("treatment_age")}>{T("💩 Да", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => handleStartEvent("constipation_check")}>{T("✅ Нет", L)}</button>
                        </div>
                        <button className="btn-outline" onClick={() => setStep("vomit_frequency")}>{t("Назад", L)}</button>
                    </>
                )}

                {/* ═══ 3. CONSTIPATION ═══ */}
                {step === "constipation_check" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#8b5cf6" }}>gastroenterology</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Шаг 3: Стул", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("Когда был последний стул?", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "#8b5cf6" }} onClick={() => setStep("constipation_treatment")}>
                                {T("⏰ 24–48 ч назад", L)}<br /><span style={{ fontSize: "11px", opacity: 0.8 }}>{T("или больше", L)}</span>
                            </button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("constipation_observe")}>
                                {T("✅ Сегодня/вчера", L)}
                            </button>
                        </div>
                        <button className="btn-outline" onClick={() => setStep("has_vomiting")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "constipation_treatment" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#8b5cf6" }}>medication</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Запор: лечение", L)}</p>
                        </div>
                        <div className="card">
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <div style={{ padding: "10px", background: "#f3e8ff", borderRadius: "10px" }}>
                                    <p><strong>{T("1️⃣ Микроклизма (Микролакс)", L)}</strong></p>
                                    <p>{T("const_glyc", L)}</p>
                                </div>
                                <div style={{ padding: "10px", background: "#fff7ed", borderRadius: "10px" }}>
                                    <p><strong>{T("2️⃣ Если не помогло", L)}</strong></p>
                                    <p>{T("const_doc", L)}</p>
                                </div>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={() => setStep("additional_meds")}>{T("Доп. препараты →", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("red_flags")}>{t("🔄 Начать сначала", L)}</button>
                    </>
                )}

                {step === "constipation_observe" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#22c55e" }}>visibility</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Наблюдение", L)}</p>
                        </div>
                        <div className="card">
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <p>{T("obs1", L)}</p>
                                <p>{T("obs2", L)}</p>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={() => setStep("additional_meds")}>{T("Доп. препараты →", L)}</button>
                        <button className="btn-primary" onClick={handleFinish} style={{ textAlign: "center", background: "var(--bg-card)", color: "var(--primary)", border: "2px solid var(--primary)" }}>{t("Готово", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("red_flags")}>{t("🔄 Начать сначала", L)}</button>
                    </>
                )}

                {/* ═══ 4. AGE-BASED TREATMENT ═══ */}
                {step === "treatment_age" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>medication</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Шаг 4: Лечение по возрасту", L)}</p>
                            <p className="section-sub">{T("При рвоте/диарее + ОРВИ", L)}</p>
                        </div>
                        <div className="info-box info-box-teal">
                            <strong className="teal">{T("Питьё:", L)}</strong> {T("drink_rehydron", L)}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {([
                                ["treat_3_6", T("👶 3–6 месяцев", L), "var(--primary)"],
                                ["treat_6_12", T("🧒 6–12 месяцев", L), "var(--accent)"],
                                ["treat_2_5", T("👦 2–5 лет", L), "#8b5cf6"],
                                ["treat_5_12", T("🧑 5–12 лет", L), "#0ea5e9"],
                            ] as const).map(([s, label, bg]) => (
                                <button key={s} className="card" style={{ textAlign: "left", cursor: "pointer", border: "2px solid transparent" }}
                                    onClick={() => setStep(s as Step)}
                                    onMouseOver={e => (e.currentTarget.style.borderColor = bg)}
                                    onMouseOut={e => (e.currentTarget.style.borderColor = "transparent")}>
                                    <p style={{ fontWeight: 600, fontSize: "15px" }}>{label}</p>
                                </button>
                            ))}
                        </div>
                        <button className="btn-outline" onClick={() => setStep("has_vomiting")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "treat_3_6" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <p className="section-heading">{T("👶 3–6 месяцев", L)}</p>
                        </div>
                        <div className="card">
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <div style={{ padding: "10px", background: "#dcfce7", borderRadius: "10px" }}>
                                    <p><strong>Домрид ({L === "en" ? "suspension" : L === "uz" ? "suspenziya" : "суспензия"})</strong></p>
                                    <p>📋 <strong>1,5 {L === "en" ? "ml" : "мл"}</strong> {L === "en" ? "once (repeat after 3h)" : L === "uz" ? "bir marta (3 soatdan keyin takrorlash mumkin)" : "разово (можно повторить через 3 ч)"}</p>
                                </div>
                                <div style={{ padding: "10px", background: "#fff7ed", borderRadius: "10px" }}>
                                    <p><strong>Энтерол</strong></p>
                                    <p>📋 <strong>½ {L === "en" ? "sachet" : L === "uz" ? "paket" : "саше"}</strong> {L === "en" ? "2 times daily (3–5 days)" : L === "uz" ? "kuniga 2 marta (3–5 kun)" : "2 раза в день (3–5 дней)"}</p>
                                </div>
                                <div style={{ padding: "10px", background: "#eff6ff", borderRadius: "10px" }}>
                                    <p><strong>{L === "en" ? "Rehydration" : L === "uz" ? "Regidratatsiya" : "Регидратация"}</strong></p>
                                    <p>📋 <strong>50 {L === "en" ? "ml solution + 50 ml water" : L === "uz" ? "ml eritma + 50 ml suv" : "мл раствора + 50 мл воды"}</strong> {L === "en" ? "per day" : L === "uz" ? "kuniga" : "в день"}</p>
                                </div>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={() => setStep("additional_meds")}>{T("Доп. препараты →", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("treatment_age")}>{T("← Возраст", L)}</button>
                    </>
                )}

                {step === "treat_6_12" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <p className="section-heading">{T("🧒 6–12 месяцев", L)}</p>
                        </div>
                        <div className="card">
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <div style={{ padding: "10px", background: "#dcfce7", borderRadius: "10px" }}>
                                    <p><strong>Домрид ({L === "en" ? "suspension" : L === "uz" ? "suspenziya" : "суспензия"})</strong></p>
                                    <p>📋 <strong>2–2,5 {L === "en" ? "ml" : "мл"}</strong> {L === "en" ? "once" : L === "uz" ? "bir marta" : "разово"}</p>
                                </div>
                                <div style={{ padding: "10px", background: "#fff7ed", borderRadius: "10px" }}>
                                    <p><strong>Энтерол</strong></p>
                                    <p>📋 <strong>½ {L === "en" ? "sachet" : L === "uz" ? "paket" : "саше"}</strong> {L === "en" ? "3 times daily (3–5 days)" : L === "uz" ? "kuniga 3 marta (3–5 kun)" : "3 раза в день (3–5 дней)"}</p>
                                </div>
                                <div style={{ padding: "10px", background: "#eff6ff", borderRadius: "10px" }}>
                                    <p><strong>{L === "en" ? "Rehydration" : L === "uz" ? "Regidratatsiya" : "Регидратация"}</strong></p>
                                    <p>📋 <strong>100 {L === "en" ? "ml solution + 100 ml water" : L === "uz" ? "ml eritma + 100 ml suv" : "мл раствора + 100 мл воды"}</strong> {L === "en" ? "per day" : L === "uz" ? "kuniga" : "в день"}</p>
                                </div>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={() => setStep("additional_meds")}>{T("Доп. препараты →", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("treatment_age")}>{T("← Возраст", L)}</button>
                    </>
                )}

                {step === "treat_2_5" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <p className="section-heading">{T("👦 2–5 лет", L)}</p>
                        </div>
                        <div className="card">
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <div style={{ padding: "10px", background: "#dcfce7", borderRadius: "10px" }}>
                                    <p><strong>Домрид ({L === "en" ? "suspension" : L === "uz" ? "suspenziya" : "суспензия"})</strong></p>
                                    <p>📋 <strong>3 {L === "en" ? "ml" : "мл"}</strong> {L === "en" ? "once" : L === "uz" ? "bir marta" : "разово"}</p>
                                </div>
                                <div style={{ padding: "10px", background: "#fff7ed", borderRadius: "10px" }}>
                                    <p><strong>Энтерол</strong></p>
                                    <p>📋 <strong>1 {L === "en" ? "sachet/capsule" : L === "uz" ? "paket/kapsula" : "саше/капсула"}</strong> {L === "en" ? "2 times daily" : L === "uz" ? "kuniga 2 marta" : "2 раза в день"}</p>
                                </div>
                                <div style={{ padding: "10px", background: "#eff6ff", borderRadius: "10px" }}>
                                    <p><strong>{L === "en" ? "Rehydration" : L === "uz" ? "Regidratatsiya" : "Регидратация"}</strong></p>
                                    <p>📋 <strong>100 {L === "en" ? "ml solution + 100 ml water" : L === "uz" ? "ml eritma + 100 ml suv" : "мл раствора + 100 мл воды"}</strong> {L === "en" ? "per day" : L === "uz" ? "kuniga" : "в день"}</p>
                                </div>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={() => setStep("additional_meds")}>{T("Доп. препараты →", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("treatment_age")}>{T("← Возраст", L)}</button>
                    </>
                )}

                {step === "treat_5_12" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <p className="section-heading">{T("🧑 5–12 лет", L)}</p>
                        </div>
                        <div className="card">
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <div style={{ padding: "10px", background: "#dcfce7", borderRadius: "10px" }}>
                                    <p><strong>Домрид ({L === "en" ? "suspension" : L === "uz" ? "suspenziya" : "суспензия"})</strong></p>
                                    <p>📋 <strong>5–8 {L === "en" ? "ml" : "мл"}</strong> {L === "en" ? "once" : L === "uz" ? "bir marta" : "разово"}</p>
                                </div>
                                <div style={{ padding: "10px", background: "#fff7ed", borderRadius: "10px" }}>
                                    <p><strong>Энтерол</strong></p>
                                    <p>📋 <strong>1 {L === "en" ? "capsule" : L === "uz" ? "kapsula" : "капсула"}</strong> {L === "en" ? "3 times daily" : L === "uz" ? "kuniga 3 marta" : "3 раза в день"}</p>
                                </div>
                                <div style={{ padding: "10px", background: "#eff6ff", borderRadius: "10px" }}>
                                    <p><strong>{L === "en" ? "Rehydration" : L === "uz" ? "Regidratatsiya" : "Регидратация"}</strong></p>
                                    <p>📋 <strong>200 {L === "en" ? "ml solution + 200 ml water" : L === "uz" ? "ml eritma + 200 ml suv" : "мл раствора + 200 мл воды"}</strong> {L === "en" ? "per day" : L === "uz" ? "kuniga" : "в день"}</p>
                                </div>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={() => setStep("additional_meds")}>{T("Доп. препараты →", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("treatment_age")}>{T("← Возраст", L)}</button>
                    </>
                )}

                {/* ═══ 5. ADDITIONAL MEDS ═══ */}
                {step === "additional_meds" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>pills</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Шаг 5: Дополнительные препараты", L)}</p>
                        </div>

                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{T("💊 От спазмов — Тримедат", L)}</p>
                            <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
                                <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
                                    <th style={{ textAlign: "left", padding: "5px 0" }}>{T("Возраст", L)}</th>
                                    <th style={{ textAlign: "right", padding: "5px 0" }}>{T("Доза", L)}</th>
                                </tr></thead>
                                <tbody>
                                    {[
                                        [L === "en" ? "3–5 years" : L === "uz" ? "3–5 yosh" : "3–5 лет", "¼ " + (L === "en" ? "tab (25 mg) × 3/day" : L === "uz" ? "tab (25 mg) × 3 k/k" : "таб. (25 мг) × 3 р/д")],
                                        [L === "en" ? "5–12 years" : L === "uz" ? "5–12 yosh" : "5–12 лет", "½ " + (L === "en" ? "tab (50 mg) × 3/day" : L === "uz" ? "tab (50 mg) × 3 k/k" : "таб. (50 мг) × 3 р/д")],
                                        [L === "en" ? "12+ years" : L === "uz" ? "12+ yosh" : "12+ лет", "1 " + (L === "en" ? "tab (100 mg) × 3/day" : L === "uz" ? "tab (100 mg) × 3 k/k" : "таб. (100 мг) × 3 р/д")],
                                    ].map(([a, d]) => (
                                        <tr key={a} style={{ borderBottom: "1px solid var(--border)" }}>
                                            <td style={{ padding: "5px 0" }}>{a}</td>
                                            <td style={{ textAlign: "right", padding: "5px 0", fontWeight: 600 }}>{d}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--accent)" }}>{T("💨 От вздутия — Эспумизан L", L)}</p>
                            <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
                                <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
                                    <th style={{ textAlign: "left", padding: "5px 0" }}>{T("Возраст", L)}</th>
                                    <th style={{ textAlign: "right", padding: "5px 0" }}>{T("Доза", L)}</th>
                                </tr></thead>
                                <tbody>
                                    {[
                                        [T("Младенцы", L), L === "en" ? "25 drops per feeding" : L === "uz" ? "Har ovqatlanishda 25 tomchi" : "25 капель в каждое кормление"],
                                        [L === "en" ? "1–6 years" : L === "uz" ? "1–6 yosh" : "1–6 лет", L === "en" ? "25 drops 3–5/day" : L === "uz" ? "25 tomchi 3–5 k/k" : "25 капель 3–5 р/д"],
                                        [L === "en" ? "6–14 years" : L === "uz" ? "6–14 yosh" : "6–14 лет", L === "en" ? "25–50 drops 3–5/day" : L === "uz" ? "25–50 tomchi 3–5 k/k" : "25–50 капель 3–5 р/д"],
                                    ].map(([a, d]) => (
                                        <tr key={a} style={{ borderBottom: "1px solid var(--border)" }}>
                                            <td style={{ padding: "5px 0" }}>{a}</td>
                                            <td style={{ textAlign: "right", padding: "5px 0", fontWeight: 600 }}>{d}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "#8b5cf6" }}>{T("🧴 Сорбент — Полисорб", L)}</p>
                            <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
                                <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
                                    <th style={{ textAlign: "left", padding: "5px 0" }}>{T("Вес", L)}</th>
                                    <th style={{ textAlign: "right", padding: "5px 0" }}>{T("Доза", L)}</th>
                                </tr></thead>
                                <tbody>
                                    {[
                                        [L === "en" ? "under 10 kg" : L === "uz" ? "10 kg gacha" : "до 10 кг", L === "en" ? "0.5–1.5 tsp/day" : L === "uz" ? "0,5–1,5 ch.q./kun" : "0,5–1,5 ч.л. в сутки"],
                                        ["11–20 " + (L === "en" ? "kg" : L === "uz" ? "kg" : "кг"), L === "en" ? "1 tsp (50 ml water) × 3/day" : L === "uz" ? "1 ch.q. (50 ml suv) × 3 k/k" : "1 ч.л. с горкой (50 мл воды) × 3 р/д"],
                                        ["21–30 " + (L === "en" ? "kg" : L === "uz" ? "kg" : "кг"), L === "en" ? "1 tsp (70 ml water) × 3/day" : L === "uz" ? "1 ch.q. (70 ml suv) × 3 k/k" : "1 ч.л. с горкой (70 мл воды) × 3 р/д"],
                                    ].map(([a, d]) => (
                                        <tr key={a} style={{ borderBottom: "1px solid var(--border)" }}>
                                            <td style={{ padding: "5px 0" }}>{a}</td>
                                            <td style={{ textAlign: "right", padding: "5px 0", fontWeight: 600 }}>{d}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <button className="btn-primary" onClick={() => setStep("nutrition")}>{T("🍽️ Питание при боли →", L)}</button>
                        <button className="btn-primary" onClick={handleFinish} style={{ textAlign: "center", background: "var(--bg-card)", color: "var(--primary)", border: "2px solid var(--primary)" }}>{t("Готово", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("red_flags")}>{t("🔄 Начать сначала", L)}</button>
                    </>
                )}

                {/* ═══ 6. NUTRITION ═══ */}
                {step === "nutrition" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>restaurant</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Шаг 6: Питание при боли в животе", L)}</p>
                        </div>
                        <div className="card">
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <div style={{ padding: "10px", background: "#dcfce7", borderRadius: "10px" }}>
                                    <p><strong>{T("nutr1_h", L)}</strong></p>
                                    <p>{T("nutr1", L)}</p>
                                </div>
                                <div style={{ padding: "10px", background: "#fff7ed", borderRadius: "10px" }}>
                                    <p><strong>{T("nutr2_h", L)}</strong></p>
                                    <p>{T("nutr2", L)}</p>
                                </div>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={handleFinish} style={{ width: "100%", marginBottom: "12px" }}>{t("Готово", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("red_flags")}>{t("🔄 Начать сначала", L)}</button>
                    </>
                )}
            </div>
        </>
    );
}
