
"use client"

import { Campaign } from "@/models/Campaign"
import { cn, useNavigationState, usePath } from "@repo/utilities/client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useCustomerViewState, useEnforceWheelState } from "@/app/live/controller"
import { Button, QRCode } from "@repo/components"



export default function ChooseCampaign() {
  const [state] = useCustomerViewState()
  useEnforceWheelState({ 
    current: 'disabled', 
    centered: false,
    prizeIndex: undefined,
  })
  const selectedCampaign = state.campaigns.selected
  const campaign = state.campaigns.list[selectedCampaign]

  return (
    <>
      <div>
        <h1 className='font-semibold text-2xl md:text-4xl tracking-tight text-slate-800 leading-tight'
        >{campaign.action.label}</h1>
        <p className='text-base md:text-lg text-slate-800 '>
          {campaign.action.instruction}
        </p>
      </div>
      <div className="flex flex-col gap-4 border rounded-md border-border w-max p-4">
        <QRCode url="https://g.page/r/CTAANO9cfKlBEAE" />
      </div>
      <div className="flex gap-2">
        <Button asChild variant='outline'>
          <Link href={{
            pathname: '/live/campaigns',
            query: { selectedCampaign }
          }}>Back</Link>
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








