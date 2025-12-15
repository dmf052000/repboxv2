'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getTenant } from '@/lib/tenant'
import { manufacturerSchema, type ManufacturerInput } from '@/lib/validations/manufacturer'

export async function getManufacturers() {
  const tenant = await getTenant()

  return db.manufacturer.findMany({
    where: { tenantId: tenant.id },
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  })
}

export async function getManufacturer(id: string) {
  const tenant = await getTenant()

  return db.manufacturer.findFirst({
    where: { id, tenantId: tenant.id },
    include: {
      products: { orderBy: { name: 'asc' } },
      lineCards: true,
      commissions: { orderBy: { createdAt: 'desc' }, take: 10 },
      files: true,
    },
  })
}

export async function createManufacturer(data: ManufacturerInput) {
  const tenant = await getTenant()
  const validated = manufacturerSchema.parse(data)

  const manufacturer = await db.manufacturer.create({
    data: {
      ...validated,
      tenantId: tenant.id,
    },
  })

  revalidatePath('/manufacturers')
  return manufacturer
}

export async function updateManufacturer(id: string, data: ManufacturerInput) {
  const tenant = await getTenant()
  const validated = manufacturerSchema.parse(data)

  // Verify manufacturer belongs to tenant
  const existing = await db.manufacturer.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Manufacturer not found')
  }

  const manufacturer = await db.manufacturer.update({
    where: { id },
    data: validated,
  })

  revalidatePath('/manufacturers')
  revalidatePath(`/manufacturers/${id}`)
  return manufacturer
}

export async function deleteManufacturer(id: string) {
  const tenant = await getTenant()

  // Verify manufacturer belongs to tenant
  const existing = await db.manufacturer.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Manufacturer not found')
  }

  await db.manufacturer.delete({
    where: { id },
  })

  revalidatePath('/manufacturers')
}

// Simplified version for dropdowns
export async function getManufacturersForSelect() {
  const tenant = await getTenant()

  return db.manufacturer.findMany({
    where: { tenantId: tenant.id },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: 'asc' },
  })
}

