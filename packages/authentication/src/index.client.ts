"use client"

import { useUser } from "@clerk/nextjs"


export function authenticatedUser () {
  const { user } = useUser()
  return user 
}

export function isLoaded () {
  const { isLoaded } = useUser()
  return isLoaded
}

export function isSignedIn () {
  const { isSignedIn } = useUser()
  return isSignedIn
}

export function profileImageUrl () {
  const { user } = useUser()
  if (user == null) return null
  const { hasImage, imageUrl } = user
  const url = hasImage ? imageUrl : "/images/placeholder.jpg"
  return url
}


// Export react components from clerk
export { AuthProvider } from "./Provider"
export { SignIn, SignUp, UserButton } from "@clerk/nextjs"
