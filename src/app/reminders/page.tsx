"use client";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useState, useEffect } from "react";
import { t } from "@/lib/i18n";
import { useRouter } from "next/navigation";

export default function RemindersPage() {
    const { childrenInfo, selectedChildId, langPref } = useApp() as any;
    const router = useRouter();
    const L = langPref;
    const [reminders, setReminders] = useState<any[]>([]);
    const [showAdd, setShowAdd] = useState(false);

    // New reminder state
    const [title, setTitle] = useState("");
    const [intervalHours, setIntervalHours] = useState("");
    const [type, setType] = useState("medication");
    const [loading, setLoading] = useState(false);

    const activeChild = childrenInfo?.find((c: any) => c.id === selectedChildId) || childrenInfo?.[0];

    const fetchReminders = async () => {
        if (!activeChild) return;
        try {
            const res = await fetch(`/api/reminders?childId=${activeChild.id}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("mama_expert_token")}` }
            });
            if (res.ok) setReminders(await res.json());
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchReminders();
    }, [activeChild]);

    const handleAdd = async () => {
        if (!title.trim() || !intervalHours || !activeChild) return;
        setLoading(true);
        try {
            const res = await fetch("/api/reminders", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("mama_expert_token")}` },
                body: JSON.stringify({ title, intervalHours, type, childId: activeChild.id })
            });
            if (res.ok) {
                setShowAdd(false);
                setTitle("");
                setIntervalHours("");
                await fetchReminders();
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (id: number, currentActive: boolean) => {
        try {
            await fetch("/api/reminders", {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("mama_expert_token")}` },
                body: JSON.stringify({ id, active: !currentActive })
            });
            await fetchReminders();
        } catch (e) { console.error(e); }
    };

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
                    <h1>{t("Напоминания", L)}</h1>
                    <button className="action-btn" onClick={() => setShowAdd(!showAdd)}>
                        <span className="material-symbols-outlined">{showAdd ? "close" : "add_circle"}</span>
                    </button>
                </div>
            </div>

            <div className="page-body">
                {showAdd && (
                    <div className="card" style={{ marginBottom: "24px", border: "1px solid var(--primary)" }}>
                        <h3 style={{ marginBottom: "16px", fontSize: "16px" }}>{t("Новое напоминание", L)}</h3>

                        <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Название (например, Нурофен)</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "12px" }} />

                        <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Интервал (в часах)</label>
                        <input type="number" value={intervalHours} onChange={e => setIntervalHours(e.target.value)} placeholder="Например: 8" style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "16px" }} />

                        <button onClick={handleAdd} disabled={loading || !title || !intervalHours} style={{ width: "100%", padding: "12px", background: "var(--primary)", color: "white", border: "none", borderRadius: "8px", fontWeight: 600 }}>
                            {loading ? "..." : t("Сохранить", L)}
                        </button>
                    </div>
                )}

                <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary)", marginBottom: "12px" }}>
                    Для ребёнка: {activeChild.name || t("Ребёнок", L)}
                </p>

                {reminders.length === 0 ? (
                    <div style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "40px" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", opacity: 0.5, marginBottom: "8px" }}>notifications_off</span>
                        <p>{t("Нет активных напоминаний", L)}</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {reminders.map(rem => {
                            const isMissed = new Date(rem.nextAt) < new Date() && rem.active;
                            return (
                                <div key={rem.id} className={`card ${isMissed ? 'card-urgent' : ''}`} style={{ display: "flex", alignItems: "center", gap: "12px", opacity: rem.active ? 1 : 0.6 }}>
                                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <span className="material-symbols-outlined" style={{ color: "var(--primary)", fontSize: "20px" }}>
                                            {rem.type === 'timer' ? 'timer' : 'medication'}
                                        </span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 600, fontSize: "14px" }}>{rem.title}</p>
                                        <p style={{ fontSize: "12px", color: isMissed ? "var(--accent)" : "var(--text-secondary)" }}>
                                            {rem.active ? `Следующий: ${new Date(rem.nextAt).toLocaleString()}` : "Приостановлено"}
                                        </p>
                                    </div>
                                    <button onClick={() => toggleActive(rem.id, rem.active)} style={{ background: "none", border: "none", padding: "8px" }}>
                                        <span className={`material-symbols-outlined ${rem.active ? 'badge badge-success' : 'badge'}`} style={{ fontSize: "20px" }}>
                                            {rem.active ? "toggle_on" : "toggle_off"}
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
