"use client"

import { Campaign } from "@/models/Campaign"
import { createInitialisedObjectContext } from "@repo/utilities/client"
import { useSearchParams } from "next/navigation"
import { ReactNode, useEffect } from "react"


export type CustomerViewState = {
  campaigns: {
    list: Campaign[]
    selected: number
  }
  layout: {
    wheelCentred: boolean
  }
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

export function useWheelCenteredEffect (wheelCentred: boolean) {
  const [state, setState] = useCustomerViewState()
  useEffect(() => {
    setState({ layout: { wheelCentred } })
  }, [])
}


