import { getQuote } from '@/actions/quotes'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Link } from '@/components/ui/link'
import { Badge } from '@/components/ui/badge'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { ActivityTimeline } from '@/components/features/activity-timeline'
import { FileAttachments } from '@/components/features/file-attachments'
import { getFileAttachments } from '@/actions/file-attachments'

const statusColors: Record<string, string> = {
  DRAFT: 'zinc',
  SENT: 'blue',
  VIEWED: 'indigo',
  ACCEPTED: 'green',
  REJECTED: 'red',
  EXPIRED: 'orange',
}

const statusLabels: Record<string, string> = {
  DRAFT: 'Draft',
  SENT: 'Sent',
  VIEWED: 'Viewed',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
}

export default async function QuoteDetailPage({ params }: { params: { id: string } }) {
  const quote = await getQuote(params.id)
  const files = await getFileAttachments('quote', params.id).catch(() => [])

  if (!quote) {
    notFound()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>Quote {quote.quoteNumber}</Heading>
          <div className="mt-2 flex items-center gap-2">
            <Badge color={statusColors[quote.status] as any}>
              {statusLabels[quote.status]}
            </Badge>
          </div>
        </div>
        <div className="flex gap-3">
          <Button href={`/quotes/${quote.id}/edit`}>Edit</Button>
          <Button href={`/api/quotes/${quote.id}/pdf`} target="_blank">
            Download PDF
          </Button>
          <Button plain href="/quotes">
            Back to Quotes
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 mb-8">
        <DescriptionList>
          <DescriptionTerm>Quote Number</DescriptionTerm>
          <DescriptionDetails>{quote.quoteNumber}</DescriptionDetails>

          <DescriptionTerm>Status</DescriptionTerm>
          <DescriptionDetails>
            <Badge color={statusColors[quote.status] as any}>
              {statusLabels[quote.status]}
            </Badge>
          </DescriptionDetails>

          {quote.opportunity && (
            <>
              <DescriptionTerm>Opportunity</DescriptionTerm>
              <DescriptionDetails>
                <Link href={`/opportunities/${quote.opportunity.id}`}>
                  {quote.opportunity.name}
                </Link>
              </DescriptionDetails>
            </>
          )}

          {quote.company && (
            <>
              <DescriptionTerm>Company</DescriptionTerm>
              <DescriptionDetails>
                <Link href={`/companies/${quote.company.id}`}>
                  {quote.company.name}
                </Link>
              </DescriptionDetails>
            </>
          )}

          {quote.contact && (
            <>
              <DescriptionTerm>Contact</DescriptionTerm>
              <DescriptionDetails>
                <Link href={`/contacts/${quote.contact.id}`}>
                  {quote.contact.firstName} {quote.contact.lastName}
                </Link>
              </DescriptionDetails>
            </>
          )}

          {quote.validUntil && (
            <>
              <DescriptionTerm>Valid Until</DescriptionTerm>
              <DescriptionDetails>
                {new Date(quote.validUntil).toLocaleDateString()}
              </DescriptionDetails>
            </>
          )}

          {quote.notes && (
            <>
              <DescriptionTerm>Notes</DescriptionTerm>
              <DescriptionDetails className="whitespace-pre-wrap">{quote.notes}</DescriptionDetails>
            </>
          )}

          {quote.terms && (
            <>
              <DescriptionTerm>Terms & Conditions</DescriptionTerm>
              <DescriptionDetails className="whitespace-pre-wrap">{quote.terms}</DescriptionDetails>
            </>
          )}
        </DescriptionList>
      </div>

      {/* Line Items Section */}
      {quote.lineItems.length > 0 && (
        <div className="mb-8">
          <Heading level={2}>Line Items ({quote.lineItems.length})</Heading>
          <div className="mt-4 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Price</TableCell>
                  <TableCell>Discount</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quote.lineItems.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>
                      <Link href={`/products/${line.product.id}`}>
                        {line.product.name}
                      </Link>
                      <div className="text-sm text-zinc-500">{line.product.manufacturer.name}</div>
                    </TableCell>
                    <TableCell>{line.description || '-'}</TableCell>
                    <TableCell>{line.quantity}</TableCell>
                    <TableCell>
                      ${Number(line.unitPrice).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {line.discount ? `${Number(line.discount)}%` : '-'}
                    </TableCell>
                    <TableCell>
                      ${Number(line.lineTotal).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals */}
          <div className="mt-4 flex justify-end">
            <div className="w-full max-w-md space-y-2 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex justify-between">
                <Text>Subtotal:</Text>
                <Text>${Number(quote.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
              </div>
              {quote.discount && (
                <div className="flex justify-between">
                  <Text>Discount:</Text>
                  <Text>-${Number(quote.discount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                </div>
              )}
              {quote.tax && (
                <div className="flex justify-between">
                  <Text>Tax:</Text>
                  <Text>${Number(quote.tax).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                </div>
              )}
              <div className="flex justify-between border-t border-zinc-200 pt-2 dark:border-zinc-800">
                <Text className="font-semibold">Total:</Text>
                <Text className="font-semibold">${Number(quote.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Attachments */}
      <div className="mt-8">
        <FileAttachments entityType="quote" entityId={quote.id} files={files} />
      </div>

      {/* Activities Timeline */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <Heading level={2}>Activities</Heading>
          <Button href={`/activities/new?quoteId=${quote.id}`}>Log Activity</Button>
        </div>
        <ActivityTimeline type="quote" id={quote.id} />
      </div>
    </div>
  )
}

