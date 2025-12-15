import { getCompany } from '@/actions/companies'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Link } from '@/components/ui/link'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { ActivityTimeline } from '@/components/features/activity-timeline'
import { FileAttachments } from '@/components/features/file-attachments'
import { getFileAttachments } from '@/actions/file-attachments'

export default async function CompanyDetailPage({ params }: { params: { id: string } }) {
  const company = await getCompany(params.id)

  if (!company) {
    notFound()
  }

  const addressParts = [company.address, company.city, company.state, company.zip]
    .filter(Boolean)
    .join(', ')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>{company.name}</Heading>
          {company.industry && <Text className="mt-1 text-zinc-500">{company.industry}</Text>}
        </div>
        <div className="flex gap-3">
          <Button href={`/companies/${company.id}/edit`}>Edit</Button>
          <Button plain href="/companies">
            Back to Companies
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 mb-8">
        <DescriptionList>
          <DescriptionTerm>Company Name</DescriptionTerm>
          <DescriptionDetails>{company.name}</DescriptionDetails>

          {company.website && (
            <>
              <DescriptionTerm>Website</DescriptionTerm>
              <DescriptionDetails>
                <Link href={company.website} target="_blank" rel="noopener noreferrer">
                  {company.website}
                </Link>
              </DescriptionDetails>
            </>
          )}

          {company.phone && (
            <>
              <DescriptionTerm>Phone</DescriptionTerm>
              <DescriptionDetails>
                <Link href={`tel:${company.phone}`}>{company.phone}</Link>
              </DescriptionDetails>
            </>
          )}

          {company.industry && (
            <>
              <DescriptionTerm>Industry</DescriptionTerm>
              <DescriptionDetails>{company.industry}</DescriptionDetails>
            </>
          )}

          {addressParts && (
            <>
              <DescriptionTerm>Address</DescriptionTerm>
              <DescriptionDetails>{addressParts}</DescriptionDetails>
            </>
          )}
        </DescriptionList>
      </div>

      {/* Contacts Section */}
      {company.contacts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Heading level={2}>Contacts ({company.contacts.length})</Heading>
            <Button href={`/contacts/new?companyId=${company.id}`}>Add Contact</Button>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {company.contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <Link href={`/contacts/${contact.id}`}>
                        {contact.firstName} {contact.lastName}
                      </Link>
                    </TableCell>
                    <TableCell>{contact.title || '-'}</TableCell>
                    <TableCell>{contact.email || '-'}</TableCell>
                    <TableCell>{contact.phone || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Placeholder for opportunities - Phase 3 */}
      <div className="mb-8">
        <Heading level={2}>Opportunities</Heading>
        <Text className="mt-2 text-zinc-500">Opportunities will be added in Phase 3</Text>
      </div>

      {/* Activities Timeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Heading level={2}>Activities</Heading>
          <Button href={`/activities/new?companyId=${company.id}`}>Log Activity</Button>
        </div>
        <ActivityTimeline type="company" id={company.id} />
      </div>
    </div>
  )
}

