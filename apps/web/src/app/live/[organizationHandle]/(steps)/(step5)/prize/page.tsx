
"use client"

import { useCustomerViewState, useEnforceDefinedHistory, useEnforceWheelState } from "@/app/live/[organizationHandle]/controller"
import { Button, Label, QRCode } from "@repo/components"
import Link from "next/link"


export default function () {
  const [state] = useCustomerViewState()
  useEnforceDefinedHistory()
  useEnforceWheelState({
    current: 'finished',
    centered: false,
  })

  const selected = state.campaigns.selected
  const campaign = state.campaigns.list[selected]
  const prizes = campaign.prizes
  const prizeIndex = state.wheel.prizeIndex
  const prize = prizeIndex != null ? prizes[prizeIndex] : null
  const historyUrl = `${window.location.origin}/history/${state.historyId}`

  return (
    <>
      <div>
        <h1 className='font-semibold text-2xl md:text-4xl tracking-tight text-slate-800 leading-tight'
        >You've Won!</h1>
        <p className='text-base md:text-lg text-slate-800 '>
          Claim your prize by presenting this QR code
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <Label>Prize</Label>
        <div className="border border-border p-4 rounded-md bg-slate-200 font-semibold">
          {prize?.name}
        </div>
      </div>

      <div className="border p-4 border-border rounded-md w-max h-max max-w-full">
        <QRCode url={historyUrl} />
      </div>

      <div className="flex gap-2">
        <Button asChild variant='outline'>
          <Link href={{
            pathname: `/live/${state.organization.handle}/campaigns`,
            query: { selectedCampaign: 0 }
          }}>Complete</Link>
        </Button>
      </div>
    </>
  )
}
