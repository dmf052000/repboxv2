'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getTenant } from '@/lib/tenant'
import { companySchema, type CompanyInput } from '@/lib/validations/company'

export async function getCompanies() {
  const tenant = await getTenant()

  return db.company.findMany({
    where: { tenantId: tenant.id },
    include: { _count: { select: { contacts: true, opportunities: true } } },
    orderBy: { name: 'asc' },
  })
}

// Simplified version for dropdowns
export async function getCompaniesForSelect() {
  const tenant = await getTenant()

  return db.company.findMany({
    where: { tenantId: tenant.id },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: 'asc' },
  })
}

export async function getCompany(id: string) {
  const tenant = await getTenant()

  return db.company.findFirst({
    where: { id, tenantId: tenant.id },
    include: {
      contacts: { orderBy: { lastName: 'asc' } },
      opportunities: { orderBy: { createdAt: 'desc' }, take: 10 },
      activities: { orderBy: { createdAt: 'desc' }, take: 10 },
      files: true,
    },
  })
}

export async function createCompany(data: CompanyInput) {
  const tenant = await getTenant()
  const validated = companySchema.parse(data)

  const company = await db.company.create({
    data: {
      ...validated,
      tenantId: tenant.id,
    },
  })

  revalidatePath('/companies')
  return company
}

export async function updateCompany(id: string, data: CompanyInput) {
  const tenant = await getTenant()
  const validated = companySchema.parse(data)

  // Verify company belongs to tenant
  const existing = await db.company.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Company not found')
  }

  const company = await db.company.update({
    where: { id },
    data: validated,
  })

  revalidatePath('/companies')
  revalidatePath(`/companies/${id}`)
  return company
}

export async function deleteCompany(id: string) {
  const tenant = await getTenant()

  // Verify company belongs to tenant
  const existing = await db.company.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Company not found')
  }

  await db.company.delete({
    where: { id },
  })

  revalidatePath('/companies')
}
