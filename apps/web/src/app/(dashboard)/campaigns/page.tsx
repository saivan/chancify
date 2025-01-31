"use client"

import { CenterBox } from "@/components/dashboard/CenterBox"
import { Campaigns } from "./Campaigns"

export default function () {
  const campaigns = [
    { id: '1', name: "Leave a Google Review", icon: "google" },
    { id: '2', name: "Follow us on Instagram", icon: "instagram" },
    { id: '3', name: "Tag us on Instagram", icon: "instagram" },
    { id: '4', name: "Follow us on TikTok", icon: "tiktok" },
    { id: '5', name: "Leave a Review on Facebook", icon: "facebook" },
  ]
  return (
    <CenterBox
      title='Campaigns'
      caption='Define the actions you want customers to take'
    >
      <Campaigns campaigns={campaigns}/>
    </CenterBox>
  )
}
