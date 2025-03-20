"use client"

import type { CampaignType } from "@/models/Campaign"
import { Icon, LoadingButton } from "@repo/components"
import { cn } from "@repo/utilities"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { useDebouncedCallback } from "use-debounce"
import { useDashboard } from "../controller"
import dynamic from "next/dynamic"


const DraggableCampaigns = dynamic(
  () => import('./DraggableCampaigns').then((mod) => mod.default),
  { ssr: false }
)


export function Campaigns(props: {
  campaigns: CampaignType[]
}) {
  const [campaigns, setCampaigns] = useState<CampaignType[]>(props.campaigns)
  const { updateCampaign } = useDashboard()
  const [isClient, setIsClient] = useState(false)

  // Only render DND components after client hydration
  useEffect(() => { setIsClient(true) }, [])

  // Update the order of the campaigns
  const updateOrderDirect = useCallback(async (campaigns: CampaignType[]) => {
    // Update each campaign
    const orderedCampaigns = campaigns.map((campaign, index) => ({
      ...campaign, priority: index
    }))
    for (let campaign of orderedCampaigns) {
      updateCampaign(campaign)
    }
  }, [updateCampaign])
  const updateOrder = useDebouncedCallback(updateOrderDirect, 600, { 
    leading: true, 
    trailing: true,
  })

  // When a campaign is dragged, update the order
  function handleDragEnd(active: any, over: any) {
    if (over && active.id !== over.id) {
      setCampaigns((items) => {
        // Find the index of the active and over items
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        // Move the active item to the new index
        const newArray = [...items]
        const [movedItem] = newArray.splice(oldIndex, 1)
        newArray.splice(newIndex, 0, movedItem)

        // Update the order
        updateOrder(newArray)
        return newArray
      })
    }
  }


  const CampaignArea = campaigns.length === 0 ? (
    <div className={cn(
      "text-center text-slate-700 p-8 border-dashed border-4",
      "border-slate-300 rounded-md bg-slate-50"
    )}> No Campaigns Defined </div>
  ) : isClient ? (
    <DraggableCampaigns
      campaigns={campaigns}
      onDragEnd={handleDragEnd}
    />
  ) : (
    <div className="flex flex-col gap-2">
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="border border-border rounded-lg">
          <div className="flex items-center flex-1 gap-4 p-4">
            {campaign.action.name || 'Incomplete Campaign'}
            {campaign.status === 'inactive' &&
              <span className="text-sm border rounded px-2">Unpublished</span>
            }
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      {CampaignArea}
      <CreateCampaignButton />
    </div>
  )
}

function CreateCampaignButton() {
  const { createCampaign } = useDashboard()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  return (
    <LoadingButton
      loading={loading}
      onClick={async () => {
        setLoading(true)
        try {
          const campaign = await createCampaign()
          await router.push(`/campaigns/${campaign.id}`)
        } catch (error) {
          toast.error('Failed to create campaign')
        }
        setLoading(false)
      }}
      size="lg" className="w-max">
      <Icon icon='plus' className='mr-2' />
      Add Campaign
    </LoadingButton>
  )
}