"use client";
import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { Lang } from "@/lib/i18n";

interface AppState {
    userId: number | null;
    userPhone: string;
    subStatus: boolean;
    isAdmin: boolean;
    childName: string;
    childWeight: number;
    childAgeMonths: number;
    currentDiagnostic: string;
    lastDiagModule: string;
    lastDiagStep: string;
    langPref: Lang;
    loaded: boolean;
}

interface AppContextValue extends AppState {
    setChildWeight: (w: number) => void;
    setChildAgeMonths: (a: number) => void;
    setChildName: (n: string) => void;
    setCurrentDiagnostic: (d: string) => void;
    setLastDiagPosition: (module: string, step: string) => void;
    clearLastDiag: () => void;
    setLangPref: (l: Lang) => void;
    login: (initData: string, phone?: string) => Promise<void>;
    saveProfile: () => Promise<void>;
    logEvent: (module: string, eventType: string, step?: string) => Promise<void>;
    needsWeight: () => boolean;
    isAuthenticated: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be inside AppProvider");
    return ctx;
}

const LS_KEY = "mama_expert_state";
const TOKEN_KEY = "mama_expert_token";

function loadFromLS(): Partial<AppState> {
    if (typeof window === "undefined") return {};
    try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
}

function saveToLS(s: Partial<AppState>) {
    if (typeof window === "undefined") return;
    try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch { }
}

/** Get stored JWT token */
function getToken(): string | null {
    if (typeof window === "undefined") return null;
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

/** Store JWT token */
function setToken(token: string | null) {
    if (typeof window === "undefined") return;
    try {
        if (token) localStorage.setItem(TOKEN_KEY, token);
        else localStorage.removeItem(TOKEN_KEY);
    } catch { }
}

/** Fetch wrapper that attaches JWT Authorization header */
async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = getToken();
    const headers = new Headers(options.headers || {});
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (!headers.has("Content-Type") && options.method && options.method !== "GET") {
        headers.set("Content-Type", "application/json");
    }
    return fetch(url, { ...options, headers });
}

export function AppProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AppState>({
        userId: null,
        userPhone: "",
        subStatus: false,
        isAdmin: false,
        childName: "",
        childWeight: 0,
        childAgeMonths: 0,
        currentDiagnostic: "",
        lastDiagModule: "",
        lastDiagStep: "",
        langPref: "ru",
        loaded: false,
    });

    const tokenRef = useRef<string | null>(null);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = loadFromLS();
        tokenRef.current = getToken();
        setState(prev => ({ ...prev, ...saved, loaded: true }));
    }, []);

    // Persist to localStorage on state change
    useEffect(() => {
        if (!state.loaded) return;
        const { loaded, ...rest } = state;
        saveToLS(rest);
    }, [state]);

    /**
     * Login: send Telegram initData to /api/auth for validation + JWT.
     * In dev mode without Telegram, can send a raw tgId as initData.
     */
    const login = useCallback(async (initData: string, phone?: string) => {
        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ initData, phone }),
            });

            if (res.ok) {
                const data = await res.json();

                // Store JWT
                const jwt = data.token;
                setToken(jwt);
                tokenRef.current = jwt;

                setState(prev => ({
                    ...prev,
                    userId: data.user.id,
                    userPhone: data.user.phone || phone || "",
                    subStatus: data.user.subStatus,
                    isAdmin: data.user.isAdmin,
                    childName: data.child?.name || prev.childName,
                    childWeight: data.child?.weight || prev.childWeight,
                    childAgeMonths: data.child?.ageMonths || prev.childAgeMonths,
                }));
            } else {
                const err = await res.json().catch(() => ({}));
                console.warn("Auth failed:", res.status, err);

                // Dev fallback: if in development and no token, use raw tgId
                if (process.env.NODE_ENV === "development") {
                    console.warn("DEV: using fallback auth");
                    const tgId = Number(initData) || Date.now();
                    setState(prev => ({
                        ...prev,
                        userId: tgId,
                        userPhone: phone || "",
                    }));
                }
            }
        } catch (e) {
            console.warn("Auth API unreachable:", e);
            if (process.env.NODE_ENV === "development") {
                const tgId = Number(initData) || Date.now();
                setState(prev => ({
                    ...prev,
                    userId: tgId,
                    userPhone: phone || "",
                }));
            }
        }
    }, []);

    const saveProfile = useCallback(async () => {
        if (!state.userId) return;
        try {
            await authFetch("/api/profile", {
                method: "PUT",
                body: JSON.stringify({
                    childName: state.childName,
                    childWeight: state.childWeight,
                    childAgeMonths: state.childAgeMonths,
                }),
            });
        } catch (e) {
            console.error("Save profile error:", e);
        }
    }, [state.userId, state.childName, state.childWeight, state.childAgeMonths]);

    const logEvent = useCallback(async (module: string, eventType: string, step?: string) => {
        if (!state.userId) return;
        try {
            const res = await authFetch("/api/events", {
                method: "POST",
                body: JSON.stringify({ module, eventType, step }),
            });

            // If 401, try to re-authenticate silently via Telegram SDK
            if (res.status === 401) {
                await tryAutoRefresh();
            }
        } catch (e) {
            console.error("Event log error:", e);
        }
    }, [state.userId]);

    /** Auto-refresh: re-authenticate via Telegram SDK if token expired */
    const tryAutoRefresh = useCallback(async () => {
        if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
            const tg = (window as any).Telegram.WebApp;
            const newInitData = tg.initData;
            if (newInitData) {
                console.log("Auto-refreshing JWT via Telegram SDK...");
                await login(newInitData);
            }
        }
    }, [login]);

    const isAuthenticated = !!state.userId && !!getToken();

    const value: AppContextValue = {
        ...state,
        setChildWeight: (w) => setState(p => ({ ...p, childWeight: w })),
        setChildAgeMonths: (a) => setState(p => ({ ...p, childAgeMonths: a })),
        setChildName: (n) => setState(p => ({ ...p, childName: n })),
        setCurrentDiagnostic: (d) => setState(p => ({ ...p, currentDiagnostic: d })),
        setLastDiagPosition: (module, step) => setState(p => ({ ...p, lastDiagModule: module, lastDiagStep: step })),
        clearLastDiag: () => setState(p => ({ ...p, lastDiagModule: "", lastDiagStep: "" })),
        setLangPref: (l) => setState(p => ({ ...p, langPref: l })),
        login,
        saveProfile,
        logEvent,
        needsWeight: () => !state.childWeight || state.childWeight <= 0,
        isAuthenticated,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
