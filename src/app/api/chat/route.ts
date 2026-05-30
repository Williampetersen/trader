import { NextRequest, NextResponse } from "next/server";
import { requireApiUser } from "@/lib/server/responses";
import { newId, readDb, writeDb } from "@/lib/server/store";

export async function GET() {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const db = await readDb();
    return NextResponse.json({ messages: db.chats.filter((item) => item.userId === user.id) });
}

export async function POST(request: NextRequest) {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const body = await request.json();
    const content = String(body.content || "").trim();
    if (!content) return NextResponse.json({ error: "Message is required." }, { status: 400 });

    const db = await readDb();
    const analyses = db.analyses.filter((item) => item.userId === user.id);
    const latest = analyses[analyses.length - 1];
    const assistantText = latest
        ? `Based on your latest ${latest.symbol} ${latest.timeframe} review: ${latest.summary} Key levels are entry ${latest.entry}, stop ${latest.stopLoss}, TP1 ${latest.tp1}, TP2 ${latest.tp2}.`
        : "Upload a chart first and I can discuss its trend, key levels, confidence score, and risk notes.";

    const now = new Date().toISOString();
    const userMessage = { id: newId(), userId: user.id, role: "user" as const, content, createdAt: now };
    const assistantMessage = { id: newId(), userId: user.id, role: "assistant" as const, content: assistantText, createdAt: new Date().toISOString() };
    db.chats.push(userMessage, assistantMessage);
    await writeDb(db);

    return NextResponse.json({ messages: [userMessage, assistantMessage] });
}
