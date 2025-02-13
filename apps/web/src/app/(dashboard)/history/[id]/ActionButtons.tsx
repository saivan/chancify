"use client"

import type { HistoryType } from '@/models/History'
import { Button, LoadingButton } from '@repo/components'
import { useState } from 'react'
import { toast } from 'sonner'
import { useDashboard } from '../../controller'


export function ClaimButton({ history }: { history: Partial<HistoryType> }) {
  const [loading, setLoading] = useState(false) 
  const { updateHistory } = useDashboard()
  return (
    <LoadingButton 
      loading={loading}
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


export default function VerifyButton({ history }: {
  history: Partial<HistoryType>,
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
