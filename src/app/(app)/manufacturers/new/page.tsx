import { ManufacturerForm } from '@/components/forms/manufacturer-form'
import { Heading } from '@/components/ui/heading'

export default function NewManufacturerPage() {
  return (
    <div>
      <div className="mb-8">
        <Heading>New Manufacturer</Heading>
      </div>
      <ManufacturerForm />
    </div>
  )
}





