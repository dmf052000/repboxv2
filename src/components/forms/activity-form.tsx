'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { activitySchema, type ActivityInput } from '@/lib/validations/activity'
import { createActivity, updateActivity } from '@/actions/activities'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Field, Fieldset, Label, ErrorMessage } from '@/components/ui/fieldset'
import { Textarea } from '@/components/ui/textarea'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface ActivityFormProps {
  activity?: ActivityInput & { id: string }
  contacts?: Array<{ id: string; firstName: string; lastName: string }>
  companies?: Array<{ id: string; name: string }>
  opportunities?: Array<{ id: string; name: string }>
  quotes?: Array<{ id: string; quoteNumber: string }>
}

export function ActivityForm({
  activity,
  contacts = [],
  companies = [],
  opportunities = [],
  quotes = [],
}: ActivityFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Pre-fill entity from query params
  const contactId = searchParams.get('contactId')
  const companyId = searchParams.get('companyId')
  const opportunityId = searchParams.get('opportunityId')
  const quoteId = searchParams.get('quoteId')

  const form = useForm({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      ...activity,
      type: activity?.type || 'NOTE',
      contactId: activity?.contactId || contactId || undefined,
      companyId: activity?.companyId || companyId || undefined,
      opportunityId: activity?.opportunityId || opportunityId || undefined,
      quoteId: activity?.quoteId || quoteId || undefined,
      dueDate: activity?.dueDate
        ? typeof activity.dueDate === 'string'
          ? activity.dueDate
          : activity.dueDate instanceof Date
          ? activity.dueDate.toISOString().split('T')[0]
          : undefined
        : undefined,
    },
  })

  async function onSubmit(data: ActivityInput) {
    setError(null)
    setLoading(true)

    try {
      if (activity?.id) {
        await updateActivity(activity.id, data)
      } else {
        await createActivity(data)
      }
      
      // Redirect back to the entity page if linked
      if (data.contactId) {
        router.push(`/contacts/${data.contactId}`)
      } else if (data.companyId) {
        router.push(`/companies/${data.companyId}`)
      } else if (data.opportunityId) {
        router.push(`/opportunities/${data.opportunityId}`)
      } else if (data.quoteId) {
        router.push(`/quotes/${data.quoteId}`)
      } else {
        router.push('/activities')
      }
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save activity')
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
          <Label>Type *</Label>
          <Select {...form.register('type')}>
            <option value="CALL">Call</option>
            <option value="EMAIL">Email</option>
            <option value="MEETING">Meeting</option>
            <option value="NOTE">Note</option>
            <option value="TASK">Task</option>
          </Select>
        </Field>

        <Field>
          <Label>Subject *</Label>
          <Input
            {...form.register('subject')}
            data-invalid={!!form.formState.errors.subject}
          />
          {form.formState.errors.subject && (
            <ErrorMessage>{form.formState.errors.subject.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Description</Label>
          <Textarea
            {...form.register('description')}
            rows={4}
          />
        </Field>

        {contacts.length > 0 && (
          <Field>
            <Label>Contact</Label>
            <Select {...form.register('contactId')}>
              <option value="">Select a contact (optional)</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName}
                </option>
              ))}
            </Select>
          </Field>
        )}

        {companies.length > 0 && (
          <Field>
            <Label>Company</Label>
            <Select {...form.register('companyId')}>
              <option value="">Select a company (optional)</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Select>
          </Field>
        )}

        {opportunities.length > 0 && (
          <Field>
            <Label>Opportunity</Label>
            <Select {...form.register('opportunityId')}>
              <option value="">Select an opportunity (optional)</option>
              {opportunities.map((opportunity) => (
                <option key={opportunity.id} value={opportunity.id}>
                  {opportunity.name}
                </option>
              ))}
            </Select>
          </Field>
        )}

        {quotes.length > 0 && (
          <Field>
            <Label>Quote</Label>
            <Select {...form.register('quoteId')}>
              <option value="">Select a quote (optional)</option>
              {quotes.map((quote) => (
                <option key={quote.id} value={quote.id}>
                  {quote.quoteNumber}
                </option>
              ))}
            </Select>
          </Field>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label>Due Date</Label>
            <Input
              type="date"
              {...form.register('dueDate')}
            />
          </Field>

          <Field>
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              min="0"
              {...form.register('duration', { valueAsNumber: true })}
            />
          </Field>
        </div>

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
            {loading ? 'Saving...' : activity ? 'Update Activity' : 'Create Activity'}
          </Button>
        </div>
      </Fieldset>
    </form>
  )
}





