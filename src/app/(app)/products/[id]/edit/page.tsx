import { getProduct } from '@/actions/products'
import { ProductForm } from '@/components/forms/product-form'
import { Heading } from '@/components/ui/heading'
import { notFound } from 'next/navigation'
import { getManufacturersForSelect } from '@/actions/manufacturers'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  const manufacturers = await getManufacturersForSelect().catch(() => [])

  if (!product) {
    notFound()
  }

  // Transform database product to form format (null -> undefined)
  const formProduct = {
    id: product.id,
    name: product.name,
    sku: product.sku,
    category: product.category ?? undefined,
    description: product.description ?? undefined,
    manufacturerId: product.manufacturerId,
    unitPrice: product.unitPrice ? Number(product.unitPrice) : undefined,
    isActive: product.isActive,
  }

  return (
    <div>
      <div className="mb-8">
        <Heading>Edit Product</Heading>
      </div>
      <ProductForm product={formProduct} manufacturers={manufacturers} />
    </div>
  )
}

