"use client";
import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { Lang } from "@/lib/i18n";

interface AppState {
    userId: number | null;
    userPhone: string;
    subStatus: boolean;
    isAdmin: boolean;
    childrenInfo: any[];
    selectedChildId: number | null;
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
    setChildrenInfo: (c: any[]) => void;
    selectChild: (id: number) => Promise<void>;
    setSelectedChildId: (id: number) => void;
    setChildWeight: (w: number) => void;
    setChildAgeMonths: (a: number) => void;
    setChildName: (n: string) => void;
    setCurrentDiagnostic: (d: string) => void;
    setLastDiagPosition: (module: string, step: string) => void;
    clearLastDiag: () => void;
    setLangPref: (l: Lang) => void;
    login: (initData?: string, phone?: string) => Promise<{ ok: boolean, error?: string }>;
    fetchProfile: () => Promise<void>;
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
        childrenInfo: [],
        selectedChildId: null,
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

    const fetchProfile = useCallback(async () => {
        try {
            const res = await authFetch("/api/profile");
            if (res.ok) {
                const data = await res.json();

                let activeId = data.selectedChildId !== undefined ? data.selectedChildId : null;
                const children = data.childrenInfo || [];

                setState(prev => {
                    const nextState = {
                        ...prev,
                        subStatus: data.subStatus,
                        isAdmin: data.isAdmin,
                        childrenInfo: children,
                        selectedChildId: activeId,
                    };

                    // Auto-select first child if none selected but children exist
                    if (!activeId && children.length > 0) {
                        activeId = children[0].id;
                        nextState.selectedChildId = activeId;
                        nextState.childName = children[0].name;
                        nextState.childWeight = children[0].weight;
                        nextState.childAgeMonths = children[0].ageMonths;

                        // Fire-and-forget update to backend
                        authFetch("/api/profile", {
                            method: "PUT",
                            body: JSON.stringify({ selectedChildId: activeId })
                        }).catch(() => { });
                    } else if (activeId && children.length > 0) {
                        const activeChild = children.find((c: any) => c.id === activeId);
                        if (activeChild) {
                            nextState.childName = activeChild.name;
                            nextState.childWeight = activeChild.weight;
                            nextState.childAgeMonths = activeChild.ageMonths;
                        }
                    }
                    return nextState;
                });
            }
        } catch (e) { console.error("fetchProfile failed", e); }
    }, []);

    const login = useCallback(async (initData?: string, phone?: string) => {
        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ initData: initData || undefined, phone: phone || undefined }),
            });

            if (res.ok) {
                const data = await res.json();

                const jwt = data.token;
                setToken(jwt);
                tokenRef.current = jwt;

                let activeId = data.selectedChildId !== undefined ? data.selectedChildId : null;
                const children = data.children || [];

                setState(prev => {
                    const nextState = {
                        ...prev,
                        userId: data.user.id,
                        userPhone: data.user.phone || phone || "",
                        subStatus: data.user.subStatus,
                        isAdmin: data.user.isAdmin,
                        childrenInfo: children,
                        selectedChildId: activeId,
                        childName: prev.childName,
                        childWeight: prev.childWeight,
                        childAgeMonths: prev.childAgeMonths,
                    };

                    if (!activeId && children.length > 0) {
                        activeId = children[0].id;
                        nextState.selectedChildId = activeId;
                        nextState.childName = children[0].name;
                        nextState.childWeight = children[0].weight;
                        nextState.childAgeMonths = children[0].ageMonths;

                        authFetch("/api/profile", {
                            method: "PUT",
                            body: JSON.stringify({ selectedChildId: activeId })
                        }).catch(() => { });
                    } else if (activeId && children.length > 0) {
                        const activeChild = children.find((c: any) => c.id === activeId);
                        if (activeChild) {
                            nextState.childName = activeChild.name;
                            nextState.childWeight = activeChild.weight;
                            nextState.childAgeMonths = activeChild.ageMonths;
                        }
                    } else if (children.length > 0 && !activeId && !prev.childName) {
                        nextState.childName = children[0].name;
                        nextState.childWeight = children[0].weight;
                        nextState.childAgeMonths = children[0].ageMonths;
                    }
                    return nextState;
                });

                return { ok: true };
            } else {
                const err = await res.json().catch(() => ({}));
                console.warn("Auth failed:", res.status, err);
                return { ok: false, error: err.error || "Ошибка авторизации" };
            }
        } catch (e: any) {
            console.warn("Auth API unreachable:", e);
            return { ok: false, error: e.message || "Network error" };
        }
    }, []);

    const selectChild = useCallback(async (childId: number) => {
        const child = state.childrenInfo.find(c => c.id === childId);
        if (!child) return;

        setState(prev => ({
            ...prev,
            selectedChildId: childId,
            childName: child.name,
            childWeight: child.weight,
            childAgeMonths: child.ageMonths,
        }));

        if (state.userId) {
            try {
                await authFetch("/api/profile", {
                    method: "PUT",
                    body: JSON.stringify({ selectedChildId: childId }),
                });
            } catch (e) { console.error("Save selectedChildId error", e); }
        }
    }, [state.childrenInfo, state.userId]);

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
        setChildrenInfo: (c: any[]) => setState(p => ({ ...p, childrenInfo: c })),
        selectChild,
        setSelectedChildId: (id: number) => setState(p => ({ ...p, selectedChildId: id, childWeight: p.childrenInfo.find(c => c.id === id)?.weight || 0 })),
        setChildAgeMonths: (a) => setState(p => ({ ...p, childAgeMonths: a })),
        setChildName: (n) => setState(p => ({ ...p, childName: n })),
        setCurrentDiagnostic: (d) => setState(p => ({ ...p, currentDiagnostic: d })),
        setLastDiagPosition: (module, step) => setState(p => ({ ...p, lastDiagModule: module, lastDiagStep: step })),
        clearLastDiag: () => setState(p => ({ ...p, lastDiagModule: "", lastDiagStep: "" })),
        setLangPref: (l) => setState(p => ({ ...p, langPref: l })),
        fetchProfile,
        login,
        saveProfile,
        logEvent,
        needsWeight: () => !state.selectedChildId,
        isAuthenticated,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
