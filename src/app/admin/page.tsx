"use client";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function AdminPage() {
    const { isAdmin, loaded } = useApp();
    const router = useRouter();

    const [users, setUsers] = useState<UserData[]>([]);
    const [kpi, setKpi] = useState<KpiData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!loaded) return;
        if (!isAdmin) { router.replace("/"); return; }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [uRes, kRes] = await Promise.all([
                    fetch("/api/admin/users"),
                    fetch("/api/events"),
                ]);
                if (uRes.ok) setUsers(await uRes.json());
                if (kRes.ok) setKpi(await kRes.json());
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

    // Popularity logic
    const popularityData = kpi
        .filter(k => k.eventType === "start")
        .sort((a, b) => b._count._all - a._count._all)
        .slice(0, 3); // Top 3 popular sections

    // Recent registrations
    const recentUsers = [...users]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    if (!loaded || loading) return <div style={{ padding: 24, textAlign: "center" }}>Загрузка...</div>;
    if (!isAdmin) return null;

    return (
        <div style={{ paddingBottom: "80px", minHeight: "100vh" }}>
            <div className="sticky-header" style={{ padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Link href="/" className="back-btn"><span className="material-symbols-outlined">arrow_back</span></Link>
                    <h1 style={{ fontSize: "20px", margin: 0 }}>Админ-панель</h1>
                </div>
            </div>

            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "24px" }}>

                {/* ═══ TOP: KPIs ═══ */}
                <section>
                    <h2 style={{ fontSize: "16px", marginBottom: "12px", color: "var(--primary)" }}>Ключевые показатели</h2>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                        <div className="card" style={{ textAlign: "center", padding: "16px" }}>
                            <p style={{ fontSize: "28px", fontWeight: 800, color: "var(--primary)" }}>{totalUsers}</p>
                            <p style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase" }}>Всего юзеров</p>
                        </div>
                        <div className="card" style={{ textAlign: "center", padding: "16px" }}>
                            <p style={{ fontSize: "28px", fontWeight: 800, color: "#22c55e" }}>{paidUsers}</p>
                            <p style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase" }}>Активных (PAID)</p>
                        </div>
                    </div>

                    <div className="card" style={{ padding: "16px" }}>
                        <h3 style={{ fontSize: "14px", marginBottom: "12px" }}>Популярные разделы</h3>
                        {popularityData.length === 0 ? <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Нет данных</p> :
                            popularityData.map((p, i) => (
                                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", borderBottom: i !== popularityData.length - 1 ? "1px solid #f1f5f9" : "none", paddingBottom: "4px" }}>
                                    <span>{p.module}</span>
                                    <span style={{ fontWeight: 700, color: "var(--primary)" }}>{p._count._all} запусков</span>
                                </div>
                            ))
                        }
                    </div>
                </section>

                {/* ═══ MIDDLE: Recent Registrations ═══ */}
                <section>
                    <h2 style={{ fontSize: "16px", marginBottom: "12px", color: "var(--primary)" }}>Новые регистрации</h2>
                    <div className="card" style={{ padding: "0" }}>
                        {recentUsers.map((u, i) => (
                            <div key={u.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: i !== recentUsers.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: "14px" }}>TG: {u.tgId}</p>
                                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{u.phone || "Нет номера"}</p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{new Date(u.createdAt).toLocaleDateString("ru-RU")}</p>
                                    {u.subStatus ? <span className="badge badge-success" style={{ padding: "2px 6px", fontSize: "10px" }}>Активен</span> : <span className="badge" style={{ padding: "2px 6px", fontSize: "10px" }}>Нет доступа</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ═══ BOTTOM: Settings & Management ═══ */}
                <section>
                    <h2 style={{ fontSize: "16px", marginBottom: "12px", color: "var(--primary)" }}>Управление контентом</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

                        <Link href="/admin/media" className="card card-clickable" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", color: "inherit" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span className="material-symbols-outlined" style={{ color: "#d97706" }}>image</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 600, fontSize: "14px" }}>Медиафайлы</p>
                                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Редактирование иллюстраций шагов</p>
                            </div>
                            <span className="material-symbols-outlined">chevron_right</span>
                        </Link>

                        <Link href="/admin/glossary" className="card card-clickable" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", color: "inherit" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span className="material-symbols-outlined" style={{ color: "#8b5cf6" }}>menu_book</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 600, fontSize: "14px" }}>Глоссарий</p>
                                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Добавление и удаление терминов</p>
                            </div>
                            <span className="material-symbols-outlined">chevron_right</span>
                        </Link>

                        <Link href="/admin/texts" className="card card-clickable" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", color: "inherit" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span className="material-symbols-outlined" style={{ color: "#4f46e5" }}>translate</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 600, fontSize: "14px" }}>Тексты и переводы</p>
                                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Редактор мультиязычных словарей</p>
                            </div>
                            <span className="material-symbols-outlined">chevron_right</span>
                        </Link>

                        <Link href="/admin/users" className="card card-clickable" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", color: "inherit" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span className="material-symbols-outlined" style={{ color: "#22c55e" }}>group</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 600, fontSize: "14px" }}>Все пользователи</p>
                                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Полный список базы данных</p>
                            </div>
                            <span className="material-symbols-outlined">chevron_right</span>
                        </Link>

                    </div>
                </section>

            </div>
        </div>
    );
}
