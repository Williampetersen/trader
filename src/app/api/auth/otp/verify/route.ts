import { NextRequest, NextResponse } from "next/server";
import { createSessionResponse } from "@/lib/server/auth";
import { createPlan, hashPassword, newId, readDb, verifyPassword, writeDb } from "@/lib/server/store";
import { isValidEmail } from "@/lib/server/mail";

export const runtime = "nodejs";

const MAX_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = String(body.email || "").trim().toLowerCase();
        const code = String(body.code || "").replace(/\D/g, "");

        if (!isValidEmail(email) || !/^\d{6}$/.test(code)) {
            return NextResponse.json({ error: "Enter the 6-digit verification code." }, { status: 400 });
        }

        const db = await readDb();
        db.authOtps ||= [];
        const now = Date.now();
        const otp = db.authOtps
            .filter((item) => item.email === email)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

        if (!otp) {
            return NextResponse.json({ error: "Request a new verification code first." }, { status: 400 });
        }

        if (new Date(otp.expiresAt).getTime() <= now) {
            db.authOtps = db.authOtps.filter((item) => item.id !== otp.id);
            await writeDb(db);
            return NextResponse.json({ error: "This code has expired. Request a new code." }, { status: 400 });
        }

        if (otp.attempts >= MAX_ATTEMPTS) {
            db.authOtps = db.authOtps.filter((item) => item.id !== otp.id);
            await writeDb(db);
            return NextResponse.json({ error: "Too many incorrect attempts. Request a new code." }, { status: 429 });
        }

        if (!verifyPassword(code, otp.codeSalt, otp.codeHash)) {
            otp.attempts += 1;
            await writeDb(db);
            return NextResponse.json({ error: "The verification code is incorrect." }, { status: 400 });
        }

        db.authOtps = db.authOtps.filter((item) => item.email !== email);
        let user = db.users.find((item) => item.email === email);

        if (!user) {
            const nowDate = new Date();
            const password = hashPassword(newId());
            user = {
                id: newId(),
                name: email.split("@")[0],
                email,
                passwordHash: password.hash,
                passwordSalt: password.salt,
                createdAt: nowDate.toISOString(),
                profile: { mobile: "", country: "", gender: "", ageGroup: "" },
                plan: createPlan("Trial", nowDate),
                settings: {
                    twoFactorEnabled: false,
                    loginNotifications: true,
                },
            };
            db.users.push(user);
            db.payments.push({
                id: newId(),
                userId: user.id,
                date: nowDate.toISOString(),
                plan: "Trial",
                amount: 0,
                start: nowDate.toISOString(),
                end: user.plan.expiresAt,
            });
        }

        await writeDb(db);
        return createSessionResponse(user.id);
    } catch (error) {
        console.error("OTP verification failed", error);
        return NextResponse.json({ error: "Unable to verify code right now." }, { status: 500 });
    }
}
