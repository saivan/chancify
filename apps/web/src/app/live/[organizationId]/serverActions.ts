import type { CampaignType } from "@/models/Campaign"
import { Organization } from "@/models/Organization"

export async function getOrganizationCampaigns(handle: string) {
  const organization = new Organization({ handle })
  await organization.pull()
  const campaigns = await organization.campaigns()
  const campaignData = campaigns.map(campaign => campaign.data)
  return campaignData as CampaignType[]
}
