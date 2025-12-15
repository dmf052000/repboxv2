import { getReports } from '@/actions/reports'
import { Button } from '@/components/ui/button'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { deleteReport } from '@/actions/reports'
import { DeleteButtonWrapper } from '@/components/features/delete-button-wrapper'

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

export default async function ReportsPage() {
  const reports = await getReports()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>Reports</Heading>
          <Text className="mt-1">Create and manage custom reports.</Text>
        </div>
        <Button href="/reports/new">Create Report</Button>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-zinc-500">No reports yet. Create your first report to get started.</Text>
          <Button href="/reports/new" className="mt-4">
            Create Report
          </Button>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Last Run</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <div className="font-medium">{report.name}</div>
                </TableCell>
                <TableCell>
                  <Badge color={typeColors[report.type] as any}>
                    {report.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Text className="text-sm text-zinc-500">
                    {report.description || '-'}
                  </Text>
                </TableCell>
                <TableCell>
                  {report.lastRunAt
                    ? new Date(report.lastRunAt).toLocaleString()
                    : 'Never'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button plain href={`/reports/${report.id}`}>
                      View
                    </Button>
                    <DeleteButtonWrapper
                      itemName={report.name}
                      deleteAction={deleteReport}
                      id={report.id}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

