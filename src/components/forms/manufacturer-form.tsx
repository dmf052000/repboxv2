'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { manufacturerSchema, type ManufacturerInput } from '@/lib/validations/manufacturer'
import { createManufacturer, updateManufacturer } from '@/actions/manufacturers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, Fieldset, Label, ErrorMessage } from '@/components/ui/fieldset'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ManufacturerFormProps {
  manufacturer?: ManufacturerInput & { id: string }
}

export function ManufacturerForm({ manufacturer }: ManufacturerFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<ManufacturerInput>({
    resolver: zodResolver(manufacturerSchema),
    defaultValues: manufacturer || {},
  })

  async function onSubmit(data: ManufacturerInput) {
    setError(null)
    setLoading(true)

    try {
      if (manufacturer?.id) {
        await updateManufacturer(manufacturer.id, data)
      } else {
        await createManufacturer(data)
      }
      router.push('/manufacturers')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save manufacturer')
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
          <Label>Manufacturer Name *</Label>
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
          <Label>Primary Contact</Label>
          <Input {...form.register('primaryContact')} />
        </Field>

        <Field>
          <Label>Phone</Label>
          <Input
            type="tel"
            {...form.register('phone')}
          />
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
          <Label>Logo URL</Label>
          <Input
            type="url"
            {...form.register('logo')}
            placeholder="https://example.com/logo.png"
          />
        </Field>

        <Field>
          <Label>Notes</Label>
          <Textarea
            {...form.register('notes')}
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
            {loading ? 'Saving...' : manufacturer ? 'Update Manufacturer' : 'Create Manufacturer'}
          </Button>
        </div>
      </Fieldset>
    </form>
  )
}



