
"use client"

import { Campaign } from "@/models/Campaign"
import { cn, useNavigationState, usePath } from "@repo/utilities/client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useCustomerViewState, useEnforceWheelState } from "@/app/live/[organizationHandle]/controller"
import { Button, LoadingButton, QRCode } from "@repo/components"
import { useRouter } from "next/navigation"
import { useSpinCallbacks } from "../../actions"



export default function ChooseCampaign() {
  const [state, setState] = useCustomerViewState()
  const [loading, setLoading] = useState(false)
  const { pushHistory } = useSpinCallbacks()
  useEnforceWheelState({ 
    current: 'disabled', 
    centered: false,
    prizeIndex: undefined,
  })
  const selectedCampaign = state.campaigns.selected
  const campaign = state.campaigns.list[selectedCampaign]
  const router = useRouter()

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
            pathname: `/live/${state.organization.handle}/campaigns`,
            query: { selectedCampaign }
          }}>Back</Link>
        </Button>
        <LoadingButton loading={loading} onClick={async () => {
          // Create a new history record
          setLoading(true)
          const { id } = await pushHistory({
            campaignId: campaign.id,
            organizationId: state.organization.id,
          })
          setState({ historyId: id })

          // Move to the next step
          router.push(`/live/${state.organization.handle}/details?selectedCampaign=${selectedCampaign}`)
          setLoading(false)
        }} 
        >Next</LoadingButton>
      </div>
    </>
  )
}








