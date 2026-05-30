import { NextRequest, NextResponse } from "next/server";
import { requireApiUser } from "@/lib/server/responses";
import { newId, readDb, writeDb } from "@/lib/server/store";

export async function GET() {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const db = await readDb();
    return NextResponse.json({
        tickets: (db.supportTickets || []).filter((ticket) => ticket.userId === user.id).reverse(),
    });
}

export async function POST(request: NextRequest) {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const body = await request.json();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();
    if (!subject || !message) {
        return NextResponse.json({ error: "Subject and message are required." }, { status: 400 });
    }

    const db = await readDb();
    db.supportTickets ||= [];
    const ticket = {
        id: newId(),
        userId: user.id,
        subject,
        message,
        status: "Open" as const,
        createdAt: new Date().toISOString(),
    };
    db.supportTickets.push(ticket);
    await writeDb(db);
    return NextResponse.json({ ticket });
}
