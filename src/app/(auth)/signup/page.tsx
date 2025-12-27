'use client'

import { Button } from '@/components/ui/button'
import { Field, Label } from '@/components/ui/fieldset'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Text, TextLink, Strong } from '@/components/ui/text'
import { Logo } from '@/components/ui/logo'
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

      router.push(`/login?tenantId=${tenantSubdomain}`)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid w-full max-w-sm grid-cols-1 gap-8">
      <Logo className="h-6 w-6 text-zinc-950 dark:text-white" />
      <Heading>Create your account</Heading>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      <Field>
        <Label>Workspace ID</Label>
        <Input
          type="text"
          name="tenantSubdomain"
          required
          placeholder="your-company"
          pattern="[a-z0-9-]+"
          title="Lowercase letters, numbers, and hyphens only"
        />
      </Field>

      <Field>
        <Label>Company name</Label>
        <Input type="text" name="tenantName" required placeholder="Your Company Name" />
      </Field>

      <Field>
        <Label>Your name</Label>
        <Input type="text" name="name" required autoComplete="name" />
      </Field>

      <Field>
        <Label>Email</Label>
        <Input type="email" name="email" required autoComplete="email" />
      </Field>

      <Field>
        <Label>Password</Label>
        <Input type="password" name="password" required autoComplete="new-password" minLength={8} />
      </Field>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating account...' : 'Create account'}
      </Button>

      <Text>
        Already have an account?{' '}
        <TextLink href="/login">
          <Strong>Sign in</Strong>
        </TextLink>
      </Text>
    </form>
  )
}





