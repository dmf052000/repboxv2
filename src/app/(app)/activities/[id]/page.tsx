import { getActivity } from '@/actions/activities'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Link } from '@/components/ui/link'
import { Badge } from '@/components/ui/badge'
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

export default async function ActivityDetailPage({ params }: { params: { id: string } }) {
  const activity = await getActivity(params.id)

  if (!activity) {
    notFound()
  }

  const Icon = typeIcons[activity.type]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Icon className="h-8 w-8" />
          <div>
            <Heading>{activity.subject}</Heading>
            <div className="mt-2">
              <Badge color={typeColors[activity.type] as any}>
                {activity.type}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button href={`/activities/${activity.id}/edit`}>Edit</Button>
          <Button plain href="/activities">
            Back to Activities
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <DescriptionList>
          <DescriptionTerm>Type</DescriptionTerm>
          <DescriptionDetails>
            <Badge color={typeColors[activity.type] as any}>
              {activity.type}
            </Badge>
          </DescriptionDetails>

          <DescriptionTerm>Subject</DescriptionTerm>
          <DescriptionDetails>{activity.subject}</DescriptionDetails>

          {activity.description && (
            <>
              <DescriptionTerm>Description</DescriptionTerm>
              <DescriptionDetails className="whitespace-pre-wrap">{activity.description}</DescriptionDetails>
            </>
          )}

          {activity.contact && (
            <>
              <DescriptionTerm>Contact</DescriptionTerm>
              <DescriptionDetails>
                <Link href={`/contacts/${activity.contact.id}`}>
                  {activity.contact.firstName} {activity.contact.lastName}
                </Link>
              </DescriptionDetails>
            </>
          )}

          {activity.company && (
            <>
              <DescriptionTerm>Company</DescriptionTerm>
              <DescriptionDetails>
                <Link href={`/companies/${activity.company.id}`}>
                  {activity.company.name}
                </Link>
              </DescriptionDetails>
            </>
          )}

          {activity.opportunity && (
            <>
              <DescriptionTerm>Opportunity</DescriptionTerm>
              <DescriptionDetails>
                <Link href={`/opportunities/${activity.opportunity.id}`}>
                  {activity.opportunity.name}
                </Link>
              </DescriptionDetails>
            </>
          )}

          {activity.quote && (
            <>
              <DescriptionTerm>Quote</DescriptionTerm>
              <DescriptionDetails>
                <Link href={`/quotes/${activity.quote.id}`}>
                  Quote {activity.quote.quoteNumber}
                </Link>
              </DescriptionDetails>
            </>
          )}

          {activity.dueDate && (
            <>
              <DescriptionTerm>Due Date</DescriptionTerm>
              <DescriptionDetails>
                {new Date(activity.dueDate).toLocaleDateString()}
              </DescriptionDetails>
            </>
          )}

          {activity.duration && (
            <>
              <DescriptionTerm>Duration</DescriptionTerm>
              <DescriptionDetails>{activity.duration} minutes</DescriptionDetails>
            </>
          )}

          {activity.completedAt && (
            <>
              <DescriptionTerm>Completed At</DescriptionTerm>
              <DescriptionDetails>
                {new Date(activity.completedAt).toLocaleString()}
              </DescriptionDetails>
            </>
          )}

          <DescriptionTerm>Created</DescriptionTerm>
          <DescriptionDetails>
            {new Date(activity.createdAt).toLocaleString()}
          </DescriptionDetails>
        </DescriptionList>
      </div>
    </div>
  )
}

