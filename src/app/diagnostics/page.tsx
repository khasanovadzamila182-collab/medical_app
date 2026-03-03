"use client";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";
import { useState } from "react";

const areas = [
    { href: "/temp", icon: "device_thermostat", bg: "#fee2e2", color: "#ef4444", titleKey: "Температура", subKey: "Измерение и рекомендации", hasDose: true },
    { href: "/lungs", icon: "respiratory_rate", bg: "#fff7ed", color: "var(--accent)", titleKey: "Кашель", subKey: "Влажный, сухой, лающий", hasDose: true },
    { href: "/eyes", icon: "visibility", bg: "var(--primary-light)", color: "var(--primary)", titleKey: "Глаза", subKey: "Покраснение, выделения", hasDose: false },
    { href: "/ears", icon: "hearing", bg: "#ede9fe", color: "#8b5cf6", titleKey: "Уши", subKey: "Боль, выделения", hasDose: false },
    { href: "/stomach", icon: "medication_liquid", bg: "#fef3c7", color: "#d97706", titleKey: "ЖКТ", subKey: "Тошнота, рвота, диарея", hasDose: true },
    { href: "/nose", icon: "ent", bg: "var(--primary-light)", color: "var(--primary)", titleKey: "Нос", subKey: "Заложенность, насморк", hasDose: false },
    { href: "/mouth", icon: "sentiment_sad", bg: "#fce7f3", color: "#ec4899", titleKey: "Боль в горле", subKey: "Покраснение, пятна, стоматит", hasDose: false },
];

export default function DiagnosticsPage() {
    const { subStatus, setCurrentDiagnostic, logEvent, needsWeight, setLastDiagPosition, langPref, childrenInfo, selectedChildId, setSelectedChildId } = useApp() as any;
    const router = useRouter();
    const L = langPref;
    const [showModal, setShowModal] = useState(false);
    const [pendingArea, setPendingArea] = useState<typeof areas[0] | null>(null);

    const handleDiagnosticClick = (e: React.MouseEvent, area: typeof areas[0]) => {
        e.preventDefault();

        // Check child weight dependency
        if (area.hasDose && needsWeight()) {
            if (childrenInfo && childrenInfo.length > 1 && !selectedChildId) {
                setPendingArea(area);
                setShowModal(true);
                return;
            } else if (!childrenInfo || childrenInfo.length === 0) {
                router.push(`/profile/new?return=${area.href}`);
                return;
            } else if (childrenInfo.length === 1 && !selectedChildId) {
                if (setSelectedChildId) setSelectedChildId(childrenInfo[0].id);
            }
        }

        setCurrentDiagnostic(area.titleKey);
        logEvent(area.titleKey, "start");
        setLastDiagPosition(area.titleKey, "start");

        router.push(area.href);
    };

    return (
        <>
            <div className="sticky-header">
                <div className="header-row">
                    <Link href="/" className="back-btn"><span className="material-symbols-outlined">arrow_back</span></Link>
                    <h1>{t("Диагностика", L)}</h1>
                    <span />
                </div>
            </div>
            <div className={"page-body"}>
                {showModal && (
                    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
                        <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
                            <h3 style={{ marginBottom: "16px", fontSize: "18px", color: "var(--text-primary)", textAlign: "center" }}>{t("Для кого из детей проводим осмотр?", L)}</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {childrenInfo?.map((child: any) => (
                                    <button
                                        key={child.id}
                                        onClick={() => {
                                            if (setSelectedChildId) setSelectedChildId(child.id);
                                            setShowModal(false);
                                            if (pendingArea) {
                                                setCurrentDiagnostic(pendingArea.titleKey);
                                                logEvent(pendingArea.titleKey, "start");
                                                setLastDiagPosition(pendingArea.titleKey, "start");
                                                router.push(pendingArea.href);
                                            }
                                        }}
                                        style={{ padding: "16px", borderRadius: "12px", border: "1px solid var(--primary)", background: "var(--primary-light)", color: "var(--primary)", fontWeight: 600, textAlign: "left", cursor: "pointer" }}
                                    >
                                        <span style={{ fontSize: "16px", display: "block", marginBottom: "4px" }}>{child.name || "Ребёнок"}</span>
                                        <span style={{ fontSize: "13px", opacity: 0.8, fontWeight: 400 }}>{child.weight} кг • {child.ageMonths} мес.</span>
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ marginTop: "16px", width: "100%", padding: "12px", background: "none", border: "none", color: "var(--text-secondary)", fontWeight: 600, cursor: "pointer" }}>
                                {t("Отмена", L)}
                            </button>
                        </div>
                    </div>
                )}
                <div><p className="section-heading">{t("Выберите область", L)}</p><p className="section-sub">{t("Что беспокоит ребёнка?", L)}</p></div>
                {areas.map(a => (
                    <a key={a.href} href={a.href} onClick={(e) => handleDiagnosticClick(e, a)} className="list-card" style={{ textDecoration: "none", color: "inherit", cursor: "pointer", display: "flex" }}>
                        <div className="icon-box" style={{ background: a.bg }}>
                            <span className="material-symbols-outlined" style={{ color: a.color }}>{a.icon}</span>
                        </div>
                        <div className="info" style={{ flex: 1, marginLeft: "12px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <p className="title">{t(a.titleKey, L)}</p>
                            <p className="subtitle">{t(a.subKey, L)}</p>
                        </div>
                        <span className="material-symbols-outlined chevron" style={{ alignSelf: "center", color: "var(--text-caption)" }}>chevron_right</span>
                    </a>
                ))}
            </div>
        </>
    );
}
