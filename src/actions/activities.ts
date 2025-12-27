'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getTenant } from '@/lib/tenant'
import { activitySchema, type ActivityInput } from '@/lib/validations/activity'

export async function getActivities() {
  const tenant = await getTenant()

  return db.activity.findMany({
    where: { tenantId: tenant.id },
    include: {
      contact: true,
      company: true,
      opportunity: true,
      quote: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getActivitiesForEntity(
  type: 'contact' | 'company' | 'opportunity' | 'quote',
  id: string
) {
  const tenant = await getTenant()

  const where: any = { tenantId: tenant.id }

  if (type === 'contact') {
    where.contactId = id
  } else if (type === 'company') {
    where.companyId = id
  } else if (type === 'opportunity') {
    where.opportunityId = id
  } else if (type === 'quote') {
    where.quoteId = id
  }

  return db.activity.findMany({
    where,
    include: {
      contact: true,
      company: true,
      opportunity: true,
      quote: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getActivity(id: string) {
  const tenant = await getTenant()

  return db.activity.findFirst({
    where: { id, tenantId: tenant.id },
    include: {
      contact: true,
      company: true,
      opportunity: true,
      quote: true,
      files: true,
    },
  })
}

export async function createActivity(data: ActivityInput) {
  const tenant = await getTenant()
  
  const transformedData = {
    ...data,
    dueDate: data.dueDate
      ? typeof data.dueDate === 'string'
        ? new Date(data.dueDate)
        : data.dueDate
      : undefined,
  }
  
  const validated = activitySchema.parse(transformedData)

  // Verify related entity belongs to tenant if provided
  if (validated.contactId) {
    const contact = await db.contact.findFirst({
      where: { id: validated.contactId, tenantId: tenant.id },
    })
    if (!contact) {
      throw new Error('Contact not found')
    }
  }

  if (validated.companyId) {
    const company = await db.company.findFirst({
      where: { id: validated.companyId, tenantId: tenant.id },
    })
    if (!company) {
      throw new Error('Company not found')
    }
  }

  if (validated.opportunityId) {
    const opportunity = await db.opportunity.findFirst({
      where: { id: validated.opportunityId, tenantId: tenant.id },
    })
    if (!opportunity) {
      throw new Error('Opportunity not found')
    }
  }

  if (validated.quoteId) {
    const quote = await db.quote.findFirst({
      where: { id: validated.quoteId, tenantId: tenant.id },
    })
    if (!quote) {
      throw new Error('Quote not found')
    }
  }

  const activity = await db.activity.create({
    data: {
      type: validated.type,
      subject: validated.subject,
      description: validated.description,
      contactId: validated.contactId,
      companyId: validated.companyId,
      opportunityId: validated.opportunityId,
      quoteId: validated.quoteId,
      dueDate: validated.dueDate,
      duration: validated.duration,
      tenantId: tenant.id,
    },
  })

  // Revalidate relevant paths
  revalidatePath('/activities')
  if (validated.contactId) revalidatePath(`/contacts/${validated.contactId}`)
  if (validated.companyId) revalidatePath(`/companies/${validated.companyId}`)
  if (validated.opportunityId) revalidatePath(`/opportunities/${validated.opportunityId}`)
  if (validated.quoteId) revalidatePath(`/quotes/${validated.quoteId}`)

  return activity
}

export async function updateActivity(id: string, data: ActivityInput) {
  const tenant = await getTenant()
  
  const transformedData = {
    ...data,
    dueDate: data.dueDate
      ? typeof data.dueDate === 'string'
        ? new Date(data.dueDate)
        : data.dueDate
      : undefined,
  }
  
  const validated = activitySchema.parse(transformedData)

  // Verify activity belongs to tenant
  const existing = await db.activity.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Activity not found')
  }

  // Verify related entities belong to tenant if changed
  if (validated.contactId && validated.contactId !== existing.contactId) {
    const contact = await db.contact.findFirst({
      where: { id: validated.contactId, tenantId: tenant.id },
    })
    if (!contact) {
      throw new Error('Contact not found')
    }
  }

  if (validated.companyId && validated.companyId !== existing.companyId) {
    const company = await db.company.findFirst({
      where: { id: validated.companyId, tenantId: tenant.id },
    })
    if (!company) {
      throw new Error('Company not found')
    }
  }

  if (validated.opportunityId && validated.opportunityId !== existing.opportunityId) {
    const opportunity = await db.opportunity.findFirst({
      where: { id: validated.opportunityId, tenantId: tenant.id },
    })
    if (!opportunity) {
      throw new Error('Opportunity not found')
    }
  }

  if (validated.quoteId && validated.quoteId !== existing.quoteId) {
    const quote = await db.quote.findFirst({
      where: { id: validated.quoteId, tenantId: tenant.id },
    })
    if (!quote) {
      throw new Error('Quote not found')
    }
  }

  const activity = await db.activity.update({
    where: { id },
    data: {
      type: validated.type,
      subject: validated.subject,
      description: validated.description,
      contactId: validated.contactId,
      companyId: validated.companyId,
      opportunityId: validated.opportunityId,
      quoteId: validated.quoteId,
      dueDate: validated.dueDate,
      duration: validated.duration,
    },
  })

  // Revalidate relevant paths
  revalidatePath('/activities')
  if (activity.contactId) revalidatePath(`/contacts/${activity.contactId}`)
  if (activity.companyId) revalidatePath(`/companies/${activity.companyId}`)
  if (activity.opportunityId) revalidatePath(`/opportunities/${activity.opportunityId}`)
  if (activity.quoteId) revalidatePath(`/quotes/${activity.quoteId}`)

  return activity
}

export async function deleteActivity(id: string) {
  const tenant = await getTenant()

  // Verify activity belongs to tenant
  const existing = await db.activity.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Activity not found')
  }

  await db.activity.delete({
    where: { id },
  })

  revalidatePath('/activities')
  if (existing.contactId) revalidatePath(`/contacts/${existing.contactId}`)
  if (existing.companyId) revalidatePath(`/companies/${existing.companyId}`)
  if (existing.opportunityId) revalidatePath(`/opportunities/${existing.opportunityId}`)
  if (existing.quoteId) revalidatePath(`/quotes/${existing.quoteId}`)
}

export async function completeActivity(id: string) {
  const tenant = await getTenant()

  // Verify activity belongs to tenant
  const existing = await db.activity.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Activity not found')
  }

  const activity = await db.activity.update({
    where: { id },
    data: {
      completedAt: new Date(),
    },
  })

  revalidatePath('/activities')
  if (activity.contactId) revalidatePath(`/contacts/${activity.contactId}`)
  if (activity.companyId) revalidatePath(`/companies/${activity.companyId}`)
  if (activity.opportunityId) revalidatePath(`/opportunities/${activity.opportunityId}`)
  if (activity.quoteId) revalidatePath(`/quotes/${activity.quoteId}`)

  return activity
}





