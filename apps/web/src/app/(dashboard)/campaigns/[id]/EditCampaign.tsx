"use client"

import { CenterBox } from "@/components/dashboard/CenterBox"
import { CampaignInformation } from "./CampaignInformation"
import { CampaignStatus } from "./CampaignStatus"
import { CollectInformation } from "./CollectInformation"
import { PotentialPrizes } from "./Prizes"
import { WheelPreview } from "./WheelPreview"
import { useCampaign } from "./provider"
import {} from 'react'

export function EditCampaign() {
  const [campaign] = useCampaign()
  return (
    <CenterBox
      back="/campaigns"
      icon={
        campaign.action?.platform == 'personal' 
          ? 'unknown' 
          : campaign.action?.platform
      }
      title={campaign.action?.name || 'New Campaign'}
      caption="Define the parameters of this Campaign"
    >
      <div className="flex flex-col gap-8 py-4">
        <CampaignInformation />
        <PotentialPrizes />
        <WheelPreview />
        <CollectInformation />
        <CampaignStatus />
      </div>
    </CenterBox>
  )
}
