import { ActivityForm } from '@/components/forms/activity-form'
import { Heading } from '@/components/ui/heading'
import { getContacts } from '@/actions/contacts'
import { getCompaniesForSelect } from '@/actions/companies'
import { getOpportunities } from '@/actions/opportunities'
import { getQuotes } from '@/actions/quotes'

export default async function NewActivityPage() {
  const contacts = await getContacts().catch(() => [])
  const companies = await getCompaniesForSelect().catch(() => [])
  const opportunities = await getOpportunities().catch(() => [])
  const quotes = await getQuotes().catch(() => [])

  return (
    <div>
      <div className="mb-8">
        <Heading>Log Activity</Heading>
      </div>
      <ActivityForm
        contacts={contacts.map((c) => ({ id: c.id, firstName: c.firstName, lastName: c.lastName }))}
        companies={companies}
        opportunities={opportunities.map((o) => ({ id: o.id, name: o.name }))}
        quotes={quotes.map((q) => ({ id: q.id, quoteNumber: q.quoteNumber }))}
      />
    </div>
  )
}





