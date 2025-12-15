import { getContact, getContacts } from '@/actions/contacts'
import { ContactForm } from '@/components/forms/contact-form'
import { Heading } from '@/components/ui/heading'
import { notFound } from 'next/navigation'
import { getCompaniesForSelect } from '@/actions/companies'

export default async function EditContactPage({ params }: { params: { id: string } }) {
  const contact = await getContact(params.id)
  const companies = await getCompaniesForSelect().catch(() => [])

  if (!contact) {
    notFound()
  }

  // Transform database contact to form format (null -> undefined)
  const formContact = {
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email ?? undefined,
    phone: contact.phone ?? undefined,
    title: contact.title ?? undefined,
    companyId: contact.companyId ?? undefined,
  }

  return (
    <div>
      <div className="mb-8">
        <Heading>Edit Contact</Heading>
      </div>
      <ContactForm contact={formContact} companies={companies} />
    </div>
  )
}

