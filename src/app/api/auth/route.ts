import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateTelegramInitData, signJWT } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { initData, phone } = body;

        if (!initData) {
            return NextResponse.json({ error: "No initData provided" }, { status: 400 });
        }

        const botToken = process.env.BOT_TOKEN;

        // ── Validate Telegram initData ──
        let tgId: number;
        let tgUser: { id: number; first_name?: string; username?: string } | null = null;

        if (botToken) {
            tgUser = await validateTelegramInitData(initData, botToken);
            if (!tgUser) {
                return NextResponse.json({ error: "Invalid initData" }, { status: 401 });
            }
            tgId = tgUser.id;
        } else if (process.env.NODE_ENV === "development") {
            // Dev mode: allow bypass when BOT_TOKEN is not set
            // Parse tgId from initData (which may be a raw tgId in dev mode)
            try {
                const parsed = JSON.parse(initData);
                tgId = parsed.tgId || parsed.id || Number(initData);
            } catch {
                tgId = Number(initData);
            }
            if (!tgId || isNaN(tgId)) {
                return NextResponse.json({ error: "Invalid dev initData" }, { status: 400 });
            }
            console.warn("⚠️ DEV MODE: skipping initData validation (BOT_TOKEN not set)");
        } else {
            return NextResponse.json(
                { error: "BOT_TOKEN not configured" },
                { status: 500 }
            );
        }

        // ── Upsert User ──
        let user = await prisma.user.findUnique({
            where: { tgId: BigInt(tgId) },
            include: { children: true },
        });

        if (!user) {
            // First-time user → create
            user = await prisma.user.create({
                data: {
                    tgId: BigInt(tgId),
                    phone: phone || null,
                },
                include: { children: true },
            });
        } else {
            // Returning user → update lastActive + phone if missing
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    lastActive: new Date(),
                    ...(phone && !user.phone ? { phone } : {}),
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

        // Convert BigInt for JSON serialization
        const serializedUser = {
            id: user.id,
            tgId: user.tgId.toString(),
            phone: user.phone,
            subStatus: user.subStatus,
            isAdmin: user.isAdmin,
        };

        return NextResponse.json({
            token,
            user: serializedUser,
            child: user.children[0] || null,
        });
    } catch (error) {
        console.error("Auth error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
