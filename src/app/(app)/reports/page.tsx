import { getReports } from '@/actions/reports'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Heading } from '@/components/ui/heading'
import { Badge } from '@/components/ui/badge'

const typeColors: Record<string, 'green' | 'blue' | 'indigo' | 'purple' | 'orange' | 'pink' | 'cyan' | 'zinc'> = {
  COMMISSION: 'green',
  OPPORTUNITY: 'blue',
  PIPELINE: 'indigo',
  MANUFACTURER: 'purple',
  ACTIVITY: 'orange',
  PRODUCT: 'pink',
  QUOTE: 'cyan',
  CUSTOM: 'zinc',
}

export default async function ReportsPage() {
  const reports = await getReports()

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Reports</Heading>
        <Button className="-my-0.5" href="/reports/new">
          Create report
        </Button>
      </div>

      {reports.length === 0 ? (
        <div className="mt-8 text-center text-zinc-500">
          No reports yet. Create your first report to get started.
        </div>
      ) : (
        <Table className="mt-8 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Last run</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow
                key={report.id}
                href={`/reports/${report.id}`}
                title={report.name}
              >
                <TableCell className="font-medium">{report.name}</TableCell>
                <TableCell>
                  <Badge color={typeColors[report.type] || 'zinc'}>
                    {report.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-500">
                  {report.lastRunAt
                    ? new Date(report.lastRunAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Never'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

