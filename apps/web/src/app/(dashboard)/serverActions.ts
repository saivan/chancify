"use server"
import * as auth from "@repo/authentication/server"
import { Organization } from "@/models/Organization"
import { User, UserType } from "@/models/User"
import { Campaign, CampaignType } from "@/models/Campaign"
import { revalidatePath } from "next/cache"
import { History } from "@/models/History"


export async function resolveSignedInUserDetails() {
  // Get the signed in user
  const authUser = await auth.user()
  const email = authUser?.primaryEmailAddress
  if (!email) throw new Error('Signed in user has no email address')

  // Make sure the user exists and has the right information
  const user = await User.ensureUserExists(email.emailAddress)
  const missingFields = !user.data.name || !user.data.role
  if (missingFields) {
    user.data.name = user.data.name || authUser?.fullName || ''
    user.data.role = user.data.role || 'viewer'
    await user.push()
  }

  // Get the organization for the user
  const organization = await Organization.getUserOrganization(user)
  return { user, organization }
}

export async function getOrganizationUsers() {
  // Get the signed in user and organization
  const { user, organization } = await resolveSignedInUserDetails()

  // Fetch the users from this organization
  const users = await organization.users()
  return users
}

export async function addOrganizationUser(data: {
  email: string,
  role: UserType['role'],
}) {
  const { user, organization } = await resolveSignedInUserDetails()
  const newUser = new User({
    organizationId: organization.id(),
    ...data,
  })
  const exists = await newUser.exists()
  if (!exists) await newUser.create()
  await newUser.pull()
  return newUser.data
}

export async function updateOrganizationHandle(handle: string) {
  // Get the signed in user and organization
  const { user, organization } = await resolveSignedInUserDetails()

  // Check if the the handle is already in use
  const existingOrganization = new Organization({ handle })
  const exists = await existingOrganization.exists()
  if (exists) {
    return {
      handle: organization.data.handle,
      success: false,
      error: 'Organization handle already in use',
    }
  }

  // Otherwise update the organization handle
  organization.data.handle = handle
  await organization.push()
  await organization.pull()
  return {
    handle: organization.data.handle,
    success: true,
    error: null,
  }
}

export async function updateOrganization(data: {
  googleLink: string,
  instagramHandle: string,
  tikTokHandle: string,
  organizationUsers: UserType[],
}) {
  // Get the signed in user and organization
  const { user, organization } = await resolveSignedInUserDetails()

  // Update the organization data
  organization.set({
    ...organization.data,
    ...{
      googleLink: data.googleLink,
      instagramHandle: data.instagramHandle,
      tikTokHandle: data.tikTokHandle,
    },
  })
  await organization.push()

  // Make sure all of the organization users exist
  for (const { email, role } of data.organizationUsers) {
    if (!email) continue
    const user = await User.ensureUserExists(email)
    user.set({
      ...user.data,
      organizationId: organization.id(),
      role,
    })
  }

  // Return the fetched data
  await organization.pull()
  return organization.data
}

export async function removeUserFromOrganization(userId: string) {
  const user = new User({ id: userId })
  await user.delete()
}

export async function updateUserRole(userId: string, role: UserType['role']) {
  const user = new User({ id: userId })
  await user.pull()
  user.data.role = role
  await user.push()
}

export async function updateOrganizationSocialProfiles(social: string) {
  const { user, organization } = await resolveSignedInUserDetails()
  organization.data.googleLink = social
  await organization.push()
}

export async function createOrganizationCampaign() {
  const { user, organization } = await resolveSignedInUserDetails()
  const campaign = await organization.newCampaign()
  return campaign.data
}

export async function getOrganizationCampaigns() {
  const { user, organization } = await resolveSignedInUserDetails()
  const campaigns = await organization.campaigns()
  return campaigns as CampaignType[]
}

export async function updateCampaign(data: CampaignType) {
  const { user, organization } = await resolveSignedInUserDetails()
  const campaign = new Campaign(data)

  try {
    // Make sure the campaign belongs to the organization
    if (campaign.data.organizationId !== organization.id()) {
      throw new Error('This campaign does not belong to the organization')
    }

    // Update the campaign
    await campaign.push()
  } catch (error: any) {
    return { success: false, error: error.message }
  }
  return { success: true, error: null }
}

export async function deleteCampaign(campaignId: string) {
  const { user, organization } = await resolveSignedInUserDetails()
  const campaign = new Campaign({ id: campaignId })

  try {
    // Make sure the campaign belongs to the organization
    await campaign.pull()
    if (campaign.data.organizationId !== organization.id()) {
      throw new Error('This campaign does not belong to the organization')
    }

    // Delete the campaign
    await campaign.delete()
  } catch (error: any) {
    console.log(`error`, error)
    return { success: false, error: error.message }
  }
  return { success: true, error: null }
}

export async function fetchHistory() {
  const { user, organization } = await resolveSignedInUserDetails()
  const history = await organization.history()
  return history
}

export async function getFullHistoryData(id: string) {
  // Get a single history item
  const { user, organization } = await resolveSignedInUserDetails()
  const history = new History({ id })
  await history.pull()
  const historyData = history.data

  // Get the corresponding campaign
  const campaign = new Campaign({ id: historyData.campaignId })
  await campaign.pull()
  const campaignData = campaign.data
  return { history: historyData, campaign: campaignData }
}

