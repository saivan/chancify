

import { baseModel } from "@repo/models";
import { z } from "zod";
import { dynamodbConnection } from '@/config'
import { User } from "./User";
import { shortId } from "@repo/utilities";


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


export class Organization extends baseModel<OrganizationType>({
  name: 'Organization',
  schema: OrganizationSchema,
  connection: dynamodbConnection,
  indexes: [
    { partition: 'id' },
    { partition: 'handle', sort: 'dateCreated' },
  ],
}) { 

  async users () {
    // Fetch the users from this organization 
    return this
  }

  static async getUserOrganization (user: User) {
    // Make sure the user has an organization assigned 
    const organizationId = user.data.organizationId || shortId()
    const userHasNoOrganization = user.data.organizationId == null
    if (userHasNoOrganization) {
      user.data.organizationId = organizationId
      await user.push()
    }

    // Make sure the organization exists
    const organization = new Organization({ 
      id: organizationId,
      googleLink: '',
      instagramHandle: '',
      tikTokHandle: '',
      handle: shortId(),
    })
    const exists = await organization.exists()
    if (!exists) await organization.create()
    await organization.pull()
    return organization
  }
}
