import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'
import clsx from 'clsx'

type StatColor = 'green' | 'blue' | 'slate' | 'amber' | 'indigo'

const colorClasses: Record<StatColor, { bg: string; icon: string; ring: string }> = {
  green: {
    bg: 'bg-green-50 dark:bg-green-950/20',
    icon: 'text-green-600 dark:text-green-400',
    ring: 'ring-green-500/20 dark:ring-green-400/10',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    icon: 'text-blue-600 dark:text-blue-400',
    ring: 'ring-blue-500/20 dark:ring-blue-400/10',
  },
  slate: {
    bg: 'bg-slate-50 dark:bg-slate-950/20',
    icon: 'text-slate-600 dark:text-slate-400',
    ring: 'ring-slate-500/20 dark:ring-slate-400/10',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    icon: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-500/20 dark:ring-amber-400/10',
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
    icon: 'text-indigo-600 dark:text-indigo-400',
    ring: 'ring-indigo-500/20 dark:ring-indigo-400/10',
  },
}

export function Stat({
  title,
  value,
  change,
  icon,
  color = 'indigo',
}: {
  title: string
  value: string
  change?: string
  icon?: React.ReactNode
  color?: StatColor
}) {
  const colors = colorClasses[color]
  const numericValue = parseFloat(value.replace(/[^0-9.-]/g, '')) || 0
  const showChange = change && numericValue > 0

  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-lg p-6 ring-1 transition-all duration-200 cursor-pointer',
        colors.bg,
        colors.ring,
        'hover:ring-white/20 dark:hover:ring-white/20'
      )}
    >
      {icon && (
        <div className={clsx('absolute top-4 right-4 opacity-20', colors.icon)}>{icon}</div>
      )}
      <div className="relative">
        <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{title}</div>
        <div className="mt-2 text-3xl font-bold text-zinc-900 sm:text-2xl dark:text-white">
          {value}
        </div>
        {showChange && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Badge color={change.startsWith('+') ? 'green' : 'red'}>{change}</Badge>
            <span className="text-zinc-500 dark:text-zinc-400">from last period</span>
          </div>
        )}
      </div>
    </div>
  )
}
