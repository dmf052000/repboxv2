'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getTenant } from '@/lib/tenant'
import { aliasSchema, type AliasInput } from '@/lib/validations/alias'

export async function getAliases() {
  const tenant = await getTenant()

  return db.alias.findMany({
    where: { tenantId: tenant.id },
    include: {
      manufacturer: true,
      product: true,
      company: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getAlias(id: string) {
  const tenant = await getTenant()

  return db.alias.findFirst({
    where: { id, tenantId: tenant.id },
    include: {
      manufacturer: true,
      product: true,
      company: true,
    },
  })
}

export async function createAlias(data: AliasInput) {
  const tenant = await getTenant()
  const validated = aliasSchema.parse(data)

  // Verify related entity belongs to tenant if provided
  if (validated.type === 'MANUFACTURER' && validated.manufacturerId) {
    const manufacturer = await db.manufacturer.findFirst({
      where: { id: validated.manufacturerId, tenantId: tenant.id },
    })
    if (!manufacturer) {
      throw new Error('Manufacturer not found')
    }
  }

  if (validated.type === 'PRODUCT' && validated.productId) {
    const product = await db.product.findFirst({
      where: { id: validated.productId, tenantId: tenant.id },
    })
    if (!product) {
      throw new Error('Product not found')
    }
  }

  if (validated.type === 'COMPANY' && validated.companyId) {
    const company = await db.company.findFirst({
      where: { id: validated.companyId, tenantId: tenant.id },
    })
    if (!company) {
      throw new Error('Company not found')
    }
  }

  const alias = await db.alias.create({
    data: {
      type: validated.type,
      originalName: validated.originalName,
      aliasName: validated.aliasName,
      manufacturerId: validated.manufacturerId,
      productId: validated.productId,
      companyId: validated.companyId,
      notes: validated.notes,
      tenantId: tenant.id,
    },
  })

  revalidatePath('/aliases')
  return alias
}

export async function updateAlias(id: string, data: AliasInput) {
  const tenant = await getTenant()
  const validated = aliasSchema.parse(data)

  // Verify alias belongs to tenant
  const existing = await db.alias.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Alias not found')
  }

  // Verify related entity belongs to tenant if changed
  if (validated.type === 'MANUFACTURER' && validated.manufacturerId) {
    const manufacturer = await db.manufacturer.findFirst({
      where: { id: validated.manufacturerId, tenantId: tenant.id },
    })
    if (!manufacturer) {
      throw new Error('Manufacturer not found')
    }
  }

  if (validated.type === 'PRODUCT' && validated.productId) {
    const product = await db.product.findFirst({
      where: { id: validated.productId, tenantId: tenant.id },
    })
    if (!product) {
      throw new Error('Product not found')
    }
  }

  if (validated.type === 'COMPANY' && validated.companyId) {
    const company = await db.company.findFirst({
      where: { id: validated.companyId, tenantId: tenant.id },
    })
    if (!company) {
      throw new Error('Company not found')
    }
  }

  const alias = await db.alias.update({
    where: { id },
    data: {
      type: validated.type,
      originalName: validated.originalName,
      aliasName: validated.aliasName,
      manufacturerId: validated.manufacturerId,
      productId: validated.productId,
      companyId: validated.companyId,
      notes: validated.notes,
    },
  })

  revalidatePath('/aliases')
  revalidatePath(`/aliases/${id}`)
  return alias
}

export async function deleteAlias(id: string) {
  const tenant = await getTenant()

  // Verify alias belongs to tenant
  const existing = await db.alias.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Alias not found')
  }

  await db.alias.delete({
    where: { id },
  })

  revalidatePath('/aliases')
}

