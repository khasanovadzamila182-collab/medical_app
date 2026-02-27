import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    // ── JWT Auth ──
    const result = await requireAuth(req);
    if ("error" in result) return result.error;
    const { auth } = result;

    try {
        const { module, eventType, step } = await req.json();

        if (!module || !eventType) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Ownership: always use userId from JWT
        const event = await prisma.diagEvent.create({
            data: {
                userId: auth.userId,
                module,
                eventType,
                step: step || null,
            },
        });

        return NextResponse.json(event);
    } catch (error) {
        console.error("Event log error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    // ── JWT Auth + Admin check ──
    const result = await requireAuth(req);
    if ("error" in result) return result.error;
    const { auth } = result;

    if (!auth.isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const events = await prisma.diagEvent.groupBy({
            by: ["module", "eventType"],
            _count: { _all: true },
        });

        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
