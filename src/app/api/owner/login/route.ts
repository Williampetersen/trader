import { NextRequest, NextResponse } from "next/server";
import { createOwnerSessionResponse, ownerCredentials } from "@/lib/server/owner-auth";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const credentials = ownerCredentials();

    if (!credentials.email || !credentials.password) {
        return NextResponse.json({ error: "Owner login is not configured." }, { status: 500 });
    }

    if (email !== credentials.email.toLowerCase() || password !== credentials.password) {
        return NextResponse.json({ error: "Invalid owner login." }, { status: 401 });
    }

    return createOwnerSessionResponse(credentials.email);
}
