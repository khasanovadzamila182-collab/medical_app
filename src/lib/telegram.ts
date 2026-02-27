// Telegram WebApp SDK helpers
// These run client-side only

export function getTelegramWebApp() {
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
        return (window as any).Telegram.WebApp;
    }
    return null;
}

export function getTelegramUser() {
    const wa = getTelegramWebApp();
    return wa?.initDataUnsafe?.user || null;
}

export function closeTelegramWebApp() {
    const wa = getTelegramWebApp();
    wa?.close();
}

export function expandWebApp() {
    const wa = getTelegramWebApp();
    wa?.expand();
}

export function hapticFeedback(type: "impact" | "notification" | "selection" = "impact") {
    const wa = getTelegramWebApp();
    if (wa?.HapticFeedback) {
        if (type === "impact") wa.HapticFeedback.impactOccurred("medium");
        else if (type === "notification") wa.HapticFeedback.notificationOccurred("success");
        else wa.HapticFeedback.selectionChanged();
    }
}
