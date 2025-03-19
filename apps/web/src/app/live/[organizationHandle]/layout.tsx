
import type { ReactNode } from 'react'
import { CustomerViewStateProvider, SpinProvider } from "./controller"
import { WheelDisplay } from "./WheelDisplay"
import { InformationDisplay } from './InformationDisplay'
import { resolveOrganization } from './serverActions'
import { cn } from '@repo/utilities'



export default async function Layout({
  children,
  params,
}: {
  children: ReactNode
  params: {
    organizationHandle: string
  }
}) {
  const { organizationHandle } = await params
  const organization = await resolveOrganization(organizationHandle)
  return (
    <div className="w-[100svw] h-[100svh] relative flex bg-slate-200">
      <CustomerViewStateProvider initial={{
        organization: {
          id: organization.organizationId,
          handle: organizationHandle,
          data: organization.data,
        },
        campaigns: {
          list: organization.campaigns,
          selected: 0,
        },
        wheel: {
          animating: false,
          rotating: false,
          centered: false,
          current: 'disabled',
        },
        historyId: null,
        links: 'qr',
      }}>
        <SpinProvider>
          {/* TODO: Find a good background video for the wheel */}
          {/* <video autoPlay muted loop playsInline
            className="absolute  top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2"
          > <source src="/videos/tunnel.mp4" type="video/mp4" />
          </video> */}
          <div className={cn(
            "grid grid-rows-[1fr] md:grid-cols-[1fr_minmax(542px,1fr)] h-[100svh]",
            "w-full overflow-clip relative"
          )}>
            <WheelDisplay />
            <InformationDisplay>
              {children}
            </InformationDisplay>
          </div>
        </SpinProvider>
      </CustomerViewStateProvider>
    </div>
  )
}
