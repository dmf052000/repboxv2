'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getTenant } from '@/lib/tenant'
import { territorySchema, type TerritoryInput } from '@/lib/validations/territory'

export async function getTerritories() {
  const tenant = await getTenant()

  return db.territory.findMany({
    where: { tenantId: tenant.id },
    include: { _count: { select: { lineCards: true } } },
    orderBy: { name: 'asc' },
  })
}

export async function getTerritory(id: string) {
  const tenant = await getTenant()

  return db.territory.findFirst({
    where: { id, tenantId: tenant.id },
    include: {
      lineCards: {
        include: { manufacturer: true },
        orderBy: { createdAt: 'desc' },
      },
      files: true,
    },
  })
}

export async function createTerritory(data: TerritoryInput) {
  const tenant = await getTenant()
  const validated = territorySchema.parse(data)

  const territory = await db.territory.create({
    data: {
      name: validated.name,
      states: validated.states,
      zipCodes: validated.zipCodes,
      tenantId: tenant.id,
    },
  })

  revalidatePath('/territories')
  return territory
}

export async function updateTerritory(id: string, data: TerritoryInput) {
  const tenant = await getTenant()
  const validated = territorySchema.parse(data)

  // Verify territory belongs to tenant
  const existing = await db.territory.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Territory not found')
  }

  const territory = await db.territory.update({
    where: { id },
    data: {
      name: validated.name,
      states: validated.states,
      zipCodes: validated.zipCodes,
    },
  })

  revalidatePath('/territories')
  revalidatePath(`/territories/${id}`)
  return territory
}

export async function deleteTerritory(id: string) {
  const tenant = await getTenant()

  // Verify territory belongs to tenant
  const existing = await db.territory.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Territory not found')
  }

  await db.territory.delete({
    where: { id },
  })

  revalidatePath('/territories')
}

