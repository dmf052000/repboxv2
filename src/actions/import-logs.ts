'use server'

import { db } from '@/lib/db'
import { getTenant } from '@/lib/tenant'

export async function getImportLogs() {
  const tenant = await getTenant()

  return db.importLog.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
}

export async function createImportLog(data: {
  entityType: string
  fileName: string
  totalRows: number
  successCount: number
  errorCount: number
  errors?: any
  mappingId?: string
  mappingName?: string
  aliasesCreated?: number
}) {
  const tenant = await getTenant()

  return db.importLog.create({
    data: {
      ...data,
      entityType: data.entityType as any,
      tenantId: tenant.id,
    },
  })
}





