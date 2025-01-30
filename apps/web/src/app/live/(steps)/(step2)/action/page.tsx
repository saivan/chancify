
"use client"

import { Campaign } from "@/models/Campaign"
import { cn, useNavigationState, usePath } from "@repo/utilities/client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useCustomerViewState, useEnforceWheelState } from "@/app/live/controller"
import { Button } from "@repo/components"
import { QRCode } from "@/components/ui/QRCode"



export default function ChooseCampaign() {
  const [state] = useCustomerViewState()
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
          {campaign.action.instruction}
        </p>
      </div>
      <div className="flex flex-col gap-4 border rounded-md border-border w-max p-4">
        <QRCode url="https://g.page/r/CTAANO9cfKlBEAE" />
      </div>
      <div className="flex gap-2">
        <Button asChild variant='outline'>
          <Link href={{
            pathname: '/live/campaigns',
            query: { selectedCampaign }
          }}>Back</Link>
        </Button>
        <Button asChild>
          <Link href={{
            pathname: '/live/details',
            query: { selectedCampaign }
          }}>Next</Link>
        </Button>
      </div>
    </>
  )
}



function googleReviewLink (cid: string) {
  return `⁠https://search.google.com/local/writereview?placeid=0x6b1293d10a34f393:0x41a97c5cef340030`
}



async function findBusinessCID(businessName: string): Promise<string> {
  // First, use Places API to search for the business and get its place_id
  const searchResponse = await fetch(
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(businessName)}&inputtype=textquery&key=YOUR_API_KEY`
  );
  const searchData = await searchResponse.json();
  const placeId = searchData.candidates[0]?.place_id;
  
  if (!placeId) {
    throw new Error('Business not found');
  }
  
  // Then get place details to retrieve CID
  const detailsResponse = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,url&key=YOUR_API_KEY`
  );
  const detailsData = await detailsResponse.json();
  
  // Extract CID from Google Maps URL
  const mapsUrl = detailsData.result.url;
  const cidMatch = mapsUrl.match(/\?cid=(\d+)/);
  return cidMatch ? cidMatch[1] : '';
}


