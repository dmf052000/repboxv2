import { getTerritory } from '@/actions/territories'
import { TerritoryForm } from '@/components/forms/territory-form'
import { Heading } from '@/components/ui/heading'
import { notFound } from 'next/navigation'

export default async function EditTerritoryPage({ params }: { params: { id: string } }) {
  const territory = await getTerritory(params.id)

  if (!territory) {
    notFound()
  }

  // Transform database territory to form format
  const formTerritory = {
    id: territory.id,
    name: territory.name,
    states: territory.states,
    zipCodes: territory.zipCodes,
  }

  return (
    <div>
      <div className="mb-8">
        <Heading>Edit Territory</Heading>
      </div>
      <TerritoryForm territory={formTerritory} />
    </div>
  )
}

