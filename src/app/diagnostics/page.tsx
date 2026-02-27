"use client";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";

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
    const { subStatus, setCurrentDiagnostic, logEvent, needsWeight, setLastDiagPosition, langPref } = useApp();
    const router = useRouter();
    const L = langPref;

    const handleDiagnosticClick = (e: React.MouseEvent, area: typeof areas[0]) => {
        e.preventDefault();
        setCurrentDiagnostic(area.titleKey);
        logEvent(area.titleKey, "start");
        setLastDiagPosition(area.titleKey, "start");

        if (!subStatus) {
            router.push("/subscribe");
            return;
        }
        if (area.hasDose && needsWeight()) {
            router.push(`/profile?return=${area.href}`);
            return;
        }
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
            <div className="page-body">
                {!subStatus && (
                    <div className="info-box info-box-orange" style={{ marginBottom: "16px" }}>
                        <strong className="orange">{t("Доступ ограничен", L)}</strong> {t("sub_warning", L)}
                        <Link href="/subscribe" style={{ display: "block", marginTop: "8px", color: "var(--primary)", fontWeight: 600 }}>{t("Оформить подписку →", L)}</Link>
                    </div>
                )}
                <div><p className="section-heading">{t("Выберите область", L)}</p><p className="section-sub">{t("Что беспокоит ребёнка?", L)}</p></div>
                {areas.map(a => (
                    <a key={a.href} href={a.href} onClick={(e) => handleDiagnosticClick(e, a)} className="list-card" style={{ textDecoration: "none", color: "inherit", cursor: "pointer", display: "flex", opacity: (!subStatus ? 0.7 : 1) }}>
                        <div className="icon-box" style={{ background: a.bg }}>
                            <span className="material-symbols-outlined" style={{ color: a.color }}>{a.icon}</span>
                        </div>
                        <div className="info" style={{ flex: 1, marginLeft: "12px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <p className="title">{t(a.titleKey, L)}</p>
                            <p className="subtitle">{t(a.subKey, L)}</p>
                        </div>
                        {!subStatus && <span className="material-symbols-outlined" style={{ alignSelf: "center", color: "#d97706", fontSize: "18px" }}>lock</span>}
                        <span className="material-symbols-outlined chevron" style={{ alignSelf: "center", color: "var(--text-caption)" }}>chevron_right</span>
                    </a>
                ))}
            </div>
        </>
    );
}
