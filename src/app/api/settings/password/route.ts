import { NextRequest, NextResponse } from "next/server";
import { requireApiUser } from "@/lib/server/responses";
import { hashPassword, readDb, verifyPassword, writeDb } from "@/lib/server/store";

export async function PUT(request: NextRequest) {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const body = await request.json();
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");
    const db = await readDb();
    const dbUser = db.users.find((item) => item.id === user.id);
    if (!dbUser) return NextResponse.json({ error: "User not found." }, { status: 404 });
    if (!verifyPassword(currentPassword, dbUser.passwordSalt, dbUser.passwordHash)) {
        return NextResponse.json({ error: "Current password is not correct." }, { status: 400 });
    }
    if (newPassword.length < 8) return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });

    const { salt, hash } = hashPassword(newPassword);
    dbUser.passwordSalt = salt;
    dbUser.passwordHash = hash;
    await writeDb(db);
    return NextResponse.json({ ok: true });
}
