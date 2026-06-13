import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { 
  publicRoutes, 
  authRoutes, 
  protectedRoutes, 
  DEFAULT_LOGIN_REDIRECT 
} from "./lib/routes"

export function proxy(request: NextRequest) {
  const { nextUrl } = request
  
  // Check if user is authenticated via refreshToken cookie
  // Note: Backend sets this as httpOnly, but middleware can still check for its existence
  const isAuthenticated = request.cookies.has("refreshToken")

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  
  // Check if route is protected (starts with any of the protected prefixes)
  const isProtectedRoute = protectedRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  )

  // 1. If it's an API auth route, don't interfere
  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  // 2. If it's an Auth route (login/register)
  if (isAuthRoute) {
    if (isAuthenticated) {
      // Redirect to dashboard if already logged in
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return NextResponse.next()
  }

  // 3. If it's a Protected route
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to landing or login if not authenticated
    // User requested "get to the landing page if they are not authenticated"
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  // 4. Special case: If authenticated and trying to access landing page
  if (nextUrl.pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
  }

  return NextResponse.next()
}

// Optionally, specify which paths should be processed by the middleware
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
