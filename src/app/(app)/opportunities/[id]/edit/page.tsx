import { getOpportunity } from '@/actions/opportunities'
import { OpportunityForm } from '@/components/forms/opportunity-form'
import { Heading } from '@/components/ui/heading'
import { notFound } from 'next/navigation'
import { getCompaniesForSelect } from '@/actions/companies'
import { getContacts } from '@/actions/contacts'

export default async function EditOpportunityPage({ params }: { params: { id: string } }) {
  const opportunity = await getOpportunity(params.id)
  const companies = await getCompaniesForSelect().catch(() => [])
  const contacts = await getContacts().catch(() => [])

  if (!opportunity) {
    notFound()
  }

  // Transform database opportunity to form format
  const formOpportunity = {
    id: opportunity.id,
    name: opportunity.name,
    value: opportunity.value ? Number(opportunity.value) : undefined,
    stage: opportunity.stage as any,
    probability: opportunity.probability ?? undefined,
    expectedCloseDate: opportunity.expectedCloseDate ?? undefined,
    companyId: opportunity.companyId ?? undefined,
    primaryContactId: opportunity.primaryContactId ?? undefined,
  }

  return (
    <div>
      <div className="mb-8">
        <Heading>Edit Opportunity</Heading>
      </div>
      <OpportunityForm opportunity={formOpportunity} companies={companies} contacts={contacts} />
    </div>
  )
}

