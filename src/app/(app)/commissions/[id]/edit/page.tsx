import { getCommission } from '@/actions/commissions'
import { CommissionForm } from '@/components/forms/commission-form'
import { Heading } from '@/components/ui/heading'
import { notFound } from 'next/navigation'
import { getManufacturersForSelect } from '@/actions/manufacturers'
import { getOpportunities } from '@/actions/opportunities'
import { getCompaniesForSelect } from '@/actions/companies'

export default async function EditCommissionPage({ params }: { params: { id: string } }) {
  const commission = await getCommission(params.id)
  const manufacturers = await getManufacturersForSelect().catch(() => [])
  const opportunities = await getOpportunities().catch(() => [])
  const companies = await getCompaniesForSelect().catch(() => [])

  if (!commission) {
    notFound()
  }

  // Transform database commission to form format
  const formCommission = {
    id: commission.id,
    manufacturerId: commission.manufacturerId,
    opportunityId: commission.opportunityId ?? undefined,
    companyId: commission.companyId ?? undefined,
    invoiceAmount: Number(commission.invoiceAmount),
    commissionRate: Number(commission.commissionRate),
    status: commission.status as any,
    invoiceDate: commission.invoiceDate ?? undefined,
    paidDate: commission.paidDate ?? undefined,
    notes: commission.notes ?? undefined,
  }

  return (
    <div>
      <div className="mb-8">
        <Heading>Edit Commission</Heading>
      </div>
      <CommissionForm
        commission={formCommission}
        manufacturers={manufacturers}
        opportunities={opportunities.map((o) => ({ id: o.id, name: o.name }))}
        companies={companies}
      />
    </div>
  )
}



