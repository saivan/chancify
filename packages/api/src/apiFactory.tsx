"use client";

import { createTRPCRouter } from "./index"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, loggerLink, httpBatchStreamLink } from "@trpc/client"; 
import { createTRPCReact } from "@trpc/react-query";
import React, { useState, type ReactNode } from "react";
import SuperJSON from "superjson";


const createQueryClient = () => new QueryClient();

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient());
};


const configuredLoggerLink = loggerLink({
  enabled: (op) =>
    process.env.NODE_ENV === "development" ||
    (op.direction === "down" && op.result instanceof Error),
})
const configuredStreamLink = httpBatchStreamLink({
  transformer: SuperJSON,
  url: getBaseUrl() + "/api/trpc",
  headers: () => {
    const headers = new Headers();
    headers.set("x-trpc-source", "nextjs-react");
    return headers;
  },
})

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}



type Router = ReturnType<typeof createTRPCRouter>



export function ClientTRPCFactory<AppRouter extends Router>() {
  const trpc = createTRPCReact<AppRouter>();
  // @ts-ignore - In the factory we can't properly typecheck trpc
  const { Provider, createClient } = trpc
  function TRPCReactProvider(props: { children: ReactNode }) {
    const queryClient = getQueryClient();
    const [trpcClient] = useState(() =>
      createClient({ links: [configuredLoggerLink, configuredStreamLink] })
    )
    return (
      <QueryClientProvider client={queryClient}>
        <Provider client={trpcClient} queryClient={queryClient}>
          {props.children}
        </Provider>
      </QueryClientProvider>
    )
  }

  // This is a client that can be used almost like a fetch query
  const client = createTRPCClient<AppRouter>({
    links: [configuredStreamLink],
  })

  return { trpc, TRPCReactProvider, client }
}
