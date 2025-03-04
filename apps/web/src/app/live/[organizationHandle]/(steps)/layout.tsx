"use client"

import { PrizeWheel } from "@/components/wheel"
import { themes } from "@/models/Theme"
import { cn } from "@repo/utilities/client"
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useCustomerViewState, useQueryParamUpdateEffect } from "../controller"
import { SpinProvider, useSpinCallbacks } from "./actions"



export default function Layout (props: { children: ReactNode }) {
  const [state] = useCustomerViewState()
  const pathname = usePathname()
  useQueryParamUpdateEffect()
  return (
    <SpinProvider>
      <div className={cn(
        "grid grid-rows-[1fr] md:grid-cols-[1fr_minmax(542px,1fr)] h-[100svh]",
        "w-full overflow-clip relative",
      )}>
        <div className="relative flex items-center justify-center md:block md:right-0 w-full md:w-auto">
          <WheelDisplay
            className={cn(
              "absolute transition-transform duration-700 ease-out",
              "left-1/2 md:rotate-0 md:-translate-x-1/2 top-1/2 md:-translate-y-1/2 md:top-auto md:transform-none",
              "md:left-auto md:right-0", // Center on mobile, right aligned on desktop
              "rotate-90 translate-x-[-100%] -translate-y-1/2",
              state.wheel?.centered ? `md:translate-x-1/2` : '',
            )} 
          />
        </div>
        <div className={cn(
          "z-10 absolute inset-0 md:static md:flex md:items-center flex items-center justify-center",
          state.wheel?.centered && 'pointer-events-none',
        )}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="flex flex-col justify-center gap-8 p-4 my-auto px-6 md:px-20 
                        w-11/12 md:w-full bg-white/70 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none
                        rounded-lg shadow-lg md:shadow-none md:rounded-none"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, type: 'keyframes' }}
              key={pathname}
            > 
              {props.children} 
            </motion.div>
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
  const [state] = useCustomerViewState()
  const selectedCampaign = state.campaigns.selected
  const campaignCount = state.campaigns.list.length

  return (
    <div className={props.className}>
      <div
        className={cn(
          "transition-transform duration-700 ease-in-out flex flex-col",
          "flex-col-reverse md:flex-col",
          "translate-y-[var(--mobile-wheel-translation)]", 
          "md:translate-y-[var(--desktop-wheel-translation)]",
        )}
        style={{ 
          '--desktop-wheel-translation': `-${selectedCampaign * 100 / campaignCount}%`,
          '--mobile-wheel-translation': `${-50 + selectedCampaign * 100 / campaignCount}%`,
        } as React.CSSProperties}
      >
        {state.campaigns.list.map((campaign, index) => {
          const prizeIndex = selectedCampaign === index
            ? state.wheel.prizeIndex
            : undefined
          const theme = themes[campaign.themeId]
          return (
            <div
              className="h-[100svw] md:h-[100svh] relative flex justify-center items-center"
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
