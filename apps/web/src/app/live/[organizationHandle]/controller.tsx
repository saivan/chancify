"use client"

import type { CampaignType } from "@/models/Campaign"
import { OrganizationType } from "@/models/Organization"
import { createInitialisedObjectContext } from "@repo/utilities/client"
import { useRouter, useSearchParams } from "next/navigation"
import { ReactNode, useEffect } from "react"


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
    current: 'disabled' | 'ready' | 'spinning' | 'finished'
    prizeIndex?: number
  },
  historyId: string | null,
}

export const [
  useCustomerViewState,
  CustomerViewStateProvider,
] = createInitialisedObjectContext<CustomerViewState>()


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
  const [state, setState] = useCustomerViewState()
  const router = useRouter()
  useEffect(() => {
    if (state.historyId == null) {
      router.replace(`/live/${state.organization.handle}/campaigns`)
    }
  }, [])
}

export function useEnforceWheelState(enforceState: CustomerViewState['wheel']) {
  // Enforce the state required for the wheel
  const [state, setState] = useCustomerViewState()
  useEffect(() => {
    setState({ wheel: enforceState })
  }, [])
}
