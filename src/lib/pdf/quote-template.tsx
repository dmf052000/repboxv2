import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #000',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  quoteNumber: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 100,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1 solid #ddd',
  },
  tableCell: {
    flex: 1,
  },
  totals: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    width: 200,
    marginBottom: 5,
  },
  totalLabel: {
    width: 100,
    textAlign: 'right',
  },
  totalValue: {
    width: 100,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTop: '1 solid #ddd',
    fontSize: 10,
    color: '#666',
  },
})

interface QuotePDFProps {
  quote: {
    quoteNumber: string
    status: string
    company?: { name: string } | null
    contact?: { firstName: string; lastName: string; email?: string | null } | null
    validUntil?: Date | null
    lineItems: Array<{
      product: { name: string; manufacturer: { name: string } }
      description?: string | null
      quantity: number
      unitPrice: any
      discount?: any | null
      lineTotal: any
    }>
    subtotal: any
    discount?: any | null
    tax?: any | null
    total: any
    notes?: string | null
    terms?: string | null
  }
}

export function QuotePDF({ quote }: QuotePDFProps) {
  const formatCurrency = (value: any) => {
    const num = typeof value === 'string' ? parseFloat(value) : Number(value)
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Quote</Text>
          <Text style={styles.quoteNumber}>Quote #{quote.quoteNumber}</Text>
        </View>

        <View style={styles.section}>
          {quote.company && (
            <View style={styles.row}>
              <Text style={styles.label}>Company:</Text>
              <Text style={styles.value}>{quote.company.name}</Text>
            </View>
          )}
          {quote.contact && (
            <View style={styles.row}>
              <Text style={styles.label}>Contact:</Text>
              <Text style={styles.value}>
                {quote.contact.firstName} {quote.contact.lastName}
              </Text>
            </View>
          )}
          {quote.contact?.email && (
            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{quote.contact.email}</Text>
            </View>
          )}
          {quote.validUntil && (
            <View style={styles.row}>
              <Text style={styles.label}>Valid Until:</Text>
              <Text style={styles.value}>
                {new Date(quote.validUntil).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {quote.lineItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Line Items</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, { flex: 2 }]}>Product</Text>
                <Text style={styles.tableCell}>Qty</Text>
                <Text style={styles.tableCell}>Price</Text>
                <Text style={styles.tableCell}>Total</Text>
              </View>
              {quote.lineItems.map((line, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={[styles.tableCell, { flex: 2 }]}>
                    <Text>{line.product.name}</Text>
                    <Text style={{ fontSize: 10, color: '#666' }}>
                      {line.product.manufacturer.name}
                    </Text>
                    {line.description && (
                      <Text style={{ fontSize: 10, color: '#666', marginTop: 2 }}>
                        {line.description}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.tableCell}>{line.quantity}</Text>
                  <Text style={styles.tableCell}>
                    {formatCurrency(line.unitPrice)}
                  </Text>
                  <Text style={styles.tableCell}>
                    {formatCurrency(line.lineTotal)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(quote.subtotal)}</Text>
          </View>
          {quote.discount && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount:</Text>
              <Text style={styles.totalValue}>-{formatCurrency(quote.discount)}</Text>
            </View>
          )}
          {quote.tax && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax:</Text>
              <Text style={styles.totalValue}>{formatCurrency(quote.tax)}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { fontSize: 14 }]}>Total:</Text>
            <Text style={[styles.totalValue, { fontSize: 14 }]}>
              {formatCurrency(quote.total)}
            </Text>
          </View>
        </View>

        {quote.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text>{quote.notes}</Text>
          </View>
        )}

        {quote.terms && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>
            <Text>{quote.terms}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text>Generated on {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  )
}





