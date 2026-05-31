import { NextRequest, NextResponse } from "next/server";
import { isMailConfigured, isValidEmail, sendContactConfirmation, sendSupportMail } from "@/lib/server/mail";

const maxLength = {
    name: 100,
    email: 160,
    subject: 160,
    message: 4000,
};

export async function POST(request: NextRequest) {
    const body = await request.json();
    const website = String(body.website || "").trim();
    if (website) return NextResponse.json({ ok: true });

    const name = clean(body.name, maxLength.name);
    const email = clean(body.email, maxLength.email).toLowerCase();
    const subject = clean(body.subject, maxLength.subject);
    const message = clean(body.message, maxLength.message);

    if (!name || !email || !subject || !message) {
        return NextResponse.json({ error: "Name, email, subject, and message are required." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
        return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (!isMailConfigured()) {
        return NextResponse.json({ error: "Email is not configured yet." }, { status: 500 });
    }

    try {
        await sendSupportMail({
            name,
            email,
            subject,
            message,
            source: "Public contact form",
            metadata: {
                page: "/contact",
                userAgent: request.headers.get("user-agent") || "Unknown",
            },
        });
        await sendContactConfirmation({ name, email, subject });
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Unable to send email right now. Please try again later." }, { status: 502 });
    }
}

function clean(value: unknown, max: number) {
    return String(value || "").trim().slice(0, max);
}
