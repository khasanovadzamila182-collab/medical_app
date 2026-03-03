const fs = require('fs');

const path = 'src/app/api/profile/route.ts';
let txt = fs.readFileSync(path, 'utf8');

// The file exposes PUT method modifying profile. Replace to handle selectedChildId properly.
fs.writeFileSync(path, `import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(req: Request) {
    const result = await requireAuth(req);
    if ("error" in result) return result.error;
    const { auth } = result;

    try {
        const body = await req.json();
        
        // Handling selectedChildId update
        if (body.selectedChildId !== undefined) {
             const updatedUser = await prisma.user.update({
                  where: { id: auth.userId },
                  data: { selectedChildId: body.selectedChildId === null ? null : Number(body.selectedChildId) },
             });
             return NextResponse.json({ success: true, selectedChildId: updatedUser.selectedChildId });
        }
        
        // Otherwise, updating children (not needed strictly as we have children API but keeping it safe)
        const { childId, childName, childWeight, childAgeMonths } = body;
        
        if (childId) {
             const updatedChild = await prisma.child.update({
                 where: { id: Number(childId), userId: auth.userId },
                 data: {
                     name: childName,
                     weight: childWeight,
                     ageMonths: childAgeMonths,
                 },
             });
             return NextResponse.json(updatedChild);
        }

        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
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
            childrenInfo: user.children,
            selectedChildId: user.selectedChildId,
        });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
`);
