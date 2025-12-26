'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactInput } from '@/lib/validations/contact'
import { createContact, updateContact } from '@/actions/contacts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Field, Fieldset, Label, ErrorMessage } from '@/components/ui/fieldset'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ContactFormProps {
  contact?: ContactInput & { id: string }
  companies?: Array<{ id: string; name: string }>
}

export function ContactForm({ contact, companies = [] }: ContactFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: contact || {},
  })

  async function onSubmit(data: ContactInput) {
    setError(null)
    setLoading(true)

    try {
      if (contact?.id) {
        await updateContact(contact.id, data)
      } else {
        await createContact(data)
      }
      router.push('/contacts')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save contact')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Fieldset>
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        <Field>
          <Label>First Name *</Label>
          <Input
            {...form.register('firstName')}
            data-invalid={!!form.formState.errors.firstName}
          />
          {form.formState.errors.firstName && (
            <ErrorMessage>{form.formState.errors.firstName.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Last Name *</Label>
          <Input
            {...form.register('lastName')}
            data-invalid={!!form.formState.errors.lastName}
          />
          {form.formState.errors.lastName && (
            <ErrorMessage>{form.formState.errors.lastName.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Email</Label>
          <Input
            type="email"
            {...form.register('email')}
            data-invalid={!!form.formState.errors.email}
          />
          {form.formState.errors.email && (
            <ErrorMessage>{form.formState.errors.email.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Phone</Label>
          <Input
            type="tel"
            {...form.register('phone')}
            data-invalid={!!form.formState.errors.phone}
          />
          {form.formState.errors.phone && (
            <ErrorMessage>{form.formState.errors.phone.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Title</Label>
          <Input {...form.register('title')} />
        </Field>

        {companies.length > 0 && (
          <Field>
            <Label>Company</Label>
            <Select {...form.register('companyId')}>
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Select>
          </Field>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            plain
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : contact ? 'Update Contact' : 'Create Contact'}
          </Button>
        </div>
      </Fieldset>
    </form>
  )
}

