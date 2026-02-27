import Link from "next/link";

export default function MedcardPage() {
    return (
        <>
            <div className="sticky-header">
                <div className="header-row">
                    <Link href="/" className="back-btn"><span className="material-symbols-outlined">arrow_back</span></Link>
                    <h1>Медкарта</h1>
                    <button className="action-btn"><span className="material-symbols-outlined">edit</span></button>
                </div>
            </div>
            <div className="page-body">
                {/* Child profile */}
                <div className="card" style={{ textAlign: "center" }}>
                    <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                        <span className="material-symbols-outlined" style={{ color: "var(--primary)", fontSize: "36px" }}>child_care</span>
                    </div>
                    <p style={{ fontWeight: 700, fontSize: "18px" }}>Алиса Каримова</p>
                    <p className="section-sub">2 года 8 месяцев · 13.5 кг</p>
                </div>

                {/* Info */}
                <div className="card">
                    <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>Основная информация</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span className="section-sub">Дата рождения</span><span style={{ fontWeight: 600, fontSize: "13px" }}>15.06.2023</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span className="section-sub">Группа крови</span><span style={{ fontWeight: 600, fontSize: "13px" }}>II (A) Rh+</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span className="section-sub">Аллергии</span><span style={{ fontWeight: 600, fontSize: "13px", color: "var(--accent)" }}>Амоксициллин</span></div>
                    </div>
                </div>

                {/* Vaccinations */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p className="section-heading" style={{ fontSize: "15px" }}>Прививки</p>
                    <span className="btn-outline" style={{ padding: "6px 14px", fontSize: "12px" }}>Все →</span>
                </div>
                <div className="card" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="material-symbols-outlined" style={{ color: "#22c55e", fontSize: "20px" }}>check_circle</span>
                    </div>
                    <div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: "14px" }}>БЦЖ</p><p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>16.06.2023</p></div>
                    <span className="badge badge-success">Сделана</span>
                </div>
                <div className="card" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="material-symbols-outlined" style={{ color: "var(--accent)", fontSize: "20px" }}>schedule</span>
                    </div>
                    <div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: "14px" }}>АКДС (4-я доза)</p><p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Запланирована: март 2026</p></div>
                    <span className="badge badge-warn">Ожидает</span>
                </div>
            </div>
        </>
    );
}
