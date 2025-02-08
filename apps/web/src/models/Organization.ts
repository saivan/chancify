

import { baseModel } from "@repo/models";
import { z } from "zod";
import { dynamodbConnection } from '@/config'
import { User } from "./User";
import { shortId } from "@repo/utilities";
import { Campaign } from "./Campaign";
import { themes } from "./Theme";


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
    const organizationId = this.data.id
    const users = await User.list({ organizationId })
    const userData = users.items.map(user => user.data)
    console.log(`userData`, userData)
    return userData
  }

  async newCampaign () {
    // Get the id of the organization
    const organizationId = this.id()
    if (organizationId == null) throw Error('There is no active organization')

    // Make a new campaign and send it to the database
    const campaign = new Campaign({
      organizationId,
      priority: 0,
      status: 'inactive',
      action: {
        label: '',
        value: '',
        platform: 'personal',
        icon: '',
        instruction: '',
      },
      collectInformation: {
        name: false,
        email: false,
        phone: false,
        postalAddress: false,
      },
      prizes: [{
        id: shortId(),
        name: 'First Prize',
        chance: 1,
      }],
      themeId: [...Object.keys(themes)][0],
    })
    console.log(`campaign`, campaign)
    await campaign.create()
    return campaign
  }

  async campaigns () {
    const organizationId = this.id()
    const campaignList = await Campaign.list({ organizationId })
    const campaigns = campaignList.items
    return campaigns
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
