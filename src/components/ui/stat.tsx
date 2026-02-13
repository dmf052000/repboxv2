import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'

export function Stat({
  title,
  value,
  change,
}: {
  title: string
  value: string
  change?: string
}) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6 text-zinc-500 dark:text-zinc-400">{title}</div>
      <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8 text-white">{value}</div>
      {change && (
        <div className="mt-3 text-sm/6 sm:text-xs/6">
          <Badge color={change.startsWith('+') ? 'lime' : 'pink'}>{change}</Badge>{' '}
          <span className="text-zinc-500 dark:text-zinc-400">from last period</span>
        </div>
      )}
    </div>
  )
}
