"use client"

import { useCustomerViewState } from "@/app/live/[organizationHandle]/controller"
import type { CampaignType } from "@/models/Campaign"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Checkbox, Form, FormControl, FormField, FormItem, Input, Label, LoadingButton } from "@repo/components"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useSpinCallbacks } from "../../actions"

const makeSchema = (campaign: CampaignType) => {
  return z.object({
    name: campaign.collectInformation.name 
      ? z.string().min(2, "Name must be at least 2 characters")
      : z.string().optional(),
    phone: campaign.collectInformation.phone 
      ? z.string().min(8, "Phone number must be at least 8 digits")
      : z.string().optional(),
    email: campaign.collectInformation.email 
      ? z.string().email("Please enter a valid email address")
      : z.string().optional(),
    postalAddress: campaign.collectInformation.postalAddress 
      ? z.string().min(5, "Address must be at least 5 characters")
      : z.string().optional(),
    acceptedTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions"
    }),
  })
}

type FormData = z.infer<ReturnType<typeof makeSchema>>

export function FormArea() {
  const { pushHistory, pushHistoryDebounced } = useSpinCallbacks()
  const [state] = useCustomerViewState()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const selectedCampaign = state.campaigns.selected
  const campaign = state.campaigns.list[selectedCampaign]

  const form = useForm<FormData>({
    resolver: zodResolver(makeSchema(campaign)),
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
      customer: {
        name: formValues.name || '',
        phone: formValues.phone || '',
        email: formValues.email || '',
        postalAddress: formValues.postalAddress || '',
        acceptedTerms: formValues.acceptedTerms,
        details: {}
      },
    })
  }, [formValues])

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(async inputs => {
          setLoading(true)
          await pushHistory({
            id: state.historyId as string,
            customer: {
              name: formValues.name || '',
              phone: formValues.phone || '',
              email: formValues.email || '',
              postalAddress: formValues.postalAddress || '',
              acceptedTerms: formValues.acceptedTerms,
              details: {}
            },
          })
          router.push(`/live/${state.organization.handle}/spin?selectedCampaign=${selectedCampaign}`)
          setLoading(false)
        })}
        className="space-y-4 max-w-md"
      >
        <div className="pb-8">
          {[
            { id: "name" as const, label: "Name", type: "text" },
            { id: "phone" as const, label: "Phone", type: "tel", inputMode: "tel" },
            { id: "email" as const, label: "Email", type: "email" },
            { id: "postalAddress" as const, label: "Postal Address", type: "text" },
          ].map(({ id, label, type, inputMode }) => {
            const required = campaign.collectInformation[id]
            if (!required) return null
            return (
              <div key={id} className="space-y-2">
                <label htmlFor={id} className="text-sm font-medium">
                  {label}{required && ' *'}
                </label>
                <Input
                  id={id}
                  type={type}
                  // @ts-ignore - zodResolver doesn't support inputMode
                  inputMode={inputMode}
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
            )
          })}
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
