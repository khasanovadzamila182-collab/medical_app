"use client";
import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { t, Lang } from "@/lib/i18n";

type Step = "pain_check" | "no_pain" | "wash_check" | "wash_wrong" | "discharge_check" | "otipax" | "see_doctor";

const tx: Record<string, Record<Lang, string>> = {
    "Шаг 1: Проверка жалоб": { ru: "Шаг 1: Проверка жалоб", uz: "1-qadam: Shikoyatlarni tekshirish", en: "Step 1: Check complaints" },
    "Оцените состояние ушей ребёнка": { ru: "Оцените состояние ушей ребёнка", uz: "Bolaning quloq holatini baholang", en: "Assess the child's ear condition" },
    "Есть ли жалобы на боль в ушах?": { ru: "Есть ли жалобы на боль в ушах?", uz: "Quloq og'rig'idan shikoyat bormi?", en: "Is there ear pain?" },
    "ears_tragus": { ru: "Ребёнок трогает/тянет ухо, плачет при нажатии на козелок", uz: "Bola qulog'ini ushlamoqda/tortmoqda, kozelokka bosganda yig'laydi", en: "Child touches/pulls ear, cries when tragus is pressed" },
    "😣 Да, болит": { ru: "😣 Да, болит", uz: "😣 Ha, og'riyapti", en: "😣 Yes, it hurts" },
    "😊 Нет": { ru: "😊 Нет", uz: "😊 Yo'q", en: "😊 No" },
    "Жалоб нет": { ru: "Жалоб нет", uz: "Shikoyat yo'q", en: "No complaints" },
    "ears_no_issue": { ru: "Ничего с ушами делать не нужно. Продолжайте наблюдение за состоянием ребёнка.", uz: "Quloqlarga hech narsa qilish shart emas. Bolaning holatini kuzatishni davom ettiring.", en: "No ear treatment needed. Continue monitoring the child." },
    "ears_tip": { ru: "Если боль в ушах появится позже, вернитесь к этому алгоритму.", uz: "Agar keyinroq quloq og'rig'i paydo bo'lsa, bu algoritmga qayting.", en: "If ear pain appears later, return to this algorithm." },
    "Совет:": { ru: "Совет:", uz: "Maslahat:", en: "Tip:" },
    "Шаг 2: Техника промывания": { ru: "Шаг 2: Техника промывания", uz: "2-qadam: Yuvish texnikasi", en: "Step 2: Washing technique" },
    "ears_wash_sub": { ru: "Оцените правильность промывания носа", uz: "Burun yuvish to'g'riligini baholang", en: "Assess the nasal washing technique" },
    "ears_wash_q": { ru: "Техника промывания носа была выполнена верно?", uz: "Burun yuvish texnikasi to'g'ri bajarilganmi?", en: "Was the nasal washing technique performed correctly?" },
    "ears_wash_note": { ru: "Неправильная техника может привести к попаданию жидкости в слуховую трубу", uz: "Noto'g'ri texnika suyuqlikning eshitish naychasiga kirishiga olib kelishi mumkin", en: "Incorrect technique may cause fluid to enter the ear canal" },
    "✅ Да, верно": { ru: "✅ Да, верно", uz: "✅ Ha, to'g'ri", en: "✅ Yes, correct" },
    "❌ Нет / Не уверена": { ru: "❌ Нет / Не уверена", uz: "❌ Yo'q / Ishonchim komil emas", en: "❌ No / Not sure" },
    "Неверная техника промывания": { ru: "Неверная техника промывания", uz: "Noto'g'ri yuvish texnikasi", en: "Incorrect washing technique" },
    "ears_otipax1": { ru: "💧 Закапать по 1 капле Отипакс в каждое ухо 1–2 дня", uz: "💧 Har bir quloqqa 1 tomchi Otipaks tomizing, 1–2 kun", en: "💧 Instill 1 drop of Otipax in each ear for 1–2 days" },
    "ears_fix_tech": { ru: "👃 Исправить технику промывания носа:", uz: "👃 Burun yuvish texnikasini tuzating:", en: "👃 Correct the nasal washing technique:" },
    "Правильная техника промывания": { ru: "Правильная техника промывания", uz: "To'g'ri yuvish texnikasi", en: "Correct washing technique" },
    "ears_tech1": { ru: "1️⃣ Наклоните голову ребёнка вперёд (подбородок к груди)", uz: "1️⃣ Bolaning boshini oldinga eging (iyak ko'krakka)", en: "1️⃣ Tilt child's head forward (chin to chest)" },
    "ears_tech2": { ru: "2️⃣ Введите раствор в одну ноздрю — жидкость должна вытекать из другой", uz: "2️⃣ Eritmani bir burun teshigiga kiriting — suyuqlik ikkinchisidan oqishi kerak", en: "2️⃣ Insert solution into one nostril — fluid should flow from the other" },
    "ears_tech3": { ru: "3️⃣ Не запрокидывайте голову! Это может привести к попаданию жидкости в уши", uz: "3️⃣ Boshni orqaga tashlamang! Bu suyuqlikning quloqlarga kirishiga olib kelishi mumkin", en: "3️⃣ Don't tilt the head back! This may cause fluid to enter the ears" },
    "ears_tech4": { ru: "4️⃣ После промывания — аккуратно высморкаться, зажимая одну ноздрю", uz: "4️⃣ Yuvishdan keyin — bir burun teshigini yopib ehtiyotlik bilan qoqing", en: "4️⃣ After washing — gently blow nose, closing one nostril" },
    "ears_wash_warn": { ru: "Неправильная техника промывания — частая причина отитов. Убедитесь, что голова ребёнка наклонена вперёд, а не назад.", uz: "Noto'g'ri yuvish texnikasi — otitning keng tarqalgan sababi. Bolaning boshi oldinga egilganiga ishonch hosil qiling.", en: "Incorrect washing is a common cause of ear infections. Make sure the child's head is tilted forward, not back." },
    "Шаг 3: Проверка выделений": { ru: "Шаг 3: Проверка выделений", uz: "3-qadam: Ajralmani tekshirish", en: "Step 3: Discharge check" },
    "Осмотрите ушную раковину": { ru: "Осмотрите ушную раковину", uz: "Quloq suprasini ko'rib chiqing", en: "Examine the ear shell" },
    "Есть выделения из ушей?": { ru: "Есть выделения из ушей?", uz: "Quloqdan ajralma bormi?", en: "Is there discharge from the ears?" },
    "ears_any_fluid": { ru: "Любая жидкость: прозрачная, жёлтая, гнойная", uz: "Har qanday suyuqlik: tiniq, sariq, yiringli", en: "Any fluid: clear, yellow, purulent" },
    "💧 Да, есть": { ru: "💧 Да, есть", uz: "💧 Ha, bor", en: "💧 Yes, present" },
    "✅ Нет": { ru: "✅ Нет", uz: "✅ Yo'q", en: "✅ No" },
    "Лечение": { ru: "Лечение", uz: "Davolash", en: "Treatment" },
    "ears_otipax_full": { ru: "💧 Закапать по 1 капле Отипакс в каждое ухо", uz: "💧 Har bir quloqqa 1 tomchi Otipaks tomizing", en: "💧 Instill 1 drop of Otipax in each ear" },
    "ears_course": { ru: "📅 Курс: 1–2 дня", uz: "📅 Kurs: 1–2 kun", en: "📅 Course: 1–2 days" },
    "ears_room_temp": { ru: "🌡️ Капли должны быть комнатной температуры", uz: "🌡️ Tomchilar xona haroratida bo'lishi kerak", en: "🌡️ Drops should be at room temperature" },
    "ears_lie_down": { ru: "🛏️ После закапывания полежать на боку 5 минут", uz: "🛏️ Tomizgandan keyin 5 daqiqa yonboshlab yoting", en: "🛏️ Lie on side for 5 minutes after instillation" },
    "ears_if_pain": { ru: "Если боль не проходит через 2 дня или усиливается — обратитесь к ЛОР-врачу.", uz: "Agar 2 kundan keyin og'riq o'tmasa yoki kuchaysa — LOR shifokorga murojaat qiling.", en: "If pain persists after 2 days or worsens — see an ENT doctor." },
    "Обратитесь к врачу!": { ru: "Обратитесь к врачу!", uz: "Shifokorga murojaat qiling!", en: "See a doctor!" },
    "ears_discharge_warn": { ru: "Выделения из ушей требуют осмотра ЛОР-врача для исключения инфекционного процесса", uz: "Quloqdan ajralma infektsiyani istisno qilish uchun LOR shifokor ko'rigini talab qiladi", en: "Ear discharge requires ENT examination to rule out infection" },
    "До визита к врачу:": { ru: "До визита к врачу:", uz: "Shifokorga borishdan oldin:", en: "Before seeing the doctor:" },
    "ears_doc1": { ru: "🚫 Не закапывайте ничего в уши до осмотра врача", uz: "🚫 Shifokor ko'rigunga qadar quloqlarga hech narsa tomizmang", en: "🚫 Don't put anything in the ears before doctor's examination" },
    "ears_doc2": { ru: "🧴 Аккуратно промокните выделения снаружи", uz: "🧴 Tashqaridagi ajralmani ehtiyotlik bilan artib oling", en: "🧴 Gently blot discharge outside" },
    "ears_doc3": { ru: "🛏️ Положите ребёнка больным ухом вниз", uz: "🛏️ Bolani og'riq qulog'i pastga qaratib yotqizing", en: "🛏️ Lay the child with the affected ear down" },
    "ears_doc4": { ru: "💊 При сильной боли — дайте обезболивающее (ибупрофен)", uz: "💊 Qattiq og'riqda — og'riq qoldiruvchi bering (ibuprofen)", en: "💊 For severe pain — give painkiller (ibuprofen)" },
};
const T = (key: string, L: Lang) => tx[key]?.[L] || t(key, L);

export default function EarsPage() {
    const { logEvent, langPref } = useApp();
    const L = langPref;
    const router = useRouter();
    const [step, setStep] = useState<Step>("pain_check");

    const stepNum: Record<Step, number> = {
        pain_check: 1, no_pain: 1,
        wash_check: 2, wash_wrong: 2,
        discharge_check: 3, otipax: 3, see_doctor: 3,
    };
    const totalSteps = 3;
    const cur = stepNum[step];
    const progressPct = Math.round((cur / totalSteps) * 100);

    const handleStartEvent = (nextStep: Step) => {
        logEvent("Уши", "start", nextStep);
        setStep(nextStep);
    };

    const handleFinish = () => {
        logEvent("Уши", "end");
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
                    <Link href="/diagnostics" className="back-btn">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <h1>{t("Уши", L)}</h1><span />
                </div>
            </div>

            <div className="page-body">
                {step === "pain_check" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#8b5cf6" }}>hearing</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Шаг 1: Проверка жалоб", L)}</p>
                            <p className="section-sub" style={{ marginTop: "4px" }}>{T("Оцените состояние ушей ребёнка", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("Есть ли жалобы на боль в ушах?", L)}</p>
                            <p className="section-sub" style={{ textAlign: "center", marginTop: "4px" }}>{T("ears_tragus", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => handleStartEvent("wash_check")}>{T("😣 Да, болит", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => handleStartEvent("no_pain")}>{T("😊 Нет", L)}</button>
                        </div>
                    </>
                )}

                {step === "no_pain" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#22c55e" }}>check_circle</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Жалоб нет", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{T("Рекомендация", L)}</p>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{T("ears_no_issue", L)}</p>
                        </div>
                        <div className="info-box info-box-teal">
                            <strong className="teal">{T("Совет:", L)}</strong> {T("ears_tip", L)}
                        </div>
                        <button className="btn-primary" onClick={handleFinish} style={{ textAlign: "center", width: "100%", marginBottom: "12px" }}>{t("Готово", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("pain_check")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "wash_check" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>air</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Шаг 2: Техника промывания", L)}</p>
                            <p className="section-sub" style={{ marginTop: "4px" }}>{T("ears_wash_sub", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("ears_wash_q", L)}</p>
                            <p className="section-sub" style={{ textAlign: "center", marginTop: "4px" }}>{T("ears_wash_note", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("discharge_check")}>{T("✅ Да, верно", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => setStep("wash_wrong")}>{T("❌ Нет / Не уверена", L)}</button>
                        </div>
                        <button className="btn-outline" onClick={() => setStep("pain_check")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "wash_wrong" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--accent)" }}>warning</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Неверная техника промывания", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{t("План действий", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <p>{T("ears_otipax1", L)}</p>
                                <p>{T("ears_fix_tech", L)}</p>
                            </div>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "#8b5cf6" }}>{T("Правильная техника промывания", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <p>{T("ears_tech1", L)}</p>
                                <p>{T("ears_tech2", L)}</p>
                                <p>{T("ears_tech3", L)}</p>
                                <p>{T("ears_tech4", L)}</p>
                            </div>
                        </div>
                        <div className="info-box info-box-orange">
                            <strong className="orange">{t("Важно:", L)}</strong> {T("ears_wash_warn", L)}
                        </div>
                        <button className="btn-primary" onClick={handleFinish} style={{ textAlign: "center", width: "100%", marginBottom: "12px" }}>{t("Готово", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("wash_check")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "discharge_check" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#8b5cf6" }}>visibility</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Шаг 3: Проверка выделений", L)}</p>
                            <p className="section-sub" style={{ marginTop: "4px" }}>{T("Осмотрите ушную раковину", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("Есть выделения из ушей?", L)}</p>
                            <p className="section-sub" style={{ textAlign: "center", marginTop: "4px" }}>{T("ears_any_fluid", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => setStep("see_doctor")}>{T("💧 Да, есть", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("otipax")}>{T("✅ Нет", L)}</button>
                        </div>
                        <button className="btn-outline" onClick={() => setStep("wash_check")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "otipax" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#22c55e" }}>medication</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Рекомендация", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{T("Лечение", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <p>{T("ears_otipax_full", L)}</p>
                                <p>{T("ears_course", L)}</p>
                                <p>{T("ears_room_temp", L)}</p>
                                <p>{T("ears_lie_down", L)}</p>
                            </div>
                        </div>
                        <div className="info-box info-box-teal">
                            <strong className="teal">{T("Совет:", L)}</strong> {T("ears_if_pain", L)}
                        </div>
                        <button className="btn-primary" onClick={handleFinish} style={{ textAlign: "center", width: "100%", marginBottom: "12px" }}>{t("Готово", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("pain_check")}>{t("🔄 Начать сначала", L)}</button>
                    </>
                )}

                {step === "see_doctor" && (
                    <>
                        <div className="card" style={{ background: "#dc2626", color: "white", border: "none", textAlign: "center", padding: "24px" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", opacity: 0.9 }}>local_hospital</span>
                            <p style={{ fontSize: "22px", fontWeight: 700, marginTop: "8px" }}>{T("Обратитесь к врачу!", L)}</p>
                            <p style={{ fontSize: "14px", opacity: 0.9, marginTop: "8px" }}>{T("ears_discharge_warn", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--accent)" }}>{T("До визита к врачу:", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <p>{T("ears_doc1", L)}</p>
                                <p>{T("ears_doc2", L)}</p>
                                <p>{T("ears_doc3", L)}</p>
                                <p>{T("ears_doc4", L)}</p>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={handleFinish} style={{ textAlign: "center", width: "100%", marginBottom: "12px" }}>{t("Готово", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("pain_check")}>{t("🔄 Начать сначала", L)}</button>
                    </>
                )}
            </div>
        </>
    );
}
