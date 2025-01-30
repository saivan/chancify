import { clamp, shortId } from '@repo/utilities'
import { Campaign } from '@/models/Campaign'
import { ReactNode } from 'react'
import { availableActions } from '@/models/Action'
import { themes } from '@/models/Theme'
import { CustomerViewStateProvider } from './controller'



export default function (props: { 
  children: ReactNode
  params: { [key: string]: string | string[] | undefined }
}) {
  const selectedIndex = Number(props.params['selected'] ?? 0)
  const campaigns: Campaign[] = [{
    id: '1',
    action: availableActions[0],
    platform: "Google",
    prizes: [
      { id: shortId(), name: "Hello Aba", chance: 5 },
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
  }, {
    id: '2',
    action: availableActions[1],
    platform: "Instagram",
    prizes: [
      { id: shortId(), name: "Hello Aba", chance: 15 },
      { id: shortId(), name: "Maryanne", chance: 1 },
      { id: shortId(), name: "Free Lunch", chance: 1 },
      { id: shortId(), name: "Awesome Thing", chance: 3 },
      { id: shortId(), name: "Stinky Snake", chance: 4 },
      { id: shortId(), name: "Awesome Sauce", chance: 3 },
    ],
    theme: themes['obsidianShimmer'],
    collectInformation: {
      name: false,
      phone: false,
      email: false,
      postalAddress: false,
    },
    status: 'active',
  }]

  const selected = clamp(selectedIndex, 0, campaigns.length - 1)
  return (
    <div className="w-[100svw] h-[100svh] relative flex">
      <video autoPlay muted loop playsInline
        className="bg-slate-200 absolute -z-10 top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2"
      > 
        <source src="/videos/tunnel.mp4" type="video/mp4" />
      </video>
      <CustomerViewStateProvider initial={{
        campaigns: {
          list: campaigns,
          selected,
        },
        wheel: {
          centered: false,
          current: 'disabled',
        },
      }}> 
        {props.children} 
      </CustomerViewStateProvider>
    </div>
  )
}
