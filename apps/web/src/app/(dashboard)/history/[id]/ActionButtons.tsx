"use client"

import type { HistoryType } from '@/models/History'
import { Button, LoadingButton } from '@repo/components'
import { useState } from 'react'
import { useDashboard } from '../../controller'
import { CampaignType } from '@/models/Campaign'
import { OrganizationType } from '@/models/Organization'
import { toast } from 'sonner'


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
  const { resolveHistoryLink } = useDashboard()
  return (
    <Button 
      variant="outline"
      onClick={async () => {
        if (history.id == null) return toast.error('Unable to verify action')
        const link = await resolveHistoryLink(history.id)
        if (link == null) return toast.error('Unable to verify action')
        window.open(link, "_blank")
      }}
    > Verify Action </Button>
  )
}
