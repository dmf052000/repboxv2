import { CompanyForm } from '@/components/forms/company-form'
import { Heading } from '@/components/ui/heading'

export default function NewCompanyPage() {
  return (
    <div>
      <div className="mb-8">
        <Heading>New Company</Heading>
      </div>
      <CompanyForm />
    </div>
  )
}



