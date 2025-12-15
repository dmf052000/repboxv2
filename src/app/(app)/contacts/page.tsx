import { Suspense } from 'react'
import { getContacts } from '@/actions/contacts'
import { Button } from '@/components/ui/button'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { deleteContact } from '@/actions/contacts'
import { DeleteButtonWrapper } from '@/components/features/delete-button-wrapper'
import { PageSkeleton } from '@/components/features/loading/page-skeleton'

async function ContactsList() {
  const contacts = await getContacts()

  if (contacts.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <Text className="text-zinc-500">No contacts yet. Create your first contact to get started.</Text>
        <Button href="/contacts/new" className="mt-4">
          Add Contact
        </Button>
      </div>
    )
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Phone</TableCell>
          <TableCell>Company</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow key={contact.id}>
            <TableCell>
              <a
                href={`/contacts/${contact.id}`}
                className="hover:underline text-blue-600 dark:text-blue-400 font-medium"
              >
                {contact.firstName} {contact.lastName}
              </a>
            </TableCell>
            <TableCell>{contact.email || '-'}</TableCell>
            <TableCell>{contact.phone || '-'}</TableCell>
            <TableCell>
              {contact.company ? (
                <a
                  href={`/companies/${contact.company.id}`}
                  className="hover:underline text-blue-600 dark:text-blue-400"
                >
                  {contact.company.name}
                </a>
              ) : (
                '-'
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button plain href={`/contacts/${contact.id}`}>
                  View
                </Button>
                <DeleteButtonWrapper
                  itemName={`${contact.firstName} ${contact.lastName}`}
                  deleteAction={deleteContact}
                  id={contact.id}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function ContactsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>Contacts</Heading>
          <Text className="mt-1">Manage your contacts and relationships.</Text>
        </div>
        <Button href="/contacts/new">Add Contact</Button>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <ContactsList />
      </Suspense>
    </div>
  )
}
