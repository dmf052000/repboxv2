import { z } from 'zod'

export const reportSchema = z.object({
  name: z.string().min(1, 'Report name is required'),
  type: z.enum(['COMMISSION', 'OPPORTUNITY', 'PIPELINE', 'MANUFACTURER', 'ACTIVITY', 'PRODUCT', 'QUOTE', 'CUSTOM']),
  description: z.string().optional(),
  filters: z.record(z.string(), z.any()).optional(),
  columns: z.array(z.string()).optional(),
  groupBy: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  isScheduled: z.boolean().default(false),
  schedule: z.string().optional(),
  recipients: z.array(z.string()).default([]),
  isShared: z.boolean().default(false),
})

export type ReportInput = z.infer<typeof reportSchema>

