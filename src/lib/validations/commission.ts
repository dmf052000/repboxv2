import { z } from 'zod'

export const commissionSchema = z.object({
  manufacturerId: z.string().min(1, 'Manufacturer is required'),
  opportunityId: z.string().optional(),
  companyId: z.string().optional(),
  invoiceAmount: z.number().min(0, 'Invoice amount must be positive'),
  commissionRate: z.number().min(0).max(100, 'Commission rate must be between 0 and 100'),
  status: z.enum(['PENDING', 'INVOICED', 'PAID']).default('PENDING'),
  invoiceDate: z.date().optional().or(z.string().optional()),
  paidDate: z.date().optional().or(z.string().optional()),
  notes: z.string().optional(),
})

export type CommissionInput = z.infer<typeof commissionSchema>

