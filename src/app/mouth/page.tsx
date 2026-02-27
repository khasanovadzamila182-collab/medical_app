"use client";
import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { t, Lang } from "@/lib/i18n";

type Step =
    | "throat_check" | "no_issue"
    | "spots_check"
    | "no_spots_age" | "over1_symptoms" | "over1_pain" | "over1_tickle"
    | "under1_symptoms" | "under1_pain" | "under1_tickle"
    | "spots_type" | "see_doctor" | "stomatitis_age"
    | "over2_treatment" | "under2_treatment";

const tx: Record<string, Record<Lang, string>> = {
    "Шаг 1: Первичный осмотр": { ru: "Шаг 1: Первичный осмотр", uz: "1-qadam: Boshlang'ich ko'rik", en: "Step 1: Initial inspection" },
    "Осмотрите горло ребёнка": { ru: "Осмотрите горло ребёнка", uz: "Bolaning tomoq'ini ko'rib chiqing", en: "Examine the child's throat" },
    "Горло красное и болезненное?": { ru: "Горло красное и болезненное?", uz: "Tomoq qizargan va og'riyaptimi?", en: "Is the throat red and painful?" },
    "😣 Да": { ru: "😣 Да", uz: "😣 Ha", en: "😣 Yes" },
    "😊 Нет": { ru: "😊 Нет", uz: "😊 Yo'q", en: "😊 No" },
    "Горло в порядке": { ru: "Горло в порядке", uz: "Tomoq yaxshi", en: "Throat is fine" },
    "mouth_no_issue": { ru: "Ничего с горлом делать не нужно. Продолжайте наблюдение.", uz: "Tomoqqa hech narsa qilish shart emas. Kuzatishni davom ettiring.", en: "No throat treatment needed. Continue monitoring." },
    "Шаг 2: Проверка миндалин": { ru: "Шаг 2: Проверка миндалин", uz: "2-qadam: Murtak bezlarini tekshirish", en: "Step 2: Tonsil check" },
    "mouth_tonsil_sub": { ru: "Осмотрите миндалины с фонариком", uz: "Fonar bilan murtak bezlarini ko'rib chiqing", en: "Examine tonsils with a flashlight" },
    "Есть беловатые пятна в области миндалин?": { ru: "Есть беловатые пятна в области миндалин?", uz: "Murtak bezlari atrofida oqish dog'lar bormi?", en: "Are there whitish spots on the tonsils?" },
    "⚪ Да, есть пятна": { ru: "⚪ Да, есть пятна", uz: "⚪ Ha, dog'lar bor", en: "⚪ Yes, spots present" },
    "✅ Нет пятен": { ru: "✅ Нет пятен", uz: "✅ Dog'lar yo'q", en: "✅ No spots" },
    "Уточнение возраста": { ru: "Уточнение возраста", uz: "Yoshni aniqlash", en: "Age clarification" },
    "Ребёнок старше 1 года?": { ru: "Ребёнок старше 1 года?", uz: "Bola 1 yoshdan kattami?", en: "Is the child over 1 year?" },
    "🧒 Да, старше 1": { ru: "🧒 Да, старше 1", uz: "🧒 Ha, 1 dan katta", en: "🧒 Yes, over 1" },
    "👶 Нет, до 1 года": { ru: "👶 Нет, до 1 года", uz: "👶 Yo'q, 1 yoshgacha", en: "👶 No, under 1" },
    "Какой симптом?": { ru: "Какой симптом?", uz: "Qanday alomat?", en: "What symptom?" },
    "Ребёнок старше 1 года": { ru: "Ребёнок старше 1 года", uz: "Bola 1 yoshdan katta", en: "Child over 1 year" },
    "😖 Боль": { ru: "😖 Боль", uz: "😖 Og'riq", en: "😖 Pain" },
    "🤧 Першение": { ru: "🤧 Першение", uz: "🤧 Xirillik", en: "🤧 Tickle" },
    "Боль в горле (1+ год)": { ru: "Боль в горле (1+ год)", uz: "Tomoq og'rig'i (1+ yosh)", en: "Sore throat (1+ year)" },
    "mouth_pain1": { ru: "🧊 Облегчать боль холодными напитками, льдом и мороженым", uz: "🧊 Og'riqni sovuq ichimliklar, muz va muzqaymoq bilan yengillashtiring", en: "🧊 Relieve pain with cold drinks, ice, and ice cream" },
    "mouth_pain2": { ru: "🧂 Полоскать горло солевыми растворами", uz: "🧂 Tomoqni tuz eritmasi bilan chayqang", en: "🧂 Gargle with saline solutions" },
    "mouth_pain3": { ru: "💨 Использовать спреи и пастилки для горла", uz: "💨 Tomoq uchun sprey va pastilkalar ishlating", en: "💨 Use throat sprays and lozenges" },
    "mouth_pain4": { ru: "💊 Жаропонижающие по возрасту при необходимости", uz: "💊 Kerak bo'lsa yoshga qarab harorat tushiruvchilar", en: "💊 Age-appropriate antipyretics if needed" },
    "Першение (1+ год)": { ru: "Першение (1+ год)", uz: "Xirillik (1+ yosh)", en: "Tickle (1+ year)" },
    "mouth_tickle1": { ru: "☕ Тёплое питьё", uz: "☕ Iliq ichimlik", en: "☕ Warm drinks" },
    "mouth_tickle2": { ru: "🍯 Можно добавить мёд и варенье в чай", uz: "🍯 Choyga asal va murabbo qo'shish mumkin", en: "🍯 Can add honey and jam to tea" },
    "mouth_honey_tip": { ru: "Мёд можно давать детям старше 1 года. Он смягчает горло и обладает антисептическим действием.", uz: "Asal 1 yoshdan katta bolalarga berish mumkin. U tomoqni yumshatadi va antiseptik ta'sir ko'rsatadi.", en: "Honey is safe for children over 1. It soothes the throat and has antiseptic properties." },
    "Ребёнок до 1 года": { ru: "Ребёнок до 1 года", uz: "1 yoshgacha bola", en: "Child under 1" },
    "Боль в горле (до 1 года)": { ru: "Боль в горле (до 1 года)", uz: "Tomoq og'rig'i (1 yoshgacha)", en: "Sore throat (under 1)" },
    "mouth_under1_1": { ru: "💧 Отпаивать водой комнатной температуры", uz: "💧 Xona haroratidagi suv bilan ichiring", en: "💧 Give room temperature water" },
    "mouth_under1_2": { ru: "🚫 НЕ ГРЕТЬ напитки", uz: "🚫 Ichimliklarni ISITMANG", en: "🚫 Do NOT heat drinks" },
    "mouth_under1_3": { ru: "🤱 Частое прикладывание к груди", uz: "🤱 Ko'krakka tez-tez qo'ying", en: "🤱 Frequent breastfeeding" },
    "mouth_under1_warn": { ru: "Детям до 1 года нельзя давать мёд, лёд и холодные напитки. Только вода комнатной температуры и грудное молоко.", uz: "1 yoshgacha bolalarga asal, muz va sovuq ichimliklar berish mumkin emas. Faqat xona haroratidagi suv va ona suti.", en: "Children under 1 should not have honey, ice, or cold drinks. Only room temperature water and breast milk." },
    "Першение (до 1 года)": { ru: "Першение (до 1 года)", uz: "Xirillik (1 yoshgacha)", en: "Tickle (under 1)" },
    "mouth_tickle_cough": { ru: "Вызывающее единичный кашель", uz: "Yakka yo'talni keltirib chiqaruvchi", en: "Causing occasional cough" },
    "mouth_tickle_u1_1": { ru: "☕ Отпаивать тёплым питьём", uz: "☕ Iliq ichimlik bilan ichiring", en: "☕ Give warm drinks" },
    "Определение типа налёта": { ru: "Определение типа налёта", uz: "Qatlam turini aniqlash", en: "Identifying plaque type" },
    "mouth_spots_sub": { ru: "Внимательно осмотрите характер пятен", uz: "Dog'lar xarakterini diqqat bilan ko'rib chiqing", en: "Carefully examine the character of spots" },
    "Налёт в виде стоматита?": { ru: "Налёт в виде стоматита?", uz: "Stomatit ko'rinishidagi qatlammi?", en: "Stomatitis-type plaque?" },
    "mouth_stomatitis_sub": { ru: "Белые точки/язвочки на слизистой, похожие на молочницу", uz: "Shilliq qavat ustida oq nuqtalar/yaralar, molochnitsaga o'xshash", en: "White spots/sores on mucosa, thrush-like" },
    "✅ Да, стоматит": { ru: "✅ Да, стоматит", uz: "✅ Ha, stomatit", en: "✅ Yes, stomatitis" },
    "❌ Нет (серый налёт)": { ru: "❌ Нет (серый налёт)", uz: "❌ Yo'q (kulrang qatlam)", en: "❌ No (gray plaque)" },
    "Срочно к врачу!": { ru: "Срочно к врачу!", uz: "Tezda shifokorga!", en: "See a doctor urgently!" },
    "mouth_gray_warn": { ru: "Серый налёт на миндалинах и языке требует осмотра для исключения бактериального процесса", uz: "Murtak bezlari va tildagi kulrang qatlam bakterial jarayonni istisno qilish uchun ko'rikni talab qiladi", en: "Gray plaque on tonsils and tongue requires examination to rule out bacterial infection" },
    "До визита к врачу:": { ru: "До визита к врачу:", uz: "Shifokorga borishdan oldin:", en: "Before seeing the doctor:" },
    "mouth_doc1": { ru: "💧 Обильное питьё", uz: "💧 Ko'p suyuqlik", en: "💧 Plenty of fluids" },
    "mouth_doc2": { ru: "💊 Жаропонижающие при необходимости", uz: "💊 Kerak bo'lsa harorat tushiruvchilar", en: "💊 Antipyretics if needed" },
    "mouth_doc3": { ru: "🚫 Не пытайтесь удалять налёт самостоятельно", uz: "🚫 Qatlamni o'zingiz olib tashlamang", en: "🚫 Don't try to remove plaque yourself" },
    "Возраст ребёнка": { ru: "Возраст ребёнка", uz: "Bola yoshi", en: "Child's age" },
    "mouth_stom_age_sub": { ru: "Для выбора схемы лечения стоматита", uz: "Stomatit davolash rejasini tanlash uchun", en: "To choose stomatitis treatment plan" },
    "Ребёнок старше 2 лет?": { ru: "Ребёнок старше 2 лет?", uz: "Bola 2 yoshdan kattami?", en: "Is the child over 2?" },
    "🧒 Да, старше 2": { ru: "🧒 Да, старше 2", uz: "🧒 Ha, 2 dan katta", en: "🧒 Yes, over 2" },
    "👶 Нет, до 2 лет": { ru: "👶 Нет, до 2 лет", uz: "👶 Yo'q, 2 yoshgacha", en: "👶 No, under 2" },
    "Лечение стоматита (2+ лет)": { ru: "Лечение стоматита (2+ лет)", uz: "Stomatit davolash (2+ yosh)", en: "Stomatitis treatment (2+ years)" },
    "Схема лечения": { ru: "Схема лечения", uz: "Davolash rejasi", en: "Treatment plan" },
    "1️⃣ Полоскание": { ru: "1️⃣ Полоскание", uz: "1️⃣ Chayqash", en: "1️⃣ Gargling" },
    "mouth_gargle": { ru: "Полоскать горло солевым раствором из морской пищевой соли", uz: "Tomoqni dengiz oziq-ovqat tuzining tuz eritmasi bilan chayqang", en: "Gargle with sea salt solution" },
    "2️⃣ Хлоргексидин": { ru: "2️⃣ Хлоргексидин", uz: "2️⃣ Xlorheksidin", en: "2️⃣ Chlorhexidine" },
    "mouth_chlorhex": { ru: "Обработка раствором Хлоргексидина", uz: "Xlorheksidin eritmasi bilan ishlov berish", en: "Treatment with Chlorhexidine solution" },
    "mouth_freq": { ru: "📋 2–3 раза в день, 3–5 дней", uz: "📋 Kuniga 2–3 marta, 3–5 kun", en: "📋 2–3 times daily, 3–5 days" },
    "3️⃣ Кандид": { ru: "3️⃣ Кандид", uz: "3️⃣ Kandid", en: "3️⃣ Candid" },
    "mouth_candid": { ru: "Обработка раствором Кандид", uz: "Kandid eritmasi bilan ishlov berish", en: "Treatment with Candid solution" },
    "mouth_candid_how": { ru: "Намотать ватку на палец, смочить в растворе (3–6 капель) и полностью протереть стенки горла, нёбо, щёки и язык", uz: "Barmog'ingizga paxta o'rang, eritmaga boting (3–6 tomchi) va tomoq devorlari, tanglay, yonoqlar va tilni to'liq arting", en: "Wrap cotton on finger, soak in solution (3–6 drops) and wipe throat walls, palate, cheeks, and tongue thoroughly" },
    "Лечение стоматита (до 2 лет)": { ru: "Лечение стоматита (до 2 лет)", uz: "Stomatit davolash (2 yoshgacha)", en: "Stomatitis treatment (under 2)" },
    "1️⃣ Хлоргексидин": { ru: "1️⃣ Хлоргексидин", uz: "1️⃣ Xlorheksidin", en: "1️⃣ Chlorhexidine" },
    "mouth_chlorhex_throat": { ru: "Обработка горла раствором Хлоргексидина", uz: "Tomoqni Xlorheksidin eritmasi bilan ishlov berish", en: "Treat throat with Chlorhexidine solution" },
    "2️⃣ Кандид": { ru: "2️⃣ Кандид", uz: "2️⃣ Kandid", en: "2️⃣ Candid" },
    "mouth_candid_throat": { ru: "Обработка горла раствором Кандид", uz: "Tomoqni Kandid eritmasi bilan ishlov berish", en: "Treat throat with Candid solution" },
    "mouth_under2_warn": { ru: "Дети до 2 лет не могут полоскать горло — используйте только обработку ватным тампоном.", uz: "2 yoshgacha bolalar tomoqni chayqa olmaydi — faqat paxta tampon bilan ishlov bering.", en: "Children under 2 can't gargle — use cotton swab treatment only." },
};
const T = (key: string, L: Lang) => tx[key]?.[L] || t(key, L);

export default function MouthPage() {
    const { logEvent, langPref } = useApp();
    const L = langPref;
    const router = useRouter();
    const [step, setStep] = useState<Step>("throat_check");

    const stepNum: Record<Step, number> = {
        throat_check: 1, no_issue: 1,
        spots_check: 2,
        no_spots_age: 3, over1_symptoms: 3, over1_pain: 3, over1_tickle: 3,
        under1_symptoms: 3, under1_pain: 3, under1_tickle: 3,
        spots_type: 3, see_doctor: 3, stomatitis_age: 3,
        over2_treatment: 3, under2_treatment: 3,
    };
    const totalSteps = 3;
    const cur = stepNum[step];
    const progressPct = Math.round((cur / totalSteps) * 100);

    const handleStartEvent = (nextStep: Step) => {
        logEvent("Рот / Горло", "start", nextStep);
        setStep(nextStep);
    };

    const handleFinish = () => {
        logEvent("Рот / Горло", "end");
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
                    <h1>{t("Боль в горле", L)}</h1><span />
                </div>
            </div>

            <div className="page-body">
                {step === "throat_check" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#ec4899" }}>ecg_heart</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Шаг 1: Первичный осмотр", L)}</p>
                            <p className="section-sub" style={{ marginTop: "4px" }}>{T("Осмотрите горло ребёнка", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("Горло красное и болезненное?", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => handleStartEvent("spots_check")}>{T("😣 Да", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => handleStartEvent("no_issue")}>{T("😊 Нет", L)}</button>
                        </div>
                    </>
                )}

                {step === "no_issue" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#22c55e" }}>check_circle</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Горло в порядке", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{T("mouth_no_issue", L)}</p>
                        </div>
                        <button className="btn-primary" onClick={handleFinish} style={{ textAlign: "center", width: "100%", marginBottom: "12px" }}>{t("Готово", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("throat_check")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "spots_check" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#8b5cf6" }}>visibility</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Шаг 2: Проверка миндалин", L)}</p>
                            <p className="section-sub" style={{ marginTop: "4px" }}>{T("mouth_tonsil_sub", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("Есть беловатые пятна в области миндалин?", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => setStep("spots_type")}>{T("⚪ Да, есть пятна", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("no_spots_age")}>{T("✅ Нет пятен", L)}</button>
                        </div>
                        <button className="btn-outline" onClick={() => setStep("throat_check")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "no_spots_age" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>child_care</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Уточнение возраста", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("Ребёнок старше 1 года?", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("over1_symptoms")}>{T("🧒 Да, старше 1", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "#8b5cf6" }} onClick={() => setStep("under1_symptoms")}>{T("👶 Нет, до 1 года", L)}</button>
                        </div>
                        <button className="btn-outline" onClick={() => setStep("spots_check")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "over1_symptoms" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--accent)" }}>sentiment_dissatisfied</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Какой симптом?", L)}</p>
                            <p className="section-sub">{T("Ребёнок старше 1 года", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => setStep("over1_pain")}>{T("😖 Боль", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("over1_tickle")}>{T("🤧 Першение", L)}</button>
                        </div>
                        <button className="btn-outline" onClick={() => setStep("no_spots_age")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "over1_pain" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--accent)" }}>medication</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Боль в горле (1+ год)", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{t("Рекомендации", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <p>{T("mouth_pain1", L)}</p>
                                <p>{T("mouth_pain2", L)}</p>
                                <p>{T("mouth_pain3", L)}</p>
                                <p>{T("mouth_pain4", L)}</p>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={handleFinish} style={{ textAlign: "center", width: "100%", marginBottom: "12px" }}>{t("Готово", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("over1_symptoms")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "over1_tickle" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>local_cafe</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Першение (1+ год)", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{t("Рекомендации", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <p>{T("mouth_tickle1", L)}</p>
                                <p>{T("mouth_tickle2", L)}</p>
                            </div>
                        </div>
                        <div className="info-box info-box-teal">
                            <strong className="teal">{T("Совет:", L)}</strong> {T("mouth_honey_tip", L)}
                        </div>
                        <button className="btn-primary" onClick={handleFinish} style={{ textAlign: "center", width: "100%", marginBottom: "12px" }}>{t("Готово", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("over1_symptoms")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "under1_symptoms" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#8b5cf6" }}>sentiment_dissatisfied</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Какой симптом?", L)}</p>
                            <p className="section-sub">{T("Ребёнок до 1 года", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => setStep("under1_pain")}>{T("😖 Боль", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("under1_tickle")}>{T("🤧 Першение", L)}</button>
                        </div>
                        <button className="btn-outline" onClick={() => setStep("no_spots_age")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "under1_pain" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--accent)" }}>medication</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Боль в горле (до 1 года)", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{t("Рекомендации", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <p>{T("mouth_under1_1", L)}</p>
                                <p>{T("mouth_under1_2", L)}</p>
                                <p>{T("mouth_under1_3", L)}</p>
                            </div>
                        </div>
                        <div className="info-box info-box-orange">
                            <strong className="orange">{t("Важно:", L)}</strong> {T("mouth_under1_warn", L)}
                        </div>
                        <button className="btn-primary" onClick={handleFinish} style={{ textAlign: "center", width: "100%", marginBottom: "12px" }}>{t("Готово", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("under1_symptoms")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "under1_tickle" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>local_cafe</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Першение (до 1 года)", L)}</p>
                            <p className="section-sub">{T("mouth_tickle_cough", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{t("Рекомендации", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <p>{T("mouth_tickle_u1_1", L)}</p>
                                <p>{T("mouth_under1_3", L)}</p>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={handleFinish} style={{ textAlign: "center", width: "100%", marginBottom: "12px" }}>{t("Готово", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("under1_symptoms")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "spots_type" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#ef4444" }}>search</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Определение типа налёта", L)}</p>
                            <p className="section-sub" style={{ marginTop: "4px" }}>{T("mouth_spots_sub", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("Налёт в виде стоматита?", L)}</p>
                            <p className="section-sub" style={{ textAlign: "center", marginTop: "4px" }}>{T("mouth_stomatitis_sub", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => setStep("stomatitis_age")}>{T("✅ Да, стоматит", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={() => setStep("see_doctor")}>{T("❌ Нет (серый налёт)", L)}</button>
                        </div>
                        <button className="btn-outline" onClick={() => setStep("spots_check")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "see_doctor" && (
                    <>
                        <div className="card" style={{ background: "#dc2626", color: "white", border: "none", textAlign: "center", padding: "24px" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", opacity: 0.9 }}>local_hospital</span>
                            <p style={{ fontSize: "22px", fontWeight: 700, marginTop: "8px" }}>{T("Срочно к врачу!", L)}</p>
                            <p style={{ fontSize: "14px", opacity: 0.9, marginTop: "8px" }}>{T("mouth_gray_warn", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--accent)" }}>{T("До визита к врачу:", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <p>{T("mouth_doc1", L)}</p>
                                <p>{T("mouth_doc2", L)}</p>
                                <p>{T("mouth_doc3", L)}</p>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={handleFinish} style={{ textAlign: "center", width: "100%", marginBottom: "12px" }}>{t("Готово", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("throat_check")}>{t("🔄 Начать сначала", L)}</button>
                    </>
                )}

                {step === "stomatitis_age" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>child_care</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Возраст ребёнка", L)}</p>
                            <p className="section-sub">{T("mouth_stom_age_sub", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "15px", textAlign: "center" }}>{T("Ребёнок старше 2 лет?", L)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-primary" style={{ flex: 1, background: "var(--primary)" }} onClick={() => setStep("over2_treatment")}>{T("🧒 Да, старше 2", L)}</button>
                            <button className="btn-primary" style={{ flex: 1, background: "#8b5cf6" }} onClick={() => setStep("under2_treatment")}>{T("👶 Нет, до 2 лет", L)}</button>
                        </div>
                        <button className="btn-outline" onClick={() => setStep("spots_type")}>{t("Назад", L)}</button>
                    </>
                )}

                {step === "over2_treatment" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#22c55e" }}>medication</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Лечение стоматита (2+ лет)", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{T("Схема лечения", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <div style={{ padding: "10px", background: "var(--primary-light)", borderRadius: "10px" }}>
                                    <p><strong>{T("1️⃣ Полоскание", L)}</strong></p>
                                    <p>{T("mouth_gargle", L)}</p>
                                </div>
                                <div style={{ padding: "10px", background: "#dcfce7", borderRadius: "10px" }}>
                                    <p><strong>{T("2️⃣ Хлоргексидин", L)}</strong></p>
                                    <p>{T("mouth_chlorhex", L)}</p>
                                    <p>{T("mouth_freq", L)}</p>
                                </div>
                                <div style={{ padding: "10px", background: "#fff7ed", borderRadius: "10px" }}>
                                    <p><strong>{T("3️⃣ Кандид", L)}</strong></p>
                                    <p>{T("mouth_candid", L)}</p>
                                    <p>{T("mouth_freq", L)}</p>
                                    <p style={{ marginTop: "6px", fontSize: "12px" }}>{T("mouth_candid_how", L)}</p>
                                </div>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={handleFinish} style={{ textAlign: "center", width: "100%", marginBottom: "12px" }}>{t("Готово", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("throat_check")}>{t("🔄 Начать сначала", L)}</button>
                    </>
                )}

                {step === "under2_treatment" && (
                    <>
                        <div className="card" style={{ textAlign: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#8b5cf6" }}>medication</span>
                            <p className="section-heading" style={{ marginTop: "8px" }}>{T("Лечение стоматита (до 2 лет)", L)}</p>
                        </div>
                        <div className="card">
                            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{T("Схема лечения", L)}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <div style={{ padding: "10px", background: "#dcfce7", borderRadius: "10px" }}>
                                    <p><strong>{T("1️⃣ Хлоргексидин", L)}</strong></p>
                                    <p>{T("mouth_chlorhex_throat", L)}</p>
                                    <p>{T("mouth_freq", L)}</p>
                                </div>
                                <div style={{ padding: "10px", background: "#fff7ed", borderRadius: "10px" }}>
                                    <p><strong>{T("2️⃣ Кандид", L)}</strong></p>
                                    <p>{T("mouth_candid_throat", L)}</p>
                                    <p>{T("mouth_freq", L)}</p>
                                    <p style={{ marginTop: "6px", fontSize: "12px" }}>{T("mouth_candid_how", L)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="info-box info-box-orange">
                            <strong className="orange">{t("Важно:", L)}</strong> {T("mouth_under2_warn", L)}
                        </div>
                        <button className="btn-primary" onClick={handleFinish} style={{ textAlign: "center", width: "100%", marginBottom: "12px" }}>{t("Готово", L)}</button>
                        <button className="btn-outline" onClick={() => setStep("throat_check")}>{t("🔄 Начать сначала", L)}</button>
                    </>
                )}
            </div>
        </>
    );
}
