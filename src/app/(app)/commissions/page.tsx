import { getCommissions } from '@/actions/commissions'
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

const statusColors: Record<string, 'blue' | 'indigo' | 'green'> = {
  PENDING: 'blue',
  INVOICED: 'indigo',
  PAID: 'green',
}

export default async function CommissionsPage() {
  const commissions = await getCommissions()

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Commissions</Heading>
        <Button className="-my-0.5" href="/commissions/new">
          Add commission
        </Button>
      </div>

      {commissions.length === 0 ? (
        <div className="mt-8 text-center text-zinc-500">
          No commissions yet. Create your first commission to get started.
        </div>
      ) : (
        <Table className="mt-8 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
          <TableHead>
            <TableRow>
              <TableHeader>Manufacturer</TableHeader>
              <TableHeader>Company</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader className="text-right">Amount</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {commissions.map((commission) => (
              <TableRow
                key={commission.id}
                href={`/commissions/${commission.id}`}
                title={`${commission.manufacturer.name} commission`}
              >
                <TableCell className="font-medium">
                  {commission.manufacturer.name}
                </TableCell>
                <TableCell className="text-zinc-500">
                  {commission.company?.name || '-'}
                </TableCell>
                <TableCell>
                  <Badge color={statusColors[commission.status] || 'blue'}>
                    {commission.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${Number(commission.commissionAmount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

