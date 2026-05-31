import { NextRequest, NextResponse } from "next/server";
import { createSessionResponse } from "@/lib/server/auth";
import { readDb, verifyPassword } from "@/lib/server/store";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = String(body.email || "").trim().toLowerCase();
        const password = String(body.password || "");
        const db = await readDb();
        const user = db.users.find((item) => item.email === email);

        if (!user || !verifyPassword(password, user.passwordSalt, user.passwordHash)) {
            return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }

        return createSessionResponse(user.id);
    } catch (error) {
        console.error("Login failed", error);
        return NextResponse.json({ error: "Unable to sign in right now. Please try again." }, { status: 500 });
    }
}
