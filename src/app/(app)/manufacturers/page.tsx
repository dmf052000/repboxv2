import { getManufacturers } from '@/actions/manufacturers'
import { Button } from '@/components/ui/button'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { deleteManufacturer } from '@/actions/manufacturers'
import { DeleteButtonWrapper } from '@/components/features/delete-button-wrapper'

export default async function ManufacturersPage() {
  const manufacturers = await getManufacturers()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>Manufacturers</Heading>
          <Text className="mt-1">Manage your manufacturers and their information.</Text>
        </div>
        <Button href="/manufacturers/new">Add Manufacturer</Button>
      </div>

      {manufacturers.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-zinc-500">No manufacturers yet. Create your first manufacturer to get started.</Text>
          <Button href="/manufacturers/new" className="mt-4">
            Add Manufacturer
          </Button>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Website</TableCell>
              <TableCell>Primary Contact</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {manufacturers.map((manufacturer) => (
              <TableRow key={manufacturer.id}>
                <TableCell>
                  <div className="font-medium">{manufacturer.name}</div>
                </TableCell>
                <TableCell>
                  {manufacturer.website ? (
                    <a
                      href={manufacturer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-blue-600 dark:text-blue-400"
                    >
                      {manufacturer.website}
                    </a>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{manufacturer.primaryContact || '-'}</TableCell>
                <TableCell>{manufacturer.phone || '-'}</TableCell>
                <TableCell>{manufacturer.email || '-'}</TableCell>
                <TableCell>{manufacturer._count.products}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button plain href={`/manufacturers/${manufacturer.id}`}>
                      View
                    </Button>
                    <DeleteButtonWrapper
                      itemName={manufacturer.name}
                      deleteAction={deleteManufacturer}
                      id={manufacturer.id}
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

