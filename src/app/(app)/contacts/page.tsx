import { Suspense } from 'react'
import { getContacts } from '@/actions/contacts'
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
import { UserGroupIcon } from '@heroicons/react/24/outline'

async function ContactsList() {
  const contacts = await getContacts()

  if (contacts.length === 0) {
    return (
      <EmptyState
        icon={<UserGroupIcon className="h-8 w-8" />}
        title="No contacts yet"
        description="Get started by creating your first contact."
        action={{
          label: 'Add contact',
          href: '/contacts/new',
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
          <TableHeader>Email</TableHeader>
          <TableHeader>Phone</TableHeader>
          <TableHeader>Company</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow
            key={contact.id}
            href={`/contacts/${contact.id}`}
            title={`${contact.firstName} ${contact.lastName}`}
          >
            <TableCell className="font-medium">
              {contact.firstName} {contact.lastName}
            </TableCell>
            <TableCell className="text-zinc-500">{contact.email || '-'}</TableCell>
            <TableCell className="text-zinc-500">{contact.phone || '-'}</TableCell>
            <TableCell className="text-zinc-500">
              {contact.company?.name || '-'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function ContactsPage() {
  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Contacts</Heading>
        <Button className="-my-0.5" href="/contacts/new">
          Add contact
        </Button>
      </div>
      <Suspense fallback={<PageSkeleton />}>
        <ContactsList />
      </Suspense>
    </>
  )
}
