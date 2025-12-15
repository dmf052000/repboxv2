import { getActivities } from '@/actions/activities'
import { Button } from '@/components/ui/button'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { deleteActivity } from '@/actions/activities'
import { DeleteButtonWrapper } from '@/components/features/delete-button-wrapper'
import {
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CheckCircleIcon,
} from '@heroicons/react/20/solid'

const typeIcons = {
  CALL: PhoneIcon,
  EMAIL: EnvelopeIcon,
  MEETING: CalendarDaysIcon,
  NOTE: DocumentTextIcon,
  TASK: CheckCircleIcon,
}

const typeColors: Record<string, string> = {
  CALL: 'blue',
  EMAIL: 'indigo',
  MEETING: 'purple',
  NOTE: 'zinc',
  TASK: 'green',
}

export default async function ActivitiesPage() {
  const activities = await getActivities()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>Activities</Heading>
          <Text className="mt-1">View and manage all your activities.</Text>
        </div>
        <Button href="/activities/new">Log Activity</Button>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-zinc-500">No activities yet. Log your first activity to get started.</Text>
          <Button href="/activities/new" className="mt-4">
            Log Activity
          </Button>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Related To</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((activity) => {
              const Icon = typeIcons[activity.type]
              return (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <Badge color={typeColors[activity.type] as any}>
                        {activity.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{activity.subject}</div>
                    {activity.description && (
                      <div className="text-sm text-zinc-500 line-clamp-1">
                        {activity.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {activity.contact && (
                        <a
                          href={`/contacts/${activity.contact.id}`}
                          className="text-sm hover:underline text-blue-600 dark:text-blue-400"
                        >
                          {activity.contact.firstName} {activity.contact.lastName}
                        </a>
                      )}
                      {activity.company && (
                        <a
                          href={`/companies/${activity.company.id}`}
                          className="text-sm hover:underline text-blue-600 dark:text-blue-400"
                        >
                          {activity.company.name}
                        </a>
                      )}
                      {activity.opportunity && (
                        <a
                          href={`/opportunities/${activity.opportunity.id}`}
                          className="text-sm hover:underline text-blue-600 dark:text-blue-400"
                        >
                          {activity.opportunity.name}
                        </a>
                      )}
                      {activity.quote && (
                        <a
                          href={`/quotes/${activity.quote.id}`}
                          className="text-sm hover:underline text-blue-600 dark:text-blue-400"
                        >
                          Quote {activity.quote.quoteNumber}
                        </a>
                      )}
                      {!activity.contact && !activity.company && !activity.opportunity && !activity.quote && (
                        <span className="text-sm text-zinc-500">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {new Date(activity.createdAt).toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button plain href={`/activities/${activity.id}`}>
                        View
                      </Button>
                      <DeleteButtonWrapper
                        itemName={activity.subject}
                        deleteAction={deleteActivity}
                        id={activity.id}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

