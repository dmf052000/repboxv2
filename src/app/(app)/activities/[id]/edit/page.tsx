import { getActivity } from '@/actions/activities'
import { ActivityForm } from '@/components/forms/activity-form'
import { Heading } from '@/components/ui/heading'
import { notFound } from 'next/navigation'
import { getContacts } from '@/actions/contacts'
import { getCompaniesForSelect } from '@/actions/companies'
import { getOpportunities } from '@/actions/opportunities'
import { getQuotes } from '@/actions/quotes'

export default async function EditActivityPage({ params }: { params: { id: string } }) {
  const activity = await getActivity(params.id)
  const contacts = await getContacts().catch(() => [])
  const companies = await getCompaniesForSelect().catch(() => [])
  const opportunities = await getOpportunities().catch(() => [])
  const quotes = await getQuotes().catch(() => [])

  if (!activity) {
    notFound()
  }

  // Transform database activity to form format
  const formActivity = {
    id: activity.id,
    type: activity.type as any,
    subject: activity.subject,
    description: activity.description ?? undefined,
    contactId: activity.contactId ?? undefined,
    companyId: activity.companyId ?? undefined,
    opportunityId: activity.opportunityId ?? undefined,
    quoteId: activity.quoteId ?? undefined,
    dueDate: activity.dueDate ?? undefined,
    duration: activity.duration ?? undefined,
  }

  return (
    <div>
      <div className="mb-8">
        <Heading>Edit Activity</Heading>
      </div>
      <ActivityForm
        activity={formActivity}
        contacts={contacts.map((c) => ({ id: c.id, firstName: c.firstName, lastName: c.lastName }))}
        companies={companies}
        opportunities={opportunities.map((o) => ({ id: o.id, name: o.name }))}
        quotes={quotes.map((q) => ({ id: q.id, quoteNumber: q.quoteNumber }))}
      />
    </div>
  )
}



