import Link from "next/link";

export default function RemindersPage() {
    return (
        <>
            <div className="sticky-header">
                <div className="header-row">
                    <Link href="/" className="back-btn"><span className="material-symbols-outlined">arrow_back</span></Link>
                    <h1>Напоминания</h1>
                    <button className="action-btn"><span className="material-symbols-outlined">add_circle</span></button>
                </div>
            </div>
            <div className="page-body">
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span className="chip active">Сегодня</span><span className="chip">Завтра</span><span className="chip">Все</span>
                </div>
                {/* Taken */}
                <div className="card" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="material-symbols-outlined" style={{ color: "#22c55e", fontSize: "20px" }}>check_circle</span>
                    </div>
                    <div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: "14px", textDecoration: "line-through", color: "var(--text-caption)" }}>Нурофен сироп</p><p style={{ fontSize: "12px", color: "var(--text-caption)" }}>08:00 · 5 мл</p></div>
                    <span className="badge badge-success">Принят</span>
                </div>
                <div className="card" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="material-symbols-outlined" style={{ color: "#22c55e", fontSize: "20px" }}>check_circle</span>
                    </div>
                    <div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: "14px", textDecoration: "line-through", color: "var(--text-caption)" }}>Аквамарис</p><p style={{ fontSize: "12px", color: "var(--text-caption)" }}>08:00 · 2 капли</p></div>
                    <span className="badge badge-success">Принят</span>
                </div>
                {/* Missed */}
                <div className="card card-urgent" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="material-symbols-outlined" style={{ color: "#ef4444", fontSize: "20px" }}>medication</span>
                    </div>
                    <div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: "14px" }}>Нурофен сироп</p><p style={{ fontSize: "12px", color: "var(--accent)" }}>14:00 · 5 мл · Пропущен!</p></div>
                    <span className="badge badge-danger">Пропущен</span>
                </div>
                {/* Upcoming */}
                <div className="card" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="material-symbols-outlined" style={{ color: "var(--primary)", fontSize: "20px" }}>schedule</span>
                    </div>
                    <div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: "14px" }}>Аквамарис</p><p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>16:00 · 2 капли</p></div>
                    <span className="badge badge-info">Ожидает</span>
                </div>
                <div className="card" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="material-symbols-outlined" style={{ color: "var(--primary)", fontSize: "20px" }}>schedule</span>
                    </div>
                    <div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: "14px" }}>Нурофен сироп</p><p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>20:00 · 5 мл</p></div>
                    <span className="badge badge-info">Ожидает</span>
                </div>
            </div>
        </>
    );
}
