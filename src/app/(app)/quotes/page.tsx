import { getQuotes } from '@/actions/quotes'
import { Button } from '@/components/ui/button'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { deleteQuote } from '@/actions/quotes'
import { DeleteButtonWrapper } from '@/components/features/delete-button-wrapper'

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

export default async function QuotesPage() {
  const quotes = await getQuotes()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>Quotes</Heading>
          <Text className="mt-1">Manage your quotes and proposals.</Text>
        </div>
        <Button href="/quotes/new">Add Quote</Button>
      </div>

      {quotes.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-zinc-500">No quotes yet. Create your first quote to get started.</Text>
          <Button href="/quotes/new" className="mt-4">
            Add Quote
          </Button>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Quote Number</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Opportunity</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Valid Until</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell>
                  <div className="font-medium">{quote.quoteNumber}</div>
                </TableCell>
                <TableCell>
                  {quote.company ? (
                    <a
                      href={`/companies/${quote.company.id}`}
                      className="hover:underline text-blue-600 dark:text-blue-400"
                    >
                      {quote.company.name}
                    </a>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {quote.contact ? (
                    <a
                      href={`/contacts/${quote.contact.id}`}
                      className="hover:underline text-blue-600 dark:text-blue-400"
                    >
                      {quote.contact.firstName} {quote.contact.lastName}
                    </a>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {quote.opportunity ? (
                    <a
                      href={`/opportunities/${quote.opportunity.id}`}
                      className="hover:underline text-blue-600 dark:text-blue-400"
                    >
                      {quote.opportunity.name}
                    </a>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  ${Number(quote.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  <Badge color={statusColors[quote.status] as any}>
                    {statusLabels[quote.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {quote.validUntil
                    ? new Date(quote.validUntil).toLocaleDateString()
                    : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button plain href={`/quotes/${quote.id}`}>
                      View
                    </Button>
                    <DeleteButtonWrapper
                      itemName={quote.quoteNumber}
                      deleteAction={deleteQuote}
                      id={quote.id}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

