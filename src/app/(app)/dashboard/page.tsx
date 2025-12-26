import { getDashboardStats } from '@/actions/dashboard'
import { auth } from '@/lib/auth'
import { Avatar } from '@/components/ui/avatar'
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
  const userName = session?.user?.name?.split(' ')[0] || 'there'

  return (
    <>
      <Heading>{getGreeting()}, {userName}</Heading>
      <div className="mt-8 flex items-end justify-between">
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
          value={formatCurrency(Number(stats.pipelineValue))}
          change="+4.5%"
        />
        <Stat
          title="Open opportunities"
          value={stats.totalOpportunities.toLocaleString()}
          change="+12.3%"
        />
        <Stat
          title="Total contacts"
          value={stats.totalContacts.toLocaleString()}
          change="+8.1%"
        />
        <Stat
          title="Open quotes"
          value={stats.openQuotes.toLocaleString()}
          change="-2.5%"
        />
      </div>

      <Subheading className="mt-14">Recent activities</Subheading>
      <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Activity</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Related to</TableHeader>
            <TableHeader>Date</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {stats.recentActivities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-zinc-500">
                No recent activities
              </TableCell>
            </TableRow>
          ) : (
            stats.recentActivities.map((activity) => (
              <TableRow
                key={activity.id}
                href={`/activities/${activity.id}`}
                title={activity.subject}
              >
                <TableCell className="font-medium">{activity.subject}</TableCell>
                <TableCell>
                  <Badge color={
                    activity.type === 'CALL' ? 'blue' :
                    activity.type === 'EMAIL' ? 'green' :
                    activity.type === 'MEETING' ? 'purple' :
                    activity.type === 'TASK' ? 'orange' :
                    'zinc'
                  }>
                    {activity.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-500">
                  {activity.contact && (
                    <span>{activity.contact.firstName} {activity.contact.lastName}</span>
                  )}
                  {activity.company && !activity.contact && (
                    <span>{activity.company.name}</span>
                  )}
                  {activity.opportunity && !activity.contact && !activity.company && (
                    <span>{activity.opportunity.name}</span>
                  )}
                  {!activity.contact && !activity.company && !activity.opportunity && (
                    <span>-</span>
                  )}
                </TableCell>
                <TableCell className="text-zinc-500">
                  {new Date(activity.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {stats.upcomingTasks.length > 0 && (
        <>
          <Subheading className="mt-14">Upcoming tasks</Subheading>
          <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
            <TableHead>
              <TableRow>
                <TableHeader>Task</TableHeader>
                <TableHeader>Related to</TableHeader>
                <TableHeader className="text-right">Due date</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.upcomingTasks.map((task) => (
                <TableRow
                  key={task.id}
                  href={`/activities/${task.id}`}
                  title={task.subject}
                >
                  <TableCell className="font-medium">{task.subject}</TableCell>
                  <TableCell className="text-zinc-500">
                    {task.contact && (
                      <span>{task.contact.firstName} {task.contact.lastName}</span>
                    )}
                    {task.company && !task.contact && (
                      <span>{task.company.name}</span>
                    )}
                    {task.opportunity && !task.contact && !task.company && (
                      <span>{task.opportunity.name}</span>
                    )}
                    {!task.contact && !task.company && !task.opportunity && (
                      <span>-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-zinc-500">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </>
  )
}
