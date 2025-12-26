import { getTerritory } from '@/actions/territories'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Link } from '@/components/ui/link'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'

export default async function TerritoryDetailPage({ params }: { params: { id: string } }) {
  const territory = await getTerritory(params.id)

  if (!territory) {
    notFound()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>{territory.name}</Heading>
        </div>
        <div className="flex gap-3">
          <Button href={`/territories/${territory.id}/edit`}>Edit</Button>
          <Button plain href="/territories">
            Back to Territories
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 mb-8">
        <DescriptionList>
          <DescriptionTerm>Territory Name</DescriptionTerm>
          <DescriptionDetails>{territory.name}</DescriptionDetails>

          {territory.states.length > 0 && (
            <>
              <DescriptionTerm>States</DescriptionTerm>
              <DescriptionDetails>
                <div className="flex flex-wrap gap-2">
                  {territory.states.map((state) => (
                    <span
                      key={state}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800"
                    >
                      {state}
                    </span>
                  ))}
                </div>
              </DescriptionDetails>
            </>
          )}

          {territory.zipCodes.length > 0 && (
            <>
              <DescriptionTerm>Zip Codes</DescriptionTerm>
              <DescriptionDetails>
                <div className="flex flex-wrap gap-2">
                  {territory.zipCodes.map((zipCode) => (
                    <span
                      key={zipCode}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800"
                    >
                      {zipCode}
                    </span>
                  ))}
                </div>
              </DescriptionDetails>
            </>
          )}
        </DescriptionList>
      </div>

      {/* Line Cards Section */}
      {territory.lineCards.length > 0 && (
        <div>
          <Heading level={2}>Line Cards ({territory.lineCards.length})</Heading>
          <div className="mt-4 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Manufacturer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {territory.lineCards.map((lineCard) => (
                  <TableRow key={lineCard.id}>
                    <TableCell>
                      <Link href={`/line-cards/${lineCard.id}`}>
                        {lineCard.manufacturer.name}
                      </Link>
                    </TableCell>
                    <TableCell>{lineCard.status}</TableCell>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}



