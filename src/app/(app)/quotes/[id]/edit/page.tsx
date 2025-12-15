import { getQuote } from '@/actions/quotes'
import { QuoteForm } from '@/components/forms/quote-form'
import { Heading } from '@/components/ui/heading'
import { notFound } from 'next/navigation'
import { getOpportunities } from '@/actions/opportunities'
import { getCompaniesForSelect } from '@/actions/companies'
import { getContacts } from '@/actions/contacts'

export default async function EditQuotePage({ params }: { params: { id: string } }) {
  const quote = await getQuote(params.id)
  const opportunities = await getOpportunities().catch(() => [])
  const companies = await getCompaniesForSelect().catch(() => [])
  const contacts = await getContacts().catch(() => [])

  if (!quote) {
    notFound()
  }

  // Transform database quote to form format
  const formQuote = {
    id: quote.id,
    quoteNumber: quote.quoteNumber,
    status: quote.status as any,
    opportunityId: quote.opportunityId ?? undefined,
    companyId: quote.companyId ?? undefined,
    contactId: quote.contactId ?? undefined,
    validUntil: quote.validUntil ?? undefined,
    discount: quote.discount ? Number(quote.discount) : undefined,
    tax: quote.tax ? Number(quote.tax) : undefined,
    notes: quote.notes ?? undefined,
    terms: quote.terms ?? undefined,
  }

  return (
    <div>
      <div className="mb-8">
        <Heading>Edit Quote</Heading>
      </div>
      <QuoteForm
        quote={formQuote}
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

