import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { newId, OwnerSessionRecord, readDb, writeDb } from "./store";

export const OWNER_SESSION_COOKIE = "gcv_owner_session";

export function ownerCredentials() {
    return {
        email: process.env.OWNER_EMAIL || "",
        password: process.env.OWNER_PASSWORD || "",
    };
}

export async function getOwnerSession(): Promise<OwnerSessionRecord | null> {
    const sessionId = cookies().get(OWNER_SESSION_COOKIE)?.value;
    if (!sessionId) return null;

    const db = await readDb();
    const session = db.ownerSessions?.find((item) => item.id === sessionId);
    if (!session || new Date(session.expiresAt).getTime() < Date.now()) return null;
    return session;
}

export async function requireOwner() {
    const session = await getOwnerSession();
    if (!session) redirect("/owner/login");
    return session;
}

export async function requireOwnerApi() {
    const session = await getOwnerSession();
    if (!session) {
        return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }
    return { session, response: null };
}

export async function createOwnerSessionResponse(email: string) {
    const db = await readDb();
    const session: OwnerSessionRecord = {
        id: newId(),
        email,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    };
    db.ownerSessions ||= [];
    db.ownerSessions.push(session);
    await writeDb(db);

    const response = NextResponse.json({ ok: true });
    response.cookies.set(OWNER_SESSION_COOKIE, session.id, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(session.expiresAt),
    });
    return response;
}

export async function clearOwnerSessionResponse() {
    const sessionId = cookies().get(OWNER_SESSION_COOKIE)?.value;
    const db = await readDb();
    if (sessionId) {
        db.ownerSessions = (db.ownerSessions || []).filter((session) => session.id !== sessionId);
        await writeDb(db);
    }
    const response = NextResponse.json({ ok: true });
    response.cookies.set(OWNER_SESSION_COOKIE, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    });
    return response;
}
