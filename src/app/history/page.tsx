import Link from "next/link";

export default function HistoryPage() {
    return (
        <>
            <div className="sticky-header">
                <div className="header-row">
                    <Link href="/" className="back-btn"><span className="material-symbols-outlined">arrow_back</span></Link>
                    <h1>История приёмов</h1><span />
                </div>
            </div>
            <div className="page-body">
                <div className="search-wrap"><span className="material-symbols-outlined">search</span><input type="text" placeholder="Поиск по истории..." /></div>
                <div style={{ display: "flex", gap: "8px" }}><span className="chip active">Все</span><span className="chip">Лекарства</span><span className="chip">Визиты</span><span className="chip">Диагностика</span></div>

                <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>Сегодня, 25 февраля</p>
                <div className="card" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="material-symbols-outlined" style={{ color: "#22c55e", fontSize: "20px" }}>medication</span>
                    </div>
                    <div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: "14px" }}>Нурофен сироп · 5 мл</p><p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>08:00 · Температура 37.8°C</p></div>
                    <span className="badge badge-success">✓</span>
                </div>
                <div className="card" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="material-symbols-outlined" style={{ color: "var(--primary)", fontSize: "20px" }}>air</span>
                    </div>
                    <div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: "14px" }}>Ингаляция · 10 мин</p><p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>09:30 · Физраствор</p></div>
                    <span className="badge badge-success">✓</span>
                </div>

                <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>Вчера, 24 февраля</p>
                <div className="card" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="material-symbols-outlined" style={{ color: "#22c55e", fontSize: "20px" }}>medication</span>
                    </div>
                    <div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: "14px" }}>Нурофен сироп · 5 мл</p><p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>08:00, 14:00, 20:00</p></div>
                    <span className="badge badge-success">3/3</span>
                </div>
                <div className="card" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="material-symbols-outlined" style={{ color: "#ef4444", fontSize: "20px" }}>thermostat</span>
                    </div>
                    <div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: "14px" }}>Температура: 38.5°C</p><p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>13:45 · Подмышечная</p></div>
                    <span className="badge badge-danger">Высокая</span>
                </div>
                <div className="card" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="material-symbols-outlined" style={{ color: "var(--primary)", fontSize: "20px" }}>person</span>
                    </div>
                    <div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: "14px" }}>Визит: Др. Петрова</p><p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>10:00 · Педиатр · ДП №3</p></div>
                    <span className="badge badge-info">Визит</span>
                </div>
            </div>
        </>
    );
}
