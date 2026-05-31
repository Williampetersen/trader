import { NextRequest, NextResponse } from "next/server";

const mutationMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function secure(response: NextResponse) {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    return response;
}

export function middleware(request: NextRequest) {
    const isApiMutation = request.nextUrl.pathname.startsWith("/api/") && mutationMethods.has(request.method);
    if (isApiMutation) {
        const origin = request.headers.get("origin");
        if (origin && origin !== "null" && origin !== request.nextUrl.origin) {
            return secure(NextResponse.json({ error: "Blocked cross-site request." }, { status: 403 }));
        }
    }

    return secure(NextResponse.next());
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
