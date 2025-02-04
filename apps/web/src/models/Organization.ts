

import { baseModel } from "@repo/models";
import { z } from "zod";
import { dynamodbConnection } from '@/config'


export const OrganizationSchema = z.object({
  // Identity access
  id: z.string(),
  handle: z.string(),

  // Social profiles
  googleLink: z.string(),
  instagramHandle: z.string(),
  tikTokHandle: z.string(),

  // Book keeping
  dateCreated: z.string(),
  dateUpdated: z.string(),
}).partial()
export type OrganizationType = z.infer<typeof OrganizationSchema>


export class Organization extends baseModel({
  name: 'Organization',
  schema: OrganizationSchema,
  connection: dynamodbConnection,
  indexes: [
    { partition: 'id' },
    { partition: 'handle', sort: 'dateCreated' },
  ],
}) { }
