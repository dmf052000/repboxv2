import { getProducts } from '@/actions/products'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Heading } from '@/components/ui/heading'
import { EmptyState } from '@/components/ui/empty-state'
import { Square2StackIcon } from '@heroicons/react/24/outline'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Products</Heading>
        <Button className="-my-0.5" href="/products/new">
          Add product
        </Button>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={<Square2StackIcon className="h-8 w-8" />}
          title="No products yet"
          description="Get started by creating your first product."
          action={{
            label: 'Add product',
            href: '/products/new',
          }}
          className="mt-8"
        />
      ) : (
        <Table className="mt-8 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Manufacturer</TableHeader>
              <TableHeader>SKU</TableHeader>
              <TableHeader className="text-right">Price</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                href={`/products/${product.id}`}
                title={product.name}
              >
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-zinc-500">
                  {product.manufacturer.name}
                </TableCell>
                <TableCell className="text-zinc-500">{product.sku || '-'}</TableCell>
                <TableCell className="text-right">
                  {product.unitPrice ? `$${Number(product.unitPrice).toFixed(2)}` : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

