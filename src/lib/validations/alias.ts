import { z } from 'zod'

export const aliasSchema = z.object({
  type: z.enum(['MANUFACTURER', 'PRODUCT', 'COMPANY']),
  originalName: z.string().min(1, 'Original name is required'),
  aliasName: z.string().min(1, 'Alias name is required'),
  manufacturerId: z.string().optional(),
  productId: z.string().optional(),
  companyId: z.string().optional(),
  notes: z.string().optional(),
})

export type AliasInput = z.infer<typeof aliasSchema>





