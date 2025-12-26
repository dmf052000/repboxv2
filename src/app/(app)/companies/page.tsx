import { Suspense } from 'react'
import { getCompanies } from '@/actions/companies'
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
import { PageSkeleton } from '@/components/features/loading/page-skeleton'

async function CompaniesList() {
  const companies = await getCompanies()

  if (companies.length === 0) {
    return (
      <div className="mt-8 text-center text-zinc-500">
        No companies yet. Create your first company to get started.
      </div>
    )
  }

  return (
    <Table className="mt-8 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Industry</TableHeader>
          <TableHeader>Phone</TableHeader>
          <TableHeader>Website</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {companies.map((company) => (
          <TableRow
            key={company.id}
            href={`/companies/${company.id}`}
            title={company.name}
          >
            <TableCell className="font-medium">{company.name}</TableCell>
            <TableCell className="text-zinc-500">{company.industry || '-'}</TableCell>
            <TableCell className="text-zinc-500">{company.phone || '-'}</TableCell>
            <TableCell className="text-zinc-500">{company.website || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function CompaniesPage() {
  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Companies</Heading>
        <Button className="-my-0.5" href="/companies/new">
          Add company
        </Button>
      </div>
      <Suspense fallback={<PageSkeleton />}>
        <CompaniesList />
      </Suspense>
    </>
  )
}
