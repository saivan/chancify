'use client'
import { CampaignType } from "@/models/Campaign";
import { createInitialisedObjectContext, deepMerge } from "@repo/utilities/client";
import { } from 'react'
import { useDebouncedCallback } from "use-debounce";
import { useDashboard } from "../../controller";

const [useCampaignDirect, CampaignProvider] = createInitialisedObjectContext<Partial<CampaignType>>()
export { CampaignProvider }


export function useCampaign() {
  const [ campaign, setCampaignDirect ] = useCampaignDirect()
  const { updateCampaign } = useDashboard()
  const sendToDatabase = useDebouncedCallback(async (updates: Partial<CampaignType>) => {
    const campaignData = deepMerge({}, campaign, updates) as Partial<CampaignType>

    // Deal with the error state
    const { success, campaign: errorData } = await updateCampaign(campaignData)
    if (!success) setCampaignDirect(errorData)
  }, 800)

  function setCampaign(newCampaign: CampaignType) {
    setCampaignDirect(newCampaign)
    sendToDatabase(newCampaign)
  }
  return [campaign, setCampaign] as const
}



