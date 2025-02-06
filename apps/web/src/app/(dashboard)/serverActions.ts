"use server"
import * as auth from "@repo/authentication/server"
import { Organization } from "@/models/Organization"
import { User, UserType } from "@/models/User"


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

export async function getOrganizationUsers () {
  // Get the signed in user and organization
  const { user, organization } = await resolveSignedInUserDetails()

  // Fetch the users from this organization
  const users = await organization.users()
  return users
}

export async function addOrganizationUser (data: {
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

export async function updateOrganization (data: {
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
