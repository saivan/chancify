'use client'
import { CampaignType } from "@/models/Campaign";
import { createInitialisedObjectContext, deepMerge } from "@repo/utilities/client";
import { } from 'react'
import { useDebouncedCallback } from "use-debounce";
import { useDashboard } from "../../controller";

const [useCampaignDirect, CampaignProvider] = createInitialisedObjectContext<CampaignType>()
export { CampaignProvider }


export function useCampaign() {
  const [ campaign, setCampaignDirect ] = useCampaignDirect()
  const { updateCampaign } = useDashboard()
  const sendToDatabase = useDebouncedCallback(async (updates: CampaignType) => {
    const campaignData = deepMerge({}, campaign, updates) as CampaignType
    updateCampaign(campaignData)
  }, 800)

  function setCampaign(newCampaign: CampaignType) {
    setCampaignDirect(newCampaign)
    sendToDatabase(newCampaign)
  }
  return [campaign, setCampaign] as const
}



