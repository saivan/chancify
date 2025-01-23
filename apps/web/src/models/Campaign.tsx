import { createObjectContext } from "@repo/utilities/client"
import type { Action } from './Action'
import type { Theme } from './Theme'

export type Brand = 'google' | 'instagram' | 'tiktok' | 'facebook' | 'personal'

export type Prize = {
  id: string
  name: string
  probability: number
}

export type CollectInformation = {
  name: boolean
  phone: boolean
  email: boolean
  postalAddress: boolean
}

export type Campaign = {
  id: string
  status: string
  action: Action
  platform: string
  prizes: Prize[]
  theme: Theme
  collectInformation: CollectInformation
}

export const [useCampaign, CampaignProvider] = createObjectContext<Campaign>()

