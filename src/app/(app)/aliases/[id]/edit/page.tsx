import { getAlias } from '@/actions/aliases'
import { AliasForm } from '@/components/forms/alias-form'
import { Heading } from '@/components/ui/heading'
import { notFound } from 'next/navigation'
import { getManufacturersForSelect } from '@/actions/manufacturers'
import { getProducts } from '@/actions/products'
import { getCompaniesForSelect } from '@/actions/companies'

export default async function EditAliasPage({ params }: { params: { id: string } }) {
  const alias = await getAlias(params.id)
  const manufacturers = await getManufacturersForSelect().catch(() => [])
  const products = await getProducts().catch(() => [])
  const companies = await getCompaniesForSelect().catch(() => [])

  if (!alias) {
    notFound()
  }

  // Transform database alias to form format
  const formAlias = {
    id: alias.id,
    type: alias.type as any,
    originalName: alias.originalName,
    aliasName: alias.aliasName,
    manufacturerId: alias.manufacturerId ?? undefined,
    productId: alias.productId ?? undefined,
    companyId: alias.companyId ?? undefined,
    notes: alias.notes ?? undefined,
  }

  return (
    <div>
      <div className="mb-8">
        <Heading>Edit Alias</Heading>
      </div>
      <AliasForm
        alias={formAlias}
        manufacturers={manufacturers}
        products={products}
        companies={companies}
      />
    </div>
  )
}

