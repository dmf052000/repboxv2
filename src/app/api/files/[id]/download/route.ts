import { NextRequest, NextResponse } from 'next/server'
import { getPresignedUrl } from '@/lib/s3'
import { getTenant } from '@/lib/tenant'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tenant = await getTenant()

    // Get file attachment from database
    const fileAttachment = await db.fileAttachment.findFirst({
      where: {
        id,
        tenantId: tenant.id,
      },
    })

    if (!fileAttachment) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Extract S3 key from URL
    // URL format: https://bucket.s3.region.amazonaws.com/key
    // or: https://bucket.s3.region.amazonaws.com/tenant/entity/id/file
    const urlObj = new URL(fileAttachment.url)
    // Remove leading slash from pathname
    const key = urlObj.pathname.substring(1)

    // Generate presigned URL (valid for 1 hour)
    const presignedUrl = await getPresignedUrl(key, 3600)

    // Redirect to presigned URL
    return NextResponse.redirect(presignedUrl)
  } catch (error: any) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Failed to generate download URL', details: error.message },
      { status: 500 }
    )
  }
}

