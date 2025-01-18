import "server-only"
import { auth, currentUser } from "@clerk/nextjs/server"
import type { User } from "@clerk/nextjs/server"

export type AuthSession = ReturnType<typeof auth>

export async function signedIn(): Promise<boolean> {
  const { userId } = await auth()
  const signedIn = !!userId
  return signedIn
}

export async function details() : Promise<AuthDetails>{
  return await auth() 
}

export async function userId(): Promise<string | null> {
  const { userId } = await auth()
  return userId
}

export async function user(): Promise<User | null> {
  const user = await currentUser()
  return user
}

type AuthDetails = { 
  sessionId: string;
  userId: string;
  orgId: string | undefined;
  orgRole: string | undefined;
  orgSlug: string | undefined;
  orgPermissions: string[] | undefined;
  factorVerificationAge: [number, number] | null;
  redirectToSignIn: () => void;
} | {
  sessionId: null;
  userId: null;
  orgId: null;
  orgRole: null;
  orgSlug: null;
  orgPermissions: null;
  factorVerificationAge: null;
  redirectToSignIn: () => void;
}