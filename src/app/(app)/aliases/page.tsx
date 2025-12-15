import { getAliases } from '@/actions/aliases'
import { Button } from '@/components/ui/button'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { deleteAlias } from '@/actions/aliases'
import { DeleteButtonWrapper } from '@/components/features/delete-button-wrapper'

const typeColors: Record<string, string> = {
  MANUFACTURER: 'blue',
  PRODUCT: 'indigo',
  COMPANY: 'green',
}

export default async function AliasesPage() {
  const aliases = await getAliases()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>Aliases</Heading>
          <Text className="mt-1">Manage name aliases for manufacturers, products, and companies.</Text>
        </div>
        <Button href="/aliases/new">Add Alias</Button>
      </div>

      {aliases.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-zinc-500">No aliases yet. Create your first alias to get started.</Text>
          <Button href="/aliases/new" className="mt-4">
            Add Alias
          </Button>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Original Name</TableCell>
              <TableCell>Alias Name</TableCell>
              <TableCell>Linked To</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aliases.map((alias) => (
              <TableRow key={alias.id}>
                <TableCell>
                  <Badge color={typeColors[alias.type] as any}>
                    {alias.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{alias.originalName}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{alias.aliasName}</div>
                </TableCell>
                <TableCell>
                  {alias.manufacturer && (
                    <a
                      href={`/manufacturers/${alias.manufacturer.id}`}
                      className="hover:underline text-blue-600 dark:text-blue-400"
                    >
                      {alias.manufacturer.name}
                    </a>
                  )}
                  {alias.product && (
                    <a
                      href={`/products/${alias.product.id}`}
                      className="hover:underline text-blue-600 dark:text-blue-400"
                    >
                      {alias.product.name}
                    </a>
                  )}
                  {alias.company && (
                    <a
                      href={`/companies/${alias.company.id}`}
                      className="hover:underline text-blue-600 dark:text-blue-400"
                    >
                      {alias.company.name}
                    </a>
                  )}
                  {!alias.manufacturer && !alias.product && !alias.company && '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button plain href={`/aliases/${alias.id}`}>
                      View
                    </Button>
                    <DeleteButtonWrapper
                      itemName={`${alias.originalName} → ${alias.aliasName}`}
                      deleteAction={deleteAlias}
                      id={alias.id}
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

