"use client";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Tab = "users" | "kpi" | "media";

interface UserData {
    id: number;
    phone: string | null;
    tgId: string;
    subStatus: boolean;
    lastActive: string;
    childrenCount: number;
    createdAt: string;
}

interface KpiData {
    module: string;
    eventType: string;
    _count: { _all: number };
}

interface MediaData {
    id: number;
    stepId: string;
    imageUrl: string;
    caption: string | null;
}

export default function AdminPage() {
    const { isAdmin, loaded } = useApp();
    const router = useRouter();
    const [tab, setTab] = useState<Tab>("users");

    const [users, setUsers] = useState<UserData[]>([]);
    const [kpi, setKpi] = useState<KpiData[]>([]);
    const [media, setMedia] = useState<MediaData[]>([]);
    const [loading, setLoading] = useState(true);

    // Media form
    const [editStepId, setEditStepId] = useState("");
    const [editImageUrl, setEditImageUrl] = useState("");
    const [editCaption, setEditCaption] = useState("");

    useEffect(() => {
        if (!loaded) return;
        if (!isAdmin) { router.replace("/"); return; }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [uRes, kRes, mRes] = await Promise.all([
                    fetch("/api/admin/users"),
                    fetch("/api/events"),
                    fetch("/api/admin/media"),
                ]);
                if (uRes.ok) setUsers(await uRes.json());
                if (kRes.ok) setKpi(await kRes.json());
                if (mRes.ok) setMedia(await mRes.json());
            } catch (e) {
                console.error("Admin fetch error:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isAdmin, loaded, router]);

    // KPI calculations
    const totalUsers = users.length;
    const paidUsers = users.filter(u => u.subStatus).length;
    const conversionRate = totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : "0";

    // Popularity: start events per module
    const popularityData = kpi
        .filter(k => k.eventType === "start")
        .sort((a, b) => b._count._all - a._count._all);

    // Drop-off: modules with starts but no ends (or fewer ends than starts)
    const moduleStarts: Record<string, number> = {};
    const moduleEnds: Record<string, number> = {};
    kpi.forEach(k => {
        if (k.eventType === "start") moduleStarts[k.module] = (moduleStarts[k.module] || 0) + k._count._all;
        if (k.eventType === "end") moduleEnds[k.module] = (moduleEnds[k.module] || 0) + k._count._all;
    });
    const dropOffData = Object.keys(moduleStarts).map(mod => {
        const starts = moduleStarts[mod] || 0;
        const ends = moduleEnds[mod] || 0;
        const dropped = starts - ends;
        const rate = starts > 0 ? ((dropped / starts) * 100).toFixed(1) : "0";
        return { module: mod, starts, ends, dropped, rate };
    });

    const handleSaveMedia = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/media", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stepId: editStepId, imageUrl: editImageUrl, caption: editCaption }),
            });
            if (res.ok) {
                const updated = await res.json();
                setMedia(prev => {
                    const idx = prev.findIndex(m => m.stepId === updated.stepId);
                    if (idx >= 0) { const n = [...prev]; n[idx] = updated; return n; }
                    return [...prev, updated];
                });
                setEditStepId(""); setEditImageUrl(""); setEditCaption("");
            }
        } catch (e) { console.error("Save media error:", e); }
    };

    if (!loaded || loading) return <div style={{ padding: 24, textAlign: "center" }}>Загрузка...</div>;
    if (!isAdmin) return null;

    return (
        <div style={{ paddingBottom: "80px", minHeight: "100vh" }}>
            <div className="sticky-header" style={{ padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <Link href="/" className="back-btn"><span className="material-symbols-outlined">arrow_back</span></Link>
                    <h1 style={{ fontSize: "20px", margin: 0 }}>Админ-панель</h1>
                </div>
                <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
                    {(["users", "kpi", "media"] as Tab[]).map(t => (
                        <button key={t} onClick={() => setTab(t)} style={{
                            padding: "6px 14px", borderRadius: "8px", border: "1px solid var(--primary)",
                            background: tab === t ? "var(--primary)" : "transparent",
                            color: tab === t ? "white" : "var(--primary)", fontWeight: 600, fontSize: "13px", cursor: "pointer",
                        }}>
                            {t === "users" ? "Пользователи" : t === "kpi" ? "KPI" : "Медиа"}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ padding: "16px" }}>
                {/* ═══ USERS TAB ═══ */}
                {tab === "users" && (
                    <div className="card" style={{ padding: "16px", overflowX: "auto" }}>
                        <h2 style={{ fontSize: "16px", marginBottom: "16px" }}>Пользователи ({totalUsers})</h2>
                        <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse", minWidth: "500px" }}>
                            <thead>
                                <tr style={{ borderBottom: "2px solid var(--border)", textAlign: "left" }}>
                                    <th style={{ padding: "8px" }}>TG ID</th>
                                    <th style={{ padding: "8px" }}>Телефон</th>
                                    <th style={{ padding: "8px" }}>Подписка</th>
                                    <th style={{ padding: "8px" }}>Дети</th>
                                    <th style={{ padding: "8px" }}>Регистрация</th>
                                    <th style={{ padding: "8px" }}>Активность</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                        <td style={{ padding: "8px", fontFamily: "monospace" }}>{u.tgId}</td>
                                        <td style={{ padding: "8px" }}>{u.phone || "—"}</td>
                                        <td style={{ padding: "8px" }}>
                                            {u.subStatus
                                                ? <span style={{ color: "#16a34a", fontWeight: 600 }}>✓ Активна</span>
                                                : <span style={{ color: "#dc2626" }}>✕ Нет</span>}
                                        </td>
                                        <td style={{ padding: "8px" }}>{u.childrenCount}</td>
                                        <td style={{ padding: "8px" }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString("ru-RU") : "—"}</td>
                                        <td style={{ padding: "8px" }}>{new Date(u.lastActive).toLocaleDateString("ru-RU")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ═══ KPI TAB ═══ */}
                {tab === "kpi" && (
                    <>
                        {/* Summary cards */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                            <div className="card" style={{ textAlign: "center", padding: "16px" }}>
                                <p style={{ fontSize: "28px", fontWeight: 800, color: "var(--primary)" }}>{totalUsers}</p>
                                <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Всего юзеров</p>
                            </div>
                            <div className="card" style={{ textAlign: "center", padding: "16px" }}>
                                <p style={{ fontSize: "28px", fontWeight: 800, color: "#22c55e" }}>{paidUsers}</p>
                                <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Подписчики</p>
                            </div>
                            <div className="card" style={{ textAlign: "center", padding: "16px" }}>
                                <p style={{ fontSize: "28px", fontWeight: 800, color: "#f59e0b" }}>{conversionRate}%</p>
                                <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Конверсия</p>
                            </div>
                        </div>

                        {/* Popularity Index */}
                        <div className="card" style={{ padding: "16px", marginBottom: "16px" }}>
                            <h3 style={{ fontSize: "15px", marginBottom: "12px" }}>📊 Popularity Index</h3>
                            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px" }}>Количество запусков по каждой категории</p>
                            {popularityData.length === 0 && <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Данных пока нет.</p>}
                            {popularityData.map((p, i) => {
                                const maxCount = popularityData[0]?._count._all || 1;
                                const barWidth = (p._count._all / maxCount) * 100;
                                return (
                                    <div key={i} style={{ marginBottom: "10px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                                            <span style={{ fontWeight: 600 }}>{p.module}</span>
                                            <span style={{ color: "var(--primary)", fontWeight: 700 }}>{p._count._all}</span>
                                        </div>
                                        <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                                            <div style={{ height: "100%", width: `${barWidth}%`, background: "var(--primary)", borderRadius: "3px", transition: "width 0.3s" }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Drop-off Rate */}
                        <div className="card" style={{ padding: "16px" }}>
                            <h3 style={{ fontSize: "15px", marginBottom: "12px" }}>📉 Drop-off Rate</h3>
                            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px" }}>% пользователей, не завершивших диагностику</p>
                            <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                                        <th style={{ padding: "6px" }}>Модуль</th>
                                        <th style={{ padding: "6px" }}>Начали</th>
                                        <th style={{ padding: "6px" }}>Завершили</th>
                                        <th style={{ padding: "6px" }}>Отказ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dropOffData.map((d, i) => (
                                        <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                            <td style={{ padding: "6px", fontWeight: 600 }}>{d.module}</td>
                                            <td style={{ padding: "6px" }}>{d.starts}</td>
                                            <td style={{ padding: "6px" }}>{d.ends}</td>
                                            <td style={{ padding: "6px", color: Number(d.rate) > 50 ? "#dc2626" : "#f59e0b", fontWeight: 700 }}>{d.rate}%</td>
                                        </tr>
                                    ))}
                                    {dropOffData.length === 0 && <tr><td colSpan={4} style={{ padding: "16px", textAlign: "center" }}>Данных пока нет.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* ═══ MEDIA TAB ═══ */}
                {tab === "media" && (
                    <>
                        <div className="card" style={{ padding: "16px", marginBottom: "16px" }}>
                            <h2 style={{ fontSize: "16px", marginBottom: "8px" }}>Добавить/Изменить медиа</h2>
                            <form onSubmit={handleSaveMedia} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <div>
                                    <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Step ID</label>
                                    <input type="text" value={editStepId} onChange={e => setEditStepId(e.target.value)} required placeholder="lungs_wet_advice" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "15px" }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Image URL</label>
                                    <input type="url" value={editImageUrl} onChange={e => setEditImageUrl(e.target.value)} required placeholder="https://..." style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "15px" }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Подпись</label>
                                    <input type="text" value={editCaption} onChange={e => setEditCaption(e.target.value)} placeholder="Описание" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "15px" }} />
                                </div>
                                <button type="submit" className="btn-primary" style={{ marginTop: "8px" }}>Сохранить</button>
                            </form>
                        </div>
                        <div className="card" style={{ padding: "16px" }}>
                            <h2 style={{ fontSize: "16px", marginBottom: "16px" }}>Загруженные медиа</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {media.map(m => (
                                    <div key={m.id} onClick={() => { setEditStepId(m.stepId); setEditImageUrl(m.imageUrl); setEditCaption(m.caption || ""); }} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "12px", border: "1px solid var(--border)", borderRadius: "12px", cursor: "pointer" }}>
                                        <img src={m.imageUrl} alt={m.caption || m.stepId} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 600, fontSize: "14px" }}>{m.stepId}</p>
                                            <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{m.caption || "Без подписи"}</p>
                                        </div>
                                        <span className="material-symbols-outlined" style={{ color: "var(--text-secondary)" }}>edit</span>
                                    </div>
                                ))}
                                {media.length === 0 && <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Медиафайлов пока нет.</p>}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
