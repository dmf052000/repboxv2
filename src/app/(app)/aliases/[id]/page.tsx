import { getAlias } from '@/actions/aliases'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Link } from '@/components/ui/link'
import { Badge } from '@/components/ui/badge'

const typeColors: Record<string, string> = {
  MANUFACTURER: 'blue',
  PRODUCT: 'indigo',
  COMPANY: 'lime',
}

export default async function AliasDetailPage({ params }: { params: { id: string } }) {
  const alias = await getAlias(params.id)

  if (!alias) {
    notFound()
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <Heading>{alias.originalName}</Heading>
          <div className="mt-2">
            <Badge color={typeColors[alias.type] as any}>
              {alias.type}
            </Badge>
          </div>
        </div>
        <Button className="-my-0.5" href={`/aliases/${alias.id}/edit`}>
          Edit
        </Button>
      </div>

      <DescriptionList className="mt-10">
        <DescriptionTerm>Type</DescriptionTerm>
        <DescriptionDetails>
          <Badge color={typeColors[alias.type] as any}>
            {alias.type}
          </Badge>
        </DescriptionDetails>

        <DescriptionTerm>Original name</DescriptionTerm>
        <DescriptionDetails>{alias.originalName}</DescriptionDetails>

        <DescriptionTerm>Alias name</DescriptionTerm>
        <DescriptionDetails>{alias.aliasName}</DescriptionDetails>

        {alias.manufacturer && (
          <>
            <DescriptionTerm>Linked manufacturer</DescriptionTerm>
            <DescriptionDetails>
              <Link href={`/manufacturers/${alias.manufacturer.id}`}>
                {alias.manufacturer.name}
              </Link>
            </DescriptionDetails>
          </>
        )}

        {alias.product && (
          <>
            <DescriptionTerm>Linked product</DescriptionTerm>
            <DescriptionDetails>
              <Link href={`/products/${alias.product.id}`}>
                {alias.product.name}
              </Link>
            </DescriptionDetails>
          </>
        )}

        {alias.company && (
          <>
            <DescriptionTerm>Linked company</DescriptionTerm>
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
    </>
  )
}



