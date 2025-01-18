
import { ZodSchema, ZodObject } from 'zod'


export function schemaHasField ( 
  schema: ZodSchema<any> | ZodObject<any>, 
  field: string
): boolean {
  // Deal with the case of a zod object
  if (schema instanceof ZodObject) {
    return field in schema.shape
  }
  
  // Deal with zod schemas
  if (schema instanceof ZodSchema) {
    try {
      const parsed = schema.parse({})
      return field in parsed
    } catch {
      return false
    }
  }
  
  return false
}


export function ensureObjectHasFields(
  object: Record<string, any>,
  fields: string[],
) {
  const missingFields = fields.filter(field => object[field] == null)
  if (missingFields.length > 0) {
    const fieldNames = missingFields.join(', ') 
    const input = JSON.stringify(object)
    throw new Error(`Missing fields: ${fieldNames} in ${input}`)
  }
}

