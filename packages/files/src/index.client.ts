"use client"


type PutFileOptions = {
  contentType: string
}

type GetFileOptions = {
  responseFormat?: 'text' | 'json' | 'blob' | 'array' | 'form'
  getItem?: boolean
}

const API_SETUP_WARNING = `
File API Instructions
This api must be included in the nextjs application to work with files
 a.	Make a file called /api/files/[...method]/route.ts
 b.	Make its contents \`export * from '@repo/files/api'\`
This is necessary for the client side to work with files
`

export class Files {
  private static async fetchApi(path: string, options?: RequestInit) {
    try {
      const response = await fetch(`/api/files/${path}`, options)
      if (!response.ok) {
        console.warn(API_SETUP_WARNING)
        throw new Error(`API request failed: ${response.statusText}`)
      }
      return response.json()
    } catch (error) {
      console.warn(API_SETUP_WARNING)
      throw error
    }
  }

  static async put(key: string, file: File, options: PutFileOptions = {
    contentType: file.type,
  }) {
    // Get the signed url to upload to
    const { url } = await this.fetchApi(`signed-url?key=${encodeURIComponent(key)}&method=put`)

    // Upload the file to the signed URL
    const response = await fetch(url, {
      method: 'PUT',
      body: file as Blob,
      headers: {
        'Content-Type': options.contentType,
      }
    })
    const success = response.ok
    return success
  }

  static async url(key: string) {
    const { url } = await this.fetchApi(`signed-url?key=${encodeURIComponent(key)}&method=get`)
    return url
  }

  static async get(key: string, options: GetFileOptions = {}) {
    // Get the file from the signed URL
    const { url } = await this.fetchApi(`signed-url?key=${encodeURIComponent(key)}&method=get`)
    const response = await fetch(url)

    // Return the file based on the type
    const contentType = response.headers.get('Content-Type')
    const type = options.responseFormat ? options.responseFormat
      : contentType?.startsWith('text/') ? 'text'
      : contentType?.startsWith('application/json') ? 'json'
      : 'blob'
    const data = response.ok == false ? undefined
      : options.getItem == false ? undefined
      : (type === 'array') ? await response.arrayBuffer()
      : (type === 'text') ? await response.text()
      : (type === 'json') ? await response.json()
      : await response.blob()
    return { data, response }
  }

  static async list(prefix: string) {
    const list = await this.fetchApi(`list?prefix=${encodeURIComponent(prefix)}`)
    return list
  }

  static async delete(key: string) {
    const response = await this.fetchApi('delete', {
      method: 'DELETE',
      body: JSON.stringify({ key }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.success
  }
}
