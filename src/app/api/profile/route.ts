import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(req: Request) {
    // ── JWT Auth ──
    const result = await requireAuth(req);
    if ("error" in result) return result.error;
    const { auth } = result;

    try {
        const { childName, childWeight, childAgeMonths } = await req.json();

        // Ownership: only modify own children
        const child = await prisma.child.findFirst({
            where: { userId: auth.userId },
        });

        let updatedChild;
        if (child) {
            updatedChild = await prisma.child.update({
                where: { id: child.id },
                data: {
                    name: childName || child.name,
                    weight: childWeight || child.weight,
                    ageMonths: childAgeMonths || child.ageMonths,
                },
            });
        } else {
            updatedChild = await prisma.child.create({
                data: {
                    userId: auth.userId,
                    name: childName || "Ребёнок",
                    weight: childWeight || 0,
                    ageMonths: childAgeMonths || 0,
                },
            });
        }

        return NextResponse.json(updatedChild);
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    // ── JWT Auth ──
    const result = await requireAuth(req);
    if ("error" in result) return result.error;
    const { auth } = result;

    try {
        const user = await prisma.user.findUnique({
            where: { id: auth.userId },
            include: { children: true },
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({
            subStatus: user.subStatus,
            isAdmin: user.isAdmin,
            child: user.children[0] || null,
        });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
