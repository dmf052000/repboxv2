import { QuoteForm } from '@/components/forms/quote-form'
import { Heading } from '@/components/ui/heading'
import { getOpportunities } from '@/actions/opportunities'
import { getCompaniesForSelect } from '@/actions/companies'
import { getContacts } from '@/actions/contacts'

export default async function NewQuotePage() {
  const opportunities = await getOpportunities().catch(() => [])
  const companies = await getCompaniesForSelect().catch(() => [])
  const contacts = await getContacts().catch(() => [])

  return (
    <div>
      <div className="mb-8">
        <Heading>New Quote</Heading>
      </div>
      <QuoteForm
        opportunities={opportunities.map((o) => ({ id: o.id, name: o.name }))}
        companies={companies}
        contacts={contacts.map((c) => ({
          id: c.id,
          firstName: c.firstName,
          lastName: c.lastName,
          companyId: c.companyId,
        }))}
      />
    </div>
  )
}

