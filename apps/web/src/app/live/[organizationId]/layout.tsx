import { clamp } from '@repo/utilities'
import { ReactNode } from 'react'
import { CustomerViewStateProvider } from './controller'
import { getOrganizationCampaigns } from './serverActions'



export default async function Layout({ 
  children,
  params,
  searchParams
}: { 
  children: ReactNode
  params: {
    organizationId: string
  }
  searchParams?: {
    selected?: string
  }
}) {
  const selectedIndex = Number(searchParams?.selected ?? 0)
  const { organizationId } = await params
  const campaigns = await getOrganizationCampaigns(organizationId)
  const selected = clamp(selectedIndex, 0, campaigns.length - 1)
  
  return (
    <div className="w-[100svw] h-[100svh] relative flex">
      <video autoPlay muted loop playsInline
        className="bg-slate-200 absolute -z-10 top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2"
      > 
        <source src="/videos/tunnel.mp4" type="video/mp4" />
      </video>
      <CustomerViewStateProvider initial={{
        organization: {
          id: organizationId
        },
        campaigns: {
          list: campaigns,
          selected,
        },
        wheel: {
          centered: false,
          current: 'disabled',
        },
        customer: {
          name: '',
          phone: '',
          email: '',
          postalAddress: '',
          acceptedTerms: false,
        },
      }}> 
        {children}
      </CustomerViewStateProvider>
    </div>
  )
}
