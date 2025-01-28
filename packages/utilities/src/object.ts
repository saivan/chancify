

export function isObjectEqual(obj1: any, obj2: any): boolean {
  // Check if both arguments are objects
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return obj1 === obj2
  }

  // Check if both objects have the same number of keys
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  // Check if all keys and values are the same
  for (let key of keys1) {
    if (!keys2.includes(key) || !isObjectEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}


/**
 * Check if objectA is a subset of objectB (A ⊆ B)
 * @usage isObjectSubset({ a: 1 }, { a: 1, b: 2 }) // true
 */
export function isObjectSubset(
  objectA: Record<string, any>,
  objectB: Record<string, any>
): boolean {
  // Check if both arguments are objects
  const isEitherNotAnObject = typeof objectA !== 'object'
    || objectA === null
    || typeof objectB !== 'object'
    || objectB === null
  if (isEitherNotAnObject) return false

  // Check if all keys and values are the same
  for (let key of Object.keys(objectA)) {
    if (!isObjectEqual(objectA[key], objectB[key])) {
      return false
    }
  }

  return true
}


/**
 * Merge two objects deeply and return a new object
 * @param target - The object to merge into
 * @param sources - The object to merge from
 * @usage deepMerge({ a: 1 }, { b: 2 }) // { a: 1, b: 2 }
 * @usage deepMerge({ a: { b: 1 } }, { a: { c: 2 } }) // { a: { b: 1, c: 2 } }
 */
export function deepMerge<T extends object>(
  target: T, ...sources: Partial<T>[]
): T {
  // Clone the target object to prevent mutation
  const output = structuredClone(target)

  // Merge each source object into the target object
  for (const source of sources) {
    // Each input should be an object
    if (!source || typeof source !== 'object') continue

    // Merge each key-value pair from the source object
    for (const key of Object.keys(source)) {
      const targetValue = output[key as keyof T]
      const sourceValue = source[key as keyof T]

      // Special handling for different types
      if (sourceValue === null || sourceValue === undefined) {
        output[key as keyof T] = sourceValue as T[keyof T]
        continue
      }

      // Check if both values are objects that should be deep merged
      const shouldDeepMerge = targetValue
        && sourceValue 
        && typeof targetValue === 'object' 
        && typeof sourceValue === 'object' 
        && !Array.isArray(sourceValue) 
        && !(sourceValue instanceof Date) 
        && !(sourceValue instanceof RegExp) 
        && !(sourceValue instanceof Map) 
        && !(sourceValue instanceof Set) 
        && !(sourceValue instanceof Error) 
        && !(sourceValue instanceof Promise) 
        && !(ArrayBuffer.isView(sourceValue))
      if (shouldDeepMerge) {
        output[key as keyof T] = deepMerge(
          targetValue as object,
          sourceValue as object
        ) as T[keyof T]
      } else {
        // For all other cases, clone and replace the value
        output[key as keyof T] = structuredClone(sourceValue) as T[keyof T]
      }
    }
  }
  return output
}


