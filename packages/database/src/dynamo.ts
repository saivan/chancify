
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { schemaHasField, shortId } from '@repo/utilities/server'
import { Entity } from 'electrodb'
import {
  ZodArray,
  ZodBigInt,
  ZodBoolean,
  ZodDate,
  ZodEffects,
  ZodEnum,
  ZodNumber,
  ZodObject,
  ZodOptional,
  ZodRecord,
  ZodSchema,
  ZodString
} from 'zod'


function determineDataType(input: ZodSchema): string | Record<string, any> {
  // Recursively remove optional types, as they aren't necessary
  const isOptionalType = input instanceof ZodOptional
  if (isOptionalType) {
    return determineDataType(input._def.innerType)
  }

  // Recursively remove effect types, as they aren't necessary
  const isEffectsType = input instanceof ZodEffects
  if (isEffectsType) {
    return determineDataType(input._def.schema)
  }

  // Handle arrays specifically
  if (input instanceof ZodArray) {
    const elementType = determineDataType(input._def.type)
    return {
      type: 'list',
      items: typeof elementType === 'string' ? { type: elementType } : elementType
    }
  }

  // Handle nested objects
  if (input instanceof ZodObject) {
    return {
      type: 'map',
      properties: zodToElectroAttributes(input)
    }
  }

  // Handle record types (arbitrary key-value pairs)
  if (input instanceof ZodRecord) {
    return {
      type: 'any',
      dynamodbType: 'M'
    }
  }

  // Handle primitive types
  if (input instanceof ZodString) return 'string'
  if (input instanceof ZodNumber) return 'number'
  if (input instanceof ZodBigInt) return 'bigint'
  if (input instanceof ZodDate) return 'string'
  if (input instanceof ZodBoolean) return 'boolean'
  if (input instanceof ZodEnum) return 'string'

  // If an unknown item is seen, error
  throw new Error(`${input} is of an unsupported data type`)
}


function zodToElectroAttributes(schema: ZodObject<any>): Record<string, any> {
  const attributeList = Object.entries(schema.shape)
    .map(([key, value]) => {
      const dataType = determineDataType(value as ZodSchema)
      return {
        [key]: typeof dataType === 'string' ? { type: dataType } : dataType
      }
    })

  const attributes = Object.assign({}, ...attributeList)
  return attributes
}


export type DynamoIndexes = {
  partition: string | string[]
  sort?: string | string[]
}[]

export type ComputeFunction = (
  newState: Record<string, any>,
  oldState: Record<string, any>,
  action: 'create' | 'push' | 'delete' | 'get'
) => Record<string, any>


export type TableConnection = {
  name: string
  region?: string
  endpoint?: string
  credentials?: {
    accessKeyId: string
    secretAccessKey: string
  }
}

type ComputeReturn = {
  get: () => ComputeFunction | undefined
  set: (fn: ComputeFunction) => void
  delete: () => void
}

type ListReturn = {
  data: Record<string, any>[]
  cursor: string | null
}

export class DynamoDB {
  _name?: string
  _version = "1.0"
  _schema?: ZodObject<any>
  _indexes?: DynamoIndexes
  _entity?: Entity<string, string, string, any>
  _connection?: TableConnection
  _computed: Map<string, ComputeFunction> = new Map()

  constructor(inputs: {
    name?: string
    version?: string
    schema?: ZodObject<any>,
    indexes?: DynamoIndexes,
  } = {}) {
    // Define the default schema items
    this._name = inputs.name
    this._version = inputs.version || this._version
    this._schema = inputs.schema
    this._indexes = inputs.indexes
  }

  name(): string | undefined
  name(modelName: string): this
  name(modelName?: string): this | string | undefined {
    if (modelName == null) return this._name
    this._name = modelName
    return this
  }

  version(): string | undefined
  version(versionString: string): this
  version(versionString?: string): this | string | undefined {
    if (versionString == null) return this._version
    this._version = versionString
    return this
  }

  schema(): ZodObject<any> | undefined
  schema(schema: ZodObject<any>): this
  schema(schema?: ZodObject<any>): this | ZodObject<any> | undefined {
    if (schema == null) return this._schema
    this._schema = schema
    return this
  }

  indexes(): DynamoIndexes | undefined
  indexes(indexes: DynamoIndexes): this
  indexes(indexes?: DynamoIndexes): this | DynamoIndexes | undefined {
    // Act as a getter
    if (indexes == null) return this._indexes

    // Make sure all indexes are expressed as arrays
    for (let index of indexes) {
      if (typeof index.partition === 'string') index.partition = [index.partition]
      if (typeof index.sort === 'string') index.sort = [index.sort]
      if (index.sort == null) index.sort = []
    }
    this._indexes = indexes
    return this
  }

  computed(tag: string): ComputeReturn
  computed(fn: ComputeFunction, options?: { tag: string }): this
  computed(o: string | ComputeFunction, options?: { tag: string }): ComputeReturn | this {
    // Return options to edit the computed function
    if (typeof o === 'string') {
      return {
        get: () => this._computed.get(o),
        set: (fn: ComputeFunction) => this._computed.set(o, fn),
        delete: () => this._computed.delete(o),
      }
    }

    // Otherwise set the computed function
    const tag = options?.tag || this._computed.size.toString()
    this._computed.set(tag, o)
    return this
  }

  connection(): TableConnection | undefined
  connection(details: TableConnection): this
  connection(details?: TableConnection): this | TableConnection | undefined {
    if (details == null) return this._connection
    this._connection = details
    return this
  }

  async put(item: object) {
    // Get the entity to push to dynamo right away for validation
    const entity = this._getEntity()

    // Run all of the computed functions, only get the old item if we compute
    const storedItem = await this.get(item)
    const oldItem = storedItem ?? {}
    const newItem = Object.assign({}, item)
    const indexes = this._indexes as DynamoIndexes
    const isNotStored = !isStoredRecordEqual({ oldItem, newItem, indexes })
    const isNew = (storedItem == null) || isNotStored
    const action = isNew ? 'create' : 'push'
    for (let fn of this._computed.values()) {
      const result = fn(item, oldItem, action)
      Object.assign(newItem, result)
    }

    // Validate the result
    if (this._schema == null) throw Error(`Can't push without a schema`)
    const parsing = this._schema.strict().safeParse(newItem)
    const parsingFailed = parsing.success == false
    if (parsingFailed) throw new Error(parsing.error.message)

    // If the item is new, put it into the database
    const { primary } = this._isolatePrimaryKey(newItem)
    const result = await entity
      .upsert(primary)
      .set(newItem)
      .go({ response: 'all_new' }) as Record<string, any>
    if (result.data == null) throw Error(`Put failed: no data returned`)
    return result.data
  }

  async list(item?: Record<string, any>, options: {
    count?: number
    limit?: number
    pages?: number | string
    cursor?: string | null
  } = {}): Promise<ListReturn> {
    // Unpack the options and validate the entity immediately
    const { count, limit, cursor } = options
    const entity = this._getEntity()

    // If nothing is provided, list everything
    const listWholeTable = item == null || Object.keys(item).length === 0
    if (listWholeTable) {
      // Scan the entire table
      const chosenCount = count ?? Infinity
      const result = await entity.scan.go({ cursor, count: chosenCount })

      // Then sort the result according to the sort key
      const sortKey = this._indexes?.[0]?.sort as string[] || []
      result.data = result.data.sort((a, b) => {
        const aSort = sortKey.map((key) => a[key]).join('')
        const bSort = sortKey.map((key) => b[key]).join('')
        if (aSort < bSort) return -1
        if (aSort > bSort) return 1
        return 0
      }).slice(0, limit)
      return result
    }

    // Make sure we have a connection
    if (this._indexes == null) throw Error(`Database indexes aren't defined`)

    // Pull by the first available index
    for (let [i, index] of this._indexes.entries()) {
      // Check that we have provided all of the partition keys for this index
      const { primary, unique } = this._isolatePrimaryKey(item, { index: i })
      const hasMissingValue = unique == false
      if (hasMissingValue) continue

      // If so, query by this index
      const { indexLabel } = this._getIndexNames(i)
      const command = entity.query[indexLabel](item as never)
      const result = await command.go({ cursor, limit, count })

      // If we have the data, return it
      if (result.data) return result
    }

    // If the data wasn't found, return an empty array
    return { data: [], cursor: null }
  }

  async get(item: Record<string, any>) {
    const result = await this.list(item, { limit: 1 })
    if (result.data.length === 0) return null
    const { data } = result
    return data[0]
  }

  async delete(item: object) {
    const entity = this._getEntity()
    const result = await entity.delete(item).go()
    return result
  }

  _getIndexNames(i: number) {
    const indexLabel = i === 0 ? `primaryQuery` : `gsi${i}Query`
    const indexName = i === 0 ? undefined : `gsi${i}`
    const pkName = i === 0 ? 'pk' : `gsi${i}pk`
    const skName = i === 0 ? 'sk' : `gsi${i}sk`
    return { indexLabel, indexName, pkName, skName }
  }

  _injectDefaultComputedValues() {
    // We need the schema to inject these computed values
    if (this._schema == null) throw Error(`Please specify your schema`)

    // Add the default id function
    const schemaHasId = schemaHasField(this._schema, 'id')
    const missingId = this._computed.has('id') == false
    if (schemaHasId && missingId) {
      this._computed.set('id', (newState, oldState, action) => {
        const needsNewId = action === 'create' && newState.id == null
        if (needsNewId) return { id: shortId() }
        return {}
      })
    }

    // Add the default date created function
    const schemaHasDateCreated = schemaHasField(this._schema, 'dateCreated')
    const missingDateCreated = this._computed.has('dateCreated') == false
    if (schemaHasDateCreated && missingDateCreated) {
      this._computed.set('dateCreated', (newState, oldState, action) => {
        const isCreation = action === 'create'
        const modifier = isCreation
          ? { dateCreated: new Date().toISOString() }
          : {}
        return modifier
      })
    }

    // Add the default date updated function
    const schemaHasDateUpdated = schemaHasField(this._schema, 'dateUpdated')
    const missingDateUpdated = this._computed.has('dateUpdated') == false
    if (schemaHasDateUpdated && missingDateUpdated) {
      this._computed.set('dateUpdated', (newState, oldState, action) => {
        const isUpdate = action !== 'get'
        const modifier = isUpdate
          ? { dateUpdated: new Date().toISOString() }
          : {}
        return modifier
      })
    }
  }

  _getEntity() {
    // Make sure we have completed the setup and memoise the entity
    if (this._name == null) throw Error(`Please name your entity`)
    if (this._schema == null) throw Error(`Please specify your schema`)
    if (this._indexes == null) throw Error(`Please specify your indexes`)
    if (this._connection == null) throw Error(`Please provide connection details`)
    if (this._entity) return this._entity

    // Make sure we have the default computed values
    this._injectDefaultComputedValues()

    // Construct the entity name and attributes
    const entityName = `${process.env.APP_NAME}:${this._name}`
    const attributes = zodToElectroAttributes(this._schema)

    // Loop through the indexes and put them in the correct format
    const indexes = Object.assign({}, ...this._indexes.map((index, i) => {
      // Construct the field names
      const { partition, sort } = index
      const { indexLabel, indexName, pkName, skName } = this._getIndexNames(i)

      // Construct the resulting object
      const indexSchema = {
        [indexLabel]: {
          ...(i === 0 ? {} : { index: indexName }),
          pk: {
            field: pkName,
            casing: 'none',
            composite: partition,
          },
          sk: {
            field: skName,
            casing: 'none',
            composite: sort,
          },
        }
      }
      return indexSchema
    }))

    // Construct the entity from this information
    if (process.env.APP_NAME == null) {
      throw Error(`APP_NAME is not defined in your environment variables`)
    }
    const entitySchema = {
      model: {
        entity: entityName,
        version: this._version,
        service: process.env.APP_NAME,
      },
      attributes,
      indexes,
    }

    // Create the entity and return it
    const isFullySpecified = this._connection?.endpoint != null
      && this._connection?.credentials != null
      && this._connection?.region != null
    const dynamodbClient = isFullySpecified
      ? new DynamoDBClient({
        endpoint: this._connection.endpoint!,
        region: this._connection.region!,
        credentials: {
          accessKeyId: this._connection.credentials!.accessKeyId,
          secretAccessKey: this._connection.credentials!.secretAccessKey,
        },
      })
      : new DynamoDBClient()
    this._entity = new Entity(entitySchema, {
      client: dynamodbClient,
      table: this._connection.name,
    })
    return this._entity
  }

  _isolatePrimaryKey(item: Record<string, any>, {
    index = 0,
  } = {}) {
    // Get the primary indexes
    const indexes = this.indexes()
    if (indexes == null) throw Error("Indexes aren't defined")
    const { partition = [], sort = [] } = indexes[index]

    // Add the partition key parts into the primary index
    const primary: Record<string, any> = {}
    const remainder: Record<string, any> = { ...item }
    for (let index of partition) {
      // All partition keys are required to uniquely identify an item
      const value = item[index]
      if (value == null) return { primary: {}, remainder: item, unique: false }

      // Add the partition key to the primary index
      primary[index] = item[index]
      delete remainder[index]
    }

    // Add in all of the sort key parts
    for (let index of sort) {
      // We don't need to include all of the sort keys
      const value = item[index]
      if (value == null) break

      // Otherwise, add the sort key to the primary index
      primary[index] = value
      delete remainder[index]
    }

    // Return the isolated result
    return { primary, remainder, unique: true }
  }
}

function isStoredRecordEqual(inputs: {
  oldItem: Record<string, any>,
  newItem: Record<string, any>,
  indexes: DynamoIndexes
}) {
  const { oldItem, newItem, indexes } = inputs
  const { partition, sort = [] } = indexes[0]
  const keys = [...partition, ...sort]
  for (let key of keys) {
    const isNewItem = newItem[key] !== oldItem[key]
    if (isNewItem) return false
  }
  return true
}
