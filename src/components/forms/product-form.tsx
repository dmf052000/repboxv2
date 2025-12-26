'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema, type ProductInput } from '@/lib/validations/product'
import { createProduct, updateProduct } from '@/actions/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Field, Fieldset, Label, ErrorMessage } from '@/components/ui/fieldset'
import { Checkbox, CheckboxField } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getManufacturersForSelect } from '@/actions/manufacturers'

interface ProductFormProps {
  product?: ProductInput & { id: string }
  manufacturers: Array<{ id: string; name: string }>
}

export function ProductForm({ product, manufacturers }: ProductFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      sku: product?.sku || '',
      manufacturerId: product?.manufacturerId || searchParams.get('manufacturerId') || '',
      category: product?.category,
      description: product?.description,
      unitPrice: product?.unitPrice ? Number(product.unitPrice) : undefined,
      isActive: product?.isActive ?? true,
    },
  })

  async function onSubmit(data: ProductInput) {
    setError(null)
    setLoading(true)

    try {
      if (product?.id) {
        await updateProduct(product.id, data)
      } else {
        await createProduct(data)
      }
      router.push('/products')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save product')
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
          <Label>Manufacturer *</Label>
          <Select
            {...form.register('manufacturerId')}
            data-invalid={!!form.formState.errors.manufacturerId}
          >
            <option value="">Select a manufacturer</option>
            {manufacturers.map((manufacturer) => (
              <option key={manufacturer.id} value={manufacturer.id}>
                {manufacturer.name}
              </option>
            ))}
          </Select>
          {form.formState.errors.manufacturerId && (
            <ErrorMessage>{form.formState.errors.manufacturerId.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Product Name *</Label>
          <Input
            {...form.register('name')}
            data-invalid={!!form.formState.errors.name}
          />
          {form.formState.errors.name && (
            <ErrorMessage>{form.formState.errors.name.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>SKU</Label>
          <Input {...form.register('sku')} />
        </Field>

        <Field>
          <Label>Category</Label>
          <Input {...form.register('category')} />
        </Field>

        <Field>
          <Label>Description</Label>
          <Textarea
            {...form.register('description')}
            rows={4}
          />
        </Field>

        <Field>
          <Label>Unit Price</Label>
          <Input
            type="number"
            step="0.01"
            {...form.register('unitPrice', { valueAsNumber: true })}
          />
        </Field>

        <Controller
          name="isActive"
          control={form.control}
          render={({ field }) => (
            <CheckboxField>
              <Checkbox
                checked={field.value ?? true}
                onChange={field.onChange}
              />
              <Label>Product is active and available</Label>
            </CheckboxField>
          )}
        />

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
            {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </Fieldset>
    </form>
  )
}

