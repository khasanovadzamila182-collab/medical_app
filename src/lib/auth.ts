/**
 * Telegram Mini App Authentication
 *
 * 1. validateTelegramInitData()  — HMAC-SHA256 verification per Telegram docs
 * 2. signJWT() / verifyJWT()     — short-lived tokens (24 h)
 * 3. requireAuth(req)            — middleware for protected API routes
 */

import { SignJWT, jwtVerify } from "jose";

// ────────────────── Types ──────────────────

export interface TelegramUser {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    photo_url?: string;
}

export interface JWTPayload {
    /** Internal DB user id */
    userId: number;
    /** Telegram user id */
    tgId: number;
    /** Admin flag */
    isAdmin: boolean;
}

// ────────────────── Telegram initData Validation ──────────────────

/**
 * Validates Telegram WebApp initData using HMAC-SHA256.
 * Returns the parsed user data if valid, null otherwise.
 *
 * Algorithm (from https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app):
 * 1. Parse initData as URL-encoded query string
 * 2. Extract `hash` param, sort remaining params alphabetically
 * 3. Build data-check-string: "key=value\nkey=value\n..."
 * 4. secret_key = HMAC-SHA256("WebAppData", bot_token)
 * 5. Verify HMAC-SHA256(secret_key, data_check_string) === hash
 */
export async function validateTelegramInitData(
    initData: string,
    botToken: string
): Promise<TelegramUser | null> {
    try {
        const params = new URLSearchParams(initData);
        const hash = params.get("hash");
        if (!hash) return null;

        // Build data-check-string (sorted, without hash)
        const entries: [string, string][] = [];
        params.forEach((value, key) => {
            if (key !== "hash") entries.push([key, value]);
        });
        entries.sort(([a], [b]) => a.localeCompare(b));
        const dataCheckString = entries.map(([k, v]) => `${k}=${v}`).join("\n");

        // secret_key = HMAC-SHA256("WebAppData", bot_token)
        const encoder = new TextEncoder();
        const secretKey = await crypto.subtle.importKey(
            "raw",
            encoder.encode("WebAppData"),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );
        const secretBuf = await crypto.subtle.sign(
            "HMAC",
            secretKey,
            encoder.encode(botToken)
        );

        // computed_hash = HMAC-SHA256(secret_key, data_check_string)
        const dataKey = await crypto.subtle.importKey(
            "raw",
            secretBuf,
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );
        const dataBuf = await crypto.subtle.sign(
            "HMAC",
            dataKey,
            encoder.encode(dataCheckString)
        );

        // Compare hex hashes
        const computedHash = Array.from(new Uint8Array(dataBuf))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

        if (computedHash !== hash) return null;

        // Check auth_date is not too old (allow 24 hours)
        const authDate = params.get("auth_date");
        if (authDate) {
            const ageSeconds = Math.floor(Date.now() / 1000) - Number(authDate);
            if (ageSeconds > 86400) return null; // expired
        }

        // Parse user object
        const userStr = params.get("user");
        if (!userStr) return null;

        return JSON.parse(userStr) as TelegramUser;
    } catch (e) {
        console.error("initData validation error:", e);
        return null;
    }
}

// ────────────────── JWT ──────────────────

function getJWTSecret(): Uint8Array {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not set in .env");
    return new TextEncoder().encode(secret);
}

/** Sign a JWT with 24-hour expiry */
export async function signJWT(payload: JWTPayload): Promise<string> {
    return new SignJWT({ ...payload } as unknown as Record<string, unknown>)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(getJWTSecret());
}

/** Verify and decode a JWT. Returns payload or null if invalid/expired. */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, getJWTSecret());
        return {
            userId: payload.userId as number,
            tgId: payload.tgId as number,
            isAdmin: payload.isAdmin as boolean,
        };
    } catch {
        return null;
    }
}

// ────────────────── Middleware ──────────────────

/**
 * Extract and verify JWT from Authorization header.
 * Returns the authenticated user payload, or a NextResponse 401 error.
 */
export async function requireAuth(
    req: Request
): Promise<{ auth: JWTPayload } | { error: Response }> {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        const { NextResponse } = await import("next/server");
        return {
            error: NextResponse.json(
                { error: "Missing or invalid Authorization header" },
                { status: 401 }
            ),
        };
    }

    const token = authHeader.slice(7);
    const payload = await verifyJWT(token);

    if (!payload) {
        const { NextResponse } = await import("next/server");
        return {
            error: NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 401 }
            ),
        };
    }

    return { auth: payload };
}
