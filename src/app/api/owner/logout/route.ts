import { clearOwnerSessionResponse } from "@/lib/server/owner-auth";

export async function POST() {
    return clearOwnerSessionResponse();
}
