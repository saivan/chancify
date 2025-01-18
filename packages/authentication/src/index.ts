
if (typeof window === 'undefined') {
  throw Error('Please import either the client or server')
}

export * from './index.client'
