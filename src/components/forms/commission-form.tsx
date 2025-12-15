'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { commissionSchema, type CommissionInput } from '@/lib/validations/commission'
import { createCommission, updateCommission } from '@/actions/commissions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, Fieldset, Label, ErrorMessage } from '@/components/ui/fieldset'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface CommissionFormProps {
  commission?: CommissionInput & { id: string }
  manufacturers: Array<{ id: string; name: string }>
  opportunities?: Array<{ id: string; name: string }>
  companies?: Array<{ id: string; name: string }>
}

export function CommissionForm({
  commission,
  manufacturers,
  opportunities = [],
  companies = [],
}: CommissionFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null)

  const form = useForm({
    resolver: zodResolver(commissionSchema),
    defaultValues: {
      ...commission,
      status: commission?.status || 'PENDING',
      invoiceDate: commission?.invoiceDate
        ? typeof commission.invoiceDate === 'string'
          ? commission.invoiceDate
          : commission.invoiceDate instanceof Date
          ? commission.invoiceDate.toISOString().split('T')[0]
          : undefined
        : undefined,
      paidDate: commission?.paidDate
        ? typeof commission.paidDate === 'string'
          ? commission.paidDate
          : commission.paidDate instanceof Date
          ? commission.paidDate.toISOString().split('T')[0]
          : undefined
        : undefined,
    },
  })

  // Calculate commission amount when invoice amount or rate changes
  const invoiceAmount = form.watch('invoiceAmount')
  const commissionRate = form.watch('commissionRate')

  useEffect(() => {
    if (invoiceAmount && commissionRate) {
      const amount = (invoiceAmount * commissionRate) / 100
      setCalculatedAmount(amount)
    } else {
      setCalculatedAmount(null)
    }
  }, [invoiceAmount, commissionRate])

  async function onSubmit(data: CommissionInput) {
    setError(null)
    setLoading(true)

    try {
      if (commission?.id) {
        await updateCommission(commission.id, data)
      } else {
        await createCommission(data)
      }
      router.push('/commissions')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save commission')
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

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label>Invoice Amount *</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              {...form.register('invoiceAmount', { valueAsNumber: true })}
              data-invalid={!!form.formState.errors.invoiceAmount}
            />
            {form.formState.errors.invoiceAmount && (
              <ErrorMessage>{form.formState.errors.invoiceAmount.message}</ErrorMessage>
            )}
          </Field>

          <Field>
            <Label>Commission Rate (%) *</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="100"
              {...form.register('commissionRate', { valueAsNumber: true })}
              data-invalid={!!form.formState.errors.commissionRate}
            />
            {form.formState.errors.commissionRate && (
              <ErrorMessage>{form.formState.errors.commissionRate.message}</ErrorMessage>
            )}
          </Field>
        </div>

        {calculatedAmount !== null && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex justify-between items-center">
              <span className="font-medium">Commission Amount:</span>
              <span className="text-lg font-semibold">
                ${calculatedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}

        <Field>
          <Label>Status</Label>
          <select
            {...form.register('status')}
            className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
          >
            <option value="PENDING">Pending</option>
            <option value="INVOICED">Invoiced</option>
            <option value="PAID">Paid</option>
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label>Invoice Date</Label>
            <Input
              type="date"
              {...form.register('invoiceDate')}
            />
          </Field>

          <Field>
            <Label>Paid Date</Label>
            <Input
              type="date"
              {...form.register('paidDate')}
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
            {loading ? 'Saving...' : commission ? 'Update Commission' : 'Create Commission'}
          </Button>
        </div>
      </Fieldset>
    </form>
  )
}

