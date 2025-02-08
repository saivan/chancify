
import { expect, describe, it, beforeAll } from 'vitest'
import { DynamoDB, TableConnection } from "@repo/database"
import { shortId } from "@repo/utilities"
import { z } from "zod"
import { initialise, connection } from './setup'


describe (`dynamo`, () => {

  beforeAll(async () => {
    await initialise()
  })

  describe(`constructing`, () => {
    it (`handles a simple zod schema`, () => {
      const UserSchema = z.object({
        id: z.number().positive().int(),
        name: z.string(), 
        email: z.string().email(), 
        age: z.number().min(0).optional(),
        dateUpdated: z.date(),
        dateCreated: z.date(),
      })
      expect(() => {
        new DynamoDB()
          .name('user')
          .schema(UserSchema)
          .connection(connection)
          .indexes([
            { partition: 'id' },
            { partition: 'name', sort: 'dateCreated' },
            { partition: 'age', sort: ['name', 'email']},
          ])
      }).not.toThrow()
    })

    it (`handles a zod schema with a nested object`, () => {
      const NestedSchema = z.object({
        id: z.number().positive().int(),
        name: z.string(),
        age: z.number(),
        address: z.object({
          street: z.string(),
          city: z.string(),
          country: z.string(),
          coordinates: z.object({
            latitude: z.number(),
            longitude: z.number(),
          }),
        }),
      })
      expect(() => {
        new DynamoDB()
          .connection(connection)
          .schema(NestedSchema)
          .name('nested')
          .indexes([{ partition: 'id' }])
      }).not.toThrow()
    })

    it (`handles a zod schema with a list`, () => {
      // Define a schema with a list of numbers and an enum
      const ListSchema = z.object({
        id: z.number().positive().int(),
        numberList: z.array(z.number()), 
        favoriteColor: z.enum(['Red', 'Green', 'Blue']),
      })
      expect(() => {
        new DynamoDB()
          .connection(connection)
          .schema(ListSchema)
          .name('list')
          .indexes([
            { partition: 'id' },
          ])
      }).not.toThrow()
    })
  })

  describe(`put`, () => {
    it(`refuses to write invalid data`, async () => {
      // Make a schema
      const simpleSchema = z.object({
        id: z.number(),
        color: z.enum(['red', 'green', 'blue'])
      })
      const dynamo = new DynamoDB()
        .connection(connection)
        .schema(simpleSchema)
        .name('simple')
        .indexes([{ partition: 'id' }])

      // Try to write something invalid
      await expect(async () => {
        await dynamo.put({ 
          id: 6,
          color: 'orange',
        })
      }).rejects.toThrow()
    })

    it(`errors if extra values are provided`, async () => {
      // Create a schema that only handles a string
      const dynamo = new DynamoDB()
        .name('errorCheck')
        .connection(connection)
        .schema(z.object({ name: z.string() }))
        .indexes([{ partition: 'name' }])

      // Try to write something with an extra value (age: 5)
      await expect(async () => {
        await dynamo.put({ name: 'john', age: 5 })
      }).rejects.toThrow()
    })

    it(`returns the result of the put operation`, async () => {
      const schema = z.object({ id: z.string(), name: z.string() })
      const dynamo = new DynamoDB()
        .schema(schema)
        .name('put-result')
        .connection(connection)
        .indexes([{ partition: 'id' }])

      // Put something and check the result
      const id = shortId()
      const input ={ id, name: 'john' } 
      const result = await dynamo.put(input)
      expect(result).toStrictEqual(input)
    })

    it(`can be used to update a subset of the data`, async () => {
      const schema = z.object({ 
        id: z.string(), 
        name: z.string().optional(),
        age: z.number().optional(),
      })
      const dynamo = new DynamoDB()
        .schema(schema)
        .name('put-result')
        .connection(connection)
        .indexes([{ partition: 'id' }])

      // Put something and check the result
      const id = shortId()
      const firstInput = { id, name: 'john', age: 5 } 
      const firstResult = await dynamo.put(firstInput)
      expect(firstResult).toStrictEqual(firstInput)

      // Update the item and check the result
      const secondResult = await dynamo.put({ id, name: 'jane' })
      expect(secondResult).toStrictEqual({ id, name: 'jane', age: 5 })
    })

    it(`can update with just a partition key`, async () => {
      const schema = z.object({ 
        id: z.string().optional(),
        name: z.string().optional(),
        email: z.string().optional(),
      })
      const dynamo = new DynamoDB()
        .schema(schema)
        .name('partition-result')
        .connection(connection)
        .indexes([
          { partition: 'id' },
          { partition: 'name' },
        ])

      // Put something and check the result
      const id = shortId()
      const input = { id, name: 'john', email: 'john@hi.com' }
      await dynamo.put(input)
      const result = await dynamo.get({ id })
      expect(result).toStrictEqual(input)

      // Try changing the email by id
      const updates = { id, email: 'johnny@hello.co' }
      await dynamo.put(updates)
      const secondResult = await dynamo.get({ id })
      expect(secondResult).toStrictEqual({...input, ...updates})  

      // Try changing the email by id
      const nextUpdates = { id, name: 'frankie' }
      await dynamo.put(nextUpdates)
      const thirdResult = await dynamo.get({ id })
      expect(thirdResult).toStrictEqual({...input, ...updates, ...nextUpdates})  
    })

    it(`can push any data type`, async () => {
      const schema = z.object({
        id: z.string(),
        string: z.string(),
        number: z.number(),
        boolean: z.boolean(),
        enum: z.enum(['red', 'green', 'blue']),
        optional: z.string().optional(),
        nested: z.object({
          a: z.string(),
          b: z.number(),
          c: z.boolean(),
          d: z.enum(['red', 'green', 'blue']),
        }),
        list: z.array(z.string()),
      })
      const dynamo = new DynamoDB()
        .schema(schema)
        .name('push-all')
        .connection(connection)
        .indexes([{ partition: 'id' }])

      // Push a bunch of different data types
      const id = shortId()
      const data = {
        id,
        string: 'hello',
        number: 5,
        boolean: true,
        enum: 'red',
        optional: 'hi',
        nested: { a: 'a', b: 5, c: true, d: 'green' },
        list: ['a', 'b', 'c'],
      }
      await dynamo.put(data)

      // Check that the data was stored correctly
      const result = await dynamo.get({ id })
      expect(result).toStrictEqual(data)
    })

    it(`can store lists of objects`, async () => {
      const schema = z.object({
        id: z.string(),
        nest: z.array(z.object({
          a: z.string(),
          b: z.number(),
          c: z.boolean(),
          d: z.enum(['red', 'green', 'blue']),
        })),
      })
      const dynamo = new DynamoDB()
        .schema(schema)
        .name('list-of-objects')
        .connection(connection)
        .indexes([{ partition: 'id' }])

      // Push the nested data
      const id = shortId()
      const data = {
        id,
        nest: [
          { a: 'a', b: 5, c: true, d: 'green' },
          { a: 'b', b: 6, c: false, d: 'red' },
          { a: 'c', b: 7, c: true, d: 'blue' },
        ]
      }
      await dynamo.put(data)

      // Fetch the data and check that it matches
      const result = await dynamo.get({ id })
      expect(result).toStrictEqual(data)
    })
  })

  describe(`get`, () => {
    it(`reads and writes from dynamodb successfully`, async () => {
      // Make the schema
      const FullSchema = z.object({
        id: z.number().positive().int(),
        address: z.string(),
        stringList: z.array(z.string()),
        color: z.enum(['orange', 'purple', 'blue']),
        nested: z.object({
          food: z.string(),
          number: z.number(),
          nest: z.optional(z.object({
            a: z.string(),
          }))
        })
      })

      // Write a test item 
      const dynamo = new DynamoDB()
        .schema(FullSchema)
        .name('fullSchema')
        .connection(connection)
        .indexes([{ partition: 'id' }])
      const item = {
        id: 5,
        address: 'home',
        stringList: ['a', 'b', 'c'],
        color: 'blue',
        nested: {
          food: 'ketchup',
          number: 6,
          nest: { a: 'correct' }
        }
      }
      await dynamo.put(item)

      // Then read the same item and make sure it matches
      const result = await dynamo.get({ id: 5 })
      expect(result).toStrictEqual(item)
    })

    it(`can overwrite data`, async () => {
      // Write an item
      const schema = z.object({ id: z.number(), name: z.string() })
      const dynamo = new DynamoDB()
        .name('overwrite')
        .schema(schema)
        .connection(connection)
        .indexes([{ partition: 'id', sort: 'id' }])
      await dynamo.put({ id: 1, name: 'john' })
      const startResult = await dynamo.get({ id: 1 })
      if (startResult == null) throw Error(`Failed to get the initial result`)
      expect(startResult.name).toBe('john')

      // Overwrite the item
      await dynamo.put({ id: 1, name: 'james' })
      const endResult = await dynamo.get({ id: 1 })
      if (endResult == null) throw Error(`Failed to get the final result`)
      expect(endResult.name).toBe('james')
    })

    it(`handles multiple schemas at once`, async () => {
      // Write the first schema
      const schemaOne = z.object({ name: z.string(), age: z.number() })
      const dynamoOne = new DynamoDB()
        .name('one')
        .schema(schemaOne)
        .connection(connection)
        .indexes([{ partition: 'name' }])
      const fred = { name: 'fred', age: 10 }
      await dynamoOne.put(fred)

      // Write the second schema
      const schemaTwo = z.object({ name: z.string(), age: z.number() })
      const dynamoTwo = new DynamoDB()
        .name('two')
        .schema(schemaTwo)
        .connection(connection)
        .indexes([{ partition: 'name' }])
      const john = { name: 'john', age: 5 } 
      await dynamoTwo.put(john)

      // Make sure they can read their own data
      expect(await dynamoOne.get({ name: 'fred' })).toStrictEqual(fred)
      expect(await dynamoTwo.get({ name: 'john' })).toStrictEqual(john)

      // Make sure they can't read each other's data
      expect(await dynamoOne.get({ name: 'john' })).toBeNull()
      expect(await dynamoTwo.get({ name: 'fred' })).toBeNull()
    })

    it(`can read and write into a gsi`, async () => {
      // Make a database with GSIs
      const schema = z.object({
        name: z.string(),
        id: z.number(),
        age: z.number(),
      })
      const dynamo = new DynamoDB()
        .name('gsiWriter')
        .connection(connection)
        .schema(schema)
        .indexes([
          { partition: 'name' },
          { partition: 'id' },
        ])

      // Write some data into the database and populate the gsi
      const james = { name: 'james', id: 6, age: 32 }
      await dynamo.put(james)

      // Check that the result is correct
      const idResult = await dynamo.get({ id: 6 })
      expect(idResult).toStrictEqual(james)

      // Check that the gsi is correct
      const nameResult = await dynamo.get({ name: 'james' })
      expect(nameResult).toStrictEqual(james)
    })

    it(`handles gsi composite partition keys`, async () => {
      // Make a database with GSIs
      const schema = z.object({
        name: z.string(),
        id: z.number(),
        age: z.number(),
        address: z.string(),
      })
      const dynamo = new DynamoDB()
        .name('gsiWriter')
        .connection(connection)
        .schema(schema)
        .indexes([
          { partition: 'name' },
          { partition: ['id', 'age'] },
        ])

      // Write some data into the database and populate the gsi
      const james = { 
        name: 'james', 
        address: '3 Terrace St Sunny Boulevard',
        id: 6, 
        age: 32,
      }
      await dynamo.put(james)

      // Check that the result is correct
      const result = await dynamo.get({ id: 6, age: 32 })
      expect(result).toStrictEqual(james)
    })

    it(`handles gsi composite sort keys`, async () => {
        // Make a database with GSIs
        const schema = z.object({
          name: z.string(),
          id: z.number(),
          age: z.number(),
          color: z.enum(['red', 'green', 'blue']),
          address: z.string(),
        })
        const dynamo = new DynamoDB()
          .name('gsiWriter')
          .connection(connection)
          .schema(schema)
          .indexes([
            { partition: 'name' },
            { partition: 'id', sort: ['color', 'age'] },
          ])
  
        // Write some data into the database and populate the gsi
        const james = { 
          name: 'james', 
          address: '3 Terrace St Sunny Boulevard',
          color: 'blue',
          id: 6, 
          age: 32,
        }
        await dynamo.put(james)
  
        // Check that the result is correct
        const result = await dynamo.get({ id: 6, color: 'blue' })
        expect(result).toStrictEqual(james)
    })
  })

  describe(`computed`, () => {

    function setupDynamo (name: string) {
      const schema = z.object({
        id: z.string(),
        string: z.string(),
        number: z.number(),
        dateCreated: z.string(),
        dateUpdated: z.string(),
      }).partial()
      return new DynamoDB()
        .name(name)
        .schema(schema)
        .connection(connection)
        .indexes([
          { partition: 'id', sort: 'id' }, 
          { partition: 'string', sort: 'id' },
        ])
    }

    it (`computes static values on push`, async () => {
      const id = shortId()
      const dynamo = setupDynamo('computed-static-test')
      dynamo.computed(() => ({ number: 5 }))
      await dynamo.put({ id, string: 'john' })
      const result = await dynamo.get({ id })
      if (result == null) throw Error(`Failed to get the result`)
      expect(result.number).toBe(5)
    })

    it (`overrides user provided values`, async () => {
      const dynamo = setupDynamo('computed-override-test')
      dynamo.computed(() => ({ number: 5 }))
      const id = shortId()
      await dynamo.put({ id, number: 100 })
      const result = await dynamo.get({ id })
      if (result == null) throw Error(`Failed to get the result`)
      expect(result.number).toBe(5)
    })

    it (`computes dynamic values on push`, async () => {
      const dynamo = setupDynamo('computed-dynamic-test')
      dynamo.computed(({ number, string }, oldState) => ({ 
        number: number ? number + 5 : oldState.number,
        string: string ? `${string}-${string}` : "hi",
      }))

      // Make sure the computed function is working
      const id = shortId()
      await dynamo.put({ id, number: 100 })
      const result = await dynamo.get({ id })
      if (result == null) throw Error(`Failed to get the result`)
      delete result.dateCreated
      delete result.dateUpdated
      expect(result).toStrictEqual({ id, number: 105, string: 'hi' })

      // Make sure the computed function is working with a new state
      await dynamo.put({ id, string: 'hello' })
      const result2 = await dynamo.get({ id })
      if (result2 == null) throw Error(`Failed to get the second result`)
      delete result2.dateCreated
      delete result2.dateUpdated
      expect(result2).toStrictEqual({ id, number: 105, string: 'hello-hello' })
    })

    it (`fetches the latest values when computing`, async () => {
      // Push something
      const id = shortId()
      const dynamo = setupDynamo('computed-fetch-test')
      await dynamo.put({ id, number: 6, string: 'hi' })

      // Make a computed function and make sure it works
      dynamo.computed((newState, oldState) => {
        expect(newState.id).toBe(id)
        expect(newState.number).toBeUndefined()
        expect(newState.string).toBeUndefined()
        expect(oldState.id).toBe(id)
        expect(oldState.number).toBe(6)
        expect(oldState.string).toBe('hi')
        return {}
      })
      await dynamo.put({ id })
    })

    it (`computes dateCreated and dateUpdated automatically`, async () => {
      const id = shortId()
      const dynamo = setupDynamo('computed-date-test')
      await dynamo.put({ id })
      const result = await dynamo.get({ id })
      if (result == null) throw Error("Couldn't get the result")
      const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-]\d{2}:\d{2}))?$/;
      expect(result.id).toBe(id)
      expect(result.dateCreated).toMatch(isoDatePattern)
      expect(result.dateUpdated).toMatch(isoDatePattern)
    })

    it (`computes id automatically if it's not provided`, async () => {
      // Make sure we get back the id
      const dynamo = setupDynamo('computed-date-test')
      const string = "hi there"
      const putResult = await dynamo.put({ string })
      const { id } = putResult
      expect(putResult.id).toBeDefined()

      // Make another one and check that we get a different id
      const putResult2 = await dynamo.put({ string })
      expect(putResult2.id).not.toEqual(id)

      // Check that we can get the same id
      const result = await dynamo.get({ id })
      if (result == null) throw Error("Couldn't get the result")
      expect(result.id).toEqual(id)
      expect(result.string).toEqual(string)
    })

    function sleep (ms: number) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
    }

    it (`doesn't pull values from other models when computing`, async () => {
      // Put the same item twice
      const dynamo = setupDynamo('computed-date-test')
      const item = { string: "hi there" }
      const firstPutResult = await dynamo.put(item)
      await sleep(400)
      const secondPutResult = await dynamo.put(item)

      // Make sure none of the parameters match
      expect(firstPutResult.id).not.toEqual(secondPutResult.id)
      expect(firstPutResult.dateCreated).not.toEqual(secondPutResult.dateCreated)
      expect(firstPutResult.dateUpdated).not.toEqual(secondPutResult.dateUpdated)
    })

    it (`ignores dates if they don't exist in the schema`, async () => {
      const schema = z.object({
        id: z.number(),
        string: z.string().optional(),
      })
      const dynamo = new DynamoDB()
        .name('ignored-date-test')
        .schema(schema)
        .connection(connection)
        .indexes([{ partition: 'id' }])
      await dynamo.put({ id: 5 })
      const result = await dynamo.get({ id: 5 })
      if (result == null) throw Error("Couldn't get the result")
      expect(result.id).toBe(5)
      expect(result.dateCreated).toBeUndefined()
      expect(result.dateUpdated).toBeUndefined()
    })

    it(`allows the tag syntax to create computed functions`, async () => {
      const dynamo = setupDynamo('computed-replace-test')
      dynamo.computed('my-tag').set(() => ({ number: 5 }))
      const id = shortId()
      await dynamo.put({ id, string: 'john', number: 100 })
      const result = await dynamo.get({ id })
      if (result == null) throw Error(`Failed to get the result`)
      expect(result.number).toBe(5)
    })

    it (`allows a computed function to be replaced with tags`, async () => {
      // Use the first computed function
      const dynamo = setupDynamo('computed-replace-test')
      const id = shortId()
      dynamo.computed(() => ({ number: 5 }), { tag: 'my-tag' })
      await dynamo.put({ id, string: 'john', number: 100 })
      const result = await dynamo.get({ id })
      if (result == null) throw Error(`Failed to get the result`)
      expect(result.number).toBe(5)

      // Use a new computed function
      dynamo.computed('my-tag').set(() => ({ number: 34 }))
      await dynamo.put({ id, string: 'john', number: 100 })
      const result2 = await dynamo.get({ id })
      if (result2 == null) throw Error(`Failed to get the result`)
      expect(result2.number).toBe(34)
    })

    it (`allows a computed function to be deleted with tags`, async () => {
      // Have a computed function that returns 5
      const id = shortId()
      const dynamo = setupDynamo('computed-delete-test')
      dynamo.computed(() => ({ number: 5 }), { tag: 'my-tag' })
      await dynamo.put({ id, string: 'john', number: 100 })
      const result = await dynamo.get({ id })
      if (result == null) throw Error(`Failed to get the result`)
      expect(result.number).toBe(5)

      // Remove the computed function
      dynamo.computed('my-tag').delete()
      await dynamo.put({ id, string: 'john', number: 50 })
      const unComputedResult = await dynamo.get({ id })
      if (unComputedResult == null) throw Error(`Failed to get the result`)
      expect(unComputedResult.number).toBe(50)
    })
  })

  describe(`list`, () => {

    const schema = z.object({
      id: z.number(),
      name: z.string(),
      school: z.string(),
    })
    const dynamo = new DynamoDB()
      .name('list-simple')
      .connection(connection)
      .schema(schema)
      .indexes([
        { partition: 'id', sort: 'id' }, 
        { partition: 'school', sort: 'id' },
      ])

    async function addFivePeople () {
      await dynamo.put({ id: 1, name: 'john', school: "ash" })
      await dynamo.put({ id: 2, name: 'jane', school: "ash" })
      await dynamo.put({ id: 3, name: 'james', school: "ash" })
      await dynamo.put({ id: 4, name: 'jim', school: "free" })
      await dynamo.put({ id: 5, name: 'jimmy', school: "free" })
    }

    it(`can list all items in a table`, async () => {
      await addFivePeople()
      const result = await dynamo.list({ school: "ash" }) 
      if (result == null) throw Error(`Result is null`)
      expect(result.data.length).toBe(3)
      expect(result.data[1].name).toBe('jane')
    })

    it(`can list all items in a table with a limit`, async () => {
      await addFivePeople()
      const result = await dynamo.list({ school: "ash" }, { limit: 2 })
      if (result == null) throw Error(`No data was returned`)
      expect(result.data.length).toBe(2)
    })

    async function addPeople (school: string, start: number, end: number) {
      for (let id = start; id < end; id++) {
        await dynamo.put({ 
          id,
          name: 'a'.repeat(16000), // Make it large to force pagination
          school 
        })
      }
    }

    it(`automatically paginates to reach the count`, async () => {
      // Do the first 10 students
      const school = `paginate-high-${Math.random()}`
      await addPeople(school, 0, 40)
      const result1 = await dynamo.list({ school }, {
        count: 85,
      })
      expect(result1?.data.length).toBe(40)

      // Do the next 55 students
      await addPeople(school, 40, 85)
      const result2 = await dynamo.list({ school }, {
        count: 85,
      })
      expect(result2?.data.length).toBe(85)

      // Get to 100 and check the pagination still works
      await addPeople(school, 85, 100)
      const result3 = await dynamo.list({ school }, {
        count: 95,
      })
      if (result3 == null) throw Error("Failed on the last group")
      expect(result3.data.length).toBe(95)

      // Make sure we had to paginate
      const result4 = await dynamo.list({ school })
      const noPagination = !(result4?.data.length < result3.data.length)
      if (noPagination) throw new Error(`This test didn't need to paginate`)

      // Make sure we don't return more items than the table has
      await addPeople(school, 85, 100)
      const result5 = await dynamo.list({ school }, {
        count: 300
      })
      if (result5 == null) throw Error("Failed on the last group")
      expect(result5.data.length).toBe(100)
    })

    it(`allows for cursor pagination`, async () => {
      // Add lots of students
      for (let id = 10; id < 110; id++) {
        await dynamo.put({ 
          id, 
          name: `a`.repeat(20000), // Make it large to force pagination
          school: "clone-high" 
        })
      }

      // Get the first batch of students
      const result1 = await dynamo.list({ school: 'clone-high' })
      if (result1 == null) throw Error("failed to get the list of clones")
      expect(result1.data.length).toBeLessThan(95)

      // Get the second batch of students
      const result2 = await dynamo.list({ school: 'clone-high' }, {
        cursor: result1.cursor,
      })
      if (result2 == null) throw Error("failed to get the second list of clones")
      const lastFrom1 = result1.data.slice(-1)[0]
      const firstFrom2 = result2.data[0]
      expect(lastFrom1.id + 1).toBe(firstFrom2.id)

      // Make sure the pagination size is correct
      expect(result1.data.length).toBeLessThan(95)
      expect(result1.data.length + result2.data.length).toEqual(100)
    })

    async function dynamoList (name: string) {
      // Make the database schema
      const schema = z.object({
        id: z.number(),
        string: z.string().optional(),
        dateCreated: z.string().optional(),
      })
      const dynamo = new DynamoDB()
        .name(name)
        .schema(schema)
        .connection(connection)
        .indexes([
          { partition: 'id', sort: 'id' }, 
          { partition: 'string', sort: 'dateCreated' },
        ])

      // Put the items in the database
      const items = new Array(10)
        .fill(0)
        .map((_, i) => ({ id: i, string: `string-${i}` }))
      for (const item of items) {
        const result = await dynamo.put(item)
      }
      return { items, dynamo }
    }

    it(`can be used to list all items`, async () => {
      const { dynamo, items } = await dynamoList(`list-all-${Math.random()}`)
      const result = await dynamo.list()
      if (result == null) throw Error(`Result is null`)
      for (let item of result.data) {
        delete item.dateCreated
      }
      expect(result.data).toEqual(items)
    })

    it(`can be used to list all items with a limit`, async () => {
      const { dynamo, items } = await dynamoList(`list-limit-${Math.random()}`)
      const result = await dynamo.list({}, { limit: 3 })
      if (result == null) throw Error(`Result is null`)
      for (let item of result.data) {
        delete item.dateCreated
      }
      expect(result.data).toEqual(items.slice(0, 3))
    })

    it(`correctly returns an empty list if all keys don't match`, async () => {
      // Make the database
      const schema = z.object({ 
        id: z.number(), 
        name: z.string(),
        club: z.string(),
        group: z.string(),
        dateCreated: z.string(),
      }).partial()
      const dynamo = new DynamoDB()
        .name('empty-list-test')
        .connection(connection)
        .schema(schema)
        .indexes([
          { partition: 'id' },
          { partition: ['club', 'group'], sort: 'dateCreated' },
          { partition: 'club', sort: 'dateCreated' },
        ])
      
      // Add a few entries
      const values = [
        { id: 1, name: 'john', club: 'gym', group: 'yoga' },
        { id: 2, name: 'jane', club: 'gym', group: 'pilates' },
        { id: 3, name: 'jim', club: 'gym', group: 'yoga' },
      ]
      for (let value of values) {
        await dynamo.put(value)
      }

      // Make sure we get an empty list
      const result = await dynamo.list({ club: 'gym', group: 'calisthenics' })
      expect(result.data.length).toBe(0)
      expect(result.cursor).toBeNull()
    })

  })

  describe(`delete`, () => {
    let dynamo: any = undefined
    beforeAll(() => {
      dynamo = new DynamoDB()
        .name('delete-simple')
        .connection(connection)
        .schema(z.object({
          id: z.string(),
          name: z.string(),
        }))
        .indexes([{ partition: 'id' }])
    })

    it(`deletes by the partition key`, async () => {
      // Store the item and check that it exists
      const item = { id: 'abc', name: 'john' }
      await dynamo.put(item)
      const result = await dynamo.get({ id: 'abc' })
      expect(result).toStrictEqual(item)

      // Make sure we can't get the item
      await dynamo.delete({ id: 'abc' })
      const deletedResult = await dynamo.get({ id: 'abc' })
      expect(deletedResult).toBeNull()
    })
    
    it(`fails on any other key`, async () => {
      // Store the item and check that it exists
      const item = { id: 'abc', name: 'john' }
      await dynamo.put(item)
      const result = await dynamo.get({ id: 'abc' })
      expect(result).toStrictEqual(item)

      // Make sure we can't get the item
      expect(async () => {
        await dynamo.delete({ name: 'john' })
      }).rejects.toThrow()
    })
  })

  describe(`use patterns`, () => {

    function stripMetadata (data: any) {
      delete data.id
      delete data.dateCreated
      delete data.dateUpdated
      return data
    }

    it (`can be used to create a two way linked table`, async () => {
      // Define a two way linked schema and database
      const Memberships = z.object({
        id: z.string(),
        chain: z.string(),
        customerId: z.string(),
        storeId: z.string(),
        price: z.number(),
        dateCreated: z.string(),
        dateUpdated: z.string(),
      }).partial()
      const dynamo = new DynamoDB()
        .name('two-way-link-test')
        .schema(Memberships)
        .connection(connection)
        .indexes([
          { partition: 'id' },
          { partition: ['chain', 'customerId'], sort: 'dateCreated' },
          { partition: ['chain', 'storeId'], sort: 'dateCreated' },
          { partition: 'chain', sort: 'dateCreated' },
        ])

      // Create a few memberships
      const chain = `fitness-club-${shortId()}`
      const memberships = [
        { chain, customerId: 'john', storeId: 'Maryland', price: 50 },
        { chain, customerId: 'john', storeId: 'Baltimore', price: 30 },
        { chain, customerId: 'jenny', storeId: 'Baltimore', price: 40 },
        { chain, customerId: 'josh', storeId: 'Baltimore', price: 40 },
        { chain, customerId: 'john', storeId: 'Phoenix', price: 30 },
      ]
      for (let membership of memberships) {
        await dynamo.put(membership)
      }

      // Get all the memberships for a chain
      const chainMemberships = await dynamo.list({ chain })
      expect(chainMemberships.data.length).toBe(5)

      // Get all the memberships for a customer
      const johnMemberships = await dynamo.list({ chain, customerId: 'john' })
      expect(johnMemberships.data.map(stripMetadata)).toEqual([
        memberships[0], memberships[1], memberships[4]
      ])
      
      const jennyMemberships = await dynamo.list({ chain, customerId: 'jenny' })
      expect(jennyMemberships.data.map(stripMetadata)).toEqual([ memberships[2] ])

      // Get all the memberships for a store
      const baltimoreMemberships = await dynamo.list({ chain, storeId: 'Baltimore' })
      expect(baltimoreMemberships.data.map(stripMetadata)).toEqual([
        memberships[1], memberships[2], memberships[3]
      ])
    })

  })
})
