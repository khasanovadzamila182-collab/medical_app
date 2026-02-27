"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { t, Lang } from "@/lib/i18n";
import lx from "./i18n-lungs";

const T = (k: string, L: Lang) => lx[k]?.[L] || t(k, L);

type CoughType = "wet" | "dry" | "barking" | "paroxysmal" | null;
type Step =
    | "start"
    | "wet_active" | "wet_active_yes" | "wet_3days" | "wet_3days_no"
    | "wet_fever" | "wet_fever_no" | "wet_doctor"
    | "dry_rare" | "dry_rare_3days" | "dry_rare_early" | "dry_rare_orvi"
    | "dry_rare_still_sick" | "dry_rare_6weeks" | "dry_residual" | "dry_progressing"
    | "dry_residual_warning" | "dry_doctor"
    | "dry_freq_3days" | "dry_freq_early" | "dry_freq_hoarse" | "dry_berodual_age"
    | "dry_freq_orvi"
    | "bark_hoarse" | "bark_dyspnea" | "bark_mild" | "bark_age6m"
    | "bark_doctor" | "bark_pulmicort_age"
    | "parox_series" | "parox_night" | "parox_pertussis"
    | "parox_wheezing" | "parox_general" | "parox_orvi"
    | "parox_urgent" | "parox_age6m" | "parox_doctor" | "parox_berodual_age";

function MoistureAdvice({ L }: { L: Lang }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
            <p>{T("moist1", L)}</p>
            <p>{T("moist2", L)}</p>
        </div>
    );
}

function SputumAdvice({ L }: { L: Lang }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
            <p style={{ fontWeight: 600 }}>{T("sputum_h", L)}</p>
            <p>{T("sputum1", L)}</p>
            <p>{T("sputum2", L)}</p>
            <p>{T("sputum3", L)}</p>
            <p>{T("sputum4", L)}</p>
            <p>{T("sputum5", L)}</p>
        </div>
    );
}

function BerodualTable({ L }: { L: Lang }) {
    return (
        <div className="card">
            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{T("berodual_h", L)}</p>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px" }}>{T("berodual_sub", L)}</p>
            <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th style={{ textAlign: "left", padding: "6px 0" }}>{T("Возраст", L)}</th>
                    <th style={{ textAlign: "right", padding: "6px 0" }}>{T("Капель", L)}</th>
                </tr></thead>
                <tbody>
                    {[["6–12 " + (L === "en" ? "mo" : L === "uz" ? "oy" : "мес"), "8"],
                    ["1–2 " + (L === "en" ? "y" : L === "uz" ? "yosh" : "года"), "8"],
                    ["2–5 " + (L === "en" ? "y" : L === "uz" ? "yosh" : "лет"), "10"],
                    ["5–10 " + (L === "en" ? "y" : L === "uz" ? "yosh" : "лет"), "12"],
                    ["10+ " + (L === "en" ? "y" : L === "uz" ? "yosh" : "лет"), "15"]].map(([a, d]) => (
                        <tr key={a} style={{ borderBottom: "1px solid var(--border)" }}>
                            <td style={{ padding: "6px 0" }}>{a}</td>
                            <td style={{ textAlign: "right", padding: "6px 0", fontWeight: 600 }}>{d}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function PulmicortTable({ L }: { L: Lang }) {
    return (
        <div className="card">
            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{T("pulmi_h", L)}</p>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px" }}>{T("pulmi_note2", L)}</p>
            <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th style={{ textAlign: "left", padding: "6px 0" }}>{T("Возраст", L)}</th>
                    <th style={{ textAlign: "right", padding: "6px 0" }}>{T("Доза", L)}</th>
                </tr></thead>
                <tbody>
                    {[["6–12 " + (L === "en" ? "mo" : L === "uz" ? "oy" : "мес"), "0,25 мг · 2 мл"],
                    ["1–5 " + (L === "en" ? "y" : L === "uz" ? "yosh" : "лет"), "0,25 мг · 2 мл / 0,5 мг · 1 мл"],
                    ["5–12 " + (L === "en" ? "y" : L === "uz" ? "yosh" : "лет"), "0,5 мг · 2 мл"],
                    ["12+ " + (L === "en" ? "y" : L === "uz" ? "yosh" : "лет"), "0,5 мг · 4 мл"]].map(([a, d]) => (
                        <tr key={a} style={{ borderBottom: "1px solid var(--border)" }}>
                            <td style={{ padding: "6px 0" }}>{a}</td>
                            <td style={{ textAlign: "right", padding: "6px 0", fontWeight: 600 }}>{d}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function DoctorCard({ text, sub }: { text: string; sub?: string }) {
    return (
        <div className="card" style={{ background: "#dc2626", color: "white", border: "none", textAlign: "center", padding: "24px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", opacity: 0.9 }}>local_hospital</span>
            <p style={{ fontSize: "22px", fontWeight: 700, marginTop: "8px" }}>{text}</p>
            {sub && <p style={{ fontSize: "14px", opacity: 0.9, marginTop: "8px" }}>{sub}</p>}
        </div>
    );
}

export default function LungsPage() {
    const { childWeight, needsWeight, logEvent, langPref } = useApp();
    const L = langPref;
    const router = useRouter();
    const [step, setStep] = useState<Step>("start");
    const [coughType, setCoughType] = useState<CoughType>(null);
    const [ageGroup, setAgeGroup] = useState<string>("");

    const progressMap: Record<Step, number> = {
        start: 1,
        wet_active: 2, wet_active_yes: 3, wet_3days: 2, wet_3days_no: 3, wet_fever: 3, wet_fever_no: 3, wet_doctor: 3,
        dry_rare: 2, dry_rare_3days: 3, dry_rare_early: 3, dry_rare_orvi: 3, dry_rare_still_sick: 3,
        dry_rare_6weeks: 3, dry_residual: 3, dry_progressing: 3, dry_residual_warning: 3, dry_doctor: 3,
        dry_freq_3days: 3, dry_freq_early: 3, dry_freq_hoarse: 3, dry_berodual_age: 3, dry_freq_orvi: 3,
        bark_hoarse: 2, bark_dyspnea: 3, bark_mild: 3, bark_age6m: 3, bark_doctor: 3, bark_pulmicort_age: 3,
        parox_series: 2, parox_night: 3, parox_pertussis: 3, parox_wheezing: 3, parox_general: 3,
        parox_orvi: 3, parox_urgent: 3, parox_age6m: 3, parox_doctor: 3, parox_berodual_age: 3,
    };
    const total = 3;
    const cur = progressMap[step];
    const pct = Math.round((cur / total) * 100);

    const toDoseOrStep = (nextStep: Step) => {
        if (needsWeight()) { router.push("/profile?return=/lungs"); return; }
        setStep(nextStep);
    };

    const handleFinish = () => { logEvent("Кашель", "end"); router.push("/"); };

    const handleCoughTypeSelect = (type: CoughType, nextStep: Step) => {
        logEvent("Кашель", "start", type || "");
        setCoughType(type);
        setStep(nextStep);
    };

    return (
        <>
            <div className="sticky-header">
                <div className="progress-wrap" style={{ padding: "8px 16px 0" }}>
                    <span className="label">{t("Шаг", L)} {cur} {t("из", L)} {total}</span><span className="pct">{pct}%</span>
                </div>
                <div className="progress-bar" style={{ margin: "0 16px 8px" }}><div className="fill" style={{ width: `${pct}% ` }} /></div>
                <div className="header-row">
                    <Link href="/diagnostics" className="back-btn"><span className="material-symbols-outlined">arrow_back</span></Link>
                    <h1>{T("Кашель", L)}</h1><span />
                </div>
            </div>

            <div className="page-body">
                {step === "start" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>pulmonology</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Какой кашель у ребёнка?", L)}</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {([
                                ["wet", "wet_active", T("💦 Влажный", L), T("С мокротой", L), "var(--primary)"],
                                ["dry", "dry_rare", T("🌵 Сухой", L), T("Без мокроты", L), "var(--accent)"],
                                ["barking", "bark_hoarse", T("🐕 Лающий", L), T("Грубый, как лай", L), "#8b5cf6"],
                                ["paroxysmal", "parox_series", T("💨 Приступообразный", L), T("Серия выдохов + глубокий вдох", L), "#ef4444"],
                            ] as const).map(([type, s, label, desc, bg]) => (
                                <button key={s} className="card" style={{ textAlign: "left", cursor: "pointer", border: "2px solid transparent" }}
                                    onClick={() => handleCoughTypeSelect(type, s as Step)}
                                    onMouseOver={e => (e.currentTarget.style.borderColor = bg)}
                                    onMouseOut={e => (e.currentTarget.style.borderColor = "transparent")}>
                                    <p style={{ fontWeight: 600, fontSize: "15px" }}>{label}</p>
                                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{desc}</p>
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* ═══ WET ═══ */}
                {step === "wet_active" && (<>
                    <div className="card" style={{ textAlign: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>water_drop</span>
                        <p className="section-heading" style={{ marginTop: "8px" }}>{T("Влажный кашель", L)}</p>
                    </div>
                    <div className="card"><p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("wet_active_q", L)}</p></div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("wet_active_yes")}>{T("✅ Да", L)}</button>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => setStep("wet_3days")}>{T("❌ Нет", L)}</button>
                    </div>
                    <button className="btn-outline" onClick={() => setStep("start")}>{T("← Тип кашля", L)}</button>
                </>)}

                {step === "wet_active_yes" && (<>
                    <div className="card" style={{ textAlign: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#22c55e" }}>check_circle</span>
                        <p className="section-heading" style={{ marginTop: "8px" }}>{L === "en" ? "Child is active" : L === "uz" ? "Bola faol" : "Ребёнок активный"}</p>
                    </div>
                    <div className="card">
                        <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{t("Рекомендации", L)}</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                            <p>{T("wet_temp", L)}</p>
                        </div>
                        <MoistureAdvice L={L} />
                        <div style={{ marginTop: "8px" }}><SputumAdvice L={L} /></div>
                    </div>
                    <button className="btn-primary" style={{ textAlign: "center" }} onClick={handleFinish}>{t("Готово", L)}</button>
                    <button className="btn-outline" onClick={() => setStep("start")}>{t("🔄 Начать сначала", L)}</button>
                </>)}

                {step === "wet_3days" && (<>
                    <div className="card"><p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("3days_q", L)}</p></div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => setStep("wet_fever")}>{T("⏳ Да, больше 3 дней", L)}</button>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("wet_3days_no")}>{T("📅 Нет, менее 3", L)}</button>
                    </div>
                    <button className="btn-outline" onClick={() => setStep("wet_active")}>{t("Назад", L)}</button>
                </>)}

                {step === "wet_3days_no" && (<>
                    <div className="card" style={{ textAlign: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>medication</span>
                        <p className="section-heading" style={{ marginTop: "8px" }}>{T("Ранняя стадия", L)}</p>
                    </div>
                    <div className="card"><MoistureAdvice L={L} /><div style={{ marginTop: "8px" }}><SputumAdvice L={L} /></div></div>
                    <button className="btn-primary" style={{ textAlign: "center" }} onClick={handleFinish}>{t("Готово", L)}</button>
                    <button className="btn-outline" onClick={() => setStep("start")}>{t("🔄 Начать сначала", L)}</button>
                </>)}

                {step === "wet_fever" && (<>
                    <div className="card"><p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("fever38_q", L)}</p></div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => setStep("wet_doctor")}>{T("🔥 Да", L)}</button>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("wet_fever_no")}>{T("✅ Да", L).replace("✅", "✅")}</button>
                    </div>
                    <button className="btn-outline" onClick={() => setStep("wet_3days")}>{t("Назад", L)}</button>
                </>)}

                {step === "wet_doctor" && (<>
                    <DoctorCard text={T("Обратитесь к врачу!", L)} sub={T("Для исключения других патологий", L)} />
                    <button className="btn-primary" style={{ textAlign: "center" }} onClick={handleFinish}>{t("Готово", L)}</button>
                    <button className="btn-outline" onClick={() => setStep("start")}>{t("🔄 Начать сначала", L)}</button>
                </>)}

                {step === "wet_fever_no" && (<>
                    <div className="card" style={{ textAlign: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>medication</span>
                        <p className="section-heading" style={{ marginTop: "8px" }}>{t("Рекомендации", L)}</p>
                    </div>
                    <div className="card">
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{T("temp_tactic", L)}</p>
                        <MoistureAdvice L={L} /><div style={{ marginTop: "8px" }}><SputumAdvice L={L} /></div>
                    </div>
                    <button className="btn-primary" style={{ textAlign: "center" }} onClick={handleFinish}>{t("Готово", L)}</button>
                    <button className="btn-outline" onClick={() => setStep("start")}>{t("🔄 Начать сначала", L)}</button>
                </>)}

                {/* ═══ DRY ═══ */}
                {step === "dry_rare" && (<>
                    <div className="card" style={{ textAlign: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--accent)" }}>air</span>
                        <p className="section-heading" style={{ marginTop: "8px" }}>{T("Сухой кашель", L)}</p>
                    </div>
                    <div className="card"><p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("rare_q", L)}</p></div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("dry_rare_3days")}>{T("✅ Да, редкие", L)}</button>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => setStep("dry_freq_3days")}>{T("❌ Нет, частые", L)}</button>
                    </div>
                    <button className="btn-outline" onClick={() => setStep("start")}>{T("← Тип кашля", L)}</button>
                </>)}

                {step === "dry_rare_3days" && (<>
                    <div className="card"><p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("3days_start_q", L)}</p></div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("dry_rare_early")}>{T("📅 Да, недавно", L)}</button>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => setStep("dry_rare_orvi")}>{T("⏳ Нет, дольше", L)}</button>
                    </div>
                    <button className="btn-outline" onClick={() => setStep("dry_rare")}>{t("Назад", L)}</button>
                </>)}

                {step === "dry_rare_early" && (<>
                    <div className="card" style={{ textAlign: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#22c55e" }}>trending_up</span>
                        <p className="section-heading" style={{ marginTop: "8px" }}>{T("Начало ОРВИ", L)}</p>
                    </div>
                    <div className="info-box info-box-teal"><strong className="teal">{T("Это нормально:", L)}</strong> {T("dry_early_tip", L)}</div>
                    <div className="card"><MoistureAdvice L={L} /></div>
                    <button className="btn-primary" style={{ textAlign: "center" }} onClick={handleFinish}>{t("Готово", L)}</button>
                    <button className="btn-outline" onClick={() => setStep("start")}>{t("🔄 Начать сначала", L)}</button>
                </>)}

                {step === "dry_rare_orvi" && (<>
                    <div className="card"><p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("orvi_passed_q", L)}</p></div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("dry_rare_6weeks")}>{T("✅ Да, прошли", L)}</button>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => setStep("dry_rare_still_sick")}>{T("❌ Нет, болеет", L)}</button>
                    </div>
                    <button className="btn-outline" onClick={() => setStep("dry_rare_3days")}>{t("Назад", L)}</button>
                </>)}

                {step === "dry_rare_still_sick" && (<>
                    <div className="card" style={{ textAlign: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--accent)" }}>medication</span>
                        <p className="section-heading" style={{ marginTop: "8px" }}>{T("ОРВИ продолжается", L)}</p>
                    </div>
                    <div className="card">
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                            <p>{T("still1", L)}</p><p>{T("still2", L)}</p><p>{T("still3", L)}</p><p>{T("still4", L)}</p>
                        </div>
                    </div>
                    <button className="btn-primary" style={{ textAlign: "center" }} onClick={handleFinish}>{t("Готово", L)}</button>
                    <button className="btn-outline" onClick={() => setStep("start")}>{t("🔄 Начать сначала", L)}</button>
                </>)}

                {step === "dry_rare_6weeks" && (<>
                    <div className="card"><p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("6weeks_q", L)}</p></div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => setStep("dry_progressing")}>{T("⏳ Да, больше 6 нед", L)}</button>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("dry_residual")}>{T("📅 Нет, менее", L)}</button>
                    </div>
                    <button className="btn-outline" onClick={() => setStep("dry_rare_orvi")}>{t("Назад", L)}</button>
                </>)}

                {step === "dry_residual" && (<>
                    <div className="card" style={{ textAlign: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#22c55e" }}>check_circle</span>
                        <p className="section-heading" style={{ marginTop: "8px" }}>{T("Остаточный кашель", L)}</p>
                    </div>
                    <div className="info-box info-box-teal"><strong className="teal">{T("Это нормально:", L)}</strong> {T("residual_tip", L)}</div>
                    <div className="card">
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                            <p>{T("still1", L)}</p><p>{T("still3", L)}</p>
                        </div>
                    </div>
                    <button className="btn-primary" style={{ textAlign: "center" }} onClick={handleFinish}>{t("Готово", L)}</button>
                    <button className="btn-outline" onClick={() => setStep("start")}>{t("🔄 Начать сначала", L)}</button>
                </>)}

                {step === "dry_progressing" && (<>
                    <div className="card"><p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("progress_q", L)}</p></div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => setStep("dry_doctor")}>{T("📈 Да, хуже", L)}</button>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("dry_residual_warning")}>{T("📉 Нет, реже", L)}</button>
                    </div>
                    <button className="btn-outline" onClick={() => setStep("dry_rare_6weeks")}>{t("Назад", L)}</button>
                </>)}

                {step === "dry_doctor" && (<>
                    <DoctorCard text={T("Обратитесь к врачу!", L)} sub={T("Для исключения других патологий", L)} />
                    <button className="btn-primary" style={{ textAlign: "center" }} onClick={handleFinish}>{t("Готово", L)}</button>
                    <button className="btn-outline" onClick={() => setStep("start")}>{t("🔄 Начать сначала", L)}</button>
                </>)}

                {step === "dry_residual_warning" && (<>
                    <div className="card" style={{ textAlign: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#22c55e" }}>check_circle</span>
                        <p className="section-heading" style={{ marginTop: "8px" }}>{T("Остаточный кашель", L)}</p>
                    </div>
                    <div className="card">
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                            <p>{T("still1", L)}</p><p>{T("still3", L)}</p>
                        </div>
                    </div>
                    <div className="info-box info-box-orange"><strong className="orange">{T("Внимание:", L)}</strong> {T("resid_warn", L)}</div>
                    <button className="btn-primary" style={{ textAlign: "center" }} onClick={handleFinish}>{t("Готово", L)}</button>
                    <button className="btn-outline" onClick={() => setStep("start")}>{t("🔄 Начать сначала", L)}</button>
                </>)}

                {/* Dry frequent */}
                {step === "dry_freq_3days" && (<>
                    <div className="card" style={{ textAlign: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--accent)" }}>air</span>
                        <p className="section-heading" style={{ marginTop: "8px" }}>{T("Частый сухой кашель", L)}</p>
                    </div>
                    <div className="card"><p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("3days_start_q", L)}</p></div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("dry_freq_hoarse")}>{T("📅 Да, недавно", L)}</button>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => setStep("dry_freq_orvi")}>{T("⏳ Нет, дольше", L)}</button>
                    </div>
                    <button className="btn-outline" onClick={() => setStep("dry_rare")}>{t("Назад", L)}</button>
                </>)}

                {step === "dry_freq_hoarse" && (<>
                    <div className="card"><p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("hoarse_q", L)}</p></div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => toDoseOrStep("dry_berodual_age")}>{T("😮‍💨 Да, с хрипотой", L)}</button>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("dry_freq_early")}>{T("✅ Да", L).charAt(0) === "✅" ? T("✅ Да", L).replace("✅ Да", "✅ " + (L === "en" ? "No" : "Yo'q")) : T("✅ Да", L)}</button>
                    </div>
                    <button className="btn-outline" onClick={() => setStep("dry_freq_3days")}>{t("Назад", L)}</button>
                </>)}

                {step === "dry_freq_early" && (<>
                    <div className="info-box info-box-teal"><strong className="teal">{T("Это нормально:", L)}</strong> {T("dry_early_norm", L)}</div>
                    <div className="card"><MoistureAdvice L={L} /></div>
                    <button className="btn-primary" style={{ textAlign: "center" }} onClick={handleFinish}>{t("Готово", L)}</button>
                    <button className="btn-outline" onClick={() => setStep("start")}>{t("🔄 Начать сначала", L)}</button>
                </>)}

                {step === "dry_berodual_age" && (<>
                    <div className="card" style={{ textAlign: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#ef4444" }}>vaccines</span>
                        <p className="section-heading" style={{ marginTop: "8px" }}>{T("Ингаляции: Беродуал", L)}</p>
                    </div>
                    <BerodualTable L={L} />
                    <div className="card"><MoistureAdvice L={L} /><div style={{ marginTop: "8px" }}><SputumAdvice L={L} /></div></div>
                    <button className="btn-primary" style={{ textAlign: "center" }} onClick={handleFinish}>{t("Готово", L)}</button>
                    <button className="btn-outline" onClick={() => setStep("start")}>{t("🔄 Начать сначала", L)}</button>
                </>)}

                {step === "dry_freq_orvi" && (<>
                    <div className="card"><p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("orvi_passed_q", L)}</p></div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("dry_rare_6weeks")}>{T("✅ Да, прошли", L)}</button>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => setStep("dry_rare_still_sick")}>{T("❌ Нет, болеет", L)}</button>
                    </div>
                    <button className="btn-outline" onClick={() => setStep("dry_freq_3days")}>{t("Назад", L)}</button>
                </>)}

                {/* ═══ BARKING ═══ */}
                {step === "bark_hoarse" && (<>
                    <div className="card" style={{ textAlign: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#8b5cf6" }}>record_voice_over</span>
                        <p className="section-heading" style={{ marginTop: "8px" }}>{T("Лающий кашель", L)}</p>
                    </div>
                    <div className="card"><p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("hoarse_voice_q", L)}</p></div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn-primary" style={{ flex: 1, background: "#8b5cf6" }} onClick={() => setStep("bark_dyspnea")}>{T("😮‍💨 Да, осиплый", L)}</button>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("bark_mild")}>{T("✅ Да", L).replace("Да", L === "en" ? "No" : L === "uz" ? "Yo'q" : "Нет")}</button>
                    </div>
                    <button className="btn-outline" onClick={() => setStep("start")}>{T("← Тип кашля", L)}</button>
                </>)}

                {step === "bark_dyspnea" && (<>
                    <div className="card"><p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("dyspnea_q", L)}</p></div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => setStep("bark_age6m")}>{T("🫁 Да, усиливается", L)}</button>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("bark_mild")}>{T("✅ Нет / слабо", L)}</button>
                    </div>
                    <button className="btn-outline" onClick={() => setStep("bark_hoarse")}>{t("Назад", L)}</button>
                </>)}

                {step === "bark_mild" && (<>
                    <div className="card" style={{ textAlign: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#8b5cf6" }}>medication</span>
                        <p className="section-heading" style={{ marginTop: "8px" }}>{T("Ларингит: стабильное состояние", L)}</p>
                    </div>
                    <div className="card">
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                            <p>{T("calm1", L)}</p><p>{T("🌬️ Увлажнение", L)}</p><p>{T("still3", L)}</p>
                        </div>
                        <div style={{ marginTop: "8px" }}><SputumAdvice L={L} /></div>
                    </div>
                    <div className="card" style={{ background: "#f3e8ff", borderColor: "#e9d5ff" }}>
                        <p style={{ fontWeight: 600, fontSize: "14px", color: "#8b5cf6", marginBottom: "4px" }}>{T("Пульмикорт", L)}</p>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{T("pulmi_dose", L)}</p>
                        <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{T("pulmi_note", L)}</p>
                    </div>
                    <button className="btn-primary" style={{ textAlign: "center" }} onClick={handleFinish}>{t("Готово", L)}</button>
                    <button className="btn-outline" onClick={() => setStep("start")}>{t("🔄 Начать сначала", L)}</button>
                </>)}

                {step === "bark_age6m" && (<>
                    <div className="card"><p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("age6m_q", L)}</p></div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => toDoseOrStep("bark_pulmicort_age")}>{T("✅ Да, старше 6 мес", L)}</button>
                        <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => setStep("bark_doctor")}>{T("👶 Нет, младше", L)}</button>
                    </div>
                    <button className="btn-outline" onClick={() => setStep("bark_dyspnea")}>{t("Назад", L)}</button>
                </>)}

                {step === "bark_doctor" && (<>
                    <DoctorCard text={T("Обратитесь к врачу!", L)} sub={T("Для подбора дозы стероидов (Пульмикорт)", L)} />
                    <button className="btn-primary" style={{ textAlign: "center" }} onClick={handleFinish}>{t("Готово", L)}</button>
                    <button className="btn-outline" onClick={() => setStep("start")}>{t("🔄 Начать сначала", L)}</button>
                </>)}

                {step === "bark_pulmicort_age" && (<>
                    <div className="card" style={{ textAlign: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#8b5cf6" }}>vaccines</span>
                        <p className="section-heading" style={{ marginTop: "8px" }}>{T("Ингаляции: Пульмикорт", L)}</p>
                        <p className="section-sub">{T("pulmi_croup", L)}</p>
                    </div>
                    <PulmicortTable L={L} />
                    <div className="card">
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                            <p>{T("calm1", L)}</p><p>{T("🌬️ Увлажнение", L)}</p><p>{T("💧 Отпаивать", L)}</p>
                        </div>
                        <div style={{ marginTop: "8px" }}><SputumAdvice L={L} /></div>
                    </div>
                    <button className="btn-primary" style={{ textAlign: "center" }} onClick={handleFinish}>{t("Готово", L)}</button>
                    <button className="btn-outline" onClick={() => setStep("start")}>{t("🔄 Начать сначала", L)}</button>
                </>)}

                {/* ═══ PAROXYSMAL ═══ */}
                {step === "parox_series" && (<>
                    <div className="card" style={{ textAlign: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#ef4444" }}>emergency</span>
                        <p className="section-heading" style={{ marginTop: "8px" }}>{T("Приступообразный кашель", L)}</p>
                    </div>
                    <div className="card"><p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("parox_desc", L)}</p></div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => setStep("parox_night")}>{T("😰 Да", L)}</button>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("start")}>{T("✅ Да", L).replace("Да", L === "en" ? "No" : L === "uz" ? "Yo'q" : "Нет")}</button>
                    </div>
                    <button className="btn-outline" onClick={() => setStep("start")}>{T("← Тип кашля", L)}</button>
                </>)}

                {step === "parox_night" && (<>
                    <div className="card"><p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("night_q", L)}</p></div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => setStep("parox_pertussis")}>{T("🌙 Да, ночью", L)}</button>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("parox_wheezing")}>{T("☀️ Нет", L)}</button>
                    </div>
                    <button className="btn-outline" onClick={() => setStep("parox_series")}>{t("Назад", L)}</button>
                </>)}

                {step === "parox_pertussis" && (<>
                    <DoctorCard text={T("Подозрение на коклюш!", L)} sub={T("Необходим анализ и осмотр врача", L)} />
                    <div className="card">
                        <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--accent)" }}>{T("Действия:", L)}</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                            <p>{T("pertussis1", L)}</p><p>{T("pertussis2", L)}</p>
                        </div>
                    </div>
                    <button className="btn-primary" style={{ textAlign: "center" }} onClick={handleFinish}>{t("Готово", L)}</button>
                    <button className="btn-outline" onClick={() => setStep("start")}>{t("🔄 Начать сначала", L)}</button>
                </>)}

                {step === "parox_wheezing" && (<>
                    <div className="card"><p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("wheezing_q", L)}</p></div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => setStep("parox_orvi")}>{T("🫁 Да", L)}</button>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("parox_general")}>{T("✅ Да", L).replace("Да", L === "en" ? "No" : L === "uz" ? "Yo'q" : "Нет")}</button>
                    </div>
                    <button className="btn-outline" onClick={() => setStep("parox_night")}>{t("Назад", L)}</button>
                </>)}

                {step === "parox_general" && (<>
                    <div className="card" style={{ textAlign: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>medication</span>
                        <p className="section-heading" style={{ marginTop: "8px" }}>{t("Рекомендации", L)}</p>
                    </div>
                    <div className="card"><MoistureAdvice L={L} /><div style={{ marginTop: "8px" }}><SputumAdvice L={L} /></div></div>
                    <button className="btn-primary" style={{ textAlign: "center" }} onClick={handleFinish}>{t("Готово", L)}</button>
                    <button className="btn-outline" onClick={() => setStep("start")}>{t("🔄 Начать сначала", L)}</button>
                </>)}

                {step === "parox_orvi" && (<>
                    <div className="card"><p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("orvi_other_q", L)}</p></div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => toDoseOrStep("parox_age6m")}>{T("🤒 Да, есть ОРВИ", L)}</button>
                        <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => setStep("parox_urgent")}>{T("❌ Нет", L)}</button>
                    </div>
                    <button className="btn-outline" onClick={() => setStep("parox_wheezing")}>{t("Назад", L)}</button>
                </>)}

                {step === "parox_urgent" && (<>
                    <div className="card" style={{ background: "#dc2626", color: "white", border: "none", textAlign: "center", padding: "24px" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", opacity: 0.9 }}>sos</span>
                        <p style={{ fontSize: "22px", fontWeight: 700, marginTop: "8px" }}>{T("СРОЧНО К ВРАЧУ!", L)}</p>
                    </div>
                    <div className="card">
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                            <p>{T("urgent1", L)}</p><p>{T("urgent2", L)}</p>
                        </div>
                    </div>
                    <Link href="/diagnostics" className="btn-primary" style={{ textAlign: "center" }}>{t("Готово", L)}</Link>
                    <button className="btn-outline" onClick={() => setStep("start")}>{t("🔄 Начать сначала", L)}</button>
                </>)}

                {step === "parox_age6m" && (<>
                    <div className="card"><p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("age6m_q", L)}</p></div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("parox_berodual_age")}>{T("✅ Да, старше 6 мес", L)}</button>
                        <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => setStep("parox_doctor")}>{T("👶 Нет, младше", L)}</button>
                    </div>
                    <button className="btn-outline" onClick={() => setStep("parox_orvi")}>{t("Назад", L)}</button>
                </>)}

                {step === "parox_doctor" && (<>
                    <DoctorCard text={T("Обратитесь к врачу!", L)} sub={T("Для подбора дозы бронхолитиков", L)} />
                    <Link href="/diagnostics" className="btn-primary" style={{ textAlign: "center" }}>{t("Готово", L)}</Link>
                    <button className="btn-outline" onClick={() => setStep("start")}>{t("🔄 Начать сначала", L)}</button>
                </>)}

                {step === "parox_berodual_age" && (<>
                    <div className="card" style={{ textAlign: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#ef4444" }}>vaccines</span>
                        <p className="section-heading" style={{ marginTop: "8px" }}>{T("Ингаляции: Беродуал", L)}</p>
                        <p className="section-sub">{T("bero_3x6h", L)}</p>
                    </div>
                    <BerodualTable L={L} />
                    <div className="card"><MoistureAdvice L={L} /><div style={{ marginTop: "8px" }}><SputumAdvice L={L} /></div></div>
                    <button className="btn-primary" style={{ textAlign: "center" }} onClick={handleFinish}>{t("Готово", L)}</button>
                    <button className="btn-outline" onClick={() => setStep("start")}>{t("🔄 Начать сначала", L)}</button>
                </>)}
            </div>
        </>
    );
}
