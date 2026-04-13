import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {

  const token = request.cookies.get("auth_token")?.value
 
  // Define the protected paths
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/projects")

  // If it's a protected route and there's no token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url)

    // Optional: Pass the current path so you can redirect back after login
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Configure the Matcher
export const config = {
  matcher: [
    // Protect everything under /projects
    "/projects/:path*",
    // Protect other specific routes
    "/dashboard/:path*",
    // Exclude static assets
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
