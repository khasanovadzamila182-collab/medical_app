"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { t, Lang } from "@/lib/i18n";

type Step = "congestion_check" | "wash_direct" | "age_check" | "under2_drops" | "over2_spray" | "waiting" | "wash_after";

const tx: Record<string, Record<Lang, string>> = {
    "Шаг 1: Проверка заложенности": { ru: "Шаг 1: Проверка заложенности", uz: "1-qadam: Burun bitishini tekshirish", en: "Step 1: Check congestion" },
    "Определите состояние носа ребёнка": { ru: "Определите состояние носа ребёнка", uz: "Bolaning burun holatini aniqlang", en: "Determine the child's nasal condition" },
    "Есть ли заложенность носа?": { ru: "Есть ли заложенность носа?", uz: "Burun bitganmi?", en: "Is the nose congested?" },
    "😤 Да, заложен": { ru: "😤 Да, заложен", uz: "😤 Ha, bitgan", en: "😤 Yes, congested" },
    "👃 Нет, дышит": { ru: "👃 Нет, дышит", uz: "👃 Yo'q, nafas oladi", en: "👃 No, breathing" },
    "Заложенности нет": { ru: "Заложенности нет", uz: "Burun bitishi yo'q", en: "No congestion" },
    "nose_wash_sub": { ru: "Промывайте нос при выделении слизи", uz: "Shilimshiq chiqqanda burunni yuving", en: "Wash nose when mucus appears" },
    "Промывание носа по возрасту": { ru: "Промывание носа по возрасту", uz: "Yoshga qarab burun yuvish", en: "Nasal wash by age" },
    "nose_wash_every": { ru: "💧 Промывайте нос каждый раз при выделении слизи", uz: "💧 Shilimshiq chiqqan har safar burunni yuving", en: "💧 Wash nose every time mucus appears" },
    "nose_under1": { ru: "👶 До 1 года: капли солевого раствора (Аквамарис Бэби, Салин)", uz: "👶 1 yoshgacha: tuz eritmasi tomchilari (Akvamaris Bebi, Salin)", en: "👶 Under 1: saline drops (Aquamaris Baby, Salin)" },
    "nose_1_2": { ru: "🧒 1–2 года: капли или мягкий спрей", uz: "🧒 1–2 yosh: tomchilar yoki yumshoq sprey", en: "🧒 1–2 years: drops or gentle spray" },
    "nose_over2": { ru: "👦 Старше 2 лет: спрей или промывание (Аквалор, Долфин детский)", uz: "👦 2 yoshdan katta: sprey yoki yuvish (Akvalor, Dolfin bolalar)", en: "👦 Over 2: spray or wash (Aqualor, Dolphin kids)" },
    "nose_aspirator": { ru: "После промывания можно использовать аспиратор для удаления слизи у малышей, которые ещё не умеют сморкаться.", uz: "Yuvishdan keyin hali qoqa olmaydigan bolalar uchun shilimshiqni aspirator bilan olish mumkin.", en: "After washing, you can use an aspirator for babies who can't blow their nose yet." },
    "Совет:": { ru: "Совет:", uz: "Maslahat:", en: "Tip:" },
    "Шаг 2: Возраст ребёнка": { ru: "Шаг 2: Возраст ребёнка", uz: "2-qadam: Bola yoshi", en: "Step 2: Child's age" },
    "nose_age_sub": { ru: "От возраста зависит форма препарата", uz: "Preparat shakli yoshga bog'liq", en: "Drug form depends on age" },
    "Ребёнок младше 2 лет?": { ru: "Ребёнок младше 2 лет?", uz: "Bola 2 yoshdan kichikmi?", en: "Is the child under 2?" },
    "👶 Да, младше 2": { ru: "👶 Да, младше 2", uz: "👶 Ha, 2 dan kichik", en: "👶 Yes, under 2" },
    "🧒 Нет, 2+ лет": { ru: "🧒 Нет, 2+ лет", uz: "🧒 Yo'q, 2+ yosh", en: "🧒 No, 2+ years" },
    "Шаг 3: Сосудосуживающие капли": { ru: "Шаг 3: Сосудосуживающие капли", uz: "3-qadam: Tomir toraytiruvchi tomchilar", en: "Step 3: Decongestant drops" },
    "Для детей младше 2 лет": { ru: "Для детей младше 2 лет", uz: "2 yoshdan kichik bolalar uchun", en: "For children under 2" },
    "Инструкция": { ru: "Инструкция", uz: "Ko'rsatma", en: "Instructions" },
    "nose_drop_instill": { ru: "💧 ЗАКАПАТЬ сосудосуживающие капли", uz: "💧 Tomir toraytiruvchi tomchilarni TOMIZING", en: "💧 INSTILL decongestant drops" },
    "nose_otrivin": { ru: "💊 Препарат: Отривин Бэби (или аналог для детей до 2 лет)", uz: "💊 Preparat: Otrivin Bebi (yoki 2 yoshgacha bolalar uchun analog)", en: "💊 Drug: Otrivin Baby (or equivalent for under 2)" },
    "nose_wait5": { ru: "⏱️ Подождать 5 минут до промывания", uz: "⏱️ Yuvishdan oldin 5 daqiqa kuting", en: "⏱️ Wait 5 minutes before washing" },
    "nose_max3days": { ru: "Использовать сосудосуживающие капли можно не более 3-х дней! Более длительное использование может вызвать привыкание и ухудшение состояния.", uz: "Tomir toraytiruvchi tomchilarni 3 kundan ko'p ishlatish mumkin emas! Uzoq ishlatish ko'nikishga va holatning yomonlashishiga olib kelishi mumkin.", en: "Use decongestant drops for no more than 3 days! Longer use may cause dependence and worsening." },
    "⏱️ Запустить таймер (5 мин)": { ru: "⏱️ Запустить таймер (5 мин)", uz: "⏱️ Taymerni ishga tushiring (5 daq)", en: "⏱️ Start timer (5 min)" },
    "Шаг 3: Сосудосуживающий спрей": { ru: "Шаг 3: Сосудосуживающий спрей", uz: "3-qadam: Tomir toraytiruvchi sprey", en: "Step 3: Decongestant spray" },
    "Для детей от 2 лет": { ru: "Для детей от 2 лет", uz: "2 yoshdan katta bolalar uchun", en: "For children 2+" },
    "nose_spray_instill": { ru: "💨 ВСПРЫСНУТЬ сосудосуживающий спрей", uz: "💨 Tomir toraytiruvchi spreyni PURKANG", en: "💨 SPRAY decongestant spray" },
    "nose_snup": { ru: "💊 Препарат: Снуп детский (или аналог для детей 2+)", uz: "💊 Preparat: Snup bolalar (yoki 2+ yosh bolalar uchun analog)", en: "💊 Drug: Snup Kids (or equivalent for 2+)" },
    "nose_timer_label_drops": { ru: "Ждём действия капель", uz: "Tomchilar ta'sirini kutamiz", en: "Waiting for drops to take effect" },
    "nose_timer_label_spray": { ru: "Ждём действия спрея", uz: "Sprey ta'sirini kutamiz", en: "Waiting for spray to take effect" },
    "Пока ждём:": { ru: "Пока ждём:", uz: "Kutayotganda:", en: "While waiting:" },
    "nose_wait1": { ru: "🤱 Держите ребёнка вертикально или полулёжа", uz: "🤱 Bolani tik yoki yarim yotgan holatda ushlang", en: "🤱 Keep child upright or semi-reclined" },
    "nose_wait2": { ru: "🧸 Отвлеките ребёнка игрушкой или мультфильмом", uz: "🧸 Bolani o'yinchoq yoki multfilm bilan chalg'iting", en: "🧸 Distract child with a toy or cartoon" },
    "nose_wait3": { ru: "👀 Наблюдайте за дыханием", uz: "👀 Nafas olishni kuzating", en: "👀 Monitor breathing" },
    "nose_skip_timer": { ru: "Перейти к промыванию (не ждать)", uz: "Yuvishga o'tish (kutmasdan)", en: "Proceed to washing (don't wait)" },
    "Шаг 4: Промывание носа": { ru: "Шаг 4: Промывание носа", uz: "4-qadam: Burunni yuvish", en: "Step 4: Nasal wash" },
    "nose_5min_done": { ru: "5 минут прошло — можно промывать", uz: "5 daqiqa o'tdi — yuvish mumkin", en: "5 minutes passed — ready to wash" },
    "nose_under2_1": { ru: "💧 Капли солевого раствора (Аквамарис Бэби, Салин)", uz: "💧 Tuz eritmasi tomchilari (Akvamaris Bebi, Salin)", en: "💧 Saline drops (Aquamaris Baby, Salin)" },
    "nose_under2_2": { ru: "🫧 Отсосать слизь аспиратором после закапывания", uz: "🫧 Tomizgandan keyin aspirator bilan shilimshiqni so'ring", en: "🫧 Suction mucus with aspirator after instillation" },
    "nose_under2_3": { ru: "👶 Положите ребёнка на бок, закапайте 2–3 капли в каждую ноздрю", uz: "👶 Bolani yonboshiga yotqizing, har bir burun teshigiga 2–3 tomchi tomizing", en: "👶 Lay child on side, instill 2–3 drops per nostril" },
    "nose_over2_1": { ru: "💨 Спрей солевого раствора (Аквалор, Долфин детский)", uz: "💨 Tuz eritmasi spreyi (Akvalor, Dolfin bolalar)", en: "💨 Saline spray (Aqualor, Dolphin kids)" },
    "nose_over2_2": { ru: "🧒 Попросите ребёнка наклонить голову над раковиной", uz: "🧒 Boladan boshini lavabo ustiga egishni so'rang", en: "🧒 Ask child to tilt head over sink" },
    "nose_over2_3": { ru: "👃 После промывания — аккуратно высморкаться", uz: "👃 Yuvishdan keyin — ehtiyotlik bilan qoqing", en: "👃 After washing — gently blow nose" },
    "nose_final_tip": { ru: "Повторяйте промывание каждый раз при появлении слизи. Сосудосуживающие — не более 3-х дней, промывание — без ограничений.", uz: "Shilimshiq chiqqan har safar yuvishni takrorlang. Tomir toraytiruvchilar — 3 kundan ko'p emas, yuvish — cheklovsiz.", en: "Repeat washing every time mucus appears. Decongestants — max 3 days, washing — no limit." },
};
const T = (key: string, L: Lang) => tx[key]?.[L] || t(key, L);

export default function NosePage() {
    const { logEvent, langPref } = useApp();
    const L = langPref;
    const router = useRouter();
    const [step, setStep] = useState<Step>("congestion_check");
    const [isUnder2, setIsUnder2] = useState(false);

    const TIMER_TOTAL = 300;
    const [remaining, setRemaining] = useState(TIMER_TOTAL);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearTimer = useCallback(() => {
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    }, []);

    useEffect(() => {
        if (step === "waiting") {
            setRemaining(TIMER_TOTAL);
            timerRef.current = setInterval(() => {
                setRemaining(r => {
                    if (r <= 1) { clearTimer(); setStep("wash_after"); return 0; }
                    return r - 1;
                });
            }, 1000);
        } else {
            clearTimer();
        }
        return clearTimer;
    }, [step, clearTimer]);

    const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
    const ss = String(remaining % 60).padStart(2, "0");
    const pct = ((TIMER_TOTAL - remaining) / TIMER_TOTAL) * 100;

    const stepNum: Record<Step, number> = {
        congestion_check: 1, wash_direct: 2, age_check: 2,
        under2_drops: 3, over2_spray: 3, waiting: 4, wash_after: 4,
    };
    const totalSteps = 4;
    const cur = stepNum[step];
    const progressPct = Math.round((cur / totalSteps) * 100);

    const handleStartEvent = (nextStep: Step) => {
        logEvent("Насморк", "start", nextStep);
        setStep(nextStep);
    };

    const handleFinish = () => {
        logEvent("Насморк", "end");
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
                    <h1>{t("Нос", L)}</h1><span />
                </div>
            </div>

            <div className="page-body">
                {step === "congestion_check" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>air</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Шаг 1: Проверка заложенности", L)}</p>
                            <p className="section-sub" style={{ marginTop: "4px" }}>{T("Определите состояние носа ребёнка", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("Есть ли заложенность носа?", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => handleStartEvent("age_check")}>{T("😤 Да, заложен", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => handleStartEvent("wash_direct")}>{T("👃 Нет, дышит", L)}</button>
                        </div>
                    </>
                )}

                {step === "wash_direct" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#22c55e" }}>check_circle</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Заложенности нет", L)}</p>
                            <p className="section-sub">{T("nose_wash_sub", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{T("Промывание носа по возрасту", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <p>{T("nose_wash_every", L)}</p>
                                <p>{T("nose_under1", L)}</p>
                                <p>{T("nose_1_2", L)}</p>
                                <p>{T("nose_over2", L)}</p>
                            </div>
                        </div>
                        <div className="info-box info-box-teal">
                            <strong className="teal">{T("Совет:", L)}</strong> {T("nose_aspirator", L)}
                        </div>
                        <button className="btn-primary" onClick={handleFinish} style={{ textAlign: "center", width: "100%", marginBottom: "12px" }}>{t("Готово", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("congestion_check")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "age_check" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#8b5cf6" }}>child_care</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Шаг 2: Возраст ребёнка", L)}</p>
                            <p className="section-sub" style={{ marginTop: "4px" }}>{T("nose_age_sub", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("Ребёнок младше 2 лет?", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "#8b5cf6" }} onClick={() => { setIsUnder2(true); setStep("under2_drops"); }}>{T("👶 Да, младше 2", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => { setIsUnder2(false); setStep("over2_spray"); }}>{T("🧒 Нет, 2+ лет", L)}</button>
                        </div>
                        <button className="btn-outline" onClick={() => setStep("congestion_check")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "under2_drops" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--accent)" }}>vaccines</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Шаг 3: Сосудосуживающие капли", L)}</p>
                            <p className="section-sub">{T("Для детей младше 2 лет", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{T("Инструкция", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <p>{T("nose_drop_instill", L)}</p>
                                <p>{T("nose_otrivin", L)}</p>
                                <p>{T("nose_wait5", L)}</p>
                            </div>
                        </div>
                        <div className="info-box info-box-orange">
                            <strong className="orange">{t("Важно:", L)}</strong> {T("nose_max3days", L)}
                        </div>
                        <button className="btn-primary" onClick={() => setStep("waiting")}>{T("⏱️ Запустить таймер (5 мин)", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("age_check")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "over2_spray" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--accent)" }}>vaccines</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Шаг 3: Сосудосуживающий спрей", L)}</p>
                            <p className="section-sub">{T("Для детей от 2 лет", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{T("Инструкция", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <p>{T("nose_spray_instill", L)}</p>
                                <p>{T("nose_snup", L)}</p>
                                <p>{T("nose_wait5", L)}</p>
                            </div>
                        </div>
                        <div className="info-box info-box-orange">
                            <strong className="orange">{t("Важно:", L)}</strong> {T("nose_max3days", L)}
                        </div>
                        <button className="btn-primary" onClick={() => setStep("waiting")}>{T("⏱️ Запустить таймер (5 мин)", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("age_check")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "waiting" && (
                    <>
                        <div className="card" style={{ textAlign: "center", padding: "24px" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>timer</span>
                            <p className="timer-display" style={{ marginTop: "8px" }}>{mm}:{ss}</p>
                            <p className="timer-label">{isUnder2 ? T("nose_timer_label_drops", L) : T("nose_timer_label_spray", L)}</p>
                            <div className="progress-bar" style={{ marginTop: "16px" }}>
                                <div className="fill" style={{ width: `${pct}%` }} />
                            </div>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px" }}>{T("Пока ждём:", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <p>{T("nose_wait1", L)}</p>
                                <p>{T("nose_wait2", L)}</p>
                                <p>{T("nose_wait3", L)}</p>
                            </div>
                        </div>
                        <button className="btn-outline" onClick={() => setStep("wash_after")}>{T("nose_skip_timer", L)}</button>
                    </>
                )}

                {step === "wash_after" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#22c55e" }}>check_circle</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Шаг 4: Промывание носа", L)}</p>
                            <p className="section-sub">{T("nose_5min_done", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{T("Промывание носа по возрасту", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                {isUnder2 ? (
                                    <>
                                        <p>{T("nose_under2_1", L)}</p>
                                        <p>{T("nose_under2_2", L)}</p>
                                        <p>{T("nose_under2_3", L)}</p>
                                    </>
                                ) : (
                                    <>
                                        <p>{T("nose_over2_1", L)}</p>
                                        <p>{T("nose_over2_2", L)}</p>
                                        <p>{T("nose_over2_3", L)}</p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="info-box info-box-teal">
                            <strong className="teal">{T("Совет:", L)}</strong> {T("nose_final_tip", L)}
                        </div>
                        <button className="btn-primary" onClick={handleFinish} style={{ textAlign: "center", width: "100%", marginBottom: "12px" }}>{t("Готово", L)}</button>
                        <button className="btn-outline" onClick={() => { setStep("congestion_check"); }}>{t("🔄 Начать сначала", L)}</button>
                    </>
                )}
            </div>
        </>
    );
}
