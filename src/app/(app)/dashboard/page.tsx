import { getDashboardStats } from '@/actions/dashboard'
import { auth } from '@/lib/auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Select } from '@/components/ui/select'
import { Stat } from '@/components/ui/stat'
import { EmptyState } from '@/components/ui/empty-state'
import { Link } from '@/components/ui/link'
import { formatRelativeTime, capitalizeWords } from '@/lib/utils/date'
import {
  CurrencyDollarIcon,
  TicketIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  UserPlusIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline'
import {
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  InboxIcon,
} from '@heroicons/react/20/solid'

// Activity type icons and colors mapping
const activityTypeIcons = {
  CALL: PhoneIcon,
  EMAIL: EnvelopeIcon,
  MEETING: CalendarDaysIcon,
  NOTE: DocumentTextIcon,
  TASK: CheckCircleIcon,
}

const activityTypeColors: Record<string, 'indigo' | 'green' | 'blue' | 'amber'> = {
  MEETING: 'indigo',
  CALL: 'green',
  EMAIL: 'blue',
  NOTE: 'amber',
  TASK: 'amber',
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatCurrency(value: number) {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value.toLocaleString()}`
}

export default async function DashboardPage() {
  const [stats, session] = await Promise.all([getDashboardStats(), auth()])
  const firstName = session?.user?.name?.split(' ')[0] || 'there'
  const userName = capitalizeWords(firstName)
  const pipelineValue = formatCurrency(Number(stats.pipelineValue))
  const openOpportunities = stats.totalOpportunities

  return (
    <div className="space-y-8">
      {/* Greeting Section */}
      <div>
        <Heading className="text-2xl font-semibold text-white">
          {getGreeting()}, {userName}
        </Heading>
        <p className="mt-2 text-sm text-zinc-400">
          You have {openOpportunities} open {openOpportunities === 1 ? 'opportunity' : 'opportunities'} worth {pipelineValue}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button href="/contacts/new" outline className="text-sm py-1.5 px-3">
            <UserPlusIcon />
            New Contact
          </Button>
          <Button href="/activities/new" outline className="text-sm py-1.5 px-3">
            <ClipboardDocumentCheckIcon />
            Log Activity
          </Button>
          <Button href="/opportunities/new" outline className="text-sm py-1.5 px-3">
            <TicketIcon />
            New Opportunity
          </Button>
          <Button href="/quotes/new" outline className="text-sm py-1.5 px-3">
            <ShoppingCartIcon />
            New Quote
          </Button>
        </div>
      </div>

      {/* Overview Section */}
      <div>
        <div className="flex items-end justify-between">
          <div className="border-l-2 border-indigo-500 pl-3">
            <h2 className="text-lg font-semibold text-white">Overview</h2>
          </div>
          <div>
            <Select name="period" className="w-auto min-w-[140px]">
              <option value="last_week">Last week</option>
              <option value="last_two">Last two weeks</option>
              <option value="last_month">Last month</option>
              <option value="last_quarter">Last quarter</option>
            </Select>
          </div>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            title="Pipeline value"
            value={pipelineValue}
            change={Number(stats.pipelineValue) > 0 ? '+4.5%' : undefined}
            icon={<CurrencyDollarIcon className="h-12 w-12" />}
            color="green"
          />
          <Stat
            title="Open opportunities"
            value={stats.totalOpportunities.toLocaleString()}
            change={stats.totalOpportunities > 0 ? '+12.3%' : undefined}
            icon={<TicketIcon className="h-12 w-12" />}
            color="blue"
          />
          <Stat
            title="Total contacts"
            value={stats.totalContacts.toLocaleString()}
            change={stats.totalContacts > 0 ? '+8.1%' : undefined}
            icon={<UserGroupIcon className="h-12 w-12" />}
            color="slate"
          />
          <Stat
            title="Open quotes"
            value={stats.openQuotes.toLocaleString()}
            change={stats.openQuotes > 0 ? '-2.5%' : undefined}
            icon={<ShoppingCartIcon className="h-12 w-12" />}
            color="amber"
          />
        </div>
      </div>

      {/* Recent Activities Section */}
      <div>
        <div className="border-l-2 border-indigo-500 pl-3">
          <h2 className="text-lg font-semibold text-white">Recent activities</h2>
        </div>
        {stats.recentActivities.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={<InboxIcon className="h-8 w-8" />}
              title="No recent activities"
              description="Activities you log will appear here"
              action={{
                label: 'Log an Activity',
                href: '/activities/new',
              }}
            />
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {stats.recentActivities.map((activity) => {
              const Icon = activityTypeIcons[activity.type]
              const badgeColor = activityTypeColors[activity.type] || 'zinc'
              const relatedEntity =
                activity.contact
                  ? `${activity.contact.firstName} ${activity.contact.lastName}`
                  : activity.company
                    ? activity.company.name
                    : activity.opportunity
                      ? activity.opportunity.name
                      : activity.quote
                        ? `Quote ${(activity.quote as { quoteNumber: string }).quoteNumber}`
                        : null

              return (
                <Link
                  key={activity.id}
                  href={`/activities/${activity.id}`}
                  className="group flex items-start gap-4 rounded-lg bg-white/5 p-4 transition-all hover:bg-white/10 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/50 cursor-pointer"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 dark:bg-indigo-500/20">
                    <Icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-white group-hover:text-indigo-400">
                          {activity.subject}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <Badge color={badgeColor}>{activity.type}</Badge>
                          {relatedEntity && (
                            <span className="text-sm text-zinc-400">{relatedEntity}</span>
                          )}
                        </div>
                      </div>
                      <span className="shrink-0 text-sm text-zinc-400">
                        {formatRelativeTime(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Upcoming Tasks Section */}
      {stats.upcomingTasks.length > 0 && (
        <div>
          <div className="border-l-2 border-indigo-500 pl-3">
            <h2 className="text-lg font-semibold text-white">Upcoming tasks</h2>
          </div>
          <div className="mt-4 space-y-3">
            {stats.upcomingTasks.map((task) => {
              const relatedEntity =
                task.contact
                  ? `${task.contact.firstName} ${task.contact.lastName}`
                  : task.company
                    ? task.company.name
                    : task.opportunity
                      ? task.opportunity.name
                      : null

              return (
                <Link
                  key={task.id}
                  href={`/activities/${task.id}`}
                  className="group flex items-center justify-between gap-4 rounded-lg bg-white/5 p-4 transition-all hover:bg-white/10 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/50 cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white group-hover:text-indigo-400">
                      {task.subject}
                    </p>
                    {relatedEntity && (
                      <p className="mt-1 text-sm text-zinc-400">{relatedEntity}</p>
                    )}
                  </div>
                  {task.dueDate && (
                    <span className="shrink-0 text-sm text-zinc-400">
                      {formatRelativeTime(task.dueDate)}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
