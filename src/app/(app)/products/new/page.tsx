import { ProductForm } from '@/components/forms/product-form'
import { Heading } from '@/components/ui/heading'
import { getManufacturersForSelect } from '@/actions/manufacturers'

export default async function NewProductPage() {
  const manufacturers = await getManufacturersForSelect().catch(() => [])

  return (
    <div>
      <div className="mb-8">
        <Heading>New Product</Heading>
      </div>
      <ProductForm manufacturers={manufacturers} />
    </div>
  )
}



