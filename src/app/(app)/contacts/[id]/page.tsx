import { getContact } from '@/actions/contacts'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Link } from '@/components/ui/link'
import { Avatar } from '@/components/ui/avatar'
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar src={null} alt={`${contact.firstName} ${contact.lastName}`} className="size-16" />
          <div>
            <Heading>
              {contact.firstName} {contact.lastName}
            </Heading>
            {contact.title && <Text className="mt-1 text-zinc-500">{contact.title}</Text>}
          </div>
        </div>
        <div className="flex gap-3">
          <Button href={`/contacts/${contact.id}/edit`}>Edit</Button>
          <Button plain href="/contacts">
            Back to Contacts
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <DescriptionList>
          <DescriptionTerm>First Name</DescriptionTerm>
          <DescriptionDetails>{contact.firstName}</DescriptionDetails>

          <DescriptionTerm>Last Name</DescriptionTerm>
          <DescriptionDetails>{contact.lastName}</DescriptionDetails>

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
      </div>

      {/* File Attachments */}
      <div className="mt-8">
        <FileAttachments entityType="contact" entityId={contact.id} files={files} />
      </div>

      {/* Activities Timeline */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <Heading level={2}>Activities</Heading>
          <Button href={`/activities/new?contactId=${contact.id}`}>Log Activity</Button>
        </div>
        <ActivityTimeline type="contact" id={contact.id} />
      </div>
    </div>
  )
}

