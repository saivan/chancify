"use client"

import { Campaign } from "@/models/Campaign"
import { cn, useNavigationState, usePath } from "@repo/utilities/client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useCampaigns } from "../../../provider"
import { Button } from "@repo/components"



export default function ChooseCampaign() {
  const [campaigns, setCampaigns] = useCampaigns()
  const { queryParams, updateQueryParams } = useNavigationState()
  const selectedCampaign = Number(queryParams.selectedCampaign ?? 0)

  return (
    <>
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
          }}> Claim Reward </Link>
        </Button>
      </div>
    </>
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