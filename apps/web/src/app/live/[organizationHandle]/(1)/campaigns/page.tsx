"use client"

import type { CampaignType } from "@/models/Campaign"
import { Button } from "@repo/components"
import { cn, useNavigationState } from "@repo/utilities/client"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import { useCustomerViewState, useEnforceWheelState, useGotoRoute } from "../../controller"


export default function ChooseCampaign() {
  const [state, setState] = useCustomerViewState()
  useEnforceWheelState({
    current: 'disabled',
    centered: false,
    prizeIndex: undefined,
    animating: true,
    rotating: true,
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
        >Want a Chance to Win?</h1>
        <p className='text-base md:text-lg font-semibold italic text-slate-500 '>
          Take one of these actions for a free spin
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
            query: { selectedCampaign, links: state.links }
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
  const { queryParams } = useNavigationState()
  const selectedCampaign = Number(queryParams.selectedCampaign)
  const isSelected = selectedCampaign === props.index
  const { resolve } = useGotoRoute()
  const [state] = useCustomerViewState()
  return (
    <Link
      className={cn(
        "p-4 flex gap-4 outline outline-slate-400 rounded-md items-center",
        isSelected && "outline-2 outline-slate-800",
      )}
      href={resolve(
        `/live/${state.organization.handle}/campaigns`,
        { selectedCampaign: props.index, links: state.links }
      )}
    >
      <Image width={32} height={32}
        src={`/images/logos/${props.campaign.action.platform}.svg`}
        alt={props.campaign.action.name}
      />
      <div>
        {props.campaign.action.name}
      </div>
    </Link>
  )
}
