'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getTenant } from '@/lib/tenant'
import { quoteSchema, type QuoteInput } from '@/lib/validations/quote'

export async function getQuotes() {
  const tenant = await getTenant()

  return db.quote.findMany({
    where: { tenantId: tenant.id },
    include: {
      opportunity: true,
      company: true,
      contact: true,
      _count: { select: { lineItems: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getQuote(id: string) {
  const tenant = await getTenant()

  return db.quote.findFirst({
    where: { id, tenantId: tenant.id },
    include: {
      opportunity: true,
      company: true,
      contact: true,
      lineItems: {
        include: { product: { include: { manufacturer: true } } },
        orderBy: { sortOrder: 'asc' },
      },
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      files: true,
    },
  })
}

async function generateQuoteNumber(tenantId: string): Promise<string> {
  const year = new Date().getFullYear()
  const lastQuote = await db.quote.findFirst({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
  })

  let sequence = 1
  if (lastQuote && lastQuote.quoteNumber.startsWith(`Q${year}-`)) {
    const lastSequence = parseInt(lastQuote.quoteNumber.split('-')[1])
    sequence = lastSequence + 1
  }

  return `Q${year}-${sequence.toString().padStart(4, '0')}`
}

export async function createQuote(data: QuoteInput) {
  const tenant = await getTenant()
  
  // Transform the data to handle date strings
  const transformedData = {
    ...data,
    validUntil: data.validUntil
      ? typeof data.validUntil === 'string'
        ? new Date(data.validUntil)
        : data.validUntil
      : undefined,
  }
  
  const validated = quoteSchema.parse(transformedData)

  // Generate quote number if not provided
  const quoteNumber = validated.quoteNumber || await generateQuoteNumber(tenant.id)

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

  // Verify contact belongs to tenant if provided
  if (validated.contactId) {
    const contact = await db.contact.findFirst({
      where: { id: validated.contactId, tenantId: tenant.id },
    })
    if (!contact) {
      throw new Error('Contact not found')
    }
  }

  const quote = await db.quote.create({
    data: {
      quoteNumber,
      status: validated.status,
      opportunityId: validated.opportunityId,
      companyId: validated.companyId,
      contactId: validated.contactId,
      validUntil: validated.validUntil,
      discount: validated.discount,
      tax: validated.tax,
      notes: validated.notes,
      terms: validated.terms,
      subtotal: 0,
      total: 0,
      tenantId: tenant.id,
    },
  })

  revalidatePath('/quotes')
  return quote
}

export async function updateQuote(id: string, data: QuoteInput) {
  const tenant = await getTenant()
  
  // Transform the data to handle date strings
  const transformedData = {
    ...data,
    validUntil: data.validUntil
      ? typeof data.validUntil === 'string'
        ? new Date(data.validUntil)
        : data.validUntil
      : undefined,
  }
  
  const validated = quoteSchema.parse(transformedData)

  // Verify quote belongs to tenant
  const existing = await db.quote.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Quote not found')
  }

  // Verify opportunity belongs to tenant if changed
  if (validated.opportunityId && validated.opportunityId !== existing.opportunityId) {
    const opportunity = await db.opportunity.findFirst({
      where: { id: validated.opportunityId, tenantId: tenant.id },
    })
    if (!opportunity) {
      throw new Error('Opportunity not found')
    }
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
  if (validated.contactId && validated.contactId !== existing.contactId) {
    const contact = await db.contact.findFirst({
      where: { id: validated.contactId, tenantId: tenant.id },
    })
    if (!contact) {
      throw new Error('Contact not found')
    }
  }

  const quote = await db.quote.update({
    where: { id },
    data: {
      quoteNumber: validated.quoteNumber,
      status: validated.status,
      opportunityId: validated.opportunityId,
      companyId: validated.companyId,
      contactId: validated.contactId,
      validUntil: validated.validUntil,
      discount: validated.discount,
      tax: validated.tax,
      notes: validated.notes,
      terms: validated.terms,
    },
  })

  revalidatePath('/quotes')
  revalidatePath(`/quotes/${id}`)
  return quote
}

export async function deleteQuote(id: string) {
  const tenant = await getTenant()

  // Verify quote belongs to tenant
  const existing = await db.quote.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Quote not found')
  }

  await db.quote.delete({
    where: { id },
  })

  revalidatePath('/quotes')
}

export async function updateQuoteStatus(id: string, status: 'DRAFT' | 'SENT' | 'VIEWED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED') {
  const tenant = await getTenant()

  // Verify quote belongs to tenant
  const existing = await db.quote.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Quote not found')
  }

  const quote = await db.quote.update({
    where: { id },
    data: { status },
  })

  revalidatePath('/quotes')
  revalidatePath(`/quotes/${id}`)
  return quote
}

