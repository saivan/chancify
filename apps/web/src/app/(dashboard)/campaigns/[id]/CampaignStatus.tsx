"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Card, CardContent, CardDescription, CardHeader, CardTitle, Icon, Label, Switch } from "@repo/components"
import { cn } from "@repo/utilities"
import { useCampaign } from "./provider"
import { useCallback } from 'react'
import { useDashboard } from "../../controller"
import { toast } from "sonner"

export function CampaignStatus() {
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
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-xs">
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
        <DeleteButton 
          name={campaign.action?.name as string} 
          campaignId={campaign.id as string}
        />
      </CardContent>
    </Card>
  )
}


function DeleteButton(props: {
  name: string
  campaignId: string
}) {
  const { deleteCampaign } = useDashboard()
  const handleDelete = useCallback(async (e: any) => {
    e.preventDefault()
    try {
      await deleteCampaign(props.campaignId)
      window.location.href = '/campaigns'
    } catch (error) {
      toast.error("Failed to delete campaign")
    }
  }, [deleteCampaign, props.campaignId])
  

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
          <AlertDialogAction className="bg-destructive"
            onClick={handleDelete}
          >Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}