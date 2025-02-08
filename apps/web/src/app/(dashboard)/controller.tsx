"use client"

import { Campaign, CampaignType } from "@/models/Campaign"
import { User, UserType } from "@/models/User"
import { createInitialisedObjectContext, isObjectEqual } from "@repo/utilities/client"
import { useSearchParams } from "next/navigation"
import { ReactNode, useEffect } from "react"
import { addOrganizationUser, createOrganizationCampaign, deleteCampaign, getOrganizationCampaigns, getOrganizationUsers, removeUserFromOrganization, updateCampaign, updateOrganization, updateOrganizationHandle, updateUserRole } from "./serverActions"
import { toast, useSonner } from "sonner"
import { useDebouncedCallback } from "use-debounce"
import { useCallback } from "react"


export type DashboardState = {
  organizationId: string
  organizationHandle: string
  googleLink: string
  instagramHandle: string
  tikTokHandle: string
  organizationUsers: UserType[]
  history: History[]
  campaigns: CampaignType[]
}

const [ 
  useDashboardState, 
  DashboardStateProvider,
] = createInitialisedObjectContext<DashboardState>()
export { DashboardStateProvider }


export function useDashboard() {
  const [state, setStateDirect] = useDashboardState()

  // Methods to send this to the database
  const pushOrganization = useDebouncedCallback(async (state: DashboardState) => {
    // Update the organization details
    updateOrganization({
      googleLink: state.googleLink as string,
      instagramHandle: state.instagramHandle ,
      tikTokHandle: state.tikTokHandle,
      organizationUsers: state.organizationUsers,
    })
  }, 800)

  const pushCampaigns = useDebouncedCallback(async (campaigns: CampaignType[]) => {
    // Update each campaign
    console.log(`TODO: not implemented`)
  }, 800)

  const setState = useCallback((
    newState: Parameters<typeof setStateDirect>[0]
  ) => {
    // 
    setStateDirect(newState)

    // Push organization only when it changes
    pushOrganization({ ...state, ...newState })

    // Push campaigns only when they change
    const isCampaignEqual = isObjectEqual(state.campaigns, newState.campaigns) 
    if (!isCampaignEqual) pushCampaigns(newState.campaigns)
  }, [setStateDirect, pushOrganization])

  // Methods to interact with the database
  return {
    state,
    setState,

    async updateOrganizationHandle(handle: string) {
      const result = await updateOrganizationHandle(handle)
      if (!result.success) toast.error(result.error)
      setState({ organizationHandle: result.handle })
    },

    async populateOrganizationUsers () {
      // If we already have the data, return it
      if (state.organizationUsers.length > 0) return state.organizationUsers

      // Otherwise fetch the data
      const userData = await getOrganizationUsers()
      setState({ organizationUsers: userData })
      return userData
    },

    async addOrganizationUser(data: {
      email: string
      role: UserType['role']
    }) {
      const newUserData = await addOrganizationUser(data)
      setState({ 
        organizationUsers: [...state.organizationUsers, newUserData] 
      })
    },
    
    async deleteOrganizationUser(userId?: string) {
      // Remove the user from the organization directly
      if (!userId) return
      await removeUserFromOrganization(userId)

      // Update the state to reflect the change
      const newUsers = state.organizationUsers.filter(user => user.id !== userId)
      setState({ organizationUsers: newUsers })
    },

    async updateUserRole(userId?: string, role?: UserType['role']) {
      // Update the user role directly
      if (!userId || !role) return
      await updateUserRole(userId, role)

      // Update the state to reflect the change
      const newUsers = state.organizationUsers.map(user => {
        if (user.id === userId) user.role = role
        return user
      })
      setState({ organizationUsers: newUsers })
    },

    async loadCampaigns () {
      const campaigns = await getOrganizationCampaigns()
      setState({ campaigns })
    },

    async createCampaign() {
      const campaign = await createOrganizationCampaign()
      return campaign
    },

    async reorderCampaigns(campaigns: Campaign[]) {
      console.log(`TODO: not implemented`)
    },

    async updateCampaign(data: CampaignType) {
      const result = await updateCampaign(data)
      if (!result.success) toast.error(result.error)
    },

    async deleteCampaign (campaignId: string) {
      try {
        await deleteCampaign(campaignId)
        window.location.reload()
      } catch (error) {
        toast.error('Failed to delete campaign')
      }
    },

    async getRewardHistory() {
      console.log(`TODO: not implemented`)
    },

  }
}
