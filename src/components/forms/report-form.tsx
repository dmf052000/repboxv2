'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reportSchema, type ReportInput } from '@/lib/validations/report'
import { createReport, updateReport } from '@/actions/reports'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, Fieldset, Label, ErrorMessage } from '@/components/ui/fieldset'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller } from 'react-hook-form'

interface ReportFormProps {
  report?: ReportInput & { id: string }
}

export function ReportForm({ report }: ReportFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      ...report,
      type: report?.type || 'CUSTOM',
      sortOrder: report?.sortOrder || 'asc',
      isScheduled: report?.isScheduled || false,
      isShared: report?.isShared || false,
      recipients: report?.recipients || [],
      filters: report?.filters || {},
      columns: report?.columns || [],
    },
  })

  async function onSubmit(data: ReportInput) {
    setError(null)
    setLoading(true)

    try {
      if (report?.id) {
        await updateReport(report.id, data)
      } else {
        await createReport(data)
      }
      router.push('/reports')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save report')
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
          <Label>Report Name *</Label>
          <Input
            {...form.register('name')}
            data-invalid={!!form.formState.errors.name}
          />
          {form.formState.errors.name && (
            <ErrorMessage>{form.formState.errors.name.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Report Type *</Label>
          <select
            {...form.register('type')}
            className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
          >
            <option value="COMMISSION">Commission</option>
            <option value="OPPORTUNITY">Opportunity</option>
            <option value="PIPELINE">Pipeline</option>
            <option value="MANUFACTURER">Manufacturer</option>
            <option value="ACTIVITY">Activity</option>
            <option value="PRODUCT">Product</option>
            <option value="QUOTE">Quote</option>
            <option value="CUSTOM">Custom</option>
          </select>
        </Field>

        <Field>
          <Label>Description</Label>
          <Textarea
            {...form.register('description')}
            rows={3}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label>Sort By</Label>
            <Input
              {...form.register('sortBy')}
              placeholder="Field name"
            />
          </Field>

          <Field>
            <Label>Sort Order</Label>
            <select
              {...form.register('sortOrder')}
              className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </Field>
        </div>

        <div className="space-y-3">
          <Controller
            name="isScheduled"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={field.value}
                  onChange={(checked) => field.onChange(checked)}
                />
                <Label>Schedule this report</Label>
              </div>
            )}
          />

          {form.watch('isScheduled') && (
            <Field>
              <Label>Schedule (Cron Expression)</Label>
              <Input
                {...form.register('schedule')}
                placeholder="0 9 * * 1"
              />
            </Field>
          )}

          <Controller
            name="isShared"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={field.value}
                  onChange={(checked) => field.onChange(checked)}
                />
                <Label>Share this report</Label>
              </div>
            )}
          />
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
            {loading ? 'Saving...' : report ? 'Update Report' : 'Create Report'}
          </Button>
        </div>
      </Fieldset>
    </form>
  )
}

