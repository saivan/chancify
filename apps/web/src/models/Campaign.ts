import { dynamodbConnection } from "@/config"
import { baseModel } from "@repo/models"
import {} from 'react'
import { z } from "zod"


export const CampaignSchema = z.object({
  // Information
  id: z.string(),
  organizationId: z.string(),
  priority: z.number(),
  status: z.enum(['active', 'inactive']),
  action: z.object({
    id: z.string(),
    name: z.string(),
    platform: z.enum(['google', 'instagram', 'tiktok', 'facebook', 'personal']),
    data: z.record(z.string(), z.any()).optional(),
  }),
  prizes: z.array(z.object({
    id: z.string(),
    name: z.string(),
    chance: z.number(),
  })),
  themeId: z.string(),
  collectInformation: z.object({
    name: z.boolean(),
    phone: z.boolean(),
    email: z.boolean(),
    postalAddress: z.boolean(),
  }),

  // Book keeping
  dateCreated: z.string(),
  dateUpdated: z.string(),
})
export type CampaignType = z.infer<typeof CampaignSchema>
const PartialCampaignSchema = CampaignSchema.partial()
type PartialCampaignSchemaType = z.infer<typeof PartialCampaignSchema>


export class Campaign extends baseModel<PartialCampaignSchemaType>({
  name: 'Campaign',
  schema: CampaignSchema,
  connection: dynamodbConnection,
  indexes: [
    { partition: 'id' },
    { partition: 'organizationId', sort: 'priority' },
  ],
}) { }

