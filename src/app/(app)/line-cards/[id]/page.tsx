import { getLineCard } from '@/actions/line-cards'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Link } from '@/components/ui/link'
import { Badge } from '@/components/ui/badge'

const statusColors: Record<string, string> = {
  ACTIVE: 'lime',
  PENDING: 'blue',
  EXPIRED: 'orange',
  TERMINATED: 'pink',
}

export default async function LineCardDetailPage({ params }: { params: { id: string } }) {
  const lineCard = await getLineCard(params.id)

  if (!lineCard) {
    notFound()
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <Heading>{lineCard.manufacturer.name} Line Card</Heading>
          <div className="mt-2">
            <Badge color={statusColors[lineCard.status] as any}>
              {lineCard.status}
            </Badge>
          </div>
        </div>
        <Button className="-my-0.5" href={`/line-cards/${lineCard.id}/edit`}>
          Edit
        </Button>
      </div>

      <DescriptionList className="mt-10">
        <DescriptionTerm>Manufacturer</DescriptionTerm>
        <DescriptionDetails>
          <Link href={`/manufacturers/${lineCard.manufacturer.id}`}>
            {lineCard.manufacturer.name}
          </Link>
        </DescriptionDetails>

        {lineCard.territory && (
          <>
            <DescriptionTerm>Territory</DescriptionTerm>
            <DescriptionDetails>
              <Link href={`/territories/${lineCard.territory.id}`}>
                {lineCard.territory.name}
              </Link>
            </DescriptionDetails>
          </>
        )}

        <DescriptionTerm>Status</DescriptionTerm>
        <DescriptionDetails>
          <Badge color={statusColors[lineCard.status] as any}>
            {lineCard.status}
          </Badge>
        </DescriptionDetails>

        {lineCard.startDate && (
          <>
            <DescriptionTerm>Start date</DescriptionTerm>
            <DescriptionDetails>
              {new Date(lineCard.startDate).toLocaleDateString()}
            </DescriptionDetails>
          </>
        )}

        {lineCard.endDate && (
          <>
            <DescriptionTerm>End date</DescriptionTerm>
            <DescriptionDetails>
              {new Date(lineCard.endDate).toLocaleDateString()}
            </DescriptionDetails>
          </>
        )}

        {lineCard.commissionRate && (
          <>
            <DescriptionTerm>Commission rate</DescriptionTerm>
            <DescriptionDetails>
              {Number(lineCard.commissionRate).toFixed(2)}%
            </DescriptionDetails>
          </>
        )}

        {lineCard.contractUrl && (
          <>
            <DescriptionTerm>Contract</DescriptionTerm>
            <DescriptionDetails>
              <Link href={lineCard.contractUrl} target="_blank" rel="noopener noreferrer">
                View Contract
              </Link>
            </DescriptionDetails>
          </>
        )}

        {lineCard.notes && (
          <>
            <DescriptionTerm>Notes</DescriptionTerm>
            <DescriptionDetails className="whitespace-pre-wrap">{lineCard.notes}</DescriptionDetails>
          </>
        )}
      </DescriptionList>
    </>
  )
}



