'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateUser } from '@/actions/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, Fieldset, Label, ErrorMessage } from '@/components/ui/fieldset'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
})

type ProfileInput = z.infer<typeof profileSchema>

interface ProfileFormProps {
  user: {
    id: string
    name: string | null
    email: string
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
    },
  })

  async function onSubmit(data: ProfileInput) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await updateUser(user.id, data)
      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
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
        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
            Profile updated successfully!
          </div>
        )}

        <Field>
          <Label>Full Name</Label>
          <Input
            {...form.register('name')}
            data-invalid={!!form.formState.errors.name}
            placeholder="Enter your full name"
          />
          {form.formState.errors.name && (
            <ErrorMessage>{form.formState.errors.name.message}</ErrorMessage>
          )}
        </Field>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Fieldset>
    </form>
  )
}

