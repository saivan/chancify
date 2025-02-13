"use-server"

import * as auth from "@repo/authentication/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/dashboard/Header"
import { Sidebar } from "@/app/(dashboard)/Sidebar"
import { coreRoutes } from "@/global/routes"
import { DashboardStateProvider } from "./controller"
import { resolveSignedInUserDetails } from "./serverActions"


export default async function RootLayout({
  children,
}: { children: React.ReactNode }) {
  // Check if we are signed in
  const signedIn = await auth.signedIn()
  if (!signedIn) redirect('/sign-in')
  const { organization } = await resolveSignedInUserDetails()

  // Create a sidebar for the mobile view
  const compactSidebar = (
    <Sidebar
      className="w-full"
      links={coreRoutes}
    />
  )
  // Otherwise serve the route
  return (
    <DashboardStateProvider initial={{
      organizationId: organization.id() as string,
      organizationHandle: organization.data.handle || '',
      googleLink: organization.data.googleLink || '', 
      instagramHandle: organization.data.instagramHandle || '',
      tikTokHandle: organization.data.tikTokHandle || '',
      facebookUsername: organization.data.facebookUsername || '',
      organizationUsers: [],
      history: [],
      campaigns: [],
    }}>
      <div className="grid grid-cols-[0_1fr] md:grid-cols-[auto_1fr] w-full h-full min-h-[100vh]">
        <Sidebar compacts
          className="hidden md:flex"
          links={coreRoutes}
        />
        <div className="w-[100vw] md:w-full h-[100vh] grid grid-rows-[auto_1fr]">
          <Header hasMenuButton sidebar={compactSidebar} />
          <div className="w-full h-full overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </DashboardStateProvider>
  )
}
