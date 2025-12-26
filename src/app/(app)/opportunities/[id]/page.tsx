import { getOpportunity } from '@/actions/opportunities'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading, Subheading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Link } from '@/components/ui/link'
import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
} from '@/components/ui/table'
import { ActivityTimeline } from '@/components/features/activity-timeline'
import { FileAttachments } from '@/components/features/file-attachments'
import { getFileAttachments } from '@/actions/file-attachments'

const stageColors: Record<string, string> = {
  prospecting: 'zinc',
  qualification: 'blue',
  proposal: 'indigo',
  negotiation: 'purple',
  'closed-won': 'lime',
  'closed-lost': 'pink',
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
    <>
      <div className="flex items-end justify-between gap-4">
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
        <Button className="-my-0.5" href={`/opportunities/${opportunity.id}/edit`}>
          Edit
        </Button>
      </div>

      <DescriptionList className="mt-10">
        <DescriptionTerm>Opportunity name</DescriptionTerm>
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
            <DescriptionTerm>Expected close date</DescriptionTerm>
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
            <DescriptionTerm>Primary contact</DescriptionTerm>
            <DescriptionDetails>
              <Link href={`/contacts/${opportunity.primaryContact.id}`}>
                {opportunity.primaryContact.firstName} {opportunity.primaryContact.lastName}
              </Link>
            </DescriptionDetails>
          </>
        )}
      </DescriptionList>

      {opportunity.lineItems.length > 0 && (
        <>
          <Divider className="my-10" soft />
          <Subheading>Products</Subheading>
          <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
            <TableHead>
              <TableRow>
                <TableHeader>Product</TableHeader>
                <TableHeader>Manufacturer</TableHeader>
                <TableHeader>Quantity</TableHeader>
                <TableHeader>Unit price</TableHeader>
                <TableHeader>Total</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {opportunity.lineItems.map((line) => (
                <TableRow
                  key={line.id}
                  href={`/products/${line.product.id}`}
                  title={line.product.name}
                >
                  <TableCell className="font-medium">{line.product.name}</TableCell>
                  <TableCell className="text-zinc-500">{line.product.manufacturer.name}</TableCell>
                  <TableCell className="text-zinc-500">{line.quantity}</TableCell>
                  <TableCell className="text-zinc-500">
                    {line.unitPrice ? `$${Number(line.unitPrice).toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell className="text-zinc-500">
                    {line.quantity && line.unitPrice
                      ? `$${(line.quantity * Number(line.unitPrice)).toFixed(2)}`
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      <Divider className="my-10" soft />

      <FileAttachments entityType="opportunity" entityId={opportunity.id} files={files} />

      <Divider className="my-10" soft />

      <section className="flex items-end justify-between gap-4">
        <Subheading>Activities</Subheading>
        <Button className="-my-0.5" href={`/activities/new?opportunityId=${opportunity.id}`}>
          Log Activity
        </Button>
      </section>
      <div className="mt-4">
        <ActivityTimeline type="opportunity" id={opportunity.id} />
      </div>
    </>
  )
}

