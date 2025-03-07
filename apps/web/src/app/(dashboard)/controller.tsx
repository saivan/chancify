"use client"

import type { CampaignType } from "@/models/Campaign"
import type { HistoryType } from "@/models/History"
import type { UserType } from "@/models/User"
import { createInitialisedObjectContext } from "@repo/utilities/client"
import { useCallback } from "react"
import { toast } from "sonner"
import { useDebouncedCallback } from "use-debounce"
import { addOrganizationUser, createOrganizationCampaign, deleteCampaign, deleteHistory, getOrganizationCampaigns, getOrganizationUsers, removeUserFromOrganization, resolveHistoryLink, updateCampaign, updateHistory, updateOrganization, updateOrganizationHandle, updateUserRole } from "./serverActions"


export type DashboardState = {
  organizationId: string
  organizationHandle: string
  googleLink: string
  instagramHandle: string
  tikTokHandle: string
  facebookUsername: string
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
    await updateOrganization({
      googleLink: state.googleLink as string,
      instagramHandle: state.instagramHandle,
      tikTokHandle: state.tikTokHandle,
      organizationUsers: state.organizationUsers,
      facebookUsername: state.facebookUsername,
    })
  }, 800)

  const setState = useCallback((
    newState: Parameters<typeof setStateDirect>[0]
  ) => {
    const finalState = { ...state, ...newState }
    setStateDirect(newState)
    pushOrganization(finalState)
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

    async populateOrganizationUsers() {
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

    async loadCampaigns() {
      const campaigns = await getOrganizationCampaigns()
      setState({ campaigns })
    },

    async createCampaign() {
      const campaign = await createOrganizationCampaign()
      return campaign
    },

    async updateCampaign(data: CampaignType) {
      const result = await updateCampaign(data)
      if (!result.success) {
        toast.error(result.error)
      }
      return result
    },

    async deleteCampaign(campaignId: string) {
      try {
        await deleteCampaign(campaignId)
        window.location.reload()
      } catch (error) {
        toast.error('Failed to delete campaign')
      }
    },

    async resolveHistoryLink(id: string) {
      const link = await resolveHistoryLink(id)
      return link
    },

    async updateHistory(history: Partial<HistoryType>) {
      const result = await updateHistory(history)
      return result
    },

    async deleteHistory (historyId: string) {
      await deleteHistory(historyId)
      window.location.reload()
    },
  }
}
