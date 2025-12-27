import { Button } from './button'
import clsx from 'clsx'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    href: string
  }
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={clsx('py-16 text-center', className)}>
      <div className="mx-auto max-w-sm">
        {icon && (
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <div className="text-blue-600 dark:text-blue-400">{icon}</div>
          </div>
        )}
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
        )}
        {action && (
          <div className="mt-6">
            <Button href={action.href}>{action.label}</Button>
          </div>
        )}
      </div>
    </div>
  )
}

