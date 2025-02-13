"use client"

import type { HistoryType } from '@/models/History'
import { Button, LoadingButton } from '@repo/components'
import { useState } from 'react'
import { useDashboard } from '../../controller'
import { CampaignType } from '@/models/Campaign'
import { OrganizationType } from '@/models/Organization'


export function ClaimButton({ history }: { history: Partial<HistoryType> }) {
  const [loading, setLoading] = useState(false) 
  const { updateHistory } = useDashboard()
  return (
    <LoadingButton 
      onClick={async () => {
        setLoading(true)
        await updateHistory({ ...history, status: 'claimed' })
        setLoading(false)
        window.location.reload()
      }}
      disabled={history.status === 'claimed'}
    > Claim </LoadingButton>
  )
}


export default function VerifyButton({ history, campaign, organization }: {
  history: Partial<HistoryType>,
  campaign: Partial<CampaignType>
  organization: Partial<OrganizationType>
}) {
  // Determine the link to verify the action
  if (campaign.action?.platform == null) return null
  const handleResolvers = {
    instagram: () => `https://instagram.com/${organization.instagramHandle}`,
    tiktok: () => `https://tiktok.com/@${organization.tikTokHandle}`,
    google: () => organization.googleLink,
  }
  const platform = campaign.action.platform as keyof typeof handleResolvers
  const link = platform in handleResolvers ? handleResolvers[platform]() : ''
  
  // If there is no link, we don't need to show a button
  if (link === '') return null

  // Render the button
  return (
    <Button asChild variant="outline">
      <a href={link} target='_blank'>
        Verify Action
      </a>
    </Button>
  )
}
