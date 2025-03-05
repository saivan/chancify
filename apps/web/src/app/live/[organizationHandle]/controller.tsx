"use client"

import type { CampaignType } from "@/models/Campaign"
import type { OrganizationType } from "@/models/Organization"
import { createInitialisedObjectContext } from "@repo/utilities/client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"


export type CustomerViewState = {
  organization: {
    id: string
    handle: string
    data: Partial<OrganizationType>
  }
  campaigns: {
    list: CampaignType[]
    selected: number
  }
  wheel: {
    centered: boolean
    animating: boolean
    rotating: boolean
    current: 'disabled' | 'ready' | 'spinning' | 'finished'
    prizeIndex?: number
  },
  historyId: string | null,
}

const [
  hook,
  provider,
] = createInitialisedObjectContext<CustomerViewState>()

export const useCustomerViewState = hook
export const CustomerViewStateProvider = provider

export function useQueryParamUpdateEffect() {
  const [state, setState] = useCustomerViewState()
  const searchParams = useSearchParams()
  useEffect(() => {
    const selected = Number(searchParams.get('selectedCampaign') || 0)
    if (selected !== state.campaigns.selected) {
      setState({ campaigns: { ...state.campaigns, selected } })
    }
  }, [state.campaigns, searchParams])
}

export function useEnforceDefinedHistory() {
  // If we don't have a historyId navigate home
  const [state] = useCustomerViewState()
  const router = useRouter()
  useEffect(() => {
    if (state.historyId == null) {
      router.replace(`/live/${state.organization.handle}/campaigns`)
    }
  }, [])
}

export function useEnforceWheelState(enforceState: CustomerViewState['wheel']) {
  // Enforce the state required for the wheel
  const [, setState] = useCustomerViewState()
  useEffect(() => {
    setState({ wheel: enforceState })
  }, [])
}
