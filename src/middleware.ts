import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const subdomain = hostname.split('.')[0]

  // Marketing site
  if (subdomain === 'www' || subdomain === 'repbox' || hostname.includes('localhost')) {
    // For localhost development, check for tenant in query or cookie
    const tenantFromQuery = request.nextUrl.searchParams.get('tenant')
    if (tenantFromQuery) {
      const response = NextResponse.next()
      response.headers.set('x-tenant-subdomain', tenantFromQuery)
      return response
    }
    return NextResponse.next()
  }

  // Tenant subdomain
  const response = NextResponse.next()
  response.headers.set('x-tenant-subdomain', subdomain)
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

