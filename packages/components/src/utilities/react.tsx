"use client"

import { useCallback, useEffect, useState } from 'react'


export function useMediaQuery(width: number) {
  const [targetReached, setTargetReached] = useState(false)
  const updateTarget = useCallback((e: any) => {
    if (e.matches) {
      setTargetReached(true)
    } else {
      setTargetReached(false)
    }
  }, [])

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`)
    media.addListener(updateTarget)

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true)
    }

    return () => media.removeListener(updateTarget)
  }, [])

  return targetReached
}

export function useIsMobile() {
  return useMediaQuery(640)
}



