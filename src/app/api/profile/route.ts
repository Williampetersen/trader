import { NextRequest, NextResponse } from "next/server";
import { countries } from "@/data/countries";
import { requireApiUser } from "@/lib/server/responses";
import { normalizeUser, publicUser, readDb, writeDb } from "@/lib/server/store";

export async function PUT(request: NextRequest) {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const body = await request.json();
    const db = await readDb();
    const dbUser = db.users.find((item) => item.id === user.id);
    if (!dbUser) return NextResponse.json({ error: "User not found." }, { status: 404 });

    const name = String(body.name || "").trim();
    if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
    const country = String(body.country || "").trim();
    if (country && !countries.includes(country)) {
        return NextResponse.json({ error: "Select a valid country." }, { status: 400 });
    }

    const normalizedUser = normalizeUser(dbUser);
    normalizedUser.name = name;
    normalizedUser.profile.mobile = String(body.mobile || "").trim();
    normalizedUser.profile.country = country;
    normalizedUser.profile.gender = String(body.gender || "").trim();
    normalizedUser.profile.ageGroup = String(body.ageGroup || "").trim();
    await writeDb(db);

    return NextResponse.json({ user: publicUser(normalizedUser) });
}
