import { getTerritories } from '@/actions/territories'
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

export default async function TerritoriesPage() {
  const territories = await getTerritories()

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Territories</Heading>
        <Button className="-my-0.5" href="/territories/new">
          Add territory
        </Button>
      </div>

      {territories.length === 0 ? (
        <div className="mt-8 text-center text-zinc-500">
          No territories yet. Create your first territory to get started.
        </div>
      ) : (
        <Table className="mt-8 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>States</TableHeader>
              <TableHeader className="text-right">Line Cards</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {territories.map((territory) => (
              <TableRow
                key={territory.id}
                href={`/territories/${territory.id}`}
                title={territory.name}
              >
                <TableCell className="font-medium">{territory.name}</TableCell>
                <TableCell className="text-zinc-500">
                  {territory.states.length > 0
                    ? territory.states.slice(0, 5).join(', ') +
                      (territory.states.length > 5 ? ` +${territory.states.length - 5}` : '')
                    : '-'}
                </TableCell>
                <TableCell className="text-right">
                  {territory._count.lineCards}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

