import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(request: NextRequestWithAuth) {
        const user = request.nextauth;
        const { pathname } = request.nextUrl;
        
        if ( user ) {
            if ( pathname.startsWith( "/dashboard") && user.token?.role !== "ADMIN" ) {
                return NextResponse.redirect( new URL( "/budget", request.url) );
            } else if ( pathname.startsWith( "/budget") && user.token?.role !== "USER" ) {
                return NextResponse.redirect( new URL( "/dashboard", request.url) );
            }
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

export const config = { matcher: ["/dashboard", "/dashboard/:path*", "/budget/:path*", "/budget"] } 