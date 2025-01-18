
export function headers() {
  return new Headers()
}

export function cookies() {
  return new Map()
}

export const headersInstance = new Headers()

export function createHeaders() {
  return headersInstance
}