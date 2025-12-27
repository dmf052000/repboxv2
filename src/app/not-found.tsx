import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <Heading level={1} className="text-6xl font-bold text-zinc-900 dark:text-white">
          404
        </Heading>
        <Heading level={2} className="mt-4">
          Page Not Found
        </Heading>
        <Text className="mt-2 text-zinc-500">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <div className="mt-6 flex justify-center gap-3">
          <Button href="/dashboard">Go to Dashboard</Button>
          <Button plain href="/">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}





