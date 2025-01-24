
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
  const campaign = campaigns[selectedCampaign]

  return (
    <>
      <div>
        <h1 className='font-semibold text-2xl md:text-4xl tracking-tight text-slate-800 leading-tight'
        >{campaign.action.label}</h1>
        <p className='text-base md:text-lg text-slate-800 '>
          {campaign.action.instruction}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        Dummy QR code
      </div>
      <div className="flex gap-2">
        <Button asChild variant='outline'>
          <Link href={{
            pathname: '/live/campaigns',
            query: { selectedCampaign }
          }}>Cancel</Link>
        </Button>
        <Button asChild>
          <Link href={{
            pathname: '/live/details',
            query: { selectedCampaign }
          }}>Next</Link>
        </Button>
      </div>
    </>
  )
}






