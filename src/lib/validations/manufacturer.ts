import { z } from 'zod'

export const manufacturerSchema = z.object({
  name: z.string().min(1, 'Manufacturer name is required'),
  logo: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  primaryContact: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  notes: z.string().optional(),
})

export type ManufacturerInput = z.infer<typeof manufacturerSchema>



