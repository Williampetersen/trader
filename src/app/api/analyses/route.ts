import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { requireApiUser } from "@/lib/server/responses";
import { applyPlanRules, buildAnalysis, isPlanExpired, newId, readDb, writeDb } from "@/lib/server/store";
import { enrichAnalysisWithAi } from "@/lib/server/ai";

export async function GET() {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const db = await readDb();
    return NextResponse.json({ analyses: db.analyses.filter((item) => item.userId === user.id).reverse() });
}

export async function POST(request: NextRequest) {
    const { user, response } = await requireApiUser();
    if (!user) return response;

    const db = await readDb();
    const dbUser = db.users.find((item) => item.id === user.id);
    if (!dbUser) return NextResponse.json({ error: "User not found." }, { status: 404 });
    const planChanged = applyPlanRules(dbUser);
    if (isPlanExpired(dbUser)) {
        if (planChanged) await writeDb(db);
        return NextResponse.json({ error: "Your plan access has expired. Upgrade your plan to continue." }, { status: 402 });
    }
    if (dbUser.plan.creditsLeft <= 0) {
        if (planChanged) await writeDb(db);
        return NextResponse.json({ error: "No credits left today. Upgrade your plan to continue." }, { status: 402 });
    }

    const form = await request.formData();
    const file = form.get("file") as File | null;
    const symbol = String(form.get("symbol") || "EUR/USD");
    const timeframe = String(form.get("timeframe") || "1h");
    if (!file) return NextResponse.json({ error: "A chart image is required." }, { status: 400 });

    const uploadId = newId();
    const uploadDir = path.join(process.cwd(), ".local", "gpt-chart-view", "uploads", user.id);
    await mkdir(uploadDir, { recursive: true });
    const extension = path.extname(file.name) || ".png";
    const imagePath = path.join(uploadDir, `${uploadId}${extension}`);
    await writeFile(imagePath, Buffer.from(await file.arrayBuffer()));

    const baseAnalysis = {
        ...buildAnalysis(user.id, file.name, symbol, timeframe),
        id: uploadId,
        imagePath,
        imageMime: file.type || "image/png",
    };
    const analysis = await enrichAnalysisWithAi(baseAnalysis, file);
    db.analyses.push(analysis);
    dbUser.plan.creditsLeft -= 1;
    dbUser.plan.lastCreditResetAt ||= new Date().toISOString();
    await writeDb(db);

    return NextResponse.json({ analysis });
}
