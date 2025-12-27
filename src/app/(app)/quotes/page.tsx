import { getQuotes } from '@/actions/quotes'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Heading } from '@/components/ui/heading'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

const statusColors: Record<string, 'zinc' | 'blue' | 'indigo' | 'green' | 'red' | 'orange'> = {
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

export default async function QuotesPage() {
  const quotes = await getQuotes()

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Quotes</Heading>
        <Button className="-my-0.5" href="/quotes/new">
          Create quote
        </Button>
      </div>

      {quotes.length === 0 ? (
        <EmptyState
          icon={<ShoppingCartIcon className="h-8 w-8" />}
          title="No quotes yet"
          description="Get started by creating your first quote."
          action={{
            label: 'Create quote',
            href: '/quotes/new',
          }}
          className="mt-8"
        />
      ) : (
        <Table className="mt-8 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
          <TableHead>
            <TableRow>
              <TableHeader>Quote number</TableHeader>
              <TableHeader>Company</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader className="text-right">Total</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow
                key={quote.id}
                href={`/quotes/${quote.id}`}
                title={`Quote ${quote.quoteNumber}`}
              >
                <TableCell className="font-medium">{quote.quoteNumber}</TableCell>
                <TableCell className="text-zinc-500">
                  {quote.company?.name || '-'}
                </TableCell>
                <TableCell>
                  <Badge color={statusColors[quote.status] || 'zinc'}>
                    {statusLabels[quote.status] || quote.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  ${Number(quote.total).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

