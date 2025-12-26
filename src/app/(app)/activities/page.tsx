import { getActivities } from '@/actions/activities'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Heading } from '@/components/ui/heading'
import { Badge } from '@/components/ui/badge'

const typeColors: Record<string, 'blue' | 'indigo' | 'purple' | 'zinc' | 'green'> = {
  CALL: 'blue',
  EMAIL: 'indigo',
  MEETING: 'purple',
  NOTE: 'zinc',
  TASK: 'green',
}

export default async function ActivitiesPage() {
  const activities = await getActivities()

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Activities</Heading>
        <Button className="-my-0.5" href="/activities/new">
          Log activity
        </Button>
      </div>

      {activities.length === 0 ? (
        <div className="mt-8 text-center text-zinc-500">
          No activities yet. Log your first activity to get started.
        </div>
      ) : (
        <Table className="mt-8 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
          <TableHead>
            <TableRow>
              <TableHeader>Subject</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Related to</TableHeader>
              <TableHeader>Date</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((activity) => (
              <TableRow
                key={activity.id}
                href={`/activities/${activity.id}`}
                title={activity.subject}
              >
                <TableCell className="font-medium">{activity.subject}</TableCell>
                <TableCell>
                  <Badge color={typeColors[activity.type] || 'zinc'}>
                    {activity.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-500">
                  {activity.contact
                    ? `${activity.contact.firstName} ${activity.contact.lastName}`
                    : activity.company
                    ? activity.company.name
                    : activity.opportunity
                    ? activity.opportunity.name
                    : '-'}
                </TableCell>
                <TableCell className="text-zinc-500">
                  {new Date(activity.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

