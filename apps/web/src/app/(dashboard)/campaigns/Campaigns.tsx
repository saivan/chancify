"use client"

import { Campaign } from "@/models/Campaign"
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


type Brand = 'google' | 'instagram' | 'tiktok' | 'facebook'
export function Campaigns(props: {
  campaigns: Campaign[]
}) {
  const [items, setItems] = useState<Campaign[]>(props.campaigns)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <CampaignButton
              key={item.id}
              id={item.id}
              name={item.name}
              icon={item.icon as Brand}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
