import { getLineCard } from '@/actions/line-cards'
import { LineCardForm } from '@/components/forms/line-card-form'
import { Heading } from '@/components/ui/heading'
import { notFound } from 'next/navigation'
import { getManufacturersForSelect } from '@/actions/manufacturers'
import { getTerritories } from '@/actions/territories'

export default async function EditLineCardPage({ params }: { params: { id: string } }) {
  const lineCard = await getLineCard(params.id)
  const manufacturers = await getManufacturersForSelect().catch(() => [])
  const territories = await getTerritories().catch(() => [])

  if (!lineCard) {
    notFound()
  }

  // Transform database line card to form format
  const formLineCard = {
    id: lineCard.id,
    manufacturerId: lineCard.manufacturerId,
    territoryId: lineCard.territoryId ?? undefined,
    status: lineCard.status as any,
    startDate: lineCard.startDate ?? undefined,
    endDate: lineCard.endDate ?? undefined,
    commissionRate: lineCard.commissionRate ? Number(lineCard.commissionRate) : undefined,
    notes: lineCard.notes ?? undefined,
    contractUrl: lineCard.contractUrl ?? undefined,
  }

  return (
    <div>
      <div className="mb-8">
        <Heading>Edit Line Card</Heading>
      </div>
      <LineCardForm lineCard={formLineCard} manufacturers={manufacturers} territories={territories} />
    </div>
  )
}

