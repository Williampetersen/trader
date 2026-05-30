import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/server/responses";
import { readDb } from "@/lib/server/store";

export async function GET() {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const db = await readDb();
    return NextResponse.json({
        plan: user.plan,
        payments: db.payments.filter((item) => item.userId === user.id).reverse(),
    });
}
