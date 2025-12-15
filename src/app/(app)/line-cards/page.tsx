import { getLineCards } from '@/actions/line-cards'
import { Button } from '@/components/ui/button'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { deleteLineCard } from '@/actions/line-cards'
import { DeleteButtonWrapper } from '@/components/features/delete-button-wrapper'

const statusColors: Record<string, string> = {
  ACTIVE: 'green',
  PENDING: 'blue',
  EXPIRED: 'orange',
  TERMINATED: 'red',
}

export default async function LineCardsPage() {
  const lineCards = await getLineCards()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>Line Cards</Heading>
          <Text className="mt-1">Manage your manufacturer line cards and territories.</Text>
        </div>
        <Button href="/line-cards/new">Add Line Card</Button>
      </div>

      {lineCards.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-zinc-500">No line cards yet. Create your first line card to get started.</Text>
          <Button href="/line-cards/new" className="mt-4">
            Add Line Card
          </Button>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Manufacturer</TableCell>
              <TableCell>Territory</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Commission Rate</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lineCards.map((lineCard) => (
              <TableRow key={lineCard.id}>
                <TableCell>
                  <a
                    href={`/manufacturers/${lineCard.manufacturer.id}`}
                    className="hover:underline text-blue-600 dark:text-blue-400 font-medium"
                  >
                    {lineCard.manufacturer.name}
                  </a>
                </TableCell>
                <TableCell>
                  {lineCard.territory ? (
                    <a
                      href={`/territories/${lineCard.territory.id}`}
                      className="hover:underline text-blue-600 dark:text-blue-400"
                    >
                      {lineCard.territory.name}
                    </a>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <Badge color={statusColors[lineCard.status] as any}>
                    {lineCard.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {lineCard.startDate
                    ? new Date(lineCard.startDate).toLocaleDateString()
                    : '-'}
                </TableCell>
                <TableCell>
                  {lineCard.endDate
                    ? new Date(lineCard.endDate).toLocaleDateString()
                    : '-'}
                </TableCell>
                <TableCell>
                  {lineCard.commissionRate
                    ? `${Number(lineCard.commissionRate).toFixed(2)}%`
                    : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button plain href={`/line-cards/${lineCard.id}`}>
                      View
                    </Button>
                    <DeleteButtonWrapper
                      itemName={`${lineCard.manufacturer.name} line card`}
                      deleteAction={deleteLineCard}
                      id={lineCard.id}
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

