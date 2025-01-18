
import mime from 'mime-types'


/**
 * Download a blob as a file
 * @param blob - The blob to download.
 * @param filename - The name of the file to save the blob as
 */
export async function downloadBlob(blob: Blob, filename: string) {
  try {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('There was an error downloading the blob:', error)
  }
}

/**
 * Download a file from a URL.
 * @param url - The URL of the file.
 * @param filename - The name of the file.
 */
export async function downloadFile(url: string, filename: string) {
  try {
    // Fetch the file from the URL
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    // Make and download a blob
    const blob = await response.blob()
    downloadBlob(blob, filename)
  } catch (error) {
    console.error('There was an error downloading the file:', error)
  }
}

/**
 * Get the MIME type from the filename.
 * @param filename - The name of the file.
 * @returns The MIME type if found, otherwise null.
 */
export function getMimeType (path: string): string | null {
  const filename = path.split('/').pop() as string
  const mimeType = mime.lookup(filename) || null
  return mimeType
}

/**
 * Preload a file to cache it in the browser
 * @param url - The URL of the file to preload.
 * @returns A promise that resolves when the file is cached.
 */
export async function preloadFile(url: string): Promise<void> {
  const response = await fetch(url, {
      method: 'GET',
      cache: 'force-cache', 
  })
  await response.blob()
}

/**
 * Convert an SVG string to a base64 string.
 * @param data - The SVG string to convert.
 * @returns The base64 string.
 */
export function svgToBase64(data: string) {
  const base64 = Buffer.from(data).toString('base64')
  const base64String = `data:image/svg+xml;base64,${base64}`
  return base64String
}
