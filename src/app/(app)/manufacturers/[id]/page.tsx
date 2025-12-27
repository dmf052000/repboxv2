import { getManufacturer } from '@/actions/manufacturers'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading, Subheading } from '@/components/ui/heading'
import { Link } from '@/components/ui/link'
import { Divider } from '@/components/ui/divider'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
} from '@/components/ui/table'

export default async function ManufacturerDetailPage({ params }: { params: { id: string } }) {
  const manufacturer = await getManufacturer(params.id)

  if (!manufacturer) {
    notFound()
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          {manufacturer.logo && (
            <img
              src={manufacturer.logo}
              alt={manufacturer.name}
              className="size-12 rounded-lg object-contain"
            />
          )}
          <Heading>{manufacturer.name}</Heading>
        </div>
        <Button className="-my-0.5" href={`/manufacturers/${manufacturer.id}/edit`}>
          Edit
        </Button>
      </div>

      <DescriptionList className="mt-10">
        <DescriptionTerm>Manufacturer name</DescriptionTerm>
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
            <DescriptionTerm>Primary contact</DescriptionTerm>
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

      {manufacturer.products.length > 0 && (
        <>
          <Divider className="my-10" soft />
          <section className="flex items-end justify-between gap-4">
            <Subheading>Products</Subheading>
            <Button className="-my-0.5" href={`/products/new?manufacturerId=${manufacturer.id}`}>
              Add Product
            </Button>
          </section>
          <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
            <TableHead>
              <TableRow>
                <TableHeader>Product name</TableHeader>
                <TableHeader>SKU</TableHeader>
                <TableHeader>Category</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {manufacturer.products.map((product) => (
                <TableRow
                  key={product.id}
                  href={`/products/${product.id}`}
                  title={product.name}
                >
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-zinc-500">{product.sku || '-'}</TableCell>
                  <TableCell className="text-zinc-500">{product.category || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </>
  )
}





