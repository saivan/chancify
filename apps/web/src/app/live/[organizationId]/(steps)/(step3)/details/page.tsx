
"use client"

import { Campaign } from "@/models/Campaign"
import { cn, useNavigationState, usePath } from "@repo/utilities/client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useCustomerViewState, useEnforceWheelState } from "@/app/live/[organizationId]/controller"
import { Form, Button, Checkbox, FormControl, FormDescription, FormField, FormItem, FormLabel, Input, Label } from "@repo/components"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"



export default function () {
  const [state, setState] = useCustomerViewState()
  useEnforceWheelState({
    current: 'disabled',
    centered: false,
    prizeIndex: undefined,
  })
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
    </>
  )
}



const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  address: z.string().min(5),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions"
  }),
})

type FormData = z.infer<typeof schema>

export function FormArea() {
  const router = useRouter()
  const [state, setState] = useCustomerViewState()
  const selectedCampaign = state.campaigns.selected
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      acceptedTerms: false,
      name: '',
      phone: '',
      email: '',
      address: ''
    }
  })

  const { register, handleSubmit, formState: { errors }, control } = form

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(inputs => {
        console.log(inputs)
        router.push(`/live/${state.organization.id}/spin?selectedCampaign=${selectedCampaign}`)
      })} className="space-y-4 max-w-md">
        <div className="pb-8">
          {[
            { id: "name" as const, label: "Name", type: "text" },
            { id: "phone" as const, label: "Phone", type: "tel" },
            { id: "email" as const, label: "Email", type: "email" },
            { id: "address" as const, label: "Postal Address", type: "text" },
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
        </div>

        <FormField
          control={control}
          name="acceptedTerms"
          render={({ field }) => (
            <FormItem className="bg-slate-50 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl className="my-[0.3rem]">
                <Checkbox 
                  id="terms-checkbox"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div>
                <Label htmlFor="terms-checkbox" className="text-sm font-bold text-slate-900">
                  Accept Terms and Conditions
                </Label>
                <div className="text-xs text-slate-600">
                  You agree to the Terms of Service and Privacy Policy
                </div>
                {errors.acceptedTerms && (
                  <span className="text-sm text-red-500">
                    {errors.acceptedTerms.message as string}
                  </span>
                )}
              </div>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button asChild variant='outline'>
            <Link href={{
              pathname: `/live/${state.organization.id}/action`,
              query: { selectedCampaign }
            }}>Back</Link>
          </Button>
          <Button type="submit">Spin Now</Button>
        </div>
      </form>
    </Form>
  )
}
