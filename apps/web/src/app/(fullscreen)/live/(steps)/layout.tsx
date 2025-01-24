"use client"

import { ReactNode } from 'react'
import { PrizeWheel } from "@/components/wheel"
import { Campaign } from "@/models/Campaign"
import { cn, useNavigationState, usePath } from "@repo/utilities/client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useCampaigns } from "../provider"
import { Button } from "@repo/components"
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'


export default function (props: { children: ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="grid grid_rows-[1fr_1fr] md:grid-cols-[1fr_1fr] h-[100svh] w-full bg-slate-200 overflow-clip">
      <div className="relative right-0">
        <WheelDisplay className="absolute right-0" />
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
  const [campaigns, setCampaigns] = useCampaigns()
  const { queryParams, updateQueryParams } = useNavigationState()
  const selectedCampaign = Number(queryParams.selectedCampaign)
  const campaignCount = campaigns.length
  return (
    <div className={className}>
      <div className="transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateY(-${selectedCampaign * 100 / campaignCount}%)` }}
      >
        {campaigns.map(campaign => {
          return (
            <div
              className="h-[100svh] relative flex justify-center items-center"
              key={campaign.id}
            >
              <PrizeWheel
                className="h-full"
                prizes={campaign.prizes}
                theme={campaign.theme}
                state={{}}
              />
            </div>
          )
        })}
      </div>
    </div>
  )

}

function ChooseCampaign() {
  const [campaigns, setCampaigns] = useCampaigns()
  const { queryParams, updateQueryParams } = useNavigationState()
  const selectedCampaign = Number(queryParams.selectedCampaign)

  return (
    <div className="flex flex-col justify-center gap-8 p-4 h-[100svh] my-auto px-20 min-w-max w-1/2">
      <div>
        <h1 className='font-semibold text-2xl md:text-4xl tracking-tight text-slate-800 leading-tight'
        >Available Actions</h1>
        <p className='text-base md:text-lg font-semibold italic text-slate-500 '>
          Complete any of the following for a free spin
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {campaigns.map((campaign, index) => {
          return (
            <CampaignButton
              key={campaign.id}
              campaign={campaign}
              index={index}
            />
          )
        })}
      </div>
      <div>
        <Button asChild>
          <Link href={{
            pathname: '/live/action',
            query: { selectedCampaign }
          }}>Claim Reward</Link>
        </Button>
      </div>


    </div>
  )
}







function CampaignButton(props: {
  campaign: Campaign
  index: number
}) {
  const { queryParams, updateQueryParams } = useNavigationState()
  const selectedCampaign = Number(queryParams.selectedCampaign)
  const isSelected = selectedCampaign === props.index
  console.log(`selectedCampaign,isSelected`, selectedCampaign, isSelected)
  return (
    <Link
      className={cn(
        "p-4 flex gap-4 outline outline-slate-400 rounded-md items-center",
        isSelected && "outline-2 outline-slate-800",
      )}
      href={{ query: { selectedCampaign: props.index } }}

    >
      <Image width={32} height={32}
        src={`/images/logos/${props.campaign.platform}.svg`}
        alt={props.campaign.platform}
      />
      <div>
        {props.campaign.action.label}
      </div>
    </Link>
  )
}