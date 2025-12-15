import { getOpportunity } from '@/actions/opportunities'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Link } from '@/components/ui/link'
import { Badge } from '@/components/ui/badge'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { ActivityTimeline } from '@/components/features/activity-timeline'
import { FileAttachments } from '@/components/features/file-attachments'
import { getFileAttachments } from '@/actions/file-attachments'

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

export default async function OpportunityDetailPage({ params }: { params: { id: string } }) {
  const opportunity = await getOpportunity(params.id)
  const files = await getFileAttachments('opportunity', params.id).catch(() => [])

  if (!opportunity) {
    notFound()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>{opportunity.name}</Heading>
          <div className="mt-2 flex items-center gap-2">
            <Badge color={stageColors[opportunity.stage] as any}>
              {stageLabels[opportunity.stage]}
            </Badge>
            {opportunity.probability && (
              <Text className="text-zinc-500">{opportunity.probability}% probability</Text>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <Button href={`/opportunities/${opportunity.id}/edit`}>Edit</Button>
          <Button plain href="/opportunities">
            Back to Opportunities
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 mb-8">
        <DescriptionList>
          <DescriptionTerm>Opportunity Name</DescriptionTerm>
          <DescriptionDetails>{opportunity.name}</DescriptionDetails>

          {opportunity.value && (
            <>
              <DescriptionTerm>Value</DescriptionTerm>
              <DescriptionDetails>${opportunity.value.toLocaleString()}</DescriptionDetails>
            </>
          )}

          <DescriptionTerm>Stage</DescriptionTerm>
          <DescriptionDetails>
            <Badge color={stageColors[opportunity.stage] as any}>
              {stageLabels[opportunity.stage]}
            </Badge>
          </DescriptionDetails>

          {opportunity.probability && (
            <>
              <DescriptionTerm>Probability</DescriptionTerm>
              <DescriptionDetails>{opportunity.probability}%</DescriptionDetails>
            </>
          )}

          {opportunity.expectedCloseDate && (
            <>
              <DescriptionTerm>Expected Close Date</DescriptionTerm>
              <DescriptionDetails>
                {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
              </DescriptionDetails>
            </>
          )}

          {opportunity.company && (
            <>
              <DescriptionTerm>Company</DescriptionTerm>
              <DescriptionDetails>
                <Link href={`/companies/${opportunity.company.id}`}>
                  {opportunity.company.name}
                </Link>
              </DescriptionDetails>
            </>
          )}

          {opportunity.primaryContact && (
            <>
              <DescriptionTerm>Primary Contact</DescriptionTerm>
              <DescriptionDetails>
                <Link href={`/contacts/${opportunity.primaryContact.id}`}>
                  {opportunity.primaryContact.firstName} {opportunity.primaryContact.lastName}
                </Link>
              </DescriptionDetails>
            </>
          )}

        </DescriptionList>
      </div>

      {/* Products Section */}
      {opportunity.lineItems.length > 0 && (
        <div className="mb-8">
          <Heading level={2}>Products ({opportunity.lineItems.length})</Heading>
          <div className="mt-4 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Manufacturer</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Price</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {opportunity.lineItems.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>
                      <Link href={`/products/${line.product.id}`}>
                        {line.product.name}
                      </Link>
                    </TableCell>
                    <TableCell>{line.product.manufacturer.name}</TableCell>
                    <TableCell>{line.quantity}</TableCell>
                    <TableCell>
                      {line.unitPrice ? `$${Number(line.unitPrice).toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell>
                      {line.quantity && line.unitPrice
                        ? `$${(line.quantity * Number(line.unitPrice)).toFixed(2)}`
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Placeholder for quotes - will be added */}
      <div className="mb-8">
        <Heading level={2}>Quotes</Heading>
        <Text className="mt-2 text-zinc-500">Quotes will be shown here</Text>
      </div>

      {/* File Attachments */}
      <div className="mt-8">
        <FileAttachments entityType="opportunity" entityId={opportunity.id} files={files} />
      </div>

      {/* Activities Timeline */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <Heading level={2}>Activities</Heading>
          <Button href={`/activities/new?opportunityId=${opportunity.id}`}>Log Activity</Button>
        </div>
        <ActivityTimeline type="opportunity" id={opportunity.id} />
      </div>
    </div>
  )
}

