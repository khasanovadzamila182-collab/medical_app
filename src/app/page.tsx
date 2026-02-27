"use client";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";

interface HistoryItem {
  id: number;
  module: string;
  step: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const {
    userId, userPhone, childName, childWeight, childAgeMonths,
    subStatus, isAdmin, loaded, login, langPref, setLangPref,
    lastDiagModule, clearLastDiag,
  } = useApp();
  const [phoneInput, setPhoneInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const L = langPref;

  // Try auto-login via Telegram
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
      tg.expand();
      const tgId = tg.initDataUnsafe?.user?.id;
      if (tgId && !userId) login(tgId);
    }
  }, [userId, login]);

  // Fetch history
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/events/history?userId=${userId}`)
      .then(r => r.ok ? r.json() : [])
      .then(setHistory)
      .catch(() => setHistory([]));
  }, [userId]);

  if (!loaded) return <div style={{ padding: "20px", textAlign: "center" }}>{t("Загрузка...", L)}</div>;

  const handleAuth = async () => {
    if (!phoneInput) return;
    setLoading(true);
    let tgId = Date.now();
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      tgId = (window as any).Telegram.WebApp.initDataUnsafe?.user?.id || tgId;
    }
    await login(tgId, phoneInput);
    setLoading(false);
  };

  const moduleRoutes: Record<string, string> = {
    "Температура": "/temp", "Кашель": "/lungs", "Глаза": "/eyes",
    "Уши": "/ears", "ЖКТ / Живот": "/stomach", "ЖКТ": "/stomach",
    "Насморк": "/nose", "Нос": "/nose",
    "Рот / Горло": "/mouth", "Боль в горле": "/mouth",
  };

  // ========== AUTH SCREEN ==========
  if (!userId) {
    return (
      <div className="page-body" style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "80vh" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "64px", color: "var(--primary)" }}>health_and_safety</span>
          <h1 style={{ marginTop: "16px", marginBottom: "8px" }}>Mama Expert</h1>
          <p className="section-sub">{t("Авторизуйтесь для доступа к диагностике", L)}</p>
        </div>

        <div className="card">
          <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>{t("Ваш телефон", L)}</label>
          <input
            type="tel"
            placeholder="+998 90 123 45 67"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "16px", fontSize: "16px" }}
          />
          <button
            onClick={handleAuth}
            disabled={loading || !phoneInput}
            style={{ width: "100%", padding: "14px", background: "var(--primary)", color: "white", borderRadius: "12px", border: "none", fontWeight: 600, fontSize: "16px" }}
          >
            {loading ? t("Вход...", L) : t("Войти", L)}
          </button>
        </div>

        {/* 3-Language selector */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
          <button onClick={() => setLangPref("ru")} style={{ background: L === "ru" ? "var(--primary)" : "transparent", color: L === "ru" ? "white" : "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "8px", padding: "6px 14px", fontSize: "13px", cursor: "pointer", fontWeight: 600 }}>🇷🇺 Русский</button>
          <button onClick={() => setLangPref("uz")} style={{ background: L === "uz" ? "var(--primary)" : "transparent", color: L === "uz" ? "white" : "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "8px", padding: "6px 14px", fontSize: "13px", cursor: "pointer", fontWeight: 600 }}>🇺🇿 O&apos;zbekcha</button>
          <button onClick={() => setLangPref("en")} style={{ background: L === "en" ? "var(--primary)" : "transparent", color: L === "en" ? "white" : "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "8px", padding: "6px 14px", fontSize: "13px", cursor: "pointer", fontWeight: 600 }}>🇺🇸 English</button>
        </div>
      </div>
    );
  }

  // ========== DASHBOARD ==========
  return (
    <>
      <div className="sticky-header">
        <div className="header-row">
          <span className="material-symbols-outlined" style={{ color: "var(--primary)", fontSize: "28px" }}>favorite</span>
          <h1 style={{ textAlign: "left", flex: 1 }}>{t("Здоровье малыша", L)}</h1>
          {/* Compact language toggle */}
          <div style={{ display: "flex", gap: "2px", borderRadius: "6px", border: "1px solid var(--border)", overflow: "hidden" }}>
            {(["ru", "uz", "en"] as const).map(l => (
              <button key={l} onClick={() => setLangPref(l)} style={{
                padding: "3px 8px", fontSize: "11px", fontWeight: 700, cursor: "pointer",
                background: L === l ? "var(--primary)" : "transparent",
                color: L === l ? "white" : "var(--text-secondary)",
                border: "none",
              }}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="page-body">
        {/* ═══ SESSION RESUME BANNER ═══ */}
        {lastDiagModule && (
          <div className="card" style={{ background: "linear-gradient(135deg,#fff7ed 0%,#fef3c7 100%)", border: "2px solid #f59e0b", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "#f59e0b" }}>play_circle</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: "14px" }}>{t("Продолжить диагностику", L)}</p>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{lastDiagModule}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <Link href={moduleRoutes[lastDiagModule] || "/diagnostics"} className="btn-primary" style={{ flex: 1, textAlign: "center", fontSize: "13px", padding: "8px" }}>
                ▶ {t("Продолжить диагностику", L)}
              </Link>
              <button onClick={clearLastDiag} className="btn-outline" style={{ flex: 0, fontSize: "13px", padding: "8px 12px", whiteSpace: "nowrap" }}>
                ✕ {t("Начать заново", L)}
              </button>
            </div>
          </div>
        )}

        {/* ═══ 1. МОИ ДЕТИ ═══ */}
        <div>
          <h2 className="section-heading" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--primary)" }}>child_care</span>
            {t("Мои дети", L)}
          </h2>
        </div>
        <Link href="/profile" style={{ textDecoration: "none" }}>
          <div className="card" style={{ display: "flex", alignItems: "center", gap: "16px", background: "linear-gradient(135deg,#3bd8c6 0%,#2ec4b6 100%)", color: "white", border: "none" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>👶</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: "18px" }}>{childName || (L === "ru" ? "Имя не указано" : L === "uz" ? "Ism ko'rsatilmagan" : "Name not set")}</p>
              <p style={{ fontSize: "13px", opacity: 0.9, marginTop: "4px" }}>
                {L === "en" ? "Weight" : L === "uz" ? "Vazn" : "Вес"}: {childWeight ? `${childWeight} ${L === "en" ? "kg" : "кг"}` : (L === "ru" ? "Не указан" : L === "uz" ? "Ko'rsatilmagan" : "Not set")}
                {" • "}
                {L === "en" ? "Age" : L === "uz" ? "Yosh" : "Возраст"}: {childAgeMonths ? `${childAgeMonths} ${L === "en" ? "mo." : L === "uz" ? "oy" : "мес."}` : (L === "ru" ? "Не указан" : L === "uz" ? "Ko'rsatilmagan" : "Not set")}
              </p>
            </div>
            <span className="material-symbols-outlined">edit</span>
          </div>
        </Link>
        {(!childWeight || !childAgeMonths) && (
          <div style={{ padding: "12px", background: "#fef2f2", color: "#b91c1c", borderRadius: "12px", fontSize: "13px", marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>warning</span>
            {t("Укажите вес ребёнка в профиле для точного расчёта дозировок.", L)}
          </div>
        )}
        <div style={{ textAlign: "right", marginTop: "4px" }}>
          <Link href="/profile" style={{ fontSize: "12px", color: "var(--primary)", textDecoration: "none" }}>{t("Обновить вес", L)}</Link>
        </div>

        {/* ═══ 2. ДИАГНОСТИКА ═══ */}
        <div style={{ marginTop: "24px" }}>
          <h2 className="section-heading" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--accent)" }}>stethoscope</span>
            {t("Диагностика", L)}
          </h2>
        </div>
        <div className="grid-2">
          <Link href="/diagnostics" className="card card-clickable" style={{ textAlign: "center", padding: "20px 12px", textDecoration: "none", color: "inherit" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
              <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>stethoscope</span>
            </div>
            <p style={{ fontWeight: 600, fontSize: "13px" }}>{t("Диагностика", L)}</p>
            {!subStatus && <p style={{ fontSize: "11px", color: "#d97706", marginTop: "4px" }}>🔒 {L === "en" ? "SOS only" : L === "uz" ? "Faqat SOS" : "Только SOS"}</p>}
          </Link>
          <Link href="/dosage" className="card card-clickable" style={{ textAlign: "center", padding: "20px 12px", textDecoration: "none", color: "inherit" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
              <span className="material-symbols-outlined" style={{ color: "#22c55e" }}>calculate</span>
            </div>
            <p style={{ fontWeight: 600, fontSize: "13px" }}>{t("Дозировки", L)}</p>
          </Link>
          <Link href="/reminders" className="card card-clickable" style={{ textAlign: "center", padding: "20px 12px", textDecoration: "none", color: "inherit" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
              <span className="material-symbols-outlined" style={{ color: "var(--accent)" }}>alarm</span>
            </div>
            <p style={{ fontWeight: 600, fontSize: "13px" }}>{t("Напоминания", L)}</p>
          </Link>
          <Link href="/inhalation" className="card card-clickable" style={{ textAlign: "center", padding: "20px 12px", textDecoration: "none", color: "inherit" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
              <span className="material-symbols-outlined" style={{ color: "#8b5cf6" }}>timer</span>
            </div>
            <p style={{ fontWeight: 600, fontSize: "13px" }}>{t("Ингаляции", L)}</p>
          </Link>
        </div>

        {/* ═══ 3. ИСТОРИЯ ═══ */}
        <div style={{ marginTop: "24px" }}>
          <h2 className="section-heading" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#8b5cf6" }}>history</span>
            {t("История", L)}
          </h2>
          <p className="section-sub">{t("Последние рекомендации", L)}</p>
        </div>
        <div className="card" style={{ padding: "0" }}>
          {history.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)", fontSize: "13px" }}>
              {t("Рекомендаций пока нет", L)}
            </div>
          ) : (
            history.map((h, i) => (
              <div key={h.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderBottom: i < history.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--primary)" }}>check_circle</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: "14px" }}>{h.module}</p>
                  <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{new Date(h.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ═══ 4. ПОМОЩЬ ═══ */}
        <div style={{ marginTop: "24px" }}>
          <h2 className="section-heading" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#ef4444" }}>support_agent</span>
            {t("Помощь", L)}
          </h2>
        </div>
        <a href="https://t.me/mama_expert_support" target="_blank" rel="noopener noreferrer" className="card card-clickable" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", color: "inherit" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ color: "#3b82f6" }}>chat</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: "14px" }}>{t("Связь с поддержкой", L)}</p>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{t("Telegram Support", L)}</p>
          </div>
          <span className="material-symbols-outlined" style={{ color: "var(--text-caption)" }}>chevron_right</span>
        </a>

        {isAdmin && (
          <Link href="/admin" style={{ display: "block", textAlign: "center", marginTop: "24px", fontSize: "12px", color: "var(--text-caption)", textDecoration: "none" }}>
            ⚙️ {t("Админ-панель", L)}
          </Link>
        )}
      </div>
    </>
  );
}
