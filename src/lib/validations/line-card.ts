import { z } from 'zod'

export const lineCardSchema = z.object({
  manufacturerId: z.string().min(1, 'Manufacturer is required'),
  territoryId: z.string().optional(),
  status: z.enum(['ACTIVE', 'PENDING', 'EXPIRED', 'TERMINATED']).default('ACTIVE'),
  startDate: z.date().optional().or(z.string().optional()),
  endDate: z.date().optional().or(z.string().optional()),
  commissionRate: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
  contractUrl: z.string().url().optional().or(z.literal('')),
})

export type LineCardInput = z.infer<typeof lineCardSchema>



