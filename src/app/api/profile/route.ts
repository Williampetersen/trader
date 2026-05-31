import { NextRequest, NextResponse } from "next/server";
import { countries } from "@/data/countries";
import { requireApiUser } from "@/lib/server/responses";
import { normalizeUser, publicUser, readDb, writeDb } from "@/lib/server/store";

const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say", "Other"];
const ageGroupOptions = ["Under 18", "18-25", "26-39", "40-54", "55+"];

export async function PUT(request: NextRequest) {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const body = await request.json();
    const db = await readDb();
    const dbUser = db.users.find((item) => item.id === user.id);
    if (!dbUser) return NextResponse.json({ error: "User not found." }, { status: 404 });

    const name = String(body.name || "").trim();
    if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
    const mobile = String(body.mobile || "").trim();
    if (!mobile) return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    const country = String(body.country || "").trim();
    if (!country || !countries.includes(country)) {
        return NextResponse.json({ error: "Select a valid country." }, { status: 400 });
    }
    const gender = String(body.gender || "").trim();
    if (!genderOptions.includes(gender)) return NextResponse.json({ error: "Select a valid gender." }, { status: 400 });
    const ageGroup = String(body.ageGroup || "").trim();
    if (!ageGroupOptions.includes(ageGroup)) return NextResponse.json({ error: "Select a valid age group." }, { status: 400 });

    const normalizedUser = normalizeUser(dbUser);
    normalizedUser.name = name;
    normalizedUser.profile.mobile = mobile;
    normalizedUser.profile.country = country;
    normalizedUser.profile.gender = gender;
    normalizedUser.profile.ageGroup = ageGroup;
    await writeDb(db);

    return NextResponse.json({ user: publicUser(normalizedUser) });
}
