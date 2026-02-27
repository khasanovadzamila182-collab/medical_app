"use client";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";

export default function ProfilePage() {
    const router = useRouter();
    const { childName, childWeight, childAgeMonths, subStatus, setChildName, setChildWeight, setChildAgeMonths, saveProfile, langPref } = useApp();
    const L = langPref;
    const [loading, setLoading] = useState(false);
    const [localName, setLocalName] = useState(childName || "");
    const [localWeight, setLocalWeight] = useState(childWeight || "");
    const [localAge, setLocalAge] = useState(childAgeMonths || "");

    useEffect(() => {
        setLocalName(childName || "");
        setLocalWeight(childWeight || "");
        setLocalAge(childAgeMonths || "");
    }, [childName, childWeight, childAgeMonths]);

    const handleSave = async () => {
        setLoading(true);
        setChildName(localName);
        setChildWeight(Number(localWeight));
        setChildAgeMonths(Number(localAge));
        await saveProfile();
        setLoading(false);
        const params = new URLSearchParams(window.location.search);
        const returnUrl = params.get('return');
        if (returnUrl) { router.push(returnUrl); } else { router.push("/"); }
    };

    return (
        <>
            <div className="sticky-header">
                <div className="header-row">
                    <button className="back-btn" onClick={() => router.back()} style={{ background: "none", border: "none" }}><span className="material-symbols-outlined">arrow_back</span></button>
                    <h1>{t("Профиль ребёнка", L)}</h1>
                    <span />
                </div>
            </div>
            <div className="page-body">
                <div className="card">
                    <p className="section-heading" style={{ fontSize: "15px", marginBottom: "16px" }}>{t("Данные ребёнка", L)}</p>

                    <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>{t("Имя (необязательно)", L)}</label>
                    <input type="text" value={localName} onChange={e => setLocalName(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "16px" }} />

                    <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>{t("Вес, кг (важно для лекарств)", L)}</label>
                    <input type="number" value={localWeight} onChange={e => setLocalWeight(e.target.value)} placeholder={L === "en" ? "e.g., 12.5" : L === "uz" ? "Masalan, 12.5" : "Например, 12.5"} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "16px" }} />

                    <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>{t("Возраст, полных месяцев", L)}</label>
                    <input type="number" value={localAge} onChange={e => setLocalAge(e.target.value)} placeholder={L === "en" ? "e.g., 18" : L === "uz" ? "Masalan, 18" : "Например, 18"} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "24px" }} />

                    <button onClick={handleSave} disabled={loading} style={{ width: "100%", padding: "14px", background: "var(--primary)", color: "white", borderRadius: "12px", border: "none", fontWeight: 600, fontSize: "16px" }}>
                        {loading ? t("Сохранение...", L) : t("Сохранить профиль", L)}
                    </button>
                </div>

                <div className="card" style={{ marginTop: "16px" }}>
                    <p className="section-heading" style={{ fontSize: "15px", marginBottom: "8px" }}>{t("Статус подписки", L)}</p>
                    {subStatus ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--primary)" }}>
                            <span className="material-symbols-outlined">check_circle</span>
                            <span style={{ fontWeight: 600 }}>{t("Подписка активна", L)}</span>
                        </div>
                    ) : (
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#d97706", marginBottom: "12px" }}>
                                <span className="material-symbols-outlined">warning</span>
                                <span style={{ fontWeight: 600 }}>{t("Нет активной подписки", L)}</span>
                            </div>
                            <Link href="/subscribe" style={{ display: "block", textAlign: "center", padding: "12px", background: "var(--primary-light)", color: "var(--primary)", borderRadius: "8px", textDecoration: "none", fontWeight: 600 }}>
                                {t("Оформить подписку", L)}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
