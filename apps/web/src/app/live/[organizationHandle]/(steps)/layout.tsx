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
              "rotate-90 translate-x-[-100%] -translate-y-2/3",
              state.wheel?.centered ? `translate-y-[-54%] md:translate-x-1/2` : '',
            )} 
          />
        </div>
        <div className={cn(
          "z-10 absolute inset-0 flex items-start pt-[40svh] pb-2 justify-center",
          "md:static md:flex md:items-center md:pt-0 md:pb-0",
          state.wheel?.centered && 'pointer-events-none',
          "max-h-[100svh] overflow-auto", // Make this container scrollable
        )}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className={cn(
                "w-11/12 md:w-full",
                "md:py-0 py-12",
              )}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, type: 'keyframes' }}
              key={pathname}
            > 
              <div className={cn(
                "flex flex-col justify-center gap-8 my-auto",
                "p-4 px-6 md:px-20",
                state.wheel?.centered == false && "bg-white/70 backdrop-blur-md md:bg-transparent md:backdrop-blur-none",
                state.wheel?.centered == false && "rounded-lg shadow-2xl shadow-slate-700/10 md:shadow-none md:rounded-none",
                "overflow-y-auto" // Add scrolling to this inner container
              )}>
                {props.children} 
              </div>
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
          "translate-y-[var(--mobile-wheel-translate-selected)]", 
          "md:translate-y-[var(--desktop-wheel-translate-selected)]",
        )}
        style={{ 
          '--desktop-wheel-translate-selected': `-${selectedCampaign * 100 / campaignCount}%`,
          '--mobile-wheel-translate-selected': `${-50 + selectedCampaign * 100 / campaignCount}%`,
        } as React.CSSProperties}
      >
        {state.campaigns.list.map((campaign, index) => {
          const isSelected = selectedCampaign === index
          const prizeIndex = isSelected
            ? state.wheel.prizeIndex
            : undefined
          const theme = themes[campaign.themeId]
          return (
            <div
              className="h-[200svw] md:h-[100svh] relative flex justify-center items-center"
              key={campaign.id}
              onClick={async (e) => {
                onStartSpin()
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <PrizeWheel
                className="h-full transition-transform"
                prizes={campaign.prizes}
                theme={theme}
                onTransitionEnd={() => {
                  onEndSpin()
                }}
                prizeIndex={prizeIndex}
                state={{ 
                  animating: state.wheel.animating,
                  rotating: state.wheel.rotating,
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
