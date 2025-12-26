import { getLineCards } from '@/actions/line-cards'
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

const statusColors: Record<string, 'green' | 'blue' | 'orange' | 'red'> = {
  ACTIVE: 'green',
  PENDING: 'blue',
  EXPIRED: 'orange',
  TERMINATED: 'red',
}

export default async function LineCardsPage() {
  const lineCards = await getLineCards()

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Line Cards</Heading>
        <Button className="-my-0.5" href="/line-cards/new">
          Add line card
        </Button>
      </div>

      {lineCards.length === 0 ? (
        <div className="mt-8 text-center text-zinc-500">
          No line cards yet. Create your first line card to get started.
        </div>
      ) : (
        <Table className="mt-8 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
          <TableHead>
            <TableRow>
              <TableHeader>Manufacturer</TableHeader>
              <TableHeader>Territory</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader className="text-right">Commission</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {lineCards.map((lineCard) => (
              <TableRow
                key={lineCard.id}
                href={`/line-cards/${lineCard.id}`}
                title={`${lineCard.manufacturer.name} line card`}
              >
                <TableCell className="font-medium">
                  {lineCard.manufacturer.name}
                </TableCell>
                <TableCell className="text-zinc-500">
                  {lineCard.territory?.name || '-'}
                </TableCell>
                <TableCell>
                  <Badge color={statusColors[lineCard.status] || 'blue'}>
                    {lineCard.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {lineCard.commissionRate
                    ? `${Number(lineCard.commissionRate).toFixed(2)}%`
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

