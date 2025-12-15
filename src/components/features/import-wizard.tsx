'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, Fieldset, Label } from '@/components/ui/fieldset'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { parseCSV, type ParsedCSV } from '@/lib/import/csv-parser'
import {
  autoMapColumns,
  CONTACT_FIELDS,
  COMPANY_FIELDS,
  PRODUCT_FIELDS,
  MANUFACTURER_FIELDS,
  COMMISSION_FIELDS,
  type FieldMapping,
} from '@/lib/import/column-mapper'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'

type ImportType = 'contacts' | 'companies' | 'products' | 'manufacturers' | 'commissions'

const FIELD_OPTIONS: Record<ImportType, Array<{ value: string; label: string }>> = {
  contacts: CONTACT_FIELDS,
  companies: COMPANY_FIELDS,
  products: PRODUCT_FIELDS,
  manufacturers: MANUFACTURER_FIELDS,
  commissions: COMMISSION_FIELDS,
}

export function ImportWizard() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [importType, setImportType] = useState<ImportType>('contacts')
  const [file, setFile] = useState<File | null>(null)
  const [parsed, setParsed] = useState<ParsedCSV | null>(null)
  const [mapping, setMapping] = useState<FieldMapping>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: number; errors: Array<{ row: number; error: string }> } | null>(null)

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setLoading(true)

    try {
      const parsedCSV = await parseCSV(selectedFile)
      setParsed(parsedCSV)

      // Auto-map columns
      const autoMapping = autoMapColumns(parsedCSV.headers, FIELD_OPTIONS[importType])
      setMapping(autoMapping)

      setStep(2)
    } catch (error: any) {
      alert(`Error parsing CSV: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  function handleMappingChange(csvColumn: string, repboxField: string) {
    setMapping((prev) => ({
      ...prev,
      [csvColumn]: repboxField,
    }))
  }

  async function handleImport() {
    if (!file || !parsed) return

    setLoading(true)
    setStep(4)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', importType)
      formData.append('mapping', JSON.stringify(mapping))

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Import failed')
      }

      setResult(data)
    } catch (error: any) {
      alert(`Import error: ${error.message}`)
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Heading>Import Data</Heading>
        <Text className="mt-1">Import contacts, companies, products, manufacturers, or commissions from CSV.</Text>
      </div>

      {/* Step 1: Select Type & Upload */}
      {step === 1 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <Fieldset>
            <Field>
              <Label>Import Type</Label>
              <select
                value={importType}
                onChange={(e) => setImportType(e.target.value as ImportType)}
                className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
              >
                <option value="contacts">Contacts</option>
                <option value="companies">Companies</option>
                <option value="products">Products</option>
                <option value="manufacturers">Manufacturers</option>
                <option value="commissions">Commissions</option>
              </select>
            </Field>

            <Field>
              <Label>CSV File</Label>
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={loading}
              />
            </Field>
          </Fieldset>
        </div>
      )}

      {/* Step 2: Map Columns */}
      {step === 2 && parsed && (
        <div className="space-y-6">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <Heading level={2}>Map Columns</Heading>
            <Text className="mt-1 mb-4">Map your CSV columns to RepBox fields.</Text>

            <div className="space-y-4">
              {parsed.headers.map((header) => (
                <Field key={header}>
                  <Label>{header}</Label>
                  <select
                    value={mapping[header] || ''}
                    onChange={(e) => handleMappingChange(header, e.target.value)}
                    className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
                  >
                    <option value="">-- Skip this column --</option>
                    {FIELD_OPTIONS[importType].map((field) => (
                      <option key={field.value} value={field.value}>
                        {field.label}
                      </option>
                    ))}
                  </select>
                </Field>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button plain onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)}>Preview</Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 3 && parsed && (
        <div className="space-y-6">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <Heading level={2}>Preview</Heading>
            <Text className="mt-1 mb-4">Preview of mapped data (first 5 rows):</Text>

            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    {FIELD_OPTIONS[importType].map((field) => (
                      <TableCell key={field.value}>{field.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parsed.rows.slice(0, 5).map((row, idx) => (
                    <TableRow key={idx}>
                      {FIELD_OPTIONS[importType].map((field) => {
                        const csvColumn = Object.keys(mapping).find((k) => mapping[k] === field.value)
                        return (
                          <TableCell key={field.value}>
                            {csvColumn ? row[csvColumn] || '-' : '-'}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button plain onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={handleImport} disabled={loading}>
                {loading ? 'Importing...' : 'Import'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && result && (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <Heading level={2}>Import Complete</Heading>
          <div className="mt-4 space-y-2">
            <Text>
              <strong>Successfully imported:</strong> {result.success} records
            </Text>
            {result.errors.length > 0 && (
              <div className="mt-4">
                <Text className="font-medium text-red-600 dark:text-red-400">
                  Errors: {result.errors.length}
                </Text>
                <div className="mt-2 max-h-64 overflow-y-auto">
                  {result.errors.map((error, idx) => (
                    <div key={idx} className="text-sm text-red-600 dark:text-red-400 mb-1">
                      Row {error.row}: {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={() => {
              setStep(1)
              setFile(null)
              setParsed(null)
              setMapping({})
              setResult(null)
            }}>
              Import Another
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

