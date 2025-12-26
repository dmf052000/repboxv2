import { TerritoryForm } from '@/components/forms/territory-form'
import { Heading } from '@/components/ui/heading'

export default function NewTerritoryPage() {
  return (
    <div>
      <div className="mb-8">
        <Heading>New Territory</Heading>
      </div>
      <TerritoryForm />
    </div>
  )
}



