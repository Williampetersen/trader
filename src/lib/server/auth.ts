import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { applyPlanRules, newId, publicUser, readDb, SessionRecord, UserRecord, writeDb } from "./store";

export const SESSION_COOKIE = "gcv_session";

export async function getSessionUser(): Promise<UserRecord | null> {
    const sessionId = cookies().get(SESSION_COOKIE)?.value;
    if (!sessionId) return null;

    const db = await readDb();
    const session = db.sessions.find((item) => item.id === sessionId);
    if (!session || new Date(session.expiresAt).getTime() < Date.now()) return null;
    const user = db.users.find((item) => item.id === session.userId);
    if (!user) return null;
    const now = new Date();
    const planChanged = applyPlanRules(user, now);
    const lastSeenChanged = !user.lastSeenAt || now.getTime() - new Date(user.lastSeenAt).getTime() > 60 * 1000;
    if (lastSeenChanged) user.lastSeenAt = now.toISOString();
    if (planChanged || lastSeenChanged) await writeDb(db);
    return user;
}

export async function requireUser() {
    const user = await getSessionUser();
    if (!user) redirect("/login");
    return user;
}

export async function createSessionResponse(userId: string) {
    const db = await readDb();
    const session: SessionRecord = {
        id: newId(),
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    };
    db.sessions.push(session);
    await writeDb(db);

    const response = NextResponse.json({ ok: true, user: publicUser(db.users.find((user) => user.id === userId)!) });
    response.cookies.set(SESSION_COOKIE, session.id, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(session.expiresAt),
    });
    return response;
}
