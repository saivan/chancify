"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button, Icon } from "@repo/components"
import Image from "next/image"
import { useSortable, } from '@dnd-kit/sortable'
import Link from "next/link"

type Brand = 'google' | 'instagram' | 'tiktok' | 'facebook'


export function CampaignButton(props: {
  id: string
  name: string
  icon: Brand
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id })

  const style = {
    opacity: isDragging ? 0.5 : 1,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="grid grid-cols-[auto_1fr_auto] border-border border rounded-lg items-center overflow-hidden">
      <div
        className="p-2 border-r border-border h-full bg-slate-100 flex items-center cursor-move"
        {...attributes}
        {...listeners}
      >
        <Icon icon="grip-vertical" />
      </div>
      <Link href={`/campaigns/${props.id}`}>
        <div className="flex items-center flex-1 gap-4 p-4">
          <Image height={24} width={24}
            src={`/images/logos/${props.icon}.svg`}
            alt={props.icon}
          />
          {props.name}
        </div>
      </Link>
      <div className="p-2">
        <DeleteButton name={props.name} />
      </div>
    </div>
  )
}


function DeleteButton(props: {
  name: string
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger type="button" className="p-2 border border-border rounded"  >
        <Icon icon="trash" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deleting Campaign: {props.name}</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your campaign
            and you'll have to recreate it if you want it back.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
