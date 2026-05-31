import { NextResponse } from "next/server";
import { getOwnerMetrics } from "@/lib/server/owner-metrics";
import { requireOwnerApi } from "@/lib/server/owner-auth";

export async function GET() {
    const { session, response } = await requireOwnerApi();
    if (!session) return response;
    return NextResponse.json(await getOwnerMetrics());
}
