import Papa from 'papaparse'

export interface CSVRow {
  [key: string]: string
}

export interface ParsedCSV {
  headers: string[]
  rows: CSVRow[]
  errors: Papa.ParseError[]
}

export async function parseCSV(file: File): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve({
          headers: results.meta.fields || [],
          rows: results.data as CSVRow[],
          errors: results.errors,
        })
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}

export function generateCSV(data: any[], headers: string[]): string {
  return Papa.unparse({
    fields: headers,
    data: data.map((row) => headers.map((header) => row[header] || '')),
  })
}





