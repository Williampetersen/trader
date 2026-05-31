import { NextRequest, NextResponse } from "next/server";
import { createSessionResponse } from "@/lib/server/auth";
import { createPlan, hashPassword, newId, readDb, verifyPassword, writeDb } from "@/lib/server/store";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = String(body.email || "").trim().toLowerCase();
        const name = String(body.name || "").trim();
        const password = String(body.password || "");

        if (!email || !name || password.length < 8) {
            return NextResponse.json({ error: "Name, valid email, and an 8 character password are required." }, { status: 400 });
        }

        const db = await readDb();
        const existingUser = db.users.find((user) => user.email === email);
        if (existingUser) {
            if (verifyPassword(password, existingUser.passwordSalt, existingUser.passwordHash)) {
                return createSessionResponse(existingUser.id);
            }

            return NextResponse.json(
                { error: "An account already exists for this email. Log in with the original password or use another email.", code: "ACCOUNT_EXISTS" },
                { status: 409 },
            );
        }

        const { salt, hash } = hashPassword(password);
        const now = new Date();
        const user = {
            id: newId(),
            name,
            email,
            passwordHash: hash,
            passwordSalt: salt,
            createdAt: now.toISOString(),
            profile: { mobile: "", country: "", gender: "", ageGroup: "" },
            plan: createPlan("Trial", now),
            settings: {
                twoFactorEnabled: false,
                loginNotifications: true,
            },
        };
        db.users.push(user);
        db.payments.push({
            id: newId(),
            userId: user.id,
            date: now.toISOString(),
            plan: "Trial",
            amount: 0,
            start: now.toISOString(),
            end: user.plan.expiresAt,
        });
        await writeDb(db);

        return createSessionResponse(user.id);
    } catch (error) {
        console.error("Signup failed", error);
        return NextResponse.json({ error: "Unable to create account right now. Please try again." }, { status: 500 });
    }
}
