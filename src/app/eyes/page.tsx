"use client";
import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { t, Lang } from "@/lib/i18n";

/*
  State machine:
  redness_check     → Есть покраснение и отечность?
    YES → a_discharge  (Ветка А: желто-зеленые выделения?)
    NO  → b_discharge  (Ветка Б: желто-зеленые выделения?)

  a_discharge → YES → tobramycin  |  NO → compress_drops
  b_discharge → YES → tobramycin  |  NO → b_watery

  b_watery → YES → compress_drops  |  NO → no_issue

  tobramycin / compress_drops → follow_up (через 3 дня улучшения?)
  follow_up → YES → finish  |  NO → see_doctor
*/

type Step =
    | "redness_check"
    | "a_discharge" | "b_discharge" | "b_watery"
    | "tobramycin" | "compress_drops" | "no_issue"
    | "follow_up" | "finish" | "see_doctor";

/* ── Module-local translations ── */
const tx: Record<string, Record<Lang, string>> = {
    "Шаг 1: Проверка состояния глаз": { ru: "Шаг 1: Проверка состояния глаз", uz: "1-qadam: Ko'z holatini tekshirish", en: "Step 1: Eye condition check" },
    "Осмотрите глаза ребёнка": { ru: "Осмотрите глаза ребёнка", uz: "Bolaning ko'zlarini ko'rib chiqing", en: "Examine the child's eyes" },
    "Есть покраснение и отёчность глаз?": { ru: "Есть покраснение и отёчность глаз?", uz: "Ko'zlarda qizarish va shishish bormi?", en: "Is there redness and swelling of the eyes?" },
    "👁️ Да": { ru: "👁️ Да", uz: "👁️ Ha", en: "👁️ Yes" },
    "✅ Нет": { ru: "✅ Нет", uz: "✅ Yo'q", en: "✅ No" },
    "Ветка А: Покраснение есть": { ru: "Ветка А: Покраснение есть", uz: "A yo'nalish: Qizarish bor", en: "Path A: Redness present" },
    "Уточняем характер выделений": { ru: "Уточняем характер выделений", uz: "Ajralma xarakterini aniqlaymiz", en: "Checking discharge type" },
    "Есть слизистые жёлто-зелёные выделения из глаз?": { ru: "Есть слизистые жёлто-зелёные выделения из глаз?", uz: "Ko'zlardan sariq-yashil shilimshiq ajralma bormi?", en: "Is there yellow-green mucus discharge from the eyes?" },
    "💛 Да, гнойные": { ru: "💛 Да, гнойные", uz: "💛 Ha, yiringli", en: "💛 Yes, purulent" },
    "💧 Нет": { ru: "💧 Нет", uz: "💧 Yo'q", en: "💧 No" },
    "Ветка Б: Покраснения нет": { ru: "Ветка Б: Покраснения нет", uz: "B yo'nalish: Qizarish yo'q", en: "Path B: No redness" },
    "Водянистые выделения": { ru: "Водянистые выделения", uz: "Suvli ajralma", en: "Watery discharge" },
    "Есть водянистые выделения из глаз?": { ru: "Есть водянистые выделения из глаз?", uz: "Ko'zlardan suvli ajralma bormi?", en: "Is there watery discharge from the eyes?" },
    "Прозрачные, слёзоподобные": { ru: "Прозрачные, слёзоподобные", uz: "Tiniq, ko'z yoshiga o'xshash", en: "Clear, tear-like" },
    "💧 Да, водянистые": { ru: "💧 Да, водянистые", uz: "💧 Ha, suvli", en: "💧 Yes, watery" },
    "Глаза в порядке": { ru: "Глаза в порядке", uz: "Ko'zlar yaxshi", en: "Eyes are fine" },
    "eyes_no_issue": { ru: "Ничего с глазами делать не нужно. Продолжайте наблюдение.", uz: "Ko'zlarga hech narsa qilish shart emas. Kuzatishni davom ettiring.", en: "No eye treatment needed. Continue monitoring." },
    "Лечение: антибактериальные капли": { ru: "Лечение: антибактериальные капли", uz: "Davolash: antibakterial tomchilar", en: "Treatment: antibacterial drops" },
    "Жёлто-зелёные выделения": { ru: "Жёлто-зелёные выделения", uz: "Sariq-yashil ajralma", en: "Yellow-green discharge" },
    "Схема лечения": { ru: "Схема лечения", uz: "Davolash rejasi", en: "Treatment plan" },
    "1️⃣ Обработка глаз": { ru: "1️⃣ Обработка глаз", uz: "1️⃣ Ko'zlarni tozalash", en: "1️⃣ Eye cleaning" },
    "eyes_chlorhex": { ru: "Протирать глаза ватным диском, смоченным в растворе Хлоргексидина", uz: "Xlorheksidin eritmasiga botilgan paxta disk bilan ko'zlarni artish", en: "Wipe eyes with cotton pad soaked in Chlorhexidine solution" },
    "eyes_direction": { ru: "👉 От внешнего уголка к внутреннему", uz: "👉 Tashqi burchakdan ichki burchakka", en: "👉 From outer corner to inner" },
    "eyes_freq1": { ru: "📋 2–3 раза в день, 3–5 дней", uz: "📋 Kuniga 2–3 marta, 3–5 kun", en: "📋 2–3 times daily, 3–5 days" },
    "2️⃣ Антибактериальные капли": { ru: "2️⃣ Антибактериальные капли", uz: "2️⃣ Antibakterial tomchilar", en: "2️⃣ Antibacterial drops" },
    "eyes_tobra": { ru: "Закапывать капли с ТОБРАМИЦИНОМ", uz: "TOBRAMITSIN tomchisini tomizing", en: "Instill TOBRAMYCIN drops" },
    "eyes_tobra_freq": { ru: "📋 По 2 капли, 3 раза в день, 5 дней", uz: "📋 2 tomchidan, kuniga 3 marta, 5 kun", en: "📋 2 drops, 3 times daily, 5 days" },
    "Оценить результат через 3 дня →": { ru: "Оценить результат через 3 дня →", uz: "3 kundan keyin natijani baholash →", en: "Assess results in 3 days →" },
    "Лечение: компрессы и капли": { ru: "Лечение: компрессы и капли", uz: "Davolash: kompresslar va tomchilar", en: "Treatment: compresses and drops" },
    "1️⃣ Холодные компрессы": { ru: "1️⃣ Холодные компрессы", uz: "1️⃣ Sovuq kompresslar", en: "1️⃣ Cold compresses" },
    "eyes_compress": { ru: "На закрытые глаза", uz: "Yopiq ko'zlarga", en: "On closed eyes" },
    "eyes_compress_freq": { ru: "📋 2 раза в день, 2–3 дня до облегчения", uz: "📋 Kuniga 2 marta, 2–3 kun yengillaguncha", en: "📋 2 times daily, 2–3 days until relief" },
    "2️⃣ Увлажняющие капли": { ru: "2️⃣ Увлажняющие капли", uz: "2️⃣ Namlovchi tomchilar", en: "2️⃣ Moisturizing drops" },
    "eyes_hyal": { ru: "Капли с Гиалуронатом натрия", uz: "Natriy gialuronat tomchilari", en: "Sodium hyaluronate drops" },
    "eyes_hyal_ex": { ru: "Например: РОХТА (без ментола), Систейн Ультра или ТобраДекс", uz: "Masalan: ROHTA (mentolsiz), Sistain Ultra yoki TobraDeks", en: "E.g.: ROHTA (no menthol), Systane Ultra, or TobraDex" },
    "eyes_hyal_sched": { ru: "📋 Схема:", uz: "📋 Rejasi:", en: "📋 Schedule:" },
    "eyes_2d_3x": { ru: "• Первые 2 дня: 1 капля × 3 раза в день", uz: "• Dastlabki 2 kun: 1 tomchi × kuniga 3 marta", en: "• First 2 days: 1 drop × 3 times daily" },
    "eyes_2d_1x": { ru: "• Следующие 2 дня: 1 капля × 1 раз в день", uz: "• Keyingi 2 kun: 1 tomchi × kuniga 1 marta", en: "• Next 2 days: 1 drop × 1 time daily" },
    "Шаг 2: Оценка результата": { ru: "Шаг 2: Оценка результата", uz: "2-qadam: Natijani baholash", en: "Step 2: Results assessment" },
    "Через 3 дня лечения": { ru: "Через 3 дня лечения", uz: "3 kunlik davolashdan keyin", en: "After 3 days of treatment" },
    "Есть улучшения в течение 3 дней?": { ru: "Есть улучшения в течение 3 дней?", uz: "3 kun ichida yaxshilanish bormi?", en: "Any improvement within 3 days?" },
    "✅ Да, лучше": { ru: "✅ Да, лучше", uz: "✅ Ha, yaxshilandi", en: "✅ Yes, better" },
    "❌ Нет": { ru: "❌ Нет", uz: "❌ Yo'q", en: "❌ No" },
    "Есть улучшения! 🎉": { ru: "Есть улучшения! 🎉", uz: "Yaxshilanish bor! 🎉", en: "Improvement noted! 🎉" },
    "Рекомендация": { ru: "Рекомендация", uz: "Tavsiya", en: "Recommendation" },
    "eyes_finish1": { ru: "💊 Закончите начатое лечение до конца", uz: "💊 Boshlangan davolashni oxirigacha tugating", en: "💊 Complete the full course of treatment" },
    "eyes_finish2": { ru: "⚠️ Не прерывайте курс, даже если симптомы ушли", uz: "⚠️ Alomatlar yo'qolsa ham kursni to'xtatmang", en: "⚠️ Don't stop the course even if symptoms disappear" },
    "eyes_finish3": { ru: "👀 Продолжайте наблюдение за состоянием глаз", uz: "👀 Ko'z holatini kuzatishni davom ettiring", en: "👀 Continue monitoring eye condition" },
    "Обратитесь к врачу!": { ru: "Обратитесь к врачу!", uz: "Shifokorga murojaat qiling!", en: "See a doctor!" },
    "eyes_no_improve": { ru: "Нет улучшений за 3 дня — необходим осмотр для исключения инфекционного процесса", uz: "3 kun ichida yaxshilanish yo'q — infektsiya jarayonini istisno qilish uchun ko'rik kerak", en: "No improvement in 3 days — examination needed to rule out infection" },
    "До визита к врачу:": { ru: "До визита к врачу:", uz: "Shifokorga borishdan oldin:", en: "Before seeing the doctor:" },
    "eyes_doc1": { ru: "💊 Продолжайте текущее лечение", uz: "💊 Joriy davolashni davom ettiring", en: "💊 Continue current treatment" },
    "eyes_doc2": { ru: "🧴 Не трогайте глаза руками", uz: "🧴 Ko'zlarni qo'l bilan ushlamang", en: "🧴 Don't touch eyes with hands" },
    "eyes_doc3": { ru: "🧼 Чаще мойте руки ребёнку", uz: "🧼 Bolaning qo'llarini tez-tez yuving", en: "🧼 Wash the child's hands frequently" },
};
const T = (key: string, L: Lang) => tx[key]?.[L] || t(key, L);

export default function EyesPage() {
    const { logEvent, langPref } = useApp();
    const L = langPref;
    const router = useRouter();
    const [step, setStep] = useState<Step>("redness_check");

    const stepNum: Record<Step, number> = {
        redness_check: 1,
        a_discharge: 1, b_discharge: 1, b_watery: 1,
        tobramycin: 2, compress_drops: 2, no_issue: 2,
        follow_up: 3, finish: 3, see_doctor: 3,
    };
    const totalSteps = 3;
    const cur = stepNum[step];
    const progressPct = Math.round((cur / totalSteps) * 100);

    const handleStartEvent = (nextStep: Step) => {
        logEvent("Глаза", "start", nextStep);
        setStep(nextStep);
    };

    const handleFinish = () => {
        logEvent("Глаза", "end");
        router.push("/");
    };

    return (
        <>
            <div className="sticky-header">
                <div className="progress-wrap" style={{ padding: "8px 16px 0" }}>
                    <span className="label">{t("Шаг", L)} {cur} {t("из", L)} {totalSteps}</span>
                    <span className="pct">{progressPct}%</span>
                </div>
                <div className="progress-bar" style={{ margin: "0 16px 8px" }}>
                    <div className="fill" style={{ width: `${progressPct}%` }} />
                </div>
                <div className="header-row">
                    <Link href="/diagnostics" className="back-btn"><span className="material-symbols-outlined">arrow_back</span></Link>
                    <h1>{t("Глаза", L)}</h1><span />
                </div>
            </div>

            <div className="page-body">
                {/* ===== REDNESS CHECK ===== */}
                {step === "redness_check" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>visibility</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Шаг 1: Проверка состояния глаз", L)}</p>
                            <p className="section-sub" style={{ marginTop: "4px" }}>{T("Осмотрите глаза ребёнка", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("Есть покраснение и отёчность глаз?", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => handleStartEvent("a_discharge")}>{T("👁️ Да", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => handleStartEvent("b_discharge")}>{T("✅ Нет", L)}</button>
                        </div>
                    </>
                )}

                {/* ===== ВЕТКА А: discharge check ===== */}
                {step === "a_discharge" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#ef4444" }}>emergency</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Ветка А: Покраснение есть", L)}</p>
                            <p className="section-sub">{T("Уточняем характер выделений", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("Есть слизистые жёлто-зелёные выделения из глаз?", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => setStep("tobramycin")}>{T("💛 Да, гнойные", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("compress_drops")}>{T("💧 Нет", L)}</button>
                        </div>
                        <button className="btn-outline" onClick={() => setStep("redness_check")}>{t("Назад", L)}</button>
                    </>
                )}

                {/* ===== ВЕТКА Б: discharge check ===== */}
                {step === "b_discharge" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>visibility</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Ветка Б: Покраснения нет", L)}</p>
                            <p className="section-sub">{T("Уточняем характер выделений", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("Есть слизистые жёлто-зелёные выделения из глаз?", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => setStep("tobramycin")}>{T("💛 Да, гнойные", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("b_watery")}>{T("✅ Нет", L)}</button>
                        </div>
                        <button className="btn-outline" onClick={() => setStep("redness_check")}>{t("Назад", L)}</button>
                    </>
                )}

                {/* ===== ВЕТКА Б: watery check ===== */}
                {step === "b_watery" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#8b5cf6" }}>water_drop</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Водянистые выделения", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("Есть водянистые выделения из глаз?", L)}</p>
                            <p className="section-sub" style={{ textAlign: "center", marginTop: "4px" }}>{T("Прозрачные, слёзоподобные", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => setStep("compress_drops")}>{T("💧 Да, водянистые", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("no_issue")}>{T("✅ Нет", L)}</button>
                        </div>
                        <button className="btn-outline" onClick={() => setStep("b_discharge")}>{t("Назад", L)}</button>
                    </>
                )}

                {/* ===== NO ISSUE ===== */}
                {step === "no_issue" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#22c55e" }}>check_circle</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Глаза в порядке", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{T("eyes_no_issue", L)}</p>
                        </div>
                        <Link href="/diagnostics" className="btn-primary" style={{ textAlign: "center" }}>{t("Готово", L)}</Link>
                        <button className="btn-outline" onClick={() => setStep("redness_check")}>{t("Назад", L)}</button>
                    </>
                )}

                {/* ===== TOBRAMYCIN PROTOCOL ===== */}
                {step === "tobramycin" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#ef4444" }}>medication</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Лечение: антибактериальные капли", L)}</p>
                            <p className="section-sub">{T("Жёлто-зелёные выделения", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{T("Схема лечения", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <div style={{ padding: "10px", background: "#dcfce7", borderRadius: "10px" }}>
                                    <p><strong>{T("1️⃣ Обработка глаз", L)}</strong></p>
                                    <p>{T("eyes_chlorhex", L)}</p>
                                    <p>{T("eyes_direction", L)}</p>
                                    <p>{T("eyes_freq1", L)}</p>
                                </div>
                                <div style={{ padding: "10px", background: "#fff7ed", borderRadius: "10px" }}>
                                    <p><strong>{T("2️⃣ Антибактериальные капли", L)}</strong></p>
                                    <p>{T("eyes_tobra", L)}</p>
                                    <p>{T("eyes_tobra_freq", L)}</p>
                                </div>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={() => setStep("follow_up")}>
                            {T("Оценить результат через 3 дня →", L)}
                        </button>
                        <button className="btn-outline" onClick={() => setStep("redness_check")}>{t("🔄 Начать сначала", L)}</button>
                    </>
                )}

                {/* ===== COMPRESS + DROPS PROTOCOL ===== */}
                {step === "compress_drops" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>medication</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Лечение: компрессы и капли", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{T("Схема лечения", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <div style={{ padding: "10px", background: "#dcfce7", borderRadius: "10px" }}>
                                    <p><strong>{T("1️⃣ Холодные компрессы", L)}</strong></p>
                                    <p>{T("eyes_compress", L)}</p>
                                    <p>{T("eyes_compress_freq", L)}</p>
                                </div>
                                <div style={{ padding: "10px", background: "#fff7ed", borderRadius: "10px" }}>
                                    <p><strong>{T("2️⃣ Увлажняющие капли", L)}</strong></p>
                                    <p>{T("eyes_hyal", L)}</p>
                                    <p style={{ fontSize: "12px", marginTop: "4px" }}>{T("eyes_hyal_ex", L)}</p>
                                    <p style={{ marginTop: "8px" }}>{T("eyes_hyal_sched", L)}</p>
                                    <p>{T("eyes_2d_3x", L)}</p>
                                    <p>{T("eyes_2d_1x", L)}</p>
                                </div>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={() => setStep("follow_up")}>
                            {T("Оценить результат через 3 дня →", L)}
                        </button>
                        <button className="btn-outline" onClick={() => setStep("redness_check")}>{t("🔄 Начать сначала", L)}</button>
                    </>
                )}

                {/* ===== FOLLOW-UP (Step 2) ===== */}
                {step === "follow_up" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--accent)" }}>fact_check</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Шаг 2: Оценка результата", L)}</p>
                            <p className="section-sub">{T("Через 3 дня лечения", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("Есть улучшения в течение 3 дней?", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "#22c55e" }} onClick={() => setStep("finish")}>{T("✅ Да, лучше", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => setStep("see_doctor")}>{T("❌ Нет", L)}</button>
                        </div>
                    </>
                )}

                {/* ===== FINISH ===== */}
                {step === "finish" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#22c55e" }}>sentiment_satisfied</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Есть улучшения! 🎉", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{T("Рекомендация", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <p>{T("eyes_finish1", L)}</p>
                                <p>{T("eyes_finish2", L)}</p>
                                <p>{T("eyes_finish3", L)}</p>
                            </div>
                        </div>
                        <Link href="/diagnostics" className="btn-primary" style={{ textAlign: "center" }}>{t("Готово", L)}</Link>
                        <button className="btn-outline" onClick={() => setStep("redness_check")}>{t("🔄 Начать сначала", L)}</button>
                    </>
                )}

                {/* ===== SEE DOCTOR ===== */}
                {step === "see_doctor" && (
                    <>
                        <div className="card" style={{ background: "#dc2626", color: "white", border: "none", textAlign: "center", padding: "24px" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", opacity: 0.9 }}>local_hospital</span>
                            <p style={{ fontSize: "22px", fontWeight: 700, marginTop: "8px" }}>{T("Обратитесь к врачу!", L)}</p>
                            <p style={{ fontSize: "14px", opacity: 0.9, marginTop: "8px" }}>
                                {T("eyes_no_improve", L)}
                            </p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--accent)" }}>{T("До визита к врачу:", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <p>{T("eyes_doc1", L)}</p>
                                <p>{T("eyes_doc2", L)}</p>
                                <p>{T("eyes_doc3", L)}</p>
                            </div>
                        </div>
                        <Link href="/diagnostics" className="btn-primary" style={{ textAlign: "center" }}>{t("Готово", L)}</Link>
                        <button className="btn-outline" onClick={() => setStep("redness_check")}>{t("🔄 Начать сначала", L)}</button>
                    </>
                )}
            </div>
        </>
    );
}
