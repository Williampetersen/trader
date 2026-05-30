import { NextRequest, NextResponse } from "next/server";
import { requireApiUser } from "@/lib/server/responses";
import { Outcome, readDb, writeDb } from "@/lib/server/store";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const db = await readDb();
    const analysis = db.analyses.find((item) => item.id === params.id && item.userId === user.id);
    if (!analysis) return NextResponse.json({ error: "Analysis not found." }, { status: 404 });
    return NextResponse.json({ analysis });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const body = await request.json();
    const outcome = String(body.outcome || "Not set") as Outcome;
    const db = await readDb();
    const analysis = db.analyses.find((item) => item.id === params.id && item.userId === user.id);
    if (!analysis) return NextResponse.json({ error: "Analysis not found." }, { status: 404 });
    if (!["Won", "Lost", "Not Taken", "Not set"].includes(outcome)) {
        return NextResponse.json({ error: "Invalid outcome." }, { status: 400 });
    }
    analysis.outcome = outcome;
    await writeDb(db);
    return NextResponse.json({ analysis });
}
