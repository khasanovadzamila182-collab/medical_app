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

        const files = await prisma.analysisFile.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(files);
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

        const { fileName, fileUrl, childId } = await req.json();

        if (!fileName || !fileUrl || !childId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const file = await prisma.analysisFile.create({
            data: {
                fileName,
                fileUrl,
                childId: Number(childId),
                userId: decoded.userId
            }
        });

        return NextResponse.json(file);
    } catch (e) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
