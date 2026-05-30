import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/server/responses";
import { readDb } from "@/lib/server/store";

export async function GET() {
    const { user, response } = await requireApiUser();
    if (!user) return response;

    const db = await readDb();
    const analyses = db.analyses.filter((item) => item.userId === user.id);
    const aiResponses = db.chats.filter((item) => item.userId === user.id && item.role === "assistant").length;
    const recent = analyses.slice(-5).reverse();

    return NextResponse.json({
        stats: {
            totalUploads: analyses.length,
            chartsAnalyzed: analyses.length,
            aiResponses,
            creditsLeft: user.plan.creditsLeft,
            dailyLimit: user.plan.dailyLimit,
        },
        recent,
    });
}
