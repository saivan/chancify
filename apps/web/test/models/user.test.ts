
import { expect, describe, it, } from 'vitest'
// import { shortId } from "@repo/utilities"
// import { User } from "@/models/user"


describe (`User`, () => {

  describe(`create`, () => {

    it ('is currently not working', () => {
      expect(true).toBe(false)
    })

    // it(`can create a simple user`, async () => {
    //   const id = shortId()
    //   const jeremy = new User({ 
    //     name: `jeremy-${id}`,
    //     email: `jeremy-${id}@me.com`,
    //   })
    //   await jeremy.create()
    // })

    // it(`requires an email`, async () => {
    //   const id = shortId()
    //   const description = { 
    //     name: `jeremy-${id}`,
    //   }
    //   const jeremy = new User(description)
    //   await expect(async () => {
    //     await jeremy.create()
    //   }).rejects.toThrow(`Email address required`)
    // })

    // it(`allows querying by email`, async () => {
    //   // Make a user named jeremy
    //   const id = shortId()
    //   const email = `jeremy-${id}@me.com`
    //   const name =  `jeremy-${id}`
    //   const jeremy = new User({ email, name })
    //   await jeremy.create()

    //   // Get them by their email
    //   const person = new User({ email })
    //   await person.pull()
    //   expect(person.data).toStrictEqual(jeremy.data)
    // })
  })
})
