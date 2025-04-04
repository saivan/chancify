"use client"

import { cn } from "@repo/utilities/client"
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useCustomerViewState, useQueryParamUpdateEffect } from "./controller"

export function InformationDisplay (props: { children: ReactNode }) {
  const [state] = useCustomerViewState()
  const pathname = usePathname()
  useQueryParamUpdateEffect()
  return (

  <div className={cn(
    "z-10 absolute inset-0 flex items-start pt-[40svh] pb-2 justify-center",
    "md:static md:flex md:items-center md:pt-0 md:pb-0 md:justify-start",
    state.wheel?.centered && 'pointer-events-none',
    "max-h-[100svh] overflow-auto",
  )}>
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        className={cn(
          "w-11/12 md:w-full md:max-w-160",
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
          "overflow-y-auto" 
        )}>
          {props.children}
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
  )
}
