import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const users = await prisma.user.findMany({
            include: { children: true },
            orderBy: { lastActive: "desc" },
        });

        // Formatting for admin table
        const formatted = users.map(u => ({
            id: u.id,
            tgId: u.tgId.toString(),
            phone: u.phone,
            subStatus: u.subStatus,
            lastActive: u.lastActive,
            createdAt: u.createdAt,
            childrenCount: u.children.length,
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
