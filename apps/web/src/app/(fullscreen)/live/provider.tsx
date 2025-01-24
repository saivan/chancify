"use client"

import { Campaign } from "@/models/Campaign"
import { createInitialisedObjectContext, createObjectContext } from "@repo/utilities/client"
import { ReactNode } from "react"


export const [ 
  useCampaigns, 
  CampaignsProvider,
] = createInitialisedObjectContext<Campaign[]>()


export type Layout = {
  wheelCentred: boolean
}

export const [
  useLayout,
  LayoutProvider,
] = createInitialisedObjectContext<Layout>()
