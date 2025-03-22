'use client'
import type { CampaignType } from "@/models/Campaign"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Label, Switch } from "@repo/components"
import { } from 'react'
import { useCampaign } from "./provider"


export function CollectInformation() {
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

function CheckBox(props: { 
  for: keyof CampaignType['collectInformation'], 
  label: string 
}) {
  const [campaign, setCampaign] = useCampaign()
  const checked = campaign.collectInformation?.[props.for]
  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-xs">
      <div className="space-y-0.5">
        <Label>{props.label}</Label>
      </div>
      <div>
        <Switch
          checked={checked}
          onCheckedChange={checked => {
            setCampaign({
              collectInformation: {
                name: campaign.collectInformation?.name ?? false,
                phone: campaign.collectInformation?.phone ?? false,
                email: campaign.collectInformation?.email ?? false,
                postalAddress: campaign.collectInformation?.postalAddress ?? false,
                [props.for]: checked
              }
            })
          }}
        />
      </div>
    </div>
  )
}
