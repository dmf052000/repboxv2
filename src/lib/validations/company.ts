import { z } from 'zod'

export const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  industry: z.string().optional(),
})

export type CompanyInput = z.infer<typeof companySchema>



