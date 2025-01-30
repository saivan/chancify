
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'


const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api(.*)',
  '/pwa(.*)',
])


async function addCampaignToLivePath (request: any) {
  const { searchParams, pathname } = request.nextUrl
  if (pathname.startsWith('/live/')) {
    const selected = searchParams.get('selectedCampaign')
    if (selected == null) {
      const url = new URL(request.url)
      url.searchParams.set('selectedCampaign', '0')
      return NextResponse.redirect(url)
    }
  }
}

async function middleware (auth: any, request: any) {
  // Redirect to sign-in if navigating to a locked route
  const { userId } = await auth()
  const signedIn = userId !== null
  const navigatingToPublicRoute = isPublicRoute(request)
  const redirectToSignIn = !navigatingToPublicRoute && !signedIn
  if (redirectToSignIn) {
    const signInUrl = new URL('/sign-in', request.url)
    return NextResponse.redirect(signInUrl)
  }

  // If we have a subpath of live, make sure we have a selected campaign
  const result = addCampaignToLivePath(request)
  if (result) return result

  // If not redirecting, return the response to continue the request
  return NextResponse.next()
}


export default clerkMiddleware(middleware)


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
