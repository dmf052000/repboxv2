import { NextRequest, NextResponse } from 'next/server'
import { parseCSV } from '@/lib/import/csv-parser'
import {
  importContacts,
  importCompanies,
  importProducts,
  importManufacturers,
  importCommissions,
} from '@/actions/import'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string
    const mappingJson = formData.get('mapping') as string
    const resolutionsJson = formData.get('resolutions') as string

    if (!file || !type || !mappingJson) {
      return NextResponse.json(
        { error: 'Missing required fields: file, type, or mapping' },
        { status: 400 }
      )
    }

    const mapping = JSON.parse(mappingJson)
    const resolutions = resolutionsJson ? JSON.parse(resolutionsJson) : {}

    // Parse CSV
    const parsed = await parseCSV(file)

    if (parsed.errors.length > 0) {
      return NextResponse.json(
        { error: 'CSV parsing errors', details: parsed.errors },
        { status: 400 }
      )
    }

    // Import based on type
    let result
    switch (type) {
      case 'contacts':
        result = await importContacts(parsed.rows, mapping)
        break
      case 'companies':
        result = await importCompanies(parsed.rows, mapping)
        break
      case 'products':
        result = await importProducts(parsed.rows, mapping)
        break
      case 'manufacturers':
        result = await importManufacturers(parsed.rows, mapping)
        break
      case 'commissions':
        result = await importCommissions(parsed.rows, mapping, resolutions)
        break
      default:
        return NextResponse.json({ error: 'Invalid import type' }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Import failed', details: error.message },
      { status: 500 }
    )
  }
}

