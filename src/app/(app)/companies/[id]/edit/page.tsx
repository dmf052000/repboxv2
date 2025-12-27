import { getCompany } from '@/actions/companies'
import { CompanyForm } from '@/components/forms/company-form'
import { Heading } from '@/components/ui/heading'
import { notFound } from 'next/navigation'

export default async function EditCompanyPage({ params }: { params: { id: string } }) {
  const company = await getCompany(params.id)

  if (!company) {
    notFound()
  }

  // Transform database company to form format (null -> undefined)
  const formCompany = {
    id: company.id,
    name: company.name,
    website: company.website ?? undefined,
    phone: company.phone ?? undefined,
    address: company.address ?? undefined,
    city: company.city ?? undefined,
    state: company.state ?? undefined,
    zip: company.zip ?? undefined,
    industry: company.industry ?? undefined,
  }

  return (
    <div>
      <div className="mb-8">
        <Heading>Edit Company</Heading>
      </div>
      <CompanyForm company={formCompany} />
    </div>
  )
}





