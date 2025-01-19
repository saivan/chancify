

export function detectOS() {
  // Get the platform name
  const userAgent = window.navigator.userAgent
  // @ts-ignore - user agent data only exists in some browsers
  const platform = window.navigator?.userAgentData?.platform || window.navigator.platform
  const macosPlatforms = ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
  const iosPlatforms = ['iPhone', 'iPad', 'iPod']

  // Return the platform name if it is found
  if (macosPlatforms.indexOf(platform) !== -1) return 'Mac OS'
  if (iosPlatforms.indexOf(platform) !== -1) return 'iOS'
  if (windowsPlatforms.indexOf(platform) !== -1) return 'Windows'
  if (/Android/.test(userAgent)) return 'Android'
  if (/Linux/.test(platform)) return 'Linux'
  return 'Unknown'
}


export function isWebBrowser() {
  const isWindowDefined = typeof window !== 'undefined'
  return isWindowDefined
}


export function htmlString(strings: TemplateStringsArray, ...values: any[]) {
  const strippedStrings = strings.map(string => {
    const noLeadingSpaces = string.replace(/\n\s+/g, '')
    const noTabs = noLeadingSpaces.replace(/^\s*[\r\n]/gm, '')
    const noNewLines = noTabs.replace(/\n/g, '')
    return noNewLines
  })
  const joinedStrings = strippedStrings
    .reduce((result, str, i) => result + str + (values[i] || ''), '')
  return joinedStrings
}


export type CookieOptions = {
  expires?: Date, maxAge?: number, path?: string, domain?: string,
  secure?: boolean, httpOnly?: boolean, sameSite?: 'Strict' | 'Lax' | 'None'
}


const isClient = typeof window !== 'undefined'
function parseCookies(cookieString: string = '') {
  return cookieString
    .split('')
    .map(pair => pair.trim().split('='))
    .reduce((acc, [key, value]) => {
      if (key && value) {
        try {
          acc[decodeURIComponent(key)] = JSON.parse(decodeURIComponent(value))
        } catch {
          acc[decodeURIComponent(key)] = decodeURIComponent(value)
        }
      }
      return acc
    }, {} as Record<string, any>)
}


export function setCookie(
  name: string,
  value: any,
  options: Partial<CookieOptions> = {}
) {
  if (!isClient) return

  const stringValue = JSON.stringify(value)
  const encodedValue = encodeURIComponent(stringValue)
  let cookieString = `${encodeURIComponent(name)}=${encodedValue}`

  if (options.expires) cookieString += ` expires=${options.expires.toUTCString()}`
  if (options.maxAge) cookieString += ` max-age=${options.maxAge}`
  if (options.path) cookieString += ` path=${options.path}`
  if (options.domain) cookieString += ` domain=${options.domain}`
  if (options.secure) cookieString += ' secure'
  if (options.httpOnly) cookieString += ' HttpOnly'
  if (options.sameSite) cookieString += ` SameSite=${options.sameSite}`

  document.cookie = cookieString
}


export function getCookie(name: string, serverCookies?: string): any {
  if (isClient) {
    const cookies = parseCookies(document.cookie)
    return cookies[name] ?? null
  } else if (serverCookies) {
    const cookies = parseCookies(serverCookies)
    return cookies[name] ?? null
  }
  return null
}


export function deleteCookie(name: string, path?: string, domain?: string) {
  if (!isClient) return
  setCookie(name, '', { expires: new Date(0), path, domain })
}


export function loadScript(url: string, {
  module = false,
  appendTo = document.body,
}: { module?: boolean, appendTo?: HTMLElement } = {}) {
  const scriptNode = document.createElement('script')
  scriptNode.type = module ? 'module' : 'text/javascript'
  scriptNode.src = url
  appendTo.appendChild(scriptNode)
  return scriptNode
}

export function runScript(code: string, options = {
  appendTo: document.body,
  type: 'text/javascript',
}) {
  const scriptNode = document.createElement('script')
  scriptNode.text = code
  options.appendTo.appendChild(scriptNode)
  return scriptNode
}


export function cssToHex(cssColor: string, element: HTMLElement = document.body): string | null {
  // Create a temporary element
  const tempElement = document.createElement('div')
  tempElement.style.color = cssColor
  element.appendChild(tempElement)

  // Get the computed color value
  const computedColor = getComputedStyle(tempElement).color
  element.removeChild(tempElement)

  // Extract the RGB values
  const rgbMatch = computedColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
  if (!rgbMatch) {
    return null // Return null if the format is not expected
  }

  // Convert RGB to hex
  const r = parseInt(rgbMatch[1], 10)
  const g = parseInt(rgbMatch[2], 10)
  const b = parseInt(rgbMatch[3], 10)

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
}



