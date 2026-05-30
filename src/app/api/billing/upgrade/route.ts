import { NextRequest, NextResponse } from "next/server";
import { requireApiUser } from "@/lib/server/responses";
import { paidPlanNames } from "@/data/plans";
import { PlanName, createPlan, newId, planDetails, readDb, writeDb } from "@/lib/server/store";

export async function POST(request: NextRequest) {
    const { user, response } = await requireApiUser();
    if (!user) return response;

    const body = await request.json();
    const planName = String(body.plan || "") as PlanName;
    if (!paidPlanNames.includes(planName)) {
        return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const db = await readDb();
    const dbUser = db.users.find((item) => item.id === user.id);
    if (!dbUser) return NextResponse.json({ error: "User not found." }, { status: 404 });

    const now = new Date();
    const details = planDetails(planName);
    const end = new Date(now.getTime() + details.days * 24 * 60 * 60 * 1000);
    dbUser.plan = createPlan(planName, now);
    db.payments.push({
        id: newId(),
        userId: user.id,
        date: now.toISOString(),
        plan: planName,
        amount: details.amount,
        start: now.toISOString(),
        end: end.toISOString(),
    });
    await writeDb(db);

    return NextResponse.json({ plan: dbUser.plan });
}
