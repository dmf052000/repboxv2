import { getImportLogs } from '@/actions/import-logs'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'

export default async function ImportHistoryPage() {
  const logs = await getImportLogs()

  return (
    <div>
      <div className="mb-8">
        <Heading>Import History</Heading>
        <Text className="mt-1">View history of all CSV imports.</Text>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-zinc-500">No import history yet.</Text>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>File</TableCell>
              <TableCell>Total Rows</TableCell>
              <TableCell>Success</TableCell>
              <TableCell>Errors</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge>{log.entityType}</Badge>
                </TableCell>
                <TableCell>{log.fileName}</TableCell>
                <TableCell>{log.totalRows}</TableCell>
                <TableCell>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {log.successCount}
                  </span>
                </TableCell>
                <TableCell>
                  {log.errorCount > 0 ? (
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      {log.errorCount}
                    </span>
                  ) : (
                    <span className="text-zinc-500">0</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}





