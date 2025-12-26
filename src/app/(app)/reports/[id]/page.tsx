import { getReport, runReport } from '@/actions/reports'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading, Subheading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'

const typeColors: Record<string, string> = {
  COMMISSION: 'lime',
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
    <>
      <div className="flex items-end justify-between gap-4">
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
            <Button type="submit" outline>
              Run Report
            </Button>
          </form>
          <Button className="-my-0.5" href={`/reports/${report.id}/edit`}>
            Edit
          </Button>
        </div>
      </div>

      <DescriptionList className="mt-10">
        <DescriptionTerm>Report name</DescriptionTerm>
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
            <DescriptionTerm>Last run</DescriptionTerm>
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

      <Divider className="my-10" soft />

      <Subheading>Report results</Subheading>
      <Text className="mt-2 text-zinc-500">Click "Run Report" to generate results.</Text>
    </>
  )
}

