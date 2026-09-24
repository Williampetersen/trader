import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { paidPlans } from "@/data/plans";
import { requireApiUser } from "@/lib/server/responses";
import { applyPlanRules, buildAnalysis, dataRoot, isPlanExpired, newId, readDb, type UserRecord, writeDb } from "@/lib/server/store";
import { AiAnalysisError, enrichAnalysisWithAi } from "@/lib/server/ai";

const upgradePlans = paidPlans.map((plan) => ({
    name: plan.name,
    price: plan.price,
    durationLabel: plan.durationLabel,
    allowanceLabel: plan.allowanceLabel,
    dailyLimit: plan.dailyLimit,
    description: plan.description,
    features: plan.features,
}));

function upgradeRequired(user: UserRecord, reason: "trial_finished" | "plan_expired" | "limit_reached") {
    const isTrial = user.plan.name === "Trial";
    const message = isTrial
        ? "Your free trial is finished. Choose a plan to keep analyzing charts."
        : reason === "plan_expired"
            ? "Your plan access has expired. Choose a plan to continue."
            : "You have reached your upload limit for this plan. Upgrade to continue now.";

    return NextResponse.json(
        {
            error: message,
            reason: isTrial ? "trial_finished" : reason,
            plans: upgradePlans,
        },
        { status: 402 }
    );
}

export async function GET() {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const db = await readDb();
    return NextResponse.json({ analyses: db.analyses.filter((item) => item.userId === user.id).reverse() });
}

export async function POST(request: NextRequest) {
    try {
        const { user, response } = await requireApiUser();
        if (!user) return response;

        const db = await readDb();
        const dbUser = db.users.find((item) => item.id === user.id);
        if (!dbUser) return NextResponse.json({ error: "User not found." }, { status: 404 });
        const planChanged = applyPlanRules(dbUser, db.analyses);
        if (isPlanExpired(dbUser)) {
            if (planChanged) await writeDb(db);
            return upgradeRequired(dbUser, "plan_expired");
        }
        if (dbUser.plan.creditsLeft <= 0) {
            if (planChanged) await writeDb(db);
            return upgradeRequired(dbUser, "limit_reached");
        }

        const form = await request.formData();
        const file = form.get("file") as File | null;
        if (!file) return NextResponse.json({ error: "A chart image is required." }, { status: 400 });
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "Upload a PNG, JPG, or WEBP chart image." }, { status: 400 });
        }

        const imageBytes = Buffer.from(await file.arrayBuffer());
        const uploadId = newId();
        const uploadDir = path.join(dataRoot, "uploads", user.id);
        await mkdir(uploadDir, { recursive: true });
        const extension = path.extname(file.name) || extensionForMime(file.type);
        const imagePath = path.join(uploadDir, `${uploadId}${extension}`);

        const baseAnalysis = {
            ...buildAnalysis(user.id, file.name, "Chart", "Auto"),
            id: uploadId,
            imagePath,
            imageMime: file.type || "image/png",
        };
        const analysis = await enrichAnalysisWithAi(baseAnalysis, new File([imageBytes], file.name, { type: file.type || "image/png" }));
        await writeFile(imagePath, imageBytes);
        db.analyses.push(analysis);
        const now = new Date();
        dbUser.plan.creditsLeft = Math.max(0, dbUser.plan.creditsLeft - 1);
        dbUser.plan.lastCreditResetAt ||= now.toISOString();
        if (dbUser.plan.name === "Trial") {
            dbUser.trialUploadsUsed = (dbUser.trialUploadsUsed ?? 0) + 1;
        }
        await writeDb(db);

        return NextResponse.json({ analysis });
    } catch (error) {
        if (error instanceof AiAnalysisError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        console.error("Chart upload failed", error);
        return NextResponse.json({ error: "Unable to analyze chart right now. Please try again." }, { status: 500 });
    }
}

const extensionForMime = (mime: string) => {
    if (mime === "image/jpeg") return ".jpg";
    if (mime === "image/webp") return ".webp";
    return ".png";
};
