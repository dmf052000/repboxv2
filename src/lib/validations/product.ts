import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().optional(),
  description: z.string().optional(),
  manufacturerId: z.string().min(1, 'Manufacturer is required'),
  unitPrice: z.number().optional(),
  isActive: z.boolean().optional().default(true),
})

export type ProductInput = z.infer<typeof productSchema>

