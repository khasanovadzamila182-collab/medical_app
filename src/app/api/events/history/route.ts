import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/events/history — last 5 completed diagnostics for authenticated user
export async function GET(req: Request) {
    // ── JWT Auth ──
    const result = await requireAuth(req);
    if ("error" in result) return result.error;
    const { auth } = result;

    try {
        // Ownership: query only the authenticated user's events
        const events = await prisma.diagEvent.findMany({
            where: {
                userId: auth.userId,
                eventType: "end",
            },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
                id: true,
                module: true,
                step: true,
                createdAt: true,
            },
        });

        return NextResponse.json(events);
    } catch (error) {
        console.error("History fetch error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
