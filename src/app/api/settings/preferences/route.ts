import { NextRequest, NextResponse } from "next/server";
import { requireApiUser } from "@/lib/server/responses";
import { publicUser, readDb, writeDb } from "@/lib/server/store";

export async function PUT(request: NextRequest) {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const body = await request.json();
    const db = await readDb();
    const dbUser = db.users.find((item) => item.id === user.id);
    if (!dbUser) return NextResponse.json({ error: "User not found." }, { status: 404 });

    dbUser.settings = {
        twoFactorEnabled: Boolean(body.twoFactorEnabled),
        loginNotifications: Boolean(body.loginNotifications),
    };
    await writeDb(db);
    return NextResponse.json({ user: publicUser(dbUser) });
}
