import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/server/auth";
import { readDb, writeDb } from "@/lib/server/store";

export async function POST(request: NextRequest) {
    const response = NextResponse.json({ ok: true });
    const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
    if (sessionId) {
        const db = await readDb();
        db.sessions = db.sessions.filter((session) => session.id !== sessionId);
        await writeDb(db);
    }
    response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
    return response;
}
