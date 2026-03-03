"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { t } from "@/lib/i18n";

export default function NewChildPage() {
    const router = useRouter();
    const { langPref } = useApp() as any;
    const [name, setName] = useState("");
    const [weight, setWeight] = useState("");
    const [ageMonths, setAgeMonths] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!weight || !ageMonths) return; // Add validation messages ideally
        setLoading(true);
        try {
            const res = await fetch("/api/children", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("mama_expert_token")}` },
                body: JSON.stringify({ name, weight: Number(weight), ageMonths: Number(ageMonths) }),
            });
            if (res.ok) {
                router.back();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="sticky-header">
                <div className="header-row">
                    <button className="back-btn" onClick={() => router.back()} style={{ background: "none", border: "none" }}><span className="material-symbols-outlined">arrow_back</span></button>
                    <h1>{t("Новый ребёнок", langPref)}</h1>
                    <span />
                </div>
            </div>
            <div className="page-body">
                <div className="card">
                    <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>{t("Имя (необязательно)", langPref)}</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "16px" }} />

                    <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>{t("Вес, кг", langPref)}</label>
                    <input type="number" value={weight} onChange={e => setWeight(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "16px" }} />

                    <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>{t("Возраст, месяцев", langPref)}</label>
                    <input type="number" value={ageMonths} onChange={e => setAgeMonths(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "24px" }} />

                    <button onClick={handleSave} disabled={loading || !weight || !ageMonths} style={{ width: "100%", padding: "14px", background: "var(--primary)", color: "white", borderRadius: "12px", border: "none", fontWeight: 600 }}>
                        {loading ? t("Сохранение...", langPref) : t("Сохранить", langPref)}
                    </button>
                </div>
            </div>
        </>
    );
}
