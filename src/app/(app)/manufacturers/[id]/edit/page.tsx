import { getManufacturer } from '@/actions/manufacturers'
import { ManufacturerForm } from '@/components/forms/manufacturer-form'
import { Heading } from '@/components/ui/heading'
import { notFound } from 'next/navigation'

export default async function EditManufacturerPage({ params }: { params: { id: string } }) {
  const manufacturer = await getManufacturer(params.id)

  if (!manufacturer) {
    notFound()
  }

  // Transform database manufacturer to form format (null -> undefined)
  const formManufacturer = {
    id: manufacturer.id,
    name: manufacturer.name,
    logo: manufacturer.logo ?? undefined,
    website: manufacturer.website ?? undefined,
    primaryContact: manufacturer.primaryContact ?? undefined,
    phone: manufacturer.phone ?? undefined,
    email: manufacturer.email ?? undefined,
    notes: manufacturer.notes ?? undefined,
  }

  return (
    <div>
      <div className="mb-8">
        <Heading>Edit Manufacturer</Heading>
      </div>
      <ManufacturerForm manufacturer={formManufacturer} />
    </div>
  )
}





