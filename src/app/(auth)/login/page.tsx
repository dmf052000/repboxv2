'use client'

import { Button } from '@/components/ui/button'
import { Field, Label } from '@/components/ui/fieldset'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Text, TextLink, Strong } from '@/components/ui/text'
import { Logo } from '@/components/ui/logo'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const tenantId = searchParams.get('tenantId') || ''

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const tenantIdValue = formData.get('tenantId') as string

    if (!tenantIdValue) {
      setError('Tenant ID is required')
      setLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        tenantId: tenantIdValue,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
        setLoading(false)
      } else {
        router.push(`/dashboard?tenant=${tenantIdValue}`)
        router.refresh()
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid w-full max-w-sm grid-cols-1 gap-8">
      <Logo className="h-6 w-6 text-zinc-950 dark:text-white" />
      <Heading>Sign in to your account</Heading>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      <Field>
        <Label>Workspace</Label>
        <Input
          type="text"
          name="tenantId"
          defaultValue={tenantId}
          required
          placeholder="your-company"
        />
      </Field>

      <Field>
        <Label>Email</Label>
        <Input type="email" name="email" required autoComplete="email" />
      </Field>

      <Field>
        <Label>Password</Label>
        <Input type="password" name="password" required autoComplete="current-password" />
      </Field>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>

      <Text>
        Don&apos;t have an account?{' '}
        <TextLink href="/signup">
          <Strong>Sign up</Strong>
        </TextLink>
      </Text>
    </form>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}

