import { getCommissions } from '@/actions/commissions'
import { Button } from '@/components/ui/button'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { deleteCommission } from '@/actions/commissions'
import { DeleteButtonWrapper } from '@/components/features/delete-button-wrapper'

const statusColors: Record<string, string> = {
  PENDING: 'blue',
  INVOICED: 'indigo',
  PAID: 'green',
}

export default async function CommissionsPage() {
  const commissions = await getCommissions()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>Commissions</Heading>
          <Text className="mt-1">Track your commissions and payments.</Text>
        </div>
        <Button href="/commissions/new">Add Commission</Button>
      </div>

      {commissions.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-zinc-500">No commissions yet. Create your first commission to get started.</Text>
          <Button href="/commissions/new" className="mt-4">
            Add Commission
          </Button>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Manufacturer</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Opportunity</TableCell>
              <TableCell>Invoice Amount</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Commission Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {commissions.map((commission) => (
              <TableRow key={commission.id}>
                <TableCell>
                  <a
                    href={`/manufacturers/${commission.manufacturer.id}`}
                    className="hover:underline text-blue-600 dark:text-blue-400 font-medium"
                  >
                    {commission.manufacturer.name}
                  </a>
                </TableCell>
                <TableCell>
                  {commission.company ? (
                    <a
                      href={`/companies/${commission.company.id}`}
                      className="hover:underline text-blue-600 dark:text-blue-400"
                    >
                      {commission.company.name}
                    </a>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {commission.opportunity ? (
                    <a
                      href={`/opportunities/${commission.opportunity.id}`}
                      className="hover:underline text-blue-600 dark:text-blue-400"
                    >
                      {commission.opportunity.name}
                    </a>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  ${Number(commission.invoiceAmount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>{Number(commission.commissionRate).toFixed(2)}%</TableCell>
                <TableCell>
                  <span className="font-semibold">
                    ${Number(commission.commissionAmount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge color={statusColors[commission.status] as any}>
                    {commission.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button plain href={`/commissions/${commission.id}`}>
                      View
                    </Button>
                    <DeleteButtonWrapper
                      itemName={`${commission.manufacturer.name} commission`}
                      deleteAction={deleteCommission}
                      id={commission.id}
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

