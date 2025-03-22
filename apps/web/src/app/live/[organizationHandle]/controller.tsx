'use client'

import type { HistoryType } from '@/models/History'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
} from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { saveHistory, spin } from "./serverActions"
import type { CampaignType } from '@/models/Campaign'
import type { OrganizationType } from '@/models/Organization'
import { createInitialisedObjectContext } from '@repo/utilities/client'


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
  }
  historyId: string | null
  links: 'qr' | 'button'
}
const [
  useCustomerViewState, CustomerViewStateProvider,
] = createInitialisedObjectContext<CustomerViewState>()
export { useCustomerViewState, CustomerViewStateProvider }

type SpinCallbacks = {
  onStartSpin: () => Promise<void>
  onEndSpin: () => Promise<void>
  pushHistoryDebounced: (historyData: Partial<HistoryType>) => void
  pushHistory: (historyData: Partial<HistoryType>) => Promise<Partial<HistoryType>>
}

const SpinContext = createContext<SpinCallbacks | undefined>(undefined)
export function SpinProvider({ children }: { 
  children: ReactNode 
}) {
  const [state, setState] = useCustomerViewState()
  const router = useRouter()

  const onStartSpin = useCallback(async () => {
    // Do nothing if we can't spin yet
    if (state.wheel.current != 'ready') return     

    // Choose a random prize
    const selected = state.campaigns.selected
    const { index } = await spin({
      historyId: state.historyId as string,
      campaign: state.campaigns.list[selected],
    })
    setState({ wheel: { 
      ...state.wheel, 
      prizeIndex: index, 
      current: 'spinning' 
    }})
  }, [state])

  const onEndSpin = useCallback(async () => {
    if (state.wheel.current != 'spinning') return
    router.push(`/live/${state.organization.handle}/prize?selectedCampaign=${state.campaigns.selected}`)
    setState({ wheel: { ...state.wheel , current: 'finished' } })
  }, [state])

  const pushHistory = useCallback(async (historyData: Partial<HistoryType>) => {
    // Make sure we have an initial historyId
    if (state.historyId == null) {
      const newHistoryData = await saveHistory({
        ...historyData,
        campaignId: state.campaigns.list[state.campaigns.selected].id,
        organizationId: state.organization.id,
      })
      setState({ historyId: newHistoryData.id })
      return newHistoryData
    }

    // Update the history record
    const newHistoryData = await saveHistory({
      ...historyData,
      id: state.historyId,
    })
    return newHistoryData
  }, [state])

  const pushHistoryDebounced = useDebouncedCallback(pushHistory, 800)

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <SpinContext.Provider value={{ onStartSpin, onEndSpin, pushHistoryDebounced, pushHistory }}>
      {children}
    </SpinContext.Provider>
  )
}

export function useSpinCallbacks() {
  const context = useContext(SpinContext)
  if (!context) {
    throw new Error('useSpinCallbacks must be used within a SpinProvider')
  }
  return context
}

export function useGotoRoute () {
  const router = useRouter()
  const [state] = useCustomerViewState()

  const resolve = useCallback(function(path: string, options: {
    selectedCampaign?: number,
    links?: 'qr' | 'button',
  }) {
    const selectedCampaign =  Number(options.selectedCampaign ?? state.campaigns.selected ?? 0)
    const links = options.links ?? state.links ?? 'qr'
    const route = `${path}?selectedCampaign=${selectedCampaign}&links=${links}`
    return route
  }, [state.campaigns.selected])

  const goto = useCallback(function (path: string, options: {
    selectedCampaign?: number,
    links?: 'qr' | 'button',
  }={}) {
    const fullRoute = resolve(path, options)
    router.push(fullRoute)
  }, [router, state.campaigns.selected])

  return {
    goto,
    resolve
  }
}

export function useQueryParamUpdateEffect() {
  const [state, setState] = useCustomerViewState()
  const searchParams = useSearchParams()
  useEffect(() => {
    // Update the selected campaign
    const selected = Number(searchParams.get('selectedCampaign') || 0)
    if (selected !== state.campaigns.selected) {
      setState({ campaigns: { ...state.campaigns, selected }})
    }

    // Update the link display format
    const links = (searchParams.get('links') || 'qr') as 'qr' | 'button'
    if (links !== state.links) {
      setState({ links })
    }
  }, [state.campaigns, searchParams])
}

export function useEnforceDefinedHistory() {
  // If we don't have a historyId navigate home
  const [state] = useCustomerViewState()
  const searchParams = useSearchParams()
  const { goto } = useGotoRoute()
  useEffect(() => {
    // If we don't have a historyId navigate home
    if (state.historyId == null) {
      goto(`/live/${state.organization.handle}/campaigns`, {
        links: searchParams.get('links') as 'qr' | 'button',
      })
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
