"use client"

import { PrizeWheel } from "@/components/wheel"
import { cn } from "@repo/utilities/client"
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { useCustomerViewState, useQueryParamUpdateEffect  } from "../controller"
import { themes } from "@/models/Theme"
import { SpinProvider, useSpinCallbacks } from "./actions"



export default function Layout (props: { children: ReactNode }) {
  const [state, setState] = useCustomerViewState()
  const pathname = usePathname()
  useQueryParamUpdateEffect()
  return (
    <SpinProvider>
    <div className={cn(
    "grid grid_rows-[1fr_1fr] md:grid-cols-[1fr_1fr] h-[100svh]",
    "w-full overflow-clip",
    )}>
        <div className="relative right-0">
          <WheelDisplay
            className={cn(
              "absolute right-0 transition-transform duration-700 ease-out",
              state.wheel?.centered ? `translate-x-1/2` : '',
            )} 
          />
        </div>
        <div className="z-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="flex flex-col justify-center gap-8 p-4 h-[100svh] my-auto px-20 min-w-max w-1/2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, type: 'keyframes' }}
              key={pathname}
            > {props.children} </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SpinProvider> 
  )
}


function WheelDisplay(props: {
  className?: string
}) {
  const { onStartSpin, onEndSpin } = useSpinCallbacks()
  const [state, setState] = useCustomerViewState()
  const selectedCampaign = state.campaigns.selected
  const campaignCount = state.campaigns.list.length

  return (
    <div className={props.className} >
      <div
        className="transition-transform duration-700 ease-in-out"
        style={{ transform: `translateY(-${selectedCampaign * 100 / campaignCount}%)` }}
      >
        {state.campaigns.list.map((campaign, index) => {
          const prizeIndex = selectedCampaign === index
            ? state.wheel.prizeIndex
            : undefined
          const theme = themes[campaign.themeId]
          return (
            <div
              className="h-[100svh] relative flex justify-center items-center"
              key={campaign.id}
              onClick={async (e) => {
                onStartSpin()
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <PrizeWheel
                className="h-full"
                prizes={campaign.prizes}
                theme={theme}
                onTransitionEnd={() => {
                  onEndSpin()
                }}
                prizeIndex={prizeIndex}
                state={{ animating: false }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
