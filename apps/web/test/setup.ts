// test/setup.ts
import { vi, afterAll, afterEach } from "vitest"

// Mock ezheaders
vi.mock('ezheaders', () => ({
  default: {
    headers: () => new Headers(),
    cookies: () => new Map(),
    getHeader: () => null,
    setHeader: vi.fn(),
    removeHeader: vi.fn()
  }
}))

// Disable the server only package for unit tests
vi.mock('server-only', () => ({
  default: 'server-only'
}))


// Cleanup after tests
afterAll(() => {
  vi.clearAllMocks()
})

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks()
})
