"use client";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useState, useEffect } from "react";
import { t } from "@/lib/i18n";
import { useRouter } from "next/navigation";

export default function AnalysesPage() {
    const { childrenInfo, selectedChildId, langPref } = useApp() as any;
    const router = useRouter();
    const L = langPref;
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const activeChild = childrenInfo?.find((c: any) => c.id === selectedChildId) || childrenInfo?.[0];

    const fetchFiles = async () => {
        if (!activeChild) return;
        try {
            const res = await fetch(`/api/analyses?childId=${activeChild.id}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("mama_expert_token")}` }
            });
            if (res.ok) setFiles(await res.json());
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchFiles();
    }, [activeChild]);

    const handleUploadMock = async () => {
        if (!activeChild) return;
        setLoading(true);
        try {
            // Mock upload - in a real app this would upload to S3 first
            const mockFileName = `Анализ_крови_${new Date().toISOString().split('T')[0]}.pdf`;
            const mockFileUrl = "https://example.com/mock-analysis.pdf";

            const res = await fetch("/api/analyses", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("mama_expert_token")}` },
                body: JSON.stringify({ fileName: mockFileName, fileUrl: mockFileUrl, childId: activeChild.id })
            });
            if (res.ok) {
                await fetchFiles();
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
                    <h1>{t("Анализы", L)}</h1>
                    <span />
                </div>
            </div>

            <div className="page-body">
                <button
                    onClick={handleUploadMock}
                    disabled={loading}
                    className="card card-clickable"
                    style={{ width: "100%", padding: "16px", background: "var(--primary-light)", color: "var(--primary)", border: "dashed 2px var(--primary)", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", fontWeight: 600, marginBottom: "24px" }}
                >
                    <span className="material-symbols-outlined">{loading ? "hourglass_empty" : "upload_file"}</span>
                    {loading ? "Загрузка..." : t("Загрузить документ", L)}
                </button>

                {files.length === 0 ? (
                    <div style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "40px" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", opacity: 0.5, marginBottom: "8px" }}>snippet_folder</span>
                        <p>{t("Здесь пока нет анализов", L)}</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {files.map(file => (
                            <a key={file.id} href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="card card-clickable" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", color: "inherit" }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span className="material-symbols-outlined" style={{ color: "var(--text-secondary)", fontSize: "20px" }}>description</span>
                                </div>
                                <div style={{ flex: 1, overflow: "hidden" }}>
                                    <p style={{ fontWeight: 600, fontSize: "14px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{file.fileName}</p>
                                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                                        {new Date(file.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className="material-symbols-outlined" style={{ color: "var(--text-caption)" }}>download</span>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
