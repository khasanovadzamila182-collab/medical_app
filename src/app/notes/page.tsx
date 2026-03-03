"use client";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useState, useEffect } from "react";
import { t } from "@/lib/i18n";
import { useRouter } from "next/navigation";

export default function NotesPage() {
    const { childrenInfo, selectedChildId, langPref } = useApp() as any;
    const router = useRouter();
    const L = langPref;
    const [notes, setNotes] = useState<any[]>([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const activeChild = childrenInfo?.find((c: any) => c.id === selectedChildId) || childrenInfo?.[0];

    const fetchNotes = async () => {
        if (!activeChild) return;
        try {
            const res = await fetch(`/api/notes?childId=${activeChild.id}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("mama_expert_token")}` }
            });
            if (res.ok) setNotes(await res.json());
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchNotes();
    }, [activeChild]);

    const handleAdd = async () => {
        if (!text.trim() || !activeChild) return;
        setLoading(true);
        try {
            const res = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("mama_expert_token")}` },
                body: JSON.stringify({ text, childId: activeChild.id })
            });
            if (res.ok) {
                setText("");
                await fetchNotes();
            }
        } finally {
            setLoading(false);
        }
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
                    <Link href="/medcard" className="back-btn"><span className="material-symbols-outlined">arrow_back</span></Link>
                    <h1>{t("Дневник", L)}</h1>
                    <span />
                </div>
            </div>

            <div className="page-body">
                <div className="card" style={{ marginBottom: "24px" }}>
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Запишите симптомы, температуру или другие наблюдения..."
                        style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", minHeight: "100px", resize: "none" }}
                    />
                    <button
                        onClick={handleAdd}
                        disabled={loading || !text.trim()}
                        style={{ width: "100%", marginTop: "12px", padding: "12px", background: "var(--primary)", color: "white", border: "none", borderRadius: "8px", fontWeight: 600 }}
                    >
                        {loading ? "..." : "Добавить запись"}
                    </button>
                </div>

                {notes.length === 0 ? (
                    <div style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "40px" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", opacity: 0.5, marginBottom: "8px" }}>edit_note</span>
                        <p>{t("Здесь пока нет записей", L)}</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {notes.map(note => (
                            <div key={note.id} className="card">
                                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px", fontWeight: 600 }}>
                                    {new Date(note.createdAt).toLocaleString()}
                                </p>
                                <p style={{ fontSize: "15px", lineHeight: "1.5" }}>{note.text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
