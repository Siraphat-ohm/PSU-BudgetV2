import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(request: NextRequestWithAuth) {
        const user = request.nextauth;
        const { pathname } = request.nextUrl;
        if ( user ) {
            if ( pathname.startsWith( "/admin") && user.token?.role !== "ADMIN" ) return NextResponse.redirect( new URL( "/budget", request.url) );
        } else {
            return NextResponse.redirect( new URL("/auth/signIn", request.url) );
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        },
    }
)

export const config = { matcher: ["/admin/:path*", "/budget/:path*"] }