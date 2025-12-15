'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getTenant } from '@/lib/tenant'
import { productSchema, type ProductInput } from '@/lib/validations/product'

export async function getProducts() {
  const tenant = await getTenant()

  return db.product.findMany({
    where: { tenantId: tenant.id },
    include: { manufacturer: true },
    orderBy: { name: 'asc' },
  })
}

export async function getProduct(id: string) {
  const tenant = await getTenant()

  return db.product.findFirst({
    where: { id, tenantId: tenant.id },
    include: {
      manufacturer: true,
      opportunityLines: {
        include: { opportunity: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      quoteLines: {
        include: { quote: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      files: true,
    },
  })
}

export async function createProduct(data: ProductInput) {
  const tenant = await getTenant()
  const validated = productSchema.parse(data)

  // Verify manufacturer belongs to tenant
  const manufacturer = await db.manufacturer.findFirst({
    where: { id: validated.manufacturerId, tenantId: tenant.id },
  })

  if (!manufacturer) {
    throw new Error('Manufacturer not found')
  }

  const product = await db.product.create({
    data: {
      ...validated,
      tenantId: tenant.id,
    },
  })

  revalidatePath('/products')
  return product
}

export async function updateProduct(id: string, data: ProductInput) {
  const tenant = await getTenant()
  const validated = productSchema.parse(data)

  // Verify product belongs to tenant
  const existing = await db.product.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Product not found')
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

  const product = await db.product.update({
    where: { id },
    data: validated,
  })

  revalidatePath('/products')
  revalidatePath(`/products/${id}`)
  return product
}

export async function deleteProduct(id: string) {
  const tenant = await getTenant()

  // Verify product belongs to tenant
  const existing = await db.product.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Product not found')
  }

  await db.product.delete({
    where: { id },
  })

  revalidatePath('/products')
}

