"use server"
import * as auth from "@repo/authentication/server"
import { Organization } from "@/models/Organization"
import { User, UserType } from "@/models/User"
import type { OrganizationState } from "./controller"


export async function resolveSignedInUserDetails() {
  // Get the signed in user
  const authUser = await auth.user()
  const email = authUser?.primaryEmailAddress
  if (!email) throw new Error('Signed in user has no email address')

  // Get the user and organization
  const user = await User.getUserByEmail(email.emailAddress)
  const organization = await Organization.getUserOrganization(user)
  return { user, organization }
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
  organizationUsers: {
    email: string
    role: UserType['role']
  }[],
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
    const user = await User.getUserByEmail(email)
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


export async function updateOrganizationSocialProfiles(social: string) {
  const { user, organization } = await resolveSignedInUserDetails()
  organization.data.googleLink = social
  await organization.push()
}
