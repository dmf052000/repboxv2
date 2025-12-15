'use client'

import { Button } from '@/components/ui/button'
import { Field, Fieldset, Label } from '@/components/ui/fieldset'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { Link } from '@/components/ui/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const tenantSubdomain = formData.get('tenantSubdomain') as string
    const tenantName = formData.get('tenantName') as string
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      // Create tenant and user
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSubdomain,
          tenantName,
          name,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create account')
        setLoading(false)
        return
      }

      // Redirect to login with tenant ID
      router.push(`/login?tenantId=${tenantSubdomain}`)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid w-full max-w-sm grid-cols-1 gap-8">
      <div>
        <Heading>RepBox</Heading>
        <Heading level={2} className="mt-2">Create your account</Heading>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      <Fieldset>
        <Field>
          <Label>Tenant Subdomain</Label>
          <Input
            type="text"
            name="tenantSubdomain"
            required
            placeholder="your-company"
            pattern="[a-z0-9-]+"
            title="Lowercase letters, numbers, and hyphens only"
          />
          <Text className="mt-1 text-xs text-zinc-500">
            This will be your unique subdomain (e.g., your-company.repbox.app)
          </Text>
        </Field>

        <Field>
          <Label>Company Name</Label>
          <Input type="text" name="tenantName" required placeholder="Your Company Name" />
        </Field>

        <Field>
          <Label>Your Name</Label>
          <Input type="text" name="name" required autoComplete="name" />
        </Field>

        <Field>
          <Label>Email</Label>
          <Input type="email" name="email" required autoComplete="email" />
        </Field>

        <Field>
          <Label>Password</Label>
          <Input type="password" name="password" required autoComplete="new-password" minLength={8} />
          <Text className="mt-1 text-xs text-zinc-500">Minimum 8 characters</Text>
        </Field>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </Fieldset>

      <Text>
        Already have an account?{' '}
        <Link href="/login">
          <strong>Sign in</strong>
        </Link>
      </Text>
    </form>
  )
}

