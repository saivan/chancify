"use client"

import type { CampaignType } from "@/models/Campaign"
import { cn, useNavigationState, usePath } from "@repo/utilities/client"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import { useCustomerViewState, useEnforceWheelState } from "@/app/live/[organizationHandle]/controller"
import { Button } from "@repo/components"



export default function ChooseCampaign() {
  const [state, setState] = useCustomerViewState()
  useEnforceWheelState({ 
    current: 'disabled', 
    centered: false,
    prizeIndex: undefined,
  })
  const selectedCampaign = state.campaigns.selected

  // Make sure we dispose of any old history ids
  useEffect(() => {
    setState({ historyId: null })
  }, [])

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
        {state.campaigns.list.map((campaign, index) => {
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
            pathname: `/live/${state.organization.handle}/action`,
            query: { selectedCampaign }
          }}>Next</Link>
        </Button>
      </div>
    </>
  )
}


function CampaignButton(props: {
  campaign: CampaignType
  index: number
}) {
  const { queryParams, updateQueryParams } = useNavigationState()
  const selectedCampaign = Number(queryParams.selectedCampaign)
  const isSelected = selectedCampaign === props.index
  return (
    <Link
      className={cn(
        "p-4 flex gap-4 outline outline-slate-400 rounded-md items-center",
        isSelected && "outline-2 outline-slate-800",
      )}
      href={{ query: { selectedCampaign: props.index } }}
    >
      <Image width={32} height={32}
        src={`/images/logos/${props.campaign.action.platform}.svg`}
        alt={props.campaign.action.label}
      />
      <div>
        {props.campaign.action.label}
      </div>
    </Link>
  )
}
