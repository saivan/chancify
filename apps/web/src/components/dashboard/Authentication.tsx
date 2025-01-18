
import { UserButton } from "@repo/authentication/client"
import * as auth from "@repo/authentication/client"


export function Authentication (){
  // Return a loading state if we haven't logged in yet
  const isLoaded = auth.isLoaded()
  const isSignedIn = auth.isSignedIn()
  if (!isLoaded || !isSignedIn) return (
    <div className="bg-slate-400 rounded animate-pulse w-10 h-10"></div> 
  )

  // Return the user button
  return (  
    <UserButton
      appearance={{
        elements: {
          userButtonAvatarBox: "w-10 h-10 rounded-md",
          userButtonPopoverCard: "bg-blue-100",
        },
      }}
    />
  )
}