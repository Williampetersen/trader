import { NextRequest, NextResponse } from "next/server";
import { isValidEmail } from "@/lib/server/mail";
import { newId, readDb, writeDb } from "@/lib/server/store";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const website = String(body.website || "").trim();
    if (website) return NextResponse.json({ ok: true });

    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "").trim().slice(0, 100);
    const source = String(body.source || "blog").trim().slice(0, 160);

    if (!isValidEmail(email)) {
        return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const db = await readDb();
    db.newsletterLeads ||= [];
    const existing = db.newsletterLeads.find((lead) => lead.email === email);
    if (existing) {
        existing.name = name || existing.name;
        existing.source = source;
        existing.createdAt = new Date().toISOString();
    } else {
        db.newsletterLeads.push({
            id: newId(),
            email,
            name,
            source,
            createdAt: new Date().toISOString(),
        });
    }
    await writeDb(db);

    return NextResponse.json({ ok: true });
}
