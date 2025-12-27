'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getTenant } from '@/lib/tenant'
import { contactSchema, type ContactInput } from '@/lib/validations/contact'

export async function getContacts() {
  const tenant = await getTenant()

  return db.contact.findMany({
    where: { tenantId: tenant.id },
    include: { company: true },
    orderBy: { lastName: 'asc' },
  })
}

export async function getContact(id: string) {
  const tenant = await getTenant()

  return db.contact.findFirst({
    where: { id, tenantId: tenant.id },
    include: {
      company: true,
      activities: { orderBy: { createdAt: 'desc' }, take: 10 },
      files: true,
    },
  })
}

export async function createContact(data: ContactInput) {
  const tenant = await getTenant()
  const validated = contactSchema.parse(data)

  const contact = await db.contact.create({
    data: {
      ...validated,
      tenantId: tenant.id,
    },
  })

  revalidatePath('/contacts')
  return contact
}

export async function updateContact(id: string, data: ContactInput) {
  const tenant = await getTenant()
  const validated = contactSchema.parse(data)

  // Verify contact belongs to tenant
  const existing = await db.contact.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Contact not found')
  }

  const contact = await db.contact.update({
    where: { id },
    data: validated,
  })

  revalidatePath('/contacts')
  revalidatePath(`/contacts/${id}`)
  return contact
}

export async function deleteContact(id: string) {
  const tenant = await getTenant()

  // Verify contact belongs to tenant
  const existing = await db.contact.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!existing) {
    throw new Error('Contact not found')
  }

  await db.contact.delete({
    where: { id },
  })

  revalidatePath('/contacts')
}





