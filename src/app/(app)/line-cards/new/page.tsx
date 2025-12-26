import { LineCardForm } from '@/components/forms/line-card-form'
import { Heading } from '@/components/ui/heading'
import { getManufacturersForSelect } from '@/actions/manufacturers'
import { getTerritories } from '@/actions/territories'

export default async function NewLineCardPage() {
  const manufacturers = await getManufacturersForSelect().catch(() => [])
  const territories = await getTerritories().catch(() => [])

  return (
    <div>
      <div className="mb-8">
        <Heading>New Line Card</Heading>
      </div>
      <LineCardForm manufacturers={manufacturers} territories={territories} />
    </div>
  )
}



