import { getAlias } from '@/actions/aliases'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Link } from '@/components/ui/link'
import { Badge } from '@/components/ui/badge'

const typeColors: Record<string, string> = {
  MANUFACTURER: 'blue',
  PRODUCT: 'indigo',
  COMPANY: 'green',
}

export default async function AliasDetailPage({ params }: { params: { id: string } }) {
  const alias = await getAlias(params.id)

  if (!alias) {
    notFound()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>Alias</Heading>
          <div className="mt-2">
            <Badge color={typeColors[alias.type] as any}>
              {alias.type}
            </Badge>
          </div>
        </div>
        <div className="flex gap-3">
          <Button href={`/aliases/${alias.id}/edit`}>Edit</Button>
          <Button plain href="/aliases">
            Back to Aliases
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <DescriptionList>
          <DescriptionTerm>Type</DescriptionTerm>
          <DescriptionDetails>
            <Badge color={typeColors[alias.type] as any}>
              {alias.type}
            </Badge>
          </DescriptionDetails>

          <DescriptionTerm>Original Name</DescriptionTerm>
          <DescriptionDetails>{alias.originalName}</DescriptionDetails>

          <DescriptionTerm>Alias Name</DescriptionTerm>
          <DescriptionDetails>{alias.aliasName}</DescriptionDetails>

          {alias.manufacturer && (
            <>
              <DescriptionTerm>Linked Manufacturer</DescriptionTerm>
              <DescriptionDetails>
                <Link href={`/manufacturers/${alias.manufacturer.id}`}>
                  {alias.manufacturer.name}
                </Link>
              </DescriptionDetails>
            </>
          )}

          {alias.product && (
            <>
              <DescriptionTerm>Linked Product</DescriptionTerm>
              <DescriptionDetails>
                <Link href={`/products/${alias.product.id}`}>
                  {alias.product.name}
                </Link>
              </DescriptionDetails>
            </>
          )}

          {alias.company && (
            <>
              <DescriptionTerm>Linked Company</DescriptionTerm>
              <DescriptionDetails>
                <Link href={`/companies/${alias.company.id}`}>
                  {alias.company.name}
                </Link>
              </DescriptionDetails>
            </>
          )}

          {alias.notes && (
            <>
              <DescriptionTerm>Notes</DescriptionTerm>
              <DescriptionDetails className="whitespace-pre-wrap">{alias.notes}</DescriptionDetails>
            </>
          )}
        </DescriptionList>
      </div>
    </div>
  )
}



