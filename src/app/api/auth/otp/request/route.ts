import { randomInt } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { isMailConfigured, isValidEmail, sendLoginOtpMail } from "@/lib/server/mail";
import { hashPassword, newId, readDb, writeDb } from "@/lib/server/store";

export const runtime = "nodejs";

const OTP_TTL_MS = 15 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = String(body.email || "").trim().toLowerCase();

        if (!isValidEmail(email)) {
            return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
        }

        if (!isMailConfigured()) {
            return NextResponse.json({ error: "Email login is not configured. Please contact support." }, { status: 503 });
        }

        const db = await readDb();
        db.authOtps ||= [];

        const now = Date.now();
        const activeOtp = db.authOtps.find((otp) => otp.email === email && new Date(otp.expiresAt).getTime() > now);
        if (activeOtp && new Date(activeOtp.resendAfter).getTime() > now) {
            const waitSeconds = Math.ceil((new Date(activeOtp.resendAfter).getTime() - now) / 1000);
            return NextResponse.json(
                { error: `Please wait ${waitSeconds} seconds before requesting a new code.`, resendAfterSeconds: waitSeconds },
                { status: 429 },
            );
        }

        const code = randomInt(0, 1000000).toString().padStart(6, "0");
        const { salt, hash } = hashPassword(code);
        const createdAt = new Date(now);
        const expiresAt = new Date(now + OTP_TTL_MS);
        const resendAfter = new Date(now + RESEND_COOLDOWN_MS);

        db.authOtps = db.authOtps.filter((otp) => otp.email !== email && new Date(otp.expiresAt).getTime() > now);
        db.authOtps.push({
            id: newId(),
            email,
            codeHash: hash,
            codeSalt: salt,
            attempts: 0,
            createdAt: createdAt.toISOString(),
            expiresAt: expiresAt.toISOString(),
            resendAfter: resendAfter.toISOString(),
        });
        await writeDb(db);

        try {
            await sendLoginOtpMail({ email, code });
        } catch (error) {
            const rollbackDb = await readDb();
            rollbackDb.authOtps = (rollbackDb.authOtps || []).filter((otp) => otp.email !== email);
            await writeDb(rollbackDb);
            console.error("OTP email failed", error);
            return NextResponse.json({ error: "We could not send the verification code. Please try again." }, { status: 503 });
        }

        return NextResponse.json({ ok: true, email, expiresInSeconds: OTP_TTL_MS / 1000, resendAfterSeconds: RESEND_COOLDOWN_MS / 1000 });
    } catch (error) {
        console.error("OTP request failed", error);
        return NextResponse.json({ error: "Unable to send verification code right now." }, { status: 500 });
    }
}
