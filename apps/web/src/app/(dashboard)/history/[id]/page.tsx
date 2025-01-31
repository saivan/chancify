"use client"

import { CenterBox } from "@/components/dashboard/CenterBox"
import { Campaign, CampaignProvider } from "@/models/Campaign"
import { availableActions } from "@/models/Action"
import { cn, shortId, titleCase } from "@repo/utilities"
import { themes } from "@/models/Theme"
import { useState } from "react"
import { History } from "@/models/History"
import { Badge, Button, Card, CardContent, CardHeader, Input, Label } from "@repo/components"
import Image from "next/image"


export default function () {
  const [history, setHistory] = useState<History>({
    id: '1',
    campaignId: '1',
    date: new Date().toISOString(),
    status: 'claimed',
    customer: {
      id: shortId(),
      name: 'John Smith',
      email: 'john@smith.com',
      phone: '123-456-7890',
      address: '123 Main St',
      details: {},
    },
    prize: {
      id: shortId(),
      name: "Awesome prize",
      chance: 15,
    },
  })
  const [campaign, setCampaign] = useState<Campaign>({
    id: '1',
    action: availableActions[0],
    platform: "Google",
    prizes: [
      { id: shortId(), name: "Hello Aba", chance: 15 },
      { id: shortId(), name: "Maryanne", chance: 1 },
      { id: shortId(), name: "Free Lunch", chance: 1 },
      { id: shortId(), name: "Awesome Thing", chance: 3 },
      { id: shortId(), name: "Stinky Snake", chance: 4 },
      { id: shortId(), name: "Awesome Sauce", chance: 3 },
    ],
    theme: themes['red'],
    collectInformation: {
      name: false,
      phone: false,
      email: false,
      postalAddress: false,
    },
    status: 'active',
  })





  return (
    <CenterBox
      back="/history"
      icon={campaign.action?.icon}
      title={history.prize.name}
      caption={campaign.action.label}
      headerClassName="pb-2"
    >
      <div>
        <div className="flex w-full items-center justify-between pb-8">
          <div>
            <Badge variant={history.status === 'claimed' ? 'default' : 'outline'}>
              {titleCase(history.status)}
            </Badge>
          </div>

          <div className="flex gap-4">
            <Button variant="outline">
              Verify Action
            </Button>
            <Button disabled={history.status === 'claimed'}>
              Claim
            </Button>
          </div>

        </div>
        <div className="flex flex-col gap-8">
          <StatusDisplay history={history} />
          <PrizeDetails campaign={campaign} history={history} />
          <CustomerDetails history={history} />
        </div>
      </div>
    </CenterBox>
  )
}







function StatusDisplay(props: {
  history: History
}) {
  return (
    <Card>
      <CardHeader>
        <h2 className='font-semibold text-2xl md:text-xl tracking-tight text-slate-800 leading-tight'>
          Status
        </h2>
        <p className='text-sm md:text-base font-semibold italic text-slate-500 '>
          Keep track of whether the prize has been claimed
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-16">
          <div className="flex flex-col">
            <span className="text-sm text-slate-600">Status</span>
            <span className={cn(
              "font-semibold",
              props.history.status === 'claimed' ? 'text-green-600' : 'text-red-600',
            )}>{titleCase(props.history.status)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-slate-600" >Date</span>
            <span>{new Date(props.history.date).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PrizeDetails(props: {
  campaign: Campaign
  history: History
}) {
  return (
    <Card>
      <CardHeader>
        <h2 className='font-semibold text-2xl md:text-xl tracking-tight text-slate-800 leading-tight'>
          Prize Details
        </h2>
        <p className='text-sm md:text-base font-semibold italic text-slate-500 '>
          Information about the prize
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-16">
          <div className="flex flex-col">
            <span className="text-sm text-slate-600" >Prize</span>
            <span>{props.history.prize.name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-slate-600" >Campaign</span>
            <span>{props.campaign.action.platform}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-slate-600" >Action</span>
            <span>{props.campaign.action.label}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


function CustomerDetails(props: {
  history: History
}) {
  return (
    <Card>
      <CardHeader>
        <h2 className='font-semibold text-2xl md:text-xl tracking-tight text-slate-800 leading-tight'>
          Customer Details
        </h2>
        <p className='text-sm md:text-base font-semibold italic text-slate-500 '>
          Information about the customer
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-slate-600" >Name</span>
            <span>{props.history.customer.name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-slate-600" >Email</span>
            <span>{props.history.customer.email}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-slate-600" >Phone</span>
            <span>{props.history.customer.phone}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

