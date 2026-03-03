"use client";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { t } from "@/lib/i18n";

const terms = [
    { term: "Субфебрильная температура", definition: "Температура тела от 37.1 до 38.0 °C. Обычно не требует снижения жаропонижающими препаратами, если ребенок чувствует себя нормально." },
    { term: "Фебрильная температура", definition: "Температура тела выше 38.0 °C. При достижении 38.5 °C (или ниже, если ребенок плохо переносит) рекомендуется дать жаропонижающее." },
    { term: "Ибупрофен", definition: "Нестероидный противовоспалительный препарат, применяемый как жаропонижающее и обезболивающее. Дозировка: 10 мг на 1 кг веса ребёнка (не более 3-4 раз в сутки)." },
    { term: "Парацетамол", definition: "Анальгетик и антипиретик. Безопасен для снижения температуры. Дозировка: 15 мг на 1 кг веса ребёнка (не более 4 раз в сутки)." },
    { term: "Красные флаги (Red Flags)", definition: "Тревожные симптомы, требующие немедленного обращения за медицинской помощью (например, судороги, затруднённое дыхание, сыпь, не исчезающая при нажатии)." },
    { term: "Ринит", definition: "Воспаление слизистой оболочки носа, проявляющееся насморком и заложенностью." },
    { term: "Отит", definition: "Воспалительный процесс в ухе, часто развивающийся как осложнение после ОРВИ." },
    { term: "Круп (ларинготрахеит)", definition: "Воспаление гортани и трахеи, сопровождающееся лающим кашлем, осиплостью голоса и затрудненным дыханием." },
    { term: "Оральная регидратация", definition: "Восполнение потерь жидкости в организме путем питья специальных солевых растворов (например, Регидрон) небольшими порциями." },
];

export default function GlossaryPage() {
    const { langPref } = useApp() as any;
    const L = langPref;
    const [search, setSearch] = useState("");

    const filteredTerms = terms.filter(t => t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase()));

    return (
        <>
            <div className="sticky-header">
                <div className="header-row">
                    <Link href="/" className="back-btn"><span className="material-symbols-outlined">arrow_back</span></Link>
                    <h1>{t("Глоссарий", L)}</h1>
                    <span />
                </div>
                <div style={{ padding: "8px 16px 16px" }}>
                    <div className="input-with-icon">
                        <span className="material-symbols-outlined icon">search</span>
                        <input
                            type="text"
                            placeholder={t("Поиск терминов...", L)}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="page-body">
                {filteredTerms.length === 0 ? (
                    <div style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "40px" }}>
                        <p>{t("Ничего не найдено", L)}</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {filteredTerms.map((item, idx) => (
                            <div key={idx} className="card">
                                <p style={{ fontWeight: 700, fontSize: "16px", color: "var(--primary)", marginBottom: "8px" }}>{item.term}</p>
                                <p style={{ fontSize: "14px", lineHeight: "1.5", color: "var(--text-primary)" }}>{item.definition}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
