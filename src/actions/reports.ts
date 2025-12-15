'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getTenant } from '@/lib/tenant'
import { reportSchema, type ReportInput } from '@/lib/validations/report'

export async function getReports() {
  const tenant = await getTenant()

  return db.report.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getReport(id: string) {
  const tenant = await getTenant()

  return db.report.findFirst({
    where: { id, tenantId: tenant.id },
  })
}

export async function createReport(data: ReportInput) {
  const tenant = await getTenant()
  const validated = reportSchema.parse(data)

  const report = await db.report.create({
    data: {
      name: validated.name,
      type: validated.type,
      description: validated.description,
      filters: validated.filters ? (validated.filters as any) : null,
      columns: validated.columns ? (validated.columns as any) : null,
      groupBy: validated.groupBy,
      sortBy: validated.sortBy,
      sortOrder: validated.sortOrder,
      isScheduled: validated.isScheduled,
      schedule: validated.schedule,
      recipients: validated.recipients,
      isShared: validated.isShared,
      tenantId: tenant.id,
    },
  })

  revalidatePath('/reports')
  return report
}

export async function updateReport(id: string, data: ReportInput) {
  const tenant = await getTenant()
  const validated = reportSchema.parse(data)

  // Verify report belongs to tenant
  const existing = await db.report.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Report not found')
  }

  const report = await db.report.update({
    where: { id },
    data: {
      name: validated.name,
      type: validated.type,
      description: validated.description,
      filters: validated.filters ? (validated.filters as any) : null,
      columns: validated.columns ? (validated.columns as any) : null,
      groupBy: validated.groupBy,
      sortBy: validated.sortBy,
      sortOrder: validated.sortOrder,
      isScheduled: validated.isScheduled,
      schedule: validated.schedule,
      recipients: validated.recipients,
      isShared: validated.isShared,
    },
  })

  revalidatePath('/reports')
  revalidatePath(`/reports/${id}`)
  return report
}

export async function deleteReport(id: string) {
  const tenant = await getTenant()

  // Verify report belongs to tenant
  const existing = await db.report.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Report not found')
  }

  await db.report.delete({
    where: { id },
  })

  revalidatePath('/reports')
}

export async function runReport(id: string) {
  const tenant = await getTenant()

  const report = await db.report.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!report) {
    throw new Error('Report not found')
  }

  // Update last run time
  await db.report.update({
    where: { id },
    data: { lastRunAt: new Date() },
  })

  // TODO: Implement actual report execution based on type
  // This would query the database based on filters and return results
  return { report, data: [] }
}

