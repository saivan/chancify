"use client"

// import type { CampaignType } from "@/models/Campaign"
import { createInitialisedObjectContext } from "@repo/utilities/client"
import { useSearchParams } from "next/navigation"
import { ReactNode, useEffect } from "react"


export type CustomerViewState = {
  organization: {
    id: string
  },
  campaigns: {
    list: CampaignType[]
    selected: number
  }
  wheel: {
    centered: boolean
    current: 'disabled' | 'ready' | 'spinning' | 'finished' 
    prizeIndex?: number
  },
  customer: {
    name: string
    postalAddress: string
    phone: string
    email: string
    acceptedTerms: boolean
  },
}

export const [ 
  useCustomerViewState, 
  CustomerViewStateProvider,
] = createInitialisedObjectContext<CustomerViewState>()


export function useQueryParamUpdateEffect () {
  const [state, setState] = useCustomerViewState()
  const searchParams = useSearchParams()
  useEffect(() => {
    const selected = Number(searchParams.get('selectedCampaign') || 0)
    if (selected !== state.campaigns.selected) {
      setState({ campaigns: { ...state.campaigns, selected } })
    }
  }, [state.campaigns, searchParams])
}

export function useEnforceWheelState (enforceState: CustomerViewState['wheel']) {
  // Enforce the state required for the wheel
  const [state, setState] = useCustomerViewState()
  useEffect(() => {
    setState({ wheel: enforceState })
  }, [])
}
