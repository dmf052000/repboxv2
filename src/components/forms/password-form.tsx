'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updatePassword } from '@/actions/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, Fieldset, Label, ErrorMessage } from '@/components/ui/fieldset'
import { useState } from 'react'

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type PasswordInput = z.infer<typeof passwordSchema>

interface PasswordFormProps {
  userId: string
}

export function PasswordForm({ userId }: PasswordFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: PasswordInput) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await updatePassword(userId, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      setSuccess(true)
      form.reset()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password')
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
            Password updated successfully!
          </div>
        )}

        <Field>
          <Label>Current Password</Label>
          <Input
            type="password"
            {...form.register('currentPassword')}
            data-invalid={!!form.formState.errors.currentPassword}
            placeholder="Enter your current password"
          />
          {form.formState.errors.currentPassword && (
            <ErrorMessage>
              {form.formState.errors.currentPassword.message}
            </ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>New Password</Label>
          <Input
            type="password"
            {...form.register('newPassword')}
            data-invalid={!!form.formState.errors.newPassword}
            placeholder="Enter your new password"
          />
          {form.formState.errors.newPassword && (
            <ErrorMessage>
              {form.formState.errors.newPassword.message}
            </ErrorMessage>
          )}
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Must be at least 8 characters long
          </p>
        </Field>

        <Field>
          <Label>Confirm New Password</Label>
          <Input
            type="password"
            {...form.register('confirmPassword')}
            data-invalid={!!form.formState.errors.confirmPassword}
            placeholder="Confirm your new password"
          />
          {form.formState.errors.confirmPassword && (
            <ErrorMessage>
              {form.formState.errors.confirmPassword.message}
            </ErrorMessage>
          )}
        </Field>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </Fieldset>
    </form>
  )
}


