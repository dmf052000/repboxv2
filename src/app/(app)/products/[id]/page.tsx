import { getProduct } from '@/actions/products'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Link } from '@/components/ui/link'

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>{product.name}</Heading>
          {product.sku && <Text className="mt-1 text-zinc-500">SKU: {product.sku}</Text>}
        </div>
        <div className="flex gap-3">
          <Button href={`/products/${product.id}/edit`}>Edit</Button>
          <Button plain href="/products">
            Back to Products
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 mb-8">
        <DescriptionList>
          <DescriptionTerm>Product Name</DescriptionTerm>
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
              <DescriptionTerm>Unit Price</DescriptionTerm>
              <DescriptionDetails>${Number(product.unitPrice).toFixed(2)}</DescriptionDetails>
            </>
          )}

          <DescriptionTerm>Status</DescriptionTerm>
          <DescriptionDetails>
            {product.isActive ? (
              <span className="text-green-600 dark:text-green-400">Active</span>
            ) : (
              <span className="text-zinc-500">Inactive</span>
            )}
          </DescriptionDetails>
        </DescriptionList>
      </div>

      {/* Placeholder for opportunities and quotes - Phase 3 */}
      <div className="mb-8">
        <Heading level={2}>Usage</Heading>
        <Text className="mt-2 text-zinc-500">Opportunities and quotes using this product will be shown here in Phase 3</Text>
      </div>
    </div>
  )
}

