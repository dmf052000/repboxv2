export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4">
            <div className="flex items-center gap-4">
              <div className="h-4 w-4 rounded bg-zinc-200 animate-pulse dark:bg-zinc-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/4 rounded bg-zinc-200 animate-pulse dark:bg-zinc-700" />
                <div className="h-3 w-1/3 rounded bg-zinc-200 animate-pulse dark:bg-zinc-700" />
              </div>
              <div className="h-4 w-20 rounded bg-zinc-200 animate-pulse dark:bg-zinc-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}





