
"use client";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";

export default function ProfilePage() {
    const router = useRouter();
    const { childrenInfo, selectedChildId, selectChild, subStatus, saveProfile, langPref } = useApp() as any;
    const L = langPref;
    const [childrenData, setChildrenData] = useState<any[]>(childrenInfo || []);

    useEffect(() => {
        setChildrenData(childrenInfo || []);
    }, [childrenInfo]);

    return (
        <>
            <div className="sticky-header">
                <div className="header-row">
                    <button className="back-btn" onClick={() => router.back()} style={{ background: "none", border: "none" }}><span className="material-symbols-outlined">arrow_back</span></button>
                    <h1>{t("Мои дети", L)}</h1>
                    <span />
                </div>
            </div>

            <div className="page-body">
                {childrenData.map((child, index) => {
                    const isSelected = child.id === selectedChildId;
                    return (
                        <div
                            key={index}
                            className={`card ${isSelected ? 'selected-card' : ''}`}
                            style={{
                                marginBottom: "16px",
                                cursor: "pointer",
                                border: isSelected ? "2px solid var(--primary)" : "none",
                                background: isSelected ? "var(--primary-light)" : "white",
                                display: "flex", alignItems: "center", justifyContent: "space-between"
                            }}
                            onClick={() => {
                                if (selectChild) selectChild(child.id);
                            }}
                        >
                            <div>
                                <p className="title">{child.name}</p>
                                <p className="subtitle">{child.weight} кг • {child.ageMonths} мес.</p>
                            </div>
                            {isSelected && (
                                <span className="material-symbols-outlined" style={{ color: "var(--primary)", fontSize: "28px" }}>
                                    check_circle
                                </span>
                            )}
                        </div>
                    );
                })}

                <button onClick={() => router.push('/profile/new')} className="card card-clickable" style={{ width: "100%", padding: "16px", background: "var(--primary-light)", color: "var(--primary)", border: "dashed 2px var(--primary)", display: "flex", justifyContent: "center" }}>
                    + {t("Добавить ребёнка", L)}
                </button>
            </div>
        </>
    );
}
