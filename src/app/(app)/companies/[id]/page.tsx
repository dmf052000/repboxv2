import { getCompany } from '@/actions/companies'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading, Subheading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
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
import { ActivityTimeline } from '@/components/features/activity-timeline'

export default async function CompanyDetailPage({ params }: { params: { id: string } }) {
  const company = await getCompany(params.id)

  if (!company) {
    notFound()
  }

  const addressParts = [company.address, company.city, company.state, company.zip]
    .filter(Boolean)
    .join(', ')

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <Heading>{company.name}</Heading>
          {company.industry && <Text className="mt-1 text-zinc-500">{company.industry}</Text>}
        </div>
        <Button className="-my-0.5" href={`/companies/${company.id}/edit`}>
          Edit
        </Button>
      </div>

      <DescriptionList className="mt-10">
        <DescriptionTerm>Company name</DescriptionTerm>
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

      {company.contacts.length > 0 && (
        <>
          <Divider className="my-10" soft />
          <section className="flex items-end justify-between gap-4">
            <Subheading>Contacts</Subheading>
            <Button className="-my-0.5" href={`/contacts/new?companyId=${company.id}`}>
              Add Contact
            </Button>
          </section>
          <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Title</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Phone</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {company.contacts.map((contact) => (
                <TableRow
                  key={contact.id}
                  href={`/contacts/${contact.id}`}
                  title={`${contact.firstName} ${contact.lastName}`}
                >
                  <TableCell className="font-medium">
                    {contact.firstName} {contact.lastName}
                  </TableCell>
                  <TableCell className="text-zinc-500">{contact.title || '-'}</TableCell>
                  <TableCell className="text-zinc-500">{contact.email || '-'}</TableCell>
                  <TableCell className="text-zinc-500">{contact.phone || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      <Divider className="my-10" soft />

      <section className="flex items-end justify-between gap-4">
        <Subheading>Activities</Subheading>
        <Button className="-my-0.5" href={`/activities/new?companyId=${company.id}`}>
          Log Activity
        </Button>
      </section>
      <div className="mt-4">
        <ActivityTimeline type="company" id={company.id} />
      </div>
    </>
  )
}

