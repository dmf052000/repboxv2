import { getActivitiesForEntity } from '@/actions/activities'
import { Link } from '@/components/ui/link'
import { Text } from '@/components/ui/text'
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

const typeColors = {
  CALL: 'text-blue-600 dark:text-blue-400',
  EMAIL: 'text-indigo-600 dark:text-indigo-400',
  MEETING: 'text-purple-600 dark:text-purple-400',
  NOTE: 'text-zinc-600 dark:text-zinc-400',
  TASK: 'text-green-600 dark:text-green-400',
}

interface ActivityTimelineProps {
  type: 'contact' | 'company' | 'opportunity' | 'quote'
  id: string
}

export async function ActivityTimeline({ type, id }: ActivityTimelineProps) {
  const activities = await getActivitiesForEntity(type, id)

  if (activities.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <Text className="text-zinc-500">No activities yet. Log your first activity to get started.</Text>
      </div>
    )
  }

  // Group activities by date
  const grouped = activities.reduce((acc, activity) => {
    const date = new Date(activity.createdAt).toLocaleDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(activity)
    return acc
  }, {} as Record<string, typeof activities>)

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {Object.entries(grouped).map(([date, dateActivities], dateIndex) => (
          <li key={date}>
            <div className="relative pb-8">
              {dateIndex < Object.keys(grouped).length - 1 && (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-zinc-200 dark:bg-zinc-800"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    {dateActivities[0] && (() => {
                      const Icon = typeIcons[dateActivities[0].type]
                      return (
                        <Icon className={`h-5 w-5 ${typeColors[dateActivities[0].type]}`} aria-hidden="true" />
                      )
                    })()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-sm">
                      <span className="font-medium text-zinc-900 dark:text-white">{date}</span>
                    </div>
                  </div>
                  {dateActivities.map((activity) => {
                    const Icon = typeIcons[activity.type]
                    return (
                      <div key={activity.id} className="mt-2 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-start gap-3">
                          <Icon className={`h-5 w-5 mt-0.5 ${typeColors[activity.type]}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-zinc-900 dark:text-white">
                                {activity.subject}
                              </span>
                              <span className="text-xs text-zinc-500">
                                {new Date(activity.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                            {activity.description && (
                              <Text className="mt-1">{activity.description}</Text>
                            )}
                            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                              {activity.contact && (
                                <Link href={`/contacts/${activity.contact.id}`} className="text-blue-600 dark:text-blue-400">
                                  {activity.contact.firstName} {activity.contact.lastName}
                                </Link>
                              )}
                              {activity.company && (
                                <Link href={`/companies/${activity.company.id}`} className="text-blue-600 dark:text-blue-400">
                                  {activity.company.name}
                                </Link>
                              )}
                              {activity.opportunity && (
                                <Link href={`/opportunities/${activity.opportunity.id}`} className="text-blue-600 dark:text-blue-400">
                                  {activity.opportunity.name}
                                </Link>
                              )}
                              {activity.quote && (
                                <Link href={`/quotes/${activity.quote.id}`} className="text-blue-600 dark:text-blue-400">
                                  Quote {activity.quote.quoteNumber}
                                </Link>
                              )}
                              {activity.duration && (
                                <span className="text-zinc-500">
                                  Duration: {activity.duration} min
                                </span>
                              )}
                              {activity.completedAt && (
                                <span className="text-green-600 dark:text-green-400">
                                  Completed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}



