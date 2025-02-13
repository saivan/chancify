"use server"
import * as auth from "@repo/authentication/server"
import { Organization } from "@/models/Organization"
import { User, type UserType } from "@/models/User"
import { Campaign, type CampaignType } from "@/models/Campaign"
import { History, type HistoryType } from "@/models/History"


export async function resolveSignedInUserDetails() {
  // Get the signed in user
  const authUser = await auth.user()
  if (!authUser) throw new Error('No signed in user')
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
  const { organization } = await resolveSignedInUserDetails()

  // Fetch the users from this organization
  const users = await organization.users()
  return users
}

export async function addOrganizationUser(data: {
  email: string,
  role: UserType['role'],
}) {
  const { organization } = await resolveSignedInUserDetails()
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
  const { organization } = await resolveSignedInUserDetails()

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
  facebookUsername: string,
  organizationUsers: UserType[],
}) {
  // Get the signed in user and organization
  const { organization } = await resolveSignedInUserDetails()

  // Update the organization data
  organization.set({
    ...organization.data,
    ...{
      googleLink: data.googleLink,
      instagramHandle: data.instagramHandle,
      tikTokHandle: data.tikTokHandle,
      facebookUsername: data.facebookUsername,
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
  await resolveSignedInUserDetails()
  const user = new User({ id: userId })
  await user.delete()
}

export async function updateUserRole(userId: string, role: UserType['role']) {
  await resolveSignedInUserDetails()
  const user = new User({ id: userId })
  await user.pull()
  user.data.role = role
  await user.push()
}

export async function updateOrganizationSocialProfiles(social: string) {
  const { organization } = await resolveSignedInUserDetails()
  organization.data.googleLink = social
  await organization.push()
}

export async function createOrganizationCampaign() {
  const { organization } = await resolveSignedInUserDetails()
  const campaign = await organization.newCampaign()
  return campaign.data
}

export async function getOrganizationCampaigns() {
  const { organization } = await resolveSignedInUserDetails()
  const campaigns = await organization.campaigns()
  return campaigns as CampaignType[]
}

export async function updateCampaign(data: CampaignType) {
  const { organization } = await resolveSignedInUserDetails()
  const campaign = new Campaign(data)

  try {
    // Make sure the campaign belongs to the organization
    if (campaign.data.organizationId !== organization.id()) {
      throw new Error('This campaign does not belong to the organization')
    }

    // If the campaign is active, ensure we have the required handle
    if (campaign.data.status === 'active') {

      if (campaign.data.action?.platform == 'facebook' && !organization.data.facebookUsername) {
        throw new Error('Please set your Facebook username in the organization settings')
      }

      if (campaign.data.action?.platform == 'instagram' && !organization.data.instagramHandle) {
        throw new Error('Please set your Instagram handle in the organization settings')
      }

      if (campaign.data.action?.platform == 'tiktok' && !organization.data.tikTokHandle) {
        throw new Error('Please set your TikTok handle in the organization settings')
      }

      if (campaign.data.action?.platform == 'google' && !organization.data.googleLink) {
        throw new Error('Please set your Google link in the organization settings')
      }
    }

    // Update the campaign
    await campaign.push()
  } catch (error: any) {
    await campaign.pull()
    return { success: false, error: error.message, campaign: campaign.data }
  }
  return { success: true, error: null, campaign: campaign.data }
}

export async function deleteCampaign(campaignId: string) {
  const { organization } = await resolveSignedInUserDetails()
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
    return { success: false, error: error.message }
  }
  return { success: true, error: null }
}

export async function fetchHistory() {
  const { organization } = await resolveSignedInUserDetails()
  const history = await organization.history()
  return history
}

export async function getFullHistoryData(id: string) {
  // Get a single history item
  const { organization } = await resolveSignedInUserDetails()
  const history = new History({ id })
  await history.pull()
  const historyData = history.data

  // Make sure the history item belongs to this organization
  const isWrongOrganization = historyData.organizationId !== organization.id()
  if (isWrongOrganization) {
    throw new Error('This history item does not belong to the organization')
  }

  // Get the corresponding campaign
  const campaign = new Campaign({ id: historyData.campaignId })
  await campaign.pull()
  const campaignData = campaign.data
  const organizationData = organization.data
  return { 
    history: historyData, 
    campaign: campaignData,
    organization: organizationData,
  }
}

export async function resolveHistoryLink (id: string) {
  // Get the signed in user and organization
  const { organization } = await resolveSignedInUserDetails()

  // Pull the history item
  const history = new History({ id })
  await history.pull()

  // Pull the correct campaign
  const campaign = new Campaign({ id: history.data.campaignId })
  await campaign.pull()

  // Determine the link to verify the
  if (campaign.data.action?.platform == null) return null
  const handleResolvers = {
    instagram: () => `https://instagram.com/${organization.data.instagramHandle}`,
    tiktok: () => `https://tiktok.com/@${organization.data.tikTokHandle}`,
    google: () => organization.data.googleLink,
  }
  const platform = campaign.data.action.platform as keyof typeof handleResolvers
  const link = platform in handleResolvers ? handleResolvers[platform]() : ''
  return link
}

export async function updateHistory (history: Partial<HistoryType>) {
  const { organization } = await resolveSignedInUserDetails()
  const historyItem = new History(history)
  if (historyItem.data.organizationId !== organization.id()) {
    throw new Error('This history item does not belong to the organization')
  }
  await historyItem.push()
  const historyData = historyItem.data
  return historyData
}

export async function deleteHistory (historyId: string) {
  const { organization } = await resolveSignedInUserDetails()
  const history = new History({ id: historyId })
  await history.pull()
  if (history.data.organizationId !== organization.id()) {
    throw new Error('This history item does not belong to the organization')
  }
  await history.delete()
}
