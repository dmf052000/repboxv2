import { headers } from 'next/headers'
import { cache } from 'react'
import { db } from './db'
import { auth } from './auth'

export const getTenant = cache(async () => {
  // First, try to get tenant from session (most reliable)
  const session = await auth()
  if (session?.user && (session.user as any).tenantId) {
    const tenant = await db.tenant.findUnique({
      where: { id: (session.user as any).tenantId },
    })
    if (tenant) {
      return tenant
    }
  }

  // Fallback to header-based resolution (for non-authenticated requests)
  const headersList = await headers()
  const subdomain = headersList.get('x-tenant-subdomain')

  if (!subdomain) {
    throw new Error('No tenant context')
  }

  const tenant = await db.tenant.findUnique({
    where: { subdomain },
  })

  if (!tenant) {
    throw new Error('Tenant not found')
  }

  return tenant
})

