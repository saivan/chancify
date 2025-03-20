'use client'
import type { CampaignType } from "@/models/Campaign";
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
    if (!campaign?.id) return
    const campaignData = deepMerge(campaign, updates) as CampaignType

    // Deal with the error state
    const { success, campaign: errorData } = await updateCampaign(campaignData)
    if (!success) setCampaignDirect(errorData)
  }, 800, {
    leading: true,
    trailing: true,
  })

  function setCampaign(newCampaign: Partial<CampaignType>) {
    setCampaignDirect(newCampaign)
    sendToDatabase(newCampaign)
  }
  return [campaign, setCampaign] as const
}



