"use client";
import { useState } from "react";
import Link from "next/link";

export default function DosagePage() {
    const [weight, setWeight] = useState("");
    const [dose, setDose] = useState("");
    const [conc, setConc] = useState("");
    const [freq, setFreq] = useState(3);

    const w = parseFloat(weight);
    const d = parseFloat(dose);
    const c = parseFloat(conc);
    const singleMg = w && d ? Math.round(w * d * 10) / 10 : 0;
    const singleMl = singleMg && c ? Math.round((singleMg / c) * 10) / 10 : 0;
    const dailyMg = singleMg * freq;

    const selectDrug = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const opt = e.target.selectedOptions[0];
        setDose(opt.dataset.dose || "");
        setConc(opt.dataset.conc || "");
    };

    return (
        <>
            <div className="sticky-header">
                <div className="header-row">
                    <Link href="/" className="back-btn"><span className="material-symbols-outlined">arrow_back</span></Link>
                    <h1>Калькулятор дозировок</h1><span />
                </div>
            </div>
            <div className="page-body">
                <div className="card" style={{ textAlign: "center" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#22c55e" }}>calculate</span>
                    <p className="section-heading" style={{ marginTop: "8px" }}>Расчёт дозы</p>
                    <p className="section-sub">По весу ребёнка</p>
                </div>
                <div className="form-group"><label className="form-label">Вес ребёнка (кг)</label><input type="number" className="form-input" placeholder="напр. 13.5" step="0.1" min="1" max="100" value={weight} onChange={e => setWeight(e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Препарат</label>
                    <select className="form-input form-select" onChange={selectDrug}>
                        <option data-dose="" data-conc="">Выберите препарат...</option>
                        <option data-dose="10" data-conc="20">Ибупрофен (Нурофен) — 10 мг/кг</option>
                        <option data-dose="15" data-conc="24">Парацетамол (Панадол) — 15 мг/кг</option>
                        <option data-dose="5" data-conc="">Цетиризин (Зиртек) — 5 мг/кг</option>
                    </select>
                </div>
                <div className="form-group"><label className="form-label">Доза (мг/кг)</label><input type="number" className="form-input" placeholder="напр. 10" step="0.5" value={dose} onChange={e => setDose(e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Концентрация суспензии (мг/мл)</label><input type="number" className="form-input" placeholder="напр. 20" step="0.5" value={conc} onChange={e => setConc(e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Приёмов в день</label>
                    <select className="form-input form-select" value={freq} onChange={e => setFreq(Number(e.target.value))}>
                        <option value={1}>1 раз</option><option value={2}>2 раза</option><option value={3}>3 раза</option><option value={4}>4 раза</option>
                    </select>
                </div>

                <div className="card" style={{ background: "var(--primary-light)", borderColor: "var(--primary-border)" }}>
                    {singleMg > 0 ? (
                        <div style={{ textAlign: "center" }}>
                            <p style={{ fontSize: "32px", fontWeight: 700, color: "var(--primary)" }}>{singleMg} мг</p>
                            <p className="section-sub">разовая доза</p>
                            {singleMl > 0 && <p style={{ fontSize: "24px", fontWeight: 700, color: "var(--primary)", marginTop: "8px" }}>{singleMl} мл</p>}
                            <p className="section-sub" style={{ marginTop: "4px" }}>Суточная: {dailyMg} мг ({freq} × {singleMg} мг)</p>
                        </div>
                    ) : (
                        <p className="section-sub" style={{ textAlign: "center" }}>Введите данные для расчёта</p>
                    )}
                </div>
                <div className="info-box info-box-orange"><strong className="orange">Внимание:</strong> Калькулятор предоставляет ориентировочные данные. Всегда сверяйтесь с инструкцией к препарату и рекомендациями врача.</div>
            </div>
        </>
    );
}
