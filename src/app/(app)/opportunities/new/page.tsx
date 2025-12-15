import { OpportunityForm } from '@/components/forms/opportunity-form'
import { Heading } from '@/components/ui/heading'
import { getCompaniesForSelect } from '@/actions/companies'
import { getContacts } from '@/actions/contacts'

export default async function NewOpportunityPage() {
  const companies = await getCompaniesForSelect().catch(() => [])
  const contacts = await getContacts().catch(() => [])

  return (
    <div>
      <div className="mb-8">
        <Heading>New Opportunity</Heading>
      </div>
      <OpportunityForm companies={companies} contacts={contacts} />
    </div>
  )
}

