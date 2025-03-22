
import Color from 'colorjs.io'


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


/**
 * Converts any CSS color format to hex, including CSS variables
 * @param cssColor - CSS color string in any format (hex, rgb, hsl, oklab, etc.) or CSS variable
 * @param element - Optional element to use as context for CSS variables (defaults to document.body)
 * @returns Hex color string or null if conversion fails
 */
export function cssToHex(cssColor: string, element: HTMLElement = document.body): string | null {
  try {
    // Check if the color is a CSS variable
    if (cssColor.trim().startsWith('var(')) {
      // Extract the variable name from var(--name)
      const varName = cssColor.match(/var\s*\(\s*(--[^,)]+)(?:,\s*([^)]+))?\s*\)/)?.[1];
      
      if (!varName) {
        return null;
      }
      
      // Create a temporary element to resolve the variable
      const tempElement = document.createElement('div');
      tempElement.style.color = cssColor;
      tempElement.style.display = 'none';
      
      // Append to the provided element or document body to ensure CSS inheritance
      element.appendChild(tempElement);
      
      // Get the computed color value
      const computedColor = getComputedStyle(tempElement).color;
      
      // Clean up
      element.removeChild(tempElement);
      
      // If we got a computed color, convert it
      if (computedColor && computedColor !== '') {
        // Parse the computed color with Color.js
        const color = new Color(computedColor);
        const srgbColor = color.to("srgb");
        
        if (!srgbColor.inGamut()) {
          srgbColor.toGamut();
        }
        
        return srgbColor.toString({format: "hex"}).toUpperCase();
      }
      
      return null;
    }
    
    // For non-variable colors, use Color.js directly
    const color = new Color(cssColor);
    const srgbColor = color.to("srgb");
    
    if (!srgbColor.inGamut()) {
      srgbColor.toGamut();
    }
    
    return srgbColor.toString({format: "hex"}).toUpperCase();
  } catch (error) {
    // Return null if color parsing fails
    return null;
  }
}

export function cssToRGB(cssColor: string): number[] | null {
  const hexColor = cssToHex(cssColor)
  const rgbMatch = hexColor?.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (!rgbMatch) return null
  const r = parseInt(rgbMatch[1], 16)
  const g = parseInt(rgbMatch[2], 16)
  const b = parseInt(rgbMatch[3], 16)
  return [r, g, b]
}


/**
 * Downloads an SVG element as an image file
 */
export function downloadSvg(
  svg: SVGElement,
  options: {
    fileName: string
    format?: 'svg' | 'png'
    width?: number
    height?: number
  }
): Promise<void> {
  const { 
    fileName, 
    format = 'png', 
    width = 300, 
    height = 300 
  } = options
  
  return new Promise<void>((resolve, reject) => {
    if (!svg) {
      reject(new Error('No SVG element provided'))
      return
    }
    
    // Get SVG data
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    
    // If format is SVG, download directly
    if (format === 'svg') {
      const url = URL.createObjectURL(svgBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${fileName}.svg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      resolve()
      return
    }
    
    // For PNG format, convert SVG to PNG
    const svgUrl = URL.createObjectURL(svgBlob)
    
    // Create canvas
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      reject(new Error('Failed to get canvas context'))
      return
    }
    
    // Create image element
    const img = document.createElement('img')
    
    // Set up image load handler
    img.onload = function() {
      // Draw image to canvas
      ctx.drawImage(img, 0, 0, width, height)
      
      // Convert to PNG and download
      canvas.toBlob(function(blob) {
        if (!blob) {
          reject(new Error('Failed to create blob from canvas'))
          return
        }
        
        // Create object URL for the blob
        const url = URL.createObjectURL(blob)
        
        // Create download link
        const a = document.createElement('a')
        a.href = url
        a.download = `${fileName}.png`
        document.body.appendChild(a)
        a.click()
        
        // Clean up
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        URL.revokeObjectURL(svgUrl)
        
        resolve()
      }, 'image/png')
    }
    
    // Handle potential errors
    img.onerror = function() {
      console.error('Error loading SVG for conversion')
      URL.revokeObjectURL(svgUrl)
      reject(new Error('Failed to load SVG'))
    }
    
    // Set image source to SVG URL
    img.src = svgUrl
  })
}

/**
 * Copies text to the clipboard using the modern Clipboard API
 * @param text The text to copy to clipboard
 * @returns Promise that resolves when the text is copied or rejects if it fails
 */
export function copyToClipboard(text: string): Promise<void> {
  if (!navigator.clipboard) {
    return Promise.reject(new Error('Clipboard API not supported in this browser'))
  }
  
  return navigator.clipboard.writeText(text)
}
