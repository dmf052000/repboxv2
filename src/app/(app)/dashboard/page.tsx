import { getDashboardStats } from '@/actions/dashboard'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Link } from '@/components/ui/link'
import {
  UserGroupIcon,
  BuildingOffice2Icon,
  TicketIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from '@heroicons/react/20/solid'

function StatCard({
  title,
  value,
  icon: Icon,
  href,
  subtitle,
}: {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  href?: string
  subtitle?: string
}) {
  const content = (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div>
          <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</Text>
          <div className="mt-2">
            <span className="text-3xl font-semibold text-zinc-900 dark:text-white">{value}</span>
            {subtitle && (
              <Text className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</Text>
            )}
          </div>
        </div>
        <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
          <Icon className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
        </div>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div>
      <div className="mb-8">
        <Heading>Dashboard</Heading>
        <Text className="mt-1">Overview of your sales pipeline and activities.</Text>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Opportunities"
          value={stats.totalOpportunities}
          icon={TicketIcon}
          href="/opportunities"
        />
        <StatCard
          title="Pipeline Value"
          value={`$${Number(stats.pipelineValue).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`}
          icon={CurrencyDollarIcon}
          subtitle="Open opportunities"
          href="/opportunities"
        />
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          icon={UserGroupIcon}
          href="/contacts"
        />
        <StatCard
          title="Total Companies"
          value={stats.totalCompanies}
          icon={BuildingOffice2Icon}
          href="/companies"
        />
        <StatCard
          title="Open Quotes"
          value={stats.openQuotes}
          icon={ShoppingCartIcon}
          subtitle={`of ${stats.totalQuotes} total`}
          href="/quotes"
        />
        <StatCard
          title="Upcoming Tasks"
          value={stats.upcomingTasks.length}
          icon={ClockIcon}
          href="/activities"
        />
      </div>

      {/* Recent Activities */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Heading level={2}>Recent Activities</Heading>
          <Link href="/activities" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View all
          </Link>
        </div>
        {stats.recentActivities.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <Text className="text-zinc-500">No recent activities.</Text>
          </div>
        ) : (
          <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {stats.recentActivities.map((activity) => (
                <div key={activity.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-zinc-900 dark:text-white">
                          {activity.subject}
                        </span>
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                          {activity.type}
                        </span>
                      </div>
                      {activity.description && (
                        <Text className="mt-1 text-sm">{activity.description}</Text>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                        {activity.contact && (
                          <Link href={`/contacts/${activity.contact.id}`}>
                            {activity.contact.firstName} {activity.contact.lastName}
                          </Link>
                        )}
                        {activity.company && (
                          <Link href={`/companies/${activity.company.id}`}>
                            {activity.company.name}
                          </Link>
                        )}
                        {activity.opportunity && (
                          <Link href={`/opportunities/${activity.opportunity.id}`}>
                            {activity.opportunity.name}
                          </Link>
                        )}
                        {activity.quote && (
                          <Link href={`/quotes/${activity.quote.id}`}>
                            Quote {activity.quote.quoteNumber}
                          </Link>
                        )}
                        <span>{new Date(activity.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Tasks */}
      {stats.upcomingTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <Heading level={2}>Upcoming Tasks</Heading>
            <Link href="/activities" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </Link>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {stats.upcomingTasks.map((task) => (
                <div key={task.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-zinc-900 dark:text-white">
                        {task.subject}
                      </div>
                      {task.description && (
                        <Text className="mt-1 text-sm">{task.description}</Text>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                        {task.contact && (
                          <Link href={`/contacts/${task.contact.id}`}>
                            {task.contact.firstName} {task.contact.lastName}
                          </Link>
                        )}
                        {task.company && (
                          <Link href={`/companies/${task.company.id}`}>
                            {task.company.name}
                          </Link>
                        )}
                        {task.opportunity && (
                          <Link href={`/opportunities/${task.opportunity.id}`}>
                            {task.opportunity.name}
                          </Link>
                        )}
                        {task.dueDate && (
                          <span>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
