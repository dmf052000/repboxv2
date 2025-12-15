import { getManufacturer } from '@/actions/manufacturers'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Link } from '@/components/ui/link'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'

export default async function ManufacturerDetailPage({ params }: { params: { id: string } }) {
  const manufacturer = await getManufacturer(params.id)

  if (!manufacturer) {
    notFound()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {manufacturer.logo && (
            <img
              src={manufacturer.logo}
              alt={manufacturer.name}
              className="h-16 w-16 object-contain"
            />
          )}
          <div>
            <Heading>{manufacturer.name}</Heading>
          </div>
        </div>
        <div className="flex gap-3">
          <Button href={`/manufacturers/${manufacturer.id}/edit`}>Edit</Button>
          <Button plain href="/manufacturers">
            Back to Manufacturers
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 mb-8">
        <DescriptionList>
          <DescriptionTerm>Manufacturer Name</DescriptionTerm>
          <DescriptionDetails>{manufacturer.name}</DescriptionDetails>

          {manufacturer.website && (
            <>
              <DescriptionTerm>Website</DescriptionTerm>
              <DescriptionDetails>
                <Link href={manufacturer.website} target="_blank" rel="noopener noreferrer">
                  {manufacturer.website}
                </Link>
              </DescriptionDetails>
            </>
          )}

          {manufacturer.primaryContact && (
            <>
              <DescriptionTerm>Primary Contact</DescriptionTerm>
              <DescriptionDetails>{manufacturer.primaryContact}</DescriptionDetails>
            </>
          )}

          {manufacturer.phone && (
            <>
              <DescriptionTerm>Phone</DescriptionTerm>
              <DescriptionDetails>
                <Link href={`tel:${manufacturer.phone}`}>{manufacturer.phone}</Link>
              </DescriptionDetails>
            </>
          )}

          {manufacturer.email && (
            <>
              <DescriptionTerm>Email</DescriptionTerm>
              <DescriptionDetails>
                <Link href={`mailto:${manufacturer.email}`}>{manufacturer.email}</Link>
              </DescriptionDetails>
            </>
          )}

          {manufacturer.notes && (
            <>
              <DescriptionTerm>Notes</DescriptionTerm>
              <DescriptionDetails className="whitespace-pre-wrap">{manufacturer.notes}</DescriptionDetails>
            </>
          )}
        </DescriptionList>
      </div>

      {/* Products Section */}
      {manufacturer.products.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Heading level={2}>Products ({manufacturer.products.length})</Heading>
            <Button href={`/products/new?manufacturerId=${manufacturer.id}`}>Add Product</Button>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Category</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {manufacturer.products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Link href={`/products/${product.id}`}>
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell>{product.sku || '-'}</TableCell>
                    <TableCell>{product.category || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}

