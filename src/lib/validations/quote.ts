import { z } from 'zod'

export const quoteSchema = z.object({
  quoteNumber: z.string().min(1, 'Quote number is required'),
  status: z.enum(['DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED']).default('DRAFT'),
  opportunityId: z.string().optional(),
  companyId: z.string().optional(),
  contactId: z.string().optional(),
  validUntil: z.date().optional().or(z.string().optional()),
  discount: z.number().optional(),
  tax: z.number().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
})

export type QuoteInput = z.infer<typeof quoteSchema>

