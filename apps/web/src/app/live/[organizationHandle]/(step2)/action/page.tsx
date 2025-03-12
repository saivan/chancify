"use client"

import { useGotoRoute, useSpinCallbacks, useCustomerViewState, useEnforceWheelState } from "../../controller"
import type { CampaignType } from "@/models/Campaign"
import type { OrganizationType } from "@/models/Organization"
import { Button, LoadingButton, QRCode } from "@repo/components"
import Link from "next/link"
import { useState } from "react"



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
  const url = generateUrl({
    organization: state.organization.data,
    campaign,
  })

  return (
    <>
      <div>
        <h1 className='font-semibold text-2xl md:text-4xl tracking-tight text-slate-800 leading-tight'
        >{campaign.action.label}</h1>
        <p className='text-base md:text-lg text-slate-800 '>
          {campaign.action.instruction}
        </p>
      </div>
      <div className="flex flex-col gap-4 border rounded-md border-border w-max max-w-full p-4">
        {
          state.links === 'qr'
            ? <QRCode url={url} />
            : <a target="_blank" href={url}> Perform Action </a>
        }
      </div>
      <div className="flex gap-2">
        <Button asChild variant='outline'>
          <Link href={resolve(
            `/live/${state.organization.handle}/campaigns`,
            { selectedCampaign, links: state.links }
          )}>Back</Link>
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
        >Next</LoadingButton>
      </div>
    </>
  )
}

function generateUrl({ organization, campaign }: {
  organization: Partial<OrganizationType>
  campaign: Partial<CampaignType>
}): string {
  if (campaign.action?.platform === 'google') {
    return organization.googleLink || ''
  }

  if (campaign.action?.platform === 'tiktok') {
    return `https://www.tiktok.com/@${organization.tikTokHandle}`
  }

  if (campaign.action?.platform === 'instagram') {
    return `https://www.instagram.com/${organization.instagramHandle}`
  }

  if (campaign.action?.platform === 'facebook') {
    return `https://fb.com/${organization.facebookUsername}`
  }

  return ''
}




