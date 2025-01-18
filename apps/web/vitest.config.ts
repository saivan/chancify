
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local', override: true })

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'next/headers': resolve(__dirname, './test/mocks/headers.ts'),
      'next/navigation': resolve(__dirname, './test/mocks/navigation.ts')
    }
  },
  test: {
    setupFiles: './test/setup.ts',
    environment: 'node',
    environmentMatchGlobs: [
      ['test/components/**/*.tsx', 'jsdom'],
      ['test/interactive/**/*.tsx', 'jsdom'],
      ['test/utilities/**/*.tsx', 'jsdom'],
    ],
    reporters: 'verbose',
    globals: true,
    mockReset: true,
  }
})
