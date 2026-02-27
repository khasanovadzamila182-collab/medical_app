"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
    { href: "/", icon: "home", label: "Главная" },
    { href: "/appointments", icon: "calendar_month", label: "Запись" },
    { href: "/medcard", icon: "medical_information", label: "Медкарта" },
    { href: "/diagnostics", icon: "stethoscope", label: "Диагностика" },
    { href: "/history", icon: "history", label: "История" },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <div className="bottom-nav">
            {tabs.map(t => {
                const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
                return (
                    <Link key={t.href} href={t.href} className={`nav-item${active ? " active" : ""}`}>
                        <span className="material-symbols-outlined">{t.icon}</span>
                        <span>{t.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
