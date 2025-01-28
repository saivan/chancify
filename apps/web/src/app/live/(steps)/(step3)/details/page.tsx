
"use client"

import { Campaign } from "@/models/Campaign"
import { cn, useNavigationState, usePath } from "@repo/utilities/client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useCustomerViewState, useWheelCenteredEffect } from "../../../provider"
import { Button, Input } from "@repo/components"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"



export default function () {
  const [state, setState] = useCustomerViewState()
  useWheelCenteredEffect(false)
  const selectedCampaign = state.campaigns.selected
  const campaign = state.campaigns.list[selectedCampaign] 

  return (
    <>
      <div>
        <h1 className='font-semibold text-2xl md:text-4xl tracking-tight text-slate-800 leading-tight'
        >{campaign.action.label}</h1>
        <p className='text-base md:text-lg text-slate-800 '>
          Fill in your details to claim your spin
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <FormArea />
      </div>
      <div className="flex gap-2">
        <Button asChild variant='outline'>
          <Link href={{
            pathname: '/live/action',
            query: { selectedCampaign }
          }}>Back</Link>
        </Button>
        <Button asChild>
          <Link href={{
            pathname: '/live/spin',
            query: { selectedCampaign }
          }}>Spin Now</Link>
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


