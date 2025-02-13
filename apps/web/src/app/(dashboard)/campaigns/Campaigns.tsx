"use client"

import type { CampaignType } from "@/models/Campaign"
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useState } from "react"
import { CampaignButton } from "./CampaignButton"
import { cn } from "@repo/utilities"
import { useDashboard } from "../controller"
import { Button, Icon, LoadingButton } from "@repo/components"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useDebouncedCallback } from "use-debounce"


type Brand = 'google' | 'instagram' | 'tiktok' | 'facebook'
export function Campaigns(props: {
  campaigns: CampaignType[]
}) {
  const [campaigns, setCampaigns] = useState<CampaignType[]>(props.campaigns)
  const { updateCampaign } = useDashboard()
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const updateOrder = useDebouncedCallback(async (campaigns: CampaignType[]) => {
    // Update each campaign
    const orderedCampaigns = campaigns.map((campaign, index) => ({
      ...campaign, priority: index
    }))
    for (let campaign of orderedCampaigns) {
      updateCampaign(campaign)
    }
  }, 800)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setCampaigns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const resultingArray = arrayMove(items, oldIndex, newIndex)
        updateOrder(resultingArray)
        return resultingArray
      })
    }
  }

  const CampaignArea = campaigns.length === 0 ? (
    <div className={cn(
      "text-center text-slate-700 p-8 border-dashed border-4",
      "border-slate-300 rounded-md bg-slate-50"
    )}> No Campaigns Defined </div>
  ) : (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={campaigns} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {campaigns.map((campaign) => (
            <CampaignButton
              key={campaign.id}
              id={campaign.id}
              name={campaign.action.label}
              icon={campaign.action.icon as Brand}
              status={campaign.status}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
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