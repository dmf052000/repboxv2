import { getAliases } from '@/actions/aliases'
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
import { Badge } from '@/components/ui/badge'

const typeColors: Record<string, 'blue' | 'indigo' | 'green'> = {
  MANUFACTURER: 'blue',
  PRODUCT: 'indigo',
  COMPANY: 'green',
}

export default async function AliasesPage() {
  const aliases = await getAliases()

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Aliases</Heading>
        <Button className="-my-0.5" href="/aliases/new">
          Add alias
        </Button>
      </div>

      {aliases.length === 0 ? (
        <div className="mt-8 text-center text-zinc-500">
          No aliases yet. Create your first alias to get started.
        </div>
      ) : (
        <Table className="mt-8 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
          <TableHead>
            <TableRow>
              <TableHeader>Original name</TableHeader>
              <TableHeader>Alias</TableHeader>
              <TableHeader>Type</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {aliases.map((alias) => (
              <TableRow
                key={alias.id}
                href={`/aliases/${alias.id}`}
                title={`${alias.originalName} → ${alias.aliasName}`}
              >
                <TableCell className="font-medium">{alias.originalName}</TableCell>
                <TableCell className="text-zinc-500">{alias.aliasName}</TableCell>
                <TableCell>
                  <Badge color={typeColors[alias.type] || 'blue'}>
                    {alias.type}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

