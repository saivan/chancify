
import { shortId } from '@repo/utilities/server'
import { Campaign } from '@/models/Campaign'
import { ReactNode } from 'react'
import { availableActions } from '@/models/Action'
import { themes } from '@/models/Theme'
import { CampaignsProvider, LayoutProvider } from './provider'


export default function (props: { children: ReactNode }) {
  const campaigns: Campaign[] = [{
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
    status: 'active',
  }, {
    id: '2',
    action: availableActions[1],
    platform: "Instagram",
    prizes: [
      { id: shortId(), name: "Hello Aba", probability: 15 },
      { id: shortId(), name: "Maryanne", probability: 1 },
      { id: shortId(), name: "Free Lunch", probability: 1 },
      { id: shortId(), name: "Awesome Thing", probability: 3 },
      { id: shortId(), name: "Stinky Snake", probability: 4 },
      { id: shortId(), name: "Awesome Sauce", probability: 3 },
    ],
    theme: themes['roseGold'],
    collectInformation: {
      name: false,
      phone: false,
      email: false,
      postalAddress: false,
    },
    status: 'active',
  }]

  return (
    <div className="w-[100svw] h-[100svh] flex bg-slate-200">
      <CampaignsProvider initial={campaigns}>
        <LayoutProvider initial={{ wheelCentred: false }}>
          {props.children}
        </LayoutProvider>
      </CampaignsProvider>
    </div>
  )
}
