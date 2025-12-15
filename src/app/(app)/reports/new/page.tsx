import { ReportForm } from '@/components/forms/report-form'
import { Heading } from '@/components/ui/heading'

export default function NewReportPage() {
  return (
    <div>
      <div className="mb-8">
        <Heading>Create Report</Heading>
      </div>
      <ReportForm />
    </div>
  )
}

