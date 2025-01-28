
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
  manifest: '/pwa/manifest.json',
  applicationName: "Chancify Application",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Chancify Application",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { sizes: "512x512", url: "/pwa/icon512_rounded.png", type: "image/png" },
      { sizes: "512x512", url: "/pwa/icon512_maskable.png", type: "image/png" },
    ],
    apple: [
      { sizes: "512x512", url: "/pwa/icon512_rounded.png", type: "image/png" },
      { sizes: "512x512", url: "/pwa/icon512_maskable.png", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
  },
}


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className={cn("font-sans antialiased", fontSans.variable)}>
        <AuthProvider >
          <TRPCReactProvider>
            {props.children}
          </TRPCReactProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
