export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-1/4 rounded bg-blue-100 dark:bg-blue-900/30" />
        <div className="h-8 w-1/2 rounded bg-blue-100 dark:bg-blue-900/30" />
        <div className="h-3 w-1/3 rounded bg-blue-100 dark:bg-blue-900/30" />
      </div>
    </div>
  )
}





