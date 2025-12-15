import { z } from 'zod'

export const opportunitySchema = z.object({
  name: z.string().min(1, 'Opportunity name is required'),
  value: z.number().optional(),
  stage: z.enum(['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost']).default('prospecting'),
  probability: z.number().min(0).max(100).optional(),
  expectedCloseDate: z.date().optional().or(z.string().optional()),
  companyId: z.string().optional(),
  primaryContactId: z.string().optional(),
})

export type OpportunityInput = z.infer<typeof opportunitySchema>

