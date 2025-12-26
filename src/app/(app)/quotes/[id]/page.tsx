import { getQuote } from '@/actions/quotes'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading, Subheading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Link } from '@/components/ui/link'
import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
} from '@/components/ui/table'
import { ActivityTimeline } from '@/components/features/activity-timeline'
import { FileAttachments } from '@/components/features/file-attachments'
import { getFileAttachments } from '@/actions/file-attachments'

const statusColors: Record<string, string> = {
  DRAFT: 'zinc',
  SENT: 'blue',
  VIEWED: 'indigo',
  ACCEPTED: 'lime',
  REJECTED: 'pink',
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
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <Heading>Quote {quote.quoteNumber}</Heading>
          <div className="mt-2">
            <Badge color={statusColors[quote.status] as any}>
              {statusLabels[quote.status]}
            </Badge>
          </div>
        </div>
        <div className="flex gap-3">
          <Button outline href={`/api/quotes/${quote.id}/pdf`} target="_blank">
            Download PDF
          </Button>
          <Button className="-my-0.5" href={`/quotes/${quote.id}/edit`}>
            Edit
          </Button>
        </div>
      </div>

      <DescriptionList className="mt-10">
        <DescriptionTerm>Quote number</DescriptionTerm>
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
            <DescriptionTerm>Valid until</DescriptionTerm>
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
            <DescriptionTerm>Terms & conditions</DescriptionTerm>
            <DescriptionDetails className="whitespace-pre-wrap">{quote.terms}</DescriptionDetails>
          </>
        )}
      </DescriptionList>

      {quote.lineItems.length > 0 && (
        <>
          <Divider className="my-10" soft />
          <Subheading>Line items</Subheading>
          <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
            <TableHead>
              <TableRow>
                <TableHeader>Product</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Qty</TableHeader>
                <TableHeader>Unit price</TableHeader>
                <TableHeader>Discount</TableHeader>
                <TableHeader>Total</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {quote.lineItems.map((line) => (
                <TableRow
                  key={line.id}
                  href={`/products/${line.product.id}`}
                  title={line.product.name}
                >
                  <TableCell>
                    <div className="font-medium">{line.product.name}</div>
                    <div className="text-sm text-zinc-500">{line.product.manufacturer.name}</div>
                  </TableCell>
                  <TableCell className="text-zinc-500">{line.description || '-'}</TableCell>
                  <TableCell className="text-zinc-500">{line.quantity}</TableCell>
                  <TableCell className="text-zinc-500">
                    ${Number(line.unitPrice).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-zinc-500">
                    {line.discount ? `${Number(line.discount)}%` : '-'}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${Number(line.lineTotal).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 flex justify-end">
            <dl className="w-full max-w-xs space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-500">Subtotal</dt>
                <dd>${Number(quote.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</dd>
              </div>
              {quote.discount && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Discount</dt>
                  <dd>-${Number(quote.discount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</dd>
                </div>
              )}
              {quote.tax && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Tax</dt>
                  <dd>${Number(quote.tax).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</dd>
                </div>
              )}
              <Divider soft />
              <div className="flex justify-between font-semibold">
                <dt>Total</dt>
                <dd>${Number(quote.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</dd>
              </div>
            </dl>
          </div>
        </>
      )}

      <Divider className="my-10" soft />

      <FileAttachments entityType="quote" entityId={quote.id} files={files} />

      <Divider className="my-10" soft />

      <section className="flex items-end justify-between gap-4">
        <Subheading>Activities</Subheading>
        <Button className="-my-0.5" href={`/activities/new?quoteId=${quote.id}`}>
          Log Activity
        </Button>
      </section>
      <div className="mt-4">
        <ActivityTimeline type="quote" id={quote.id} />
      </div>
    </>
  )
}

