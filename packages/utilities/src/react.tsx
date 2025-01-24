"use client"

import {
  useState, useEffect, useCallback, createContext, type Dispatch,
  type ReactNode, useContext, useMemo, useRef,
} from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { type CookieOptions, getCookie, isWebBrowser, setCookie } from './browser'
import { deepMerge } from './object'
import { useDebouncedCallback } from 'use-debounce'


type CookieParts = Partial<CookieOptions>
export function useCookie<T>(
  name: string,
  initialValue: T,
  options: CookieParts = {},
) : [T, (value: T | ((val: T) => T), options?: CookieParts) => void] {
  // Get the current cookie value
  const [cookieValue, setCookieValue] = useState<T>(() => {
    const cookie = getCookie(name)
    const value = cookie !== null ? JSON.parse(cookie) as T : initialValue
    return value
  })

  // Update the cookie value whenever it changes
  const updateCookie = useCallback((
    value: T | ((val: T) => T),
    extraOptions: CookieParts = {}
  ) => {
    const valueToStore = value instanceof Function ? value(cookieValue) : value
    setCookie(name, JSON.stringify(valueToStore), { ...options, ...extraOptions })
    setCookieValue(valueToStore)
  }, [name, cookieValue])

  // Listen for changes to the cookie to pass to the system
  useEffect(() => {
    const handleCookieChange = () => {
      const newCookieValue = getCookie(name)
      if (newCookieValue !== cookieValue) {
        const value = newCookieValue ? JSON.parse(newCookieValue) : initialValue
        setCookieValue(value)
      }
    }

    // Listen to the cookie change event
    window.addEventListener('cookiechange', handleCookieChange)
    return () => window.removeEventListener('cookiechange', handleCookieChange)
  }, [name, cookieValue, initialValue])
  return [cookieValue, updateCookie]
}


export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: {
    listen?: boolean
    deserialize?: (json: string) => T
  } = {},
): [T, (value: T | ((val: T) => T)) => void] {
  function deserialize(json: string): T {
    if (options.deserialize) return options.deserialize(json)
    return JSON.parse(json)
  }

  const [storedValue, setStoredValue] = useState<T>(() => {
    const isServer = !isWebBrowser()
    if (isServer) return initialValue
    const item = localStorage.getItem(key)
    return item ? deserialize(item) : initialValue
  })

  // Handle changes to the stored value
  const storageEvent = `${key}-storage-event`
  const handleCustomEvent = useCallback((e: CustomEvent) => {
    // Make sure we are handling the right event
    if (e.detail.key !== key) return
    const newValue = e.detail.value

    // Only update the stored value if it has changed
    const isSameValue = JSON.stringify(newValue) === JSON.stringify(storedValue)
    if (isSameValue) return
    setStoredValue(deserialize(JSON.stringify(newValue)))
  }, [key, storedValue])

  // Handle changes from other windows/tabs
  const handleStorageEvent = useCallback((e: StorageEvent) => {
    // Make sure we are handling the right event
    const ignoreEvent = e.key !== key || e.newValue === null
    if (ignoreEvent) return

    // Only update the stored value if it has changed
    const newValue = deserialize(e.newValue)
    const isSameValue = JSON.stringify(newValue) === JSON.stringify(storedValue)
    if (isSameValue) return
    setStoredValue(newValue)
  }, [key, storedValue])

  // Bind the event listeners and their cleanup code
  useEffect(() => {
    if (!options.listen) return
    window.addEventListener(storageEvent, handleCustomEvent as EventListener)
    window.addEventListener('storage', handleStorageEvent)
    return () => {
      window.removeEventListener(storageEvent, handleCustomEvent as EventListener)
      window.removeEventListener('storage', handleStorageEvent)
    }
  }, [handleCustomEvent, handleStorageEvent, storageEvent])

  // Make a function to change the stored value
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    // Check if the new value is equal to the stored value
    const valueToStore = value instanceof Function ? value(storedValue) : value
    const isSameValue = JSON.stringify(valueToStore) === JSON.stringify(storedValue)
    if (isSameValue) return

    // Push the new value to the local storage and dispatch an event
    localStorage.setItem(key, JSON.stringify(valueToStore))
    setStoredValue(valueToStore)
    window.dispatchEvent(
      new CustomEvent(storageEvent, {
        detail: { key, value: valueToStore }
      })
    )
  }, [key, storedValue, storageEvent])
  return [storedValue, setValue]
}


export function usePath() {
  const [path, setPath] = useState<string>("")
  const pathname = usePathname()
  useEffect(() => {
    if (pathname) {
      setPath(pathname)
    }
  }, [pathname])
  return path
}


export function usePathComponents() {
  const [pathComponents, setPathComponents] = useState<string[]>([])
  const pathname = usePathname()
  useEffect(() => {
    if (pathname) {
      const newPathComponents = pathname.split('/').filter(part => part)
      setPathComponents(newPathComponents)
    }
  }, [pathname])
  return pathComponents
}


export function useNavigationState() {
  type QueryParams = Record<string, string>
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [path, setPath] = useState<string>(pathname || '')
  const [queryParams, setQueryParams] = useState<QueryParams>({})

  // Update internal state when pathname or search params change
  useEffect(() => {
    if (pathname) {
      setPath(pathname)
    }
    
    const currentParams: QueryParams = {}
    searchParams.forEach((value, key) => {
      currentParams[key] = value
    })
    setQueryParams(currentParams)
  }, [pathname, searchParams])

  // Function to update both path and query parameters
  const navigate = useCallback((newPath?: string, newParams?: QueryParams) => {
    const updatedPath = newPath || path
    const updatedParams = newParams || queryParams
    
    const searchString = new URLSearchParams(updatedParams).toString()
    const fullPath = searchString 
      ? `${updatedPath}?${searchString}`
      : updatedPath
    
    router.push(fullPath)
  }, [path, queryParams, router])

  // Function to update only query parameters
  const updateQueryParams = useCallback((newParams: QueryParams) => {
    navigate(path, newParams)
  }, [path, navigate])

  // Function to update only path
  const updatePath = useCallback((newPath: string) => {
    navigate(newPath, queryParams)
  }, [queryParams, navigate])

  return {
    path,
    queryParams,
    navigate,
    updateQueryParams,
    updatePath
  }
}


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

/**
 * Create a context from an object with a default value
 * @returns A tuple with the hook and provider for the context
 * @example [useCount, CountProvider] = createObjectContext()
 */
export function createObjectContext<T extends object>() {
  // Create the context from the default value
  type ContextValue = [T, Dispatch<Partial<T>>]
  const ObjectContext = createContext<ContextValue | null>(null)

  // Make a provider from the context
  const Provider: React.FC<{
    state: T
    setState: Dispatch<Partial<T>> | Dispatch<T>
    children: ReactNode
  }> = ({ children, state, setState: setStateDirect }) => {
    // Make a state variable and a function to deeply update it
    function setState(value: Partial<T> | ((prevState: T) => Partial<T>)) {
      // @ts-ignore - We don't know the set state type in advance
      setStateDirect((prevState: T) => {
        const update = typeof value === 'function' 
          ? (value as (prevState: T) => Partial<T>)(prevState) 
          : value
        const newObject = deepMerge(prevState, update) as T
        return newObject
      })
    }
    const wrapper = (
      <ObjectContext.Provider value={[state, setState]}>
        {children}
      </ObjectContext.Provider>
    )
    return wrapper
  }

  // Make a hook to consume the context
  const useCustomContext = () => {
    const context = useContext(ObjectContext)
    if (!context) {
      throw new Error('Your custom context must be used within a Provider')
    }
    return context
  }
  return [useCustomContext, Provider] as const
}


/**
 * Create a context where the object has to be provided to the provider 
 * @returns A tuple with the hook and provider for the context
 * @example [useCount, CountProvider] = createObjectContext()
 */
export function createInitialisedObjectContext<T extends object>() {
  // Create the context from the default value
  type ContextValue = [T, Dispatch<Partial<T>>]
  const ObjectContext = createContext<ContextValue | null>(null)

  // Make a provider from the context
  const Provider: React.FC<{
    initial: T
    children: ReactNode
  }> = ({ children, initial }) => {
    // Make a state variable and a function to update it
    const [state, setStateDirect] = useState<T>(initial)

    // Make a state variable and a function to deeply update it
    function setState(value: Partial<T> | ((prevState: T) => Partial<T>)) {
      setStateDirect((prevState: T) => {
        const update = typeof value === 'function' 
          ? (value as (prevState: T) => Partial<T>)(prevState) 
          : value
        const newObject = deepMerge(prevState, update) as T
        return newObject
      })
    }
    const wrapper = (
      <ObjectContext.Provider value={[state, setState]}>
        {children}
      </ObjectContext.Provider>
    )
    return wrapper
  }

  // Make a hook to consume the context
  const useCustomContext = () => {
    const context = useContext(ObjectContext)
    if (!context) {
      throw new Error('Your custom context must be used within a Provider')
    }
    return context
  }
  return [useCustomContext, Provider] as const
}



export function useWindow<K extends keyof Window>(property: K, initialValue: any) {
  const [value, setValueDirect] = useState(initialValue)
  function setValue (newValue: any) {
    if (typeof window !== 'undefined') {
      window[property] = newValue
    }
    setValueDirect(newValue)
  }
  return [value, setValue]
}

export function debounceStateUpdates (value: any, delay: number) {
  const [state, setState] = useState(value)
  const options = { trailing: true }
  const setStateDebounced = useDebouncedCallback(setState, delay, options)
  useMemo(() => setStateDebounced(value), [value])
  return state
}


export function useUpdateEffect(
  effect: () => void | (() => void),
  dependencies: React.DependencyList
) {
  const didMountRef = useRef(false)
  useEffect(() => {
    if (didMountRef.current) {
      return effect()
    } else {
      didMountRef.current = true
    }
  }, dependencies)
}


type AnimationFrameCallback = (deltaTime: number) => void
export const useAnimationFrame = (callback: AnimationFrameCallback) => {
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current
      callback(deltaTime)
    }
    
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }, [callback])

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [animate])
}
