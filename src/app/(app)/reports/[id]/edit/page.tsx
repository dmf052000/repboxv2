import { getReport } from '@/actions/reports'
import { ReportForm } from '@/components/forms/report-form'
import { Heading } from '@/components/ui/heading'
import { notFound } from 'next/navigation'

export default async function EditReportPage({ params }: { params: { id: string } }) {
  const report = await getReport(params.id)

  if (!report) {
    notFound()
  }

  // Transform database report to form format
  const formReport = {
    id: report.id,
    name: report.name,
    type: report.type as any,
    description: report.description ?? undefined,
    filters: (report.filters as any) ?? {},
    columns: (report.columns as any) ?? [],
    groupBy: report.groupBy ?? undefined,
    sortBy: report.sortBy ?? undefined,
    sortOrder: (report.sortOrder as any) ?? 'asc',
    isScheduled: report.isScheduled,
    schedule: report.schedule ?? undefined,
    recipients: report.recipients,
    isShared: report.isShared,
  }

  return (
    <div>
      <div className="mb-8">
        <Heading>Edit Report</Heading>
      </div>
      <ReportForm report={formReport} />
    </div>
  )
}

