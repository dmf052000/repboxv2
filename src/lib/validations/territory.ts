import { z } from 'zod'

export const territorySchema = z.object({
  name: z.string().min(1, 'Territory name is required'),
  states: z.array(z.string()).default([]),
  zipCodes: z.array(z.string()).default([]),
})

export type TerritoryInput = z.infer<typeof territorySchema>

