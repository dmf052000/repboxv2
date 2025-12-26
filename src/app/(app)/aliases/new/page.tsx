import { AliasForm } from '@/components/forms/alias-form'
import { Heading } from '@/components/ui/heading'
import { getManufacturersForSelect } from '@/actions/manufacturers'
import { getProducts } from '@/actions/products'
import { getCompaniesForSelect } from '@/actions/companies'

export default async function NewAliasPage() {
  const manufacturers = await getManufacturersForSelect().catch(() => [])
  const products = await getProducts().catch(() => [])
  const companies = await getCompaniesForSelect().catch(() => [])

  return (
    <div>
      <div className="mb-8">
        <Heading>New Alias</Heading>
      </div>
      <AliasForm
        manufacturers={manufacturers}
        products={products}
        companies={companies}
      />
    </div>
  )
}



