import * as auth from "@repo/authentication/server"
import { redirect } from "next/navigation"


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if we are signed in
  const signedIn = await auth.signedIn()
  if (signedIn) redirect('/')

  // Return the sign in section
  return (
    <div 
      style={{ 
        backgroundImage: "url(/images/auth-background.jpeg)",
        backgroundSize: "cover",
      }}
      className="
        flex background-cover h-[100vh] 
        grid grid-cols-[3fr,min(90vw,500px),1fr] place-items-center
      "
    >
      <div className="
        bg-white/30 rounded-lg 
        border border-slate-50
        md:background-red-800
        m-auto
        col-start-2
        backdrop-brightness-125 backdrop-blur-xl
      "> {children} </div>
    </div>
  )
}

