import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { requireApiUser } from "@/lib/server/responses";
import { readDb } from "@/lib/server/store";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
    const { user, response } = await requireApiUser();
    if (!user) return response;

    const db = await readDb();
    const analysis = db.analyses.find((item) => item.id === params.id && item.userId === user.id);
    if (!analysis?.imagePath) return NextResponse.json({ error: "Image not found." }, { status: 404 });

    try {
        const bytes = await readFile(analysis.imagePath);
        return new NextResponse(bytes, {
            headers: {
                "Content-Type": analysis.imageMime || "image/png",
                "Cache-Control": "private, max-age=60",
            },
        });
    } catch {
        return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }
}
