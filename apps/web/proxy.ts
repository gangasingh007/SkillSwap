import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define the route segments that correspond to the (dashboard) route group
const protectedPaths = [
  '/admin',
  '/dashboard',
  '/listings',
  '/orders',
  '/wallet'
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the current path starts with any of the protected paths
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )
  
  if (isProtectedPath) {
    // Check if the user has a refreshToken cookie
    const refreshToken = request.cookies.get('refreshToken')
    
    if (!refreshToken) {
      // Redirect unauthenticated users to the login page
      const loginUrl = new URL('/login', request.url)
      // Optionally preserve the URL they were trying to access
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
