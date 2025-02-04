
import { baseModel } from "@repo/models"
import { z } from "zod"
import { dynamodbConnection } from '@/config'


export const UserSchema = z.object({
  // Information
  id: z.string(),
  organizationId: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(['admin', 'editor', 'viewer']),

  // Book keeping
  dateCreated: z.string(),
  dateUpdated: z.string(),
}).partial()
export type UserType = z.infer<typeof UserSchema>


export class User extends baseModel({
  name: 'User',
  schema: UserSchema,
  connection: dynamodbConnection,
  indexes: [
    { partition: 'id' },
    { partition: 'email', sort: 'dateCreated' },
    { partition: 'organizationId', sort: 'email' },
  ],
}) { }

