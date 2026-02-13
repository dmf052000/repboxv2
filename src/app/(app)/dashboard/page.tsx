import { getDashboardStats } from '@/actions/dashboard'
import { auth } from '@/lib/auth'
import { Badge } from '@/components/ui/badge'
import { Heading, Subheading } from '@/components/ui/heading'
import { Select } from '@/components/ui/select'
import { Stat } from '@/components/ui/stat'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { capitalizeWords } from '@/lib/utils/date'

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

  return (
    <>
      <Heading>{getGreeting()}, {userName}</Heading>
      <div className="mt-8 flex items-end justify-between border-t border-white/10 pt-8">
        <Subheading>Overview</Subheading>
        <div>
          <Select name="period">
            <option value="last_week">Last week</option>
            <option value="last_two">Last two weeks</option>
            <option value="last_month">Last month</option>
            <option value="last_quarter">Last quarter</option>
          </Select>
        </div>
      </div>
      <div className="mt-4 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          title="Pipeline value"
          value={pipelineValue}
          change={Number(stats.pipelineValue) > 0 ? '+4.5%' : undefined}
        />
        <Stat
          title="Open opportunities"
          value={stats.totalOpportunities.toLocaleString()}
          change={stats.totalOpportunities > 0 ? '+12.3%' : undefined}
        />
        <Stat
          title="Total contacts"
          value={stats.totalContacts.toLocaleString()}
          change={stats.totalContacts > 0 ? '+8.1%' : undefined}
        />
        <Stat
          title="Open quotes"
          value={stats.openQuotes.toLocaleString()}
          change={stats.openQuotes > 0 ? '-2.5%' : undefined}
        />
      </div>
      <div className="mt-14 border-t border-white/10 pt-8">
        <Subheading>Recent activities</Subheading>
        <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
          <TableHead>
            <TableRow>
              <TableHeader>Activity</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Related to</TableHeader>
              <TableHeader className="text-right">Date</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.recentActivities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center">
                  <div className="mx-auto max-w-sm">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">No recent activities</p>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      Activities you log will appear here
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              stats.recentActivities.map((activity) => {
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
                          : '-'

                return (
                  <TableRow
                    key={activity.id}
                    href={`/activities/${activity.id}`}
                    title={activity.subject}
                  >
                    <TableCell className="font-medium">{activity.subject}</TableCell>
                    <TableCell>
                      <Badge color={badgeColor}>{activity.type}</Badge>
                    </TableCell>
                    <TableCell className="text-zinc-500">{relatedEntity}</TableCell>
                    <TableCell className="text-right text-zinc-500">
                      {new Date(activity.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
