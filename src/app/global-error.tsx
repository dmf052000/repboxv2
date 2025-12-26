'use client'

import { useEffect } from 'react'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="text-center">
            <Heading level={1} className="text-6xl font-bold text-red-600 dark:text-red-400">
              Critical Error
            </Heading>
            <Heading level={2} className="mt-4">
              Something went wrong
            </Heading>
            <Text className="mt-2 text-zinc-500">
              A critical error occurred. Please refresh the page or contact support.
            </Text>
            {error.digest && (
              <Text className="mt-2 text-xs text-zinc-400">
                Error ID: {error.digest}
              </Text>
            )}
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={reset}>Try again</Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}



