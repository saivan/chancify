
import { expect, describe, it, beforeAll } from 'vitest'
import { ensureObjectHasFields } from "@repo/utilities/client"
import { shortId } from "@repo/utilities"
import { baseModel } from "@repo/models"
import { z } from "zod"
import { connection, initialise } from '@repo/database/testing'


describe(`Model`, () => {

  beforeAll(async () => {
    await initialise()
  })

  const ModelSchema = z.object({
    id: z.string(),
    dateCreated: z.string(),
    dateUpdated: z.string(),
    name: z.string(),
    group: z.string(),
  }).partial()
  type ModelType = z.infer<typeof ModelSchema>
  class Model extends baseModel<ModelType>({
    name: `model-${shortId()}`,
    schema: ModelSchema,
    connection,
    indexes: [
      { partition: 'id' },
      { partition: 'group', sort: 'dateCreated' },
    ],
  }) {}

  const UserSchema = z.object({
    id: z.string(),
    email: z.string(),
    dateCreated: z.string(),
    dateUpdated: z.string(),
  }).partial()
  type UserType = z.infer<typeof UserSchema>
  class User extends baseModel<UserType>({
    name: `model-${shortId()}`,
    schema: UserSchema,
    connection,
    indexes: [
      { partition: 'id' },
      { partition: 'email' },
    ],
  }) {}

  describe(`set`, () => {
    it(`sets the data of a model`, async () => {
      const model = new Model().set('name', 'john')
      expect(model.data.name).toBe('john')
    })

    it(`accepts an object as an input`, async () => {
      const model = new Model()
      model.set({ 
        name: 'john',
        group: 'friends',
      })
      expect(model.data.name).toBe('john')
      expect(model.data.group).toBe('friends')
    })
  })

  describe(`create`, () => {
    it('creates a persistent object in a database', async () => {
      // Create the model and get its id
      const name = `john-${shortId()}` 
      const item = new Model({ name })
      await item.create()
      const id = item.id()

      // Make sure it can be pulled
      const result = new Model({ id })
      await result.pull()
      expect(result.data).toStrictEqual(item.data)
    })
  })

  describe (`exists`, () => {
    it(`returns true if the model exists`, async () => {
      // Create a model
      const id = shortId()
      const item = new Model({ id, name: 'john' })
      const initiallyExists = await item.exists()
      expect(initiallyExists).toBe(false)
      await item.create()

      // Check that the model exists
      const checker = new Model({ id })
      const exists = await checker.exists()
      expect(exists).toBe(true)
    })

    it(`returns true after the model is created`, async () => {
      const item = new Model({ name: 'john' })
      await item.create()
      expect(await item.exists()).toBe(true)
    })

    it(`returns true for a unique gsi combination`, async () => {
      // Make a user
      const id = shortId()
      const email = 'john@me.com'
      const john = new User({ email, id })

      // Make sure the user doesn't exist yet
      expect(await john.exists()).toBe(false)

      // Create the user
      await john.create()
      expect(await john.exists()).toBe(true)

      // Make sure we can find the user by email
      const byEmail = new User({ email })
      expect(await byEmail.exists()).toBe(true)
    }) 

    it(`returns false if the model doesn't exist`, async () => {
      const item = new Model({ name: 'does-not-exist' })
      expect(await item.exists()).toBe(false)
    })

    it(`returns false if the model is missing a primary key`, async () => {
      // Create a model
      const item = new Model({ name: 'john' })
      await item.create()

      // MAke sure that a copy without the same primary key doesn't exist
      const tester = new Model({ name: 'john' })
      expect(await tester.exists()).toBe(false)
    })
  })

  describe(`push`, () => {
    it(`refuses to push without an id`, async () => {
      const model = new Model()
      await expect(async () => {
        await model.push()
      }).rejects.toThrow()
    })

    it(`can update an existing model`, async () => {
      // Make a model
      const item = new Model({ name: 'john' })
      await item.create()
      const id = item.id()

      // Update the model
      const pusher = new Model({ id })
      Object.assign(pusher.data, { name: 'james' })
      await pusher.push()

      // Check that the old model has updated
      await item.pull()
      expect(item.data).toStrictEqual(pusher.data)
      expect(item.data.name).toBe('james')
    })

    it(`can update an existing model with a sort key`, async () => {
      // Make a user by email
      const email = 'test@user.com'
      const firstUser = new User({ email })
      await firstUser.create()
      const id = firstUser.id()

      // Get the user by email
      const getByEmailUser = new User({ email })
      await getByEmailUser.pull()
      expect(getByEmailUser.data.email).toBe(email)
      expect(getByEmailUser.data.id).toBe(id)

      // Try to push the user with a different id
      const invalidUser = new User({ email, id: 'different-id' })
      await expect(async () => {
        await invalidUser.push()
      }).rejects.toThrow(`Item not found in the database`)
    })

    it(`errors if the model doesn't exist`, async () => {
      await expect(async () => {
        const item = new Model({ name: 'does-not-exist' })
        await item.push()
      }).rejects.toThrow(`No id is defined for this item`)
    })

    it(`can force a push`, async () => {
      const item = new Model({ name: 'does-not-exist' })
      await item.push({ force: true })
      expect(item.data.name).toBe('does-not-exist')
      expect(item.data.id).not.toBeUndefined()
    })

    it(`can partially update an existing model`, async () => {
      // Make a model
      const item = new Model({ name: 'john' })
      await item.create()
      expect (item.data.name).toEqual('john')
      expect (item.data.group).toBeUndefined()
      const id = item.id()

      // Update the model
      const pusher = new Model({ id })
      pusher.set({ group: 'swimming' })
      expect (pusher.data.name).toBeUndefined()
      expect (pusher.data.group).toEqual('swimming')
      await pusher.push()

      // Check that the database model has everything we expect
      const puller = new Model({ id })
      await puller.pull()
      expect(puller.data.name).toBe('john')
      expect(puller.data.group).toBe('swimming')

      // Check that the old model can update
      await item.pull()
      expect(item.data).toStrictEqual(pusher.data)
      expect(item.data.name).toBe('john')
    })
  })

  describe(`extending`, () => {
    it(`can be extended`, async () => {
      // Make a schema
      const RecordSchema = z.object({
        id: z.string(),
        dateCreated: z.string(),
        dateUpdated: z.string(),
        name: z.string(),
        artist: z.string(),
        releaseDate: z.string(),
      }).partial()
      type RecordType = z.infer<typeof RecordSchema>

      // Make a model from the schema
      class Record extends baseModel<RecordType>({
        name: 'record',
        schema: RecordSchema,
        indexes: [{ partition: 'id' }],
        connection,
      }) {
        async create () {
          ensureObjectHasFields(this.data, ['name', 'artist', 'releaseDate'])
          await super.create()
          return this
        }
      }

      // Create a record
      const record = new Record({ 
        name: 'Thriller', 
        artist: 'Michael Jackson', 
        releaseDate: new Date('1982-12-01').toISOString(),
      })
      await record.create()

      // Make sure we can get it
      const id = record.id()
      const result = new Record({ id })
      await result.pull()
      expect(result.data).toStrictEqual(record.data)
    })

    it(`needs id, dateCreated and dateUpdated in the schema`, async () => {
      // Make a schema
      const RecordSchema = z.object({
        name: z.string().optional(),
        artist: z.string().optional(),
        releaseDate: z.string().optional(),
      }).partial()
      type RecordType = z.infer<typeof RecordSchema>

      // Make sure we can't create a record because of the missing fields
      await expect(async () => {
        // Make a model from the schema
        // @ts-ignore - This is done on purpose to check the error
        class Record extends baseModel<RecordType>({
          name: 'record',
          schema: RecordSchema,
          indexes: [{ partition: 'name' }],
          connection,
        }) {
          async create () {
            ensureObjectHasFields(this.data, ['name', 'artist', 'releaseDate'])
            await super.create()
            return this
          }
        }
      }).rejects.toThrow(/Schema is missing id, dateCreated, dateUpdated/)
    })
  })

  describe(`list`, () => {

    it(`can list items`, async () => {
      // Create three models
      const group = `friends-${shortId()}`
      const names = ['john', 'james', 'jeremy']
      for (let name of names) {
        await new Model({ group, name }).create()
      }

      // List the models
      const { items } = await Model.list({ group })
      for (let [i, item] of items.entries()) {
        // Make sure we have the right name and group
        expect(item.data.group).toBe(group)
        expect(item.data.name).toBe(names[i])

        // Make sure the fields are defined
        expect(item.data.id).not.toBeUndefined()
        expect(item.data.dateCreated).not.toBeUndefined()
        expect(item.data.dateUpdated).not.toBeUndefined()
      }
    })

    it(`can list items in descending order`, async () => {
      // Create three models
      const group = `friends-${shortId()}`
      const names = ['john', 'james', 'jeremy']
      for (let name of names) {
        await new Model({ group, name }).create()
      }

      // List the models
      const { items } = await Model.list({ group }, { descending: true })
      expect(items.length).toBe(3)
      expect(items.map(item => item.data.name)).toEqual(names.reverse())
      expect(items.map(item => item.data.group)).toEqual([group, group, group])
    })
  })
})

