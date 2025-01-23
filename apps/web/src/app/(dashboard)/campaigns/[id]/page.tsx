"use client"

import { PotentialPrizes } from "@/components/campaign/Prizes"
import { CenterBox } from "@/components/dashboard/CenterBox"
import { availableActions } from "@/models/Action"
import { Campaign, CampaignProvider, CollectInformation, useCampaign } from "@/models/Campaign"
import { themes } from "@/models/Theme"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Checkbox, ComboboxCreatable, Icon, Label, Switch } from "@repo/components"
import { cn, shortId } from "@repo/utilities"
import { useMemo, useState } from "react"
import { WheelPreview } from "@/components/campaign/WheelPreview"



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
          <CollectInformation />
          <CampaignStatus />
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


function CollectInformation() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Collect Information</CardTitle>
        <CardDescription>
          What do customers need to supply to claim their reward?
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <CheckBox label="Name" for="name" />
        <CheckBox label="Email Address" for="email" />
        <CheckBox label="Phone Number" for="phone" />
        <CheckBox label="Postal Address" for="postalAddress" />
      </CardContent>
    </Card>
  )
}

function CheckBox(props: { for: keyof CollectInformation, label: string }) {
  const [campaign, setCampaign] = useCampaign()
  const checked = campaign.collectInformation[props.for]
  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
      <div className="space-y-0.5">
        <Label>{props.label}</Label>
      </div>
      <div>
        <Switch
          checked={checked}
          onCheckedChange={checked => {
            setCampaign({
              collectInformation: {
                ...campaign.collectInformation,
                [props.for]: checked
              }
            })
          }}
        />
      </div>
    </div>
  )
}

function CampaignStatus() {
  const [campaign, setCampaign] = useCampaign()
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Campaign Status</CardTitle>
        <CardDescription>
          Allow customers to start taking these actions and winning prizes
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4"> 
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <Label>Publish Campaign</Label>
            <p className="text-sm text-slate-500">
              Make this campaign available to your customers
            </p>
          </div>
          <div>
            <Switch
              checked={campaign.status === 'active'}
              onCheckedChange={checked => {
                setCampaign({
                  status: checked ? 'active' : 'inactive'
                })
              }}
            />
          </div>
        </div>
        <DeleteButton name={campaign.action.label} />
      </CardContent>
    </Card>
  )
}


function DeleteButton(props: {
  name: string
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger type="button" className={cn(
        "flex bg-destructive text-white items-center border-none w-max gap-2",
        "p-2 px-4 border border-border rounded-md font-semibold",
       )}>
          <Icon icon="trash" />
          Delete Campaign
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