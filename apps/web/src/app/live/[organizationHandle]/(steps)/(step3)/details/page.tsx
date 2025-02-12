"use client"

import { Campaign } from "@/models/Campaign"
import { cn, useNavigationState, usePath } from "@repo/utilities/client"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useCustomerViewState, useEnforceDefinedHistory, useEnforceWheelState } from "@/app/live/[organizationHandle]/controller"
import { Form, Button, Checkbox, FormControl, FormDescription, FormField, FormItem, FormLabel, Input, Label } from "@repo/components"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useSpinCallbacks } from "../../actions"
import { FormArea } from "./FormArea"

export default function Content () {
  const [state, setState] = useCustomerViewState()
  useEnforceDefinedHistory()
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
