import { getActivity } from '@/actions/activities'
import { notFound } from 'next/navigation'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/ui/description-list'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
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
  TASK: 'lime',
}

export default async function ActivityDetailPage({ params }: { params: { id: string } }) {
  const activity = await getActivity(params.id)

  if (!activity) {
    notFound()
  }

  const Icon = typeIcons[activity.type]

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <Icon className="size-8 text-zinc-500" />
          <div>
            <Heading>{activity.subject}</Heading>
            <div className="mt-2">
              <Badge color={typeColors[activity.type] as any}>
                {activity.type}
              </Badge>
            </div>
          </div>
        </div>
        <Button className="-my-0.5" href={`/activities/${activity.id}/edit`}>
          Edit
        </Button>
      </div>

      <DescriptionList className="mt-10">
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
            <DescriptionTerm>Due date</DescriptionTerm>
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
            <DescriptionTerm>Completed at</DescriptionTerm>
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
    </>
  )
}



