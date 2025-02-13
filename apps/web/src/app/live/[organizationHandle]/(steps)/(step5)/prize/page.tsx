
"use client"

import { useCustomerViewState, useEnforceDefinedHistory, useEnforceWheelState } from "@/app/live/[organizationHandle]/controller"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input, Label, QRCode } from "@repo/components"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"


export default function () {
  const [state, setState] = useCustomerViewState()
  useEnforceDefinedHistory()
  useEnforceWheelState({
    current: 'finished',
    centered: false,
  })

  const selected = state.campaigns.selected
  const campaign = state.campaigns.list[selected]
  const prizes = campaign.prizes
  const prizeIndex = state.wheel.prizeIndex
  const prize = prizeIndex != null ? prizes[prizeIndex] : null
  const historyUrl = `${window.location.origin}/history/${state.historyId}`
  console.log(`historyUrl`, historyUrl)


  return (
    <>
      <div>
        <h1 className='font-semibold text-2xl md:text-4xl tracking-tight text-slate-800 leading-tight'
        >You've Won!</h1>
        <p className='text-base md:text-lg text-slate-800 '>
          Claim your prize by presenting this QR code
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <Label>Prize</Label>
        <div className="border border-border p-4 rounded-md bg-slate-200 font-semibold">
          {prize?.name}
        </div>
      </div>

      <div className="border p-4 border-border rounded-md w-max h-max">
        <QRCode url={historyUrl} />
      </div>

      <div className="flex gap-2">
        <Button asChild variant='outline'>
          <Link href={{
            pathname: `/live/${state.organization.handle}/campaigns`,
            query: { selectedCampaign: 0 }
          }}>Complete</Link>
        </Button>
      </div>
    </>
  )
}




const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  address: z.string().min(5),
})

export function FormArea() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  return (
    <form onSubmit={handleSubmit(console.log)} className="space-y-4 max-w-md">
      {[
        { id: "name", label: "Name", type: "text" },
        { id: "phone", label: "Phone", type: "tel" },
        { id: "email", label: "Email", type: "email" },
        { id: "address", label: "Postal Address", type: "text" },
      ].map(({ id, label, type }) => (
        <div key={id} className="space-y-2">
          <label htmlFor={id} className="text-sm font-medium">
            {label}
          </label>
          <Input
            id={id}
            type={type}
            className="bg-white"
            {...register(id)}
            aria-invalid={!!errors[id]}
          />
          {errors[id] && (
            <span className="text-sm text-red-500">
              Invalid {label.toLowerCase()}
            </span>
          )}
        </div>
      ))}
      <Button type="submit" className="w-full">Submit</Button>
    </form>
  )
}


