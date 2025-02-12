"use client"

import { Campaign } from "@/models/Campaign"
import { cn, useNavigationState, usePath } from "@repo/utilities/client"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useCustomerViewState, useEnforceWheelState } from "@/app/live/[organizationHandle]/controller"
import { Form, Button, Checkbox, FormControl, FormDescription, FormField, FormItem, FormLabel, Input, Label, LoadingButton } from "@repo/components"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useSpinCallbacks } from "../../actions"

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  postalAddress: z.string().min(5),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions"
  }),
})

type FormData = z.infer<typeof schema>

export function FormArea() {
  const { pushHistoryDebounced } = useSpinCallbacks()
  const [state, setState] = useCustomerViewState()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const selectedCampaign = state.campaigns.selected
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      acceptedTerms: false,
      name: '',
      phone: '',
      email: '',
      postalAddress: ''
    }
  })

  const { register, handleSubmit, formState: { errors }, control, watch } = form

  // Send the form data to the server when it changes
  const formValues = watch()
  useEffect(() => {
    // Don't push an empty form
    const { name, phone, email, postalAddress } = formValues
    if (!name && !phone && !email && !postalAddress) return
    
    // Otherwise push the form data to the server
    pushHistoryDebounced({
      id: state.historyId as string,
      customer: { ...formValues, details: {} },
    })
    console.log('Form data changed:', formValues)
  }, [formValues])

  return (
    <Form {...form}>
      <form 
        onSubmit={handleSubmit(async inputs => {
          setLoading(true)
          await pushHistoryDebounced({
            id: state.historyId as string,
            customer: { ...formValues, details: {} },
          })
          router.push(`/live/${state.organization.handle}/spin?selectedCampaign=${selectedCampaign}`)
          setLoading(false)
        })} 
        className="space-y-4 max-w-md"
      >
        <div className="pb-8">
          {[
            { id: "name" as const, label: "Name", type: "text" },
            { id: "phone" as const, label: "Phone", type: "tel" },
            { id: "email" as const, label: "Email", type: "email" },
            { id: "postalAddress" as const, label: "Postal Address", type: "text" },
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
              pathname: `/live/${state.organization.handle}/action`,
              query: { selectedCampaign }
            }}>Back</Link>
          </Button>
          <LoadingButton loading={loading} type="submit">Spin Now</LoadingButton>
        </div>
      </form>
    </Form>
  )
}