"use server"

import { type CampaignType } from "@/models/Campaign"
import { History, type HistoryType } from "@/models/History"
import { Organization } from "@/models/Organization"


export async function resolveOrganization(handle: string) {
  const organization = new Organization({ handle })
  await organization.pull()
  const allCampaigns = await organization.campaigns()
  const campaigns = allCampaigns.filter(campaign => campaign.status === 'active')
  return {
    organizationId: organization.id() as string,
    campaigns: campaigns as CampaignType[], 
    data: organization.data,
  }
}


export async function spin(props: {
  campaign: CampaignType
  historyId: string
}) {
  // Select a random prize
  const { index, prize } = await selectRandomPrize(props.campaign.prizes)

  // Save the history
  const history = await saveHistory({
    id: props.historyId,
    status: 'unclaimed',
    prize,
  })
  return { history, index }
}

async function getHistory (data: Partial<HistoryType>) {
  // Make sure the history entry exists
  if (data.id == null) {
    // Make sure the required fields are present
    if (data.campaignId == null) throw new Error('Campaign ID is required')
    if (data.organizationId == null) throw new Error('Organization ID is required')

    // Create a new history entry
    const cleanedData = Object.assign({}, data, {
      status: 'incomplete',
    })
    const newHistory = new History(cleanedData)
    await newHistory.create()
    return newHistory
  }

  // Pull the existing history entry
  const history = new History({ id: data.id })
  await history.pull()
  return history
}

export async function saveHistory(data: Partial<HistoryType>) {
  // Get the history entry
  const history = await getHistory(data)

  // Make sure we are not updating a claimed prize 
  const isComplete = history.data.status !== 'incomplete'
  if (isComplete) throw new Error('Cannot update a complete history entry')

  // Make sure we are not updating a prize that was created too long ago
  if (history.data.dateCreated == null) throw new Error('Date created is missing')
  const createTime = new Date(history.data.dateCreated).getTime()
  const now = Date.now()
  const halfHour = 30 * 60 * 1000
  const isUpdatingOldPrize = now - createTime > halfHour
  if (isUpdatingOldPrize) throw new Error('Cannot update an old prize')

  // Make sure we are not changing the organization 
  const isChangingOrganization = data.organizationId != null 
    && data.organizationId !== history.data.organizationId
  if (isChangingOrganization) throw new Error('Cannot change organization')
  
  // Make sure we are not changing the campaign
  const isChangingCampaign = data.campaignId != null 
    && data.campaignId !== history.data.campaignId
  if (isChangingCampaign) throw new Error('Cannot change campaign')

  // Update the history entry
  history.set({ ...data, id: history.data.id || data.id })
  await history.push()
  return history.data
}

async function selectRandomPrize(prizes: CampaignType['prizes']) {
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

