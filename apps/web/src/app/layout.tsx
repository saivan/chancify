
import "@/global/globals.scss"
import { Inter as FontSans } from "next/font/google"
import { cn } from "@repo/utilities"
import { GeistSans } from "geist/font/sans"
import { AuthProvider } from "@repo/authentication/client"
import { TRPCReactProvider } from "@/trpc/client"
import type { ReactNode } from "react"
import { Toaster } from "@repo/components"


export const metadata = {
  title: "Chancify Application",
  description: "A simple chancify application to get you started",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout( props: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className={cn("font-sans antialiased", fontSans.variable)}>
          <AuthProvider >
            <TRPCReactProvider>
              { props.children }
            </TRPCReactProvider>
          </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
