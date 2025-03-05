"use client"

import { useCustomerViewState, useEnforceDefinedHistory, useEnforceWheelState } from "@/app/live/[organizationHandle]/controller"
import { FormArea } from "./FormArea"

export default function Content () {
  const [state] = useCustomerViewState()
  useEnforceDefinedHistory()
  useEnforceWheelState({
    current: 'disabled',
    centered: false,
    prizeIndex: undefined,
    animating: false,
    rotating: false,
  })
  const selectedCampaign = state.campaigns.selected
  const campaign = state.campaigns.list[selectedCampaign]

  return (
    <>
      <div>
        <h1 className='font-semibold text-2xl md:text-4xl tracking-tight text-slate-800 leading-tight'
        >{campaign.action.label}</h1>
        <p className='text-base md:text-lg text-slate-800 '>
          Fill in your details to claim your spin
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <FormArea />
      </div>
    </>
  )
}
