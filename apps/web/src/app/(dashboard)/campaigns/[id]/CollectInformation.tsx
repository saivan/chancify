'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Label, Switch } from "@repo/components"
import { useCampaign } from "./provider"
import {} from 'react'


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
