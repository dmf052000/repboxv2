import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'

export function Stat({
  title,
  value,
  change,
  icon,
}: {
  title: string
  value: string
  change?: string
  icon?: React.ReactNode
}) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-blue-50 p-6 dark:bg-blue-950/20">
      {icon && (
        <div className="absolute top-4 right-4 text-blue-600 dark:text-blue-400 opacity-20">
          {icon}
        </div>
      )}
      <div className="relative">
        <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{title}</div>
        <div className="mt-2 text-3xl font-bold text-zinc-900 sm:text-2xl dark:text-white">{value}</div>
        {change && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Badge color={change.startsWith('+') ? 'green' : 'red'}>{change}</Badge>
            <span className="text-zinc-500 dark:text-zinc-400">from last period</span>
          </div>
        )}
      </div>
    </div>
  )
}
