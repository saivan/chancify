"use client"

import { useGotoRoute, useSpinCallbacks, useCustomerViewState, useEnforceWheelState } from "../../controller"
import { Button, LoadingButton } from "@repo/components"
import Link from "next/link"
import { useState } from "react"
import { ActionGuide } from "./ActionGuide"


export default function ChooseCampaign() {
  const [state, setState] = useCustomerViewState()
  const [loading, setLoading] = useState(false)
  const { pushHistory } = useSpinCallbacks()
  const { goto, resolve } = useGotoRoute()
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
      <ActionGuide
        campaign={campaign} 
        organization={state.organization.data} 
        links={state.links}
      />
      <div className="flex gap-2">
        <Button asChild variant='outline'>
          <Link href={resolve(`/live/${state.organization.handle}/campaigns`, { 
            links: state.links,
            selectedCampaign, 
          })}>Back</Link>
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
          const skipDetails = !campaign.collectInformation.email
            && !campaign.collectInformation.name
            && !campaign.collectInformation.phone
            && !campaign.collectInformation.postalAddress
          const nextPage = skipDetails ? 'spin' : 'details'
          goto(`/live/${state.organization.handle}/${nextPage}`, {
            selectedCampaign,
            links: state.links,
          })
          setLoading(false)
        }}
        >Done</LoadingButton>
      </div>
    </>
  )
}




