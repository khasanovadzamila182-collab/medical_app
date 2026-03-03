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

        const notes = await prisma.note.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(notes);
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

        const { text, childId } = await req.json();

        if (!text || !childId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const note = await prisma.note.create({
            data: {
                text,
                childId: Number(childId),
                userId: decoded.userId
            }
        });

        return NextResponse.json(note);
    } catch (e) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
