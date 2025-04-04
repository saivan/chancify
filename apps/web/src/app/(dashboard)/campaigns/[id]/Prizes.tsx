"use client"

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
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Icon, Input, Label, Switch } from "@repo/components"
import { cn, shortId } from '@repo/utilities'
import { useMemo, useState, useEffect } from 'react'
import { useCampaign } from './provider'


export function PotentialPrizes() {
  const [campaign, setCampaign] = useCampaign()
  const [isClient, setIsClient] = useState(false)
  useEffect(() => { setIsClient(true) }, [])

  // Calculate the total chance of winning a prize
  const total = useMemo(() => campaign.prizes?.reduce(
    (acc, prize) => acc + prize.chance, 0
  ), [campaign.prizes])
  if (total == null) return null

  // Create the sensors for the DND context
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Create all dragging function handlers
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = campaign.prizes?.findIndex(prize => prize.id === active.id)
      const newIndex = campaign.prizes?.findIndex(prize => prize.id === over.id)
      if (oldIndex == null || newIndex == null) return
      setCampaign({
        prizes: arrayMove(campaign.prizes || [], oldIndex, newIndex)
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
            {isClient ? (
              <DraggablePrizesList
                prizes={campaign.prizes || []}
                total={total}
                sensors={sensors}
                onDragEnd={handleDragEnd}
                onDelete={handleDeletePrize}
                onUpdate={handleUpdatePrize}
              />
            ) : (
              <StaticPrizesList
                prizes={campaign.prizes || []}
                total={total}
                onDelete={handleDeletePrize}
                onUpdate={handleUpdatePrize}
              />
            )}
            <Button className="gap-2 mt-2" onClick={handleAddPrize}>
              <Icon icon="plus" /> Add Prize
            </Button>
      </CardContent>

      <CardFooter>
        <PrizeOptions />
      </CardFooter>
    </Card>
  )
}

function PrizeOptions() {
  const [campaign, setCampaign] = useCampaign()
  return (
    <div className="w-full flex flex-row items-center justify-between rounded-lg border p-3 shadow-xs">
      <div className="space-y-0.5">
        <Label>Equally Sized Slices</Label>
        <p className="text-sm text-slate-500">
          The size of each slice will be the same, regardless of the chance of winning
        </p>
      </div>
      <div>
        <Switch
          checked={campaign.equallySized === true}
          onCheckedChange={checked => setCampaign({ equallySized: checked })}
        />
      </div>
    </div>
  )
}

function DraggablePrizesList(props: {
  prizes: any[]
  total: number
  sensors: ReturnType<typeof useSensors>
  onDragEnd: (event: DragEndEvent) => void
  onDelete: (index: number) => void
  onUpdate: (index: number, updates: { name?: string; chance?: number }) => void
}) {
  return (
    <DndContext
      sensors={props.sensors}
      collisionDetection={closestCenter}
      onDragEnd={props.onDragEnd}
    >
      <SortableContext
        items={props.prizes.map(prize => prize.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {props.prizes.map((prize, index) => (
            <PrizeItem
              key={prize.id}
              id={prize.id}
              total={props.total}
              index={index}
              name={prize.name}
              chance={prize.chance}
              onDelete={() => props.onDelete(index)}
              onUpdate={(updates) => props.onUpdate(index, updates)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

function StaticPrizesList(props: {
  prizes: any[]
  total: number
  onDelete: (index: number) => void
  onUpdate: (index: number, updates: { name?: string; chance?: number }) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      {props.prizes.map((prize, index) => (
        <div
          key={prize.id}
          className="grid grid-cols-[auto_1fr] items-center gap-4 rounded-lg border border-border overflow-hidden"
        >
          <div className="grid place-items-center w-8 h-full bg-slate-100 border-r border-border">
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
                    value={prize.name}
                    onChange={(e) => props.onUpdate(index, { name: e.target.value })}
                  />
                </div>
                <Button onClick={() => props.onDelete(index)} variant="outline" size="icon">
                  <Icon icon="trash" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 px-4">
              <span className="text-gray-600 text-sm">Chance</span>
              <Input
                type="number"
                value={prize.chance}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    props.onUpdate(index, { chance: value });
                  }
                }}
                min="0"
                max="100"
                step="1"
              />
              <span className="text-gray-600 text-sm min-w-max">in {String(props.total)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function PrizeItem(props: {
  id: string
  total: number
  index: number
  name: string
  chance: number
  onDelete: () => void
  onUpdate: (updates: { name?: string; chance?: number }) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id })

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onUpdate({ name: e.target.value })
  }

  const handleChanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      props.onUpdate({ chance: value })
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
          )}> {props.index + 1} </div>
          <div className='flex gap-2'>
            <div className="flex-1">
              <Input
                type="text"
                placeholder='Prize Name'
                className='placeholder:text-slate-400 placeholder:italic'
                value={props.name}
                onChange={handleNameChange}
              />
            </div>
            <Button onClick={props.onDelete} variant="outline" size="icon" >
              <Icon icon="trash" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 px-4">
          <span className="text-gray-600 text-sm">Chance</span>
          <Input
            type="number"
            value={props.chance}
            onChange={handleChanceChange}
            min="0"
            max="100"
            step="1"
          />
          <span className="text-gray-600 text-sm min-w-max">in {String(props.total)}</span>
        </div>
      </div>
    </div>
  )
}
