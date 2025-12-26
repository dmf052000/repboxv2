import { getTerritory } from '@/actions/territories'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading, Subheading } from '@/components/ui/heading'
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

const statusColors: Record<string, string> = {
  ACTIVE: 'lime',
  PENDING: 'blue',
  EXPIRED: 'orange',
  TERMINATED: 'pink',
}

export default async function TerritoryDetailPage({ params }: { params: { id: string } }) {
  const territory = await getTerritory(params.id)

  if (!territory) {
    notFound()
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>{territory.name}</Heading>
        <Button className="-my-0.5" href={`/territories/${territory.id}/edit`}>
          Edit
        </Button>
      </div>

      <DescriptionList className="mt-10">
        <DescriptionTerm>Territory name</DescriptionTerm>
        <DescriptionDetails>{territory.name}</DescriptionDetails>

        {territory.states.length > 0 && (
          <>
            <DescriptionTerm>States</DescriptionTerm>
            <DescriptionDetails>
              <div className="flex flex-wrap gap-1">
                {territory.states.map((state) => (
                  <Badge key={state} color="zinc">
                    {state}
                  </Badge>
                ))}
              </div>
            </DescriptionDetails>
          </>
        )}

        {territory.zipCodes.length > 0 && (
          <>
            <DescriptionTerm>Zip codes</DescriptionTerm>
            <DescriptionDetails>
              <div className="flex flex-wrap gap-1">
                {territory.zipCodes.map((zipCode) => (
                  <Badge key={zipCode} color="zinc">
                    {zipCode}
                  </Badge>
                ))}
              </div>
            </DescriptionDetails>
          </>
        )}
      </DescriptionList>

      {territory.lineCards.length > 0 && (
        <>
          <Divider className="my-10" soft />
          <Subheading>Line cards</Subheading>
          <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
            <TableHead>
              <TableRow>
                <TableHeader>Manufacturer</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Start date</TableHeader>
                <TableHeader>End date</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {territory.lineCards.map((lineCard) => (
                <TableRow
                  key={lineCard.id}
                  href={`/line-cards/${lineCard.id}`}
                  title={lineCard.manufacturer.name}
                >
                  <TableCell className="font-medium">{lineCard.manufacturer.name}</TableCell>
                  <TableCell>
                    <Badge color={statusColors[lineCard.status] as any}>
                      {lineCard.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-500">
                    {lineCard.startDate
                      ? new Date(lineCard.startDate).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell className="text-zinc-500">
                    {lineCard.endDate
                      ? new Date(lineCard.endDate).toLocaleDateString()
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </>
  )
}



