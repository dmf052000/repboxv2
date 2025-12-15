'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getTenant } from '@/lib/tenant'
import { createContact } from './contacts'
import { createCompany } from './companies'
import { createProduct } from './products'
import { createManufacturer } from './manufacturers'
import { createCommission } from './commissions'
import { getCompaniesForSelect } from './companies'
import { getManufacturersForSelect } from './manufacturers'
import { createImportLog } from './import-logs'

export interface ImportResult {
  success: number
  errors: Array<{ row: number; error: string; data: any }>
}

export async function importContacts(
  data: Array<Record<string, string>>,
  mapping: Record<string, string>
): Promise<ImportResult> {
  const tenant = await getTenant()
  const companies = await getCompaniesForSelect()
  const companyMap = new Map(companies.map((c) => [c.name.toLowerCase(), c.id]))

  const result: ImportResult = { success: 0, errors: [] }

  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    try {
      const contactData: any = {
        firstName: row[mapping.firstName] || '',
        lastName: row[mapping.lastName] || '',
        email: row[mapping.email] || undefined,
        phone: row[mapping.phone] || undefined,
        title: row[mapping.title] || undefined,
      }

      // Handle company lookup
      if (mapping.companyName && row[mapping.companyName]) {
        const companyName = row[mapping.companyName].trim()
        const companyId = companyMap.get(companyName.toLowerCase())
        if (companyId) {
          contactData.companyId = companyId
        }
      }

      await createContact(contactData)
      result.success++
    } catch (error: any) {
      result.errors.push({
        row: i + 2, // +2 because row 1 is header, and arrays are 0-indexed
        error: error.message || 'Unknown error',
        data: row,
      })
    }
  }

  revalidatePath('/contacts')
  
  // Log import
  await createImportLog({
    entityType: 'CONTACT',
    fileName: 'import.csv',
    totalRows: data.length,
    successCount: result.success,
    errorCount: result.errors.length,
    errors: result.errors.length > 0 ? result.errors : undefined,
  })
  
  return result
}

export async function importCompanies(
  data: Array<Record<string, string>>,
  mapping: Record<string, string>
): Promise<ImportResult> {
  const result: ImportResult = { success: 0, errors: [] }

  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    try {
      const companyData: any = {
        name: row[mapping.name] || '',
        website: row[mapping.website] || undefined,
        phone: row[mapping.phone] || undefined,
        address: row[mapping.address] || undefined,
        city: row[mapping.city] || undefined,
        state: row[mapping.state] || undefined,
        zip: row[mapping.zip] || undefined,
        industry: row[mapping.industry] || undefined,
      }

      await createCompany(companyData)
      result.success++
    } catch (error: any) {
      result.errors.push({
        row: i + 2,
        error: error.message || 'Unknown error',
        data: row,
      })
    }
  }

  revalidatePath('/companies')
  
  // Log import
  await createImportLog({
    entityType: 'COMPANY',
    fileName: 'import.csv',
    totalRows: data.length,
    successCount: result.success,
    errorCount: result.errors.length,
    errors: result.errors.length > 0 ? result.errors : undefined,
  })
  
  return result
}

export async function importProducts(
  data: Array<Record<string, string>>,
  mapping: Record<string, string>
): Promise<ImportResult> {
  const tenant = await getTenant()
  const manufacturers = await getManufacturersForSelect()
  const manufacturerMap = new Map(manufacturers.map((m) => [m.name.toLowerCase(), m.id]))

  const result: ImportResult = { success: 0, errors: [] }

  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    try {
      // Find or create manufacturer
      let manufacturerId = ''
      if (mapping.manufacturerName && row[mapping.manufacturerName]) {
        const manufacturerName = row[mapping.manufacturerName].trim()
        manufacturerId = manufacturerMap.get(manufacturerName.toLowerCase()) || ''
        
        if (!manufacturerId) {
          // Create manufacturer if it doesn't exist
          const newManufacturer = await createManufacturer({
            name: manufacturerName,
          })
          manufacturerId = newManufacturer.id
          manufacturerMap.set(manufacturerName.toLowerCase(), manufacturerId)
        }
      }

      if (!manufacturerId) {
        throw new Error('Manufacturer is required')
      }

      const productData: any = {
        name: row[mapping.name] || '',
        sku: row[mapping.sku] || '',
        manufacturerId,
        category: row[mapping.category] || undefined,
        description: row[mapping.description] || undefined,
        unitPrice: row[mapping.unitPrice] ? parseFloat(row[mapping.unitPrice]) : undefined,
        isActive: true,
      }

      await createProduct(productData)
      result.success++
    } catch (error: any) {
      result.errors.push({
        row: i + 2,
        error: error.message || 'Unknown error',
        data: row,
      })
    }
  }

  revalidatePath('/products')
  
  // Log import
  await createImportLog({
    entityType: 'PRODUCT',
    fileName: 'import.csv',
    totalRows: data.length,
    successCount: result.success,
    errorCount: result.errors.length,
    errors: result.errors.length > 0 ? result.errors : undefined,
  })
  
  return result
}

export async function importManufacturers(
  data: Array<Record<string, string>>,
  mapping: Record<string, string>
): Promise<ImportResult> {
  const result: ImportResult = { success: 0, errors: [] }

  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    try {
      const manufacturerData: any = {
        name: row[mapping.name] || '',
        website: row[mapping.website] || undefined,
        phone: row[mapping.phone] || undefined,
        email: row[mapping.email] || undefined,
        primaryContact: row[mapping.primaryContact] || undefined,
      }

      await createManufacturer(manufacturerData)
      result.success++
    } catch (error: any) {
      result.errors.push({
        row: i + 2,
        error: error.message || 'Unknown error',
        data: row,
      })
    }
  }

  revalidatePath('/manufacturers')
  
  // Log import
  await createImportLog({
    entityType: 'MANUFACTURER',
    fileName: 'import.csv',
    totalRows: data.length,
    successCount: result.success,
    errorCount: result.errors.length,
    errors: result.errors.length > 0 ? result.errors : undefined,
  })
  
  return result
}

export async function importCommissions(
  data: Array<Record<string, string>>,
  mapping: Record<string, string>,
  companyResolutions: Record<string, string> = {}
): Promise<ImportResult> {
  const tenant = await getTenant()
  const manufacturers = await getManufacturersForSelect()
  const companies = await getCompaniesForSelect()
  
  const manufacturerMap = new Map(manufacturers.map((m) => [m.name.toLowerCase(), m.id]))
  const companyMap = new Map(companies.map((c) => [c.id, c.id]))
  
  // Add resolved companies to map
  Object.entries(companyResolutions).forEach(([csvName, companyId]) => {
    companyMap.set(csvName.toLowerCase(), companyId)
  })

  const result: ImportResult = { success: 0, errors: [] }

  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    try {
      // Find manufacturer
      let manufacturerId = ''
      if (mapping.manufacturerName && row[mapping.manufacturerName]) {
        const manufacturerName = row[mapping.manufacturerName].trim()
        manufacturerId = manufacturerMap.get(manufacturerName.toLowerCase()) || ''
        
        if (!manufacturerId) {
          throw new Error(`Manufacturer "${manufacturerName}" not found`)
        }
      } else {
        throw new Error('Manufacturer name is required')
      }

      // Find company using resolution map
      let companyId: string | undefined = undefined
      if (mapping.companyName && row[mapping.companyName]) {
        const companyName = row[mapping.companyName].trim()
        companyId = companyMap.get(companyName.toLowerCase())
        
        if (!companyId) {
          throw new Error(`Company "${companyName}" not found and not resolved`)
        }
      }

      const commissionData: any = {
        manufacturerId,
        companyId,
        invoiceAmount: parseFloat(row[mapping.invoiceAmount] || '0'),
        commissionRate: parseFloat(row[mapping.commissionRate] || '0'),
        invoiceDate: row[mapping.invoiceDate] ? new Date(row[mapping.invoiceDate]) : undefined,
        paidDate: row[mapping.paidDate] ? new Date(row[mapping.paidDate]) : undefined,
        status: 'PENDING',
      }

      await createCommission(commissionData)
      result.success++
    } catch (error: any) {
      result.errors.push({
        row: i + 2,
        error: error.message || 'Unknown error',
        data: row,
      })
    }
  }

  revalidatePath('/commissions')
  
  // Log import
  await createImportLog({
    entityType: 'COMMISSION',
    fileName: 'import.csv',
    totalRows: data.length,
    successCount: result.success,
    errorCount: result.errors.length,
    errors: result.errors.length > 0 ? result.errors : undefined,
  })
  
  return result
}

