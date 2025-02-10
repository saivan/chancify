"use server"

import type { CampaignType } from "@/models/Campaign"
import { History, HistoryType } from "@/models/History"
import { Organization } from "@/models/Organization"


export async function getOrganizationCampaigns(handle: string) {
  const organization = new Organization({ handle })
  await organization.pull()
  const campaigns = await organization.campaigns()
  const campaignData = campaigns.map(campaign => campaign.data)
  return campaignData as CampaignType[]
}


export async function spin(props: {
  campaign: CampaignType
  customer: HistoryType['customer']
}) {
  // Select a random prize
  const { index, prize } = await selectRandomPrize(props.campaign.prizes)

  // Save the history
  const organizationId = props.campaign.organizationId
  const history = await saveHistory({
    organizationId,
    campaign: props.campaign,
    customer: props.customer,
    prizeIndex: index,
  })
  return { history, index }
}


export async function saveHistory(props: {
  organizationId: string
  prizeIndex: number
  campaign: CampaignType
  customer: HistoryType['customer']
}) {
  // Create a new history entry
  const prize = props.campaign.prizes[props.prizeIndex]
  const history = new History({
    organizationId: props.organizationId,
    campaignId: props.campaign.id,
    prize,
    customer: props.customer,
  })
  await history.create()

  // Make a history data entry
  const historyData = history.data
  return historyData
}


export async function selectRandomPrize(prizes: CampaignType['prizes']) {
  // Calculate total chance of all prizes
  if (prizes == null) throw new Error('Prizes are required')
  const totalChance = prizes.reduce((sum, prize) => sum + prize.chance, 0)

  // Find the first prize where the cumulative is greater than a random number
  const random = Math.random() * totalChance
  let cumulativeChance = 0
  for (let i = 0; i < prizes.length; i++) {
    cumulativeChance += prizes[i].chance
    if (random < cumulativeChance) {
      return {
        index: i,
        prize: prizes[i]
      }
    }
  }

  // Edge case: shouldn't happen except for floating point rounding
  return {
    index: prizes.length - 1,
    prize: prizes[prizes.length - 1]
  }
}

