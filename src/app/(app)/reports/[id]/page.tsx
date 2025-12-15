import { getReport, runReport } from '@/actions/reports'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'

const typeColors: Record<string, string> = {
  COMMISSION: 'green',
  OPPORTUNITY: 'blue',
  PIPELINE: 'indigo',
  MANUFACTURER: 'purple',
  ACTIVITY: 'orange',
  PRODUCT: 'pink',
  QUOTE: 'cyan',
  CUSTOM: 'zinc',
}

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
  const report = await getReport(params.id)

  if (!report) {
    notFound()
  }

  async function handleRunReport() {
    'use server'
    await runReport(params.id)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>{report.name}</Heading>
          <div className="mt-2">
            <Badge color={typeColors[report.type] as any}>
              {report.type}
            </Badge>
          </div>
        </div>
        <div className="flex gap-3">
          <form action={handleRunReport}>
            <Button type="submit">Run Report</Button>
          </form>
          <Button href={`/reports/${report.id}/edit`}>Edit</Button>
          <Button plain href="/reports">
            Back to Reports
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 mb-8">
        <DescriptionList>
          <DescriptionTerm>Report Name</DescriptionTerm>
          <DescriptionDetails>{report.name}</DescriptionDetails>

          <DescriptionTerm>Type</DescriptionTerm>
          <DescriptionDetails>
            <Badge color={typeColors[report.type] as any}>
              {report.type}
            </Badge>
          </DescriptionDetails>

          {report.description && (
            <>
              <DescriptionTerm>Description</DescriptionTerm>
              <DescriptionDetails>{report.description}</DescriptionDetails>
            </>
          )}

          {report.lastRunAt && (
            <>
              <DescriptionTerm>Last Run</DescriptionTerm>
              <DescriptionDetails>
                {new Date(report.lastRunAt).toLocaleString()}
              </DescriptionDetails>
            </>
          )}

          {report.isScheduled && (
            <>
              <DescriptionTerm>Scheduled</DescriptionTerm>
              <DescriptionDetails>Yes - {report.schedule}</DescriptionDetails>
            </>
          )}
        </DescriptionList>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <Heading level={2}>Report Results</Heading>
        <Text className="mt-2 text-zinc-500">Click "Run Report" to generate results.</Text>
      </div>
    </div>
  )
}

