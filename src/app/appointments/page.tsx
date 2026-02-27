import Link from "next/link";

export default function AppointmentsPage() {
    return (
        <>
            <div className="sticky-header">
                <div className="header-row">
                    <Link href="/" className="back-btn"><span className="material-symbols-outlined">arrow_back</span></Link>
                    <h1>Запись к врачу</h1>
                    <button className="action-btn"><span className="material-symbols-outlined">add</span></button>
                </div>
            </div>
            <div className="page-body">
                <div className="search-wrap">
                    <span className="material-symbols-outlined">search</span>
                    <input type="text" placeholder="Поиск врача или специальности..." />
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span className="chip active">Все</span>
                    <span className="chip">Педиатр</span>
                    <span className="chip">ЛОР</span>
                    <span className="chip">Аллерголог</span>
                </div>

                <p className="section-heading" style={{ fontSize: "15px" }}>Предстоящие</p>
                <div className="card card-urgent" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ color: "var(--accent)" }}>person</span>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <p style={{ fontWeight: 700, fontSize: "15px" }}>Др. Иванова А.П.</p>
                            <span className="badge badge-warn">Завтра</span>
                        </div>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Педиатр · ДП №3</p>
                        <p style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 600, marginTop: "4px" }}>26 февр, 10:00</p>
                    </div>
                </div>
                <div className="card" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>person</span>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <p style={{ fontWeight: 700, fontSize: "15px" }}>Др. Сидоров К.М.</p>
                            <span className="badge badge-info">Плановый</span>
                        </div>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>ЛОР · Клиника Здоровье</p>
                        <p style={{ fontSize: "12px", color: "var(--primary)", fontWeight: 600, marginTop: "4px" }}>3 марта, 15:30</p>
                    </div>
                </div>

                <p className="section-heading" style={{ fontSize: "15px" }}>Прошедшие визиты</p>
                <Link href="/history" className="list-card" style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="icon-box"><span className="material-symbols-outlined">check_circle</span></div>
                    <div className="info"><p className="title">Др. Петрова Л.Н.</p><p className="subtitle">20 февр · Педиатр</p></div>
                    <span className="material-symbols-outlined chevron">chevron_right</span>
                </Link>
            </div>
        </>
    );
}
