
import type { ReactNode } from 'react'
import { CustomerViewStateProvider, SpinProvider } from "./controller"
import { WheelDisplay } from "./WheelDisplay"
import { InformationDisplay } from './InformationDisplay'
import { resolveOrganization } from './serverActions'



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
            className="bg-slate-200 absolute -z-10 top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2"
          > <source src="/videos/tunnel.mp4" type="video/mp4" />
          </video> */}
          <WheelDisplay />
          <InformationDisplay>
            {children}
          </InformationDisplay>
        </SpinProvider>
      </CustomerViewStateProvider>
    </div>
  )
}
