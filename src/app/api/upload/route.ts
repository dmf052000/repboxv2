import { NextRequest, NextResponse } from 'next/server'
import { uploadFile, generateFileKey } from '@/lib/s3'
import { getTenant } from '@/lib/tenant'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const tenant = await getTenant()
    const formData = await request.formData()
    const file = formData.get('file') as File
    const entityType = formData.get('entityType') as string
    const entityId = formData.get('entityId') as string

    if (!file || !entityType || !entityId) {
      return NextResponse.json(
        { error: 'Missing required fields: file, entityType, or entityId' },
        { status: 400 }
      )
    }

    // Generate file key
    const fileKey = generateFileKey(tenant.id, entityType, entityId, file.name)

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to S3
    const url = await uploadFile(fileKey, buffer, file.type)

    // Create file attachment record
    const fileAttachment = await db.fileAttachment.create({
      data: {
        tenantId: tenant.id,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        url,
        ...(entityType === 'contact' && { contactId: entityId }),
        ...(entityType === 'company' && { companyId: entityId }),
        ...(entityType === 'manufacturer' && { manufacturerId: entityId }),
        ...(entityType === 'product' && { productId: entityId }),
        ...(entityType === 'opportunity' && { opportunityId: entityId }),
        ...(entityType === 'quote' && { quoteId: entityId }),
        ...(entityType === 'commission' && { commissionId: entityId }),
        ...(entityType === 'activity' && { activityId: entityId }),
        ...(entityType === 'lineCard' && { lineCardId: entityId }),
        ...(entityType === 'territory' && { territoryId: entityId }),
      },
    })

    return NextResponse.json({ success: true, fileAttachment })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    )
  }
}



