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
import { EmptyState } from '@/components/ui/empty-state'
import { BuildingOffice2Icon } from '@heroicons/react/24/outline'

async function CompaniesList() {
  const companies = await getCompanies()

  if (companies.length === 0) {
    return (
      <EmptyState
        icon={<BuildingOffice2Icon className="h-8 w-8" />}
        title="No companies yet"
        description="Get started by creating your first company."
        action={{
          label: 'Add company',
          href: '/companies/new',
        }}
        className="mt-8"
      />
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
