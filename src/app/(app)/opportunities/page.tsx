import { getOpportunities } from '@/actions/opportunities'
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

const stageColors: Record<string, 'zinc' | 'blue' | 'indigo' | 'purple' | 'green' | 'red'> = {
  prospecting: 'zinc',
  qualification: 'blue',
  proposal: 'indigo',
  negotiation: 'purple',
  'closed-won': 'green',
  'closed-lost': 'red',
}

const stageLabels: Record<string, string> = {
  prospecting: 'Prospecting',
  qualification: 'Qualification',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  'closed-won': 'Closed Won',
  'closed-lost': 'Closed Lost',
}

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities()

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Opportunities</Heading>
        <Button className="-my-0.5" href="/opportunities/new">
          Add opportunity
        </Button>
      </div>

      {opportunities.length === 0 ? (
        <div className="mt-8 text-center text-zinc-500">
          No opportunities yet. Create your first opportunity to get started.
        </div>
      ) : (
        <Table className="mt-8 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Company</TableHeader>
              <TableHeader>Stage</TableHeader>
              <TableHeader className="text-right">Value</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {opportunities.map((opportunity) => (
              <TableRow
                key={opportunity.id}
                href={`/opportunities/${opportunity.id}`}
                title={opportunity.name}
              >
                <TableCell className="font-medium">{opportunity.name}</TableCell>
                <TableCell className="text-zinc-500">
                  {opportunity.company?.name || '-'}
                </TableCell>
                <TableCell>
                  <Badge color={stageColors[opportunity.stage] || 'zinc'}>
                    {stageLabels[opportunity.stage] || opportunity.stage}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {opportunity.value ? `$${opportunity.value.toLocaleString()}` : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

