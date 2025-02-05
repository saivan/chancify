"use client"

import { Campaign, Prize } from "@/models/Campaign"
import { User, UserType } from "@/models/User"
import { createInitialisedObjectContext } from "@repo/utilities/client"
import { useSearchParams } from "next/navigation"
import { ReactNode, useEffect } from "react"
import { updateOrganization, updateOrganizationHandle } from "./serverActions"
import { toast, useSonner } from "sonner"
import { useDebouncedCallback } from "use-debounce"
import { useCallback } from "react"

export type OrganizationState = {
  organizationId: string
  organizationHandle: string
  googleLink: string
  instagramHandle: string
  tikTokHandle: string
  organizationUsers: {
    email: string
    role: UserType['role']
  }[]
}

export type DashboardState = OrganizationState & {
  history: History[]
  campaigns: Campaign[]
}

const [ 
  useDashboardState, 
  DashboardStateProvider,
] = createInitialisedObjectContext<DashboardState>()
export { DashboardStateProvider }



export function useDashboard() {
  const [state, setStateDirect] = useDashboardState()

  // Methods to send this to the database
  const sendToDatabase = useDebouncedCallback(async (state: DashboardState) => {
    // Update the organization details
    updateOrganization({
      googleLink: state.googleLink as string,
      instagramHandle: state.instagramHandle ,
      tikTokHandle: state.tikTokHandle,
      organizationUsers: state.organizationUsers,
    })

    console.log(`updating to state`, state)





  }, 800)
  const setState = useCallback((
    newState: Parameters<typeof setStateDirect>[0]
  ) => {
    setStateDirect(newState)
    sendToDatabase({ ...state, ...newState })
  }, [setStateDirect, sendToDatabase])


  // Methods to interact with the database
  return {
    state,
    setState,

    async createCampaign(campaign: Campaign) {
      console.log(`TODO: not implemented`)
    },

    async reorderCampaigns(campaigns: Campaign[]) {
      console.log(`TODO: not implemented`)
    },

    async updateCampaign(campaign: Campaign) {
      console.log(`TODO: not implemented`)
    },

    async getRewardHistory() {
      console.log(`TODO: not implemented`)
    },

    async updateOrganizationHandle(handle: string) {
      const result = await updateOrganizationHandle(handle)
      if (!result.success) toast.error(result.error)
      setState({ organizationHandle: result.handle })
    },

    async updateOrganizationSocialProfiles() {

      console.log(`TODO: not implemented`)
    },

    async addOrganizationUser(user: User) {
      console.log(`TODO: not implemented`)
    },
  }
}
