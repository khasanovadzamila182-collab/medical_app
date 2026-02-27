import { NextRequest, NextResponse } from "next/server";
import { calculateDosage } from "@/lib/dosage";

export async function GET(req: NextRequest) {
    const sp = req.nextUrl.searchParams;
    const drug = sp.get("drug") || "";
    const weight = parseFloat(sp.get("weight") || "0");
    const ageMonths = parseInt(sp.get("age") || "24");

    if (!drug) {
        return NextResponse.json({ error: "Missing 'drug' param" }, { status: 400 });
    }
    if (weight <= 0 && !["pulmicort"].includes(drug)) {
        return NextResponse.json({ error: "Missing or invalid 'weight' param" }, { status: 400 });
    }

    const result = calculateDosage(drug, weight, ageMonths);
    if (!result) {
        return NextResponse.json({ error: `Unknown drug: ${drug}` }, { status: 404 });
    }

    return NextResponse.json(result);
}
