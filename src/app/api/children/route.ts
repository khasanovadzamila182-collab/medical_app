import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded = await verifyJWT(token);
        if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: { children: true },
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({ children: user.children, selectedChildId: user.selectedChildId });
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

        const body = await req.json();
        const { name, weight, ageMonths } = body;

        const child = await prisma.child.create({
            data: {
                name,
                weight: Number(weight),
                ageMonths: Number(ageMonths),
                userId: decoded.userId,
            },
        });

        return NextResponse.json({ child });
    } catch (e) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
