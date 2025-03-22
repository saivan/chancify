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
        backgroundPositionY: "bottom",
      }}
      className="
        background-cover h-[100vh] 
        grid md:grid-cols-[3fr_min(90vw,500px)_1fr] place-items-end
        grid-cols-[0px_1fr]
      "
    >
      <div className="
        bg-white/[0.85] rounded-lg 
        border border-slate-50
        md:background-red-800
        m-auto
        col-start-2
        backdrop-brightness-125 backdrop-blur-xl
      "> {children} </div>
    </div>
  )
}

