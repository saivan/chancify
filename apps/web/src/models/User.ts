
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


export class User extends baseModel<UserType>({
  name: 'User',
  schema: UserSchema,
  connection: dynamodbConnection,
  indexes: [
    { partition: 'id' },
    { partition: 'email' },
    { partition: 'organizationId', sort: 'email' },
  ],
}) { 

  static async ensureUserExists(email: string) {
    const user = new User({ email })
    const exists = await user.exists()
    if (!exists) await user.create()
    await user.pull()
    return user
  }

}

