'use client'

import { 
  createContext, useContext, useCallback, ReactNode,
} from 'react'
import { useCustomerViewState } from '../controller'
import { saveHistory } from "../serverActions"
import { spin } from "../serverActions"
import { useRouter } from 'next/navigation'
import type { HistoryType } from '@/models/History'
import { useDebouncedCallback } from 'use-debounce'


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
