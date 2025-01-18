import "server-only"
import { headers } from "next/headers"
import { cache } from "react"
import { createCaller } from "."
import { createTRPCContext } from "@repo/api/server"


// Simplified context creator
const createContext = cache(async () => {
  const headersList = await headers()
  const heads = new Headers(headersList)
  heads.set("x-trpc-source", "rsc")
  return createTRPCContext({ headers: heads })
})

// Export the api with the simplified context
export const trpc = createCaller(() => createContext())
