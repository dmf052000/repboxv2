import { ContactForm } from '@/components/forms/contact-form'
import { Heading } from '@/components/ui/heading'
import { getCompaniesForSelect } from '@/actions/companies'

export default async function NewContactPage() {
  const companies = await getCompaniesForSelect().catch(() => [])

  return (
    <div>
      <div className="mb-8">
        <Heading>New Contact</Heading>
      </div>
      <ContactForm companies={companies} />
    </div>
  )
}

