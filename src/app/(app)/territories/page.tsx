import { getTerritories } from '@/actions/territories'
import { Button } from '@/components/ui/button'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { deleteTerritory } from '@/actions/territories'
import { DeleteButtonWrapper } from '@/components/features/delete-button-wrapper'

export default async function TerritoriesPage() {
  const territories = await getTerritories()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>Territories</Heading>
          <Text className="mt-1">Manage your sales territories and coverage areas.</Text>
        </div>
        <Button href="/territories/new">Add Territory</Button>
      </div>

      {territories.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-zinc-500">No territories yet. Create your first territory to get started.</Text>
          <Button href="/territories/new" className="mt-4">
            Add Territory
          </Button>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>States</TableCell>
              <TableCell>Zip Codes</TableCell>
              <TableCell>Line Cards</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {territories.map((territory) => (
              <TableRow key={territory.id}>
                <TableCell>
                  <div className="font-medium">{territory.name}</div>
                </TableCell>
                <TableCell>
                  {territory.states.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {territory.states.slice(0, 3).map((state) => (
                        <span
                          key={state}
                          className="rounded bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800"
                        >
                          {state}
                        </span>
                      ))}
                      {territory.states.length > 3 && (
                        <span className="text-xs text-zinc-500">
                          +{territory.states.length - 3} more
                        </span>
                      )}
                    </div>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {territory.zipCodes.length > 0 ? (
                    <div className="text-sm text-zinc-500">
                      {territory.zipCodes.length} zip code{territory.zipCodes.length !== 1 ? 's' : ''}
                    </div>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{territory._count.lineCards}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button plain href={`/territories/${territory.id}`}>
                      View
                    </Button>
                    <DeleteButtonWrapper
                      itemName={territory.name}
                      deleteAction={deleteTerritory}
                      id={territory.id}
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

