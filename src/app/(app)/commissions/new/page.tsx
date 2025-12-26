import { CommissionForm } from '@/components/forms/commission-form'
import { Heading } from '@/components/ui/heading'
import { getManufacturersForSelect } from '@/actions/manufacturers'
import { getOpportunities } from '@/actions/opportunities'
import { getCompaniesForSelect } from '@/actions/companies'

export default async function NewCommissionPage() {
  const manufacturers = await getManufacturersForSelect().catch(() => [])
  const opportunities = await getOpportunities().catch(() => [])
  const companies = await getCompaniesForSelect().catch(() => [])

  return (
    <div>
      <div className="mb-8">
        <Heading>New Commission</Heading>
      </div>
      <CommissionForm
        manufacturers={manufacturers}
        opportunities={opportunities.map((o) => ({ id: o.id, name: o.name }))}
        companies={companies}
      />
    </div>
  )
}



