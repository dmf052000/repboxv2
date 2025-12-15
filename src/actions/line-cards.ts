'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getTenant } from '@/lib/tenant'
import { lineCardSchema, type LineCardInput } from '@/lib/validations/line-card'

export async function getLineCards() {
  const tenant = await getTenant()

  return db.lineCard.findMany({
    where: { tenantId: tenant.id },
    include: {
      manufacturer: true,
      territory: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getLineCard(id: string) {
  const tenant = await getTenant()

  return db.lineCard.findFirst({
    where: { id, tenantId: tenant.id },
    include: {
      manufacturer: true,
      territory: true,
      files: true,
    },
  })
}

export async function createLineCard(data: LineCardInput) {
  const tenant = await getTenant()
  
  const transformedData = {
    ...data,
    startDate: data.startDate
      ? typeof data.startDate === 'string'
        ? new Date(data.startDate)
        : data.startDate
      : undefined,
    endDate: data.endDate
      ? typeof data.endDate === 'string'
        ? new Date(data.endDate)
        : data.endDate
      : undefined,
  }
  
  const validated = lineCardSchema.parse(transformedData)

  // Verify manufacturer belongs to tenant
  const manufacturer = await db.manufacturer.findFirst({
    where: { id: validated.manufacturerId, tenantId: tenant.id },
  })

  if (!manufacturer) {
    throw new Error('Manufacturer not found')
  }

  // Verify territory belongs to tenant if provided
  if (validated.territoryId) {
    const territory = await db.territory.findFirst({
      where: { id: validated.territoryId, tenantId: tenant.id },
    })
    if (!territory) {
      throw new Error('Territory not found')
    }
  }

  const lineCard = await db.lineCard.create({
    data: {
      manufacturerId: validated.manufacturerId,
      territoryId: validated.territoryId,
      status: validated.status,
      startDate: validated.startDate,
      endDate: validated.endDate,
      commissionRate: validated.commissionRate,
      notes: validated.notes,
      contractUrl: validated.contractUrl,
      tenantId: tenant.id,
    },
  })

  revalidatePath('/line-cards')
  return lineCard
}

export async function updateLineCard(id: string, data: LineCardInput) {
  const tenant = await getTenant()
  
  const transformedData = {
    ...data,
    startDate: data.startDate
      ? typeof data.startDate === 'string'
        ? new Date(data.startDate)
        : data.startDate
      : undefined,
    endDate: data.endDate
      ? typeof data.endDate === 'string'
        ? new Date(data.endDate)
        : data.endDate
      : undefined,
  }
  
  const validated = lineCardSchema.parse(transformedData)

  // Verify line card belongs to tenant
  const existing = await db.lineCard.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Line card not found')
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

  // Verify territory belongs to tenant if changed
  if (validated.territoryId !== existing.territoryId) {
    if (validated.territoryId) {
      const territory = await db.territory.findFirst({
        where: { id: validated.territoryId, tenantId: tenant.id },
      })
      if (!territory) {
        throw new Error('Territory not found')
      }
    }
  }

  const lineCard = await db.lineCard.update({
    where: { id },
    data: {
      manufacturerId: validated.manufacturerId,
      territoryId: validated.territoryId,
      status: validated.status,
      startDate: validated.startDate,
      endDate: validated.endDate,
      commissionRate: validated.commissionRate,
      notes: validated.notes,
      contractUrl: validated.contractUrl,
    },
  })

  revalidatePath('/line-cards')
  revalidatePath(`/line-cards/${id}`)
  return lineCard
}

export async function deleteLineCard(id: string) {
  const tenant = await getTenant()

  // Verify line card belongs to tenant
  const existing = await db.lineCard.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Line card not found')
  }

  await db.lineCard.delete({
    where: { id },
  })

  revalidatePath('/line-cards')
}

