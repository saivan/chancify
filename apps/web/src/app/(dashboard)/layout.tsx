"use-server"

import * as auth from "@repo/authentication/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/dashboard/Header"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { coreRoutes } from "@/global/routes"


export default async function RootLayout({
  children,
}: { children: React.ReactNode }) {
  // Check if we are signed in
  const signedIn = await auth.signedIn()
  if (!signedIn) redirect('/sign-in')

  // Create a sidebar for the mobile view
  const compactSidebar = (
    <Sidebar 
      className="w-full" 
      links={coreRoutes} 
    />
  )

  // Otherwise serve the route
  return (
    <div className="flex">
      <Sidebar compacts 
        className="hidden md:flex" 
        links={coreRoutes} 
      />
      <div className="flex flex-col w-full">
        <Header hasMenuButton sidebar={compactSidebar} />
        {children}
      </div>
    </div>
  )
}
