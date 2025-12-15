'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getTenant } from '@/lib/tenant'
import { opportunitySchema, type OpportunityInput } from '@/lib/validations/opportunity'

export async function getOpportunities() {
  const tenant = await getTenant()

  return db.opportunity.findMany({
    where: { tenantId: tenant.id },
    include: {
      company: true,
      primaryContact: true,
      _count: { select: { lineItems: true, quotes: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getOpportunity(id: string) {
  const tenant = await getTenant()

  return db.opportunity.findFirst({
    where: { id, tenantId: tenant.id },
    include: {
      company: true,
      primaryContact: true,
      lineItems: {
        include: { product: { include: { manufacturer: true } } },
        orderBy: { createdAt: 'desc' },
      },
      quotes: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      files: true,
    },
  })
}

export async function createOpportunity(data: OpportunityInput) {
  const tenant = await getTenant()
  
  // Transform the data to handle date strings
  const transformedData = {
    ...data,
    expectedCloseDate: data.expectedCloseDate
      ? typeof data.expectedCloseDate === 'string'
        ? new Date(data.expectedCloseDate)
        : data.expectedCloseDate
      : undefined,
  }
  
  const validated = opportunitySchema.parse(transformedData)

  // Verify company belongs to tenant if provided
  if (validated.companyId) {
    const company = await db.company.findFirst({
      where: { id: validated.companyId, tenantId: tenant.id },
    })
    if (!company) {
      throw new Error('Company not found')
    }
  }

  // Verify contact belongs to tenant if provided
  if (validated.primaryContactId) {
    const contact = await db.contact.findFirst({
      where: { id: validated.primaryContactId, tenantId: tenant.id },
    })
    if (!contact) {
      throw new Error('Contact not found')
    }
  }

  const opportunity = await db.opportunity.create({
    data: {
      name: validated.name,
      value: validated.value,
      stage: validated.stage,
      probability: validated.probability,
      expectedCloseDate: validated.expectedCloseDate,
      companyId: validated.companyId,
      primaryContactId: validated.primaryContactId,
      tenantId: tenant.id,
    },
  })

  revalidatePath('/opportunities')
  return opportunity
}

export async function updateOpportunity(id: string, data: OpportunityInput) {
  const tenant = await getTenant()
  
  // Transform the data to handle date strings
  const transformedData = {
    ...data,
    expectedCloseDate: data.expectedCloseDate
      ? typeof data.expectedCloseDate === 'string'
        ? new Date(data.expectedCloseDate)
        : data.expectedCloseDate
      : undefined,
  }
  
  const validated = opportunitySchema.parse(transformedData)

  // Verify opportunity belongs to tenant
  const existing = await db.opportunity.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Opportunity not found')
  }

  // Verify company belongs to tenant if changed
  if (validated.companyId && validated.companyId !== existing.companyId) {
    const company = await db.company.findFirst({
      where: { id: validated.companyId, tenantId: tenant.id },
    })
    if (!company) {
      throw new Error('Company not found')
    }
  }

  // Verify contact belongs to tenant if changed
  if (validated.primaryContactId && validated.primaryContactId !== existing.primaryContactId) {
    const contact = await db.contact.findFirst({
      where: { id: validated.primaryContactId, tenantId: tenant.id },
    })
    if (!contact) {
      throw new Error('Contact not found')
    }
  }

  const opportunity = await db.opportunity.update({
    where: { id },
    data: {
      name: validated.name,
      value: validated.value,
      stage: validated.stage,
      probability: validated.probability,
      expectedCloseDate: validated.expectedCloseDate,
      companyId: validated.companyId,
      primaryContactId: validated.primaryContactId,
    },
  })

  revalidatePath('/opportunities')
  revalidatePath(`/opportunities/${id}`)
  return opportunity
}

export async function deleteOpportunity(id: string) {
  const tenant = await getTenant()

  // Verify opportunity belongs to tenant
  const existing = await db.opportunity.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Opportunity not found')
  }

  await db.opportunity.delete({
    where: { id },
  })

  revalidatePath('/opportunities')
}

