import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateTelegramInitData, signJWT } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Generate a deterministic tgId from a phone number.
 * Uses negative range to avoid collisions with real Telegram IDs.
 */
function phoneToTgId(phone: string): bigint {
    const digits = phone.replace(/\D/g, "");
    // Use last 9 digits, negate to avoid collision with real Telegram IDs
    const num = BigInt(digits.slice(-9)) + BigInt(9_000_000_000);
    return -num; // negative range = phone-only users
}

/** Check if a phone number is in the ADMIN_PHONES list */
function isAdminPhone(phone: string): boolean {
    const adminPhones = process.env.ADMIN_PHONES || "";
    if (!adminPhones) return false;
    const normalized = phone.replace(/\D/g, "");
    return adminPhones.split(",").some((p) => {
        const norm = p.trim().replace(/\D/g, "");
        return norm && normalized.endsWith(norm);
    });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { initData, phone } = body;

        const botToken = process.env.BOT_TOKEN;

        // ── Path 1: Telegram initData validation ──
        let tgId: bigint | null = null;
        let tgUser: { id: number; first_name?: string; username?: string } | null = null;
        let isTelegramAuth = false;

        if (initData && botToken) {
            tgUser = await validateTelegramInitData(initData, botToken);
            if (tgUser) {
                tgId = BigInt(tgUser.id);
                isTelegramAuth = true;
            }
        }

        // ── Path 2: Phone-only login (no valid Telegram initData) ──
        if (!isTelegramAuth) {
            if (!phone) {
                return NextResponse.json(
                    { error: "Phone number is required" },
                    { status: 400 }
                );
            }

            const normalizedPhone = phone.replace(/\D/g, "");
            if (normalizedPhone.length < 9) {
                return NextResponse.json(
                    { error: "Invalid phone number" },
                    { status: 400 }
                );
            }

            // Check if a user with this phone already exists
            const existingUser = await prisma.user.findFirst({
                where: { phone: { contains: normalizedPhone.slice(-9) } },
                include: { children: true },
            });

            if (existingUser) {
                // Update lastActive + check admin + open access
                const shouldBeAdmin = isAdminPhone(phone) || existingUser.isAdmin;
                const user = await prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        lastActive: new Date(),
                    subStatus: true,
                         // Auto open access
                        ...(shouldBeAdmin && !existingUser.isAdmin ? { isAdmin: true } : {}),
                    },
                    include: { children: true },
                });

                const token = await signJWT({
                    userId: user.id,
                    tgId: Number(user.tgId),
                    isAdmin: user.isAdmin,
                });

                return NextResponse.json({
                    token,
                    user: {
                        id: user.id,
                        tgId: user.tgId.toString(),
                        phone: user.phone,
                        subStatus: user.subStatus,
                        isAdmin: user.isAdmin,
                    },
                    children: user.children,
            selectedChildId: user.selectedChildId,
                });
            }

            // New phone user — generate a synthetic tgId
            tgId = phoneToTgId(phone);
        }

        if (tgId === null) {
            return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
        }

        // ── Upsert User ──
        let user = await prisma.user.findUnique({
            where: { tgId },
            include: { children: true },
        });

        const shouldBeAdmin = phone ? isAdminPhone(phone) : false;

        if (!user) {
            user = await prisma.user.create({
                data: {
                    tgId,
                    phone: phone || null,
                    isAdmin: shouldBeAdmin,
                    subStatus: true,
                },
                include: { children: true },
            });
        } else {
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    lastActive: new Date(),
                    subStatus: true,
                    
                    ...(phone && !user.phone ? { phone } : {}),
                    ...(shouldBeAdmin && !user.isAdmin ? { isAdmin: true } : {}),
                },
                include: { children: true },
            });
        }

        // ── Issue JWT ──
        const token = await signJWT({
            userId: user.id,
            tgId: Number(user.tgId),
            isAdmin: user.isAdmin,
        });

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                tgId: user.tgId.toString(),
                phone: user.phone,
                subStatus: user.subStatus,
                isAdmin: user.isAdmin,
            },
            children: user.children,
            selectedChildId: user.selectedChildId,
        });
    } catch (error) {
        console.error("Auth error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
