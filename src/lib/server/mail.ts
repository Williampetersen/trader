import nodemailer from "nodemailer";

export interface SupportMailInput {
    name: string;
    email: string;
    subject: string;
    message: string;
    source: "Public contact form" | "Dashboard support ticket";
    metadata?: Record<string, string>;
}

const supportEmail = process.env.SUPPORT_EMAIL || "support@gptchartview.com";

export function isMailConfigured() {
    return Boolean(process.env.SMTP_USER && smtpPassword());
}

function getTransporter() {
    if (!isMailConfigured()) {
        throw new Error("SMTP is not configured.");
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.simply.com",
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: smtpPassword(),
        },
        requireTLS: true,
    });
}

export async function sendSupportMail(input: SupportMailInput) {
    const transporter = getTransporter();
    const subject = `[GPT Chart View] ${input.subject}`;
    const text = buildText(input);
    const html = buildHtml(input);

    return transporter.sendMail({
        from: formatAddress(process.env.SMTP_FROM || supportEmail, "GPT Chart View Support"),
        to: process.env.SUPPORT_TO || supportEmail,
        replyTo: formatAddress(input.email, input.name),
        subject,
        text,
        html,
    });
}

export async function sendContactConfirmation(input: Pick<SupportMailInput, "name" | "email" | "subject">) {
    const transporter = getTransporter();
    return transporter.sendMail({
        from: formatAddress(process.env.SMTP_FROM || supportEmail, "GPT Chart View Support"),
        to: formatAddress(input.email, input.name),
        subject: "We received your GPT Chart View message",
        text: `Hi ${input.name},\n\nWe received your message about "${input.subject}". Our support team will reply as soon as possible.\n\nGPT Chart View Support`,
        html: `<p>Hi ${escapeHtml(input.name)},</p><p>We received your message about <strong>${escapeHtml(input.subject)}</strong>. Our support team will reply as soon as possible.</p><p>GPT Chart View Support</p>`,
    });
}

export async function sendLoginOtpMail(input: { email: string; code: string }) {
    const transporter = getTransporter();
    return transporter.sendMail({
        from: formatAddress(process.env.SMTP_FROM || supportEmail, "GPT Chart View Security"),
        to: input.email,
        subject: "Your GPT Chart View verification code",
        text: `Your GPT Chart View verification code is ${input.code}. It expires in 15 minutes. If you did not request this code, you can ignore this email.`,
        html: `
            <div style="font-family:Arial,sans-serif;background:#05070f;padding:28px;color:#ffffff;">
                <div style="max-width:560px;margin:0 auto;background:#0b1018;border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:28px;">
                    <p style="margin:0 0 10px;color:#16c7ff;font-size:12px;text-transform:uppercase;letter-spacing:0.16em;font-weight:800;">Secure login</p>
                    <h1 style="margin:0 0 14px;font-size:24px;">Your verification code</h1>
                    <p style="margin:0 0 22px;color:#cbd5e1;line-height:1.6;">Enter this 6-digit code to access your GPT Chart View dashboard. The code expires in 15 minutes.</p>
                    <div style="font-size:34px;letter-spacing:0.24em;font-weight:900;background:#111827;border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:18px 22px;text-align:center;">${escapeHtml(input.code)}</div>
                    <p style="margin:22px 0 0;color:#94a3b8;font-size:13px;line-height:1.6;">If you did not request this code, you can ignore this email.</p>
                </div>
            </div>
        `,
    });
}

function buildText(input: SupportMailInput) {
    const metadata = input.metadata ? Object.entries(input.metadata).map(([key, value]) => `${key}: ${value}`).join("\n") : "";
    return [
        `Source: ${input.source}`,
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        `Subject: ${input.subject}`,
        "",
        input.message,
        metadata ? "\nMetadata:\n" + metadata : "",
    ].filter(Boolean).join("\n");
}

function buildHtml(input: SupportMailInput) {
    const metadataRows = input.metadata
        ? Object.entries(input.metadata).map(([key, value]) => `<tr><td style="padding:6px 10px;color:#64748b;">${escapeHtml(key)}</td><td style="padding:6px 10px;">${escapeHtml(value)}</td></tr>`).join("")
        : "";

    return `
        <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
            <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;padding:24px;">
                <p style="font-size:12px;text-transform:uppercase;letter-spacing:0.12em;color:#3457ff;font-weight:800;margin:0 0 8px;">${escapeHtml(input.source)}</p>
                <h1 style="font-size:22px;margin:0 0 18px;">${escapeHtml(input.subject)}</h1>
                <table style="width:100%;border-collapse:collapse;margin-bottom:18px;">
                    <tr><td style="padding:6px 10px;color:#64748b;">Name</td><td style="padding:6px 10px;">${escapeHtml(input.name)}</td></tr>
                    <tr><td style="padding:6px 10px;color:#64748b;">Email</td><td style="padding:6px 10px;">${escapeHtml(input.email)}</td></tr>
                    ${metadataRows}
                </table>
                <div style="white-space:pre-wrap;line-height:1.6;border-top:1px solid #e2e8f0;padding-top:18px;">${escapeHtml(input.message)}</div>
            </div>
        </div>
    `;
}

function formatAddress(email: string, name: string) {
    const safeName = name.replace(/[<>"]/g, "").trim();
    return safeName ? `"${safeName}" <${email}>` : email;
}

function smtpPassword() {
    return process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
}

export function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
