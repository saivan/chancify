"use client"

import { CenterBox } from "@/components/dashboard/CenterBox"
import { PrizeWheel } from "@/components/wheel"
import { themes } from "@/models/Theme"
import { Campaign, CampaignProvider, useCampaign } from "@/models/Campaign"
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, ComboboxCreatable, Icon, Label, MultipleSelector } from "@repo/components"
import { deepMerge, shortId } from "@repo/utilities"
import { useState } from "react"
import { PotentialPrizes } from "@/components/campaign/Prizes"
import { Action, availableActions } from "@/models/Action"
import { useMemo } from 'react'




export default function () {
  const [campaign, setCampaign] = useState<Campaign>({
    id: '1',
    action: availableActions[0],
    platform: "Google",
    prizes: [
      { id: shortId(), name: "Hello Aba", probability: 15 },
      { id: shortId(), name: "Maryanne", probability: 1 },
      { id: shortId(), name: "Free Lunch", probability: 1 },
      { id: shortId(), name: "Awesome Thing", probability: 3 },
      { id: shortId(), name: "Stinky Snake", probability: 4 },
      { id: shortId(), name: "Awesome Sauce", probability: 3 },
    ],
    theme: themes['red'],
    collectInformation: {
      name: false,
      phone: false,
      email: false,
      postalAddress: false,
    },
    active: true,
  })

  return (
    <CenterBox
      back="/campaigns"
      icon={campaign.action?.icon}
      title={campaign.action?.label ?? 'New Campaign'}
      caption="Define the parameters of this Campaign"
    >
      <CampaignProvider state={campaign} setState={setCampaign} >
        <div className="flex flex-col gap-8 py-4">
          <CampaignInformation />
          <PotentialPrizes />
          <WheelPreview />
        </div>
      </CampaignProvider>
    </CenterBox>
  )
}


function CampaignInformation() {
  const [campaign, setCampaign] = useCampaign()
  const value = useMemo(() => campaign.action.value, [campaign.action])

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-xl"> Campaign Information </CardTitle>
        <CardDescription>
          Define the type of campaign that you’d like to run
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Label htmlFor="user-action">User Action</Label>
        <ComboboxCreatable
          className="flex max-w-96 w-full"
          options={availableActions}
          value={value}
          onChange={value => {
            const action = availableActions.find(action => action.value === value)
            setCampaign({ action })
          }}
          placeholder="What do you want customers to do?"
          groupBy="platform"
        />
      </CardContent>
    </Card>
  )
}


function WheelPreview() {
  const [campaign, setCampaign] = useCampaign()
  return (
    <div className="bg-slate-200 w-full h-192 overflow-clip rounded-md">
      <PrizeWheel
        className="h-full"
        state={{
          lights: { animating: false },
        }}
        prizes={campaign.prizes}
        theme={deepMerge(themes['red'], {
          lights: { size: 4 },
        })}
      />
    </div>
  )
}
