import { getContact } from '@/actions/contacts'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading, Subheading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Link } from '@/components/ui/link'
import { Avatar } from '@/components/ui/avatar'
import { Divider } from '@/components/ui/divider'
import { ActivityTimeline } from '@/components/features/activity-timeline'
import { FileAttachments } from '@/components/features/file-attachments'
import { getFileAttachments } from '@/actions/file-attachments'

export default async function ContactDetailPage({ params }: { params: { id: string } }) {
  const contact = await getContact(params.id)
  const files = await getFileAttachments('contact', params.id).catch(() => [])

  if (!contact) {
    notFound()
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar src={null} alt={`${contact.firstName} ${contact.lastName}`} className="size-12" />
          <div>
            <Heading>
              {contact.firstName} {contact.lastName}
            </Heading>
            {contact.title && <Text className="mt-1 text-zinc-500">{contact.title}</Text>}
          </div>
        </div>
        <Button className="-my-0.5" href={`/contacts/${contact.id}/edit`}>
          Edit
        </Button>
      </div>

      <DescriptionList className="mt-10">
        <DescriptionTerm>Full name</DescriptionTerm>
        <DescriptionDetails>{contact.firstName} {contact.lastName}</DescriptionDetails>

        {contact.email && (
          <>
            <DescriptionTerm>Email</DescriptionTerm>
            <DescriptionDetails>
              <Link href={`mailto:${contact.email}`}>{contact.email}</Link>
            </DescriptionDetails>
          </>
        )}

        {contact.phone && (
          <>
            <DescriptionTerm>Phone</DescriptionTerm>
            <DescriptionDetails>
              <Link href={`tel:${contact.phone}`}>{contact.phone}</Link>
            </DescriptionDetails>
          </>
        )}

        {contact.title && (
          <>
            <DescriptionTerm>Title</DescriptionTerm>
            <DescriptionDetails>{contact.title}</DescriptionDetails>
          </>
        )}

        {contact.company && (
          <>
            <DescriptionTerm>Company</DescriptionTerm>
            <DescriptionDetails>
              <Link href={`/companies/${contact.company.id}`}>{contact.company.name}</Link>
            </DescriptionDetails>
          </>
        )}
      </DescriptionList>

      <Divider className="my-10" soft />

      <FileAttachments entityType="contact" entityId={contact.id} files={files} />

      <Divider className="my-10" soft />

      <section className="flex items-end justify-between gap-4">
        <Subheading>Activities</Subheading>
        <Button className="-my-0.5" href={`/activities/new?contactId=${contact.id}`}>
          Log Activity
        </Button>
      </section>
      <div className="mt-4">
        <ActivityTimeline type="contact" id={contact.id} />
      </div>
    </>
  )
}

