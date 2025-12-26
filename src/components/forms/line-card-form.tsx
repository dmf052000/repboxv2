'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { lineCardSchema, type LineCardInput } from '@/lib/validations/line-card'
import { createLineCard, updateLineCard } from '@/actions/line-cards'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, Fieldset, Label, ErrorMessage } from '@/components/ui/fieldset'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface LineCardFormProps {
  lineCard?: LineCardInput & { id: string }
  manufacturers: Array<{ id: string; name: string }>
  territories: Array<{ id: string; name: string }>
}

export function LineCardForm({ lineCard, manufacturers, territories }: LineCardFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(lineCardSchema),
    defaultValues: {
      ...lineCard,
      status: lineCard?.status || 'ACTIVE',
      startDate: lineCard?.startDate
        ? typeof lineCard.startDate === 'string'
          ? lineCard.startDate
          : lineCard.startDate instanceof Date
          ? lineCard.startDate.toISOString().split('T')[0]
          : undefined
        : undefined,
      endDate: lineCard?.endDate
        ? typeof lineCard.endDate === 'string'
          ? lineCard.endDate
          : lineCard.endDate instanceof Date
          ? lineCard.endDate.toISOString().split('T')[0]
          : undefined
        : undefined,
    },
  })

  async function onSubmit(data: LineCardInput) {
    setError(null)
    setLoading(true)

    try {
      if (lineCard?.id) {
        await updateLineCard(lineCard.id, data)
      } else {
        await createLineCard(data)
      }
      router.push('/line-cards')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save line card')
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
          <select
            {...form.register('manufacturerId')}
            className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
            data-invalid={!!form.formState.errors.manufacturerId}
          >
            <option value="">Select a manufacturer</option>
            {manufacturers.map((manufacturer) => (
              <option key={manufacturer.id} value={manufacturer.id}>
                {manufacturer.name}
              </option>
            ))}
          </select>
          {form.formState.errors.manufacturerId && (
            <ErrorMessage>{form.formState.errors.manufacturerId.message}</ErrorMessage>
          )}
        </Field>

        {territories.length > 0 && (
          <Field>
            <Label>Territory</Label>
            <select
              {...form.register('territoryId')}
              className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
            >
              <option value="">Select a territory</option>
              {territories.map((territory) => (
                <option key={territory.id} value={territory.id}>
                  {territory.name}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field>
          <Label>Status</Label>
          <select
            {...form.register('status')}
            className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
          >
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="EXPIRED">Expired</option>
            <option value="TERMINATED">Terminated</option>
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label>Start Date</Label>
            <Input
              type="date"
              {...form.register('startDate')}
            />
          </Field>

          <Field>
            <Label>End Date</Label>
            <Input
              type="date"
              {...form.register('endDate')}
            />
          </Field>
        </div>

        <Field>
          <Label>Commission Rate (%)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...form.register('commissionRate', { valueAsNumber: true })}
          />
        </Field>

        <Field>
          <Label>Contract URL</Label>
          <Input
            type="url"
            {...form.register('contractUrl')}
            placeholder="https://example.com/contract.pdf"
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
            {loading ? 'Saving...' : lineCard ? 'Update Line Card' : 'Create Line Card'}
          </Button>
        </div>
      </Fieldset>
    </form>
  )
}



