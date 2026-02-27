import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const links = await prisma.mediaLink.findMany();
        return NextResponse.json(links);
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { stepId, imageUrl, caption } = await req.json();

        if (!stepId || !imageUrl) {
            return NextResponse.json({ error: "Missing stepId or imageUrl" }, { status: 400 });
        }

        const link = await prisma.mediaLink.upsert({
            where: { stepId },
            update: { imageUrl, caption },
            create: { stepId, imageUrl, caption },
        });

        return NextResponse.json(link);
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
