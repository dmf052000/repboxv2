'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { opportunitySchema, type OpportunityInput } from '@/lib/validations/opportunity'
import { createOpportunity, updateOpportunity } from '@/actions/opportunities'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Field, Fieldset, Label, ErrorMessage } from '@/components/ui/fieldset'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface OpportunityFormProps {
  opportunity?: OpportunityInput & { id: string }
  companies?: Array<{ id: string; name: string }>
  contacts?: Array<{ id: string; firstName: string; lastName: string; companyId: string | null }>
}

export function OpportunityForm({ opportunity, companies = [], contacts = [] }: OpportunityFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      ...opportunity,
      stage: opportunity?.stage || 'prospecting',
      expectedCloseDate: opportunity?.expectedCloseDate
        ? typeof opportunity.expectedCloseDate === 'string'
          ? opportunity.expectedCloseDate
          : opportunity.expectedCloseDate.toISOString().split('T')[0]
        : undefined,
    },
  })

  // Filter contacts by selected company
  const selectedCompanyId = form.watch('companyId')
  const filteredContacts = selectedCompanyId
    ? contacts.filter((c) => c.companyId === selectedCompanyId)
    : contacts

  async function onSubmit(data: OpportunityInput) {
    setError(null)
    setLoading(true)

    try {
      if (opportunity?.id) {
        await updateOpportunity(opportunity.id, data)
      } else {
        await createOpportunity(data)
      }
      router.push('/opportunities')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save opportunity')
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
          <Label>Opportunity Name *</Label>
          <Input
            {...form.register('name')}
            data-invalid={!!form.formState.errors.name}
          />
          {form.formState.errors.name && (
            <ErrorMessage>{form.formState.errors.name.message}</ErrorMessage>
          )}
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label>Value</Label>
            <Input
              type="number"
              step="0.01"
              {...form.register('value', { valueAsNumber: true })}
            />
          </Field>

          <Field>
            <Label>Probability (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              {...form.register('probability', { valueAsNumber: true })}
            />
          </Field>
        </div>

        <Field>
          <Label>Stage</Label>
          <Select {...form.register('stage')}>
            <option value="prospecting">Prospecting</option>
            <option value="qualification">Qualification</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="closed-won">Closed Won</option>
            <option value="closed-lost">Closed Lost</option>
          </Select>
        </Field>

        <Field>
          <Label>Expected Close Date</Label>
          <Input
            type="date"
            {...form.register('expectedCloseDate')}
          />
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

        {contacts.length > 0 && (
          <Field>
            <Label>Primary Contact</Label>
            <Select
              {...form.register('primaryContactId')}
              disabled={!selectedCompanyId && filteredContacts.length === 0}
            >
              <option value="">Select a contact</option>
              {filteredContacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName}
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
            {loading ? 'Saving...' : opportunity ? 'Update Opportunity' : 'Create Opportunity'}
          </Button>
        </div>
      </Fieldset>
    </form>
  )
}

