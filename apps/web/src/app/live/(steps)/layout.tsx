"use client"

import { PrizeWheel } from "@/components/wheel"
import { cn, useNavigationState } from "@repo/utilities/client"
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { useCustomerViewState, useQueryParamUpdateEffect } from "../provider"


export default function (props: { children: ReactNode }) {
  const [state] = useCustomerViewState()
  const pathname = usePathname()
  useQueryParamUpdateEffect()
  return (
    <div className={cn(
      "grid grid_rows-[1fr_1fr] md:grid-cols-[1fr_1fr] h-[100svh]",
      "w-full bg-slate-200 overflow-clip",
    )}>
      <div className="relative right-0">
        <WheelDisplay 
          className={cn(
            "absolute right-0 transition-transform duration-700 ease-out",
            state.layout.wheelCentred ? `translate-x-1/2` : '',
          )}
        />
      </div>
      <div className="z-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="flex flex-col justify-center gap-8 p-4 h-[100svh] my-auto px-20 min-w-max w-1/2"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, type: 'spring' }}
            key={pathname}
          > {props.children} </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}


function WheelDisplay({ className }: { className?: string }) {
  const [state, setState] = useCustomerViewState()
  const selectedCampaign = state.campaigns.selected
  const campaignCount = state.campaigns.list.length

  return (
    <div className={className}>
      <div 
        className="transition-transform duration-700 ease-in-out"
        style={{ transform: `translateY(-${selectedCampaign * 100 / campaignCount}%)` }}
      >
        {state.campaigns.list.map(campaign => {
          return (
            <div
              className="h-[100svh] relative flex justify-center items-center"
              key={campaign.id}
            >
              <PrizeWheel
                className="h-full"
                prizes={campaign.prizes}
                theme={campaign.theme}
                state={{ lights: { animating: false }}}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

