import { Suspense } from 'react'
import { getCompanies } from '@/actions/companies'
import { Button } from '@/components/ui/button'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { deleteCompany } from '@/actions/companies'
import { DeleteButtonWrapper } from '@/components/features/delete-button-wrapper'
import { PageSkeleton } from '@/components/features/loading/page-skeleton'

async function CompaniesList() {
  const companies = await getCompanies()

  if (companies.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <Text className="text-zinc-500">No companies yet. Create your first company to get started.</Text>
        <Button href="/companies/new" className="mt-4">
          Add Company
        </Button>
      </div>
    )
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Industry</TableCell>
          <TableCell>Phone</TableCell>
          <TableCell>Website</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {companies.map((company) => (
          <TableRow key={company.id}>
            <TableCell>
              <a
                href={`/companies/${company.id}`}
                className="hover:underline text-blue-600 dark:text-blue-400 font-medium"
              >
                {company.name}
              </a>
            </TableCell>
            <TableCell>{company.industry || '-'}</TableCell>
            <TableCell>{company.phone || '-'}</TableCell>
            <TableCell>
              {company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-blue-600 dark:text-blue-400"
                >
                  {company.website}
                </a>
              ) : (
                '-'
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button plain href={`/companies/${company.id}`}>
                  View
                </Button>
                <DeleteButtonWrapper
                  itemName={company.name}
                  deleteAction={deleteCompany}
                  id={company.id}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function CompaniesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>Companies</Heading>
          <Text className="mt-1">Manage your company relationships.</Text>
        </div>
        <Button href="/companies/new">Add Company</Button>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <CompaniesList />
      </Suspense>
    </div>
  )
}
