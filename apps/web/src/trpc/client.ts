"use client"

import { ClientTRPCFactory } from "@repo/api/client"
import { type AppRouter } from "."


export const { 
  trpc, TRPCReactProvider, client 
} = ClientTRPCFactory<AppRouter>()
