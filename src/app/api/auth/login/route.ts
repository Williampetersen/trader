import { NextRequest, NextResponse } from "next/server";
import { createSessionResponse } from "@/lib/server/auth";
import { readDb, verifyPassword } from "@/lib/server/store";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const db = await readDb();
    const user = db.users.find((item) => item.email === email);

    if (!user || !verifyPassword(password, user.passwordSalt, user.passwordHash)) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    return createSessionResponse(user.id);
}
