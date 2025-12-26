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
        <div className="mt-8 text-center text-zinc-500">
          No products yet. Create your first product to get started.
        </div>
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

