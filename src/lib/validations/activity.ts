import { z } from 'zod'

export const activitySchema = z.object({
  type: z.enum(['CALL', 'EMAIL', 'MEETING', 'NOTE', 'TASK']),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().optional(),
  contactId: z.string().optional(),
  companyId: z.string().optional(),
  opportunityId: z.string().optional(),
  quoteId: z.string().optional(),
  dueDate: z.date().optional().or(z.string().optional()),
  duration: z.number().optional(),
})

export type ActivityInput = z.infer<typeof activitySchema>





