"use client"

import type { CampaignType } from "@/models/Campaign"
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
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
import { CampaignButton } from "./CampaignButton"

type Brand = 'google' | 'instagram' | 'tiktok' | 'facebook'

export default function DndComponents({
  campaigns,
  onDragEnd
}: {
  campaigns: CampaignType[],
  onDragEnd: (active: any, over: any) => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over) {
      onDragEnd(active, over)
    }
  }

  return (
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
              name={campaign.action.name}
              icon={campaign.action.platform as Brand}
              status={campaign.status}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}