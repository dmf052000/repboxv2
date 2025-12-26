import { CardSkeleton } from './card-skeleton'
import { TableSkeleton } from './table-skeleton'

export function PageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded bg-zinc-200 animate-pulse dark:bg-zinc-700" />
          <div className="h-4 w-64 rounded bg-zinc-200 animate-pulse dark:bg-zinc-700" />
        </div>
        <div className="h-10 w-32 rounded bg-zinc-200 animate-pulse dark:bg-zinc-700" />
      </div>
      <TableSkeleton rows={8} />
    </div>
  )
}



