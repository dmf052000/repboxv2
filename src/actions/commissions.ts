'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getTenant } from '@/lib/tenant'
import { commissionSchema, type CommissionInput } from '@/lib/validations/commission'

export async function getCommissions() {
  const tenant = await getTenant()

  return db.commission.findMany({
    where: { tenantId: tenant.id },
    include: {
      manufacturer: true,
      opportunity: true,
      company: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getCommission(id: string) {
  const tenant = await getTenant()

  return db.commission.findFirst({
    where: { id, tenantId: tenant.id },
    include: {
      manufacturer: true,
      opportunity: true,
      company: true,
      files: true,
    },
  })
}

export async function createCommission(data: CommissionInput) {
  const tenant = await getTenant()
  
  const transformedData = {
    ...data,
    invoiceDate: data.invoiceDate
      ? typeof data.invoiceDate === 'string'
        ? new Date(data.invoiceDate)
        : data.invoiceDate
      : undefined,
    paidDate: data.paidDate
      ? typeof data.paidDate === 'string'
        ? new Date(data.paidDate)
        : data.paidDate
      : undefined,
  }
  
  const validated = commissionSchema.parse(transformedData)

  // Calculate commission amount
  const commissionAmount = (validated.invoiceAmount * validated.commissionRate) / 100

  // Verify manufacturer belongs to tenant
  const manufacturer = await db.manufacturer.findFirst({
    where: { id: validated.manufacturerId, tenantId: tenant.id },
  })

  if (!manufacturer) {
    throw new Error('Manufacturer not found')
  }

  // Verify opportunity belongs to tenant if provided
  if (validated.opportunityId) {
    const opportunity = await db.opportunity.findFirst({
      where: { id: validated.opportunityId, tenantId: tenant.id },
    })
    if (!opportunity) {
      throw new Error('Opportunity not found')
    }
  }

  // Verify company belongs to tenant if provided
  if (validated.companyId) {
    const company = await db.company.findFirst({
      where: { id: validated.companyId, tenantId: tenant.id },
    })
    if (!company) {
      throw new Error('Company not found')
    }
  }

  const commission = await db.commission.create({
    data: {
      manufacturerId: validated.manufacturerId,
      opportunityId: validated.opportunityId,
      companyId: validated.companyId,
      invoiceAmount: validated.invoiceAmount,
      commissionRate: validated.commissionRate,
      commissionAmount,
      status: validated.status,
      invoiceDate: validated.invoiceDate,
      paidDate: validated.paidDate,
      notes: validated.notes,
      tenantId: tenant.id,
    },
  })

  revalidatePath('/commissions')
  return commission
}

export async function updateCommission(id: string, data: CommissionInput) {
  const tenant = await getTenant()
  
  const transformedData = {
    ...data,
    invoiceDate: data.invoiceDate
      ? typeof data.invoiceDate === 'string'
        ? new Date(data.invoiceDate)
        : data.invoiceDate
      : undefined,
    paidDate: data.paidDate
      ? typeof data.paidDate === 'string'
        ? new Date(data.paidDate)
        : data.paidDate
      : undefined,
  }
  
  const validated = commissionSchema.parse(transformedData)

  // Calculate commission amount
  const commissionAmount = (validated.invoiceAmount * validated.commissionRate) / 100

  // Verify commission belongs to tenant
  const existing = await db.commission.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Commission not found')
  }

  // Verify manufacturer belongs to tenant if changed
  if (validated.manufacturerId !== existing.manufacturerId) {
    const manufacturer = await db.manufacturer.findFirst({
      where: { id: validated.manufacturerId, tenantId: tenant.id },
    })
    if (!manufacturer) {
      throw new Error('Manufacturer not found')
    }
  }

  // Verify opportunity belongs to tenant if changed
  if (validated.opportunityId !== existing.opportunityId) {
    if (validated.opportunityId) {
      const opportunity = await db.opportunity.findFirst({
        where: { id: validated.opportunityId, tenantId: tenant.id },
      })
      if (!opportunity) {
        throw new Error('Opportunity not found')
      }
    }
  }

  // Verify company belongs to tenant if changed
  if (validated.companyId !== existing.companyId) {
    if (validated.companyId) {
      const company = await db.company.findFirst({
        where: { id: validated.companyId, tenantId: tenant.id },
      })
      if (!company) {
        throw new Error('Company not found')
      }
    }
  }

  const commission = await db.commission.update({
    where: { id },
    data: {
      manufacturerId: validated.manufacturerId,
      opportunityId: validated.opportunityId,
      companyId: validated.companyId,
      invoiceAmount: validated.invoiceAmount,
      commissionRate: validated.commissionRate,
      commissionAmount,
      status: validated.status,
      invoiceDate: validated.invoiceDate,
      paidDate: validated.paidDate,
      notes: validated.notes,
    },
  })

  revalidatePath('/commissions')
  revalidatePath(`/commissions/${id}`)
  return commission
}

export async function deleteCommission(id: string) {
  const tenant = await getTenant()

  // Verify commission belongs to tenant
  const existing = await db.commission.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Commission not found')
  }

  await db.commission.delete({
    where: { id },
  })

  revalidatePath('/commissions')
}



