
import { ZodObject, unknown, z } from 'zod'
import { DynamoDB, TableConnection, type ComputeFunction, type DynamoIndexes } from '@repo/database'
import { schemaHasField } from '@repo/utilities/server'
import { shortId } from '@repo/utilities/server'


type ExpectedData = {
  id?: string | undefined,
  dateCreated?: string | undefined,
  dateUpdated?: string | undefined,
}


export function baseModel<T extends ExpectedData>(options: {
  name: string,
  schema: ZodObject<any>,
  indexes: DynamoIndexes,
  connection: TableConnection,
  idGenerator?: (data: Record<string, any>) => string,
  compute?: Record<string, ComputeFunction>,
}) {
  // Unpack and default the options
  const {
    name='model',
    schema,
    indexes=[
      { partition: 'id' },
    ],
    idGenerator=shortId,
    compute={},
  } = options
  if (schema == null) throw Error(`A schema is required to create a model`)

  // Construct the database 
  ensureRequiredFieldsInSchema(schema)
  const database = new DynamoDB()
    .name(name)
    .connection(options.connection)
    .schema(schema)
    .indexes(indexes)

  // Add in all of the computed fields
  for(const [name, computeFunction] of Object.entries(compute)) {
    database.computed(computeFunction, { tag: name })
  }

  // Return the model class
  return class Model {
    _data : T = {
      id: undefined,
      dateCreated:undefined,
      dateUpdated: undefined,
    } as T
    _database = database
    _schema = schema
  
    constructor ( input?: string | T ) {
      if (typeof input === 'string') Object.assign(this._data, { id: input })
      if (input instanceof Object) this._data = input 
    }
  
    // Getters and setters
    get data () : T { return this._data }
    set data (data: object) { 
      if (schema == null) throw Error(`No schema is defined for this model`)
      this._data = schema.parse(data) as T
    }

    get schema () { return this._schema }
    set schema (o) { throw Error(`The schema is read only after creation`) }
  
    id (): string | undefined
    id (id: string): this 
    id (id?: string): string | undefined | this {
      if (id == null) return this._data.id
      this._data.id = id
      return this
    }

    set(data: Record<string, any>) : this
    set(key: string, value: any) : this
    set(o: string | Record<string, any>, value?: any) {
      const data = typeof o === 'string' ? { [o]: value } : o
      Object.assign(this._data, data)
      return this
    }
  
    // Actions

    async exists() {
      // Make sure we have indexes in this model
      const indexes = database.indexes()
      if (indexes == null) throw Error(`Please define indexes for this model`)

      // Iterate through each database index
      for (const [index, databaseIndex] of indexes.entries()) {
        // Check whether we are missing any primary keys
        const { primary, unique } = database._isolatePrimaryKey(this._data, { index })
        if (!unique) continue

        // Check if the item exists in the database
        const storedObject = await database.get(primary)
        const exists = storedObject != null 
        if (exists) return true
      }
      return false
    }
  
    async create() {
      // Generate an ID if needed
      if (this.id() == null) this.id(idGenerator(this._data))
    
      // Prepare the data for creation and backup the old data
      const originalData = { ...this._data }
      const dataInput = {
        ...this._data,
        dateCreated: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
      }
      
      // Attempt to create the item
      const result = await database.create(dataInput).catch(error => {
        // If this isn't the "item exists" error, then it's unexpected
        if (!(error instanceof Error) || error.message !== 'Item already exists') {
          throw error
        }

        // If the creation failed, then there was no result
        return null
      })
      
      // If creation succeeded, update and return
      if (result) {
        Object.assign(this._data, result)
        return this
      }
      
      // Here we have a conflict, so we need to pull the existing item
      await this.pull().catch(() => {
        // Restore original data if pull fails
        this._data = originalData
        throw new Error(`Failed to find existing item after creation conflict`)
      })
      return this
    }
  
    async push({ force = false } = {}) {
      // Force pushes can create new items if they don't exist
      if (force) {
        const result = await database.put(this._data)
        this._data = result
        return this
      }
      
      // Throw an error if the item doesn't exist
      if (this.id() == null) throw Error(`No id is defined for this item`)
      const existingItem = await database.get({ id: this.id()})
      if (existingItem === null) throw Error(`Item not found in the database`)
      
      // Update the database and store the new data on the model
      const result = await database.put(this._data)
      this._data = result
      return this
    }

    async pull() {
      // Try each index in order
      const indexes = database.indexes()
      if (!indexes) throw Error(`Please define indexes for this model`)
    
      // Iterate through each index according to the schema to find the item
      for (const [i, index] of indexes.entries()) {
        // Check if we have all required fields for this index
        const { primary, unique } = database._isolatePrimaryKey(this._data, { index: i })
        if (!unique) continue
        
        // Query using this index
        const result = await database.get(primary).catch(() => null)
        if (result) {
          this._data = result as T
          return this
        }
      }
      
      throw Error(`Item not found in the database`)
    }
  
    async delete() {
      const id = this.id()
      if (id == null) throw Error(`No id is defined for this item`)
      await database.delete({ id })
      return this
    }

    static async list<T extends typeof Model>(
      this: T, 
      description: Record<string, any>,
      options?: {
        count?: number
        limit?: number
        pages?: number | string
        cursor?: string | null
        descending?: boolean
      },
    ) {
      const results = await database.list(description, options)
      const items = results.data.map((result: any) => {
        const item = new this(result) 
        return item
      })
      return {
        items, cursor: results.cursor,
      }
    }
  }
}

function ensureRequiredFieldsInSchema (schema: ZodObject<any>) {  
  // Make sure the schema has the required fields
  function isMissing(field: string) {
    return !schemaHasField(schema, field)
  }
  const mandatoryFields = [ 'id', 'dateCreated', 'dateUpdated' ]
  const missingFields = mandatoryFields.filter(isMissing)
  if (missingFields.length) {
    throw Error(`Schema is missing ${missingFields.join(', ')}`)
  }
}

