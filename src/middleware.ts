import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

export const middleware = async (request: NextRequest) => {
    const accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) return NextResponse.redirect(new URL('/auth/login', request.url));

    try {
        const response = await fetch(`${BASE}/api/v1/users/me`, {
            method: "GET",
            headers: {
                "Content-Type": 'application/json',
                "Authorization": `Bearer ${accessToken}`
            }
        })

        if (!response.ok) return NextResponse.redirect(new URL('/auth/login', request.url));

        const user = await response.json();

        const isAdmin = user.role && user.role.includes("ADMIN");

        if (isAdmin) return NextResponse.next();
        else return NextResponse.redirect(new URL('/forbidden', request.url));
    } catch (e) {
        console.error('Middleware error: ' + e);
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }
}

export const config = {
    matcher: '/admin/:path*'
}