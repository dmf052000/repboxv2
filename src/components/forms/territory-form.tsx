'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { territorySchema, type TerritoryInput } from '@/lib/validations/territory'
import { createTerritory, updateTerritory } from '@/actions/territories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, Fieldset, Label, ErrorMessage } from '@/components/ui/fieldset'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface TerritoryFormProps {
  territory?: TerritoryInput & { id: string }
}

export function TerritoryForm({ territory }: TerritoryFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [states, setStates] = useState<string[]>(territory?.states || [])
  const [zipCodes, setZipCodes] = useState<string[]>(territory?.zipCodes || [])
  const [newState, setNewState] = useState('')
  const [newZipCode, setNewZipCode] = useState('')

  const form = useForm({
    resolver: zodResolver(territorySchema),
    defaultValues: {
      name: territory?.name || '',
      states: territory?.states || [],
      zipCodes: territory?.zipCodes || [],
    },
  })

  function addState() {
    if (newState.trim() && !states.includes(newState.trim().toUpperCase())) {
      const updated = [...states, newState.trim().toUpperCase()]
      setStates(updated)
      form.setValue('states', updated)
      setNewState('')
    }
  }

  function removeState(state: string) {
    const updated = states.filter((s) => s !== state)
    setStates(updated)
    form.setValue('states', updated)
  }

  function addZipCode() {
    if (newZipCode.trim() && !zipCodes.includes(newZipCode.trim())) {
      const updated = [...zipCodes, newZipCode.trim()]
      setZipCodes(updated)
      form.setValue('zipCodes', updated)
      setNewZipCode('')
    }
  }

  function removeZipCode(zipCode: string) {
    const updated = zipCodes.filter((z) => z !== zipCode)
    setZipCodes(updated)
    form.setValue('zipCodes', updated)
  }

  async function onSubmit(data: TerritoryInput) {
    setError(null)
    setLoading(true)

    try {
      if (territory?.id) {
        await updateTerritory(territory.id, { ...data, states, zipCodes })
      } else {
        await createTerritory({ ...data, states, zipCodes })
      }
      router.push('/territories')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save territory')
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
          <Label>Territory Name *</Label>
          <Input
            {...form.register('name')}
            data-invalid={!!form.formState.errors.name}
          />
          {form.formState.errors.name && (
            <ErrorMessage>{form.formState.errors.name.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>States</Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addState()
                  }
                }}
                placeholder="Enter state code (e.g., CA)"
                className="flex-1"
              />
              <Button type="button" onClick={addState}>
                Add
              </Button>
            </div>
            {states.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {states.map((state) => (
                  <span
                    key={state}
                    className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800"
                  >
                    {state}
                    <button
                      type="button"
                      onClick={() => removeState(state)}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </Field>

        <Field>
          <Label>Zip Codes</Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={newZipCode}
                onChange={(e) => setNewZipCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addZipCode()
                  }
                }}
                placeholder="Enter zip code"
                className="flex-1"
              />
              <Button type="button" onClick={addZipCode}>
                Add
              </Button>
            </div>
            {zipCodes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {zipCodes.map((zipCode) => (
                  <span
                    key={zipCode}
                    className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800"
                  >
                    {zipCode}
                    <button
                      type="button"
                      onClick={() => removeZipCode(zipCode)}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
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
            {loading ? 'Saving...' : territory ? 'Update Territory' : 'Create Territory'}
          </Button>
        </div>
      </Fieldset>
    </form>
  )
}





