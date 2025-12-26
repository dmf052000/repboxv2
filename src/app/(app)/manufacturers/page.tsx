import { getManufacturers } from '@/actions/manufacturers'
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

export default async function ManufacturersPage() {
  const manufacturers = await getManufacturers()

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Manufacturers</Heading>
        <Button className="-my-0.5" href="/manufacturers/new">
          Add manufacturer
        </Button>
      </div>

      {manufacturers.length === 0 ? (
        <div className="mt-8 text-center text-zinc-500">
          No manufacturers yet. Create your first manufacturer to get started.
        </div>
      ) : (
        <Table className="mt-8 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Contact</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader className="text-right">Products</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {manufacturers.map((manufacturer) => (
              <TableRow
                key={manufacturer.id}
                href={`/manufacturers/${manufacturer.id}`}
                title={manufacturer.name}
              >
                <TableCell className="font-medium">{manufacturer.name}</TableCell>
                <TableCell className="text-zinc-500">
                  {manufacturer.primaryContact || '-'}
                </TableCell>
                <TableCell className="text-zinc-500">
                  {manufacturer.email || '-'}
                </TableCell>
                <TableCell className="text-right">
                  {manufacturer._count.products}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

