'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { aliasSchema, type AliasInput } from '@/lib/validations/alias'
import { createAlias, updateAlias } from '@/actions/aliases'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, Fieldset, Label, ErrorMessage } from '@/components/ui/fieldset'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface AliasFormProps {
  alias?: AliasInput & { id: string }
  manufacturers?: Array<{ id: string; name: string }>
  products?: Array<{ id: string; name: string; manufacturer: { name: string } }>
  companies?: Array<{ id: string; name: string }>
}

export function AliasForm({
  alias,
  manufacturers = [],
  products = [],
  companies = [],
}: AliasFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(aliasSchema),
    defaultValues: {
      ...alias,
      type: alias?.type || 'MANUFACTURER',
    },
  })

  const selectedType = form.watch('type')

  async function onSubmit(data: AliasInput) {
    setError(null)
    setLoading(true)

    try {
      if (alias?.id) {
        await updateAlias(alias.id, data)
      } else {
        await createAlias(data)
      }
      router.push('/aliases')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save alias')
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
          <select
            {...form.register('type')}
            className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
          >
            <option value="MANUFACTURER">Manufacturer</option>
            <option value="PRODUCT">Product</option>
            <option value="COMPANY">Company</option>
          </select>
        </Field>

        <Field>
          <Label>Original Name *</Label>
          <Input
            {...form.register('originalName')}
            data-invalid={!!form.formState.errors.originalName}
          />
          {form.formState.errors.originalName && (
            <ErrorMessage>{form.formState.errors.originalName.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Alias Name *</Label>
          <Input
            {...form.register('aliasName')}
            data-invalid={!!form.formState.errors.aliasName}
          />
          {form.formState.errors.aliasName && (
            <ErrorMessage>{form.formState.errors.aliasName.message}</ErrorMessage>
          )}
        </Field>

        {selectedType === 'MANUFACTURER' && manufacturers.length > 0 && (
          <Field>
            <Label>Link to Manufacturer</Label>
            <select
              {...form.register('manufacturerId')}
              className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
            >
              <option value="">Select a manufacturer (optional)</option>
              {manufacturers.map((manufacturer) => (
                <option key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </option>
              ))}
            </select>
          </Field>
        )}

        {selectedType === 'PRODUCT' && products.length > 0 && (
          <Field>
            <Label>Link to Product</Label>
            <select
              {...form.register('productId')}
              className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
            >
              <option value="">Select a product (optional)</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.manufacturer.name})
                </option>
              ))}
            </select>
          </Field>
        )}

        {selectedType === 'COMPANY' && companies.length > 0 && (
          <Field>
            <Label>Link to Company</Label>
            <select
              {...form.register('companyId')}
              className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
            >
              <option value="">Select a company (optional)</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </Field>
        )}

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
            {loading ? 'Saving...' : alias ? 'Update Alias' : 'Create Alias'}
          </Button>
        </div>
      </Fieldset>
    </form>
  )
}



