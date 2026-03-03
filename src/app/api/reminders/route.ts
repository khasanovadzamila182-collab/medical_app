import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded = await verifyJWT(token);
        if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

        const url = new URL(req.url);
        const childId = url.searchParams.get("childId");

        const whereClause: any = { userId: decoded.userId };
        if (childId) whereClause.childId = Number(childId);

        const reminders = await prisma.reminder.findMany({
            where: whereClause,
            orderBy: { nextAt: "asc" }
        });

        return NextResponse.json(reminders);
    } catch (e) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded = await verifyJWT(token);
        if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

        const { title, intervalHours, childId, type } = await req.json();

        if (!title || !intervalHours || !childId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const nextAt = new Date();
        nextAt.setHours(nextAt.getHours() + Number(intervalHours));

        const reminder = await prisma.reminder.create({
            data: {
                title,
                intervalHours: Number(intervalHours),
                type: type || "medication",
                childId: Number(childId),
                userId: decoded.userId,
                nextAt,
                active: true
            }
        });

        return NextResponse.json(reminder);
    } catch (e) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded = await verifyJWT(token);
        if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

        const { id, active } = await req.json();

        const reminder = await prisma.reminder.update({
            where: { id: Number(id), userId: decoded.userId },
            data: { active }
        });

        return NextResponse.json(reminder);
    } catch (e) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
