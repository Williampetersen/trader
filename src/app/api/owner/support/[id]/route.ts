import { NextRequest, NextResponse } from "next/server";
import { requireOwnerApi } from "@/lib/server/owner-auth";
import { readDb, writeDb } from "@/lib/server/store";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const { session, response } = await requireOwnerApi();
    if (!session) return response;

    const body = await request.json();
    const status = String(body.status || "");
    if (status !== "Open" && status !== "Answered") {
        return NextResponse.json({ error: "Invalid ticket status." }, { status: 400 });
    }

    const db = await readDb();
    const ticket = (db.supportTickets || []).find((item) => item.id === params.id);
    if (!ticket) return NextResponse.json({ error: "Ticket not found." }, { status: 404 });

    ticket.status = status;
    await writeDb(db);
    return NextResponse.json({ ticket });
}
