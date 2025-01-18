
import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
 
test('Page', () => {
  render(<Page />)
  const heading = screen.getByRole('heading', { level: 1, name: 'Home' })
  expect(heading.textContent).toBe('Home')
  expect(heading).toBeDefined()
})


// Sample Implementation 
import Link from 'next/link'
 
export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
    </div>
  )
}

