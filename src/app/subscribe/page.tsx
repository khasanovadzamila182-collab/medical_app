"use client";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { t } from "@/lib/i18n";

export default function SubscribePage() {
    const router = useRouter();
    const { langPref } = useApp();
    const L = langPref;

    return (
        <>
            <div className="sticky-header">
                <div className="header-row">
                    <button className="back-btn" onClick={() => router.back()} style={{ background: "none", border: "none" }}><span className="material-symbols-outlined">arrow_back</span></button>
                    <h1>{t("Оформление подписки", L)}</h1>
                    <span />
                </div>
            </div>
            <div className="page-body" style={{ textAlign: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "64px", color: "var(--primary)", marginTop: "24px" }}>workspace_premium</span>
                <h2 style={{ marginTop: "16px", marginBottom: "8px" }}>
                    {L === "en" ? "Full access to all algorithms" : L === "uz" ? "Barcha algoritmlarga to'liq kirish" : "Доступ ко всем алгоритмам"}
                </h2>
                <p className="section-sub" style={{ marginBottom: "32px", padding: "0 16px" }}>
                    {t("Доступ ко всем алгоритмам", L)}
                </p>

                <div className="card" style={{ textAlign: "left", marginBottom: "32px" }}>
                    <div style={{ padding: "12px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 600 }}>{L === "en" ? "1 Month" : L === "uz" ? "1 Oy" : "1 Месяц"}</span>
                        <span style={{ color: "var(--primary)", fontWeight: 700 }}>50 000 UZS</span>
                    </div>
                </div>

                <p className="section-heading" style={{ fontSize: "14px", marginBottom: "16px" }}>{t("Выберите способ оплаты:", L)}</p>

                <a href="https://payme.uz" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "16px", background: "#30B392", color: "white", borderRadius: "12px", border: "none", fontWeight: 700, fontSize: "16px", marginBottom: "12px", textDecoration: "none" }}>
                    <span className="material-symbols-outlined">payment</span>
                    {t("Оплатить через Payme", L)}
                </a>

                <a href="https://click.uz" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "16px", background: "#007BFF", color: "white", borderRadius: "12px", border: "none", fontWeight: 700, fontSize: "16px", textDecoration: "none" }}>
                    <span className="material-symbols-outlined">payments</span>
                    {t("Оплатить через Click", L)}
                </a>

                <p style={{ marginTop: "24px", fontSize: "12px", color: "var(--text-caption)" }}>
                    {L === "en" ? "*After payment your subscription will be activated automatically." : L === "uz" ? "*To'lovdan so'ng obunangiz avtomatik faollashtiriladi." : "*После оплаты ваша подписка будет активирована автоматически."}
                </p>
            </div>
        </>
    );
}
