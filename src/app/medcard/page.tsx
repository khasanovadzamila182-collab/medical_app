"use client";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useState, useEffect } from "react";
import { t } from "@/lib/i18n";
import { useRouter } from "next/navigation";

export default function MedcardPage() {
    const { childrenInfo, selectedChildId, langPref } = useApp() as any;
    const router = useRouter();
    const L = langPref;
    const [history, setHistory] = useState<any[]>([]);

    const activeChild = childrenInfo?.find((c: any) => c.id === selectedChildId) || childrenInfo?.[0];

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch("/api/events/history", {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("mama_expert_token")}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setHistory(data);
                }
            } catch (e) { console.error(e); }
        };
        fetchHistory();
    }, []);

    if (!activeChild) {
        return (
            <div className="page-body" style={{ textAlign: "center", paddingTop: "40px" }}>
                <p>{t("Сначала добавьте профиль ребёнка", L)}</p>
                <button onClick={() => router.push("/profile/new")} className="btn-primary" style={{ marginTop: "16px" }}>{t("Добавить", L)}</button>
            </div>
        );
    }

    return (
        <>
            <div className="sticky-header">
                <div className="header-row">
                    <Link href="/" className="back-btn"><span className="material-symbols-outlined">arrow_back</span></Link>
                    <h1>{t("Медкарта", L)}</h1>
                    <button className="action-btn" onClick={() => router.push("/profile")}><span className="material-symbols-outlined">edit</span></button>
                </div>
            </div>
            <div className="page-body">
                {/* Child profile */}
                <div className="card" style={{ textAlign: "center" }}>
                    <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                        <span className="material-symbols-outlined" style={{ color: "var(--primary)", fontSize: "36px" }}>child_care</span>
                    </div>
                    <p style={{ fontWeight: 700, fontSize: "18px" }}>{activeChild.name || t("Ребёнок", L)}</p>
                    <p className="section-sub">{activeChild.ageMonths} {t("мес.", L)} · {activeChild.weight} {t("кг", L)}</p>
                </div>

                {/* History */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", marginBottom: "8px" }}>
                    <p className="section-heading" style={{ fontSize: "15px", margin: 0 }}>{t("История диагностики", L)}</p>
                    <Link href="/history" style={{ textDecoration: "none", color: "var(--primary)", fontSize: "13px", fontWeight: 600 }}>{t("Все", L)} →</Link>
                </div>

                {history.length === 0 ? (
                    <div className="card" style={{ textAlign: "center", padding: "24px", color: "var(--text-secondary)" }}>
                        <p>{t("История пуста", L)}</p>
                    </div>
                ) : (
                    history.map(item => (
                        <div key={item.id} className="card" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span className="material-symbols-outlined" style={{ color: "var(--primary)", fontSize: "20px" }}>history</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 600, fontSize: "14px" }}>{t(item.module, L)}</p>
                                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                                    {new Date(item.createdAt).toLocaleDateString()} • {item.step || "Завершено"}
                                </p>
                            </div>
                        </div>
                    ))
                )}

                {/* Shortcuts */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "24px" }}>
                    <Link href="/notes" className="card card-clickable" style={{ textAlign: "center", padding: "16px", textDecoration: "none", color: "inherit" }}>
                        <span className="material-symbols-outlined" style={{ color: "#8b5cf6", fontSize: "28px", marginBottom: "8px" }}>edit_note</span>
                        <p style={{ fontWeight: 600, fontSize: "13px" }}>{t("Дневник", L)}</p>
                    </Link>
                    <Link href="/analyses" className="card card-clickable" style={{ textAlign: "center", padding: "16px", textDecoration: "none", color: "inherit" }}>
                        <span className="material-symbols-outlined" style={{ color: "#ec4899", fontSize: "28px", marginBottom: "8px" }}>snippet_folder</span>
                        <p style={{ fontWeight: 600, fontSize: "13px" }}>{t("Анализы", L)}</p>
                    </Link>
                </div>
            </div>
        </>
    );
}
