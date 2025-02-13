import { clamp } from '@repo/utilities'
import type { ReactNode } from 'react'
import { CustomerViewStateProvider } from './controller'
import { resolveOrganization } from './serverActions'



export default async function Layout({ 
  children,
  params,
  searchParams
}: { 
  children: ReactNode
  params: {
    organizationHandle: string
  }
  searchParams?: {
    selected?: string
  }
}) {
  const selectedIndex = Number(searchParams?.selected ?? 0)
  const { organizationHandle } = await params
  const organization = await resolveOrganization(organizationHandle)
  const selected = clamp(selectedIndex, 0, organization.campaigns.length - 1)

  return (
    <div className="w-[100svw] h-[100svh] relative flex">
      <video autoPlay muted loop playsInline
        className="bg-slate-200 absolute -z-10 top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2"
      > 
        <source src="/videos/tunnel.mp4" type="video/mp4" />
      </video>
      <CustomerViewStateProvider initial={{
        organization: {
          id: organization.organizationId,
          handle: organizationHandle,
          data: organization.data,
        },
        campaigns: {
          list: organization.campaigns,
          selected,
        },
        wheel: {
          centered: false,
          current: 'disabled',
        },
        historyId: null,
      }}> 
        {children}
      </CustomerViewStateProvider>
    </div>
  )
}
