'use client'


import { 
  createContext, useContext, useCallback, ReactNode,
} from 'react'
import { useCustomerViewState } from '../controller'
import { selectRandomPrize } from '@/models/Campaign'
import { useRouter } from 'next/navigation'


type SpinCallbacks = {
  onStartSpin: () => Promise<void>
  onEndSpin: () => Promise<void>
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
    const prizes = state.campaigns.list[selected].prizes
    const { index } = selectRandomPrize(prizes)
    setState({ wheel: { 
      ...state.wheel, 
      prizeIndex: index, 
      current: 'spinning' 
    }})
  }, [state])

  const onEndSpin = useCallback(async () => {
    console.log(`state.wheel.current`, state.wheel.current)
    if (state.wheel.current != 'spinning') return
    console.log(`spun`, state)
    router.push(`/live/${state.organization.id}/prize?selectedCampaign=${state.campaigns.selected}`)
    setState({ wheel: { ...state.wheel , current: 'finished' } })
  }, [state])

  return (
    <SpinContext.Provider value={{ onStartSpin, onEndSpin }}>
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
