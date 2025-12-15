import { getCommission } from '@/actions/commissions'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Link } from '@/components/ui/link'
import { Badge } from '@/components/ui/badge'

const statusColors: Record<string, string> = {
  PENDING: 'blue',
  INVOICED: 'indigo',
  PAID: 'green',
}

export default async function CommissionDetailPage({ params }: { params: { id: string } }) {
  const commission = await getCommission(params.id)

  if (!commission) {
    notFound()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>Commission</Heading>
          <div className="mt-2">
            <Badge color={statusColors[commission.status] as any}>
              {commission.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-3">
          <Button href={`/commissions/${commission.id}/edit`}>Edit</Button>
          <Button plain href="/commissions">
            Back to Commissions
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <DescriptionList>
          <DescriptionTerm>Manufacturer</DescriptionTerm>
          <DescriptionDetails>
            <Link href={`/manufacturers/${commission.manufacturer.id}`}>
              {commission.manufacturer.name}
            </Link>
          </DescriptionDetails>

          {commission.company && (
            <>
              <DescriptionTerm>Company</DescriptionTerm>
              <DescriptionDetails>
                <Link href={`/companies/${commission.company.id}`}>
                  {commission.company.name}
                </Link>
              </DescriptionDetails>
            </>
          )}

          {commission.opportunity && (
            <>
              <DescriptionTerm>Opportunity</DescriptionTerm>
              <DescriptionDetails>
                <Link href={`/opportunities/${commission.opportunity.id}`}>
                  {commission.opportunity.name}
                </Link>
              </DescriptionDetails>
            </>
          )}

          <DescriptionTerm>Invoice Amount</DescriptionTerm>
          <DescriptionDetails>
            ${Number(commission.invoiceAmount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </DescriptionDetails>

          <DescriptionTerm>Commission Rate</DescriptionTerm>
          <DescriptionDetails>{Number(commission.commissionRate).toFixed(2)}%</DescriptionDetails>

          <DescriptionTerm>Commission Amount</DescriptionTerm>
          <DescriptionDetails>
            <span className="font-semibold text-lg">
              ${Number(commission.commissionAmount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </DescriptionDetails>

          <DescriptionTerm>Status</DescriptionTerm>
          <DescriptionDetails>
            <Badge color={statusColors[commission.status] as any}>
              {commission.status}
            </Badge>
          </DescriptionDetails>

          {commission.invoiceDate && (
            <>
              <DescriptionTerm>Invoice Date</DescriptionTerm>
              <DescriptionDetails>
                {new Date(commission.invoiceDate).toLocaleDateString()}
              </DescriptionDetails>
            </>
          )}

          {commission.paidDate && (
            <>
              <DescriptionTerm>Paid Date</DescriptionTerm>
              <DescriptionDetails>
                {new Date(commission.paidDate).toLocaleDateString()}
              </DescriptionDetails>
            </>
          )}

          {commission.notes && (
            <>
              <DescriptionTerm>Notes</DescriptionTerm>
              <DescriptionDetails className="whitespace-pre-wrap">{commission.notes}</DescriptionDetails>
            </>
          )}
        </DescriptionList>
      </div>
    </div>
  )
}

