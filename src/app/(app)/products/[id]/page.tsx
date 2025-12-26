import { getProduct } from '@/actions/products'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Link } from '@/components/ui/link'
import { Badge } from '@/components/ui/badge'

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <Heading>{product.name}</Heading>
          {product.sku && <Text className="mt-1 text-zinc-500">SKU: {product.sku}</Text>}
        </div>
        <Button className="-my-0.5" href={`/products/${product.id}/edit`}>
          Edit
        </Button>
      </div>

      <DescriptionList className="mt-10">
        <DescriptionTerm>Product name</DescriptionTerm>
        <DescriptionDetails>{product.name}</DescriptionDetails>

        <DescriptionTerm>Manufacturer</DescriptionTerm>
        <DescriptionDetails>
          <Link href={`/manufacturers/${product.manufacturer.id}`}>
            {product.manufacturer.name}
          </Link>
        </DescriptionDetails>

        {product.sku && (
          <>
            <DescriptionTerm>SKU</DescriptionTerm>
            <DescriptionDetails>{product.sku}</DescriptionDetails>
          </>
        )}

        {product.category && (
          <>
            <DescriptionTerm>Category</DescriptionTerm>
            <DescriptionDetails>{product.category}</DescriptionDetails>
          </>
        )}

        {product.description && (
          <>
            <DescriptionTerm>Description</DescriptionTerm>
            <DescriptionDetails className="whitespace-pre-wrap">{product.description}</DescriptionDetails>
          </>
        )}

        {product.unitPrice && (
          <>
            <DescriptionTerm>Unit price</DescriptionTerm>
            <DescriptionDetails>${Number(product.unitPrice).toFixed(2)}</DescriptionDetails>
          </>
        )}

        <DescriptionTerm>Status</DescriptionTerm>
        <DescriptionDetails>
          <Badge color={product.isActive ? 'lime' : 'zinc'}>
            {product.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </DescriptionDetails>
      </DescriptionList>
    </>
  )
}

