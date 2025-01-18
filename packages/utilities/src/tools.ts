
/**
 * Returns a promise that resolves after a given amount of time.
 * @param ms - The amount of time to sleep in milliseconds.
 * @returns A promise that resolves after the given amount of time.
 */
export function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
} 

/**
 * Clamp a number between a minimum and maximum value.
 * @param value - The value to clamp.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns The clamped value.
 * @example
 * clamp(5, 0, 10) // 5
 * clamp(-5, 0, 10) // 0
 * clamp(8, 0, 10) // 8
 */
export function clamp (value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
