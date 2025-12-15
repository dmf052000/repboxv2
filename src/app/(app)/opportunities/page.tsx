import { getOpportunities } from '@/actions/opportunities'
import { Button } from '@/components/ui/button'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { deleteOpportunity } from '@/actions/opportunities'
import { DeleteButtonWrapper } from '@/components/features/delete-button-wrapper'

const stageColors: Record<string, string> = {
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>Opportunities</Heading>
          <Text className="mt-1">Manage your sales opportunities and pipeline.</Text>
        </div>
        <Button href="/opportunities/new">Add Opportunity</Button>
      </div>

      {opportunities.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-zinc-500">No opportunities yet. Create your first opportunity to get started.</Text>
          <Button href="/opportunities/new" className="mt-4">
            Add Opportunity
          </Button>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Probability</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {opportunities.map((opportunity) => (
              <TableRow key={opportunity.id}>
                <TableCell>
                  <div className="font-medium">{opportunity.name}</div>
                  {opportunity.expectedCloseDate && (
                    <div className="text-sm text-zinc-500">
                      Close: {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {opportunity.company ? (
                    <a
                      href={`/companies/${opportunity.company.id}`}
                      className="hover:underline text-blue-600 dark:text-blue-400"
                    >
                      {opportunity.company.name}
                    </a>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {opportunity.primaryContact ? (
                    <a
                      href={`/contacts/${opportunity.primaryContact.id}`}
                      className="hover:underline text-blue-600 dark:text-blue-400"
                    >
                      {opportunity.primaryContact.firstName} {opportunity.primaryContact.lastName}
                    </a>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {opportunity.value ? `$${opportunity.value.toLocaleString()}` : '-'}
                </TableCell>
                <TableCell>
                  <Badge color={stageColors[opportunity.stage] as any}>
                    {stageLabels[opportunity.stage]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {opportunity.probability ? `${opportunity.probability}%` : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button plain href={`/opportunities/${opportunity.id}`}>
                      View
                    </Button>
                    <DeleteButtonWrapper
                      itemName={opportunity.name}
                      deleteAction={deleteOpportunity}
                      id={opportunity.id}
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

