"use client"

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
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Icon, Input } from "@repo/components"
import { cn, shortId } from '@repo/utilities'
import { useMemo } from 'react'
import { useCampaign } from './provider'


export function PotentialPrizes() {
  const [campaign, setCampaign] = useCampaign()
  const total = useMemo(() => campaign.prizes?.reduce(
    (acc, prize) => acc + prize.chance, 0
  ), [campaign.prizes])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = campaign.prizes?.findIndex(prize => prize.id === active.id)
      const newIndex = campaign.prizes?.findIndex(prize => prize.id === over.id)
      setCampaign({
        prizes: arrayMove(campaign.prizes, oldIndex, newIndex)
      })
    }
  }

  const handleDeletePrize = (index: number) => {
    setCampaign({
      prizes: campaign.prizes?.filter((_, i) => i !== index)
    })
  }

  const handleUpdatePrize = (index: number, updates: { name?: string; chance?: number }) => {
    setCampaign({
      prizes: campaign.prizes?.map((prize, i) =>
        i === index ? { ...prize, ...updates } : prize
      )
    })
  }

  const handleAddPrize = () => {
    setCampaign({
      prizes: [...campaign.prizes || [], { id: shortId(), name: "", chance: 1 }]
    })
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className='text-xl'>Potential Prizes</CardTitle>
        <CardDescription>
          What can users win by taking this action?
        </CardDescription>
      </CardHeader>

      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={campaign.prizes.map(prize => prize.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {campaign.prizes.map((prize, index) => (
                <PrizeItem
                  key={prize.id}
                  id={prize.id}
                  total={total}
                  index={index}
                  name={prize.name}
                  chance={prize.chance}
                  onDelete={() => handleDeletePrize(index)}
                  onUpdate={(updates) => handleUpdatePrize(index, updates)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>

      <CardFooter>
        <Button className="gap-2" onClick={handleAddPrize}>
          <Icon icon="plus" /> Add Prize
        </Button>
      </CardFooter>
    </Card>
  )
}

interface PrizeItemProps {
  index: number
  id: string
  name: string
  total: number
  chance: number
  onDelete: () => void
  onUpdate: (updates: { name?: string; chance?: number }) => void
}

function PrizeItem({ id, total, index, name, chance, onDelete, onUpdate }: PrizeItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ name: e.target.value })
  }

  const handlechanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      onUpdate({ chance: value })
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-[auto_1fr] items-center gap-4 rounded-lg border border-border overflow-hidden"
    >
      <div
        className="grid place-items-center w-8 h-full cursor-grab bg-slate-100 border-r border-border"
        {...attributes}
        {...listeners}
      >
        <Icon icon="grip-vertical" />
      </div>

      <div className='flex w-full flex-wrap'>
        <div className='p-2 flex items-center gap-2 flex-1'>
          <div className={cn(
            'border border-slate-800 w-9 h-9 rounded flex items-center justify-center',
            'font-bold text-2xl',
          )}> {index + 1} </div>
          <div className='flex gap-2'>
            <div className="flex-1">
              <Input
                type="text"
                placeholder='Prize Name'
                value={name}
                onChange={handleNameChange}
              />
            </div>
            <Button onClick={onDelete} variant="outline" size="icon" >
              <Icon icon="trash" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 px-4">
          <span className="text-gray-600 text-sm">Chance</span>
          <Input
            type="number"
            value={chance}
            onChange={handlechanceChange}
            min="0"
            max="100"
            step="1"
          />
          <span className="text-gray-600 text-sm min-w-max">in {String(total)}</span>
        </div>
      </div>
    </div>
  )
}
