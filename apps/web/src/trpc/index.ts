
import { createCallerFactory, createTRPCRouter } from "@repo/api/server"
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { testRouter } from "./routes/test"


export const appRouter = createTRPCRouter({
  test: testRouter,
})

// Type definitions for the API
export type AppRouter = typeof appRouter
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
