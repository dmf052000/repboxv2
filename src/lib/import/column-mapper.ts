export interface ColumnMapping {
  csvColumn: string
  repboxField: string
}

export interface FieldMapping {
  [csvColumn: string]: string
}

// Field mappings for different entity types
export const CONTACT_FIELDS = [
  { value: 'firstName', label: 'First Name' },
  { value: 'lastName', label: 'Last Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'title', label: 'Title' },
  { value: 'companyName', label: 'Company Name' },
]

export const COMPANY_FIELDS = [
  { value: 'name', label: 'Company Name' },
  { value: 'website', label: 'Website' },
  { value: 'phone', label: 'Phone' },
  { value: 'address', label: 'Address' },
  { value: 'city', label: 'City' },
  { value: 'state', label: 'State' },
  { value: 'zip', label: 'ZIP Code' },
  { value: 'industry', label: 'Industry' },
]

export const PRODUCT_FIELDS = [
  { value: 'name', label: 'Product Name' },
  { value: 'sku', label: 'SKU' },
  { value: 'manufacturerName', label: 'Manufacturer Name' },
  { value: 'category', label: 'Category' },
  { value: 'description', label: 'Description' },
  { value: 'unitPrice', label: 'Unit Price' },
]

export const MANUFACTURER_FIELDS = [
  { value: 'name', label: 'Manufacturer Name' },
  { value: 'website', label: 'Website' },
  { value: 'phone', label: 'Phone' },
  { value: 'email', label: 'Email' },
  { value: 'primaryContact', label: 'Primary Contact' },
]

export const COMMISSION_FIELDS = [
  { value: 'manufacturerName', label: 'Manufacturer Name' },
  { value: 'companyName', label: 'Company Name' },
  { value: 'invoiceAmount', label: 'Invoice Amount' },
  { value: 'commissionRate', label: 'Commission Rate (%)' },
  { value: 'invoiceDate', label: 'Invoice Date' },
  { value: 'paidDate', label: 'Paid Date' },
]

export function autoMapColumns(
  csvHeaders: string[],
  repboxFields: Array<{ value: string; label: string }>
): FieldMapping {
  const mapping: FieldMapping = {}

  csvHeaders.forEach((csvHeader) => {
    const normalizedCSV = csvHeader.toLowerCase().trim()
    
    // Try to find exact match first
    const exactMatch = repboxFields.find(
      (field) => field.label.toLowerCase() === normalizedCSV
    )
    
    if (exactMatch) {
      mapping[csvHeader] = exactMatch.value
      return
    }

    // Try partial matches
    const partialMatch = repboxFields.find((field) => {
      const normalizedField = field.label.toLowerCase()
      return (
        normalizedCSV.includes(normalizedField) ||
        normalizedField.includes(normalizedCSV)
      )
    })

    if (partialMatch) {
      mapping[csvHeader] = partialMatch.value
    }
  })

  return mapping
}



