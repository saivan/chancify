import { z } from "zod"
import { dynamodbConnection } from "@/config"
import { baseModel } from "@repo/models"



export const HistorySchema = z.object({
  // Book keeping
  id: z.string(),
  organizationId: z.string(),
  campaignId: z.string(),
  dateCreated: z.string(),
  dateUpdated: z.string(),

  // Data
  status: z.enum(['claimed', 'unclaimed', 'incomplete']),
  prize: z.object({
    id: z.string(),
    name: z.string(),
    chance: z.number(),
  }),
  customer: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string(),
    postalAddress: z.string(),
    acceptedTerms: z.boolean(),
    details: z.record(z.any()),
  }),
})
export type HistoryType = z.infer<typeof HistorySchema>
export const PartialHistorySchema = HistorySchema.partial()
type PartialHistorySchemaType = z.infer<typeof PartialHistorySchema>


export class History extends baseModel<PartialHistorySchemaType>({
  name: 'History',
  schema: PartialHistorySchema,
  connection: dynamodbConnection,
  indexes: [
    { partition: 'id' },
    { partition: 'organizationId', sort: 'dateCreated' },
  ],
}) { }

