import { getProducts } from '@/actions/products'
import { Button } from '@/components/ui/button'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { deleteProduct } from '@/actions/products'
import { DeleteButtonWrapper } from '@/components/features/delete-button-wrapper'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>Products</Heading>
          <Text className="mt-1">Manage your products and their information.</Text>
        </div>
        <Button href="/products/new">Add Product</Button>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-zinc-500">No products yet. Create your first product to get started.</Text>
          <Button href="/products/new" className="mt-4">
            Add Product
          </Button>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Manufacturer</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="font-medium">{product.name}</div>
                  {product.description && (
                    <div className="text-sm text-zinc-500 line-clamp-1">{product.description}</div>
                  )}
                </TableCell>
                <TableCell>
                  <a
                    href={`/manufacturers/${product.manufacturer.id}`}
                    className="hover:underline text-blue-600 dark:text-blue-400"
                  >
                    {product.manufacturer.name}
                  </a>
                </TableCell>
                <TableCell>{product.sku || '-'}</TableCell>
                <TableCell>{product.category || '-'}</TableCell>
                <TableCell>
                  {product.unitPrice ? `$${Number(product.unitPrice).toFixed(2)}` : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button plain href={`/products/${product.id}`}>
                      View
                    </Button>
                    <DeleteButtonWrapper
                      itemName={product.name}
                      deleteAction={deleteProduct}
                      id={product.id}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

