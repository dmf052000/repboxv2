'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { quoteSchema, type QuoteInput } from '@/lib/validations/quote'
import { createQuote, updateQuote } from '@/actions/quotes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, Fieldset, Label, ErrorMessage } from '@/components/ui/fieldset'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface QuoteFormProps {
  quote?: QuoteInput & { id: string }
  opportunities?: Array<{ id: string; name: string }>
  companies?: Array<{ id: string; name: string }>
  contacts?: Array<{ id: string; firstName: string; lastName: string; companyId: string | null }>
}

export function QuoteForm({ quote, opportunities = [], companies = [], contacts = [] }: QuoteFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      ...quote,
      status: quote?.status || 'DRAFT',
      validUntil: quote?.validUntil
        ? typeof quote.validUntil === 'string'
          ? quote.validUntil
          : quote.validUntil instanceof Date
          ? quote.validUntil.toISOString().split('T')[0]
          : undefined
        : undefined,
    },
  })

  // Filter contacts by selected company
  const selectedCompanyId = form.watch('companyId')
  const filteredContacts = selectedCompanyId
    ? contacts.filter((c) => c.companyId === selectedCompanyId)
    : contacts

  async function onSubmit(data: QuoteInput) {
    setError(null)
    setLoading(true)

    try {
      if (quote?.id) {
        await updateQuote(quote.id, data)
      } else {
        await createQuote(data)
      }
      router.push('/quotes')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save quote')
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
          <Label>Quote Number *</Label>
          <Input
            {...form.register('quoteNumber')}
            data-invalid={!!form.formState.errors.quoteNumber}
            placeholder="Leave blank to auto-generate"
          />
          {form.formState.errors.quoteNumber && (
            <ErrorMessage>{form.formState.errors.quoteNumber.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Status</Label>
          <select
            {...form.register('status')}
            className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
          >
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="VIEWED">Viewed</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </Field>

        <Field>
          <Label>Valid Until</Label>
          <Input
            type="date"
            {...form.register('validUntil')}
          />
        </Field>

        {opportunities.length > 0 && (
          <Field>
            <Label>Opportunity</Label>
            <select
              {...form.register('opportunityId')}
              className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
            >
              <option value="">Select an opportunity</option>
              {opportunities.map((opportunity) => (
                <option key={opportunity.id} value={opportunity.id}>
                  {opportunity.name}
                </option>
              ))}
            </select>
          </Field>
        )}

        {companies.length > 0 && (
          <Field>
            <Label>Company</Label>
            <select
              {...form.register('companyId')}
              className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
            >
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </Field>
        )}

        {contacts.length > 0 && (
          <Field>
            <Label>Contact</Label>
            <select
              {...form.register('contactId')}
              className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
              disabled={!selectedCompanyId && filteredContacts.length === 0}
            >
              <option value="">Select a contact</option>
              {filteredContacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName}
                </option>
              ))}
            </select>
          </Field>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label>Discount</Label>
            <Input
              type="number"
              step="0.01"
              {...form.register('discount', { valueAsNumber: true })}
            />
          </Field>

          <Field>
            <Label>Tax</Label>
            <Input
              type="number"
              step="0.01"
              {...form.register('tax', { valueAsNumber: true })}
            />
          </Field>
        </div>

        <Field>
          <Label>Notes</Label>
          <Textarea
            {...form.register('notes')}
            rows={4}
          />
        </Field>

        <Field>
          <Label>Terms & Conditions</Label>
          <Textarea
            {...form.register('terms')}
            rows={4}
          />
        </Field>

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
            {loading ? 'Saving...' : quote ? 'Update Quote' : 'Create Quote'}
          </Button>
        </div>
      </Fieldset>
    </form>
  )
}

