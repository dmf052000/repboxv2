'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getTenant } from '@/lib/tenant'
import { deleteFile } from '@/lib/s3'

export async function getFileAttachments(
  entityType: string,
  entityId: string
) {
  const tenant = await getTenant()

  const where: any = { tenantId: tenant.id }

  switch (entityType) {
    case 'contact':
      where.contactId = entityId
      break
    case 'company':
      where.companyId = entityId
      break
    case 'manufacturer':
      where.manufacturerId = entityId
      break
    case 'product':
      where.productId = entityId
      break
    case 'opportunity':
      where.opportunityId = entityId
      break
    case 'quote':
      where.quoteId = entityId
      break
    case 'commission':
      where.commissionId = entityId
      break
    case 'activity':
      where.activityId = entityId
      break
    case 'lineCard':
      where.lineCardId = entityId
      break
    case 'territory':
      where.territoryId = entityId
      break
  }

  return db.fileAttachment.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
}

export async function deleteFileAttachment(id: string, entityType: string, entityId: string) {
  const tenant = await getTenant()

  // Verify file attachment belongs to tenant
  const fileAttachment = await db.fileAttachment.findFirst({
    where: { id, tenantId: tenant.id },
  })

  if (!fileAttachment) {
    throw new Error('File attachment not found')
  }

  // Extract key from URL (assuming S3 URL format)
  const urlParts = fileAttachment.url.split('/')
  const key = urlParts.slice(3).join('/') // Remove https://bucket.s3.region.amazonaws.com/

  // Delete from S3
  try {
    await deleteFile(key)
  } catch (error) {
    console.error('Error deleting file from S3:', error)
    // Continue with database deletion even if S3 deletion fails
  }

  // Delete database record
  await db.fileAttachment.delete({
    where: { id },
  })

  // Revalidate relevant paths
  revalidatePath(`/${entityType}s/${entityId}`)
}

