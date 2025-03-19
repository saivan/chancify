'use client'
import { availableActions } from "@/models/Action"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, ComboboxCreatable, Label } from "@repo/components"
import { useMemo } from "react"
import { useCampaign } from "./provider"
import { snakeToTitleCase } from "@repo/utilities"

export function CampaignInformation() {
  const [campaign, setCampaign] = useCampaign()
  const optionsForActions = useMemo(() => availableActions.map(
    action => ({
      ...action,
      label: action.name,
      value: action.id,
    })
  ), [])
  const selectedId = useMemo(() => campaign.action?.id, [campaign.action])

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
          options={optionsForActions}
          value={selectedId}
          onChange={id => {
            const action = availableActions.find(action => action?.id === id)
            // @ts-ignore - value is a string
            setCampaign({ action: action! })
          }}
          placeholder="What do you want customers to do?"
          groupBy={(item) => snakeToTitleCase(item.platform)}
        />
      </CardContent>
    </Card>
  )
}
