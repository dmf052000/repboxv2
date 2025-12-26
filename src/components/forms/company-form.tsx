'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { companySchema, type CompanyInput } from '@/lib/validations/company'
import { createCompany, updateCompany } from '@/actions/companies'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, Fieldset, Label, ErrorMessage } from '@/components/ui/fieldset'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface CompanyFormProps {
  company?: CompanyInput & { id: string }
}

export function CompanyForm({ company }: CompanyFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<CompanyInput>({
    resolver: zodResolver(companySchema),
    defaultValues: company || {},
  })

  async function onSubmit(data: CompanyInput) {
    setError(null)
    setLoading(true)

    try {
      if (company?.id) {
        await updateCompany(company.id, data)
      } else {
        await createCompany(data)
      }
      router.push('/companies')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save company')
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
          <Label>Company Name *</Label>
          <Input
            {...form.register('name')}
            data-invalid={!!form.formState.errors.name}
          />
          {form.formState.errors.name && (
            <ErrorMessage>{form.formState.errors.name.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Website</Label>
          <Input
            type="url"
            {...form.register('website')}
            placeholder="https://example.com"
            data-invalid={!!form.formState.errors.website}
          />
          {form.formState.errors.website && (
            <ErrorMessage>{form.formState.errors.website.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Phone</Label>
          <Input
            type="tel"
            {...form.register('phone')}
            data-invalid={!!form.formState.errors.phone}
          />
        </Field>

        <Field>
          <Label>Industry</Label>
          <Input {...form.register('industry')} />
        </Field>

        <Field>
          <Label>Address</Label>
          <Textarea
            {...form.register('address')}
            rows={2}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label>City</Label>
            <Input {...form.register('city')} />
          </Field>

          <Field>
            <Label>State</Label>
            <Input {...form.register('state')} />
          </Field>
        </div>

        <Field>
          <Label>ZIP Code</Label>
          <Input {...form.register('zip')} />
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
            {loading ? 'Saving...' : company ? 'Update Company' : 'Create Company'}
          </Button>
        </div>
      </Fieldset>
    </form>
  )
}



